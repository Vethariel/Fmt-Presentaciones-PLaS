---
theme: plas
title: Taller de escritura
layout: cover
mesh: [libro, lapiz]
speaker: Felipe Restrepo Calle
email: ferestrepoca@unal.edu.co
place: Departamento de Ingeniería de Sistemas e Industrial · Sede Bogotá
themeConfig:
  event: Seminario PLaS · Taller de escritura
  webUrl: https://unplas.github.io/taller-escritura
  line: educacion
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
mesh: lapiz
question: ¿Para qué nos reunimos cada semana a escribir?
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
mesh: [arbol, libro]
question: ¿Qué partes tiene una tesis, un artículo y una propuesta?
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
mesh: [embudo, bombilla]
question: ¿Por qué es importante investigar en este tema?
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
