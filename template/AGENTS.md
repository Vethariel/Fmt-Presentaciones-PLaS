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

En modo línea, **ningún** separador lleva `line`, ni siquiera `plas`: toda la presentación tiene el color de la línea, también las secciones del grupo (cómo participar, cierre). En modo secciones, `line` es obligatorio en cada separador.

Líneas válidas: `lenguajes`, `educacion`, `embebidos`, `transporte`, `sensado`.

`plas` no es una línea: usa los colores de la marca del grupo. Úsela en las secciones que no pertenecen a ninguna línea (el grupo, cómo unirse, cierre). No la use para evitar elegir la línea de una sección que sí tiene una.

**Nunca escriba colores a mano** (hex, `style="color…"`). El tema aplica el color de la línea a viñetas, énfasis, bordes y números. El texto en negrita (`**…**`) toma automáticamente el tono oscuro legible de la línea.

## Maquetas: estructura y biblioteca de tipologías

### Estructura (el recorrido)

| Maqueta | Úsela para | Contenido |
|---|---|---|
| `cover` | Portada (solo la primera diapositiva) | `# Título`, `## Subtítulo`, un párrafo corto opcional. Autor y datos van en el frontmatter |
| `agenda` | Índice | Solo `# Agenda`. La lista se genera sola a partir de los separadores |
| `section` | Inicio de cada sección | `# Nombre`. Frontmatter: `question` (pregunta que abre la sección), `mesh` (figuras) y, solo en modo secciones, `line` |
| `closing` | Cierre (solo la última diapositiva) | `# Mensaje` corto («Gracias», una invitación), `## Subtítulo` opcional y un párrafo breve opcional para otros canales de contacto (un formulario, un grupo de mensajería). El nombre y el correo de quien presenta, los logos, la malla de la portada y el QR (si hay `webUrl`) los pone el tema |

**Orden:** `cover`, después, si hace falta, **una** diapositiva de presentación (por ejemplo `team`, con el equipo), luego `agenda` y las secciones. Todo el contenido restante va dentro de una sección; si algo no encaja en ninguna, cree una sección para ello (con `line: plas` en modo secciones). El validador avisa si hay más de una diapositiva de contenido antes de la primera sección.

### Biblioteca de tipologías de contenido

**Regla: para cada diapositiva, elija la tipología que mejor muestra ese contenido**, no la primera que funcione. Pregúntese qué es el contenido: ¿una comparación?, ¿una imagen que explica?, ¿datos?, ¿una sola idea? La tabla le dice qué tipología corresponde.

| El contenido es… | Tipología | Qué lleva |
|---|---|---|
| Una explicación con pocas ideas en lista | `default` | Texto y viñetas. Columna derecha opcional con `::aside::` (una ficha, una cifra) |
| Dos cosas en paralelo o en comparación (antes/después, web/PDF, ventajas/límites) | `two-cols` | Columna izquierda, `::right::`, columna derecha. Cada una puede empezar con `### Encabezado` |
| Una imagen, un diagrama o un gráfico que explica algo, más lo que hay que ver en él | `image-text` | Frontmatter `image`, `credit`, `caption`, `side: left\|right`, `fit: cover\|contain`; o un componente propio en `::figure::`. Texto breve al otro lado |
| Una imagen, un diagrama o un gráfico que es el contenido (un resultado, un esquema grande, una foto clave) | `image` | Frontmatter `image`, `credit`, `caption`; o un componente propio en `::figure::`. Una línea de comentario opcional |
| Varios ejemplos visuales del mismo tipo (prototipos, casos, capturas) | `gallery` | Frontmatter `images: [{ src, caption, credit }]`, de 2 a 6. Una línea de comentario opcional |
| Datos tabulados | `table` | Tabla Markdown y `::comment::` con lo que el público debe ver en ella |
| Una sola idea que el público debe llevarse (una tesis, una conclusión, un objetivo) | `statement` | Primer párrafo: la idea (máx. ~25 palabras). Un párrafo de apoyo opcional |
| Las palabras de otro (una definición, un testimonio, un fragmento de un artículo) | `quote` | La cita con `>` y frontmatter `cite: "Nombre, Obra, año"` |
| Personas (equipo, autores, asesores) | `team` | Frontmatter `people: [{ name, role, photo, credit }]`, de 2 a 8. Sin foto: iniciales |
| Código como protagonista | `code` | Bloque de código o animación de código, con su versión impresa |
| Una herramienta o simulación | `interactive` | Un único `<Interactive>` |

Cualquier otra maqueta es un error.

**Variedad (la comprueba el validador):**

- No ponga **más de 2 diapositivas seguidas** con la misma tipología dentro de una sección.
- Ninguna tipología puede ocupar **más de la mitad** de las diapositivas de contenido.
- Use al menos **3 tipologías** distintas en una presentación de 6 o más diapositivas de contenido.

Si el validador le señala una repetición, no cambie la maqueta por cambiarla: busque cuál de esas diapositivas tiene un contenido que otra tipología muestra mejor (una lista de dos grupos es un `two-cols`; una conclusión es un `statement`; tres capturas son una `gallery`).

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

**Dos columnas**

```md
---
layout: two-cols
---

# Corrección manual y automática

### Manual

- Lenta y dependiente del cansancio
- Comentarios ricos, pero tardíos

::right::

### Automática

- Inmediata y consistente
- Comentarios limitados si no se diseñan bien
```

**Imagen y texto**

```md
---
layout: image-text
image: /robot-aula.jpg
credit: "María Gómez · CC BY 4.0 · Wikimedia Commons"
caption: Robot educativo en una clase de quinto grado
side: right
---

# Programar sin teclado

Los estudiantes **arman el programa** con bloques físicos y el robot lo ejecuta.
```

**Galería**

```md
---
layout: gallery
images:
  - { src: /prototipo-1.jpg, caption: Primer prototipo, credit: Propia }
  - { src: /prototipo-2.jpg, caption: Segundo prototipo, credit: Propia }
  - { src: /prototipo-3.png, caption: Versión final, credit: "Generada con IA (Gemini)" }
---

# Tres prototipos en un año
```

**Tabla con comentario**

```md
---
layout: table
---

# Resultados del piloto

| Curso | Entregas | Precisión |
|---|---|---|
| Programación I | 412 | 0,91 |
| Programación II | 268 | 0,87 |

::comment::

La precisión **se mantiene** con ejercicios más largos.
```

**Idea clave y cita**

```md
---
layout: statement
---

# La conclusión

Una sola fuente produce **la web y el PDF**.

Nada puede existir solo en la web.

---
layout: quote
cite: Alan Kay, 1971
---

# Por qué inventar

> La mejor forma de predecir el futuro es inventarlo.
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

## Imágenes

**Use imágenes siempre que el contenido lo permita.** Una foto del prototipo, una captura del sistema, un esquema del método o un gráfico de resultados explican más que una lista. Si una diapositiva habla de algo que se puede ver, muéstrelo.

**Qué hacer con cada tipo de contenido visual:**

| Necesita mostrar… | Hágalo como | Dónde |
|---|---|---|
| Un método, un flujo, una arquitectura (diagrama con texto) | **Componente Vue** en `components/` (HTML y SVG) | `::figure::` de `image` o `image-text`, o en `default` |
| Cifras, tendencias, comparaciones numéricas | **Gráfico propio**: componente Vue con SVG | `::figure::` de `image` o `image-text`; la tabla, solo para valores exactos |
| El contexto real (un lugar, un equipo, un aula, un dispositivo) | **Foto** del usuario o de internet con licencia libre | `image`, `image-text` o `gallery` |
| Una escena o idea sin datos | Ilustración generada con IA, si puede | `image` o `image-text` |
| Capturas del sistema | Imagen PNG | `image`, `image-text` o `gallery` con `fit: contain` |

**Diagramas y gráficos con texto, como componentes, no como imágenes.** Un componente usa la tipografía del tema, escala con la diapositiva y se ve nítido en el PDF. Un PNG con texto casi siempre queda con letra pequeña: el validador mide los píxeles, no el tamaño del texto. En los componentes, use los colores del tema con variables CSS (`var(--base)`, `var(--dark)`, `var(--soft)`, `var(--ink)`, `var(--muted)`), nunca colores escritos a mano, y letra de al menos 14 px. Un SVG con `viewBox` se reduce al encajar en la diapositiva: el validador mide el tamaño final del texto y marca error por debajo de 10 px y aviso por debajo de 12. Si de todos modos usa una imagen con texto, su letra debe medir al menos 24 px cuando la imagen se muestra en la diapositiva (lienzo de 960 × 540).

```md
---
layout: image-text
side: right
---

# Siniestros por hora del día

El pico ocurre **entre las 5 y las 8 p. m.**, a la salida del trabajo.

::figure::

<SiniestrosPorHora />
```

**Gráficos sin datos.** Si el pedido describe una tendencia pero no da los datos, no invente cifras. Puede dibujar un **esquema ilustrativo** (formas sin valores en los ejes) si cumple tres condiciones: la diapositiva dice «Esquema ilustrativo, no son mediciones» junto al gráfico; el subtítulo o el texto dicen que los resultados son preliminares o que faltan los datos; y su informe pide los datos reales para reemplazarlo. Si puede preguntar, pida los datos antes.

**Fotos del contexto.** Si el tema ocurre en un lugar o con objetos reales (una ciudad, un aula, un laboratorio, un dispositivo), incluya al menos una foto que los muestre: le da al público algo concreto antes de los datos.

**De dónde sacar las imágenes, según sus herramientas.** Revise con qué cuenta y use lo que tenga, en este orden:

1. **Las que dé el usuario** (fotos, capturas, figuras de sus artículos). Si el tema las sugiere y no las tiene, pídalas. Si trabaja sin poder preguntar, dígalo en su informe y diga cuáles harían falta.
2. **Propias, si puede escribir y ejecutar código:** componentes Vue con SVG para diagramas y gráficos (no necesitan ejecutar nada más). Para generar un archivo de imagen puede usar scripts con el Chromium instalado en la raíz (`playwright-chromium`); guarde esos scripts fuera de la presentación, en su directorio temporal, y solo la imagen final en `public/`.
3. **Generadas con IA, si su entorno tiene generación de imágenes:** ilustraciones y escenas, no datos ni diagramas técnicos. Sin texto dentro de la imagen (sale deformado), sin personas reales identificables, sin logos. Un estilo coherente en toda la presentación.
4. **De internet, si puede buscar y descargar:** solo con licencia libre (CC0, dominio público, CC BY, CC BY-SA, o las licencias de Unsplash, Pexels y Pixabay). Busque en Openverse (openverse.org), Wikimedia Commons, Unsplash o Pexels, y lea la licencia en la página de la imagen. **No use** imágenes con licencia NC (no comercial) o ND (sin derivadas), sin licencia clara, con marca de agua, ni de buscadores generales.

Si no tiene alguna de estas capacidades, no la simule: siga con la siguiente y dígalo en su informe.

**Cómo incluirlas:**

- **Descargue** la imagen a `public/` con un nombre descriptivo (`robot-aula.jpg`) y cítela como `/robot-aula.jpg`. Nunca enlace a una URL externa.
- Escriba **siempre** `credit`: `Propia`, `Generada con IA (herramienta)` o `Autor · Licencia · Fuente`. El tema lo muestra en pequeño bajo la imagen (salvo `Propia`), como exigen las licencias CC BY.
- Resolución mínima: 1600 px de ancho para `image`, 1200 para `image-text`, 800 para cada imagen de una galería.
- En una galería, prefiera imágenes de proporción parecida. El tema las iguala en altura por fila sin recortarlas, pero una panorámica junto a un retrato deja una de las dos diminuta.
- `fit: contain` muestra la imagen entera (capturas, esquemas); `fit: cover` llena el marco recortando los bordes (fotos).
- En su informe final diga qué herramientas tuvo para imágenes, cuáles usó, y de dónde salió cada imagen y con qué licencia.

## Componentes del tema

| Componente | Uso | Versión impresa |
|---|---|---|
| `<WebOnly>` / `<PrintOnly>` | Contenido distinto para web y PDF | Siempre en pareja |
| `<Frames :labels="[…]">` | Tira de fotogramas: versión impresa de una animación | — (ya es estática) |
| `<Interactive>` | Contenedor de herramientas | Obligatorio `<template #print>`; el PDF añade un QR a la web |
| `<ProjectCard>` | Proyecto: `title`, `kind`, `level`, `people`, `funding` | Igual |
| `<Callout title="…" type="clave\|nota">` | Contenedor de color para una idea dentro de cualquier diapositiva (`clave`: color de la línea; `nota`: neutro) | Igual |
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
| Tamaño del texto | Todo texto, también el de diagramas y gráficos, se ve a 12 px o más (error por debajo de 10) |
| Portada y cierre | Ningún texto toca la diagonal del panel; el tema limita el ancho, pero una palabra muy larga puede salirse |
| Tipologías | Máx. 2 seguidas iguales; ninguna en más de la mitad de las de contenido; al menos 3 distintas (con 6 o más de contenido) |
| Imágenes | En `public/`, con `credit` y licencia libre; sin URL externas |
| Cierre | Un solo `closing`, al final |
| Desborde | Nada puede salirse de la diapositiva ni invadir el pie, ni en la web ni en el PDF |

Si algo no cabe: **divida la diapositiva**. No reduzca tamaños de letra ni ajuste márgenes.

## Texto

- **Trato al público según la formalidad de la presentación**, y el mismo en todas las diapositivas:
  - **Usted** en presentaciones formales: sustentaciones, avances de tesis, presentaciones institucionales, charlas ante evaluadores, pares o entidades externas.
  - **Tú** en presentaciones cercanas: invitaciones a estudiantes, semilleros, talleres, clases.
  - Si el pedido no deja claro el tono, elija según el público y dígale al usuario cuál usó.
- Alineación a la izquierda; nunca justificado.
- Énfasis con `**negrita**`, y como máximo dos o tres por diapositiva. No resalte frases completas.
- Citas con `>`: se muestran en Source Serif, en cursiva.
- Ecuaciones con `$…$` y `$$…$$` (KaTeX).
- Sin memes en presentaciones institucionales.
- Tablas en Markdown (`| … |`): el tema les da estilo, sin colores a mano. Una tabla por diapositiva, con pocas columnas y filas cortas. Si no cabe, divídala o resúmala.
- Cifras que aún no son definitivas (resultados preliminares, valores de ejemplo): dígalo en el subtítulo o junto a la cifra, p. ej. «Resultados preliminares, sin validar».

## Lo que no debe hacer

- Cambiar fuentes, colores, márgenes, la cabecera o el pie desde la presentación.
- Usar maquetas que no estén en el catálogo.
- Poner contenido en `<WebOnly>` sin su `<PrintOnly>`.
- Usar figuras genéricas que no digan nada del tema, o dar por bueno un dibujo sin mirarlo en `export/figuras.png`.
- Encadenar diapositivas `default` cuando el contenido pide otra tipología.
- Usar imágenes sin licencia clara, o enlazarlas desde internet en lugar de descargarlas.
- Entregar una presentación sin pasar `npm run check`.
