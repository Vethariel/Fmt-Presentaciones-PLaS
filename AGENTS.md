# Formato de presentaciones PLaS

Este repositorio contiene el **sistema de diseño** de las presentaciones del grupo PLaS (el tema de Slidev, el validador, la plantilla y la documentación de las decisiones) y es también el lugar donde se escriben las presentaciones.

## Si va a escribir una presentación

Todo lo que genere va en **`presentaciones/<nombre>/`** y en ningún otro lugar.

1. Si la carpeta no existe, créela desde la raíz: `npm run nueva -- <nombre>` (minúsculas y guiones, p. ej. `seminario-lexers-2026`). Si `node_modules/` no existe, ejecute antes `npm install` en la raíz.
2. Trabaje dentro de `presentaciones/<nombre>/` y siga **su** `AGENTS.md`. El resto de este archivo no aplica.
3. No modifique nada fuera de esa carpeta: ni `theme/`, ni `template/`, ni `ejemplos/`, ni otras presentaciones. Si el formato no permite algo, dígalo al usuario en lugar de cambiar el tema.
4. No ejecute `npm install` dentro de la presentación: usa lo instalado en la raíz.

`presentaciones/` no se versiona en este repositorio (docs/10).

## Si va a cambiar el sistema de formato

### Estructura

| Carpeta | Contenido |
|---|---|
| `docs/` | Decisiones numeradas (01–08, 10) y guía de formato (09). Léalas antes de cambiar el sistema |
| `brand/` | Logos PLaS (SVG redibujados) y escudo UNAL |
| `theme/` | `slidev-theme-plas`: tokens (`styles/`), maquetas (`layouts/`), componentes, tema de sintaxis (`setup/shiki.ts`) validador (`bin/plas-check.mjs`) y exportador (`bin/plas-export.mjs`) |
| `poc/` | Presentación de prueba de concepto |
| `showcase/` | Presentación de muestra: usa cada maqueta y elemento; fuente de las imágenes de docs/09 y prueba de regresión visual |
| `template/` | Lo que `npm run nueva` copia en cada presentación nueva, con su `AGENTS.md` |
| `presentaciones/` | Presentaciones de los autores (no se versionan) |
| `ejemplos/` | Presentaciones reales migradas al formato |
| `referencias/` | PDFs de origen analizados en docs/01 y docs/02 |
| `tools/nueva.mjs` | Crea `presentaciones/<nombre>/` desde `template/` |
| `tools/check/fixtures/` | Presentación con errores a propósito para probar el validador |

### Comandos

```bash
npm install                      # usa el Chrome del sistema (PLAS_CHROME para otra ruta)
npm run dev                      # vista previa de poc/
npm run check                    # compila poc/ y la valida (reglas estáticas + renderizado)
npm run export                   # PDF de poc/ en poc/export/
npm run test:check               # el validador DEBE fallar con la presentación de errores
```

### Reglas para cambiar el sistema

1. **La identidad viene de `web_plas`**: tokens de color, fuentes y logo (docs/04, docs/05). No invente colores nuevos.
2. **Paridad web ⇄ PDF**: todo componente animado o interactivo necesita una versión impresa (docs/03 §5).
3. **Las reglas suben de nivel**: si una regla de `template/AGENTS.md` se puede imponer desde el tema (nivel 1) o comprobar en `plas-check` (nivel 2), muévala allí (docs/03 §8.1).
4. **La plantilla se copia, no se enlaza**: un cambio en `template/` solo llega a las presentaciones nuevas. Los cambios en `theme/` llegan a todas.
5. **Listas sincronizadas**: las maquetas y las líneas están en `theme/composables/usePlas.ts` y en `theme/bin/plas-check.mjs`. Si cambia una, cambie la otra y `template/AGENTS.md`. Las figuras de la malla (`theme/composables/meshFigures.json`) y sus límites (`theme/utils/figureRules.mjs`) tienen una sola fuente, compartida por el tema y el validador; si cambian, actualice docs/07 §6 y `template/AGENTS.md`.
6. **Contraste**: el color base de una línea nunca va en texto; use `--dark` (docs/04 §4).
7. Después de cualquier cambio: `npm run check`, `npm run test:check` y revisar el PDF exportado.
