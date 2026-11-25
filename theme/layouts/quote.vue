<script setup lang="ts">
import type { VNode } from 'vue'
import ContentFrame from '../components/ContentFrame.vue'

/** Cita destacada. Cuerpo: la cita con `>`. Frontmatter `cite`: quién y dónde ("Nombre, Obra, año"). Las citas largas (más de 180 caracteres) usan letra menor. */
defineProps<{ cite?: string }>()

function textOf(nodes: unknown): string {
  if (typeof nodes === 'string')
    return nodes
  if (Array.isArray(nodes))
    return nodes.map(textOf).join('')
  const n = nodes as VNode | null
  return n && typeof n === 'object' ? textOf(n.children) : ''
}
</script>

<template>
  <ContentFrame kind="quote">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div class="plas-quote" :class="{ 'is-long': textOf(Body()).length > 180 }">
        <component :is="Body" />
        <p v-if="cite" class="plas-quote__cite">— {{ cite }}</p>
      </div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-quote { padding: 0 40px 0 8px; }
.plas-quote :deep(blockquote) { border-left-width: 5px; padding-left: 28px; font-size: 30px; line-height: 1.4; }
.plas-quote.is-long :deep(blockquote) { font-size: 20px; line-height: 1.5; }
.plas-quote :deep(blockquote p) { font-size: inherit; margin: 0; }
.plas-quote__cite { margin: 16px 0 0 33px !important; font: 500 16px / 1.4 var(--font-display) !important; color: var(--dark) !important; }
.plas-quote.is-long .plas-quote__cite { font-size: 14px !important; }
</style>
