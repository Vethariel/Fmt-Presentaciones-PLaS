---
theme: plas
title: Guía de formato PLaS
layout: cover
speaker: Grupo de investigación PLaS
email: plas_fibog@unal.edu.co
place: Universidad Nacional de Colombia · Sede Bogotá
date: Noviembre 2026
themeConfig:
  event: Guía de formato de presentaciones
  webUrl: https://unplas.github.io/plas-slides
mesh:
  - label: "Pantalla de proyección con título y gráfica: una presentación"
    nodes: [[0, 0], [100, 0], [100, 60], [0, 60], [50, 60], [50, 95], [30, 100], [70, 100], [12, 15], [60, 15], [15, 48], [40, 32], [60, 40], [85, 20]]
    edges: [[0, 1], [1, 2], [2, 4], [4, 3], [3, 0], [4, 5], [5, 6], [5, 7], [8, 9], [10, 11], [11, 12], [12, 13]]
  - label: "Escuadra con marcas de medida: un formato con reglas"
    nodes: [[0, 0], [0, 100], [100, 100], [15, 40], [15, 85], [60, 85], [25, 100], [25, 92], [50, 100], [50, 92], [75, 100], [75, 92]]
    edges: [[0, 1], [1, 6], [6, 8], [8, 10], [10, 2], [2, 0], [3, 4], [4, 5], [5, 3], [6, 7], [8, 9], [10, 11]]
---

# Guía de formato de presentaciones

## Tipos de diapositiva y elementos de contenido

Una sola fuente para la web y el PDF.

---
layout: agenda
---

# Agenda

---
layout: section
line: lenguajes
question: ¿Qué tipos de diapositiva ofrece el formato?
mesh:
  - label: "Maqueta de diapositiva: cabecera, contenido y columna lateral"
    nodes: [[0, 0], [100, 0], [100, 56], [0, 56], [0, 14], [100, 14], [62, 14], [62, 56]]
    edges: [[0, 1], [0, 4], [4, 3], [3, 7], [7, 2], [2, 5], [5, 1], [4, 6], [6, 5], [6, 7]]
  - label: "Pila de diapositivas: varios tipos, uno detrás de otro"
    nodes: [[0, 30], [70, 30], [70, 80], [0, 80], [15, 15], [85, 15], [85, 65], [15, 30], [70, 65], [30, 0], [100, 0], [100, 50], [30, 15], [85, 50]]
    edges: [[0, 7], [7, 1], [1, 8], [8, 2], [2, 3], [3, 0], [7, 4], [4, 12], [12, 5], [5, 13], [13, 6], [6, 8], [12, 9], [9, 10], [10, 11], [11, 13]]
---

# Tipos de diapositiva

---
layout: default
---

# Contenido general

## Título, subtítulo, texto y viñetas

Una idea por diapositiva, con **un énfasis** que guía la lectura.

- Viñetas cortas, de una línea si es posible
- Como máximo seis por diapositiva
- El color de la viñeta lo da la línea de la sección

---
layout: two-cols
---

# Dos columnas

## `two-cols`: comparar o poner en paralelo

### En la web

- Animaciones y código que se transforma
- Herramientas interactivas
- Panel de capítulos

::right::

### En el PDF

- El estado final de cada animación
- Fotogramas clave del código
- Una instantánea con QR a la web

---
layout: image-text
image: /panel-capitulos.png
credit: Propia
caption: Panel de capítulos abierto en la diapositiva 5
side: left
fit: contain
---

# Imagen y texto

## `image-text`: la imagen explica, el texto guía

Una captura, una foto o un esquema a un lado, y al otro lo que el público debe ver en ella.

- `side: left` o `side: right`
- El crédito va en `credit`

---
layout: image
image: /web-y-pdf.png
credit: Propia
caption: La misma diapositiva en la web (izquierda) y en el PDF (derecha)
---

# Imagen protagonista

## `image`: cuando la imagen es el contenido

---
layout: gallery
images:
  - src: /portada.png
    caption: Portada (16:9)
    credit: Propia
  - src: /logo-svg-vs-png.png
    caption: Logo en SVG y en PNG (casi cuadrada)
    credit: Propia
  - src: /poc-web.png
    caption: Versión web completa (vertical)
    credit: Propia
  - src: /separador.png
    caption: Separador (16:9)
    credit: Propia
---

# Galería

## `gallery`: de 2 a 6 imágenes, sin recortes aunque tengan otra proporción

Cada fila tiene una sola altura; cada imagen toma el ancho que le da su proporción.

---
layout: code
---

# Código como protagonista

## Resaltado con el tema "PLaS Claro"

```python
def suma_pares(xs: list[int]) -> int:
    """Suma los números pares de la lista."""
    total = 0
    for x in xs:
        if x % 2 == 0:
            total += x
    return total
```

Cada categoría de sintaxis usa el tono oscuro de una línea de investigación.

---
layout: section
line: educacion
question: ¿Cómo se escribe el contenido dentro de una diapositiva?
mesh:
  - label: "Tabla de tres por tres: datos dentro de la diapositiva"
    nodes: [[0, 0], [100, 0], [100, 75], [0, 75], [0, 25], [100, 25], [0, 50], [100, 50], [40, 0], [40, 75], [70, 0], [70, 75]]
    edges: [[0, 8], [8, 10], [10, 1], [1, 5], [5, 7], [7, 2], [2, 11], [11, 9], [9, 3], [3, 6], [6, 4], [4, 0], [4, 5], [6, 7], [8, 9], [10, 11]]
  - label: "Sigma: las ecuaciones como elemento de contenido"
    nodes: [[100, 0], [0, 0], [50, 50], [0, 100], [100, 100], [100, 14], [100, 86]]
    edges: [[5, 0], [0, 1], [1, 2], [2, 3], [3, 4], [4, 6]]
---

# Elementos de contenido

---
layout: default
---

# Énfasis y listas

## Negrita para resaltar, listas para ordenar

El énfasis con **negrita** toma el tono oscuro de la línea. El código en línea, como `suma_pares(xs)`, lleva fondo suave.

1. Listas numeradas para pasos o secuencias
2. Viñetas para ideas sin orden
   - Un segundo nivel, como máximo
   - Más pequeño y con marca neutra

---
layout: table
---

# Tabla con comentario

## `table`: los datos y lo que hay que ver en ellos

| Maqueta | Uso | Versión impresa |
|---|---|---|
| `cover` | Portada | Igual a la web |
| `section` | Separador de capítulo | Malla estática |
| `code` | Código protagonista | Fotogramas clave |
| `interactive` | Herramienta | Instantánea con QR |

::comment::

Solo las animaciones y las herramientas cambian en el PDF: **todo lo demás es igual** en los dos formatos.

---
layout: quote
cite: Alan Kay, 1971
---

# Cita destacada

> La mejor forma de predecir el futuro es inventarlo.

---
layout: statement
---

# Idea clave

## `statement`: una sola idea, en un contenedor de color

La web es **el PDF que además se mueve**.

Nada puede existir solo en la web.

---
layout: default
---

# Contenedor de énfasis

## `<Callout>` dentro de cualquier diapositiva

El texto principal ocupa la columna izquierda. La columna derecha (`::aside::`) sirve para datos de apoyo.

<Callout title="Clave">

Una idea que el público debe llevarse, sin ocupar toda la diapositiva.

</Callout>

::aside::

<ProjectCard title="UNCode" level="Maestría y doctorado" people="Grupo PLaS" funding="Universidad Nacional de Colombia">

Aprendizaje y calificación automática de ejercicios de programación.

</ProjectCard>

---
layout: default
---

# Ecuaciones

## KaTeX, en línea y en bloque

La velocidad terminal del paracaidista es $v_t = \frac{gm}{c}$, y la actualización de Euler es:

$$
y_{i+1} = y_i + f(x_i, y_i)\,h
$$

---
layout: team
people:
  - name: Nombre Apellido
    role: Profesora · Lenguajes
  - name: Nombre Apellido
    role: Profesor · Embebidos
  - name: Nombre Apellido
    role: Doctorando · Educación
  - name: Nombre Apellido
    role: Maestría · Sensado
---

# Equipo

## `team`: personas, con foto o con iniciales

---
layout: closing
---

# Gracias

## Cierre: mensaje, contacto y logos

La malla repite la de la portada.
