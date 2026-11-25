#!/usr/bin/env node
/**
 * npm run nueva -- <nombre>
 *
 * Crea presentaciones/<nombre>/ a partir de template/. La carpeta usa el tema y
 * las herramientas instalados en la raíz del repositorio: no necesita su propio
 * `npm install`.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const name = process.argv[2]

if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error('Uso: npm run nueva -- <nombre>')
  console.error('El nombre va en minúsculas, sin tildes y con guiones: p. ej. seminario-lexers-2026')
  process.exit(2)
}

const dest = path.join(root, 'presentaciones', name)
if (fs.existsSync(dest)) {
  console.error(`Ya existe presentaciones/${name}/. Elija otro nombre o trabaje en esa carpeta.`)
  process.exit(1)
}
if (!fs.existsSync(path.join(root, 'node_modules', 'slidev-theme-plas'))) {
  console.error('Falta instalar las dependencias. Ejecute primero "npm install" en la raíz del repositorio.')
  process.exit(1)
}

const skip = new Set(['node_modules', 'dist', 'export', '.slidev'])
fs.cpSync(path.join(root, 'template'), dest, {
  recursive: true,
  verbatimSymlinks: true,
  filter: src => !skip.has(path.basename(src)),
})

const pkgPath = path.join(dest, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
pkg.name = `plas-${name}`
pkg.scripts.export = pkg.scripts.export.replace('export/presentacion.pdf', `export/${name}.pdf`)
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
fs.mkdirSync(path.join(dest, 'components'), { recursive: true })

console.log(`Presentación creada en presentaciones/${name}/

  cd presentaciones/${name}
  npm run dev       # vista previa en http://localhost:3030
  npm run check     # compila y valida (obligatorio antes de entregar)
  npm run export    # PDF en presentaciones/${name}/export/${name}.pdf

Guía de formato: presentaciones/${name}/AGENTS.md`)
