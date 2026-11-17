<script setup lang="ts">
import { computed } from 'vue'
import { usePlas } from '../composables/usePlas'
import symbol from '../assets/plas-symbol.svg?url'

const p = usePlas()
const crumb = computed(() => {
  const s = p.section.value
  return s ? `${String(s.index).padStart(2, '0')} · ${s.title}` : null
})
const prog = computed(() => p.sectionProgress.value)
</script>

<template>
  <div class="plas-chrome">
    <div v-if="crumb" class="plas-chrome__crumb">
      <span class="plas-chrome__mark" />
      <span class="plas-chrome__label">{{ crumb }}</span>
      <span v-if="prog.total > 1" class="plas-chrome__progress" :aria-label="`Diapositiva ${prog.current} de ${prog.total} en esta sección`">
        <i v-for="n in prog.total" :key="n" :class="{ on: n <= prog.current }" />
      </span>
    </div>
    <button class="plas-chrome__home" title="Volver a la agenda" @click="p.go(p.agendaNo.value)">
      <img :src="symbol" alt="PLaS">
    </button>
    <div class="plas-chrome__foot">
      <span>{{ p.event.value }}</span>
      <span class="plas-chrome__no">{{ p.page.value }}</span>
    </div>
    <div class="plas-stripe" />
  </div>
</template>

<style scoped>
.plas-chrome { position: absolute; inset: 0; pointer-events: none; }
.plas-chrome__crumb {
  position: absolute; left: var(--gutter); top: 22px;
  display: flex; align-items: center; gap: 10px;
  font: 500 var(--fs-chrome) / 1 var(--font-display); color: var(--muted);
}
.plas-chrome__mark { width: 22px; height: 9px; border-radius: 2px; background: var(--base); }
.plas-chrome__progress { display: inline-flex; gap: 3px; margin-left: 6px; }
.plas-chrome__progress i { width: 12px; height: 3px; border-radius: 2px; background: var(--rule); }
.plas-chrome__progress i.on { background: var(--base); }
.plas-chrome__home {
  position: absolute; right: 42px; top: 16px; width: 30px; height: 30px; padding: 2px;
  border: 0; background: none; cursor: pointer; pointer-events: auto; border-radius: 6px;
}
.plas-chrome__home:hover { background: var(--surface); }
.plas-chrome__home img { width: 100%; height: 100%; display: block; }
.plas-chrome__foot {
  position: absolute; left: var(--gutter); right: var(--gutter); bottom: 20px;
  display: flex; justify-content: space-between;
  font: 500 var(--fs-chrome) / 1 var(--font-display); color: var(--muted);
}
.plas-chrome__no { color: var(--dark); font-weight: 700; }
</style>
