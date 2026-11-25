<script setup lang="ts">
import { computed } from 'vue'
import ContentFrame from '../components/ContentFrame.vue'

interface Person { name: string, role?: string, photo?: string, credit?: string }
/** Personas. Frontmatter: people: [{ name, role?, photo?, credit? }] (2 a 8). Sin foto: iniciales. */
const props = withDefaults(defineProps<{ people?: Person[] }>(), { people: () => [] })
const list = computed(() => props.people.slice(0, 8))
const cols = computed(() => Math.min(4, list.value.length <= 4 ? list.value.length : Math.ceil(list.value.length / 2)))
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
</script>

<template>
  <ContentFrame kind="team">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div class="plas-team" :style="{ '--cols': cols }">
        <div v-for="(m, i) in list" :key="i" class="plas-team__card">
          <img v-if="m.photo" :src="m.photo" :alt="m.name" class="plas-team__photo">
          <span v-else class="plas-team__photo plas-team__initials">{{ initials(m.name) }}</span>
          <span class="plas-team__name">{{ m.name }}</span>
          <span v-if="m.role" class="plas-team__role">{{ m.role }}</span>
        </div>
      </div>
      <div class="plas-team__note"><component :is="Body" /></div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-team { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 22px 24px; }
.plas-team__card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 4px; }
.plas-team__photo { width: 92px; height: 92px; border-radius: 50%; object-fit: cover; border: 3px solid var(--soft); margin-bottom: 6px; }
.plas-team__initials { display: grid; place-items: center; background: var(--soft); font: 600 28px / 1 var(--font-display); color: var(--dark); }
.plas-team__name { font: 600 16px / 1.25 var(--font-display); color: var(--ink); }
.plas-team__role { font-size: 13.5px; line-height: 1.3; color: var(--muted); }
.plas-team__note :deep(p) { margin: 18px 0 0; font-size: var(--fs-small); color: var(--muted); text-align: center; }
.plas-team__note:empty { display: none; }
</style>
