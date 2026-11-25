#!/usr/bin/env node
/**
 * plas check — validador del formato de presentaciones PLaS (docs/03 §8.3).
 *
 * Uso:
 *   plas-check <slides.md> [--render] [--json]
 *
 *   --render  además abre cada diapositiva (web e impresión) en Chrome y mide
 *             desbordes y títulos en varias líneas. Requiere `slidev build` previo
 *             (lee <carpeta de slides.md>/dist).
 *   --json    salida en JSON (para agentes y CI).
 *
 * Código de salida: 1 si hay errores, 0 si solo hay avisos o nada.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { parseSync } from '@slidev/parser'
import { findBrowser } from '../utils/browser.mjs'
import { FIGURE_LIMITS, figureErrors, similarFigures } from '../utils/figureRules.mjs'

// Maquetas (docs/11). Estructurales: marcan el recorrido. De contenido: la biblioteca de tipologías.
const STRUCTURE_LAYOUTS = ['cover', 'agenda', 'section', 'closing']
const CONTENT_LAYOUTS = ['default', 'two-cols', 'image-text', 'image', 'gallery', 'table', 'statement', 'quote', 'team', 'code', 'interactive']
const IMAGE_LAYOUTS = ['image-text', 'image', 'gallery']
const LAYOUTS = [...STRUCTURE_LAYOUTS, ...CONTENT_LAYOUTS]
const LINES = ['lenguajes', 'educacion', 'embebidos', 'transporte', 'sensado', 'plas'] // plas: color de la marca
// Figuras de referencia que no se pueden copiar ni retocar: los ejemplos de la guía
// y las de las presentaciones del repositorio (poc, showcase, ejemplos/*).
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..')
function referenceFigures(self) {
  const refs = Object.entries(JSON.parse(fs.readFileSync(new URL('../utils/figureExamples.json', import.meta.url), 'utf8')))
    .map(([name, fig]) => ({ fig, from: `del ejemplo "${name}" de la guía` }))
  const decks = ['poc', 'showcase', ...(fs.existsSync(path.join(REPO, 'ejemplos')) ? fs.readdirSync(path.join(REPO, 'ejemplos')).map(d => `ejemplos/${d}`) : [])]
  for (const d of decks) {
    const f = path.join(REPO, d, 'slides.md')
    if (!fs.existsSync(f) || path.resolve(f) === self)
      continue
    try {
      parseSync(fs.readFileSync(f, 'utf8'), f).slides.forEach((sl, i) => {
        const mesh = sl.frontmatter?.mesh
        for (const fig of Array.isArray(mesh) ? mesh : [])
          if (fig && typeof fig === 'object')
            refs.push({ fig, from: `de «${fig.label ?? 'sin label'}» en ${d}/slides.md (diap. ${i + 1})` })
      })
    }
    catch {}
  }
  return refs
}
const LIMITS = { title: 50, sectionTitle: 40, subtitle: 90, bullets: 6, depth: 2, words: 110, statementWords: 40, sameInARow: 2, dominantShare: 0.5, minKinds: 3, varietyFrom: 6 }

// ───────────────────────── Imágenes (docs/11 §4) ─────────────────────────
const FREE_LICENSE = /\b(cc0|cc[ -]by(?:[ -]sa)?(?: \d(?:\.\d)?)?|dominio p[úu]blico|public domain|unsplash|pexels|pixabay)\b/i
const RESTRICTED = /\b(nc|nd)\b|no comercial|sin derivadas|all rights reserved|todos los derechos/i

/** Dimensiones { w, h } de un PNG o JPEG (null si no se pueden leer). */
function imageSize(f) {
  try {
    const b = fs.readFileSync(f)
    if (b.length > 24 && b.readUInt32BE(0) === 0x89504E47)
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
    if (b[0] === 0xFF && b[1] === 0xD8) {
      let i = 2
      while (i + 9 < b.length) {
        if (b[i] !== 0xFF) { i++; continue }
        const m = b[i + 1]
        if (m >= 0xC0 && m <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(m))
          return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }
        i += 2 + b.readUInt16BE(i + 2)
      }
    }
  }
  catch {}
  return null
}

const args = process.argv.slice(2)
const file = args.find(a => !a.startsWith('--'))
const opts = { render: args.includes('--render'), json: args.includes('--json') }
if (!file) {
  console.error('Uso: plas-check <slides.md> [--render] [--json]')
  process.exit(2)
}

const REFERENCES = referenceFigures(path.resolve(file))

const issues = []
function report(level, slide, rule, message, fix) {
  issues.push({ level, slide: slide?.no ?? null, line: slide?.line ?? null, rule, message, fix })
}

/** Quita bloques de código (incluye fences anidados ```` / ```) y devuelve el texto restante. */
function stripCode(md) {
  const out = []
  let fence = null
  for (const l of md.split('\n')) {
    const m = l.match(/^\s*(`{3,}|~{3,})/)
    if (m) {
      if (!fence) { fence = m[1]; continue }
      if (m[1].startsWith(fence[0]) && m[1].length >= fence.length && !l.trim().slice(m[1].length).trim()) { fence = null; continue }
    }
    if (!fence) out.push(l)
  }
  return out.join('\n')
}

// ───────────────────────── Reglas estáticas ─────────────────────────
const src = fs.readFileSync(file, 'utf8')
const deck = parseSync(src, path.resolve(file))
const head = deck.slides[0]?.frontmatter ?? {}
const deckLine = head.themeConfig?.line

if (head.theme !== 'plas')
  report('error', null, 'tema', `El encabezado usa theme: ${head.theme ?? '(ninguno)'}.`, 'Use "theme: plas" en el primer bloque de frontmatter.')
if (deckLine !== undefined && !LINES.includes(deckLine))
  report('error', null, 'linea-invalida', `themeConfig.line = "${deckLine}" no es una línea válida.`, `Use una de: ${LINES.join(', ')}.`)

const drawn = [] // figuras ya usadas en esta presentación: { fig, no }
const publicDir = path.join(path.dirname(path.resolve(file)), 'public')
const sequence = [] // { no, layout, line } de cada diapositiva, para las reglas de conjunto
const componentsDir = path.join(path.dirname(path.resolve(file)), 'components')
const OWN_COMPONENTS = fs.existsSync(componentsDir) ? fs.readdirSync(componentsDir).filter(f => f.endsWith('.vue')).map(f => f.slice(0, -4)) : []

/** Comprueba una imagen del frontmatter: archivo local en public/, crédito y licencia. */
function checkImage(slide, src, credit, where, minWidth) {
  let size = null
  if (typeof src !== 'string' || !src.trim()) {
    report('error', slide, 'imagen-faltante', `Falta la ruta de la imagen${where}.`, 'Guarde la imagen en public/ y escriba su ruta: /nombre.jpg.')
    return
  }
  if (/^https?:\/\//i.test(src))
    report('error', slide, 'imagen-remota', `La imagen${where} se carga de internet (${src}).`, 'Descárguela a public/ y use /nombre.jpg: la presentación no debe depender de otro sitio. Anote su licencia en "credit".')
  else if (!src.startsWith('/'))
    report('error', slide, 'imagen-ruta', `La ruta "${src}"${where} no empieza por "/".`, 'Las imágenes van en public/ y se citan como /nombre.jpg.')
  else if (!fs.existsSync(path.join(publicDir, src)))
    report('error', slide, 'imagen-no-existe', `No existe public${src}${where}.`, 'Guarde la imagen en public/ con ese nombre.')
  else {
    size = imageSize(path.join(publicDir, src))
    if (size && size.w < minWidth)
      report('aviso', slide, 'imagen-pequena', `La imagen${where} mide ${size.w} px de ancho (mín. recomendado ${minWidth}).`, 'Use una versión más grande: en el proyector se verá borrosa.')
  }
  if (typeof credit !== 'string' || !credit.trim())
    report('error', slide, 'imagen-sin-credito', `La imagen${where} no dice de dónde viene.`, 'Agregue credit: "Propia", "Generada con IA (herramienta)" o "Autor · Licencia · Fuente".')
  else if (!/^(propia|generada)\b/i.test(credit.trim())) {
    if (RESTRICTED.test(credit))
      report('error', slide, 'licencia-restrictiva', `La licencia de la imagen${where} restringe su uso (${credit}).`, 'Busque otra con CC0, CC BY, CC BY-SA, dominio público, Unsplash o Pexels.')
    else if (!FREE_LICENSE.test(credit))
      report('error', slide, 'licencia-desconocida', `El crédito de la imagen${where} no indica una licencia libre (${credit}).`, 'Escriba "Autor · Licencia · Fuente" con CC0, CC BY, CC BY-SA, dominio público, Unsplash o Pexels; si no la conoce, no use la imagen.')
  }
  return size
}
deck.slides.forEach((s, i) => {
  const slide = { no: i + 1, line: (s.start ?? 0) + 1 }
  const fm = s.frontmatter ?? {}
  const layout = fm.layout ?? (i === 0 ? 'cover' : 'default')
  const content = s.content ?? ''
  const text = stripCode(content)
  const h1 = text.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const h2 = text.match(/^##\s+(.+)$/m)?.[1]?.trim()

  if (!LAYOUTS.includes(layout))
    report('error', slide, 'maqueta-desconocida', `La maqueta "${layout}" no existe en el tema PLaS.`, `Use una de: ${LAYOUTS.join(', ')}.`)

  if (layout === 'section') {
    if (!deckLine && !LINES.includes(fm.line))
      report('error', slide, 'seccion-sin-linea', 'El separador no define una línea válida en "line".', `Agregue "line: <${LINES.join('|')}>" al frontmatter.`)
    if (h1 && h1.length > LIMITS.sectionTitle)
      report('aviso', slide, 'titulo-largo', `El título de sección tiene ${h1.length} caracteres (máx. ${LIMITS.sectionTitle}).`, 'Acórtelo; el detalle va en "question".')
  }

  // Figuras de la malla (docs/07 §6): portada y separadores dibujan 2–4 figuras propias del tema
  const howTo = `Dibuje ${FIGURE_LIMITS.minForms} a ${FIGURE_LIMITS.maxForms} figuras propias del tema: mesh: [{ label, nodes, edges }, …]. Véalas con "npm run figuras".`
  if (['cover', 'section'].includes(layout)) {
    const what = layout === 'cover' ? 'la presentación' : 'esta sección'
    if (fm.mesh === undefined) {
      report('error', slide, 'figura-obligatoria', `La ${layout === 'cover' ? 'portada' : 'sección'} no dibuja nada en la malla.`, `${howTo} Deben decir algo de ${what}.`)
    }
    else {
      const forms = Array.isArray(fm.mesh) ? fm.mesh : [fm.mesh]
      if (forms.length < FIGURE_LIMITS.minForms || forms.length > FIGURE_LIMITS.maxForms)
        report('error', slide, 'figuras-cantidad', `"mesh" tiene ${forms.length} figura${forms.length === 1 ? '' : 's'} (entre ${FIGURE_LIMITS.minForms} y ${FIGURE_LIMITS.maxForms}).`, forms.length < FIGURE_LIMITS.minForms ? `Agregue otra figura que diga algo de ${what}: la malla deriva de una a otra.` : 'Deje solo las figuras que más dicen del tema.')
      forms.forEach((m, k) => {
        const where = forms.length > 1 ? ` (figura ${k + 1})` : ''
        if (typeof m === 'string' || !m || typeof m !== 'object') {
          report('error', slide, 'figura-de-catalogo', `"${m}"${where} no es un dibujo: ya no hay figuras por nombre.`, `${howTo} Deben decir algo de ${what}.`)
          return
        }
        if (typeof m.label !== 'string' || m.label.trim().length < 3)
          report('error', slide, 'figura-sin-nombre', `La figura${where} no dice qué dibuja.`, `Agregue label: "<qué representa y por qué tiene que ver con ${what}>".`)
        const errs = figureErrors(m)
        for (const e of errs)
          report('error', slide, 'figura-invalida', `${e}${where}`, `Dibuje con lo mínimo: ${FIGURE_LIMITS.minNodes}–${FIGURE_LIMITS.maxNodes} nodos [x, y], ${FIGURE_LIMITS.minEdges}–${FIGURE_LIMITS.maxEdges} aristas [i, j], todos los nodos unidos.`)
        if (errs.length)
          return
        const ref = REFERENCES.find(r => similarFigures(r.fig, m))
        const prev = drawn.find(d => similarFigures(d.fig, m))
        if (ref)
          report('error', slide, 'figura-copiada', `La figura${where} es una copia (o copia retocada) ${ref.from}.`, `No reutilice dibujos de otras presentaciones: dibuje una figura propia de ${what}.`)
        else if (prev)
          report('error', slide, 'figura-repetida', `La figura${where} repite (o casi) una de la diap. ${prev.no}.`, 'Cada portada y cada sección llevan dibujos propios: dibuje otra.')
        else
          drawn.push({ fig: m, no: slide.no })
      })
    }
  }
  else if (fm.mesh !== undefined) {
    report('aviso', slide, 'figura-sin-malla', `"mesh" no tiene efecto en la maqueta "${layout}".`, 'Use "mesh" solo en la portada o en un separador.')
  }

  // Visual: maqueta de imagen, imagen suelta o un diagrama propio de components/
  const visual = /!\[[^\]]*\]\(|<img\b|^::figure::\s*$/m.test(content) || OWN_COMPONENTS.some(c => new RegExp(`<${c}\\b`).test(content))
  sequence.push({ no: slide.no, line: slide.line, layout, visual })

  // Reglas de cada tipología (docs/11 §2)
  if ((layout === 'image-text' || layout === 'image') && !/^::figure::\s*$/m.test(content))
    checkImage(slide, fm.image, fm.credit, '', layout === 'image' ? 1600 : 1200)
  if (layout === 'gallery') {
    const imgs = Array.isArray(fm.images) ? fm.images : []
    if (imgs.length < 2 || imgs.length > 6)
      report('error', slide, 'galeria-cantidad', `La galería tiene ${imgs.length} imágenes (entre 2 y 6).`, imgs.length < 2 ? 'Con una imagen use "image" o "image-text".' : 'Divida la galería en dos diapositivas.')
    const ratios = imgs.map((im, k) => checkImage(slide, im?.src, im?.credit, ` ${k + 1}`, 800)).filter(Boolean).map(z => z.w / z.h)
    // La galería iguala la altura por fila; con proporciones muy distintas, unas quedan diminutas
    if (ratios.length > 1 && Math.max(...ratios) / Math.min(...ratios) > 3)
      report('aviso', slide, 'galeria-desigual', `Las imágenes de la galería tienen proporciones muy distintas (de ${Math.min(...ratios).toFixed(2)} a ${Math.max(...ratios).toFixed(2)}).`, 'Recorte las extremas a una proporción parecida (p. ej. 4:3 o 16:9), o muestre la panorámica o el retrato aparte con "image".')
  }
  if (layout === 'two-cols' && !/^::right::\s*$/m.test(content))
    report('error', slide, 'columna-faltante', 'La maqueta "two-cols" no tiene columna derecha.', 'Separe las dos columnas con una línea "::right::".')
  if (layout === 'table' && !/^\s*\|.*\|\s*$/m.test(text))
    report('error', slide, 'tabla-faltante', 'La maqueta "table" no tiene una tabla.', 'Escriba la tabla en Markdown (| … |) o use otra maqueta.')
  if (layout === 'table' && !/^::comment::\s*$/m.test(content))
    report('error', slide, 'tabla-sin-comentario', 'La tabla no tiene comentario.', 'Agregue "::comment::" con lo que el público debe ver en la tabla.')
  if (layout === 'quote') {
    if (!/^>\s/m.test(text))
      report('error', slide, 'cita-faltante', 'La maqueta "quote" no tiene una cita (> …).', 'Escriba la cita con ">" o use otra maqueta.')
    if (!fm.cite)
      report('error', slide, 'cita-sin-fuente', 'La cita no dice de quién es.', 'Agregue cite: "Nombre, Obra, año".')
  }
  if (layout === 'statement') {
    const w = text.replace(/^#.*$/gm, '').split(/\s+/).filter(x => /\p{L}/u.test(x)).length
    if (w > LIMITS.statementWords)
      report('aviso', slide, 'idea-larga', `La idea clave tiene ${w} palabras (máx. recomendado ${LIMITS.statementWords}).`, 'Una sola idea, corta. El desarrollo va en otra diapositiva.')
  }
  if (layout === 'team') {
    const people = Array.isArray(fm.people) ? fm.people : []
    if (people.length < 2 || people.length > 8)
      report('error', slide, 'equipo-cantidad', `"people" tiene ${people.length} personas (entre 2 y 8).`, 'Para una persona use "image-text"; para más de 8, divida.')
    people.forEach((m, k) => {
      if (!m?.name)
        report('error', slide, 'persona-sin-nombre', `La persona ${k + 1} no tiene "name".`, 'Agregue name.')
      if (m?.photo)
        checkImage(slide, m.photo, m.credit ?? 'Propia', ` (foto de ${m?.name ?? k + 1})`, 300)
    })
  }
  if (layout === 'closing' && !h1)
    report('error', slide, 'titulo-faltante', 'El cierre no tiene mensaje (# …).', 'Agregue un mensaje corto: «Gracias», «Preguntas», una invitación.')
  if (/!\[[^\]]*\]\(|<img\b/.test(text) && !IMAGE_LAYOUTS.includes(layout))
    report('aviso', slide, 'imagen-suelta', 'Hay una imagen fuera de las maquetas de imagen.', 'Use "image", "image-text" o "gallery": llevan pie y crédito.')

  if (CONTENT_LAYOUTS.includes(layout)) {
    if (!h1)
      report('error', slide, 'titulo-faltante', 'La diapositiva no tiene título (# …).', 'Agregue un título de una línea al inicio.')
    else if (h1.length > LIMITS.title)
      report('error', slide, 'titulo-largo', `El título tiene ${h1.length} caracteres (máx. ${LIMITS.title}).`, 'Acórtelo; mueva el detalle al subtítulo (## …).')
    if (h2 && h2.length > LIMITS.subtitle)
      report('aviso', slide, 'subtitulo-largo', `El subtítulo tiene ${h2.length} caracteres (máx. ${LIMITS.subtitle}).`, 'Resúmalo en una línea.')
  }

  // Viñetas
  const bullets = text.split('\n').filter(l => /^\s*([-*+]|\d+\.)\s+/.test(l))
  // En two-cols cada columna es su propia lista: cuenta la columna más cargada
  const topOf = t => t.split('\n').filter(l => /^([-*+]|\d+\.)\s+/.test(l)).length
  const top = layout === 'two-cols' ? Math.max(...text.split(/^::right::\s*$/m).map(topOf)) : topOf(text)
  const depth = Math.max(0, ...bullets.map(l => Math.floor(l.match(/^\s*/)[0].length / 2) + 1))
  if (top > LIMITS.bullets)
    report('error', slide, 'demasiadas-vinetas', `${top} viñetas de primer nivel${layout === 'two-cols' ? ' en una columna' : ''} (máx. ${LIMITS.bullets}).`, 'Divida el contenido en dos diapositivas o agrupe ideas.')
  if (depth > LIMITS.depth)
    report('error', slide, 'anidacion-profunda', `Viñetas anidadas en ${depth} niveles (máx. ${LIMITS.depth}).`, 'Aplane la lista.')

  // Densidad de texto
  const words = text.replace(/<[^>]+>/g, ' ').replace(/^#.*$/gm, '').split(/\s+/).filter(w => /\p{L}/u.test(w)).length
  if (words > LIMITS.words)
    report('aviso', slide, 'demasiado-texto', `${words} palabras en la diapositiva (máx. recomendado ${LIMITS.words}).`, 'Reduzca el texto; el detalle va en las notas del presentador.')

  // Paridad web ⇄ PDF (docs/03 §5)
  const web = (content.match(/<WebOnly\b/g) ?? []).length
  const print = (content.match(/<PrintOnly\b/g) ?? []).length
  if (web !== print)
    report('error', slide, 'paridad-web-pdf', `Hay ${web} <WebOnly> y ${print} <PrintOnly>.`, 'Cada <WebOnly> necesita un <PrintOnly> con su versión impresa (p. ej. <Frames> para animaciones).')

  if (/^\s*`{3,}\s*md\s+magic-move/m.test(content)) {
    const before = content.slice(0, content.search(/`{3,}\s*md\s+magic-move/))
    const open = (before.match(/<WebOnly\b/g) ?? []).length - (before.match(/<\/WebOnly>/g) ?? []).length
    if (open < 1)
      report('error', slide, 'animacion-sin-version-impresa', 'Un bloque magic-move está fuera de <WebOnly>.', 'Envuélvalo en <WebOnly> y agregue <PrintOnly><Frames>…</Frames></PrintOnly> con los pasos.')
  }

  const interactives = (content.match(/<Interactive\b/g) ?? []).length
  const printSlots = (content.match(/(#print|v-slot:print)\b/g) ?? []).length
  if (interactives > printSlots)
    report('error', slide, 'interactivo-sin-version-impresa', '<Interactive> sin plantilla #print.', 'Agregue <template #print> con una instantánea estática de la herramienta.')
  if (layout === 'interactive' && interactives === 0)
    report('error', slide, 'maqueta-interactiva-vacia', 'La maqueta "interactive" no contiene <Interactive>.', 'Use <Interactive> o cambie a layout: default.')

  // Tokens: sin colores ni justificado a mano
  if (/#[0-9a-f]{3,8}\b/i.test(text.replace(/^#+\s.*$/gm, '')) || /style="[^"]*color/i.test(text))
    report('error', slide, 'color-fijo', 'La diapositiva define colores a mano.', 'Use los tokens del tema; el color lo da la línea de la sección.')
  if (/justify/i.test(text))
    report('error', slide, 'texto-justificado', 'Texto justificado.', 'Quite la justificación; el tema alinea a la izquierda.')
})

// ───────────────────────── Reglas de conjunto (docs/11 §3) ─────────────────────────
{
  const content = sequence.filter(x => CONTENT_LAYOUTS.includes(x.layout))
  // Repetición: más de 2 seguidas de la misma tipología (un separador corta la racha)
  let run = []
  for (const x of sequence) {
    if (!CONTENT_LAYOUTS.includes(x.layout)) {
      if (x.layout === 'section')
        run = []
      continue
    }
    run = run.length && run[0].layout === x.layout ? [...run, x] : [x]
    if (run.length === LIMITS.sameInARow + 1)
      report('error', x, 'tipologia-repetida', `Tres diapositivas seguidas con la maqueta "${x.layout}" (diap. ${run.map(r => r.no).join(', ')}).`, 'Elija para alguna la tipología que mejor muestre su contenido: two-cols, image-text, table, statement, gallery… (AGENTS.md, «Biblioteca de tipologías»).')
  }
  if (content.length >= LIMITS.varietyFrom) {
    const count = {}
    for (const x of content) count[x.layout] = (count[x.layout] ?? 0) + 1
    const [top, n] = Object.entries(count).sort((a, b) => b[1] - a[1])[0]
    if (n / content.length > LIMITS.dominantShare)
      report('error', null, 'tipologia-dominante', `"${top}" ocupa ${n} de ${content.length} diapositivas de contenido (máx. la mitad).`, 'Revise cuáles se muestran mejor con otra tipología.')
    if (Object.keys(count).length < LIMITS.minKinds)
      report('aviso', null, 'poca-variedad', `Solo ${Object.keys(count).length} tipologías en ${content.length} diapositivas de contenido.`, `Use al menos ${LIMITS.minKinds}, según lo que pida cada contenido.`)
    if (!content.some(x => IMAGE_LAYOUTS.includes(x.layout) || x.layout === 'team' || x.visual))
      report('aviso', null, 'sin-imagenes', 'La presentación no tiene imágenes.', 'Si el tema lo permite, muestre: fotos, capturas, diagramas o esquemas propios, imágenes generadas o de licencia libre (AGENTS.md, «Imágenes»).')
  }
  // Antes de la primera sección solo caben la portada, la agenda y, como mucho, una diapositiva de presentación (p. ej. el equipo)
  const firstSection = sequence.findIndex(x => x.layout === 'section')
  const loose = (firstSection < 0 ? [] : sequence.slice(0, firstSection)).filter(x => CONTENT_LAYOUTS.includes(x.layout))
  if (loose.length > 1)
    report('aviso', loose[1], 'fuera-de-seccion', `${loose.length} diapositivas de contenido antes de la primera sección (diap. ${loose.map(x => x.no).join(', ')}).`, 'Antes de la primera sección deje solo una diapositiva de presentación (el equipo, por ejemplo); el resto va dentro de una sección.')
  const closings = sequence.filter(x => x.layout === 'closing')
  if (closings.length > 1)
    report('error', closings[1], 'cierre-repetido', 'Hay más de un cierre.', 'Deje un solo "closing", al final.')
  else if (closings.length === 1 && closings[0] !== sequence[sequence.length - 1])
    report('error', closings[0], 'cierre-no-final', 'El cierre no es la última diapositiva.', 'Mueva "closing" al final.')
  else if (!closings.length && sequence.length >= 8)
    report('aviso', null, 'sin-cierre', 'La presentación no tiene cierre.', 'Termine con "layout: closing": mensaje, contacto y logos.')
}

// ───────────────────────── Reglas de renderizado ─────────────────────────
async function renderChecks() {
  const dist = path.join(path.dirname(path.resolve(file)), 'dist')
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    report('error', null, 'sin-build', `No existe ${dist}/index.html.`, 'Ejecute "slidev build" antes de "plas check --render".')
    return
  }
  // Una compilación vieja haría validar otra versión de la presentación
  const src = path.dirname(path.resolve(file))
  const newest = [file, ...(['components', 'public'].flatMap(d => fs.existsSync(path.join(src, d)) ? fs.readdirSync(path.join(src, d)).map(f => path.join(src, d, f)) : []))]
    .reduce((m, f) => Math.max(m, fs.statSync(f).mtimeMs), 0)
  if (fs.statSync(path.join(dist, 'index.html')).mtimeMs < newest) {
    report('error', null, 'build-viejo', `${dist} es anterior a los cambios de la presentación.`, 'Compile antes de validar: "npm run check" ya lo hace (slidev build && plas-check).')
    return
  }
  const { chromium } = await import('playwright-chromium')
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
  const server = http.createServer((q, r) => {
    let p = path.join(dist, decodeURIComponent(q.url.split('?')[0]))
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, 'index.html')
    r.writeHead(200, { 'content-type': types[path.extname(p)] ?? 'application/octet-stream' })
    fs.createReadStream(p).pipe(r)
  })
  await new Promise(res => server.listen(0, res))
  const base = `http://localhost:${server.address().port}`
  const executablePath = findBrowser()
  const browser = await chromium.launch(executablePath ? { executablePath } : {})
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } })
  try {
    for (let n = 1; n <= deck.slides.length; n++) {
      const slide = { no: n, line: (deck.slides[n - 1].start ?? 0) + 1 }
      for (const mode of ['web', 'pdf']) {
        await page.goto(`${base}/${n}?embedded=true${mode === 'pdf' ? '&print' : ''}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(400)
        const found = await page.evaluate(() => {
          const out = []
          const roots = [...document.querySelectorAll('.slidev-layout.plas')].filter((e) => {
            const r = e.getBoundingClientRect()
            return r.width > 0 && r.left >= -1 && r.left < innerWidth
          })
          const root = roots[0]
          if (!root)
            return [{ rule: 'sin-render', msg: 'La diapositiva no se renderizó con el tema PLaS.' }]
          const R = root.getBoundingClientRect()
          const decorative = '.plas-mesh, .plas-cover__panel, .plas-section__panel, .plas-stripe'
          const name = el => (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40) || el.tagName.toLowerCase()
          for (const el of root.querySelectorAll('*')) {
            if (el.closest(decorative))
              continue
            const r = el.getBoundingClientRect()
            if (r.width < 1 || r.height < 1)
              continue
            if (r.right > R.right + 1 || r.bottom > R.bottom + 1 || r.left < R.left - 1 || r.top < R.top - 1) {
              out.push({ rule: 'fuera-de-la-diapositiva', msg: `"${name(el)}" se sale de la diapositiva.` })
              break
            }
          }
          const body = root.querySelector('.plas-content__body')
          if (body) {
            const B = body.getBoundingClientRect()
            for (const el of body.querySelectorAll('*')) {
              const r = el.getBoundingClientRect()
              if (r.height > 0 && r.bottom > B.bottom + 2) {
                out.push({ rule: 'contenido-desborda', msg: `"${name(el)}" invade el pie (sobran ${Math.round(r.bottom - B.bottom)} px).` })
                break
              }
              // Con el cuerpo centrado, el exceso también sale hacia arriba, sobre el título
              if (r.height > 0 && r.top < B.top - 2) {
                out.push({ rule: 'contenido-desborda', msg: `"${name(el)}" invade el título (sobran ${Math.round(B.top - r.top)} px).` })
                break
              }
            }
          }
          const coverTitle = root.querySelector('.plas-cover__text h1')
          if (coverTitle) {
            const lh = Number.parseFloat(getComputedStyle(coverTitle).lineHeight)
            const n = Math.round(coverTitle.getBoundingClientRect().height / lh)
            if (n > 3)
              out.push({ rule: 'titulo-portada-largo', level: 'aviso', msg: `El título de la portada ocupa ${n} líneas (máx. 3).` })
          }
          const place = root.querySelector('.plas-cover__place')
          if (place) {
            const lh = Number.parseFloat(getComputedStyle(place).lineHeight)
            if (Math.round(place.getBoundingClientRect().height / lh) > 1)
              out.push({ rule: 'lugar-largo', level: 'aviso', msg: 'El lugar de la portada ocupa más de una línea.' })
          }
          // Texto de la portada o el cierre sobre la diagonal del panel
          const panel = root.querySelector('.plas-cover__panel, .plas-closing__panel')
          const column = root.querySelector('.plas-cover__text, .plas-closing__text')
          if (panel && column) {
            const P = panel.getBoundingClientRect()
            const xTop = P.left + 0.22 * P.width // clip-path: polygon(22% 0, 100% 0, 100% 100%, 0 100%)
            const diag = y => xTop - (xTop - P.left) * ((y - P.top) / P.height)
            const walker = document.createTreeWalker(column, NodeFilter.SHOW_TEXT)
            let crossed = null
            while (!crossed && walker.nextNode()) {
              if (!walker.currentNode.textContent.trim())
                continue
              const range = document.createRange()
              range.selectNodeContents(walker.currentNode)
              for (const r of range.getClientRects()) {
                if (r.width > 0 && r.right > diag(r.bottom) - 8) {
                  crossed = walker.currentNode.textContent.trim().slice(0, 40)
                  break
                }
              }
            }
            if (crossed)
              out.push({ rule: 'sobre-diagonal', msg: `"${crossed}" toca la diagonal del panel.` })
          }
          // Texto ilegible: tamaño real en la diapositiva (incluye SVG escalado y transformaciones)
          {
            // Etiquetas pequeñas del propio tema (créditos, rótulos, fecha): su tamaño es deliberado
            const skip = '.plas-chrome, .plas-mesh, .plas-stripe, .plas-toc, .plas-img__credit, .plas-gallery__credit, .plas-interactive__qr, .plas-interactive__badge, .plas-project__kind, .plas-frames__n, .plas-closing__qr, .plas-cover__date, .plas-frames'  // las tiras de fotogramas son la versión impresa reducida de una animación
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
            let min = null
            while (walker.nextNode()) {
              const t = walker.currentNode
              const el = t.parentElement
              if (!el || !/[\p{L}\p{N}]/u.test(t.textContent) || el.closest(skip))
                continue
              const r = el.getBoundingClientRect()
              if (r.width < 1 || r.height < 1)
                continue
              const fs = Number.parseFloat(getComputedStyle(el).fontSize)
              let scale = 1
              if (el instanceof SVGElement)
                scale = Math.hypot(el.getScreenCTM()?.a ?? 1, el.getScreenCTM()?.b ?? 0)
              else if (el.offsetWidth > 0)
                scale = r.width / el.offsetWidth
              const size = fs * scale
              if (!min || size < min.size)
                min = { size, text: t.textContent.trim().slice(0, 30) }
            }
            if (min && min.size < 12)
              out.push({ rule: 'texto-pequeno', level: min.size < 10 ? 'error' : 'aviso', msg: `"${min.text}" se ve a ${min.size.toFixed(1)} px (mín. 10; recomendado 12 o más).` })
          }
          const h1 = root.querySelector('.plas-content__head h1')
          if (h1) {
            const lh = Number.parseFloat(getComputedStyle(h1).lineHeight)
            const lines = Math.round(h1.getBoundingClientRect().height / lh)
            if (lines > 1)
              out.push({ rule: 'titulo-multilinea', msg: `El título ocupa ${lines} líneas.` })
          }
          return out
        })
        for (const f of found) {
          const fix = {
            'fuera-de-la-diapositiva': 'Reduzca el contenido o divídalo en dos diapositivas.',
            'contenido-desborda': 'Reduzca el contenido o divídalo en dos diapositivas.',
            'titulo-multilinea': 'Acorte el título a una línea; mueva el detalle al subtítulo.',
            'sin-render': 'Revise que la maqueta exista y que el tema cargue.',
            'titulo-portada-largo': 'Acorte el título; el detalle va en el subtítulo (## …).',
            'lugar-largo': 'Acorte "place": omita lo que ya dicen los logos (universidad, facultad).',
            'sobre-diagonal': 'Acorte el título o el subtítulo; el tema limita el ancho, pero un texto sin espacios puede salirse.',
            'texto-pequeno': 'Agrande la letra o simplifique el diagrama: un componente con viewBox se reduce al encajar. Deje menos texto, con letra de 14 px o más a tamaño final.',
          }[f.rule]
          report(f.level ?? 'error', slide, f.rule, `[${mode}] ${f.msg}`, fix)
        }
      }
    }
  }
  finally {
    await browser.close()
    server.close()
  }
}

if (opts.render)
  await renderChecks()

// ───────────────────────── Salida ─────────────────────────
const errors = issues.filter(i => i.level === 'error').length
const warnings = issues.length - errors
if (opts.json) {
  console.log(JSON.stringify({ file, slides: deck.slides.length, errors, warnings, issues }, null, 2))
}
else {
  for (const i of issues) {
    const where = i.slide ? `diap. ${i.slide} (línea ${i.line})` : 'encabezado'
    console.log(`${i.level === 'error' ? 'ERROR' : 'AVISO'}  ${where}  [${i.rule}]  ${i.message}\n       → ${i.fix}`)
  }
  console.log(`\n${file}: ${deck.slides.length} diapositivas · ${errors} errores · ${warnings} avisos${opts.render ? ' · con renderizado' : ''}`)
}
process.exit(errors ? 1 : 0)
