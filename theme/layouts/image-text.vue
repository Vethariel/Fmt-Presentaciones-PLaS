<script setup lang="ts">
import ContentFrame from '../components/ContentFrame.vue'
import PlasImage from '../components/PlasImage.vue'

/** Imagen a un lado y texto al otro. Frontmatter: image, credit, caption?, alt?, side (left|right), fit (cover|contain). */
withDefaults(defineProps<{
  image?: string
  credit?: string
  caption?: string
  alt?: string
  side?: 'left' | 'right'
  fit?: 'cover' | 'contain'
}>(), { side: 'left', fit: 'cover' })
</script>

<template>
  <ContentFrame kind="image-text">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div class="plas-it" :class="{ 'is-right': side === 'right' }">
        <PlasImage v-if="image" class="plas-it__img" :src="image" :credit="credit" :caption="caption" :alt="alt" :fit="fit" />
        <div class="plas-it__text"><component :is="Body" /></div>
      </div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-it { flex: 1; min-height: 0; display: grid; grid-template-columns: 46% 1fr; gap: 36px; align-items: center; }
.plas-it.is-right { grid-template-columns: 1fr 46%; }
.plas-it.is-right .plas-it__img { order: 2; }
.plas-it__img { height: 100%; }
.plas-it__text { min-width: 0; }
.plas-it__text > :deep(:last-child) { margin-bottom: 0; }
</style>
