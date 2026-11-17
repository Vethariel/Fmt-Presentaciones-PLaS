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
---

# Sistemas embebidos confiables

---
layout: section
line: transporte
question: ¿Qué revelan los datos sobre dónde y por qué ocurren los accidentes en la ciudad?
---

# Sistemas inteligentes de transporte

---
layout: section
line: sensado
question: ¿Qué puede ver un radar o una cámara hiperespectral que el ojo humano no alcanza?
---

# Sensado inteligente
