<script setup lang="ts">
import QRCode from 'qrcode'
import { computed } from 'vue'

const props = withDefaults(defineProps<{ value: string, size?: number }>(), { size: 96 })

const qr = computed(() => {
  const m = QRCode.create(props.value, { errorCorrectionLevel: 'M' }).modules
  const n = m.size
  let d = ''
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (m.get(y, x))
        d += `M${x} ${y}h1v1h-1z`
    }
  }
  return { n, d }
})
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`-2 -2 ${qr.n + 4} ${qr.n + 4}`" shape-rendering="crispEdges" role="img" :aria-label="`Código QR: ${value}`">
    <rect x="-2" y="-2" :width="qr.n + 4" :height="qr.n + 4" fill="#fff" />
    <path :d="qr.d" fill="var(--ink)" />
  </svg>
</template>
