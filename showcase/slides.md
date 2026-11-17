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
layout: default
---

# Contenido con columna lateral

## El slot `::aside::` agrega una columna de 300 px

El texto principal ocupa la columna izquierda. La columna derecha sirve para datos de apoyo: un proyecto, una cifra o una imagen.

- Fichas de proyecto
- Datos clave
- Imágenes pequeñas

::aside::

<ProjectCard title="UNCode" level="Maestría y doctorado" people="Grupo PLaS" funding="Universidad Nacional de Colombia">

Aprendizaje y calificación automática de ejercicios de programación.

</ProjectCard>

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
---

# Elementos de contenido

---
layout: default
---

# Énfasis y listas

## Negrita para resaltar, listas para ordenar

El énfasis con **negrita** toma el tono oscuro de la línea. Use **dos o tres** por diapositiva.

1. Listas numeradas para pasos o secuencias
2. Viñetas para ideas sin orden
   - Un segundo nivel, como máximo
   - Más pequeño y con marca neutra

---
layout: default
---

# Citas y código en línea

## Source Serif para las citas, JetBrains Mono para el código

> La mejor forma de predecir el futuro es inventarlo.
>
> — Alan Kay

El código dentro del texto, como `suma_pares(xs)` o `git commit`, lleva fondo suave y tono oscuro.

---
layout: default
---

# Tablas

## Encabezado con línea de color y filas separadas

| Maqueta | Uso | Versión impresa |
|---|---|---|
| `cover` | Portada | Igual a la web |
| `section` | Separador de capítulo | Malla de grafos estática |
| `code` | Código protagonista | Fotogramas clave |
| `interactive` | Herramienta | Instantánea con QR |

---
layout: default
---

# Ecuaciones

## KaTeX, en línea y en bloque

La velocidad terminal del paracaidista es $v_t = \frac{gm}{c}$, y la actualización de Euler es:

$$
y_{i+1} = y_i + f(x_i, y_i)\,h
$$
