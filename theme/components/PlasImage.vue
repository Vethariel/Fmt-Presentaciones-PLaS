<script setup lang="ts">
import { computed } from 'vue'

/**
 * Imagen del tema con pie y crédito (docs/11 §4).
 * `credit`: "Propia" (no se muestra), "Generada con IA (herramienta)" o
 * "Autor · Licencia · Fuente" (se muestra en pequeño: lo exigen las licencias CC BY).
 */
const props = withDefaults(defineProps<{
  src: string
  caption?: string
  credit?: string
  alt?: string
  /** cover: llena el marco recortando; contain: se ve entera */
  fit?: 'cover' | 'contain'
}>(), { fit: 'cover' })

const shownCredit = computed(() => (props.credit && !/^propia\b/i.test(props.credit.trim()) ? props.credit : ''))
</script>

<template>
  <figure class="plas-img" :class="`plas-img--${fit}`">
    <div class="plas-img__frame">
      <img :src="src" :alt="alt ?? caption ?? ''">
    </div>
    <figcaption v-if="caption || shownCredit">
      <span v-if="caption" class="plas-img__caption">{{ caption }}</span>
      <span v-if="shownCredit" class="plas-img__credit">{{ shownCredit }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.plas-img { margin: 0; display: flex; flex-direction: column; min-height: 0; min-width: 0; height: 100%; }
.plas-img__frame { flex: 1; min-height: 0; border-radius: var(--radius); overflow: hidden; background: var(--surface); }
.plas-img__frame img { width: 100%; height: 100%; display: block; }
.plas-img--cover img { object-fit: cover; }
.plas-img--contain img { object-fit: contain; }
figcaption { flex: none; display: flex; flex-direction: column; gap: 1px; margin-top: 6px; }
.plas-img__caption { font: 400 13.5px / 1.35 var(--font-body); color: var(--ink); }
.plas-img__credit { font: 400 10.5px / 1.3 var(--font-body); color: var(--muted); }
</style>
