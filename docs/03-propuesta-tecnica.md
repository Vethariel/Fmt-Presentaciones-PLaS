# Propuesta técnica — Formato de presentaciones PLaS

**Fecha:** 2026-11-17
**Estado:** Aprobada para prueba de concepto
**Documentos previos:** [01-evaluacion-inicial.md](01-evaluacion-inicial.md), [02-evaluacion-referente-metodos-numericos.md](02-evaluacion-referente-metodos-numericos.md)

## 1. Decisión

El formato de presentaciones PLaS se construirá con **[Slidev](https://sli.dev)** como un **sistema de diseño**. Cada presentación se escribe una vez y produce dos salidas:

- **Web:** versión interactiva, con animaciones de los procesos que se explican y herramientas incrustadas.
- **PDF:** versión estática, generada a partir del mismo renderizado.

Las dos salidas comparten la misma base visual. La web añade movimiento e interacción, pero no contenido que el PDF no tenga.

## 2. Requisitos

| # | Requisito | Origen |
|---|---|---|
| R1 | La web y el PDF comparten base visual y contenido | Decisión del grupo |
| R2 | Animaciones del contenido que se explica, no solo transiciones de página | Decisión del grupo |
| R3 | Posibilidad de incrustar herramientas interactivas | Decisión del grupo |
| R4 | Aire de LMS (curso en línea) bien diseñado | Decisión del grupo |
| R5 | Identidad PLaS dentro del marco UNAL | Documentos 01 y 02 |
| R6 | Color por sección, navegación real y poca decoración | Documento 02 |
| R7 | Tratamiento de primera clase para código y ecuaciones | Documentos 01 y 02 |
| R8 | Resultado igual en cualquier máquina (fuentes incluidas) | Documento 02, sección 4.1 |
| R9 | Pensado para que lo escriban **estudiantes y profesores con ayuda de agentes de IA** | Decisión del grupo |

## 3. Por qué Slidev

| Necesidad | Qué ofrece Slidev |
|---|---|
| Misma base para web y PDF (R1) | El PDF se exporta capturando con un navegador las mismas diapositivas que se ven en la web |
| Animar lo que se explica (R2) | `v-click`, `v-motion` y transiciones; **Shiki Magic Move** para animar código de un paso al siguiente |
| Herramientas incrustadas (R3) | Componentes Vue propios, editor Monaco ejecutable e iframes |
| Código y ecuaciones (R7) | Shiki para resaltar código, KaTeX para ecuaciones y Mermaid para diagramas |
| Sistema reutilizable (R5, R6, R8) | Temas distribuibles como paquete, con maquetas, componentes, estilos y fuentes |
| Escritura con agentes (R9) | Las presentaciones son texto plano (Markdown): un agente las lee, escribe y valida sin problema |
| Publicación | Se genera un sitio estático, sin servidor |

**Alternativas descartadas:**

- **Quarto:** genera el PDF con otro motor (Typst o LaTeX), así que la web y el PDF se desalinean (incumple R1).
- **Reveal.js solo:** crear componentes propios es más costoso y la exportación es menos fina.
- **Desarrollo a medida (Astro o React):** obliga a reconstruir la exportación, el modo presentador, la navegación y las animaciones de código.

## 4. Arquitectura

```
plas-slides/                      ← monorepo del formato
├── theme/                        ← slidev-theme-plas (el sistema de diseño)
│   ├── styles/                   ← tokens: color, tipografía, espaciado
│   ├── fonts/                    ← fuentes libres incluidas en el tema (R8)
│   ├── layouts/                  ← catálogo de maquetas (sección 6)
│   ├── components/               ← componentes del sistema (sección 7)
│   ├── global-top.vue            ← miga de pan, botón "inicio", barra de progreso
│   └── global-bottom.vue         ← pie: evento y número de página
├── template/                     ← plantilla para comenzar una presentación nueva
│   ├── slides.md
│   ├── AGENTS.md                 ← reglas de diseño para agentes (sección 8)
│   └── package.json
├── showcase/                     ← presentación de muestra con todas las maquetas
├── tools/
│   └── check/                    ← validador automático (sección 8.3)
└── docs/                         ← este directorio
```

- El **tema** se versiona por separado. Cada presentación declara qué versión usa, así que una mejora del tema no rompe las presentaciones ya publicadas.
- Cada presentación vive en **su propio repositorio**, creado a partir de `template/`.
  > **Actualización:** el doc. [10](10-donde-viven-las-presentaciones.md) cambia esto: las presentaciones se crean en `presentaciones/<nombre>/` dentro del clon de este repositorio.
- La **muestra** (`showcase/`) sirve de documentación visual y de prueba de regresión: si cambia algo del tema, se revisa contra ella.

## 5. Principio rector: paridad entre web y PDF

> **La web es el PDF que además se mueve.** Ningún contenido existe solo en la web.

Todo componente animado o interactivo debe declarar su **versión impresa**:

| En la web | En el PDF |
|---|---|
| Revelado paso a paso (`v-click`) | El estado final, o una página por paso cuando los pasos son el contenido |
| Animación de código (Magic Move) | Los estados clave lado a lado, o una página por estado |
| Animación de un proceso (por ejemplo, un algoritmo) | Una tira de 3 o 4 fotogramas clave en la misma diapositiva |
| Herramienta interactiva | Captura de un estado representativo, más un código QR o enlace a esa diapositiva en la web |

**Regla:** un componente que no defina su versión impresa no se acepta en el tema. El validador lo comprueba (sección 8.3).

## 6. Catálogo de maquetas

Sale de las necesidades del documento 01 (sección 5) y del sistema del referente (documento 02).

| Maqueta | Uso | Origen |
|---|---|---|
| `cover-brand` | Portada de marca (opcional, para cursos y presentaciones largas) | Referente |
| `cover` | Portada con título, autor, contacto, lugar y fila de logos | 01 y referente |
| `agenda` | Índice con el color de cada sección; sirve de mapa | Referente |
| `section` | Separador de sección con número y color | 01 y referente |
| `default` | Contenido con título y subtítulo opcional | 01 |
| `two-cols` | Contenido en dos columnas (texto con imagen, comparación) | 01 |
| `diagram` | Diagrama o flujo con la paleta semántica | 01 |
| `code` | Bloque de código de protagonista, con animación opcional | 01, seña distintiva de PLaS |
| `math` | Desarrollo de ecuaciones con espacio y alineación | Referente |
| `project` | Proyecto: título, estudiante, nivel, financiación e imagen | 01 |
| `quote` | Cita o texto de ejemplo con su referencia | 01 |
| `team` | Equipo o profesores con su línea y contacto | 01 |
| `interactive` | Herramienta o simulación a pantalla casi completa, con su versión impresa | Requisito R3 |
| `closing` | Cierre con contacto y logos | 01 |

## 7. Componentes y capas globales

| Componente | Función |
|---|---|
| Miga de pan | Marca de color, número y nombre de la sección actual (arriba a la izquierda) |
| Botón "inicio" | Vuelve a la agenda; icono de línea simple |
| Barra de progreso | Avance dentro de la sección y en toda la presentación |
| Pie | Nombre del evento y número de página en el color de la sección |
| Fila de logos | UNAL │ Facultad o Departamento │ PLaS |
| `<CodeSteps>` | Envoltura de Magic Move con su versión impresa definida |
| `<Frames>` | Tira de fotogramas clave para animaciones de procesos (la versión impresa) |
| `<Interactive>` | Contenedor de herramientas: en la web, la herramienta; en el PDF, captura más QR |
| `<Callout>` | Notas, advertencias y definiciones con un estilo único |
| `<Cite>` | Referencia bibliográfica corta en la diapositiva |

**Aire de LMS:** se construye con la agenda, la miga de pan, la barra de progreso y un panel lateral con el temario (plegable, solo en la web). Como segunda fase se evalúa un **modo lectura**: las diapositivas en scroll, para estudiar sin presentar.

## 8. Escritura asistida por agentes

Estudiantes y profesores escribirán sus presentaciones con ayuda de agentes de IA. Por eso **la base y las reglas de diseño son el producto principal**: el agente tiene que poder seguirlas sin ambigüedad, y una máquina tiene que poder comprobarlas.

### 8.1 Reglas en tres niveles

1. **El tema las hace cumplir solas:** colores, fuentes, márgenes, miga de pan y pie no se pueden alterar desde la presentación.
2. **El validador las detecta:** todo lo que se pueda medir se comprueba automáticamente (sección 8.3).
3. **El agente las sigue por escrito:** el resto queda en `AGENTS.md`, con ejemplos de lo que sí y de lo que no.

Siempre que se pueda, una regla debe subir de nivel, de 3 a 2 o de 2 a 1.

### 8.2 `AGENTS.md` de la plantilla

Debe contener, como mínimo:

- el catálogo de maquetas, con cuándo usar cada una y un ejemplo mínimo de Markdown;
- los componentes disponibles y su versión impresa;
- los límites de contenido: longitud de títulos, viñetas por diapositiva, niveles de anidación;
- las reglas de texto: alineación a la izquierda, nunca justificado, y cómo aplicar el énfasis;
- las reglas de imágenes: resolución mínima, fuentes permitidas y sin memes en presentaciones institucionales;
- el flujo de trabajo: escribir, validar, exportar el PDF y revisarlo.

### 8.3 Validador (`plas check`)

| Comprobación | Tipo |
|---|---|
| El texto se sale de la diapositiva (por ejemplo, títulos de más de una línea, como en el documento 02, sección 4.1) | Renderizado con navegador |
| Títulos demasiado largos y exceso de viñetas por diapositiva | Análisis estático |
| Maqueta inexistente o sección sin color asignado | Análisis estático |
| Componente interactivo sin versión impresa | Análisis estático |
| Imágenes de baja resolución | Análisis de archivos |
| La exportación a PDF termina sin errores | Prueba de exportación |

El validador devuelve mensajes que un agente pueda usar directamente: la diapositiva, la regla incumplida y la corrección sugerida.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La exportación paso a paso genera muchas páginas | Por defecto se exporta el estado final; la exportación por pasos se activa solo donde se marque |
| Algunos componentes no se ven bien en la exportación | La regla de versión impresa obligatoria y la prueba de exportación en el validador |
| Un cambio del tema rompe presentaciones antiguas | Tema versionado; la muestra sirve como prueba de regresión |
| Dependencia de un proyecto de terceros (Slidev) | Proyecto activo y de código abierto; el sistema de diseño (tokens, reglas) se documenta aparte de la implementación |
| El agente se salta reglas | Más reglas en los niveles 1 y 2 (sección 8.1) |

## 10. Prueba de concepto

> **Actualización:** los resultados están en [06-resultados-prueba-de-concepto.md](06-resultados-prueba-de-concepto.md). Se cumplen los criterios 1 a 3; el 4 queda pendiente.

**Alcance:** un tema PLaS mínimo y una presentación de 5 diapositivas tomadas de `PLaS_intro.pdf`:

1. `cover` con la fila de logos (logo PLaS provisional);
2. `agenda` con el color de cada sección;
3. `section`;
4. `code`, con una animación Magic Move y su versión impresa;
5. `interactive`, con un componente sencillo y su versión impresa.

**Criterios de éxito:**

- El PDF exportado coincide visualmente con la web en las 5 diapositivas.
- Cada animación tiene una versión impresa legible.
- Las fuentes se ven igual en otra máquina sin instalar nada.
- Un agente, solo con `AGENTS.md`, puede escribir una diapositiva nueva que pase el validador.

## 11. Decisiones pendientes

> **Actualización:** el documento [04-identidad-visual-plas.md](04-identidad-visual-plas.md) resuelve la decisión 1 (se hereda la identidad del sitio web) y resuelve en parte la 3. El documento [05-decisiones-color-logo-publicacion.md](05-decisiones-color-logo-publicacion.md) cierra la 2 (tono moderno y técnico, con calidez) y la 4 (solo GitHub Pages). Solo queda abierta la fuente monoespaciada.

| # | Pregunta | Afecta a |
|---|---|---|
| 1 | ¿Se sigue el manual de imagen de la UNAL o se diseña un logo y una paleta propios de PLaS? | Tokens de color, fila de logos, portada de marca |
| 2 | ¿Tono académico y sobrio, o moderno y técnico? | Tipografía, densidad, estilo de imágenes |
| 3 | ¿Qué tipografías libres se usan para títulos, cuerpo y código? | Tokens tipográficos |
| 4 | ¿Dónde se publican las versiones web? (plas.unal.edu.co, GitHub Pages…) | Despliegue |
