import type { Figure } from './meshEngine'
import { FIGURE_LIMITS, figureErrors } from '../utils/figureRules.mjs'

function one(m: unknown): Figure | null {
  return m && typeof m === 'object' && !figureErrors(m).length ? (m as Figure) : null
}

/**
 * Frontmatter `mesh` → formas de la malla (docs/07 §6).
 * Cada forma es un dibujo propio { label, nodes, edges, angle? }; con varias, la
 * malla deriva de una a la siguiente. No hay figuras por nombre: cada
 * presentación dibuja las suyas. Lo que no sea un dibujo válido se ignora (el
 * validador lo informa) y, si no queda ninguno, se dibuja la malla aleatoria.
 */
export function resolveFigures(mesh: unknown): Figure[] {
  if (!mesh)
    return []
  const list = (Array.isArray(mesh) ? mesh : [mesh]).slice(0, FIGURE_LIMITS.maxForms)
  return list.map(one).filter((f): f is Figure => !!f)
}
