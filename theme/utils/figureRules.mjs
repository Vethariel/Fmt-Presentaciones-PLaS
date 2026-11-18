/**
 * Reglas de una figura de la malla (docs/07 §6).
 * Fuente única: la usan el tema (meshEngine.ts) y el validador (plas-check).
 */

/** Una figura es un dibujo MÍNIMO: pocos nodos, todos unidos. */
export const FIGURE_LIMITS = { minNodes: 6, maxNodes: 18, minEdges: 6, maxEdges: 28, maxForms: 4 }

/** Errores de una figura { nodes, edges, angle? } (lista vacía si es válida). */
export function figureErrors(fig) {
  const errs = []
  const nodes = fig?.nodes
  const edges = fig?.edges
  if (!Array.isArray(nodes) || !Array.isArray(edges))
    return ['La figura necesita "nodes" y "edges".']
  if (nodes.length < FIGURE_LIMITS.minNodes || nodes.length > FIGURE_LIMITS.maxNodes)
    errs.push(`Tiene ${nodes.length} nodos (entre ${FIGURE_LIMITS.minNodes} y ${FIGURE_LIMITS.maxNodes}).`)
  if (nodes.some(n => !Array.isArray(n) || n.length < 2 || n.length > 3 || n.some(v => !Number.isFinite(v))))
    errs.push('Cada nodo es [x, y] o [x, y, tamaño entre 0 y 1].')
  if (edges.some(e => !Array.isArray(e) || e.length !== 2 || e.some(i => !Number.isInteger(i) || i < 0 || i >= nodes.length) || e[0] === e[1]))
    errs.push('Cada arista es [i, j] con índices de nodos distintos y existentes.')
  else if (new Set(edges.flat()).size < nodes.length)
    errs.push('Hay nodos sin aristas.')
  if (edges.length < FIGURE_LIMITS.minEdges || edges.length > FIGURE_LIMITS.maxEdges)
    errs.push(`Tiene ${edges.length} aristas (entre ${FIGURE_LIMITS.minEdges} y ${FIGURE_LIMITS.maxEdges}).`)
  const keys = new Set(edges.filter(Array.isArray).map(([i, j]) => (i < j ? `${i}-${j}` : `${j}-${i}`)))
  if (keys.size < edges.length)
    errs.push('Hay aristas repetidas.')
  if (fig.angle !== undefined && !Number.isFinite(fig.angle))
    errs.push('"angle" debe ser un número (grados).')
  return errs
}
