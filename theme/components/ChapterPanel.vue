<script setup lang="ts">
/**
 * Panel lateral de capítulos (solo web).
 * Se abre al llevar el mouse al borde izquierdo de la diapositiva o con la tecla C, y se cierra al
 * salir del panel, con C o con Esc. Lista los capítulos (diapositivas `layout: section`)
 * con su color de línea y despliega las diapositivas del capítulo actual.
 */
import { configs, useNav } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import plasLogo from '../assets/plas-logo-compact.svg?url'
import { agendaNoOf, buildSections, isLine, slideTitle } from '../composables/usePlas'

const nav = useNav()
const open = ref(false)

const slides = computed<any[]>(() => nav.slides.value)
const sections = computed(() => buildSections(slides.value))
const current = computed(() => nav.currentSlideNo.value)
const deckLine = computed(() => {
  const l = (configs as any)?.themeConfig?.line
  return isLine(l) ? l : null
})
const agendaNo = computed(() => agendaNoOf(slides.value))
const inSection = (s: { first: number, last: number }) => current.value >= s.first && current.value <= s.last
const pages = (s: { first: number, last: number }) =>
  slides.value.filter(r => r.no > s.first && r.no <= s.last).map(r => ({ no: r.no, title: slideTitle(r) || `Diapositiva ${r.no}` }))

function go(no: number) {
  nav.go(no)
  open.value = false
}
/** C abre/cierra el panel (no mientras se escribe en un campo); Esc lo cierra. */
function isTyping(t: EventTarget | null) {
  const el = t as HTMLElement | null
  return !!el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
    e.preventDefault()
    open.value = !open.value
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="plas-toc" :class="{ 'is-open': open }" @mouseleave="open = false">
    <div class="plas-toc__hot" aria-hidden="true" @mouseenter="open = true" />
    <nav class="plas-toc__panel plas" :data-line="deckLine ?? undefined" aria-label="Capítulos" :inert="!open || undefined">
      <header class="plas-toc__head">
        <img :src="plasLogo" alt="PLaS">
        <span>Capítulos</span>
      </header>
      <button class="plas-toc__home" :class="{ 'is-current': current === agendaNo }" @click="go(agendaNo)">
        Agenda
      </button>
      <ol class="plas-toc__list">
        <li v-for="s in sections" :key="s.no" class="plas" :data-line="deckLine ?? s.line" :class="{ 'is-current': inSection(s) }">
          <button class="plas-toc__chapter" @click="go(s.no)">
            <span class="plas-toc__num">{{ String(s.index).padStart(2, '0') }}</span>
            <span class="plas-toc__title">{{ s.title }}</span>
          </button>
          <ol v-if="inSection(s) && pages(s).length" class="plas-toc__pages">
            <li v-for="pg in pages(s)" :key="pg.no">
              <button :class="{ 'is-current': pg.no === current }" @click="go(pg.no)">
                <span class="plas-toc__pno">{{ pg.no }}</span>{{ pg.title }}
              </button>
            </li>
          </ol>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style scoped>
.plas-toc { position: absolute; inset: 0; z-index: 60; pointer-events: none; }
.plas-toc__hot { position: absolute; left: 0; top: 0; bottom: 0; width: 14px; pointer-events: auto; }
.plas-toc__panel {
  position: absolute; left: 0; top: 0; bottom: 0; width: 300px; box-sizing: border-box;
  padding: 22px 18px 18px; overflow-y: auto; pointer-events: auto;
  background: #fff; border-right: 1px solid var(--rule);
  box-shadow: 12px 0 32px rgba(12, 79, 72, 0.12);
  transform: translateX(-102%); transition: transform .28s cubic-bezier(.2, .7, .2, 1);
  font-family: var(--font-display); color: var(--ink); text-align: left;
}
.is-open .plas-toc__panel { transform: none; }
.plas-toc__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.plas-toc__head img { height: 26px; }
.plas-toc__head span { font: 600 11px / 1 var(--font-display); color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
.plas-toc button {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 7px 8px; border: 0; border-radius: 6px;
  background: none; cursor: pointer; text-align: left; font: inherit; color: inherit;
}
.plas-toc button:hover { background: var(--surface); }
.plas-toc__home { font-size: 13.5px; font-weight: 600; color: var(--muted) !important; margin-bottom: 6px; }
.plas-toc__home.is-current { color: var(--dark) !important; }
.plas-toc__list, .plas-toc__pages { list-style: none; margin: 0; padding: 0; }
.plas-toc__list > li { margin: 2px 0; }
.plas-toc__num {
  flex: none; display: grid; place-items: center; width: 30px; height: 24px; border-radius: 4px;
  background: var(--soft); border-left: 4px solid var(--base);
  font: 700 12px / 1 var(--font-display); color: var(--dark);
}
.plas-toc__title { font-size: 14.5px; font-weight: 500; line-height: 1.25; }
.plas-toc__list > li.is-current > .plas-toc__chapter { background: var(--soft); }
.plas-toc__list > li.is-current .plas-toc__title { color: var(--deep); font-weight: 650; }
.plas-toc__pages { margin: 2px 0 6px 20px; padding-left: 12px; border-left: 2px solid var(--soft); }
.plas-toc__pages button { padding: 5px 8px; font: 400 13px / 1.3 var(--font-body); color: var(--muted); }
.plas-toc__pages button.is-current { color: var(--dark); font-weight: 650; background: var(--surface); }
.plas-toc__pno { flex: none; width: 18px; font: 600 11px / 1 var(--font-display); color: var(--muted); }
</style>
