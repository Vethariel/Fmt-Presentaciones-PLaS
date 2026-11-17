<script setup lang="ts">
import { useSlots } from 'vue'
import PlasChrome from '../components/PlasChrome.vue'
import { usePlas } from '../composables/usePlas'
import { splitHead } from '../utils/vnodes'

/** Herramienta interactiva a casi toda la diapositiva. El cuerpo debe ser un <Interactive>. */
const p = usePlas()
const slots = useSlots()
const Head = () => splitHead(slots.default?.()).head
const Body = () => splitHead(slots.default?.()).body
</script>

<template>
  <div class="slidev-layout plas plas-interactive-layout" :data-line="p.line.value ?? undefined" :data-mono="p.mono.value">
    <PlasChrome />
    <div class="plas-content">
      <header class="plas-content__head"><Head /></header>
      <div class="plas-content__body"><Body /></div>
    </div>
  </div>
</template>
