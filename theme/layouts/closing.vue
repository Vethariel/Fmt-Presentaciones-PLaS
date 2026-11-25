<script setup lang="ts">
import { computed } from 'vue'
import LogoRow from '../components/LogoRow.vue'
import NetworkMesh from '../components/NetworkMesh.vue'
import QrCode from '../components/QrCode.vue'
import TitleBlock from '../components/TitleBlock.vue'
import { resolveFigures } from '../composables/figures'
import { useHeadmatter } from '../composables/useHeadmatter'
import { usePlas } from '../composables/usePlas'

/**
 * Cierre (última diapositiva): mensaje, contacto y logos. Repite la malla de la
 * portada, como un marco. Toma ponente y correo del encabezado; con
 * themeConfig.webUrl muestra un QR a la versión web.
 */
const p = usePlas()
const head = useHeadmatter()
const PANEL: [number, number][] = [[632.4, 0], [960, 0], [960, 540], [540, 540]]
const BOX = { x: 660, y: 60, w: 260, h: 420 }
const figures = computed(() => resolveFigures(head.value.mesh))
const webUrl = computed(() => p.config.value.webUrl as string | undefined)
</script>

<template>
  <div class="slidev-layout plas plas-closing" :data-line="p.deckLine.value ?? undefined" :data-mono="p.mono.value">
    <div class="plas-closing__panel" />
    <NetworkMesh class="plas-closing__mesh" :region="PANEL" :seed="23" :figures="figures" :box="BOX" />
    <div class="plas-closing__text">
      <TitleBlock :reserve="100">
        <slot />
        <template #footer>
          <div class="plas-closing__contact">
            <div v-if="head.speaker || head.email" class="plas-closing__byline">
              <span v-if="head.speaker" class="plas-closing__name">{{ head.speaker }}</span>
              <span v-if="head.email" class="plas-closing__email">{{ head.email }}</span>
            </div>
            <div v-if="webUrl" class="plas-closing__qr">
              <QrCode :value="webUrl" :size="72" />
              <span>Versión web</span>
            </div>
          </div>
        </template>
      </TitleBlock>
    </div>
    <LogoRow class="plas-closing__logos" :height="40" />
    <div class="plas-stripe" />
  </div>
</template>

<style scoped>
.plas-closing__panel {
  position: absolute; top: 0; right: 0; bottom: 0; width: 420px;
  background: linear-gradient(168deg, var(--soft) 0%, color-mix(in srgb, var(--soft) 55%, #fff) 100%);
  clip-path: polygon(22% 0, 100% 0, 100% 100%, 0 100%);
}
.plas-closing__mesh { opacity: .55; }
.plas-closing__text { position: absolute; left: var(--gutter); top: 0; bottom: 0; width: 560px; }
/* La diagonal del panel va de x = 632 (arriba) a x = 540 (abajo): el texto no debe tocarla */
.plas-closing__text :deep(h1) { max-width: 530px; }
.plas-closing__text :deep(h2), .plas-closing__text :deep(p), .plas-closing__byline { max-width: 470px; }
.plas-closing__text :deep(h1) { font-size: 52px; line-height: 1.05; letter-spacing: -0.025em; }
.plas-closing__text :deep(h2) { font-size: 22px; margin-top: 16px; }
.plas-closing__text :deep(p) { color: var(--muted); font-size: 17px; margin-top: 14px; }
.plas-closing__contact { display: flex; align-items: flex-end; gap: 28px; }
.plas-closing__byline { display: flex; flex-direction: column; gap: 1px; }
.plas-closing__name { font: 600 16px / 1.3 var(--font-display); color: var(--ink); }
.plas-closing__email { font-size: 14px; color: var(--dark); }
.plas-closing__qr { display: flex; align-items: center; gap: 8px; font: 500 11.5px / 1.3 var(--font-display); color: var(--muted); }
.plas-closing__logos { position: absolute; left: var(--gutter); bottom: 34px; }
</style>
