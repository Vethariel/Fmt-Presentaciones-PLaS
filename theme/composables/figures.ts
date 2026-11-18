import type { Figure } from './meshEngine'
import { FIGURE_LIMITS, figureErrors } from '../utils/figureRules.mjs'
import library from './meshFigures.json'

/** Biblioteca de figuras del tema (fuente única: meshFigures.json, también la lee plas-check). */
export const FIGURES = library as unknown as Record<string, Figure>

function one(m: unknown): Figure | null {
  if (typeof m === 'string')
    return FIGURES[m] ?? null
  return m && typeof m === 'object' && !figureErrors(m).length ? (m as Figure) : null
}

/**
 * Frontmatter `mesh` → formas de la malla (docs/07 §6).
 * - sin valor o "red": malla aleatoria (lista vacía)
 * - nombre de la biblioteca u objeto { nodes, edges, angle? }: una forma
 * - lista de ellos: la malla deriva de una forma a la siguiente
 */
export function resolveFigures(mesh: unknown): Figure[] {
  if (!mesh || mesh === 'red')
    return []
  const list = (Array.isArray(mesh) ? mesh : [mesh]).slice(0, FIGURE_LIMITS.maxForms)
  return list.map(one).filter((f): f is Figure => !!f)
}
