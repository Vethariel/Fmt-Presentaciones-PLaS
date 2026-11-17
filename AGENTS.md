# Formato de presentaciones PLaS — desarrollo

Este repositorio contiene el **sistema de diseño** de las presentaciones del grupo PLaS: el tema de Slidev, el validador, la plantilla y la documentación de las decisiones.

> Para **escribir una presentación**, la guía es [`template/AGENTS.md`](template/AGENTS.md), no este archivo.

## Estructura

| Carpeta | Contenido |
|---|---|
| `docs/` | Decisiones numeradas (01–08) y guía de formato (09). Léalas antes de cambiar el sistema |
| `brand/` | Logos PLaS (SVG redibujados) y escudo UNAL |
| `theme/` | `slidev-theme-plas`: tokens (`styles/`), maquetas (`layouts/`), componentes, tema de sintaxis (`setup/shiki.ts`) y validador (`bin/plas-check.mjs`) |
| `poc/` | Presentación de prueba de concepto |
| `showcase/` | Presentación de muestra: usa cada maqueta y elemento; fuente de las imágenes de docs/09 y prueba de regresión visual |
| `template/` | Punto de partida de cada presentación nueva, con su `AGENTS.md` |
| `tools/check/fixtures/` | Presentación con errores a propósito para probar el validador |

## Comandos

```bash
npm install                      # usa el Chrome del sistema (no descarga Chromium)
npm run dev                      # vista previa de poc/
npm run check                    # compila poc/ y la valida (reglas estáticas + renderizado)
npm run export                   # PDF de poc/ en poc/export/
npm run test:check               # el validador DEBE fallar con la presentación de errores
```

## Reglas para cambiar el sistema

1. **La identidad viene de `web_plas`**: tokens de color, fuentes y logo (docs/04, docs/05). No invente colores nuevos.
2. **Paridad web ⇄ PDF**: todo componente animado o interactivo necesita una versión impresa (docs/03 §5).
3. **Las reglas suben de nivel**: si una regla de `template/AGENTS.md` se puede imponer desde el tema (nivel 1) o comprobar en `plas-check` (nivel 2), muévala allí (docs/03 §8.1).
4. **Listas sincronizadas**: las maquetas y las líneas están en `theme/composables/usePlas.ts` y en `theme/bin/plas-check.mjs`. Si cambia una, cambie la otra y `template/AGENTS.md`.
5. **Contraste**: el color base de una línea nunca va en texto; use `--dark` (docs/04 §4).
6. Después de cualquier cambio: `npm run check`, `npm run test:check` y revisar el PDF exportado.
