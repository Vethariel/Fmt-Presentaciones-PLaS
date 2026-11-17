<script setup lang="ts">
import { computed } from 'vue'
import NetworkMesh from '../components/NetworkMesh.vue'
import symbol from '../assets/plas-symbol.svg?url'
import { usePlas } from '../composables/usePlas'

/** Separador de sección. Frontmatter: `line` (color), `question` (opcional). */
defineProps<{ question?: string }>()
const p = usePlas()
const num = computed(() => String(p.section.value?.index ?? 0).padStart(2, '0'))
</script>

<template>
  <div class="slidev-layout plas plas-section" :data-line="p.line.value ?? undefined" :data-mono="p.mono.value">
    <div class="plas-section__panel">
      <NetworkMesh :width="340" :height="330" :nodes="14" :seed="(p.section.value?.index ?? 1) * 17" />
      <span class="plas-section__num">{{ num }}</span>
    </div>
    <div class="plas-section__text">
      <slot />
      <p v-if="question" class="plas-section__question">{{ question }}</p>
    </div>
    <img :src="symbol" alt="PLaS" class="plas-section__symbol">
    <div class="plas-stripe" />
  </div>
</template>

<style scoped>
.plas-section__panel {
  position: absolute; top: 0; left: 0; bottom: 0; width: 380px; background: var(--soft);
  clip-path: polygon(0 0, 100% 0, 78% 100%, 0 100%);
}
.plas-section__panel :deep(.plas-mesh) { position: absolute; left: 0; top: 10px; opacity: .5; }
.plas-section__num {
  position: absolute; left: var(--gutter); bottom: 48px;
  font: 700 120px / 1 var(--font-display); letter-spacing: -0.04em; color: var(--deep);
}
.plas-section__text { position: absolute; left: 400px; right: var(--gutter); top: 50%; transform: translateY(-50%); }
.plas-section__text::before { content: ''; display: block; width: 48px; height: 6px; border-radius: 3px; background: var(--base); margin-bottom: 20px; }
.plas-section__text :deep(h1) { font-size: 40px; line-height: 1.1; }
.plas-section__question { margin-top: 18px !important; font: italic 400 22px / 1.4 var(--font-quote); color: var(--dark); }
.plas-section__symbol { position: absolute; right: 44px; top: 18px; width: 26px; }
</style>
