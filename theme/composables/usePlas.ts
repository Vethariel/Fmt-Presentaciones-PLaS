import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

/** Líneas de investigación (fuente: web_plas/src/data/lines.json). */
export const LINES = {
  lenguajes: { name: 'Lenguajes de programación', short: 'Lenguajes' },
  educacion: { name: 'Educación en ingeniería', short: 'Educación' },
  embebidos: { name: 'Sistemas embebidos confiables', short: 'Embebidos' },
  transporte: { name: 'Sistemas inteligentes de transporte', short: 'Transporte' },
  sensado: { name: 'Sensado inteligente', short: 'Sensado' },
} as const

export type LineId = keyof typeof LINES
export const LINE_ORDER = Object.keys(LINES) as LineId[]

export function isLine(v: unknown): v is LineId {
  return typeof v === 'string' && v in LINES
}

export interface PlasSection {
  /** Número de la diapositiva separadora */
  no: number
  /** Número de sección (1, 2, …) */
  index: number
  title: string
  line: LineId
  /** Primera y última diapositiva de la sección (incluye el separador) */
  first: number
  last: number
}

/**
 * Estado del sistema PLaS para la diapositiva actual.
 *
 * Modos (docs/04 §4):
 * - línea: `themeConfig.line` en el encabezado → toda la presentación usa ese color.
 * - secciones: cada diapositiva `layout: section` define su `line`
 *   (o toma el siguiente color de la secuencia).
 */
export function usePlas() {
  const { $slidev, $page } = useSlideContext()

  const config = computed<Record<string, any>>(() => ($slidev as any)?.configs?.themeConfig ?? {})
  const slides = computed<any[]>(() => ($slidev as any)?.nav?.slides ?? [])
  const total = computed(() => slides.value.length)

  const deckLine = computed<LineId | null>(() => (isLine(config.value.line) ? config.value.line : null))

  const sections = computed<PlasSection[]>(() => {
    const list: PlasSection[] = []
    for (const s of slides.value) {
      const fm = s?.meta?.slide?.frontmatter ?? {}
      const layout = s?.meta?.layout ?? fm.layout
      if (layout !== 'section')
        continue
      const index = list.length + 1
      list.push({
        no: s.no,
        index,
        title: fm.title ?? s?.meta?.slide?.title ?? `Sección ${index}`,
        line: isLine(fm.line) ? fm.line : LINE_ORDER[(index - 1) % LINE_ORDER.length],
        first: s.no,
        last: s.no,
      })
    }
    list.forEach((sec, i) => {
      sec.last = i + 1 < list.length ? list[i + 1].no - 1 : total.value
    })
    return list
  })

  const section = computed<PlasSection | null>(() => {
    let current: PlasSection | null = null
    for (const sec of sections.value) {
      if (sec.no <= $page.value)
        current = sec
    }
    return current
  })

  /** Línea cuyo color se aplica a esta diapositiva (null = marca). */
  const line = computed<LineId | null>(() => deckLine.value ?? section.value?.line ?? null)

  /** Avance dentro de la sección: diapositivas de contenido (sin contar el separador). */
  const sectionProgress = computed(() => {
    const sec = section.value
    if (!sec)
      return { current: 0, total: 0 }
    return { current: $page.value - sec.first, total: sec.last - sec.first }
  })

  const agendaNo = computed(() => {
    const s = slides.value.find(s => (s?.meta?.layout ?? s?.meta?.slide?.frontmatter?.layout) === 'agenda')
    return s?.no ?? 1
  })

  const event = computed<string>(() => config.value.event ?? 'Grupo PLaS')
  const mono = computed<string | undefined>(() => config.value.mono)

  return {
    page: $page,
    total,
    config,
    deckLine,
    sections,
    section,
    line,
    sectionProgress,
    agendaNo,
    event,
    mono,
    go: (no: number) => ($slidev as any)?.nav?.go?.(no),
  }
}
