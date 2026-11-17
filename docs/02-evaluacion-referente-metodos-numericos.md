# Evaluación de referente externo — Curso de Métodos Numéricos

**Fecha:** 2026-11-17
**Objetivo:** Evaluar objetivamente dos presentaciones de otro ámbito, propuestas como referente de elegancia, y extraer lo aplicable al nuevo formato PLaS.
**Documento previo:** [01-evaluacion-inicial.md](01-evaluacion-inicial.md)

## 1. Material analizado

| Archivo | Diapositivas | Herramienta | Tipografías |
|---|---|---|---|
| `1. Introduction.pdf` | 100 | PowerPoint para Microsoft 365 | Calibri, Cambria Math, Tw Cen MT |
| `7. Ordinary Differential Equations.pdf` | 36 | Google Slides | Times New Roman, Arial, Calibri |

- **Formato:** 16:9 (960 × 540 pt).
- **Contexto:** curso de pregrado de la Facultad de Ingeniería de la UNAL (contenido en inglés).
- **Marcas presentes:** UNAL, Facultad de Ingeniería y el logo del grupo **Genki**.

Las dos presentaciones comparten plantilla. El segundo archivo es, en la práctica, la misma plantilla exportada desde otra herramienta, lo que permite ver qué tan bien resiste ese cambio (sección 4.1).

## 2. El sistema de diseño

A diferencia del formato PLaS actual, este formato **no es solo una plantilla, sino un sistema**: varias piezas comparten una misma lógica de color y navegación.

### 2.1 Piezas

| Pieza | Descripción |
|---|---|
| **Portada de marca** | Fondo crema (`#F0E4CA`), escudo y logotipo de la UNAL en azul marino al centro, franjas verticales multicolor en los bordes laterales y una línea magenta en la base. |
| **Portada de título** | Fondo blanco, alineada a la izquierda: título en mayúsculas y negrita, autor y correo, lugar, y una fila de logos (UNAL │ Facultad de Ingeniería │ Genki) separados por líneas finas. La línea magenta de la base se repite. |
| **Índice** ("Content") | Lista numerada de secciones. Cada sección tiene un **bloque de color** pegado al borde izquierdo. |
| **Separador de sección** | Página casi vacía, con un bloque del color de la sección, el número y el nombre, y la fila de logos abajo. |
| **Contenido** | Miga de pan arriba a la izquierda (marca de color, número y nombre de la sección), botón "inicio" arriba a la derecha, título centrado en negrita, cuerpo libre, y pie con el nombre del curso y el número de página. |
| **Resumen** | Diapositivas de contenido normales, con la fila de logos al pie. |

### 2.2 Código de color por sección

La idea central del sistema es una **escala cromática ordenada** (rojo → naranja → amarillo → verde → verde azulado → azul) en la que **cada sección tiene un color**. Ese color se repite en:

1. el bloque de la sección en el índice,
2. el bloque del separador de sección,
3. la marca de la miga de pan en cada diapositiva,
4. el número de página,
5. el texto destacado del cuerpo, que aparece en naranja en la sección 2 y en verde en las secciones 5 y 6. Parece intencional, aunque no se aplica en todas las diapositivas.

| Sección | Color aproximado |
|---|---|
| 1 | Rojo coral (`#FA6769`) |
| 2 | Naranja |
| 3 | Naranja claro |
| 4 | Amarillo |
| 5 | Verde oliva |
| 6 | Verde azulado (`#5AA6A7`) |
| 7 | Azul |

Las franjas multicolor de la portada anticipan esta misma escala, lo que da coherencia entre la portada y el contenido.

### 2.3 Navegación

- **Botón "inicio"** en cada diapositiva, que vuelve al índice (hipervínculo).
- **Miga de pan** que indica siempre en qué sección se está.
- **Índice con colores** que sirve como mapa de la presentación.

Es justo lo que intentaba hacer la barra "Grupo · Líneas · Proyectos" de `PLaS_intro`, pero bien resuelto: indica la sección actual y deja moverse por la presentación.

## 3. Fortalezas

1. **Poca decoración y mucho aire.** No hay cajas ni bordes en la cabecera ni en el pie. La decoración ocupa menos del 10 % del alto de la diapositiva, frente a cerca del 25 % en el formato PLaS actual.
2. **El color tiene significado.** Cada color identifica una sección; no es decoración arbitraria.
3. **Orientación permanente.** Con la miga de pan, el número de página en color y el botón "inicio", el público siempre sabe dónde está.
4. **La identidad del grupo convive con la institucional.** El logo de Genki aparece junto a los de la UNAL y la Facultad, con el mismo peso visual y separado por líneas. Es un modelo directo para la falta de identidad de PLaS.
5. **Portada en dos tiempos.** Primero una portada de marca, puramente visual, y después la de título, con la información. Se ve institucional sin saturar la información.
6. **Separadores de sección claros.** Marcan el ritmo de una presentación larga (100 diapositivas) sin desorientar al público.
7. **Buen tratamiento de las ecuaciones.** Usa Cambria Math, centra las ecuaciones y les da espacio. Es buena referencia para contenido técnico.
8. **Una paleta suave.** Los tonos pastel y desaturados (crema, coral, verde azulado) se ven más refinados que los colores puros de Office.

## 4. Debilidades

### 4.1 Fragilidad técnica

- **Al exportar desde Google Slides, la plantilla cambia de tipografía.** En `7. Ordinary Differential Equations.pdf` los títulos y la miga de pan pasan a Times New Roman, y el pie "NUMERICAL METHODS" se parte en dos líneas y se monta sobre el borde inferior. La identidad depende de la herramienta y de las fuentes instaladas.
- **Hay títulos en dos líneas que se superponen.** Ocurre en varias diapositivas: "Impact of Computers and Modern Numerical Methods" (24), "Example of Computer Representation of Numbers" (83–85), "Finite-Difference Formulas from Taylor Series" (93), "Euler's Method (Point-Slope / Euler-Cauchy)" y "Auxiliary (Boundary) Conditions in ODEs" (ODE 11 y 28). El interlineado está muy ajustado y no hay una regla de longitud máxima para los títulos.
- **Hay títulos que se salen de la diapositiva**, como "Role of the Slope Estimate φ" (ODE 10), cortado por arriba.
- **Hay elementos rotos,** como una imagen de relleno con texto ilegible (Introducción, 89).

### 4.2 Tipografía y texto

- **Texto justificado con huecos grandes** entre palabras (diapositivas 5, 17, 20, 24, 26). Es el mismo problema del formato PLaS.
- **El tamaño de los títulos varía** entre diapositivas del mismo tipo; en la serie "Solution Example 3 in MATLAB" (55–65) son más pequeños que en el resto.
- **Hay demasiado resaltado:** frases completas en negrita y color (diapositiva 24), lo que le quita fuerza al énfasis.

### 4.3 Código

- **El código no tiene estilo propio** (diapositivas 55–65). Se escribe en fuente proporcional, centrado, con colores sueltos por palabra y sin fondo ni bloque. **No sirve como referente** para un grupo de lenguajes de programación, que necesita bloques de código monoespaciados con resaltado de sintaxis consistente.

### 4.4 Imágenes y tono

- **Mezcla de fuentes visuales:** figuras de libro de texto con fondo azul claro, capturas, fotos de stock, clipart y memes ("Trust me, I'm an engineer", Big Bang Theory, Mr. Increíble).
- El tono informal puede funcionar en clase, pero **no es adecuado para presentaciones institucionales o de investigación**.
- El botón "inicio" es un icono en imagen con relleno y borde, de estilo algo anticuado frente al resto del diseño.

### 4.5 Escalabilidad

- La escala de color alcanza para unas 7 secciones. Con más secciones, los colores empiezan a parecerse y pierden su función.
- La portada de marca ocupa una diapositiva entera solo para el logo. Sirve en un curso, pero puede sobrar en charlas cortas.

## 5. Valoración objetiva

| Criterio | Formato PLaS actual | Referente | Comentario |
|---|---|---|---|
| Identidad del grupo | Baja | Alta | Genki tiene logo propio y presencia en la portada |
| Coherencia del sistema | Media | Alta | El color por sección une el índice, los separadores y el contenido |
| Uso del espacio | Bajo | Alto | Sin cajas ni bordes |
| Navegación | Simulada | Real | Miga de pan, índice y botón "inicio" |
| Tipografía | Media | Media | El referente pierde puntos por la exportación a Google Slides y los títulos superpuestos |
| Contenido técnico (ecuaciones) | — | Alta | Buen uso de Cambria Math |
| Contenido técnico (código) | Ausente | Baja | Ninguno resuelve el código |
| Robustez entre herramientas | Media | Baja | El referente se desarma al cambiar de herramienta |
| Tono | Formal | Informal | Por los memes, no por la plantilla |

**Conclusión:** la percepción de elegancia está justificada y viene sobre todo del **sistema** (color con significado, poca decoración, navegación y portada en dos tiempos), no de cada diapositiva por separado. La ejecución tiene fallos (títulos, exportación, código, imágenes), pero son corregibles y no afectan los principios.

## 6. Qué adoptar, adaptar y evitar en el formato PLaS

### Adoptar

- **Color por sección** aplicado en el índice, los separadores, la miga de pan, el número de página y el énfasis.
- **Cabecera y pie sin cajas.** Basta con una miga de pan arriba y una línea mínima de pie.
- **Fila de logos** UNAL │ Facultad (o Departamento) │ **PLaS**, lo que implica **crear un logo PLaS**.
- **Portada de título alineada a la izquierda**, con jerarquía clara entre título, autor, contacto, lugar y logos.
- **Separadores de sección** con número y color.
- **Tratamiento cuidadoso de las ecuaciones.**

### Adaptar

- **La paleta:** reducirla a unas 5 o 6 secciones y definirla con valores exactos, posiblemente a partir de la paleta institucional de la UNAL y del futuro color de PLaS.
- **El botón "inicio":** cambiarlo por un icono de línea simple o integrarlo en la miga de pan.
- **La portada de marca:** dejarla como opcional, para cursos y presentaciones largas, y omitirla en charlas cortas.

### Evitar

- Las plantillas que dependan de fuentes no disponibles en todas las herramientas. Hay que elegir tipografías libres (por ejemplo, de Google Fonts) o incrustarlas.
- El texto justificado en diapositivas.
- Los títulos de más de una línea sin una maqueta prevista para ello.
- El código en fuente proporcional. PLaS necesita una **maqueta de bloque de código** propia, que sea su seña distintiva frente a este referente.
- Los memes y las imágenes de origen mezclado. Conviene una guía de imágenes y diagramas.

## 7. Impacto en las decisiones pendientes

Este análisis aporta elementos a las decisiones pendientes del documento 01:

1. **Herramienta:** la fragilidad del referente al pasar a Google Slides refuerza la necesidad de **elegir una herramienta principal** y garantizar las fuentes. Si se apoyan varias herramientas, cada versión debe probarse por separado.
2. **Marca:** el caso Genki muestra que **un grupo puede tener identidad propia dentro del marco UNAL** sin entrar en conflicto con la marca institucional.
3. **Tono:** el sistema del referente sirve para un tono académico y sobrio si se elimina el contenido informal.
