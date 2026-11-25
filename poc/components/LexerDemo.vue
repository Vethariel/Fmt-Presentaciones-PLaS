<script setup lang="ts">
/**
 * Demo de la línea Lenguajes: de texto a tokens (análisis léxico).
 * Web: editable. PDF (readonly): instantánea con la entrada inicial.
 */
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ initial?: string, readonly?: boolean }>(), {
  initial: 'if area > 10: total += pi * r ** 2  # círculo',
})

const src = ref(props.initial)

const KEYWORDS = new Set(['if', 'else', 'elif', 'for', 'while', 'def', 'return', 'in', 'and', 'or', 'not', 'lambda', 'True', 'False', 'None'])
const RULES: [string, RegExp][] = [
  ['espacio', /^\s+/],
  ['comentario', /^#.*/],
  ['cadena', /^("[^"]*"?|'[^']*'?)/],
  ['número', /^\d+(\.\d+)?/],
  ['nombre', /^[\p{L}_][\p{L}\p{N}_]*/u],
  ['operador', /^(\*\*|\/\/|[+\-*/%]=?|==|!=|<=|>=|[<>=])/],
  ['puntuación', /^[()[\]{}:,.]/],
  ['error', /^./],
]

const tokens = computed(() => {
  const out: { kind: string, text: string }[] = []
  let s = src.value
  while (s.length) {
    for (const [kind, re] of RULES) {
      const m = s.match(re)
      if (!m) continue
      const text = m[0]
      if (kind !== 'espacio')
        out.push({ kind: kind === 'nombre' && KEYWORDS.has(text) ? 'palabra clave' : kind, text })
      s = s.slice(text.length)
      break
    }
  }
  return out
})

const summary = computed(() => {
  const c: Record<string, number> = {}
  for (const t of tokens.value) c[t.kind] = (c[t.kind] ?? 0) + 1
  return Object.entries(c)
})
</script>

<template>
  <div class="lexer">
    <label class="lexer__label">Código fuente</label>
    <input v-if="!readonly" v-model="src" class="lexer__input" spellcheck="false">
    <code v-else class="lexer__input">{{ src }}</code>
    <label class="lexer__label">Tokens ({{ tokens.length }})</label>
    <div class="lexer__tokens">
      <span v-for="(t, i) in tokens" :key="i" class="lexer__tok" :data-kind="t.kind">
        <b>{{ t.text }}</b><small>{{ t.kind }}</small>
      </span>
    </div>
    <div class="lexer__summary">
      <span v-for="[k, n] in summary" :key="k" :data-kind="k">{{ k }}: {{ n }}</span>
    </div>
  </div>
</template>

<style scoped>
.lexer { display: flex; flex-direction: column; gap: 8px; }
.lexer__label { font: 600 12px / 1 var(--font-display); color: var(--muted); text-transform: uppercase; letter-spacing: .05em; }
.lexer__input {
  display: block; width: 100%; box-sizing: border-box; padding: 10px 14px; margin-bottom: 8px;
  font: 500 18px / 1.4 var(--font-code); color: var(--ink); background: var(--surface) !important;
  border: 1px solid var(--rule); border-left: 3px solid var(--base); border-radius: var(--radius); outline: none;
}
.lexer__input:focus { border-color: var(--base); }
.lexer__tokens { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.lexer__tok {
  display: inline-flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 4px 8px; border-radius: 6px; background: var(--surface); border: 1px solid var(--rule);
  --c: var(--ink);
}
.lexer__tok b { font: 600 16px / 1.2 var(--font-code); color: var(--c); }
.lexer__tok small { font: 500 12.5px / 1 var(--font-display); color: var(--muted); }
[data-kind='palabra clave'] { --c: #0E6B5C; }
[data-kind='cadena'] { --c: #7A530E; }
[data-kind='nombre'] { --c: #2C5D98; }
[data-kind='número'] { --c: #923F2C; }
[data-kind='operador'] { --c: #77418E; }
[data-kind='comentario'], [data-kind='puntuación'] { --c: #5C6563; }
[data-kind='error'] { --c: #B00020; }
.lexer__summary { display: flex; flex-wrap: wrap; gap: 6px 14px; font: 500 12.5px / 1.3 var(--font-display); }
.lexer__summary span { color: var(--c); }
</style>
