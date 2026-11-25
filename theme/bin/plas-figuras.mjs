#!/usr/bin/env node
/**
 * plas-figuras — dibuja las figuras de la malla de cada portada y separador en
 * una imagen, para revisar que se reconozcan antes de validar (docs/07 §6).
 *
 * Uso:
 *   plas-figuras <slides.md> [salida.png]     (por defecto: export/figuras.png)
 *
 * Muestra solo las aristas del dibujo (la malla principal), encajadas como las
 * encaja el tema: con su giro (`angle`) y sin deformar la proporción.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseSync } from '@slidev/parser'
import { findBrowser } from '../utils/browser.mjs'
import { figureErrors } from '../utils/figureRules.mjs'

const [file, outArg] = process.argv.slice(2)
if (!file) {
  console.error('Uso: plas-figuras <slides.md> [salida.png]')
  process.exit(2)
}
const out = path.resolve(outArg ?? path.join(path.dirname(file), 'export', 'figuras.png'))
const deck = parseSync(fs.readFileSync(file, 'utf8'), path.resolve(file))

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const W = 240
const H = 180
const PAD = 18

function svg(fig) {
  const a = ((fig.angle ?? 0) * Math.PI) / 180
  const pts = fig.nodes.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)])
  const xs = pts.map(p => p[0])
  const ys = pts.map(p => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const s = Math.min((W - 2 * PAD) / Math.max(x1 - x0, 1e-6), (H - 2 * PAD) / Math.max(y1 - y0, 1e-6))
  const P = pts.map(([x, y]) => [W / 2 + (x - (x0 + x1) / 2) * s, H / 2 + (y - (y0 + y1) / 2) * s])
  const lines = fig.edges.map(([i, j]) => `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[j][0]}" y2="${P[j][1]}"/>`).join('')
  const dots = P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${3.5 + (fig.nodes[i][2] ?? 0.3) * 4.5}"/><text x="${x + 7}" y="${y - 6}">${i}</text>`).join('')
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><g class="e">${lines}</g><g class="n">${dots}</g></svg>`
}

const rows = []
deck.slides.forEach((sl, i) => {
  const fm = sl.frontmatter ?? {}
  const layout = fm.layout ?? (i === 0 ? 'cover' : 'default')
  if (!['cover', 'section'].includes(layout))
    return
  const title = (sl.content ?? '').match(/^#\s+(.+)$/m)?.[1]?.trim() ?? ''
  const forms = fm.mesh === undefined ? [] : Array.isArray(fm.mesh) ? fm.mesh : [fm.mesh]
  const cells = forms.map((m, k) => {
    const errs = m && typeof m === 'object' ? figureErrors(m) : [`"${m}" no es un dibujo`]
    const label = m?.label ? esc(m.label) : '<em>sin label</em>'
    const body = errs.length ? `<div class="bad">${errs.map(esc).join('<br>')}</div>` : svg(m)
    return `<figure>${body}<figcaption><b>${k + 1}.</b> ${label}</figcaption></figure>`
  })
  if (!cells.length)
    cells.push('<figure><div class="bad">Sin figuras (falta "mesh")</div></figure>')
  rows.push(`<section><h2>Diap. ${i + 1} · ${layout === 'cover' ? 'Portada' : 'Sección'}: ${esc(title)}</h2>${fm.question ? `<p>${esc(fm.question)}</p>` : ''}<div class="row">${cells.join('')}</div></section>`)
})

const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;padding:20px;font:13px system-ui,sans-serif;color:#1d2b2a;background:#fff;width:${4 * (W + 16) + 8}px}
section{margin-bottom:22px} h2{font-size:15px;margin:0 0 2px} p{margin:0 0 8px;color:#55605f;font-style:italic}
.row{display:flex;gap:16px} figure{margin:0;width:${W}px}
svg{display:block;background:#eef8f5;border-radius:6px}
.e line{stroke:#0e6b5c;stroke-width:3.4;stroke-linecap:round} .n circle{fill:#0e6b5c} .n text{font-size:9px;fill:#8a9694}
figcaption{margin-top:4px;line-height:1.3} .bad{height:${H}px;box-sizing:border-box;padding:10px;background:#fdecec;color:#a11;border-radius:6px}
</style>${rows.join('') || '<p>No hay portada ni separadores.</p>'}`

const { chromium } = await import('playwright-chromium')
const exe = findBrowser()
const browser = await chromium.launch(exe ? { executablePath: exe } : {})
try {
  const page = await browser.newPage({ viewport: { width: 4 * (W + 16) + 48, height: 600 } })
  await page.setContent(html)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  await page.screenshot({ path: out, fullPage: true })
}
finally {
  await browser.close()
}
console.log(`Figuras de ${rows.length} diapositivas en ${path.relative(process.cwd(), out) || out}`)
