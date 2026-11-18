<script setup lang="ts">
import plasLogo from '../assets/plas-logo-compact.svg?url'
import { usePlas } from '../composables/usePlas'

/** Agenda generada a partir de las diapositivas `layout: section` (sin duplicar contenido). */
const p = usePlas()
</script>

<template>
  <div class="slidev-layout plas plas-agenda" :data-line="p.deckLine.value ?? undefined" :data-mono="p.mono.value">
    <div class="plas-agenda__head">
      <slot />
    </div>
    <img :src="plasLogo" alt="PLaS" class="plas-agenda__logo">
    <ol class="plas-agenda__list">
      <li v-for="s in p.sections.value" :key="s.no" :data-line="p.deckLine.value ?? s.line" class="plas">
        <button @click="p.go(s.no)">
          <span class="plas-agenda__mark">{{ String(s.index).padStart(2, '0') }}</span>
          <span class="plas-agenda__title">{{ s.title }}</span>
          <span class="plas-agenda__count">{{ s.last > s.first ? `${s.last - s.first} diap.` : '' }}</span>
        </button>
      </li>
    </ol>
    <div class="plas-agenda__foot">{{ p.event.value }}</div>
    <div class="plas-stripe" />
  </div>
</template>

<style scoped>
.plas-agenda__head { position: absolute; left: var(--gutter); top: 48px; }
.plas-agenda__logo { position: absolute; right: var(--gutter); top: 44px; height: 40px; }
.slidev-layout.plas .plas-agenda__list { position: absolute; left: var(--gutter); right: var(--gutter); top: 130px; margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.plas-agenda__list li { margin: 0; background: none; }
.plas-agenda__list li::before { display: none; }
.plas-agenda__list button {
  width: 100%; display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 18px;
  padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
  border-bottom: 1px solid var(--rule); padding-bottom: 10px;
}
.plas-agenda__list button:hover .plas-agenda__title { color: var(--dark); }
.plas-agenda__mark {
  display: grid; place-items: center; height: 34px; border-radius: 4px; background: var(--soft);
  border-left: 5px solid var(--base); font: 700 15px / 1 var(--font-display); color: var(--dark);
}
.plas-agenda__title { font: 500 22px / 1.2 var(--font-display); color: var(--ink); }
.plas-agenda__count { font: 500 12.5px / 1 var(--font-display); color: var(--muted); }
.plas-agenda__foot { position: absolute; left: var(--gutter); bottom: 20px; font: 500 var(--fs-chrome) / 1 var(--font-display); color: var(--muted); }
</style>
