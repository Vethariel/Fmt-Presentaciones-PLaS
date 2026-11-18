<script setup lang="ts">
/**
 * Embudo de la introducción: de la motivación general a los objetivos.
 * `paso` (0–3) marca la parte activa. Web: avanza con los clics.
 * PDF: se usa `compacto` dentro de <Frames>, un embudo por paso.
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{ paso?: number, compacto?: boolean }>(), { paso: 0, compacto: false })
const partes = ['Motivación', 'Trabajos relacionados', 'Problema de investigación', 'Objetivos']
const p = computed(() => Math.max(0, Math.min(3, props.paso)))

// Posición vertical de la flecha y del resalte según el paso
const flechaY = [0, 62, 128, 196]
</script>

<template>
  <div class="embudo" :class="{ 'embudo--compacto': compacto }">
    <svg class="embudo__svg" viewBox="0 0 240 240" role="img" :aria-label="`Embudo: ${partes[p]}`">
      <!-- resaltes -->
      <ellipse v-if="p === 0" cx="120" cy="44" rx="116" ry="34" class="embudo__resalte" />
      <ellipse v-if="p === 1" cx="120" cy="110" rx="72" ry="17" class="embudo__resalte" />
      <!-- cuerpo -->
      <ellipse cx="120" cy="44" rx="100" ry="24" class="embudo__trazo" />
      <ellipse cx="120" cy="44" rx="88" ry="17" class="embudo__trazo" />
      <path d="M20,44 L108,178 M220,44 L132,178" class="embudo__trazo" />
      <path d="M108,178 Q120,186 132,178" class="embudo__trazo" />
      <ellipse v-if="p >= 2" cx="120" cy="178" rx="12" ry="5" class="embudo__foco" />
      <text v-if="p >= 1 && p <= 2" x="120" y="120" class="embudo__acotar">Acotar</text>
      <!-- flecha -->
      <path
        class="embudo__flecha" :class="{ 'embudo__flecha--fuera': p === 3 }"
        :transform="`translate(120 ${flechaY[p]})`"
        d="M-7,0 H7 V10 H15 L0,26 L-15,10 H-7 Z"
      />
      <text v-if="p === 3" x="120" y="236" class="embudo__salida">¿Qué voy a hacer?</text>
    </svg>
    <ol v-if="!compacto" class="embudo__partes">
      <li v-for="(t, i) in partes" :key="t" :class="{ activa: i === p }">{{ t }}</li>
    </ol>
  </div>
</template>

<style scoped>
.embudo { display: grid; grid-template-columns: 260px 1fr; gap: 56px; align-items: center; }
.embudo--compacto { display: block; }
.embudo__svg { width: 100%; height: auto; overflow: visible; }
.embudo--compacto .embudo__svg { max-height: 190px; }
.embudo__trazo { fill: none; stroke: var(--base); stroke-width: 1.6; }
.embudo__resalte { fill: var(--soft); transition: all .35s ease; }
.embudo__foco { fill: var(--dark); }
.embudo__flecha { fill: var(--dark); transition: transform .35s ease; }
.embudo__acotar { font: 600 14px var(--font-display); fill: var(--ink); text-anchor: middle; }
.embudo__salida { font: 600 15px var(--font-display); fill: var(--dark); text-anchor: middle; }
.slidev-layout.plas .embudo__partes { margin: 0; padding-left: 1.4em; font-size: 22px; }
.slidev-layout.plas .embudo__partes li { margin: 0 0 12px; color: var(--muted); transition: color .25s; }
.slidev-layout.plas .embudo__partes li.activa { color: var(--dark); font-weight: 650; }
</style>
