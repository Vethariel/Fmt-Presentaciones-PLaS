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
