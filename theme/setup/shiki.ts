import { defineShikiSetup } from '@slidev/types'

/**
 * Tema de sintaxis "PLaS Claro".
 * Cada categoría usa el tono oscuro (--mid-dark) de una línea de investigación,
 * así el código lleva la paleta del grupo. Todos los colores cumplen
 * contraste ≥ 4.5:1 sobre el fondo de código (#F5F8F7).
 */
const C = {
  bg: '#F5F8F7',
  fg: '#2A2F2E',
  muted: '#5C6563',
  keyword: '#0E6B5C', // Lenguajes / marca
  string: '#7A530E', // Educación
  func: '#2C5D98', // Embebidos
  number: '#923F2C', // Transporte
  type: '#77418E', // Sensado
}

const plasLight = {
  name: 'plas-light',
  type: 'light',
  colors: {
    'editor.background': C.bg,
    'editor.foreground': C.fg,
  },
  tokenColors: [
    { settings: { foreground: C.fg, background: C.bg } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: C.muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.word', 'keyword.operator.logical.python'], settings: { foreground: C.keyword, fontStyle: 'bold' } },
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: C.muted } },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: C.string } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic', 'variable.function'], settings: { foreground: C.func } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character', 'support.constant'], settings: { foreground: C.number } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'], settings: { foreground: C.type } },
    { scope: ['variable.parameter', 'variable.parameter.function'], settings: { foreground: C.fg, fontStyle: 'italic' } },
    { scope: ['entity.name.tag'], settings: { foreground: C.keyword } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: C.func } },
    { scope: ['markup.heading'], settings: { foreground: C.keyword, fontStyle: 'bold' } },
  ],
}

export default defineShikiSetup(() => ({
  themes: {
    light: plasLight as any,
    dark: plasLight as any,
  },
}))
