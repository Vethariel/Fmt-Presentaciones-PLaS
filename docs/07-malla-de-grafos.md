# Malla de grafos: flotar, rotar y ajustarse

**Fecha:** 2026-11-17
**Documentos previos:** [04-identidad-visual-plas.md](04-identidad-visual-plas.md) (malla del sitio), [06-resultados-prueba-de-concepto.md](06-resultados-prueba-de-concepto.md)

## 1. Decisión

La malla de grafos de la portada y de los separadores **flota, rota y se ajusta** a su panel, con el mismo motor que el sitio web.

| Pregunta | Decisión |
|---|---|
| Rotación | **Oscilante**: ±7° de ida y vuelta en 40 s. Una rotación continua es demasiado larga para una presentación |
| ¿Reacciona a la presentación (clics, cambio de diapositiva)? | **No**: es autónoma |

## 2. Comportamiento

| Mecanismo | Valor | Origen |
|---|---|---|
| Deriva por nodo | 0,022–0,055 px por cuadro, en dirección aleatoria fija | Sitio (`network-mesh.ts`) |
| Variantes de la red | 3 disposiciones: la primera libre, las otras dos derivadas de ella con variaciones del 8 % | Sitio |
| Aristas | Hasta 3 vecinos cercanos por nodo; solo se conservan las que siguen siendo cercanas en las 3 variantes | Sitio |
| Cambio de variante | Cada 20 s los nodos **se deslizan** a una variante en 3,2 s, con aceleración y frenado suaves (cambia de variante cada 2 reinicios) | Sitio: allí se desvanece y reaparece al alejarse 140 px. Aquí es por tiempo y por deslizamiento, para que no sea instantáneo |
| Flotación del grupo | Trayectoria de Lissajous de ±14 px (periodos de 23 s y 31 s) | Diapositivas: la malla es autónoma, no sigue al puntero |
| Rotación del grupo | Oscilante, ±7° en 40 s, alrededor del centro del panel | Diapositivas |
| Ajuste | En cada cuadro, después de rotar y flotar: los bordes del panel actúan como paredes (el nodo rebota) y las zonas reservadas lo repelen | Diapositivas |
| Aristas elásticas | Se desvanecen si sus nodos se separan más de 1,3 veces la distancia de unión | Diapositivas |
| Nodos sueltos | Se eliminan al construir la red | Diapositivas |
| Escala ("zoom") | Unos 0,95 nodos por cada 10 000 px² de panel (18 a 20 nodos); la distancia de unión se ajusta a esa separación | Diapositivas: más grande y menos denso que en el sitio |
| Estilo | Aristas sólidas de 2,2 px y nodos de 3,5 a 8 px de radio, variados como en la primera versión | Diapositivas |

**Cuándo se anima:** solo en la diapositiva activa, en la vista normal o en la del presentador. En el PDF, en la vista general, en la vista previa del presentador y con `prefers-reduced-motion`, se muestra el estado inicial, sin movimiento.

## 3. Paridad web ⇄ PDF

El estado inicial de la web y el del PDF son el mismo: la primera variante, sin rotación ni desplazamiento. La animación no agrega contenido; solo mueve la composición.

![Arriba: portada; abajo: separador. Columnas: web al cargar, web a los 24 s y PDF](img/07-malla-inicio-24s-pdf.png)

## 4. Verificación

Se tomaron muestras de la posición de cada nodo cada 0,5 s durante 24 s, cubriendo un cambio de variante:

| Diapositiva | Nodos | Muestras | Fuera del panel | Dentro de zona reservada | Desplazamiento máximo |
|---|---|---|---|---|---|
| Portada | 19 | 912 | 0 | 0 | 94 px |
| Separador 01 | 17 | 816 | 0 | 0 (número de sección) | 75 px |

El salto máximo de un nodo entre dos muestras seguidas es de 25 px cada 0,5 s, también durante el cambio de variante, así que el movimiento es continuo.

![Separador 01: estado inicial; a los 19,8 s (rotada y desplazada); a los 21,4 s (a mitad del deslizamiento); a los 23,6 s (nueva variante)](img/07-malla-cambio-de-variante.png)

El validador (`plas-check --render`) pasa con 0 errores, y el PDF exportado muestra el estado inicial.

## 5. Implementación

| Archivo | Contenido |
|---|---|
| `theme/composables/meshEngine.ts` | Lógica pura: generación con semilla fija, variantes, aristas, ajuste a regiones convexas y transformación del grupo |
| `theme/components/NetworkMesh.vue` | Dibujo SVG, bucle de animación y control de cuándo se anima |
| `theme/layouts/cover.vue`, `section.vue` | Región = polígono del panel; zona reservada = número de la sección |

**Uso:** `<NetworkMesh :region="PANEL" :avoid="[ZONA]" :seed="n" />`. La región debe ser un polígono **convexo** en coordenadas de la diapositiva (960 × 540).

**Pendiente:** el motor está copiado del sitio web. Si cambia el del sitio, conviene extraer la lógica común a un módulo compartido por los dos repositorios.

## 6. Modo figura: dibujar con la malla

**Fecha:** 2026-11-18

Una malla genérica funciona, pero si los nodos dibujan algo del tema, la portada y los separadores ganan pertinencia. En modo figura, los nodos forman un **dibujo mínimo**: la cantidad necesaria para que se reconozca, sin rellenar.

**Jerarquía de malla.** Es una sola red con dos niveles de aristas sobre los mismos nodos:

| Nivel | Qué es | Trazo |
|---|---|---|
| Principal | Las aristas del dibujo | 3,4 px, casi opacas; nodos de 3,5 a 8 px |
| Secundaria | Muchas más uniones entre los **mismos** nodos (4 vecinos más cercanos de cada uno), más unos pocos **nodos de apoyo** (40 % de los del dibujo, entre 3 y 7) | 1 px, translúcidas; nodos de apoyo de 2,6 px |

Los nodos de apoyo se colocan en la caja de la figura, lejos de los nodos del dibujo para no confundirlo, pero a distancia de vecino para tejerse con él. Se mueven con la figura: tienen ranura propia, respiran y derivan entre formas como los demás. La figura se lee primero por grosor, y la malla secundaria la convierte en red.

### 6.1 Uso

En el frontmatter de la portada o de un separador:

```yaml
mesh: embudo                 # una forma de la biblioteca
mesh: [arbol, libro]         # varias: la malla deriva de una a la siguiente
mesh:                        # una forma propia
  angle: -30                 # opcional, en grados
  nodes: [[0, 0], [50, 0, 1], [100, 0], [0, 60], [50, 60], [100, 60]]   # [x, y] o [x, y, tamaño 0–1]
  edges: [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]]
```

Sin `mesh` (o con `mesh: red`) se dibuja la malla aleatoria de siempre. Las coordenadas se escriben en cualquier unidad: el tema las normaliza y encaja la figura en una caja del panel (sobre el número, en los separadores).

### 6.2 Biblioteca

| Figura | Nodos | Aristas | Sugerida para |
|---|---|---|---|
| `libro` | 10 | 11 | Escritura, tesis, lectura |
| `lapiz` | 7 | 9 | Redactar, taller |
| `embudo` | 10 | 10 | Acotar, de lo general a lo particular |
| `arbol` | 9 | 8 | Estructura, jerarquía, índice, árbol sintáctico |
| `bombilla` | 11 | 13 | Idea, motivación, propuesta |
| `lupa` | 7 | 7 | Búsqueda, revisión de literatura, análisis |

Fuente única: `theme/composables/meshFigures.json`, que también lee `plas-check`. Para agregar una figura a la biblioteca, añádala allí con su `description`.

### 6.3 Límites (nivel 2: los comprueba `plas-check`)

| Regla | Límite |
|---|---|
| Nodos por forma | 6 a 18 |
| Aristas por forma | 6 a 28, sin repetir |
| Nodos sueltos | Ninguno: todo nodo tiene al menos una arista |
| Formas por diapositiva | 1 a 4 |

Fuente única: `theme/utils/figureRules.mjs` (la usan el tema y el validador). El mínimo evita dibujos que no se reconocen ni parecen una red; el máximo impide rellenar el panel.

### 6.4 Movimiento: deriva consciente

| Fase | Duración | Comportamiento |
|---|---|---|
| Ensamblaje | 3,6 s | La red llega dispersa por el panel y se ensambla en la primera forma; las aristas aparecen a medida que la figura toma forma |
| Reposo | 7 s | La forma se mantiene para que se lea; cada nodo **respira** (2,5–5 px, periodos de 5 a 9 s) |
| Deriva | 9 s | Hacia la forma siguiente con curva sinusoidal, (1 − cos πu) / 2: sale suave, acelera a mitad de camino y vuelve a suavizarse al llegar |

No hay cambios rápidos ni deriva aleatoria. Cada nodo va al punto más cercano de la forma siguiente (asignación de menor recorrido), así que el trayecto es intencional. Si las formas tienen distinto número de nodos, los sobrantes se esconden (radio 0) dentro del nodo más cercano y salen de él cuando se necesitan. Las aristas que no están en la forma de destino se desvanecen con la misma curva. Después de la última forma vuelve a la primera. Cada vez que la diapositiva se activa, la figura se vuelve a ensamblar.

Las uniones secundarias de cada forma se calculan por separado; en la deriva, las que no siguen se desvanecen con la misma curva.

**Paridad:** el PDF, la vista general y `prefers-reduced-motion` muestran la primera forma terminada, con su malla secundaria, que también es el estado de la web al acabar el ensamblaje.
