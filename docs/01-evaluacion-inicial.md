# Evaluación inicial del formato de presentaciones — Grupo PLaS

**Fecha:** 2026-11-17
**Objetivo:** Diagnosticar el formato actual de las presentaciones del grupo PLaS como punto de partida para diseñar uno nuevo.

## 1. Material analizado

| Archivo | Diapositivas | Tipo de presentación |
|---|---|---|
| `PLaS_intro.pdf` | 15 (el pie llega a 16, así que hay una oculta o un salto en la numeración) | Presentación institucional del grupo |
| `03_TallerEscrituraTesis-Papers - Estructura-Motivación.pdf` | 19 | Material de taller o seminario |

Datos técnicos comunes:

- **Formato:** 16:9 (960 × 540 pt).
- **Origen:** Microsoft PowerPoint 2019.
- **Tipografías:** Calibri y Arial, más Wingdings para viñetas. En `PLaS_intro.pdf` el PDF solo declara ArialMT, señal de que parte del texto se convirtió o se incrustó como imagen.

## 2. La plantilla actual

Las dos presentaciones comparten la misma estructura:

- **Portada:** escudo de la Universidad Nacional de Colombia centrado, título en negrita, subtítulo, datos de contacto y el bloque institucional (Departamento / Facultad / Universidad / Sede), todo centrado.
- **Cabecera:** una caja con borde negro que lleva el logo UNAL a la izquierda y el título de la presentación centrado. En `PLaS_intro` se añade una pseudo-navegación: *Grupo · Líneas de investigación · Proyectos*.
- **Título de diapositiva:** dos niveles (título y subtítulo), en azul y verde.
- **Pie:** una segunda caja con borde negro, con el nombre del evento ("Grupo PLaS" o "Seminario grupo PLaS") a la izquierda y el número de página a la derecha.

### Colores en uso

Son los colores estándar de Office; no hay una paleta propia del grupo.

| Uso observado | Color |
|---|---|
| Títulos (azul) | `#0070C0` |
| Títulos y acentos (verde) | `#00B050` |
| Cajas y acentos | `#00B0F0` (cian), rojo, naranja y azul marino |
| Texto | `#000000` |

## 3. Fortalezas a conservar

1. **Identidad consistente:** la cabecera, el pie y la numeración son los mismos en las dos presentaciones.
2. **Vínculo institucional claro:** se reconoce de inmediato la pertenencia a la UNAL, y el contacto aparece en la portada.
3. **Jerarquía de títulos en dos niveles:** ayuda a saber en qué parte de la presentación se está (por ejemplo, "Lineamientos: estructura → Tesis/Trabajo Final").
4. **Buenos recursos visuales para explicar:** el embudo de "Acotar" que se repite en las diapositivas 12 a 16 del taller, los flujos con flechas y el diagrama de ciclo de la metodología.

## 4. Problemas detectados

### 4.1 Identidad

- **PLaS no tiene identidad visual propia.** La marca visible es la de la UNAL; "PLaS" aparece solo como texto plano, sin logo, color ni símbolo.
- **La paleta son los colores por defecto de Office**, que compiten entre sí. Por ejemplo, la diapositiva 3 de la intro combina cajas verdes, rojas, cian y azul marino, y nada indica que los colores tengan significado.
- **El orden del azul y el verde no es fijo:** en `PLaS_intro` el título va en azul y el subtítulo en verde, y en el taller es al revés.

### 4.2 Estructura y uso del espacio

- **Las cajas con borde negro** de la cabecera y el pie se ven anticuadas y ocupan cerca del 25 % del alto útil de la diapositiva.
- **La navegación "Grupo · Líneas · Proyectos" no resalta la sección actual**, por lo que se repite en cada diapositiva sin dar información.
- **La portada es plana:** todo va centrado, sin color ni una jerarquía visual fuerte.
- **No hay diapositivas de sección o transición.** Los cambios de tema (Lenguajes → Educación → Computación aproximada → ITS → Agricultura) ocurren sin aviso visual.

### 4.3 Consistencia del contenido

- **Alineaciones y tamaños de texto variables:**
  - Hay texto justificado con espacios grandes entre palabras (diapositiva 3 de la intro).
  - Hay párrafos largos en letra diminuta (diapositiva 17 del taller).
  - Los títulos de bloque cambian de tamaño entre diapositivas equivalentes (diapositivas 10 a 14 de la intro).
- **Las imágenes no siguen ningún criterio:** se mezclan fotos de stock, capturas de baja resolución (diapositivas 12 y 13 de la intro), una nube de palabras y clipart, con tamaños y bordes distintos.
- **Hay diapositivas que rompen la plantilla:** en la diapositiva 6 de la intro el diagrama UNCode se sale sobre el pie y la URL queda cortada en el borde.
- **Las tipografías dependen del equipo** donde se abra el archivo (Calibri, Arial, Wingdings).

### 4.4 Maquetas que faltan

Hay casos que se repiten pero no tienen una maqueta definida:

- **Equipo o profesores:** hoy es una lista de texto (diapositiva 16 de la intro).
- **Proyectos:** el nombre del estudiante y el nivel (Maestría o Doctorado) aparecen cada vez con un estilo distinto.
- **Citas y referencias bibliográficas.**
- **Código fuente:** es especialmente relevante para un grupo de lenguajes de programación y hoy no tiene estilo propio.

## 5. Necesidades identificadas para el nuevo formato

A partir del contenido real, el nuevo formato debería cubrir al menos estos tipos de diapositiva:

1. **Portada**, con variantes para una presentación institucional y para un taller o seminario.
2. **Agenda u objetivos.**
3. **Separador de sección.**
4. **Contenido** con título y subtítulo, en una o dos columnas.
5. **Diagrama o flujo** con una paleta de colores semántica.
6. **Proyecto:** título, estudiante, nivel, financiación e imagen.
7. **Bloque de código** o ejemplo técnico.
8. **Cita o ejemplo textual** con su referencia.
9. **Equipo y contacto.**
10. **Cierre.**

## 6. Decisiones pendientes

| # | Pregunta | Opciones |
|---|---|---|
| 1 | ¿En qué herramienta se usará el formato? | PowerPoint (`.potx`), LaTeX/Beamer (Overleaf), Google Slides o varias |
| 2 | ¿Qué restricciones de marca aplican? | Seguir el manual de imagen de la UNAL o desarrollar una identidad propia de PLaS, incluido un posible logo |
| 3 | ¿Qué tono visual se busca? | Académico y sobrio, o moderno y técnico |

## 7. Próximos pasos

1. Resolver las decisiones pendientes de la sección 6.
2. Proponer dos o tres direcciones visuales (paleta, tipografía, cabecera y pie, portada) para compararlas.
3. Elegir una dirección y desarrollar el catálogo de maquetas de la sección 5.
4. Rehacer las dos presentaciones analizadas con el nuevo formato para validarlo.
