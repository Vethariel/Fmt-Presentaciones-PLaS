# Presentaciones PLaS

Formato de presentaciones del grupo PLaS (Universidad Nacional de Colombia). Una sola fuente en Markdown (`slides.md`) produce una **versión web** con animaciones y un **PDF** con el mismo contenido. Usa [Slidev](https://sli.dev) y un validador que comprueba el formato.

## Requisitos

- Node.js 22.22 o superior
- Google Chrome o Chromium (para validar y exportar el PDF). Si está en una ruta poco común, indíquela en la variable `PLAS_CHROME`.

## Crear una presentación

```bash
git clone https://github.com/Vethariel/Fmt-Presentaciones-PLaS.git
cd Fmt-Presentaciones-PLaS
npm install
npm run nueva -- mi-presentacion
cd presentaciones/mi-presentacion
npm run dev
```

Todo lo de su presentación queda en **`presentaciones/mi-presentacion/`**:

```
presentaciones/mi-presentacion/
├── slides.md        ← la presentación
├── components/      ← componentes propios (opcional)
├── AGENTS.md        ← guía de formato para agentes (CLAUDE.md apunta aquí)
├── dist/            ← versión web   (npm run build)
└── export/          ← PDF           (npm run export)
```

Esa carpeta no se versiona en este repositorio. Si quiere versionar su presentación, haga `git init` dentro de ella.

## Con un agente (Claude Code, Codex, Cursor…)

Abra el agente en la raíz del repositorio o en la carpeta de la presentación y pídale lo que quiere presentar. El agente encuentra `AGENTS.md`, que le indica:

- escribir solo dentro de `presentaciones/<nombre>/` (y crearla con `npm run nueva` si no existe);
- usar las maquetas y componentes del tema, sin colores ni tamaños a mano;
- no dar nada por terminado hasta que `npm run check` pase sin errores.

## Comandos de una presentación

Dentro de `presentaciones/<nombre>/`:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Vista previa en http://localhost:3030 |
| `npm run check` | Compila y valida el formato (web y PDF) |
| `npm run build` | Versión web en `dist/` |
| `npm run export` | PDF en `export/<nombre>.pdf` |

## Qué hay en el repositorio

| Carpeta | Contenido |
|---|---|
| `presentaciones/` | Sus presentaciones |
| `ejemplos/` | Una presentación real en el formato (taller de escritura) |
| `showcase/` | Muestra de cada maqueta y elemento |
| `docs/` | Decisiones de diseño y [guía de formato](docs/09-guia-de-formato.md) |
| `theme/` | El tema `slidev-theme-plas`, el validador y el exportador |
| `template/` | Lo que copia `npm run nueva` |

Para cambiar el formato en sí, lea [AGENTS.md](AGENTS.md) (sección «Si va a cambiar el sistema de formato»).
