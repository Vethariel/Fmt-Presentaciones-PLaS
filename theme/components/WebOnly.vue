<script setup lang="ts">
/** Contenido solo para la versión web. Debe ir acompañado de <PrintOnly> (regla de paridad, docs/03 §5). */
import { useNav } from '@slidev/client'

const { isPrintMode } = useNav()
</script>

<template>
  <template v-if="!isPrintMode">
    <slot />
  </template>
</template>
