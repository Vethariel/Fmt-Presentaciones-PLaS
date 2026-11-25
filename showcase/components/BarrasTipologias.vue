<script setup lang="ts">
/** Gráfico propio de ejemplo (datos ilustrativos): cómo hacer un gráfico como componente con los colores del tema, sin hex. */
const data = [
  { label: 'default', n: 4 },
  { label: 'image-text', n: 2 },
  { label: 'two-cols', n: 1 },
  { label: 'table', n: 1 },
  { label: 'gallery', n: 1 },
  { label: 'quote', n: 1 },
]
const max = Math.max(...data.map(d => d.n))
</script>

<template>
  <svg class="barras" viewBox="0 0 400 250" role="img" aria-label="Diapositivas por tipología">
    <g v-for="(d, i) in data" :key="d.label" :transform="`translate(0, ${i * 40 + 8})`">
      <text x="96" y="20" text-anchor="end" class="barras__label">{{ d.label }}</text>
      <rect x="106" y="4" :width="(d.n / max) * 260" height="24" rx="4" :class="i === 0 ? 'barras__bar--top' : 'barras__bar'" />
      <text :x="112 + (d.n / max) * 260" y="21" class="barras__value">{{ d.n }}</text>
    </g>
  </svg>
</template>

<style scoped>
.barras { width: 100%; height: auto; max-height: 100%; }
.barras__label { font: 500 14px var(--font-code); fill: var(--ink); }
.barras__value { font: 600 15px var(--font-display); fill: var(--dark); }
.barras__bar { fill: var(--soft); stroke: var(--base); stroke-width: 1.5; }
.barras__bar--top { fill: var(--base); }
</style>
