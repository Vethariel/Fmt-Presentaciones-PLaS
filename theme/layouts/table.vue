<script setup lang="ts">
import ContentFrame from '../components/ContentFrame.vue'

/** Tabla con comentario. Cuerpo: una tabla Markdown. `::comment::`: qué mirar en ella (columna derecha de color). */
</script>

<template>
  <ContentFrame kind="table">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div class="plas-table" :class="{ 'has-comment': !!$slots.comment }">
        <div class="plas-table__main"><component :is="Body" /></div>
        <aside v-if="$slots.comment" class="plas-table__comment"><slot name="comment" /></aside>
      </div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-table.has-comment { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 32px; align-items: center; }
.plas-table__main :deep(table) { font-size: 16px; }
.plas-table__main > :deep(:last-child) { margin-bottom: 0; }
.plas-table__comment { background: var(--soft); border-left: 4px solid var(--base); border-radius: var(--radius); padding: 16px 18px; }
.plas-table__comment :deep(p) { margin: 0; font-size: 16.5px; line-height: 1.45; }
.plas-table__comment :deep(p + p) { margin-top: 8px; }
</style>
