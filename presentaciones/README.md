# Presentaciones

Aquí se crean las presentaciones, una carpeta por presentación:

```bash
npm run nueva -- mi-presentacion     # desde la raíz del repositorio
cd presentaciones/mi-presentacion
```

Todo lo que produzca usted o un agente queda dentro de esa carpeta:

| Ruta | Qué es |
|---|---|
| `slides.md` | La presentación (la única fuente) |
| `components/` | Componentes propios (Vue) |
| `AGENTS.md` | Guía de formato que leen los agentes (`CLAUDE.md` apunta al mismo archivo) |
| `dist/` | Versión web, generada por `npm run build` o `npm run check` |
| `export/<nombre>.pdf` | PDF, generado por `npm run export` |

Esta carpeta **no se versiona** en el repositorio del formato: cada presentación es de su autor. Para versionar la suya, ejecute `git init` dentro de su carpeta.
