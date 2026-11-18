<script setup lang="ts">
import { computed } from 'vue'
import LogoRow from '../components/LogoRow.vue'
import NetworkMesh from '../components/NetworkMesh.vue'
import { resolveFigures } from '../composables/figures'
import { usePlas } from '../composables/usePlas'

const props = defineProps<{
  /** Ponente. (`author` está reservado por Slidev) */
  speaker?: string
  email?: string
  place?: string
  date?: string
  /** Figura de la malla (opcional, docs/07 §6) */
  mesh?: unknown
}>()
const p = usePlas()
const meta = computed(() => [props.place, props.date].filter(Boolean).join(' · '))

/** Polígono del panel en coordenadas de la diapositiva (igual que su clip-path). */
const PANEL: [number, number][] = [[632.4, 0], [960, 0], [960, 540], [540, 540]]
/** Caja de la figura dentro del panel. */
const BOX = { x: 660, y: 60, w: 260, h: 420 }
const figures = computed(() => resolveFigures(props.mesh))
</script>

<template>
  <div class="slidev-layout plas plas-cover" :data-line="p.deckLine.value ?? undefined" :data-mono="p.mono.value">
    <div class="plas-cover__panel" />
    <NetworkMesh class="plas-cover__mesh" :region="PANEL" :seed="11" :figures="figures" :box="BOX" />
    <div class="plas-cover__text">
      <slot />
      <div v-if="speaker || email" class="plas-cover__author">
        <span v-if="speaker" class="plas-cover__name">{{ speaker }}</span>
        <span v-if="email" class="plas-cover__email">{{ email }}</span>
      </div>
      <div v-if="meta" class="plas-cover__meta">{{ meta }}</div>
    </div>
    <LogoRow class="plas-cover__logos" :height="40" />
    <div class="plas-stripe" />
  </div>
</template>

<style scoped>
.plas-cover__panel {
  position: absolute; top: 0; right: 0; bottom: 0; width: 420px;
  background: linear-gradient(168deg, var(--soft) 0%, color-mix(in srgb, var(--soft) 55%, #fff) 100%);
  clip-path: polygon(22% 0, 100% 0, 100% 100%, 0 100%);
}
.plas-cover__mesh { opacity: .55; }
.plas-cover__text { position: absolute; left: var(--gutter); top: 120px; width: 560px; }
.plas-cover__text :deep(h1) { font-size: 44px; line-height: 1.08; letter-spacing: -0.02em; }
.plas-cover__text :deep(h2) { font-size: 21px; margin-top: 12px; }
.plas-cover__text :deep(p) { color: var(--muted); font-size: 17px; margin-top: 14px; }
.plas-cover__author { display: flex; flex-direction: column; gap: 2px; margin-top: 30px; }
.plas-cover__name { font: 600 18px / 1.3 var(--font-display); color: var(--ink); }
.plas-cover__email { font-size: 15px; color: var(--dark); }
.plas-cover__meta { margin-top: 14px; font: 500 12.5px / 1.3 var(--font-display); color: var(--muted); letter-spacing: .04em; text-transform: uppercase; }
.plas-cover__logos { position: absolute; left: var(--gutter); bottom: 34px; }
</style>
