<script setup lang="ts">
/**
 * Contenedor de color para dar énfasis dentro de una diapositiva (docs/11).
 * - clave: la idea que el público debe llevarse (color de la línea)
 * - nota: aclaración o definición (neutro)
 */
withDefaults(defineProps<{ title?: string, type?: 'clave' | 'nota' }>(), { type: 'clave' })
</script>

<template>
  <div class="plas-callout" :class="`plas-callout--${type}`">
    <span v-if="title" class="plas-callout__title">{{ title }}</span>
    <div class="plas-callout__body"><slot /></div>
  </div>
</template>

<style scoped>
.plas-callout { border-radius: var(--radius); padding: 14px 18px; border-left: 4px solid var(--base); }
.plas-callout--clave { background: var(--soft); }
.plas-callout--nota { background: var(--surface); border-left-color: var(--rule); }
.plas-callout__title { display: block; margin-bottom: 4px; font: 600 13px / 1.3 var(--font-display); color: var(--dark); letter-spacing: .02em; text-transform: uppercase; }
.plas-callout__body :deep(p) { margin: 0; font-size: 18px; line-height: 1.45; }
.plas-callout__body :deep(p + p) { margin-top: 8px; }
</style>
