# Presentaciones PLaS — Guía para agentes

Esta presentación usa el formato del grupo PLaS (tema `slidev-theme-plas`, sobre Slidev). Una sola fuente, `slides.md`, produce **una versión web** (con animaciones e interacción) y **un PDF** (estático) con el mismo contenido.

> **Regla de oro: la web es el PDF que además se mueve.** Nada puede existir solo en la web.

Su trabajo es entregar un buen primer borrador dentro del formato; el usuario hará después los ajustes finos. Use su criterio en todo lo que esta guía no fija.

## Dónde y cómo trabajar

Esta carpeta (`presentaciones/<nombre>/`) es su único espacio de trabajo. Escriba en `slides.md`; los componentes propios van en `components/` y las imágenes en `public/` (se citan como `/imagen.png`). No modifique nada fuera de esta carpeta ni ejecute `npm install` aquí. Si el formato no permite algo, dígaselo al usuario.

```bash
npm run dev       # vista previa en http://localhost:3030
npm run figuras   # dibuja las figuras de la malla en export/figuras.png
npm run check     # compila y valida (reglas del formato + renderizado web y PDF)
npm run export    # PDF en export/
```

1. Arme la historia (ver «Lenguaje y narrativa») y escriba `slides.md`.
2. Ejecute `npm run check` hasta que no haya **errores**. Cada error trae su corrección (`→ …`). Los **avisos** son sugerencias: atiéndalos si mejoran la presentación; si tiene una razón para dejar uno, déjelo y dígalo en su informe.
3. Ejecute `npm run export` y mire cada página del PDF: el validador mide, pero no ve si algo se lee mal.

## Encabezado

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
  event: Seminario PLaS                # texto del pie: dónde o para qué se presenta
  # webUrl: https://…                  # solo si se sabe dónde se publicará la web (da el QR del PDF)
  # line: educacion                    # solo si toda la presentación es de una línea
mesh: [ … ]                            # figuras de la portada (ver «Figuras de la malla»)
---
```

Si el usuario no da `event`, dedúzcalo. Si no da `webUrl`, omítala: una URL inventada lleva a una página que no existe.

**Color.** Con `themeConfig.line` (modo línea) toda la presentación toma el color de esa línea, y ningún separador lleva `line`. Sin él (modo secciones), cada separador define su `line`: `lenguajes`, `educacion`, `embebidos`, `transporte`, `sensado`, o `plas` (colores de la marca) para secciones del grupo que no son de ninguna línea. Nunca escriba colores a mano.

## Lenguaje y narrativa

Una presentación es una explicación que alguien dice en voz alta, apoyada en diapositivas. El texto debe sonar como lo diría quien presenta: claro, concreto y conectado con lo anterior.

- **Primero la historia.** Antes de escribir, haga la lista de títulos en orden y léala de corrido: debe contar la presentación por sí sola (contexto, problema, qué se hizo, qué se encontró, qué sigue). Cada sección responde a la `question` de su separador.
- **Frases completas y conectadas.** Títulos y viñetas con sujeto y verbo, y la relación entre ideas dicha con un conector (*porque*, *por eso*, *aunque*, *en cambio*…). Una coma o unos dos puntos no reemplazan al conector.
- **Sin fórmulas de eslogan:** «X, no Y», tríadas por costumbre, «La clave: …», adjetivos de folleto (*innovador*, *robusto*, *integral*). Prefiera lo concreto: «La boya mide cada 10 minutos» dice más que «Monitoreo continuo».
- **El título dice qué muestra la diapositiva,** en una frase completa pero corta: cabe en una línea, unos 50 caracteres (40 en un separador). El subtítulo agrega lo que falta y no repite el título.
- **Para quién habla.** Palabras que el público conoce; explique los términos técnicos la primera vez ante público no técnico. Trato según la formalidad: *usted* en sustentaciones, avances e institucionales; *tú* en clases, talleres y semilleros. El mismo de principio a fin.
- Marque las cifras que no son definitivas («Resultados preliminares, sin validar»).

| Evite | Prefiera |
|---|---|
| Del humedal a la universidad, sin cables | Cada boya envía sus datos por radio hasta la universidad |
| Tres prototipos, cada uno mejor | Hicieron falta tres prototipos para que la boya funcionara |
| Datos disponibles, decisiones sin datos | Los datos existen, pero no se usan para decidir dónde intervenir |

Antes de entregar, relea en voz alta los títulos en orden y corrija lo que quien presenta no diría tal cual.

## Maquetas

**Estructura.** `cover` → (opcional) una diapositiva de presentación, como `team` → `agenda` → secciones, cada una abierta por un `section` → `closing`.

| Maqueta | Contenido |
|---|---|
| `cover` | `# Título`, `## Subtítulo`, párrafo corto opcional. Datos en el encabezado |
| `agenda` | Solo `# Agenda`: la lista se genera sola |
| `section` | `# Nombre` corto (es el nombre del capítulo en la agenda y la navegación). Frontmatter: `question`, `mesh` y, en modo secciones, `line` |
| `closing` | `# Mensaje` corto, `## Subtítulo` y un párrafo opcional (otros canales de contacto). El tema pone contacto, logos y QR |

**Contenido: elija la tipología que mejor muestra cada contenido**, no la primera que funcione, y varíe. El validador avisa si se repite mucho una.

| El contenido es… | Tipología | Qué lleva |
|---|---|---|
| Una explicación con pocas ideas | `default` | Texto y viñetas; columna derecha opcional con `::aside::` |
| Dos cosas en paralelo o en comparación | `two-cols` | Izquierda, `::right::`, derecha; cada una puede abrir con `### Encabezado` |
| Una imagen, un diagrama o un gráfico que explica, con texto | `image-text` | `image`, `credit`, `caption`, `side: left\|right`, `fit`; o un componente en `::figure::` |
| Una imagen, un diagrama o un gráfico que es el contenido | `image` | Igual que `image-text`, sin texto al lado |
| Varias imágenes del mismo tipo | `gallery` | `images: [{ src, caption, credit }]`, de 2 a 6 |
| Datos tabulados | `table` | Tabla Markdown y `::comment::` con lo que hay que ver en ella |
| Una sola idea clave | `statement` | La idea en el primer párrafo; apoyo breve opcional |
| Palabras de otro | `quote` | La cita con `>` y `cite: "Nombre, Obra, año"` |
| Personas | `team` | `people: [{ name, role, photo, credit }]`, de 2 a 8 |
| Código | `code` | Bloque de código o animación con su versión impresa |
| Una herramienta o simulación | `interactive` | Un único `<Interactive>` |

```md
---
layout: image-text
side: right
---

# Los siniestros se concentran al final de la tarde

El pico ocurre **entre las 5 y las 8 p. m.**, a la salida del trabajo.

::figure::

<SiniestrosPorHora />
```

**Paridad web ⇄ PDF.** Todo lo animado o interactivo necesita su versión impresa:

`````md
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

```md
<Interactive caption="Pruébelo en la versión web">
  <MiHerramienta />
  <template #print>
    <MiHerramienta readonly />
  </template>
</Interactive>
```

`v-click` revela pasos en la web; el PDF muestra el estado final, así que úselo solo si ese estado final se entiende solo.

**Otros componentes del tema:** `<Callout title="…" type="clave|nota">` (contenedor de color para una idea), `<ProjectCard title kind level people funding>` (ficha de proyecto).

## Imágenes

**Use imágenes siempre que el contenido lo permita:** si una diapositiva habla de algo que se puede ver, muéstrelo.

- **Diagramas y gráficos con texto:** como componentes Vue en `components/` (HTML y SVG), en el `::figure::` de `image` o `image-text`. Usan la letra del tema y se ven nítidos en el PDF. Colores con variables del tema (`var(--base)`, `var(--dark)`, `var(--soft)`, `var(--ink)`, `var(--muted)`). Para cifras, un gráfico; la tabla, para valores exactos. Si no tiene los datos, no invente cifras: un esquema ilustrativo rotulado como tal, y pida los datos en su informe.
- **Contexto real** (un lugar, un aula, un dispositivo): al menos una foto.
- **De dónde, según sus herramientas:**
  1. las del usuario (pídalas si puede preguntar);
  2. propias, hechas con código;
  3. generadas con IA, si su entorno lo permite: ilustraciones sin texto, sin personas reales ni logos;
  4. de internet, si puede buscar, solo con licencia libre (CC0, dominio público, CC BY, CC BY-SA, Unsplash, Pexels, Pixabay): Openverse, Wikimedia Commons, Unsplash o Pexels.

  No simule capacidades que no tiene.
- **Cómo incluirlas:** descargadas en `public/`, nunca enlazadas, y siempre con `credit`: `Propia`, `Generada con IA (herramienta)` o `Autor · Licencia · Fuente`. `fit: contain` muestra la imagen entera (capturas, esquemas); `fit: cover` llena el marco recortando (fotos).

## Figuras de la malla

La portada y cada separador dibujan con su malla de grafos **de 2 a 4 figuras propias**, y la malla pasa lentamente de una a otra. Cada figura es un objeto reconocible que diga algo de la presentación (en la portada) o de esa sección (en un separador). No reutilice dibujos de otras presentaciones del repositorio.

```yaml
mesh:
  - label: Lupa, la revisión de literatura      # qué es y por qué tiene que ver con el tema
    nodes: [[58.3, 58.3], [26.5, 66.9], [3.1, 43.5], [11.7, 11.7], [43.5, 3.1], [66.9, 26.5], [100, 100, 1]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6]]
```

Dibuje en una cuadrícula de unos 100 × 100 con `y` hacia abajo: un nodo en cada esquina o giro (`[x, y, 1]` agranda el nodo) y aristas solo para los trazos del dibujo, con lo mínimo para que se reconozca. Este ejemplo muestra la técnica; no lo copie. Después ejecute `npm run figuras` y mire `export/figuras.png`: si no puede nombrar el objeto sin leer su `label`, rehágalo o elija otro objeto más fácil de dibujar.

## Lo que hace el validador

Comprueba, entre otras cosas, los títulos de una línea, el máximo de 6 viñetas y 2 niveles, que nada se desborde ni toque la diagonal de la portada, el tamaño mínimo del texto, las imágenes y sus licencias, la paridad web y PDF, y los límites de las figuras. No hace falta memorizarlos: cuando algo falla, el mensaje dice qué cambiar. Si algo no cabe, divida la diapositiva; no reduzca letras ni márgenes.

## Su informe final

Al terminar, dígale al usuario en pocas líneas:

- qué dedujo y no le dieron (`event`, tono, modo de color, datos que faltan);
- de dónde salió cada imagen, con su licencia, y qué fotos o datos harían falta;
- qué objeto dibujó en cada figura de la malla;
- los avisos del validador que dejó y por qué.
