---
theme: plas
title: PLaS — Programming Languages and Systems
layout: cover
speaker: Grupo de investigación PLaS
email: plas_fibog@unal.edu.co
place: Universidad Nacional de Colombia · Sede Bogotá
date: Noviembre 2026
themeConfig:
  event: Grupo PLaS · Presentación institucional
  webUrl: https://unplas.github.io/plas-slides
mesh:
  - label: "Lambda: los lenguajes de programación"
    nodes: [[0, 6], [20, 0], [34, 14], [58, 60], [80, 100], [100, 92], [4, 100]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6]]
  - label: "Chip con sus pines: los sistemas"
    nodes: [[25, 25], [75, 25], [75, 75], [25, 75], [40, 25], [40, 5], [60, 25], [60, 5], [40, 75], [40, 95], [60, 75], [60, 95], [25, 50], [5, 50], [75, 50], [95, 50]]
    edges: [[0, 4], [4, 6], [6, 1], [1, 14], [14, 2], [2, 10], [10, 8], [8, 3], [3, 12], [12, 0], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15]]
---

# Programming Languages and Systems

## Lenguajes de programación y sistemas

Investigamos construyendo, y construimos en equipo.

---
layout: agenda
---

# Agenda

---
layout: section
line: lenguajes
question: ¿Y si cada problema tuviera su propio lenguaje de programación?
mesh:
  - label: "Árbol sintáctico de x = a + b * c: un lenguaje se analiza"
    nodes: [[50, 0, 1], [20, 30], [75, 30, 1], [55, 62], [95, 62, 1], [78, 95], [112, 95]]
    edges: [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [4, 6]]
  - label: "Terminal con su indicador: un lenguaje se ejecuta"
    nodes: [[0, 0], [100, 0], [100, 70], [0, 70], [0, 14], [100, 14], [12, 30], [26, 40], [12, 50], [32, 52], [48, 52]]
    edges: [[0, 1], [1, 5], [5, 2], [2, 3], [3, 4], [4, 0], [4, 5], [6, 7], [7, 8], [9, 10]]
---

# Lenguajes de programación

---
layout: code
---

# Análisis y manipulación de código fuente

## Code readability assistant: transformaciones que preservan el comportamiento

<WebOnly>

````md magic-move {lines: false}
```python
def f(l):
    r = 0
    for i in range(len(l)):
        if l[i] % 2 == 0:
            r = r + l[i]
    return r
```
```python
def suma_pares(xs):
    total = 0
    for i in range(len(xs)):
        if xs[i] % 2 == 0:
            total = total + xs[i]
    return total
```
```python
def suma_pares(xs):
    return sum(x for x in xs if x % 2 == 0)
```
````

</WebOnly>

<PrintOnly>

<Frames :labels="['Original', 'Nombres legibles', 'Forma idiomática']">

```python
def f(l):
    r = 0
    for i in range(len(l)):
        if l[i] % 2 == 0:
            r = r + l[i]
    return r
```

```python
def suma_pares(xs):
    total = 0
    for i in range(len(xs)):
        if xs[i] % 2 == 0:
            total = total + xs[i]
    return total
```

```python
def suma_pares(xs):
    return sum(x for x in xs
               if x % 2 == 0)
```

</Frames>

</PrintOnly>

---
layout: interactive
---

# Del texto a los tokens

## El primer paso de todo compilador: el análisis léxico

<Interactive caption="Escriba su propio código en la versión web">
  <LexerDemo />
  <template #print>
    <LexerDemo readonly />
  </template>
</Interactive>

---
layout: section
line: educacion
question: ¿Puede una inteligencia artificial enseñarte a programar sin pensar por ti?
mesh:
  - label: "Pizarra con renglones de código: enseñar a programar"
    nodes: [[0, 0], [100, 0], [100, 65], [0, 65], [20, 65], [10, 100], [80, 65], [90, 100], [12, 18], [55, 18], [20, 34], [70, 34], [20, 50], [45, 50]]
    edges: [[0, 1], [1, 2], [2, 6], [6, 4], [4, 3], [3, 0], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13]]
  - label: "Cabeza de robot: la inteligencia artificial que acompaña"
    nodes: [[10, 20], [90, 20], [90, 90], [10, 90], [50, 20], [50, 0, 1], [30, 70], [70, 70], [26, 45], [42, 45], [58, 45], [74, 45]]
    edges: [[0, 4], [4, 1], [1, 2], [2, 3], [3, 0], [4, 5], [6, 7], [8, 9], [10, 11]]
---

# Educación en ingeniería

---
layout: default
---

# Realimentación automática

## Evaluación continua de habilidades de programación

Un juez en línea califica el código, pero **no explica el error**.

- Retroalimentación **formativa** en cada envío
- Herramientas para el estudiante y el docente
- Estadísticas para seguir el avance del curso

::aside::

<ProjectCard title="UNCode" level="Maestría y doctorado" funding="Universidad Nacional de Colombia">

Aprendizaje y calificación automática de ejercicios en Python, Java, C y C++.

</ProjectCard>

---
layout: section
line: embebidos
question: ¿Cómo sigue funcionando un sistema cuando una de sus piezas falla?
mesh:
  - label: "Dos caminos redundantes, uno tachado: si una pieza falla, la otra sigue"
    nodes: [[0, 50, 1], [50, 10, 0.7], [50, 90, 0.7], [100, 50, 1], [40, 0], [60, 20], [60, 0], [40, 20]]
    edges: [[0, 1], [1, 3], [0, 2], [2, 3], [4, 5], [6, 7]]
  - label: "Escudo con visto bueno: un sistema confiable"
    nodes: [[50, 0], [100, 12], [95, 60], [50, 100], [5, 60], [0, 12], [28, 50], [45, 68], [75, 35]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 7], [7, 8]]
---

# Sistemas embebidos confiables

---
layout: section
line: transporte
question: ¿Qué revelan los datos sobre dónde y por qué ocurren los accidentes en la ciudad?
mesh:
  - label: "Cruce de calles con un choque en el centro: dónde ocurren los accidentes"
    nodes: [[0, 35], [35, 35], [65, 35], [100, 35], [0, 65], [35, 65], [65, 65], [100, 65], [35, 0], [65, 0], [35, 100], [65, 100], [44, 44], [56, 56], [56, 44], [44, 56]]
    edges: [[0, 1], [2, 3], [4, 5], [6, 7], [1, 8], [2, 9], [5, 10], [6, 11], [12, 13], [14, 15]]
  - label: "Pin de mapa: la ubicación de cada accidente"
    nodes: [[50, 100, 1], [25, 45], [22, 22], [35, 4], [65, 4], [78, 22], [75, 45], [42, 16], [58, 16], [58, 32], [42, 32]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [7, 8], [8, 9], [9, 10], [10, 7]]
  - label: "Gráfica de barras: lo que revelan los datos"
    nodes: [[0, 0], [0, 100], [100, 100], [20, 100], [20, 60], [45, 100], [45, 30], [70, 100], [70, 70]]
    edges: [[0, 1], [1, 3], [3, 5], [5, 7], [7, 2], [3, 4], [5, 6], [7, 8]]
---

# Sistemas inteligentes de transporte

---
layout: section
line: sensado
question: ¿Qué puede ver un radar o una cámara hiperespectral que el ojo humano no alcanza?
mesh:
  - label: "Pantalla de radar con su barrido: ver lo que el ojo no alcanza"
    nodes: [[50, 100, 1], [0, 100], [14.6, 64.6], [50, 50], [85.4, 64.6], [100, 100], [25, 100], [32.3, 82.3], [50, 75], [67.7, 82.3], [75, 100], [75, 56.7]]
    edges: [[1, 2], [2, 3], [3, 4], [4, 5], [6, 7], [7, 8], [8, 9], [9, 10], [1, 6], [6, 0], [0, 10], [10, 5], [0, 11]]
  - label: "Prisma que separa la luz: el espectro de una cámara hiperespectral"
    nodes: [[50, 0], [100, 85], [0, 85], [-40, 55], [25, 42], [73, 40], [140, 25], [140, 50], [140, 75]]
    edges: [[0, 4], [4, 2], [2, 1], [1, 5], [5, 0], [3, 4], [4, 5], [5, 6], [5, 7], [5, 8]]
---

# Sensado inteligente
