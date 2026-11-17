import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

/** Aplana fragmentos y quita comentarios y texto en blanco. */
export function flatten(nodes: VNode[] = []): VNode[] {
  return nodes.flatMap((n) => {
    if (n.type === Fragment)
      return flatten(n.children as VNode[])
    if (n.type === Comment)
      return []
    if (n.type === Text && !String(n.children ?? '').trim())
      return []
    return [n]
  })
}

/** Separa los títulos iniciales (h1, h2) del resto del contenido. */
export function splitHead(nodes: VNode[] = []) {
  const all = flatten(nodes)
  let i = 0
  while (i < all.length && (all[i].type === 'h1' || all[i].type === 'h2'))
    i++
  return { head: all.slice(0, i), body: all.slice(i) }
}
