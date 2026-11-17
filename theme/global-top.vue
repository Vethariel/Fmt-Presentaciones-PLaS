<script setup lang="ts">
/** Capas globales del tema PLaS (solo web: no se dibujan en el PDF). */
import { useNav } from '@slidev/client'
import ChapterPanel from './components/ChapterPanel.vue'

const { isPrintMode } = useNav()
</script>

<template>
  <ChapterPanel v-if="!isPrintMode" />
</template>
