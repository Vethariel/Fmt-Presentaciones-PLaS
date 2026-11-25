# Presentaciones PLaS — Guía para agentes

Esta presentación usa el formato del grupo PLaS (tema `slidev-theme-plas`, sobre Slidev). Una sola fuente, `slides.md`, produce **una versión web** (con animaciones e interacción) y **un PDF** (estático). Las dos deben mostrar el mismo contenido.

> **Regla de oro: la web es el PDF que además se mueve.** Nada puede existir solo en la web.

## Dónde trabajar

Esta carpeta (`presentaciones/<nombre>/` dentro del repositorio del formato) es **su único espacio de trabajo**:

- Escriba en `slides.md` y ponga los componentes propios en `components/`. Las imágenes van en `public/` y se citan como `/imagen.png`.
- No modifique nada fuera de esta carpeta (el tema, la plantilla, otras presentaciones). Si el formato no permite algo, dígaselo al usuario.
- No ejecute `npm install` aquí: el tema y las herramientas se instalan en la raíz del repositorio.

## Flujo de trabajo obligatorio

Todos los comandos se ejecutan dentro de esta carpeta:

```bash
npm run dev       # vista previa en http://localhost:3030
npm run build     # versión web en dist/
npm run figuras   # dibuja las figuras de la malla en export/figuras.png
npm run check     # compila y valida: reglas estáticas + renderizado web y PDF
npm run export    # PDF en export/
```

Una diapositiva **no está terminada** hasta que `npm run check` termina sin errores. Al final, ejecute `npm run export` y **mire cada página del PDF**: el validador mide desbordes, pero no ve si algo se lee mal o se ve raro. Si el validador informa un error, aplique la corrección que indica (`→ …`) y vuelva a ejecutarlo. No desactive reglas.

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
  event: Seminario PLaS · Taller de escritura   # texto del pie: dónde o para qué se presenta
  webUrl: https://unplas.github.io/<repositorio> # SOLO si ya se sabe dónde se publicará la web
  # line: educacion   # SOLO si toda la presentación es de una línea (modo línea)
---
```

- **`event`**: el contexto de la charla, corto: «Avance de tesis · Maestría en Ingeniería de Sistemas», «Seminario PLaS». Si el usuario no lo da, dedúzcalo del pedido y dígale qué puso.
- **`webUrl`**: la dirección donde se publicará la versión web; con ella el PDF muestra un QR junto a cada `<Interactive>`. Si el usuario no la da, **omítala**: sin ella no hay QR, y una URL inventada lleva a una página que no existe.

## Color: modo línea o modo secciones

- **Modo línea:** `themeConfig.line` fija el color de toda la presentación. Úselo para sustentaciones, avances y charlas de una sola línea.
- **Modo secciones:** sin `themeConfig.line`, cada separador (`layout: section`) define su `line` y las diapositivas siguientes heredan ese color.

En modo línea, los separadores **no** llevan `line` (se ignoraría). En modo secciones, es obligatorio en cada separador.

Líneas válidas: `lenguajes`, `educacion`, `embebidos`, `transporte`, `sensado`.

`plas` no es una línea: usa los colores de la marca del grupo. Úsela en las secciones que no pertenecen a ninguna línea (el grupo, cómo unirse, cierre). No la use para evitar elegir la línea de una sección que sí tiene una.

**Nunca escriba colores a mano** (hex, `style="color…"`). El tema aplica el color de la línea a viñetas, énfasis, bordes y números. El texto en negrita (`**…**`) toma automáticamente el tono oscuro legible de la línea.

## Catálogo de maquetas

| Maqueta | Úsela para | Contenido |
|---|---|---|
| `cover` | Portada (solo la primera diapositiva) | `# Título`, `## Subtítulo`, un párrafo corto opcional. Autor y datos van en el frontmatter |
| `agenda` | Índice | Solo `# Agenda`. La lista se genera sola a partir de los separadores |
| `section` | Inicio de cada sección | `# Nombre`. Frontmatter: `question` (pregunta que abre la sección), `mesh` (figuras) y, solo en modo secciones, `line` |
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
| `<NetworkMesh>` | Malla de grafos de portada y separadores. Se controla con `mesh` (ver «Figuras de la malla») | Primera figura, estática |
| `<LogoRow>` | Fila de logos UNAL │ Facultad │ PLaS | Igual |

## Figuras de la malla (`mesh`): obligatorias y propias

La portada y **cada** separador dibujan con su malla de grafos **de 2 a 4 figuras propias**. La malla pasa lentamente de una figura a otra. Las figuras se dibujan para esta presentación: no hay figuras por nombre, y el validador rechaza copias de los ejemplos y figuras repetidas.

**Qué dibujar.** Cada figura debe decir algo del tema:

- En la **portada**: de la presentación entera (su objeto, su campo, su resultado).
- En un **separador**: de esa sección. Lea su título y su `question` y dibuje objetos concretos que respondan a ellos.
- Prefiera **objetos reconocibles** (un instrumento, un documento, una señal, una herramienta) a ideas abstractas. Las figuras de una misma diapositiva deben ser distintas entre sí y mirar el tema desde ángulos diferentes.
- **No reutilice dibujos ni ideas de otras presentaciones** del repositorio (`poc/`, `showcase/`, `ejemplos/`). Si su tema no es el de ellas, sus figuras tampoco le sirven. El validador rechaza las copias, aunque estén retocadas.

**Cómo dibujar.**

1. Imagine el objeto en una cuadrícula de unos 100 × 100, con `y` hacia **abajo**. El tema conserva la proporción del dibujo: lo agranda hasta llenar el panel de la malla sin deformarlo, igual que `figuras.png`.
2. Ponga un nodo en cada esquina o punto de giro: 6 a 18 nodos. Un tercer valor, `[x, y, 1]`, agranda el nodo (sirve como punto o acento).
3. Una con aristas solo los trazos del dibujo: 6 a 28. Un trazo curvo se aproxima con 3 a 5 nodos. Todo nodo necesita al menos una arista.
4. Escriba en `label` qué es y qué tiene que ver con el tema.
5. Ejecute `npm run figuras` y **mire `export/figuras.png`**. Para cada dibujo, tape mentalmente su `label` y diga qué objeto ve. Si no lo puede nombrar a la primera, o nombra otro objeto, el dibujo no sirve: rehágalo o cámbielo por un objeto más fácil de dibujar. No dé por bueno un dibujo solo porque el validador lo acepta: el validador comprueba la forma, no si se reconoce.
6. En su informe final, diga qué objeto dibujó en cada figura y si tuvo que rehacer alguna.

```yaml
mesh:
  - label: Lupa, la revisión de literatura
    nodes: [[58.3, 58.3], [26.5, 66.9], [3.1, 43.5], [11.7, 11.7], [43.5, 3.1], [66.9, 26.5], [100, 100, 1]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6]]
  - label: Embudo, acotar el tema de lo general a lo particular
    nodes: [[0, 12], [22, 2], [78, 2], [100, 12], [78, 22], [22, 22], [43, 72], [57, 72], [43, 96, 0.9], [57, 96, 0.9]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [3, 7], [6, 8], [7, 9]]
```

Estas dos son ejemplos de la técnica: el validador rechaza copiarlas. Opcional: `angle: -30` gira la figura (en grados).

El tema dibuja las aristas de la figura con trazo grueso y teje alrededor una malla secundaria delgada. Por eso hay que dibujar con lo mínimo: los trazos justos para que se reconozca, sin rellenar.

**Navegación automática:** la agenda, la miga de pan y el panel lateral de capítulos (se abre al llevar el mouse al borde izquierdo o con la tecla C, solo en la web) se generan a partir de los separadores (`layout: section`). Dé a cada separador un título corto y claro: es el nombre del capítulo en todos esos lugares.

`v-click` revela elementos paso a paso en la web; en el PDF se muestra el estado final. Use `v-click` solo cuando el estado final tiene sentido por sí mismo.

## Límites de contenido (los verifica el validador)

| Regla | Límite |
|---|---|
| Título (`#`) en maquetas de contenido | 1 línea, máx. 50 caracteres |
| Título de sección | máx. 40 caracteres; el detalle va en `question` |
| Subtítulo (`##`) | 1 línea, máx. 90 caracteres |
| Viñetas de primer nivel | máx. 6 por diapositiva, **sumando la columna principal y `::aside::`** |
| Niveles de anidación | máx. 2 |
| Palabras por diapositiva | máx. recomendado 110 (aviso) |
| Figuras de la malla | Portada y cada separador: 2 a 4 propias, con `label`; 6–18 nodos y 6–28 aristas cada una; sin copias (ni retocadas) de los ejemplos o de otras presentaciones del repositorio, sin repeticiones |
| Desborde | Nada puede salirse de la diapositiva ni invadir el pie, ni en la web ni en el PDF |

Si algo no cabe: **divida la diapositiva**. No reduzca tamaños de letra ni ajuste márgenes.

## Texto e imágenes

- **Trato al público según la formalidad de la presentación**, y el mismo en todas las diapositivas:
  - **Usted** en presentaciones formales: sustentaciones, avances de tesis, presentaciones institucionales, charlas ante evaluadores, pares o entidades externas.
  - **Tú** en presentaciones cercanas: invitaciones a estudiantes, semilleros, talleres, clases.
  - Si el pedido no deja claro el tono, elija según el público y dígale al usuario cuál usó.
- Alineación a la izquierda; nunca justificado.
- Énfasis con `**negrita**`, y como máximo dos o tres por diapositiva. No resalte frases completas.
- Citas con `>`: se muestran en Source Serif, en cursiva.
- Ecuaciones con `$…$` y `$$…$$` (KaTeX).
- Tablas en Markdown (`| … |`): el tema les da estilo, sin colores a mano. Una tabla por diapositiva, con pocas columnas y filas cortas. Si no cabe, divídala o resúmala.
- Cifras que aún no son definitivas (resultados preliminares, valores de ejemplo): dígalo en el subtítulo o junto a la cifra, p. ej. «Resultados preliminares, sin validar».
- Imágenes propias o con licencia, de 1600 px de ancho como mínimo para ocupar media diapositiva. Indique la fuente si no es propia.
- Sin memes ni imágenes de origen mezclado en presentaciones institucionales.

## Lo que no debe hacer

- Cambiar fuentes, colores, márgenes, la cabecera o el pie desde la presentación.
- Usar maquetas que no estén en el catálogo.
- Poner contenido en `<WebOnly>` sin su `<PrintOnly>`.
- Usar figuras genéricas que no digan nada del tema, o dar por bueno un dibujo sin mirarlo en `export/figuras.png`.
- Entregar una presentación sin pasar `npm run check`.
