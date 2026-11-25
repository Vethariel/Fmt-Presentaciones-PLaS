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
| `image-text` | Imagen que explica, con texto | `image`, `credit`, `caption`, `side`, `fit` |
| `image` | Imagen protagonista | `image`, `credit`, `caption`, `fit` |
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
| Máx. 2 diapositivas seguidas con la misma tipología (un separador corta la racha) | Error |
| Ninguna tipología en más de la mitad de las de contenido (con 6 o más) | Error |
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

## 5. Corrección encontrada en el camino

En `poc/`, `showcase/` y `ejemplos/*`, `npm run check` validaba el `dist/` existente sin compilar. Con una presentación modificada, las reglas de renderizado revisaban una versión vieja. Ahora esos `check` compilan primero (como la plantilla), y `plas-check --render` rechaza un `dist/` anterior a `slides.md`, `components/` o `public/` (`build-viejo`).
