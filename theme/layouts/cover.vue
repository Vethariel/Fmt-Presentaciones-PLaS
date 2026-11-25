<script setup lang="ts">
import { computed } from 'vue'
import LogoRow from '../components/LogoRow.vue'
import NetworkMesh from '../components/NetworkMesh.vue'
import TitleBlock from '../components/TitleBlock.vue'
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

/** Polígono del panel en coordenadas de la diapositiva (igual que su clip-path). */
const PANEL: [number, number][] = [[632.4, 0], [960, 0], [960, 540], [540, 540]]
/** Espacio inferior que ocupan los logos (la firma queda justo encima). */
const LOGOS_RESERVE = 100
/** Caja de la figura dentro del panel. */
const BOX = { x: 660, y: 60, w: 260, h: 420 }
const figures = computed(() => resolveFigures(props.mesh))
</script>

<template>
  <div class="slidev-layout plas plas-cover" :data-line="p.deckLine.value ?? undefined" :data-mono="p.mono.value">
    <div class="plas-cover__panel" />
    <NetworkMesh class="plas-cover__mesh" :region="PANEL" :seed="11" :figures="figures" :box="BOX" />
    <div class="plas-cover__text">
      <!-- Título centrado en la diapositiva; si crece, sube sin invadir la firma -->
      <TitleBlock :reserve="LOGOS_RESERVE">
        <slot />
        <template #footer>
          <div v-if="speaker || email || place || date" class="plas-cover__byline">
            <span v-if="speaker" class="plas-cover__name">{{ speaker }}</span>
            <span v-if="email" class="plas-cover__email">{{ email }}</span>
            <span v-if="place" class="plas-cover__place">{{ place }}</span>
            <span v-if="date" class="plas-cover__date">{{ date }}</span>
          </div>
        </template>
      </TitleBlock>
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
/* Columna izquierda: TitleBlock centra el título en la diapositiva y ancla la firma */
.plas-cover__text { position: absolute; left: var(--gutter); top: 0; bottom: 0; width: 560px; }
/* La diagonal del panel va de x = 632 (arriba) a x = 540 (abajo): el texto no debe tocarla */
.plas-cover__text :deep(h1) { max-width: 530px; }
.plas-cover__text :deep(h2), .plas-cover__text :deep(p), .plas-cover__byline { max-width: 470px; }
.plas-cover__text :deep(h1) { font-size: 52px; line-height: 1.05; letter-spacing: -0.025em; }
.plas-cover__text :deep(h2) { font-size: 22px; margin-top: 16px; }
.plas-cover__text :deep(p) { color: var(--muted); font-size: 17px; margin-top: 14px; }
/* Firma: datos secundarios, por debajo del título (docs/09 §portada) */
.plas-cover__byline { display: flex; flex-direction: column; gap: 1px; }
.plas-cover__name { font: 600 16px / 1.3 var(--font-display); color: var(--ink); }
.plas-cover__email { font-size: 14px; color: var(--dark); }
.plas-cover__place { margin-top: 6px; font: 400 13px / 1.35 var(--font-body); color: var(--muted); }
.plas-cover__date { margin-top: 2px; font: 500 11.5px / 1.3 var(--font-display); color: var(--muted); letter-spacing: .06em; text-transform: uppercase; }
.plas-cover__logos { position: absolute; left: var(--gutter); bottom: 34px; }
</style>
