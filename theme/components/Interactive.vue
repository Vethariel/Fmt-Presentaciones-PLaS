<script setup lang="ts">
/**
 * Contenedor de herramientas interactivas (docs/03 §5).
 * Web: slot por defecto (la herramienta). PDF: slot #print + QR al enlace web.
 * El slot #print es obligatorio (lo verifica plas check).
 */
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import QrCode from './QrCode.vue'

const props = defineProps<{
  /** Enlace a la versión interactiva. Por defecto: themeConfig.webUrl + número de diapositiva */
  href?: string
  /** Texto que acompaña al QR en el PDF */
  caption?: string
}>()

const { isPrintMode } = useNav()
const { $slidev, $page } = useSlideContext()
const url = computed(() => {
  if (props.href)
    return props.href
  const base = ($slidev as any)?.configs?.themeConfig?.webUrl as string | undefined
  return base ? `${base.replace(/\/$/, '')}/${$page.value}` : ''
})
</script>

<template>
  <div class="plas-interactive" :class="{ 'is-print': isPrintMode }">
    <template v-if="!isPrintMode">
      <span class="plas-interactive__badge">Interactivo</span>
      <slot />
    </template>
    <template v-else>
      <div class="plas-interactive__snapshot">
        <slot name="print" />
      </div>
      <div v-if="url" class="plas-interactive__qr">
        <QrCode :value="url" :size="92" />
        <span>{{ caption ?? 'Pruébelo en la versión web' }}</span>
        <small>{{ url.replace(/^https?:\/\//, '') }}</small>
      </div>
    </template>
  </div>
</template>

<style scoped>
.plas-interactive { position: relative; height: 100%; border: 1px solid var(--rule); border-radius: var(--radius); padding: 18px 20px; }
.plas-interactive__badge {
  position: absolute; top: -10px; left: 16px; padding: 2px 8px; border-radius: 4px;
  background: var(--dark); color: #fff; font: 600 11px / 1.4 var(--font-display); letter-spacing: .02em;
}
.plas-interactive.is-print { display: grid; grid-template-columns: 1fr 150px; gap: 20px; }
.plas-interactive__snapshot { min-width: 0; }
.plas-interactive__qr {
  display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center;
  border-left: 1px solid var(--rule); padding-left: 16px;
  font: 600 12px / 1.3 var(--font-display); color: var(--dark);
}
.plas-interactive__qr small { font: 400 10px / 1.3 var(--font-body); color: var(--muted); word-break: break-all; }
</style>
