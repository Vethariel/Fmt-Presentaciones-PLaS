# Dónde viven las presentaciones

**Fecha:** 2026-11-25
**Documentos previos:** [03-propuesta-tecnica.md](03-propuesta-tecnica.md) (§4), [06-resultados-prueba-de-concepto.md](06-resultados-prueba-de-concepto.md) (§6.4)

## 1. Problema

El doc. 03 proponía que cada presentación viviera en su propio repositorio, creado a partir de `template/`. Pero `slidev-theme-plas` solo existe en este repositorio (doc. 06 §6.4): una copia de la plantilla en otro lugar no instala. Además, quien clonaba el repositorio no veía dónde escribir, y un agente que lo abría leía primero las reglas para desarrollar el tema.

## 2. Decisión

Las presentaciones se escriben **dentro del clon de este repositorio**, en `presentaciones/<nombre>/`:

```bash
git clone https://github.com/Vethariel/Fmt-Presentaciones-PLaS.git
cd Fmt-Presentaciones-PLaS
npm install
npm run nueva -- mi-presentacion
cd presentaciones/mi-presentacion
```

| Aspecto | Cómo queda |
|---|---|
| Creación | `npm run nueva -- <nombre>` copia `template/` en `presentaciones/<nombre>/` (`tools/nueva.mjs`) |
| Dependencias | Ninguna propia: Node encuentra el tema, Slidev y `plas-check` en el `node_modules/` de la raíz. La carpeta **no** es un workspace, así que crear una presentación no cambia `package-lock.json` |
| Versionado | `presentaciones/*` está en `.gitignore` (salvo su `README.md`). Cada autor puede hacer `git init` dentro de su carpeta |
| Agentes | El `AGENTS.md` raíz empieza con la ruta para escribir una presentación y limita las escrituras a esa carpeta. El `AGENTS.md` de la presentación repite el límite |
| Salidas | `dist/` (web) y `export/<nombre>.pdf`, dentro de la carpeta de la presentación |
| Navegador | `plas-check` y `plas-export` buscan Chrome o Chromium en las rutas usuales de Linux, macOS y Windows, o usan `PLAS_CHROME` |

## 3. Consecuencias

- **El tema no tiene versiones por presentación.** Una presentación usa el tema del commit que tenga el clon. `git pull` trae las mejoras a todas, pero también puede cambiar cómo se ve una presentación ya entregada. Para congelar una, se exportan el PDF y `dist/`.
- **La plantilla se copia una sola vez.** Un cambio en `template/AGENTS.md` no llega a las presentaciones ya creadas.
- **No hace falta publicar el tema** en npm ni en GitHub Packages. Si más adelante se quieren repositorios independientes, la estructura de `presentaciones/<nombre>/` sirve tal cual: basta con añadir la dependencia del tema publicado a su `package.json`.

## 4. Pendiente

- Publicar en GitHub Pages (doc. 06 §6.6). El `webUrl` de la plantilla aún supone un repositorio por presentación.
