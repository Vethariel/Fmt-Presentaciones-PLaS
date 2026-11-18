<script setup lang="ts">
/**
 * Etapas de la investigación científica y los productos escritos de cada una.
 * Estática: igual en la web y en el PDF.
 */
const etapas = [
  { nombre: 'Planificación', productos: ['Proyecto de tesis', 'Propuesta de trabajo final', 'Proyecto de investigación'] },
  { nombre: 'Ejecución', productos: [] },
  { nombre: 'Divulgación', productos: ['Tesis de maestría y doctorado', 'Trabajo final de maestría', 'Artículos de conferencia', 'Artículos de revista'] },
]
</script>

<template>
  <div class="etapas">
    <div v-for="(e, i) in etapas" :key="e.nombre" class="etapas__col" :data-i="i">
      <div class="etapas__flecha">{{ e.nombre }}</div>
      <ul v-if="e.productos.length" class="etapas__productos">
        <li v-for="p in e.productos" :key="p">{{ p }}</li>
      </ul>
      <p v-else class="etapas__nota">Se desarrolla el trabajo planificado</p>
    </div>
  </div>
</template>

<style scoped>
.etapas { display: grid; grid-template-columns: 1fr 1fr 1.25fr; gap: 6px; align-items: start; }
.etapas__flecha {
  display: grid; place-items: center; height: 92px; padding: 0 34px 0 40px;
  font: 650 21px / 1.15 var(--font-display); color: var(--deep); text-align: center;
  clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%, 28px 50%);
}
.etapas__col[data-i='0'] .etapas__flecha { background: var(--soft); clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 50%, calc(100% - 28px) 100%, 0 100%); padding-left: 16px; }
.etapas__col[data-i='1'] .etapas__flecha { background: color-mix(in srgb, var(--base) 45%, var(--soft)); }
.etapas__col[data-i='2'] .etapas__flecha { background: var(--base); }
.slidev-layout.plas .etapas__productos { margin: 16px 0 0 26px; font-size: var(--fs-small); }
.slidev-layout.plas .etapas__productos li { margin: 0 0 4px; }
.slidev-layout.plas .etapas__nota { margin: 16px 0 0 34px; font-size: var(--fs-small); color: var(--muted); font-style: italic; }
</style>
