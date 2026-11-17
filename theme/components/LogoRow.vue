<script setup lang="ts">
import unal from '../assets/escudo-unal-negro.svg?url'
import fibog from '../assets/fibog-positivo.svg?url'
import plas from '../assets/plas-logo.svg?url'

/** Fila de logos: UNAL │ Facultad de Ingeniería (fibog) │ PLaS. */
withDefaults(defineProps<{
  /** Altura de la fila en px */
  height?: number
}>(), { height: 40 })
</script>

<template>
  <div class="plas-logos" :style="{ '--h': `${height}px` }">
    <img :src="unal" alt="Universidad Nacional de Colombia" class="plas-logos__unal">
    <span class="plas-logos__sep" />
    <img :src="fibog" alt="Facultad de Ingeniería — Universidad Nacional de Colombia, sede Bogotá" class="plas-logos__fibog">
    <span class="plas-logos__sep" />
    <img :src="plas" alt="PLaS — Programming Languages and Systems" class="plas-logos__plas">
  </div>
</template>

<style scoped>
.plas-logos { display: flex; align-items: center; gap: 16px; height: var(--h); }
.plas-logos__unal { height: calc(var(--h) * 1.05); }
.plas-logos__fibog { height: calc(var(--h) * 0.95); }
.plas-logos__plas { height: calc(var(--h) * 0.95); }
.plas-logos__sep { width: 1px; align-self: stretch; background: var(--rule); }
</style>
