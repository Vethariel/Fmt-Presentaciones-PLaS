<script setup lang="ts">
/**
 * Bloque de título centrado verticalmente (lo usa la portada).
 *
 * Rejilla de tres filas: [1fr] [título] [1fr + pie].
 * - Con poco texto, las dos filas flexibles son iguales: el título queda centrado
 *   en la diapositiva.
 * - Con mucho texto, la fila de abajo no se encoge por debajo de lo que ocupa el
 *   pie (firma + reserva de los logos): el título sube solo y nunca lo invade.
 *
 * Slots: `default` (título, subtítulo, párrafo) y `footer` (firma).
 * Prop `reserve`: espacio inferior que ocupan otros elementos (p. ej. los logos).
 */
withDefaults(defineProps<{ reserve?: number }>(), { reserve: 0 })
</script>

<template>
  <div class="plas-title-block" :style="{ '--reserve': `${reserve}px` }">
    <div class="plas-title-block__main">
      <slot />
    </div>
    <div class="plas-title-block__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.plas-title-block {
  position: absolute; inset: 0;
  display: grid; grid-template-rows: 1fr auto 1fr;
}
.plas-title-block__main { grid-row: 2; }
.plas-title-block__footer {
  grid-row: 3; align-self: end;
  /* Separación mínima con el título y reserva para los logos */
  padding-top: 32px; padding-bottom: var(--reserve);
}
</style>
