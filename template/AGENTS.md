# Presentaciones PLaS — Guía para agentes

Esta presentación usa el formato del grupo PLaS (tema `slidev-theme-plas`, sobre Slidev). Una sola fuente, `slides.md`, produce **una versión web** (con animaciones e interacción) y **un PDF** (estático). Las dos deben mostrar el mismo contenido.

> **Regla de oro: la web es el PDF que además se mueve.** Nada puede existir solo en la web.

## Flujo de trabajo obligatorio

```bash
npm run dev       # vista previa en http://localhost:3030
npm run build     # versión web en dist/
npm run check     # validador: reglas estáticas + renderizado web y PDF
npm run export    # PDF en export/
```

Una diapositiva **no está terminada** hasta que `npm run check` termina sin errores. Si el validador informa un error, aplique la corrección que indica (`→ …`) y vuelva a ejecutarlo. No desactive reglas.

## Encabezado (primer bloque de frontmatter)

```yaml
---
theme: plas
title: Título de la presentación
layout: cover
speaker: Nombre de quien presenta     # no use `author` (reservado por Slidev)
email: correo@unal.edu.co
place: Universidad Nacional de Colombia · Sede Bogotá
date: Noviembre 2026
themeConfig:
  event: Seminario PLaS · Taller de escritura   # texto del pie
  webUrl: https://unplas.github.io/<repositorio> # para los QR del PDF
  # line: educacion   # SOLO si toda la presentación es de una línea (modo línea)
---
```

## Color: modo línea o modo secciones

- **Modo línea:** `themeConfig.line` fija el color de toda la presentación. Úselo para sustentaciones, avances y charlas de una sola línea.
- **Modo secciones:** sin `themeConfig.line`, cada separador (`layout: section`) define su `line` y las diapositivas siguientes heredan ese color.

Líneas válidas: `lenguajes`, `educacion`, `embebidos`, `transporte`, `sensado`.

**Nunca escriba colores a mano** (hex, `style="color…"`). El tema aplica el color de la línea a viñetas, énfasis, bordes y números. El texto en negrita (`**…**`) toma automáticamente el tono oscuro legible de la línea.

## Catálogo de maquetas

| Maqueta | Úsela para | Contenido |
|---|---|---|
| `cover` | Portada (solo la primera diapositiva) | `# Título`, `## Subtítulo`, un párrafo corto opcional. Autor y datos van en el frontmatter |
| `agenda` | Índice | Solo `# Agenda`. La lista se genera sola a partir de los separadores |
| `section` | Inicio de cada sección | `# Nombre`. Frontmatter: `line` y `question` (pregunta que abre la sección) |
| `default` | Contenido general | `# Título`, `## Subtítulo` opcional, texto y viñetas. Columna derecha opcional con `::aside::` |
| `code` | Código como protagonista | `# Título`, `## Subtítulo`, bloque de código o animación de código |
| `interactive` | Una herramienta o simulación | `# Título`, `## Subtítulo` y un único `<Interactive>` |

Cualquier otra maqueta es un error.

### Ejemplos mínimos

**Separador**

```md
---
layout: section
line: educacion
question: ¿Puede una inteligencia artificial enseñarte a programar sin pensar por ti?
---

# Educación en ingeniería
```

**Contenido con columna lateral**

```md
---
layout: default
---

# Realimentación automática

## Evaluación continua de habilidades de programación

Un juez en línea califica el código, pero **no explica el error**.

- Retroalimentación **formativa** en cada envío
- Herramientas para el estudiante y el docente

::aside::

<ProjectCard title="UNCode" level="Maestría" funding="Universidad Nacional de Colombia">

Calificación automática de ejercicios de programación.

</ProjectCard>
```

**Código animado (con su versión impresa)**

`````md
---
layout: code
---

# Refactorización paso a paso

<WebOnly>

````md magic-move {lines: false}
```python
def f(l): ...
```
```python
def suma_pares(xs): ...
```
````

</WebOnly>

<PrintOnly>

<Frames :labels="['Original', 'Refactorizado']">

```python
def f(l): ...
```

```python
def suma_pares(xs): ...
```

</Frames>

</PrintOnly>
`````

**Herramienta interactiva (con su instantánea)**

```md
---
layout: interactive
---

# Del texto a los tokens

<Interactive caption="Pruébelo en la versión web">
  <MiHerramienta />
  <template #print>
    <MiHerramienta readonly />
  </template>
</Interactive>
```

Los componentes propios de la presentación van en `components/`. Todo componente interactivo debe aceptar un modo estático (por ejemplo, `readonly`) para su versión impresa.

## Componentes del tema

| Componente | Uso | Versión impresa |
|---|---|---|
| `<WebOnly>` / `<PrintOnly>` | Contenido distinto para web y PDF | Siempre en pareja |
| `<Frames :labels="[…]">` | Tira de fotogramas: versión impresa de una animación | — (ya es estática) |
| `<Interactive>` | Contenedor de herramientas | Obligatorio `<template #print>`; el PDF añade un QR a la web |
| `<ProjectCard>` | Proyecto: `title`, `kind`, `level`, `people`, `funding` | Igual |
| `<NetworkMesh>` | Malla de grafos decorativa (la usan portada y separadores) | Estática |
| `<LogoRow>` | Fila de logos UNAL │ Facultad │ PLaS | Igual |

`v-click` revela elementos paso a paso en la web; en el PDF se muestra el estado final. Use `v-click` solo cuando el estado final tiene sentido por sí mismo.

## Límites de contenido (los verifica el validador)

| Regla | Límite |
|---|---|
| Título (`#`) en maquetas de contenido | 1 línea, máx. 50 caracteres |
| Título de sección | máx. 40 caracteres; el detalle va en `question` |
| Subtítulo (`##`) | 1 línea, máx. 90 caracteres |
| Viñetas de primer nivel | máx. 6 |
| Niveles de anidación | máx. 2 |
| Palabras por diapositiva | máx. recomendado 110 (aviso) |
| Desborde | Nada puede salirse de la diapositiva ni invadir el pie, ni en la web ni en el PDF |

Si algo no cabe: **divida la diapositiva**. No reduzca tamaños de letra ni ajuste márgenes.

## Texto e imágenes

- Alineación a la izquierda; nunca justificado.
- Énfasis con `**negrita**`, y como máximo dos o tres por diapositiva. No resalte frases completas.
- Citas con `>`: se muestran en Source Serif, en cursiva.
- Ecuaciones con `$…$` y `$$…$$` (KaTeX).
- Imágenes propias o con licencia, de 1600 px de ancho como mínimo para ocupar media diapositiva. Indique la fuente si no es propia.
- Sin memes ni imágenes de origen mezclado en presentaciones institucionales.

## Lo que no debe hacer

- Cambiar fuentes, colores, márgenes, la cabecera o el pie desde la presentación.
- Usar maquetas que no estén en el catálogo.
- Poner contenido en `<WebOnly>` sin su `<PrintOnly>`.
- Entregar una presentación sin pasar `npm run check`.
