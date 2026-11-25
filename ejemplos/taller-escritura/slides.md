---
theme: plas
title: Taller de escritura
layout: cover
speaker: Felipe Restrepo Calle
email: ferestrepoca@unal.edu.co
place: Departamento de Ingeniería de Sistemas e Industrial · Sede Bogotá
themeConfig:
  event: Seminario PLaS · Taller de escritura
  webUrl: https://unplas.github.io/taller-escritura
  line: educacion
mesh:
  - label: "Hoja de un artículo: esquina doblada y renglones de texto"
    nodes: [[0, 0], [55, 0], [75, 20], [75, 100], [0, 100], [55, 20], [12, 40], [62, 40], [12, 58], [62, 58], [12, 76], [45, 76]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 5], [5, 2], [6, 7], [8, 9], [10, 11]]
  - label: "Birrete: la tesis como meta del taller"
    nodes: [[50, 0], [100, 22], [50, 44], [0, 22], [22, 32], [22, 62], [78, 32], [78, 62], [50, 72], [100, 50], [100, 62, 1]]
    edges: [[0, 1], [0, 3], [3, 4], [4, 2], [2, 6], [6, 1], [4, 5], [6, 7], [5, 8], [8, 7], [1, 9], [9, 10]]
---

# Taller de escritura

## Tesis, trabajo final y artículos

Sesión 3: estructura y motivación.

---
layout: agenda
---

# Agenda

---
layout: section
question: ¿Para qué nos reunimos cada semana a escribir?
mesh:
  - label: "Calendario: la cita semanal, con el día marcado"
    nodes: [[0, 10], [100, 10], [100, 90], [0, 90], [0, 30], [100, 30], [28, 0], [28, 18], [72, 0], [72, 18], [38, 56], [50, 70], [72, 44]]
    edges: [[0, 1], [1, 5], [5, 2], [2, 3], [3, 4], [4, 0], [4, 5], [6, 7], [8, 9], [10, 11], [11, 12]]
  - label: "Dos globos de diálogo: leer y comentar el texto del otro"
    nodes: [[0, 0], [60, 0], [60, 36], [24, 36], [8, 54], [12, 36], [0, 36], [40, 48], [100, 48], [100, 84], [88, 84], [94, 102], [76, 84], [40, 84]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 7]]
---

# El taller

---
layout: default
---

# Etapas de la investigación científica

## Cada etapa produce un documento distinto

<Etapas />

---
layout: default
---

# Objetivo del taller

1. Apoyar a los integrantes del grupo en la **divulgación de los resultados** de sus proyectos
2. Acompañar la construcción de productos académicos:
   - Tesis de maestría y doctorado
   - Trabajo final de maestría
   - Artículo para conferencia o revista científica
3. De forma indirecta, asesorar la formulación de proyectos a quienes están en la etapa de **planificación**

---
layout: default
---

# Metodología

## Un ciclo que se repite en cada sesión

<Ciclo />

---
layout: default
---

# Recomendaciones

1. Dedicar **un par de horas a la semana** a los compromisos del taller
2. Usar herramientas de apoyo
   - Referencias: Mendeley
   - Edición: Overleaf (LaTeX)
   - Coordinación: Slack, Trello, Google Docs, LucidChart
3. Revisar la forma del trabajo individual: ortografía, gramática, erratas
4. No descuidar otros compromisos: revisión de literatura, plan de trabajo, reuniones, asignaturas

---
layout: default
---

# Resultados esperados

## Al final del semestre

1. Documento de tesis o trabajo final con **avances significativos**
2. Artículo preparado para someter a evaluación
3. Seminario I: proyecto terminado hasta objetivos, con borrador de metodología
4. Seminario II: proyecto terminado

---
layout: section
question: ¿Qué partes tiene una tesis, un artículo y una propuesta?
mesh:
  - label: "Reloj de arena IMRyD: de lo general a lo particular y de vuelta"
    nodes: [[0, 0], [100, 0], [62, 42], [62, 58], [100, 100], [0, 100], [38, 58], [38, 42]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 7], [3, 6]]
  - label: "Tabla de contenido: capítulos y sus secciones"
    nodes: [[0, 0], [70, 0], [0, 66], [70, 66], [18, 22], [80, 22], [18, 44], [60, 44], [18, 88], [90, 88], [0, 22], [0, 44], [0, 88]]
    edges: [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [0, 10], [10, 11], [11, 2], [2, 12], [10, 4], [11, 6], [12, 8]]
---

# Estructura

---
layout: default
---

# Tesis o trabajo final

## La introducción incluye estas partes como secciones

Resumen · Abstract

1. Introducción
   - Motivación
   - Trabajos relacionados *(resumen)*
   - Problema y pregunta de investigación
   - Objetivos *(general y específicos)*
   - Alcance y estructura de la tesis
2. Marco conceptual y trabajos relacionados

---
layout: default
---

# Tesis o trabajo final: capítulos

## Un capítulo por objetivo específico, cada uno con nombre propio

3. Capítulo del objetivo específico 1
4. Capítulo del objetivo específico 2
5. Capítulo del objetivo específico 3
6. Capítulo del objetivo específico 4
7. Conclusiones y trabajos futuros

Referencias

---
layout: default
---

# Tesis o trabajo final: ejemplo

## Los capítulos 3 a 6 nombran lo que se hizo para cada objetivo

Introducción, marco conceptual y conclusiones siguen la estructura general.

3. Ambientes de aprendizaje **gamificado** para apoyar el aprendizaje de la programación
4. Integración de un ambiente gamificado con un curso de programación
5. Diseño experimental
6. Análisis de resultados y discusión

---
layout: default
---

# Artículo

## La introducción incluye estas partes como párrafos

Title · Abstract

1. Introduction
   - Motivación
   - Trabajos relacionados *(resumen)*
   - Problema y pregunta de investigación
   - Objetivos y estructura del artículo
2. Related works

::aside::

3. Proposal *(con su nombre propio)*
4. Data collection / Experimental setup
5. Results and discussion
6. Conclusions and future works

References

---
layout: default
---

# Proyecto de tesis o propuesta de trabajo final

Título

1. Introducción: motivación, justificación y antecedentes
2. Planteamiento del problema y preguntas de investigación
3. Objetivos: general y específicos
4. Metodología
5. Cronograma
6. Presupuesto

Referencias

---
layout: section
question: ¿Por qué es importante investigar en este tema?
mesh:
  - label: "Signo de interrogación: la pregunta que motiva la investigación"
    nodes: [[10, 25], [20, 6], [45, 0], [70, 6], [80, 25], [70, 42], [50, 52], [50, 74], [46, 92, 1], [54, 92, 1]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [8, 9]]
  - label: "Diana con flecha: el objetivo que justifica el trabajo"
    nodes: [[96, 31], [69, 4], [31, 4], [4, 31], [4, 69], [31, 96], [69, 96], [96, 69], [72, 50], [50, 28], [28, 50], [50, 72], [50, 50, 1], [112, -12], [112, -28], [128, -12]]
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [8, 9], [9, 10], [10, 11], [11, 8], [12, 13], [13, 14], [13, 15]]
---

# Motivación

---
layout: default
clicks: 3
---

# El embudo de la introducción

## Cada parte acota la anterior, de lo general a lo que se va a hacer

<WebOnly>

<Embudo :paso="$clicks" />

</WebOnly>

<PrintOnly>

<Frames :labels="['Motivación', 'Trabajos relacionados', 'Problema', 'Objetivos']">
  <Embudo :paso="0" compacto />
  <Embudo :paso="1" compacto />
  <Embudo :paso="2" compacto />
  <Embudo :paso="3" compacto />
</Frames>

</PrintOnly>

---
layout: default
---

# Qué debe lograr la motivación

## La boca del embudo: el contexto amplio

1. Exponer la **pertinencia** del problema
2. Responder: ¿por qué es importante investigar en este tema?
3. Explicar los beneficios para la **sociedad** y para la comunidad científica
4. Apoyarse en referencias: trabajos seminales, noticias, normativas, estadísticas

::aside::

<Embudo :paso="0" compacto />

---
layout: default
---

# Ejemplo de motivación (1/2)

## Por qué es difícil aprender a programar

> One of the most demanded skills nowadays for engineering students is computer programming. They should be able to [1]: analyze and understand how programs work; master a programming language; develop computer programs (design, implement, test and debug); among others. However, learning these skills is not an easy task. Students require not only to solve problems using the concepts learned in class [2], but also they require to study and practice out of class [3].

Restrepo-Calle, Ramírez-Echeverry y González. *UNCode*. EDULEARN 2018. doi: 10.21125/edulearn.2018.1632

---
layout: default
---

# Ejemplo de motivación (2/2)

## Por qué la evaluación manual no basta

> Moreover, it has been demonstrated that the continuous feedback by the teachers makes the student's extra-class practical work more effective [4]. Nevertheless, evaluating programming assignments manually in an objective manner and at an appropriate time is particularly difficult [5-6]. […] The grade assigned to an exercise is affected to a large extent by factors such as tiredness, favoritism, or inconsistencies of the person who evaluates [7].

Restrepo-Calle, Ramírez-Echeverry y González. *UNCode*. EDULEARN 2018. doi: 10.21125/edulearn.2018.1632

---
layout: default
---

# Preguntas que guían la motivación

## Respóndalas por separado y luego articúlelas en un texto

- ¿Cuáles son las causas del problema?
- ¿Cuáles son sus efectos?
- ¿A quién afecta y dónde ocurre?
- ¿Cómo se manifiesta y qué factores intervienen?

::aside::

### Su importancia

- ¿Por qué es importante solucionarlo?
- ¿Qué sucedería si no se atiende?

### Todavía no

Aún no plantee el objetivo: concéntrese en **motivar** la investigación.

---
layout: default
---

# Comencemos

## Tareas para la próxima sesión

1. Crear el proyecto en **Overleaf** (las propuestas pueden ir en Google Docs)
2. Seleccionar la plantilla
   - Tesis UNAL
   - IEEE o ACM para artículos
3. Definir la estructura
4. Compartir el documento con los asesores
5. Escribir la **motivación**
