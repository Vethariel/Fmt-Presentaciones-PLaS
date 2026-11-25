<script setup lang="ts">
import ContentFrame from '../components/ContentFrame.vue'
import PlasImage from '../components/PlasImage.vue'

/** Imagen protagonista con pie. Frontmatter: image, credit, caption?, alt?, fit (contain|cover). El cuerpo (opcional) es una línea de comentario. */
withDefaults(defineProps<{
  image?: string
  credit?: string
  caption?: string
  alt?: string
  fit?: 'cover' | 'contain'
}>(), { fit: 'contain' })
</script>

<template>
  <ContentFrame kind="image">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <PlasImage v-if="image" class="plas-image__img" :src="image" :credit="credit" :caption="caption" :alt="alt" :fit="fit" />
      <div class="plas-image__note"><component :is="Body" /></div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-image__img { flex: 1; min-height: 0; }
.plas-image__note :deep(p) { margin: 10px 0 0; font-size: var(--fs-small); color: var(--muted); }
.plas-image__note:empty { display: none; }
</style>
