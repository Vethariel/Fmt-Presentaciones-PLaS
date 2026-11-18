<script setup lang="ts">
/**
 * Malla de grafos PLaS (motivo del sitio web).
 *
 * Web: los nodos derivan, el grupo flota y rota de forma oscilante (±7°, 40 s),
 * y todo se ajusta en cada cuadro a la región y a las zonas reservadas.
 * PDF / vista general / movimiento reducido: estado inicial estático
 * (misma composición que la web al cargar).
 *
 * Modo figura (`figures` + `box`, docs/07 §6): una sola red con jerarquía.
 * - Principal: las aristas del dibujo, con trazo grueso.
 * - Secundaria: muchas más uniones, delgadas, entre los MISMOS nodos, más unos pocos
 *   nodos de apoyo pequeños. Se mueve con la figura.
 * Web: la red se ensambla desde la dispersión; reposa, y deriva hacia la forma
 * siguiente con curva sinusoidal (suave, acelera, suave al llegar).
 * PDF: la primera forma terminada.
 *
 * Coordenadas: las de la diapositiva (960 × 540). El componente ocupa todo el lienzo.
 */
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, watch } from 'vue'
import type { Figure, Point, Rect } from '../composables/meshEngine'
import {
  ASSEMBLE_MS,
  breathOffset,
  buildFigurePlan,
  buildPlan,
  constrain,
  formAt,
  groupTransform,
  MORPH_MS,
  RESEED_EVERY,
  rotate,
  sine,
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
  /** Dibujos de la malla principal (modo figura). Lista vacía: solo malla aleatoria */
  figures?: Figure[]
  /** Caja (dentro de la región) donde se encaja la figura */
  box?: Rect
}>(), { avoid: () => [], density: 0.95, neighbors: 3, seed: 42, color: 'var(--base)', figures: () => [] })

const fplan = computed(() => props.figures.length && props.box
  ? buildFigurePlan(props.figures, props.box, { region: props.region, avoid: props.avoid, seed: props.seed })
  : null)
const hasFigure = computed(() => !!fplan.value)

/** Malla aleatoria (sin figura). */
const plan = computed(() => buildPlan({
  region: props.region,
  avoid: props.avoid,
  density: props.density,
  neighbors: props.neighbors,
  seed: props.seed,
}))

const clipId = `plas-mesh-${Math.random().toString(36).slice(2, 9)}`
const regionPoints = computed(() => props.region.map(p => p.join(',')).join(' '))

// Elementos SVG (se actualizan imperativamente, como en el sitio)
const circles: SVGCircleElement[] = []
const lines: SVGLineElement[] = []
const fCircles: SVGCircleElement[] = []
const fLines: SVGLineElement[] = []
const sLines: SVGLineElement[] = []

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
  local = plan.value.seeds[0].map(p => [p[0], p[1]] as Point)
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

const fix = (v: number) => v.toFixed(2)
function setLine(el: SVGLineElement | undefined, a: Point, b: Point) {
  if (!el)
    return
  el.setAttribute('x1', fix(a[0]))
  el.setAttribute('y1', fix(a[1]))
  el.setAttribute('x2', fix(b[0]))
  el.setAttribute('y2', fix(b[1]))
}
/** Aristas elásticas: se desvanecen si sus nodos se separan demasiado. */
const elastic = (a: Point, b: Point, maxLink: number) =>
  Math.max(0, Math.min(1, (1.3 * maxLink - Math.hypot(b[0] - a[0], b[1] - a[1])) / (0.3 * maxLink)))

/** Un paso de la malla aleatoria (deriva, variantes, ajuste). Devuelve sus posiciones. */
function stepMesh(dt: number): Point[] {
  sinceReseed += dt
  const { center } = plan.value
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

  if (sinceReseed >= RESEED_EVERY) {
    sinceReseed = 0
    reseed()
  }
  return world
}

/**
 * Figura: ensamblaje desde la dispersión; después, reposo en cada forma y deriva
 * sinusoidal hacia la siguiente. Respiración, flotación y rotación todo el tiempo.
 */
function stepFigure(): { world: Point[], a: number, s: number, from: number, to: number } {
  const f = fplan.value!
  const { ox, oy, theta } = groupTransform(elapsed)
  const a = sine(elapsed / ASSEMBLE_MS) // ensamblaje: misma curva que la deriva
  const { from, to, s } = formAt(Math.max(0, elapsed - ASSEMBLE_MS), f.forms.length)
  const A = f.forms[from]
  const B = f.forms[to]
  const world: Point[] = A.pos.map((p0, i) => {
    const [bx, by] = breathOffset(f.breath[i], elapsed)
    const hx = p0[0] + (B.pos[i][0] - p0[0]) * s + bx
    const hy = p0[1] + (B.pos[i][1] - p0[1]) * s + by
    const lx = f.start[i][0] + (hx - f.start[i][0]) * a
    const ly = f.start[i][1] + (hy - f.start[i][1]) * a
    const r = rotate([lx - f.center[0], ly - f.center[1]], theta * a)
    const w: Point = [r[0] + f.center[0] + ox * a, r[1] + f.center[1] + oy * a]
    const { d } = constrain(w, props.region, props.avoid, 20)
    return [w[0] + d[0], w[1] + d[1]]
  })
  return { world, a, s, from, to }
}

function tick(now: number) {
  const dt = lastNow ? Math.min(now - lastNow, 64) : 16
  lastNow = now
  elapsed += dt

  if (fplan.value) {
    const fig = stepFigure()
    if (++frame % 2 === 0) {
      const f = fplan.value
      const A = f.forms[fig.from]
      const B = f.forms[fig.to]
      const mix = (u: number, v: number) => u + (v - u) * fig.s
      fig.world.forEach(([x, y], i) => {
        const c = fCircles[i]
        if (!c)
          return
        c.setAttribute('cx', fix(x))
        c.setAttribute('cy', fix(y))
        // Durante el ensamblaje todos los nodos son visibles; luego, el radio de cada forma
        const rf = mix(A.r[i], B.r[i])
        c.setAttribute('r', fix(fig.a < 1 ? Math.max(rf, (1 - fig.a) * 4) : rf))
      })
      // Las aristas que no están en la forma de destino se desvanecen con la misma curva
      f.pairs.forEach(([u, v], e) => {
        setLine(fLines[e], fig.world[u], fig.world[v])
        if (fLines[e])
          fLines[e].style.strokeOpacity = String(mix(A.on[e], B.on[e]) * fig.a * fig.a)
      })
      f.spairs.forEach(([u, v], e) => {
        setLine(sLines[e], fig.world[u], fig.world[v])
        if (sLines[e])
          sLines[e].style.strokeOpacity = String(mix(A.son[e], B.son[e]) * fig.a * fig.a)
      })
    }
  }
  else {
    const mesh = stepMesh(dt)
    if (++frame % 2 === 0) {
      const { maxLink } = plan.value
      mesh.forEach(([x, y], i) => {
        circles[i]?.setAttribute('cx', fix(x))
        circles[i]?.setAttribute('cy', fix(y))
      })
      plan.value.pairs.forEach(([a, b], e) => {
        setLine(lines[e], mesh[a], mesh[b])
        if (lines[e])
          lines[e].style.strokeOpacity = String(elastic(mesh[a], mesh[b], maxLink))
      })
    }
  }
  raf = requestAnimationFrame(tick)
}

function start() {
  if (!raf) {
    lastNow = 0
    elapsed = 0 // cada vez que la diapositiva se activa, la figura se vuelve a ensamblar
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

const mesh0 = computed(() => plan.value.seeds[0])
const fig0 = computed(() => fplan.value?.forms[0])
</script>

<template>
  <svg
    class="plas-mesh" :class="{ 'plas-mesh--figure': hasFigure }"
    viewBox="0 0 960 540" width="960" height="540" :style="{ color }" aria-hidden="true"
  >
    <defs>
      <clipPath :id="clipId">
        <polygon :points="regionPoints" />
      </clipPath>
    </defs>
    <g :clip-path="`url(#${clipId})`" class="plas-mesh__group">
      <!-- Malla aleatoria (sin figura) -->
      <template v-if="!fplan">
        <g class="plas-mesh__edges">
          <line
            v-for="([a, b], e) in plan.pairs" :key="`${a}-${b}`"
            :ref="(el) => { lines[e] = el as SVGLineElement }"
            :x1="mesh0[a][0]" :y1="mesh0[a][1]" :x2="mesh0[b][0]" :y2="mesh0[b][1]"
          />
        </g>
        <g class="plas-mesh__nodes">
          <circle
            v-for="(p, i) in mesh0" :key="i"
            :ref="(el) => { circles[i] = el as SVGCircleElement }"
            :cx="p[0]" :cy="p[1]" :r="plan.radii[i]"
          />
        </g>
      </template>
      <!-- Modo figura: una sola red; secundaria (delgada) bajo la principal (gruesa) -->
      <template v-else-if="fig0">
        <g class="plas-mesh__weave">
          <line
            v-for="([a, b], e) in fplan.spairs" :key="`s${a}-${b}`"
            :ref="(el) => { sLines[e] = el as SVGLineElement }"
            :x1="fig0.pos[a][0]" :y1="fig0.pos[a][1]" :x2="fig0.pos[b][0]" :y2="fig0.pos[b][1]"
            :style="{ strokeOpacity: fig0.son[e] }"
          />
        </g>
        <g class="plas-mesh__figure-edges">
          <line
            v-for="([a, b], e) in fplan.pairs" :key="`f${a}-${b}`"
            :ref="(el) => { fLines[e] = el as SVGLineElement }"
            :x1="fig0.pos[a][0]" :y1="fig0.pos[a][1]" :x2="fig0.pos[b][0]" :y2="fig0.pos[b][1]"
            :style="{ strokeOpacity: fig0.on[e] }"
          />
        </g>
        <g class="plas-mesh__figure-nodes">
          <circle
            v-for="(p, i) in fig0.pos" :key="`f${i}`"
            :ref="(el) => { fCircles[i] = el as SVGCircleElement }"
            :cx="p[0]" :cy="p[1]" :r="fig0.r[i]"
          />
        </g>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.plas-mesh { position: absolute; inset: 0; display: block; pointer-events: none; }
/* Estilo del sitio: aristas sólidas, nodos uniformes */
.plas-mesh__edges line { stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; opacity: .5; }
.plas-mesh__nodes circle { fill: currentColor; opacity: .78; }

/* Jerarquía (modo figura): la malla principal (dibujo) manda; la secundaria la teje */
.plas-mesh__weave line { stroke: currentColor; stroke-width: 1; stroke-linecap: round; opacity: .45; }
.plas-mesh__figure-edges line { stroke: currentColor; stroke-width: 3.4; stroke-linecap: round; opacity: .95; }
.plas-mesh__figure-nodes circle { fill: currentColor; }
</style>
