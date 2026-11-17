<script setup lang="ts">
import unal from '../assets/escudo-unal-negro.svg?url'
import plas from '../assets/plas-logo.svg?url'

withDefaults(defineProps<{
  /** Altura de la fila en px */
  height?: number
  /** Texto de la dependencia, entre los dos logos */
  unit?: string[]
}>(), {
  height: 40,
  unit: () => ['Facultad de Ingeniería', 'Depto. de Ingeniería de Sistemas e Industrial'],
})
</script>

<template>
  <div class="plas-logos" :style="{ '--h': `${height}px` }">
    <img :src="unal" alt="Universidad Nacional de Colombia" class="plas-logos__unal">
    <span class="plas-logos__sep" />
    <span class="plas-logos__unit"><span v-for="u in unit" :key="u">{{ u }}</span></span>
    <span class="plas-logos__sep" />
    <img :src="plas" alt="PLaS — Programming Languages and Systems" class="plas-logos__plas">
  </div>
</template>

<style scoped>
.plas-logos { display: flex; align-items: center; gap: 16px; height: var(--h); }
.plas-logos__unal { height: calc(var(--h) * 1.05); }
.plas-logos__plas { height: calc(var(--h) * 0.95); }
.plas-logos__sep { width: 1px; align-self: stretch; background: var(--rule); }
.plas-logos__unit {
  display: flex; flex-direction: column; gap: 2px;
  font: 500 11px / 1.25 var(--font-display); color: var(--muted);
}
</style>
