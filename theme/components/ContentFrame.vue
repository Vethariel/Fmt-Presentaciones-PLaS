<script setup lang="ts">
import { useSlots } from 'vue'
import { usePlas } from '../composables/usePlas'
import { splitHead } from '../utils/vnodes'
import PlasChrome from './PlasChrome.vue'

/**
 * Armazón común de las maquetas de contenido: cabecera del tema, título y
 * subtítulo (los `#` y `##` iniciales) y cuerpo. La maqueta recibe el resto del
 * contenido en el slot `body` como componente `Body`.
 */
defineProps<{ kind: string }>()
const p = usePlas()
const slots = useSlots()
const Head = () => splitHead(slots.content?.()).head
const Body = () => splitHead(slots.content?.()).body
</script>

<template>
  <div class="slidev-layout plas" :class="`plas-layout--${kind}`" :data-line="p.line.value ?? undefined" :data-mono="p.mono.value">
    <PlasChrome />
    <div class="plas-content">
      <header class="plas-content__head"><Head /></header>
      <div class="plas-content__body">
        <slot name="body" :Body="Body" />
      </div>
    </div>
  </div>
</template>
