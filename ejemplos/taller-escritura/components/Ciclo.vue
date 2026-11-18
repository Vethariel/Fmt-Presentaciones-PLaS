<script setup lang="ts">
/**
 * Ciclo de trabajo del taller: cuatro momentos que se repiten cada semana.
 * Estático: igual en la web y en el PDF.
 */
const pasos = ['Lineamientos y realimentación', 'Trabajo colaborativo', 'Resolución de dudas', 'Trabajo individual']
// Posiciones en un rombo: arriba, derecha, abajo, izquierda
const pos = [[50, 0], [100, 50], [50, 100], [0, 50]]
</script>

<template>
  <div class="ciclo">
    <svg class="ciclo__flechas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker id="ciclo-punta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" class="ciclo__punta" />
        </marker>
      </defs>
      <path d="M64,14 Q80,22 84,34" marker-end="url(#ciclo-punta)" />
      <path d="M84,66 Q80,78 64,86" marker-end="url(#ciclo-punta)" />
      <path d="M36,86 Q20,78 16,66" marker-end="url(#ciclo-punta)" />
      <path d="M16,34 Q20,22 36,14" marker-end="url(#ciclo-punta)" />
    </svg>
    <div
      v-for="(p, i) in pasos" :key="p" class="ciclo__nodo"
      :style="{ left: `${pos[i][0]}%`, top: `${pos[i][1]}%` }"
    >
      <span class="ciclo__n">{{ i + 1 }}</span>{{ p }}
    </div>
  </div>
</template>

<style scoped>
.ciclo { position: relative; width: 500px; height: 236px; margin: 0 auto; }
.ciclo__flechas { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.ciclo__flechas path { fill: none; stroke: var(--muted); stroke-width: 1.4; vector-effect: non-scaling-stroke; }
.ciclo__flechas .ciclo__punta { fill: var(--muted); stroke: none; }
.ciclo__nodo {
  position: absolute; transform: translate(-50%, -50%); width: 170px; padding: 12px 14px;
  background: var(--soft); border-left: 4px solid var(--base); border-radius: var(--radius);
  font: 600 16px / 1.25 var(--font-display); color: var(--deep);
}
.ciclo__n {
  display: inline-grid; place-items: center; width: 20px; height: 20px; margin-right: 8px; border-radius: 50%;
  background: var(--dark); color: var(--page); font-size: 12px; vertical-align: 1px;
}
</style>
