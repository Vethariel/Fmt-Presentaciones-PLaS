#!/usr/bin/env node
/**
 * plas-export — exporta el PDF de una presentación con el navegador que haya
 * en el equipo (ver utils/browser.mjs), sin rutas fijas en package.json.
 *
 * Uso:
 *   plas-export <slides.md> <salida.pdf> [opciones extra de `slidev export`]
 */
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { findBrowser } from '../utils/browser.mjs'

const [file, output, ...rest] = process.argv.slice(2)
if (!file || !output) {
  console.error('Uso: plas-export <slides.md> <salida.pdf>')
  process.exit(2)
}

const browser = findBrowser()
const args = ['export', file, '--output', output, ...(browser ? ['--executable-path', browser] : []), ...rest]
const r = spawnSync('slidev', args, { stdio: 'inherit', shell: process.platform === 'win32' })
process.exit(r.status ?? 1)
