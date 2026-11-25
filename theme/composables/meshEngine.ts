/**
 * Motor de la malla de grafos PLaS (lógica pura, sin DOM).
 *
 * Portado de web_plas/src/scripts/network-mesh-core.ts y network-mesh.ts
 * para que la malla de las presentaciones se comporte como la del sitio:
 * - semillas correlacionadas (la 0 libre; las demás, jitter de la 0),
 * - aristas locales que siguen siendo locales en todas las semillas,
 * - deriva lenta por nodo (mismas velocidades del sitio).
 *
 * Adaptaciones para diapositivas (docs/07):
 * - la región es un polígono convexo (el panel), no una elipse;
 * - zonas reservadas (número, texto) que los nodos no invaden;
 * - el grupo flota (Lissajous) y rota de forma oscilante alrededor del centro;
 * - el ajuste se hace en coordenadas de la diapositiva, después de rotar y flotar.
 */

export type Point = [number, number]
export interface Rect { x: number, y: number, w: number, h: number }

export interface MeshOptions {
  /** Polígono CONVEXO en coordenadas de la diapositiva, en sentido horario */
  region: Point[]
  avoid?: Rect[]
  /** Nodos por cada 10 000 px² de región */
  density?: number
  neighbors?: number
  seed?: number
  /** Margen interior respecto al borde de la región */
  inset?: number
}

export interface MeshPlan {
  seeds: Point[][]
  pairs: [number, number][]
  maxLink: number
  center: Point
  velocities: Point[]
  /** Radio de cada nodo (variado, como en la primera versión) */
  radii: number[]
}

// Parámetros del sitio (network-mesh.ts)
export const NODE_SPEED_MIN = 0.022
export const NODE_SPEED_MAX = 0.055
export const SEED_COUNT = 3
export const JITTER = 0.08

// Parámetros de diapositiva (decididos en docs/07)
export const FLOAT_AMPLITUDE = 14 // px
export const FLOAT_PERIOD_X = 23_000 // ms
export const FLOAT_PERIOD_Y = 31_000 // ms
export const ROTATE_AMPLITUDE_DEG = 7
export const ROTATE_PERIOD = 40_000 // ms
export const RESEED_EVERY = 20_000 // ms: corrige la deriva y cicla semilla, como el sitio
/** Cambio de variante: los nodos se deslizan a la nueva disposición (no se desvanecen) */
export const MORPH_MS = 3200
export const NODE_RADIUS_MIN = 3.5
export const NODE_RADIUS_MAX = 8

export function seededRandom(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function polygonArea(poly: Point[]) {
  let a = 0
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i]
    const [x2, y2] = poly[(i + 1) % poly.length]
    a += x1 * y2 - x2 * y1
  }
  return Math.abs(a) / 2
}

export function centroid(poly: Point[]): Point {
  const n = poly.length
  return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n]
}

/** Normales interiores de un polígono convexo. */
function edges(poly: Point[]) {
  const c = centroid(poly)
  return poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length]
    let nx = -(b[1] - a[1])
    let ny = b[0] - a[0]
    const len = Math.hypot(nx, ny) || 1
    nx /= len
    ny /= len
    if ((c[0] - a[0]) * nx + (c[1] - a[1]) * ny < 0) { nx = -nx; ny = -ny }
    return { a, n: [nx, ny] as Point }
  })
}

function insideRect([x, y]: Point, r: Rect, pad: number) {
  return x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad
}

export function allowed(p: Point, region: Point[], avoid: Rect[], inset: number) {
  return edges(region).every(({ a, n }) => (p[0] - a[0]) * n[0] + (p[1] - a[1]) * n[1] >= inset)
    && !avoid.some(r => insideRect(p, r, inset))
}

/**
 * Ajuste: proyecta un punto a la zona permitida.
 * Devuelve la corrección aplicada y la normal de contacto (o null si no hubo).
 */
export function constrain(p: Point, region: Point[], avoid: Rect[], inset: number): { d: Point, n: Point | null } {
  let x = p[0]
  let y = p[1]
  let normal: Point | null = null
  for (const { a, n } of edges(region)) {
    const dist = (x - a[0]) * n[0] + (y - a[1]) * n[1]
    if (dist < inset) {
      x += n[0] * (inset - dist)
      y += n[1] * (inset - dist)
      normal = n
    }
  }
  for (const r of avoid) {
    if (!insideRect([x, y], r, inset))
      continue
    const pushes: [number, Point][] = [
      [x - (r.x - inset), [-1, 0]],
      [r.x + r.w + inset - x, [1, 0]],
      [y - (r.y - inset), [0, -1]],
      [r.y + r.h + inset - y, [0, 1]],
    ]
    pushes.sort((u, v) => u[0] - v[0])
    const [depth, n] = pushes[0]
    x += n[0] * depth
    y += n[1] * depth
    normal = n
  }
  return { d: [x - p[0], y - p[1]], n: normal }
}

function sample(opts: Required<MeshOptions>, count: number, rand: () => number): Point[] {
  const xs = opts.region.map(p => p[0])
  const ys = opts.region.map(p => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const pts: Point[] = []
  for (let guard = 0; pts.length < count && guard < count * 400; guard++) {
    const p: Point = [x0 + rand() * (x1 - x0), y0 + rand() * (y1 - y0)]
    if (allowed(p, opts.region, opts.avoid, opts.inset))
      pts.push(p)
  }
  return pts
}

function jitter(base: Point[], opts: Required<MeshOptions>, rand: () => number, span: number): Point[] {
  return base.map((p) => {
    for (let k = 0; k < 8; k++) {
      const q: Point = [p[0] + (rand() - 0.5) * 2 * span * JITTER, p[1] + (rand() - 0.5) * 2 * span * JITTER]
      if (allowed(q, opts.region, opts.avoid, opts.inset))
        return q
    }
    return p
  })
}

const d2 = (a: Point, b: Point) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2

export function buildPlan(input: MeshOptions): MeshPlan {
  const opts: Required<MeshOptions> = {
    avoid: [],
    density: 0.95,
    neighbors: 3,
    seed: 42,
    inset: 22,
    ...input,
  }
  const area = polygonArea(opts.region)
  const count = Math.max(8, Math.round((area / 10_000) * opts.density))
  const span = Math.sqrt(area)
  // Distancia de unión: proporcional a la separación media entre nodos
  const maxLink = 1.9 * Math.sqrt(area / count)

  const root = (opts.seed >>> 0) || 42
  const seeds: Point[][] = [sample(opts, count, seededRandom(root))]
  for (let s = 1; s < SEED_COUNT; s++)
    seeds.push(jitter(seeds[0], opts, seededRandom((root + s * 9973) >>> 0), span))

  // Aristas: k vecinos más cercanos dentro de maxLink, locales en todas las semillas
  const pts = seeds[0]
  const seen = new Set<string>()
  const pairs: [number, number][] = []
  const max2 = maxLink * maxLink
  for (let i = 0; i < pts.length; i++) {
    const near = pts.map((q, j) => ({ j, d: d2(pts[i], q) }))
      .filter(o => o.j !== i && o.d <= max2)
      .sort((u, v) => u.d - v.d)
      .slice(0, opts.neighbors)
    for (const { j } of near) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key))
        continue
      if (!seeds.every(sd => d2(sd[i], sd[j]) <= max2))
        continue
      seen.add(key)
      pairs.push([i, j])
    }
  }

  // Sin nodos sueltos: se conservan solo los que tienen al menos una arista.
  const keep = [...new Set(pairs.flat())].sort((a, b) => a - b)
  const index = new Map(keep.map((old, i) => [old, i]))
  const linkedSeeds = seeds.map(sd => keep.map(i => sd[i]))
  const linkedPairs = pairs.map(([a, b]) => [index.get(a)!, index.get(b)!] as [number, number])

  const vr = seededRandom(root ^ 0x9E3779B9)
  const velocities = keep.map(() => {
    const ang = vr() * Math.PI * 2
    const sp = NODE_SPEED_MIN + vr() * (NODE_SPEED_MAX - NODE_SPEED_MIN)
    return [Math.cos(ang) * sp, Math.sin(ang) * sp] as Point
  })

  const radii = keep.map(() => NODE_RADIUS_MIN + vr() * (NODE_RADIUS_MAX - NODE_RADIUS_MIN))

  return { seeds: linkedSeeds, pairs: linkedPairs, maxLink, center: centroid(opts.region), velocities, radii }
}

/** Transformación del grupo en el instante t (ms): flotación + rotación oscilante. */
export function groupTransform(t: number) {
  const ox = FLOAT_AMPLITUDE * Math.sin((2 * Math.PI * t) / FLOAT_PERIOD_X)
  const oy = FLOAT_AMPLITUDE * Math.sin((2 * Math.PI * t) / FLOAT_PERIOD_Y + 1.3)
  const theta = (ROTATE_AMPLITUDE_DEG * Math.PI / 180) * Math.sin((2 * Math.PI * t) / ROTATE_PERIOD)
  return { ox, oy, theta }
}

export function rotate([x, y]: Point, theta: number): Point {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return [x * c - y * s, x * s + y * c]
}

// ───────────────────────── Modo figura (docs/07 §6) ─────────────────────────

/**
 * Figura: dibujo mínimo hecho con nodos y aristas.
 * `nodes`: [x, y] o [x, y, tamaño 0–1], en cualquier unidad (se normaliza).
 * `angle`: giro opcional en grados antes de encajarla.
 */
export interface Figure {
  nodes: ([number, number] | [number, number, number])[]
  edges: [number, number][]
  angle?: number
  label?: string
}

/** Una forma ya encajada, expresada sobre las ranuras de nodos comunes a todas las formas. */
export interface FigureForm {
  pos: Point[]
  /** Radio por ranura; 0 = ranura sobrante, oculta dentro de un nodo de la forma */
  r: number[]
  /** Por cada arista principal de la unión: ¿pertenece a esta forma? */
  on: number[]
  /** Por cada unión secundaria: ¿pertenece a esta forma? */
  son: number[]
}

export interface FigurePlan {
  forms: FigureForm[]
  /** Malla principal: unión de las aristas del dibujo de todas las formas (índices de ranura) */
  pairs: [number, number][]
  /** Malla secundaria: uniones extra entre los MISMOS nodos (más nodos de apoyo) */
  spairs: [number, number][]
  /** ¿La ranura es un nodo de apoyo (no pertenece al dibujo)? Por forma */
  minor: boolean[][]
  /** Posición dispersa desde la que se ensambla la primera forma en la web */
  start: Point[]
  center: Point
  /** Respiración por ranura: amplitud (px), periodo (ms) y fase, en x y en y */
  breath: { ax: number, ay: number, px: number, py: number, fx: number, fy: number }[]
}

export { FIGURE_LIMITS, figureErrors } from '../utils/figureRules.mjs'

/** Ensamblaje inicial desde la dispersión (solo web) */
export const ASSEMBLE_MS = 3600
/** Tiempo en reposo en cada forma, para que el dibujo se lea */
export const FORM_HOLD_MS = 7000
/** Deriva de una forma a la siguiente (curva sinusoidal: suave, acelera, suave) */
export const FORM_DRIFT_MS = 9000
const BREATH_MIN = 2.5 // px
const BREATH_MAX = 5
const BREATH_PERIOD_MIN = 5_000 // ms
const BREATH_PERIOD_MAX = 9_000
/** Malla secundaria: nodos de apoyo (proporción de los del dibujo) y vecinos por nodo */
export const SECONDARY = { extraRatio: 0.4, extraMin: 3, extraMax: 7, neighbors: 4, minorRadius: 2.6 }
/** Margen para que la flotación y la rotación no saquen la figura de su caja */
const FIGURE_FILL = 0.86

/** Curva de la deriva: velocidad nula al salir y al llegar, máxima a mitad de camino. */
export const sine = (u: number) => (1 - Math.cos(Math.PI * Math.max(0, Math.min(1, u)))) / 2

function fit(fig: Figure, box: Rect, rand: () => number) {
  const a = ((fig.angle ?? 0) * Math.PI) / 180
  const raw = fig.nodes.map(n => rotate([n[0], n[1]], a))
  const xs = raw.map(p => p[0])
  const ys = raw.map(p => p[1])
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  const bw = Math.max(x1 - x0, 1e-6)
  const bh = Math.max(y1 - y0, 1e-6)
  const s = Math.min(box.w / bw, box.h / bh) * FIGURE_FILL
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2
  return {
    pos: raw.map(([x, y]) => [cx + (x - (x0 + bw / 2)) * s, cy + (y - (y0 + bh / 2)) * s] as Point),
    r: fig.nodes.map(n => NODE_RADIUS_MIN + (n[2] ?? rand() * 0.6) * (NODE_RADIUS_MAX - NODE_RADIUS_MIN)),
  }
}

/**
 * Asigna los nodos de la forma siguiente a las ranuras, minimizando el recorrido
 * (cada nodo deriva hacia el punto más cercano: deriva consciente, no aleatoria).
 * Devuelve, por nodo de la forma, su ranura principal.
 */
function assign(from: Point[], to: Point[]): number[] {
  const cand: [number, number, number][] = []
  from.forEach((f, slot) => to.forEach((t, node) => cand.push([d2(f, t), slot, node])))
  cand.sort((u, v) => u[0] - v[0])
  const slotOf = Array.from({ length: to.length }, () => -1)
  const used = new Set<number>()
  for (const [, slot, node] of cand) {
    if (slotOf[node] >= 0 || used.has(slot))
      continue
    slotOf[node] = slot
    used.add(slot)
  }
  return slotOf
}

/**
 * Nodos de apoyo de una forma: pocos, repartidos en la caja, lejos de los nodos del
 * dibujo (para no confundirlo) pero a distancia de vecino (para tejerse con él).
 */
function extras(fig: Point[], box: Rect, count: number, rand: () => number): Point[] {
  const xs = fig.map(p => p[0])
  const ys = fig.map(p => p[1])
  const diag = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys))
  const minD = 0.16 * diag
  const maxD = 0.38 * diag
  const out: Point[] = []
  for (let guard = 0; out.length < count && guard < 4000; guard++) {
    const p: Point = [box.x + rand() * box.w, box.y + rand() * box.h]
    const nearFig = Math.min(...fig.map(q => Math.sqrt(d2(p, q))))
    const nearOwn = out.length ? Math.min(...out.map(q => Math.sqrt(d2(p, q)))) : Infinity
    if (nearFig >= minD && nearFig <= maxD && nearOwn >= minD)
      out.push(p)
  }
  return out
}

/** Uniones secundarias: k vecinos más cercanos entre los nodos visibles, sin las del dibujo. */
function weave(pos: Point[], visible: boolean[], primary: Set<string>, k: number, key: (e: [number, number]) => string) {
  const idx = pos.map((_, i) => i).filter(i => visible[i])
  const out = new Map<string, [number, number]>()
  for (const i of idx) {
    idx.filter(j => j !== i)
      .sort((u, v) => d2(pos[i], pos[u]) - d2(pos[i], pos[v]))
      .slice(0, k)
      .forEach((j) => {
        const e: [number, number] = [Math.min(i, j), Math.max(i, j)]
        if (!primary.has(key(e)))
          out.set(key(e), e)
      })
  }
  return [...out.values()]
}

export function buildFigurePlan(figs: Figure[], box: Rect, opts: { region: Point[], avoid?: Rect[], seed?: number }): FigurePlan {
  const rand = seededRandom((opts.seed ?? 42) >>> 0)
  const nFig = Math.max(...figs.map(f => f.nodes.length))
  const nExtra = Math.max(SECONDARY.extraMin, Math.min(SECONDARY.extraMax, Math.round(nFig * SECONDARY.extraRatio)))

  // Cada forma = nodos del dibujo + nodos de apoyo (al final de la lista)
  const fitted = figs.map((f) => {
    const g = fit(f, box, rand)
    const more = extras(g.pos, box, nExtra, rand)
    return {
      pos: g.pos.concat(more),
      r: g.r.concat(more.map(() => SECONDARY.minorRadius)),
      minor: g.pos.map(() => false).concat(more.map(() => true)),
    }
  })
  const N = Math.max(...fitted.map(f => f.pos.length))

  // Ranuras: N nodos comunes. Las sobrantes de una forma se esconden (radio 0)
  // dentro del nodo de esa forma más cercano a su posición anterior.
  const forms: { pos: Point[], r: number[], minor: boolean[], edges: [number, number][] }[] = []
  let prev: Point[] = fitted[0].pos.concat(Array.from({ length: N - fitted[0].pos.length }, (_, k) => fitted[0].pos[k % fitted[0].pos.length]))
  fitted.forEach((f, k) => {
    const slotOf = k === 0 ? f.pos.map((_, i) => i) : assign(prev, f.pos)
    const pos: Point[] = Array.from({ length: N })
    const r = Array.from({ length: N }, () => 0)
    const minor = Array.from({ length: N }, () => true)
    slotOf.forEach((slot, node) => { pos[slot] = f.pos[node]; r[slot] = f.r[node]; minor[slot] = f.minor[node] })
    for (let slot = 0; slot < N; slot++) {
      if (pos[slot])
        continue
      const near = f.pos.reduce((b, q, i) => (d2(prev[slot], q) < d2(prev[slot], f.pos[b]) ? i : b), 0)
      pos[slot] = f.pos[near]
    }
    forms.push({ pos, r, minor, edges: figs[k].edges.map(([u, v]) => [slotOf[u], slotOf[v]] as [number, number]) })
    prev = pos
  })

  const key = ([u, v]: [number, number]) => (u < v ? `${u}-${v}` : `${v}-${u}`)
  const union = new Map<string, [number, number]>()
  forms.forEach(f => f.edges.forEach(e => union.set(key(e), e)))
  const pairs = [...union.values()]

  // Malla secundaria por forma, sobre los mismos nodos
  const woven = forms.map(f => weave(f.pos, f.r.map(r => r > 0), new Set(f.edges.map(key)), SECONDARY.neighbors, key))
  const sunion = new Map<string, [number, number]>()
  woven.forEach(w => w.forEach(e => sunion.set(key(e), e)))
  const spairs = [...sunion.values()]

  const scatter: Required<MeshOptions> = { region: opts.region, avoid: opts.avoid ?? [], density: 1, neighbors: 3, seed: 1, inset: 22 }
  const start = sample(scatter, N, rand)
  while (start.length < N) start.push([box.x + box.w / 2, box.y + box.h / 2])

  const breath = Array.from({ length: N }, () => ({
    ax: BREATH_MIN + rand() * (BREATH_MAX - BREATH_MIN),
    ay: BREATH_MIN + rand() * (BREATH_MAX - BREATH_MIN),
    px: BREATH_PERIOD_MIN + rand() * (BREATH_PERIOD_MAX - BREATH_PERIOD_MIN),
    py: BREATH_PERIOD_MIN + rand() * (BREATH_PERIOD_MAX - BREATH_PERIOD_MIN),
    fx: rand() * Math.PI * 2,
    fy: rand() * Math.PI * 2,
  }))

  return {
    forms: forms.map((f, k) => {
      const own = new Set(woven[k].map(key))
      return {
        pos: f.pos,
        r: f.r,
        on: pairs.map(e => (f.edges.some(g => key(g) === key(e)) ? 1 : 0)),
        son: spairs.map(e => (own.has(key(e)) ? 1 : 0)),
      }
    }),
    pairs,
    spairs,
    minor: forms.map(f => f.minor),
    start,
    center: [box.x + box.w / 2, box.y + box.h / 2],
    breath,
  }
}

/**
 * Estado de la línea de tiempo en el instante t (ms) después del ensamblaje:
 * reposo en la forma `from`, luego deriva sinusoidal hacia `to`.
 */
export function formAt(t: number, count: number): { from: number, to: number, s: number } {
  if (count < 2)
    return { from: 0, to: 0, s: 0 }
  const cycle = FORM_HOLD_MS + FORM_DRIFT_MS
  const k = Math.floor(t / cycle)
  const u = (t - k * cycle - FORM_HOLD_MS) / FORM_DRIFT_MS
  return { from: k % count, to: (k + 1) % count, s: sine(u) }
}

/** Desplazamiento de respiración en el instante t; vale 0 en t = 0 (paridad con el PDF). */
export function breathOffset(b: FigurePlan['breath'][number], t: number): Point {
  return [
    b.ax * (Math.sin((2 * Math.PI * t) / b.px + b.fx) - Math.sin(b.fx)),
    b.ay * (Math.sin((2 * Math.PI * t) / b.py + b.fy) - Math.sin(b.fy)),
  ]
}
