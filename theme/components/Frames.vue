<script setup lang="ts">
/**
 * Tira de fotogramas clave: versión impresa de una animación (docs/03 §5).
 * Cada hijo directo es un fotograma.
 */
import { computed, h, useSlots } from 'vue'
import { flatten } from '../utils/vnodes'

const props = defineProps<{ labels?: string[] }>()
const slots = useSlots()

const Strip = () => {
  const items = flatten(slots.default?.() ?? [])
  return h('div', { class: 'plas-frames', style: { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` } },
    items.map((v, i) => h('figure', { class: 'plas-frames__item' }, [
      h('figcaption', null, [h('span', { class: 'plas-frames__n' }, String(i + 1)), props.labels?.[i] ?? `Paso ${i + 1}`]),
      v,
    ])))
}
</script>

<template>
  <Strip />
</template>

<style>
.plas-frames { display: grid; gap: 14px; align-items: start; }
.plas-frames__item { margin: 0; min-width: 0; }
.plas-frames__item figcaption {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  font: 600 12.5px / 1 var(--font-display); color: var(--dark);
}
.plas-frames__n {
  display: inline-grid; place-items: center; width: 18px; height: 18px; border-radius: 50%;
  background: var(--dark); color: #fff; font-size: 11px;
}
.plas-frames__item .slidev-code { --slidev-code-font-size: 12px; --slidev-code-padding: 10px 12px; }
</style>
