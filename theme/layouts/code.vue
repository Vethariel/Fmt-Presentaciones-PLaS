<script setup lang="ts">
import { useSlots } from 'vue'
import PlasChrome from '../components/PlasChrome.vue'
import { usePlas } from '../composables/usePlas'
import { splitHead } from '../utils/vnodes'

/** Código como protagonista. Animaciones con magic-move dentro de <WebOnly> + <Frames> en <PrintOnly>. */
const p = usePlas()
const slots = useSlots()
const Head = () => splitHead(slots.default?.()).head
const Body = () => splitHead(slots.default?.()).body
</script>

<template>
  <div class="slidev-layout plas plas-code" :data-line="p.line.value ?? undefined" :data-mono="p.mono.value">
    <PlasChrome />
    <div class="plas-content">
      <header class="plas-content__head"><Head /></header>
      <div class="plas-content__body"><Body /></div>
    </div>
  </div>
</template>

<style scoped>
.plas-code { --slidev-code-font-size: 16px; }
.plas-code .plas-content__body :deep(p) { font-size: var(--fs-small); color: var(--muted); }
</style>
