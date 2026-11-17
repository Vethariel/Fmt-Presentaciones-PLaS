# Identidad visual PLaS — Base para el formato de presentaciones

**Fecha:** 2026-11-17
**Fuente:** sitio web del grupo, repositorio `web_plas` (Astro 7 + Tailwind 4), publicado en https://plas.unal.edu.co
**Documentos previos:** [01](01-evaluacion-inicial.md), [02](02-evaluacion-referente-metodos-numericos.md), [03](03-propuesta-tecnica.md)

## 1. Conclusión

PLaS **ya tiene una identidad visual propia y madura**, definida como tokens de diseño en `web_plas/src/styles/global.css`. Esto resuelve la decisión pendiente sobre la marca (documento 03, sección 11): **las presentaciones heredan la identidad del sitio web**, no se diseña una nueva.

Además, el sitio ya resuelve buena parte de lo que se valoró en el referente (documento 02): logo propio, colores con significado (uno por línea de investigación), miga de pan y poca decoración. Las presentaciones serán así una extensión natural del sitio, y no un tercer estilo.

## 2. Inventario de la identidad

### 2.1 Logo

- **Archivo:** `public/images/PLaS/Logo_PLaS.png` (1000 × 386 px, PNG).
- **Composición:** el texto "PLa" más un símbolo en forma de "S" hecho con dos chevrones, que recuerda los signos `< >` del código, y debajo el lema "PROGRAMMING LANGUAGES AND SYSTEMS".
- **Color:** degradado horizontal de menta (`~#8EF5C0`) a azul (`~#0062BD`).

### 2.2 Paleta de marca

| Token | Valor | Uso en el sitio |
|---|---|---|
| `--mid` | `#3AD4B5` | Color principal (verde azulado-menta) |
| `--mid-soft` | `#D0F3EC` | Fondos suaves y la mitad izquierda del fondo dividido de la portada |
| `--mid-dark` | `#0E6B5C` | Texto de acento y enlaces |
| `--deep` | `#0C4F48` | Enlaces y texto de mayor contraste |
| `--amber` | `#E09B1A` | Acento cálido (botón principal) |
| `--amber-soft` | `#F6E2B8` | Fondo del acento cálido |
| `--ink` | `#2A2F2E` | Texto principal |
| `--muted` | `#5C6563` | Texto secundario |
| `--line` | `#D5E3DF` | Bordes y separadores |
| `--media` | `#EEF1F0` | Fondo de imágenes de relleno |
| `--network` | `#5F8F88` | Malla de grafos decorativa |
| `--radius` | `0.5rem` | Radio de las esquinas |

### 2.3 Colores por línea de investigación

Cada línea tiene un color base (`src/data/lines.json`) y una familia completa de tokens en CSS (`[data-line-theme]`), que sustituye a la de marca cuando se navega por esa línea:

| Línea | Base | `--mid-soft` | `--mid-dark` | `--deep` |
|---|---|---|---|---|
| Lenguajes de programación | `#00C9A7` | (la de marca) | (la de marca) | (la de marca) |
| Educación en ingeniería | `#FF9F1A` | `#FBE7CC` | `#7A530E` | `#5A3E0F` |
| Sistemas embebidos confiables | `#2F89EF` | `#DDECFE` | `#2C5D98` | `#224570` |
| Sistemas inteligentes de transporte | `#FF6B4A` | `#FEE3DD` | `#923F2C` | `#6C2F22` |
| Sensado inteligente | `#B14FD8` | `#F6E2FF` | `#77418E` | `#583169` |

### 2.4 Tipografía

| Rol | Fuente | Licencia | Uso en el sitio |
|---|---|---|---|
| Títulos | **Onest** (variable, 100–900) | OFL | Encabezados |
| Cuerpo | **Source Sans 3** (variable, 200–900, con cursiva) | OFL | Texto general |
| Citas | **Source Serif 4** (variable, con cursiva) | OFL | Frases destacadas (p. ej., la cita de Alan Kay en el inicio) |
| Código | *Sin definir*: usa la fuente monoespaciada del sistema | — | — |
| Institucional | Ancizar Sans / Serif | UNAL | Solo en el encabezado y el pie institucionales de la UNAL |

Las fuentes del sitio se sirven desde el propio sitio, mediante paquetes `@fontsource-variable`; no se descargan de Google.

### 2.5 Elementos gráficos característicos

| Elemento | Descripción | Archivo |
|---|---|---|
| **Fondo dividido** (*spine*) | División diagonal entre el tono suave de la marca y el blanco | `Spine.astro` |
| **Malla de grafos** | Red de nodos y aristas que flota en el fondo, animada y con poca opacidad | `FloatGraphs.astro`, `network-mesh*.ts` |
| **Degradado interior** | Degradado diagonal de `--mid-soft` a blanco en las páginas internas | `.page-shell--interior` |
| **Mapa de temas** | Grafo de los temas de cada línea, con movimiento | `TopicGraph.astro` |
| **Etiquetas de tipo** | Etiquetas con color para Evento, Proyecto, Publicación y Recurso | `TypeChip.astro` |
| **Miga de pan** | "Está en: Inicio / Líneas / …" | `Breadcrumb.astro` |
| **Encabezado y pie institucionales de la UNAL** | Barras con la identidad de la UNAL | `components/unal/*` |

### 2.6 Tono

Lo que se observa en los textos y las imágenes del sitio:

- **Cercano y propositivo:** "Investigamos construyendo, y construimos en equipo"; preguntas que abren cada línea ("¿Y si cada problema tuviera su propio lenguaje de programación?").
- **Moderno y técnico, con calidez:** fotografías de luz cálida, colores claros y mucho aire.
- **Académico sin rigidez:** citas de referentes, catálogo de publicaciones y trayectoria de los estudiantes.

## 3. Correspondencia con el formato de presentaciones

| Necesidad del formato | Lo que ya aporta la identidad | Decisión |
|---|---|---|
| Identidad PLaS (R5) | Logo, paleta y tipografías | Se heredan tal cual |
| Color por sección (R6) | 5 familias de color, una por línea | Ver sección 4 |
| Navegación (R6) | Miga de pan en el sitio | Misma lógica y estilo en la diapositiva |
| Fuentes garantizadas (R8) | Tres fuentes libres, servidas localmente | Se incluyen en el tema |
| Código (R7) | No resuelto | Hay que definir la fuente monoespaciada y el estilo de los bloques de código (sección 5) |
| Animación con versión impresa (R2, sección 5 del doc. 03) | Malla de grafos y mapa de temas animados | Primeros candidatos para componentes con doble versión: animados en la web, fotograma fijo en el PDF |
| Presencia de la UNAL | Encabezado y pie institucionales | En las diapositivas se reduce a la fila de logos; Ancizar no se usa en el contenido (sección 6) |

## 4. Color por sección: dos modos

La paleta de líneas permite dos modos de color en una presentación:

1. **Modo línea.** Cuando la presentación pertenece a una sola línea (por ejemplo, una sustentación de tesis en Educación), toda la presentación usa la familia de color de esa línea. Equivale al `data-line-theme` del sitio, aplicado a la presentación completa.
2. **Modo secciones.** Cuando la presentación recorre varios temas (por ejemplo, la presentación institucional del grupo o un taller), cada sección toma un color de la secuencia de líneas, igual que en el referente del documento 02:
   `#00C9A7` → `#FF9F1A` → `#2F89EF` → `#FF6B4A` → `#B14FD8`

   En la presentación institucional del grupo, cada sección **es** una línea y lleva su propio color, lo que da coherencia directa con el sitio. El límite de 5 colores coincide con lo recomendado en el documento 02 (sección 4.5).

### Regla de contraste

Los colores base **no sirven para texto sobre blanco**:

| Color | Contraste sobre blanco | ¿Apto para texto? (WCAG AA, 4,5:1) |
|---|---|---|
| Base de Lenguajes `#00C9A7` | 2,12 | No |
| Base de Educación `#FF9F1A` | 2,05 | No |
| Base de Embebidos `#2F89EF` | 3,53 | Solo texto grande |
| Base de Transporte `#FF6B4A` | 2,82 | No |
| Base de Sensado `#B14FD8` | 4,22 | Solo texto grande |
| Variantes `--mid-dark` (todas las líneas) | 6,4–7,2 | Sí |
| `--ink` | 13,6 | Sí |

**Regla del tema:** el color base se usa solo en bloques, marcas, líneas y fondos (miga de pan, separadores, barras de progreso). El **texto destacado usa siempre la variante `--mid-dark`**. La regla se aplica desde el tema, es decir, en el nivel 1 de la sección 8.1 del documento 03.

**Pendiente:** la línea de Lenguajes no tiene una familia propia; usa la de marca (`--mid: #3AD4B5`), que es distinta de su color base (`#00C9A7`). Hay que decidir si en las presentaciones Lenguajes usa la familia de marca, como en el sitio, o una familia propia derivada de `#00C9A7`.

## 5. Vacíos que hay que cerrar

| # | Vacío | Impacto | Propuesta |
|---|---|---|---|
| 1 | **El logo solo existe en PNG** de 1000 px | Se ve pixelado en un PDF grande o en proyección, y no se puede cambiar de color | Conseguir el **original vectorial** o redibujarlo en SVG, con versiones a color, monocroma oscura y monocroma clara |
| 2 | **No hay fuente monoespaciada definida** | El código, seña distintiva de PLaS, quedaría con la fuente de cada sistema | Definir una fuente libre. Candidata: **Source Code Pro**, de la misma familia Source; alternativa: JetBrains Mono. Validar en la prueba de concepto |
| 3 | **No hay tema de resaltado de sintaxis** | El código no tendría un aspecto propio | Crear un tema de Shiki derivado de la paleta (colores `--mid-dark` de cada línea sobre un fondo claro) |
| 4 | **El ícono del sitio** (`public/favicon.svg`) es el de Astro por defecto | No afecta a las presentaciones, pero sí a la identidad web | Sustituirlo por el símbolo de chevrones del logo (aplica al repositorio `web_plas`) |
| 5 | El nombre de una línea no coincide entre fuentes: en el `README` es "Agricultura de precisión" y en `lines.json` es "Sensado inteligente" | Puede aparecer inconsistente en las presentaciones | Usar el nombre de `lines.json` como fuente de verdad y corregir el `README` |

## 6. Relación con la identidad UNAL

- El sitio usa el **encabezado y el pie institucionales de la UNAL**, como exigen los lineamientos web de la universidad, y deja la identidad PLaS para el contenido.
- En las presentaciones no hay un encabezado institucional equivalente. La presencia de la UNAL se resuelve con la **fila de logos** (UNAL │ Facultad de Ingeniería │ PLaS), igual que en el referente del documento 02.
- **Ancizar** (la tipografía institucional) no se usa en el contenido del sitio, así que tampoco se usará en las diapositivas, por coherencia con el sitio.

## 7. Oportunidad: datos compartidos con el sitio

El sitio guarda en JSON (`src/data/`) las líneas, los profesores, los proyectos, los estudiantes y las publicaciones. Algunas maquetas del formato podrían leer esos datos directamente:

| Maqueta | Datos |
|---|---|
| `team` | `faculty.json` |
| `project` | `projects.json` |
| `agenda` en modo línea | `lines.json` (nombre, color y pregunta de cada línea) |

Así habría una sola fuente de verdad: si cambia un correo o un proyecto, se actualizan el sitio y las presentaciones. **Riesgo:** une los dos repositorios. Para mitigarlo, se recomienda que las presentaciones lean una **copia con versión** de los datos, no el repositorio en vivo. La implementación se evalúa después de la prueba de concepto.

## 8. Decisiones que cierra este documento

> **Actualización:** las propuestas y pendientes de este documento (tono, publicación, color de Lenguajes y logo vectorial) se resolvieron en [05-decisiones-color-logo-publicacion.md](05-decisiones-color-logo-publicacion.md).

| Decisión (doc. 03, sección 11) | Resultado |
|---|---|
| 1. Marca | **Resuelta:** se hereda la identidad del sitio web |
| 2. Tono | **Propuesta:** moderno y técnico con calidez, como el sitio. Pendiente de confirmar |
| 3. Tipografías | **Resuelta en parte:** Onest, Source Sans 3 y Source Serif 4. Falta la fuente monoespaciada |
| 4. Publicación | **Propuesta:** el mismo esquema del sitio, plas.unal.edu.co y una copia en GitHub Pages. Pendiente de confirmar |
