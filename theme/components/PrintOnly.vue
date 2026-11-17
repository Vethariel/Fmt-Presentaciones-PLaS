<script setup lang="ts">
/** Versión impresa (PDF) del <WebOnly> que lo acompaña. */
import { useNav } from '@slidev/client'

const { isPrintMode } = useNav()
</script>

<template>
  <template v-if="isPrintMode">
    <slot />
  </template>
</template>
