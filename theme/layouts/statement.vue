<script setup lang="ts">
import ContentFrame from '../components/ContentFrame.vue'

/** Idea clave en un contenedor de color. Primer párrafo: la idea (grande); el resto, apoyo breve. */
</script>

<template>
  <ContentFrame kind="statement">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div class="plas-statement"><component :is="Body" /></div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-statement { background: var(--soft); border-left: 6px solid var(--base); border-radius: var(--radius); padding: 30px 36px; }
.plas-statement > :deep(p:first-child) { margin: 0; font: 600 30px / 1.25 var(--font-display); color: var(--deep); letter-spacing: -0.01em; }
.plas-statement > :deep(p:first-child strong) { color: var(--dark); }
.plas-statement > :deep(:not(:first-child)) { margin-top: 14px; font-size: 18px; color: var(--ink); }
.plas-statement > :deep(:last-child) { margin-bottom: 0; }
</style>
