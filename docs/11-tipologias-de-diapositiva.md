# Biblioteca de tipologías de diapositiva

**Fecha:** 2026-11-25
**Documentos previos:** [03-propuesta-tecnica.md](03-propuesta-tecnica.md) (§6, catálogo de maquetas), [09-guia-de-formato.md](09-guia-de-formato.md)

## 1. Problema

El tema tenía seis maquetas, y solo `default` servía para el contenido general. En las pruebas con agentes, y en el ejemplo del taller de escritura, casi todas las diapositivas eran `default` (16 de 16 en el taller): listas una tras otra, sin imágenes, sin variación. El agente no tenía otra cosa que elegir, y la guía no le decía cómo elegir.

## 2. Decisión: tipologías como maquetas

Cada forma de mostrar un contenido es una maqueta. Así el agente elige por nombre y el validador puede contar.

| Tipología | El contenido es… | Implementación |
|---|---|---|
| `default` | Explicación con pocas ideas | Existía; `::aside::` opcional |
| `two-cols` | Dos cosas en paralelo o en comparación | `::right::`; `### Encabezado` por columna |
| `image-text` | Imagen, diagrama o gráfico que explica, con texto | `image`, `credit`, `caption`, `side`, `fit`; o `::figure::` con un componente |
| `image` | Imagen, diagrama o gráfico protagonista | `image`, `credit`, `caption`, `fit`; o `::figure::` con un componente |
| `gallery` | 2 a 6 imágenes del mismo tipo | `images: [{ src, caption, credit }]`; galería justificada (§4) |
| `table` | Datos tabulados | Tabla Markdown y `::comment::` en un contenedor de color |
| `statement` | Una sola idea clave | Contenedor de color; primer párrafo grande |
| `quote` | Palabras de otro | `>` y `cite`; letra menor si la cita pasa de 180 caracteres |
| `team` | Personas | `people: [{ name, role, photo, credit }]`; iniciales sin foto |
| `code`, `interactive` | Código, herramientas | Existían |
| `closing` | Cierre (estructural) | Mensaje, contacto y logos; repite la malla de la portada; QR si hay `webUrl` |

Además, `<Callout>` es un contenedor de color para una idea dentro de cualquier diapositiva.

Todas las maquetas de contenido comparten un armazón (`components/ContentFrame.vue`): cabecera, título, subtítulo y cuerpo. Una maqueta nueva solo define su cuerpo.

Del catálogo del doc. 03 §6 quedan pendientes `cover-brand`, `diagram` y `math`. `project` lo cubre `<ProjectCard>` en `::aside::` o en `image-text`.

## 3. Reglas (nivel 2: las comprueba `plas-check`)

| Regla | Nivel |
|---|---|
| Máx. 2 diapositivas seguidas con la misma tipología (un separador corta la racha) | Aviso (§8) |
| Ninguna tipología en más de la mitad de las de contenido (con 6 o más) | Aviso (§8) |
| Al menos 3 tipologías distintas (con 6 o más de contenido) | Aviso |
| Sin imágenes (maquetas de imagen, `team` o diagramas propios de `components/`) | Aviso |
| Cada maqueta con lo suyo: imagen, columna derecha, tabla y comentario, cita y fuente, 2–6 imágenes, 2–8 personas | Error |
| Un solo `closing`, al final; aviso si falta en presentaciones de 8 o más diapositivas | Error / aviso |

Que la tipología sea **la más pertinente** para el contenido no se puede comprobar: lo pide la guía, con una tabla de «el contenido es… → tipología».

## 4. Imágenes

**Política.** La guía pide usar imágenes cuando el contenido lo permite, y ordena las fuentes: las del usuario, las propias (esquemas, diagramas, gráficos), las generadas con IA (si el agente puede) y las de internet con licencia libre.

| Regla | Nivel |
|---|---|
| La imagen está en `public/` y se cita como `/nombre` | Error |
| No se enlaza a una URL externa | Error |
| Lleva `credit`: `Propia`, `Generada con IA (herramienta)` o `Autor · Licencia · Fuente` | Error |
| La licencia es libre: CC0, dominio público, CC BY, CC BY-SA, Unsplash, Pexels o Pixabay; NC y ND se rechazan | Error |
| Ancho mínimo: 1600 px (`image`), 1200 (`image-text`), 800 (galería), 300 (foto de `team`) | Aviso |
| En una galería, proporciones que difieren más de 3 veces | Aviso |

`<PlasImage>` muestra el crédito en pequeño bajo la imagen (salvo `Propia`), como exigen las licencias CC BY.

**Galería justificada.** Con celdas iguales, las imágenes de distinta proporción quedaban recortadas (`cover`) o con franjas vacías de distinto tamaño (`contain`). Ahora todas las imágenes de una fila tienen la misma altura y cada una toma el ancho de su proporción. La maqueta prueba todos los repartos en filas (en orden, hasta 4 por fila) y elige el que deja las imágenes más grandes dentro del espacio disponible. Si no cabe, reduce todo por igual y centra las filas. Ninguna imagen se recorta.

## 5. Ajustes tras la tercera prueba con un agente (2026-11-25)

Un agente sin contexto hizo una presentación de 16 diapositivas con 8 tipologías bien elegidas, 0 errores y dos esquemas propios. Lo que faltaba:

| Hallazgo | Ajuste |
|---|---|
| Un esquema del método como PNG se leía pequeño, aunque pasaba el validador | Los diagramas y gráficos con texto se hacen como componentes en `components/`. `image` e `image-text` aceptan `::figure::` en lugar de la imagen. La guía pide letra de 14 px o más en componentes y de 24 px o más en imágenes con texto. El validador no puede medir texto dentro de un PNG, así que esto queda en la guía |
| Los resultados numéricos quedaron en una tabla escueta | La guía pide un gráfico propio para cifras y tendencias; la tabla, para valores exactos |
| No buscó fotos del contexto real | La guía pide al menos una foto del contexto cuando el tema ocurre en un lugar o con objetos reales |
| Puso el equipo entre la portada y la agenda, sin sección | Se permite una sola diapositiva de presentación antes de la primera sección; el validador avisa si hay más (`fuera-de-seccion`) |
| La guía no decía cómo hacer imágenes | Las fuentes de imágenes dependen de las capacidades del entorno del agente (código, generación de imágenes, navegación). El agente usa las que tiene, no simula las que no tiene y lo informa |

`showcase/` muestra un gráfico propio en `::figure::` (`components/BarrasTipologias.vue`).

## 6. Ajustes tras la cuarta prueba (2026-11-25)

El agente buscó una foto con licencia libre en Wikimedia Commons, hizo tres componentes propios (diagrama, línea de prototipos y gráfico) sin colores escritos a mano, y rotuló como ilustrativo un gráfico sin datos.

| Hallazgo | Ajuste |
|---|---|
| No se podía comprobar la regla de 14 px en componentes | `plas-check --render` mide el tamaño final de cada texto (incluido SVG escalado): error por debajo de 10 px, aviso por debajo de 12 (`texto-pequeno`). Excluye las etiquetas pequeñas del tema. En esta prueba, el texto más pequeño medía 12,6 px: correcto |
| El subtítulo de la portada y el cierre pasaba sobre la diagonal del panel | Ancho máximo: 530 px para el título; 470 px para el subtítulo, los párrafos y la firma. `plas-check --render` comprueba cada línea contra la diagonal (`sobre-diagonal`) |
| Gráficos sin datos reales | Se permite un esquema ilustrativo rotulado como tal, con los resultados marcados como preliminares y los datos pedidos en el informe |
| `line: plas` en modo línea | Aclarado: en modo línea ningún separador lleva `line` |
| Otros canales de contacto | Van como párrafo en el cuerpo de `closing` |

## 7. Lenguaje y narrativa (2026-11-25)

En la cuarta prueba los textos cumplían las reglas, pero varios títulos eran fragmentos con tono de eslogan: «Del humedal a la universidad, sin cables», «Tres prototipos, cada uno mejor». Una frase corta sin conector deja la relación entre las ideas a cargo del público y suena pretenciosa.

`template/AGENTS.md` tiene ahora la sección «Lenguaje y narrativa». Pide:

- armar primero la historia como lista de títulos;
- escribir frases completas, unidas con conectores;
- evitar fórmulas de eslogan;
- usar subtítulos que agreguen información;
- escribir viñetas paralelas, o una frase cuando hay causa o secuencia;
- adaptar el vocabulario al público;
- hacer una relectura final en voz alta.

Trae una tabla «Evite / Prefiera» y una sección de ejemplo contada con títulos.

No hay regla en el validador: juzgar si una frase es clara depende del criterio del agente. Los ejemplos de la propia guía se corrigieron porque tenían el mismo defecto, y un agente imita los ejemplos más que las reglas.

## 8. Menos reglas (2026-11-25)

Después de cinco pruebas, `template/AGENTS.md` había pasado de 220 a 485 líneas. Un exceso de reglas diluye las importantes y lleva al agente a cumplir en lugar de pensar, y el ajuste fino es del usuario. Se decidió:

- **Corregir en el tema, no en la guía.** Las ligaduras de JetBrains Mono convertían `>=` en `≥`, lo que confunde en una clase de análisis léxico. El tema las desactiva en todo (`base.css`, con `!important`, porque el atajo `font:` de un componente las reactiva). No se agregó ninguna regla.
- **La guía, solo para lo que el validador no enseña:** narrativa, elección de tipología, imágenes, qué dibujar y paridad. Los límites comprobados por `plas-check` se nombran sin detalle, porque el mensaje del validador dice qué corregir. La guía pasó a unas 190 líneas.
- **Error solo para lo que rompe el formato.** Pasan a aviso: `tipologia-repetida`, `tipologia-dominante` y `tabla-sin-comentario`. El agente puede dejar un aviso si tiene una razón, y debe decirlo en su informe.
- No se agregaron las reglas propuestas tras la quinta prueba (líneas de código, número de diapositivas, pie de `<Interactive>`): el agente las resolvió con su criterio.

## 9. Corrección encontrada en el camino

En `poc/`, `showcase/` y `ejemplos/*`, `npm run check` validaba el `dist/` existente sin compilar. Con una presentación modificada, las reglas de renderizado revisaban una versión vieja. Ahora esos `check` compilan primero (como la plantilla), y `plas-check --render` rechaza un `dist/` anterior a `slides.md`, `components/` o `public/` (`build-viejo`).
