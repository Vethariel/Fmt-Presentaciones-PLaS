<script setup lang="ts">
import ContentFrame from '../components/ContentFrame.vue'

/** Dos columnas paralelas o en comparación. Izquierda: el cuerpo; derecha: `::right::`. Cada una puede empezar con `### Encabezado`. */
</script>

<template>
  <ContentFrame kind="two-cols">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div class="plas-cols">
        <div class="plas-cols__col"><component :is="Body" /></div>
        <div class="plas-cols__col"><slot name="right" /></div>
      </div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: start; }
.plas-cols__col { min-width: 0; }
.plas-cols__col :deep(h3) { margin: 0 0 12px; padding-bottom: 6px; border-bottom: 2px solid var(--base); }
.plas-cols__col :deep(p) { font-size: 18px; }
.plas-cols__col > :deep(:last-child) { margin-bottom: 0; }
</style>
