<script setup lang="ts">
/** Tarjeta de proyecto (maqueta "project" del catálogo, docs/03 §6). */
defineProps<{
  title: string
  kind?: string
  level?: string
  people?: string
  funding?: string
}>()
</script>

<template>
  <div class="plas-project">
    <span class="plas-project__kind">{{ kind ?? 'Proyecto' }}</span>
    <h3 class="plas-project__title">{{ title }}</h3>
    <div class="plas-project__body"><slot /></div>
    <dl class="plas-project__meta">
      <template v-if="level"><dt>Nivel</dt><dd>{{ level }}</dd></template>
      <template v-if="people"><dt>Equipo</dt><dd>{{ people }}</dd></template>
      <template v-if="funding"><dt>Financiación</dt><dd>{{ funding }}</dd></template>
    </dl>
  </div>
</template>

<style scoped>
.plas-project {
  background: var(--soft); border-left: 4px solid var(--base); border-radius: var(--radius);
  padding: 18px 20px; font-size: var(--fs-small); line-height: 1.45;
}
.plas-project__kind {
  display: inline-block; padding: 2px 8px; border-radius: 4px; background: #fff;
  font: 600 11px / 1.4 var(--font-display); color: var(--dark); letter-spacing: .02em; text-transform: uppercase;
}
.plas-project__title { margin: 10px 0 6px !important; font-size: 19px !important; color: var(--deep) !important; }
.plas-project__body :deep(p) { margin: 0 0 10px; font-size: var(--fs-small); }
.plas-project__meta { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; margin: 10px 0 0; }
.plas-project__meta dt { font: 600 12.5px / 1.45 var(--font-display); color: var(--dark); }
.plas-project__meta dd { margin: 0; color: var(--ink); }
</style>
