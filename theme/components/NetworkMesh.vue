<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'

/**
 * Malla de grafos (motivo del sitio web PLaS).
 * Web: nodos que "respiran" y aristas con flujo. PDF: estática (misma composición).
 */
const props = withDefaults(defineProps<{
  width?: number
  height?: number
  nodes?: number
  seed?: number
  /** Color: cualquier valor CSS; por defecto el color de la línea */
  color?: string
}>(), { width: 400, height: 540, nodes: 22, seed: 7, color: 'var(--base)' })

const { isPrintMode } = useNav()

function rng(seed: number) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const graph = computed(() => {
  const r = rng(props.seed)
  const m = 24
  const pts = Array.from({ length: props.nodes }, (_, i) => ({
    i,
    x: m + r() * (props.width - 2 * m),
    y: m + r() * (props.height - 2 * m),
    r: 3 + r() * 5,
    d: r() * 4,
  }))
  const edges: { a: typeof pts[number], b: typeof pts[number], k: string, d: number }[] = []
  const seen = new Set<string>()
  for (const p of pts) {
    const near = pts.filter(q => q !== p)
      .map(q => ({ q, dist: Math.hypot(p.x - q.x, p.y - q.y) }))
      .sort((u, v) => u.dist - v.dist).slice(0, 2)
    for (const { q } of near) {
      const k = [p.i, q.i].sort((a, b) => a - b).join('-')
      if (!seen.has(k)) { seen.add(k); edges.push({ a: p, b: q, k, d: r() * 3 }) }
    }
  }
  return { pts, edges }
})
</script>

<template>
  <svg class="plas-mesh" :class="{ 'is-static': isPrintMode }" :viewBox="`0 0 ${width} ${height}`"
       :width="width" :height="height" :style="{ color }" aria-hidden="true">
    <g class="plas-mesh__edges">
      <line v-for="e in graph.edges" :key="e.k" :x1="e.a.x" :y1="e.a.y" :x2="e.b.x" :y2="e.b.y"
            :style="{ animationDelay: `${-e.d}s` }" />
    </g>
    <g class="plas-mesh__nodes">
      <circle v-for="p in graph.pts" :key="p.i" :cx="p.x" :cy="p.y" :r="p.r"
              :style="{ animationDelay: `${-p.d}s`, transformOrigin: `${p.x}px ${p.y}px` }" />
    </g>
  </svg>
</template>

<style scoped>
.plas-mesh { display: block; overflow: visible; }
.plas-mesh__edges line {
  stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; opacity: 0.45;
  stroke-dasharray: 6 5; animation: plas-flow 3s linear infinite;
}
.plas-mesh__nodes circle {
  fill: currentColor; opacity: 0.85;
  animation: plas-breathe 4s ease-in-out infinite;
}
.plas-mesh.is-static line, .plas-mesh.is-static circle { animation: none; }
.plas-mesh.is-static line { stroke-dasharray: none; }
@keyframes plas-flow { to { stroke-dashoffset: -22; } }
@keyframes plas-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.35); } }
</style>
