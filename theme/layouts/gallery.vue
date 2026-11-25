<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ContentFrame from '../components/ContentFrame.vue'

interface Item { src: string, caption?: string, credit?: string, alt?: string }
/**
 * Galería de 2 a 6 imágenes (docs/11 §2). Frontmatter: images: [{ src, caption?, credit, alt? }].
 * El cuerpo (opcional) es una línea de comentario.
 *
 * Galería justificada: todas las imágenes de una fila tienen la misma altura y
 * cada una toma el ancho que le da su proporción. Ninguna se recorta ni queda
 * con franjas vacías, aunque tengan dimensiones distintas. Si el conjunto no
 * cabe en el alto disponible, se reduce todo por igual y las filas se centran.
 */
const props = withDefaults(defineProps<{ images?: Item[] }>(), { images: () => [] })
const list = computed(() => props.images.slice(0, 6))

/** Formas de repartir n imágenes en filas, en orden (máx. 4 por fila): [[2,2], [3,1], …]. */
function compositions(n: number): number[][] {
  if (n === 0)
    return [[]]
  const out: number[][] = []
  for (let k = 1; k <= Math.min(4, n); k++)
    for (const rest of compositions(n - k)) out.push([k, ...rest])
  return out
}
const GAP = 18
const ROW_GAP = 14
const CAPTION = 19
const CREDIT = 14

const ratios = ref<number[]>([])
const box = ref({ w: 0, h: 0 })
const el = ref<HTMLElement | null>(null)
let ro: ResizeObserver | undefined

const ratio = (i: number) => ratios.value[i] || 4 / 3
const credit = (c?: string) => (c && !/^propia\b/i.test(c.trim()) ? c : '')
function onLoad(i: number, e: Event) {
  const img = e.target as HTMLImageElement
  if (img.naturalWidth && img.naturalHeight) {
    const next = [...ratios.value]
    next[i] = img.naturalWidth / img.naturalHeight
    ratios.value = next
  }
}

/** Filas de una composición, ya escaladas para caber en la caja; `area`: superficie total de imagen. */
function arrange(counts: number[], w: number, h: number) {
  let start = 0
  const rows = counts.map((n) => {
    const idx = Array.from({ length: n }, (_, k) => start + k)
    start += n
    const items = idx.map(i => list.value[i])
    const extra = (items.some(m => m.caption) ? CAPTION : 0) + (items.some(m => credit(m.credit)) ? CREDIT : 0)
    // Altura que llena el ancho: (ancho − huecos) / suma de proporciones
    const fit = (w - GAP * (n - 1)) / idx.reduce((s, i) => s + ratio(i), 0)
    return { idx, extra, fit }
  })
  const fixed = rows.reduce((s, r) => s + r.extra, 0) + ROW_GAP * Math.max(0, rows.length - 1)
  const natural = rows.reduce((s, r) => s + r.fit, 0)
  const k = w && h && natural > 0 ? Math.min(1, Math.max(0, h - fixed) / natural) : 1
  const out = rows.map(r => ({ ...r, h: Math.max(0, r.fit * k) }))
  return { rows: out, area: out.reduce((s, r) => s + r.h * r.h * r.idx.reduce((a, i) => a + ratio(i), 0), 0) }
}

/** Elige el reparto en filas que deja las imágenes más grandes. */
const layout = computed(() => {
  const { w, h } = box.value
  let best = { rows: [] as ReturnType<typeof arrange>['rows'], area: -1 }
  for (const c of compositions(list.value.length)) {
    const a = arrange(c, w, h)
    if (a.area > best.area)
      best = a
  }
  return best.rows
})

onMounted(() => {
  if (!el.value)
    return
  ro = new ResizeObserver(([e]) => { box.value = { w: e.contentRect.width, h: e.contentRect.height } })
  ro.observe(el.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <ContentFrame kind="gallery">
    <template #content><slot /></template>
    <template #body="{ Body }">
      <div ref="el" class="plas-gallery">
        <div v-for="(row, r) in layout" :key="r" class="plas-gallery__row">
          <figure v-for="i in row.idx" :key="i" class="plas-gallery__item" :style="{ width: `${ratio(i) * row.h}px` }">
            <img :src="list[i].src" :alt="list[i].alt ?? list[i].caption ?? ''" :style="{ height: `${row.h}px` }" @load="onLoad(i, $event)">
            <figcaption v-if="list[i].caption || credit(list[i].credit)">
              <span v-if="list[i].caption" class="plas-gallery__caption">{{ list[i].caption }}</span>
              <span v-if="credit(list[i].credit)" class="plas-gallery__credit">{{ credit(list[i].credit) }}</span>
            </figcaption>
          </figure>
        </div>
      </div>
      <div class="plas-gallery__note"><component :is="Body" /></div>
    </template>
  </ContentFrame>
</template>

<style scoped>
.plas-gallery { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; gap: 14px; }
.plas-gallery__row { display: flex; justify-content: center; gap: 18px; }
.plas-gallery__item { margin: 0; flex: none; min-width: 0; }
.plas-gallery__item img { display: block; width: 100%; object-fit: contain; border-radius: var(--radius); background: var(--surface); }
.plas-gallery__item figcaption { display: flex; flex-direction: column; margin-top: 4px; }
.plas-gallery__caption { font: 400 13px / 15px var(--font-body); color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.plas-gallery__credit { font: 400 10px / 14px var(--font-body); color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.plas-gallery__note :deep(p) { margin: 10px 0 0; font-size: var(--fs-small); color: var(--muted); }
.plas-gallery__note:empty { display: none; }
</style>
