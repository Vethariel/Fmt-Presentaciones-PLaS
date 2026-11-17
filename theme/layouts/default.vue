<script setup lang="ts">
import { useSlots } from 'vue'
import PlasChrome from '../components/PlasChrome.vue'
import { usePlas } from '../composables/usePlas'
import { splitHead } from '../utils/vnodes'

/** Contenido general. Slot opcional `::aside::` (columna derecha de 300 px). */
const p = usePlas()
const slots = useSlots()
const Head = () => splitHead(slots.default?.()).head
const Body = () => splitHead(slots.default?.()).body
</script>

<template>
  <div class="slidev-layout plas plas-default" :data-line="p.line.value ?? undefined" :data-mono="p.mono.value">
    <PlasChrome />
    <div class="plas-content">
      <header class="plas-content__head"><Head /></header>
      <div class="plas-content__body" :class="{ 'has-aside': !!$slots.aside }">
        <div class="plas-content__main"><Body /></div>
        <aside v-if="$slots.aside" class="plas-content__aside"><slot name="aside" /></aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plas-content__body.has-aside { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 36px; }
</style>
