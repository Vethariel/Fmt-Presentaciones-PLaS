<script setup lang="ts">
/**
 * Malla de grafos PLaS (motivo del sitio web).
 *
 * Web: los nodos derivan, el grupo flota y rota de forma oscilante (±7°, 40 s),
 * y todo se ajusta en cada cuadro a la región y a las zonas reservadas.
 * PDF / vista general / movimiento reducido: estado inicial estático
 * (misma composición que la web al cargar).
 *
 * Coordenadas: las de la diapositiva (960 × 540). El componente ocupa todo el lienzo.
 */
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, watch } from 'vue'
import type { Point, Rect } from '../composables/meshEngine'
import {
  buildPlan,
  constrain,
  MORPH_MS,
  groupTransform,
  RESEED_EVERY,
  rotate,
} from '../composables/meshEngine'

const props = withDefaults(defineProps<{
  /** Polígono convexo (coordenadas de la diapositiva) donde vive la malla */
  region: Point[]
  /** Zonas que los nodos no invaden (número de sección, texto…) */
  avoid?: Rect[]
  density?: number
  neighbors?: number
  seed?: number
  color?: string
}>(), { avoid: () => [], density: 0.95, neighbors: 3, seed: 42, color: 'var(--base)' })

const plan = computed(() => buildPlan({
  region: props.region,
  avoid: props.avoid,
  density: props.density,
  neighbors: props.neighbors,
  seed: props.seed,
}))
const initial = computed(() => plan.value.seeds[0])
const clipId = `plas-mesh-${Math.random().toString(36).slice(2, 9)}`
const regionPoints = computed(() => props.region.map(p => p.join(',')).join(' '))

// Elementos SVG (se actualizan imperativamente, como en el sitio)
const circles: SVGCircleElement[] = []
const lines: SVGLineElement[] = []

// ── Animación ──
const { isPrintMode } = useNav()
const { $renderContext } = useSlideContext()
const isActive = useIsSlideActive()
const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const shouldAnimate = computed(() =>
  !isPrintMode.value && !reduced && isActive.value
  && ['slide', 'presenter'].includes($renderContext?.value as string),
)

let local: Point[] = []
let vel: Point[] = []
let elapsed = 0
let lastNow = 0
let sinceReseed = 0
let reseeds = 0
let activeSeed = 0
let frame = 0
let raf = 0
let morph: { from: Point[], to: Point[], t: number } | null = null

function reset() {
  local = initial.value.map(p => [p[0], p[1]] as Point)
  vel = plan.value.velocities.map(v => [v[0], v[1]] as Point)
  elapsed = 0
  sinceReseed = 0
  reseeds = 0
  activeSeed = 0
  morph = null
}
reset()
watch(plan, reset)

/** Cambio de variante: deslizamiento suave (ease in-out) desde la posición actual. */
function reseed() {
  reseeds += 1
  if (reseeds % 2 === 0)
    activeSeed = (activeSeed + 1) % plan.value.seeds.length
  morph = {
    from: local.map(p => [p[0], p[1]] as Point),
    to: plan.value.seeds[activeSeed].map(p => [p[0], p[1]] as Point),
    t: 0,
  }
}
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)

function tick(now: number) {
  const dt = lastNow ? Math.min(now - lastNow, 64) : 16
  lastNow = now
  elapsed += dt
  sinceReseed += dt
  const { maxLink, center } = plan.value
  const { ox, oy, theta } = groupTransform(elapsed)
  const k = dt / 16.67 // velocidades del sitio están en px por cuadro a 60 fps

  if (morph) {
    morph.t = Math.min(1, morph.t + dt / MORPH_MS)
    const e = ease(morph.t)
    local.forEach((p, i) => {
      p[0] = morph!.from[i][0] + (morph!.to[i][0] - morph!.from[i][0]) * e
      p[1] = morph!.from[i][1] + (morph!.to[i][1] - morph!.from[i][1]) * e
    })
    if (morph.t >= 1)
      morph = null
  }

  const world: Point[] = local.map((p, i) => {
    if (!morph) {
      p[0] += vel[i][0] * k
      p[1] += vel[i][1] * k
    }
    const r = rotate([p[0] - center[0], p[1] - center[1]], theta)
    const w: Point = [r[0] + center[0] + ox, r[1] + center[1] + oy]
    // Ajuste en coordenadas de la diapositiva → corrección llevada al marco local
    const { d, n } = constrain(w, props.region, props.avoid, 20)
    if (d[0] || d[1]) {
      w[0] += d[0]
      w[1] += d[1]
      const dl = rotate(d, -theta)
      p[0] += dl[0]
      p[1] += dl[1]
      if (n) {
        const nl = rotate(n, -theta)
        const vn = vel[i][0] * nl[0] + vel[i][1] * nl[1]
        if (vn < 0) {
          vel[i][0] -= 2 * vn * nl[0]
          vel[i][1] -= 2 * vn * nl[1]
        }
      }
    }
    return w
  })

  if (++frame % 2 === 0) {
    world.forEach(([x, y], i) => {
      circles[i]?.setAttribute('cx', x.toFixed(2))
      circles[i]?.setAttribute('cy', y.toFixed(2))
    })
    plan.value.pairs.forEach(([a, b], e) => {
      const el = lines[e]
      if (!el)
        return
      const [x1, y1] = world[a]
      const [x2, y2] = world[b]
      el.setAttribute('x1', x1.toFixed(2))
      el.setAttribute('y1', y1.toFixed(2))
      el.setAttribute('x2', x2.toFixed(2))
      el.setAttribute('y2', y2.toFixed(2))
      // Aristas elásticas: se desvanecen si los nodos se separan demasiado
      const len = Math.hypot(x2 - x1, y2 - y1)
      el.style.strokeOpacity = String(Math.max(0, Math.min(1, (1.3 * maxLink - len) / (0.3 * maxLink))))
    })
  }

  if (sinceReseed >= RESEED_EVERY) {
    sinceReseed = 0
    reseed()
  }
  raf = requestAnimationFrame(tick)
}

function start() {
  if (!raf) {
    lastNow = 0
    raf = requestAnimationFrame(tick)
  }
}
function stop() {
  if (raf)
    cancelAnimationFrame(raf)
  raf = 0
}
watch(shouldAnimate, on => (on ? start() : stop()), { immediate: true })
onBeforeUnmount(stop)
</script>

<template>
  <svg class="plas-mesh" viewBox="0 0 960 540" width="960" height="540" :style="{ color }" aria-hidden="true">
    <defs>
      <clipPath :id="clipId">
        <polygon :points="regionPoints" />
      </clipPath>
    </defs>
    <g :clip-path="`url(#${clipId})`" class="plas-mesh__group">
      <g class="plas-mesh__edges">
        <line
          v-for="([a, b], e) in plan.pairs" :key="`${a}-${b}`"
          :ref="(el) => { lines[e] = el as SVGLineElement }"
          :x1="initial[a][0]" :y1="initial[a][1]" :x2="initial[b][0]" :y2="initial[b][1]"
        />
      </g>
      <g class="plas-mesh__nodes">
        <circle
          v-for="(p, i) in initial" :key="i"
          :ref="(el) => { circles[i] = el as SVGCircleElement }"
          :cx="p[0]" :cy="p[1]" :r="plan.radii[i]"
        />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.plas-mesh { position: absolute; inset: 0; display: block; pointer-events: none; }
/* Estilo del sitio: aristas sólidas, nodos uniformes */
.plas-mesh__edges line { stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; opacity: .5; }
.plas-mesh__nodes circle { fill: currentColor; opacity: .78; }
</style>
