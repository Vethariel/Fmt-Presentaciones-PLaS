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
import { FIGURE_LIMITS, figureErrors, figureKey } from '../utils/figureRules.mjs'

const LAYOUTS = ['cover', 'agenda', 'section', 'default', 'code', 'interactive']
const LINES = ['lenguajes', 'educacion', 'embebidos', 'transporte', 'sensado']
const CONTENT_LAYOUTS = ['default', 'code', 'interactive']
// Ejemplos de la documentación: sirven para enseñar, no para copiarlos.
const EXAMPLES = JSON.parse(fs.readFileSync(new URL('../utils/figureExamples.json', import.meta.url), 'utf8'))
const EXAMPLE_KEYS = new Map(Object.entries(EXAMPLES).map(([name, f]) => [figureKey(f), name]))
const LIMITS = { title: 50, sectionTitle: 40, subtitle: 90, bullets: 6, depth: 2, words: 110 }

const args = process.argv.slice(2)
const file = args.find(a => !a.startsWith('--'))
const opts = { render: args.includes('--render'), json: args.includes('--json') }
if (!file) {
  console.error('Uso: plas-check <slides.md> [--render] [--json]')
  process.exit(2)
}

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

const drawn = new Map() // huella de cada figura → diapositiva donde se usó
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
        const key = figureKey(m)
        if (EXAMPLE_KEYS.has(key))
          report('error', slide, 'figura-copiada', `La figura${where} es el ejemplo "${EXAMPLE_KEYS.get(key)}" de la guía.`, `Los ejemplos muestran la técnica; dibuje una figura propia de ${what}.`)
        else if (drawn.has(key))
          report('error', slide, 'figura-repetida', `La figura${where} ya se usó en la diap. ${drawn.get(key)}.`, 'Cada portada y cada sección llevan dibujos propios: dibuje otra.')
        else
          drawn.set(key, slide.no)
      })
    }
  }
  else if (fm.mesh !== undefined) {
    report('aviso', slide, 'figura-sin-malla', `"mesh" no tiene efecto en la maqueta "${layout}".`, 'Use "mesh" solo en la portada o en un separador.')
  }

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
  const top = bullets.filter(l => /^([-*+]|\d+\.)\s+/.test(l)).length
  const depth = Math.max(0, ...bullets.map(l => Math.floor(l.match(/^\s*/)[0].length / 2) + 1))
  if (top > LIMITS.bullets)
    report('error', slide, 'demasiadas-vinetas', `${top} viñetas de primer nivel (máx. ${LIMITS.bullets}).`, 'Divida el contenido en dos diapositivas o agrupe ideas.')
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

// ───────────────────────── Reglas de renderizado ─────────────────────────
async function renderChecks() {
  const dist = path.join(path.dirname(path.resolve(file)), 'dist')
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    report('error', null, 'sin-build', `No existe ${dist}/index.html.`, 'Ejecute "slidev build" antes de "plas check --render".')
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
