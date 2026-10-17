<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  createPlayfairSquare,
  decryptPlayfair,
  normalizePlayfair,
  type Position,
} from '../../ciphers/playfair';
import { useCopyResult } from '../../composables/useCopyResult';
import { example, rules } from './content';

const keyword = ref(example.keyword),
  text = ref(example.text),
  selected = ref(0);
const result = computed(() => decryptPlayfair(text.value, keyword.value));
const output = computed(() => (result.value.ok ? result.value.output : ''));
const normalized = computed(() => normalizePlayfair(text.value));
const square = computed(() => {
  try {
    return createPlayfairSquare(keyword.value);
  } catch {
    return [];
  }
});
const current = computed(() =>
  result.value.ok ? result.value.steps[selected.value] : undefined,
);
const { copyStatus, copy } = useCopyResult(output);
watch([text, keyword], () => {
  selected.value = 0;
  copyStatus.value = '';
});
function reset() {
  keyword.value = example.keyword;
  text.value = example.text;
  selected.value = 0;
  copyStatus.value = '';
}
const contains = (
  positions: Position[] | undefined,
  row: number,
  column: number,
) => positions?.some((p) => p.row === row && p.column === column);
function cellClass(row: number, column: number) {
  const input = contains(current.value?.from, row, column),
    out = contains(current.value?.to, row, column);
  if (input && out)
    return 'border-violet-500 bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-violet-100';
  if (input)
    return 'border-sky-500 bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-100';
  if (out)
    return 'border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100';
  return 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950';
}
</script>

<template>
  <section class="cipher-lab" aria-labelledby="playfair-title">
    <div
      class="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 px-4 py-4 text-white sm:px-6"
    >
      <div>
        <h2 id="playfair-title" class="text-xl font-semibold">
          🧪 Laboratorio de Playfair · Descifrado
        </h2>
        <p class="text-sm text-white/90">
          Reconstruye cada par con la cuadrícula de tu clave.
        </p>
      </div>
      <button
        class="rounded-lg border border-white/50 px-3 py-1.5 text-sm hover:bg-white/20"
        @click="reset"
      >
        ↺ Reiniciar ejemplo
      </button>
    </div>
    <div class="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <div class="space-y-4">
        <div
          class="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-500/10"
        >
          <label for="playfair-key" class="lab-label"
            ><span class="lab-number bg-violet-500">1</span> Palabra
            clave</label
          >
          <input
            id="playfair-key"
            v-model="keyword"
            class="lab-field mt-2"
            spellcheck="false"
            autocomplete="off"
            aria-describedby="playfair-key-help"
          />
          <p
            id="playfair-key-help"
            class="mt-2 text-xs text-slate-600 dark:text-slate-400"
          >
            Se eliminan duplicados y se completa por filas. I y J comparten
            casilla.
          </p>
        </div>
        <label for="playfair-input" class="lab-label"
          ><span class="lab-number bg-sky-500">2</span> Texto cifrado</label
        >
        <textarea
          id="playfair-input"
          v-model="text"
          rows="3"
          class="lab-field border-sky-300 dark:border-sky-800"
          spellcheck="false"
          aria-describedby="playfair-normalized"
          :aria-invalid="!result.ok"
        />
        <p
          id="playfair-normalized"
          class="break-words text-xs text-slate-600 dark:text-slate-400"
        >
          Normalizado: <span class="font-mono">{{ normalized || '∅' }}</span
          >. Solo A–Z; tildes fuera, Ñ → N, J → I. Se ignoran espacios y signos.
        </p>
        <p v-if="!result.ok" class="lab-error" role="alert">
          {{ result.error }}
        </p>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <label for="playfair-output" class="lab-label"
            ><span class="lab-number bg-emerald-500">3</span> Texto
            recuperado</label
          >
          <button class="lab-button" :disabled="!output" @click="copy">
            📋 Copiar
          </button>
        </div>
        <textarea
          id="playfair-output"
          :value="output"
          rows="3"
          readonly
          class="lab-field border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100"
        />
        <p role="status" class="text-sm text-emerald-700 dark:text-emerald-300">
          {{ copyStatus }}
        </p>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Se conservan las X: podrían ser relleno o letras del mensaje. No se
          recuperan espacios, tildes ni la distinción I/J.
        </p>
      </div>
      <div class="space-y-4">
        <h3 class="lab-label">
          <span class="lab-number bg-indigo-500">4</span> Explora la cuadrícula
        </h3>
        <table
          v-if="square.length"
          class="mx-auto border-separate border-spacing-1 text-center font-mono"
          aria-label="Cuadrícula Playfair de la clave; filas y columnas numeradas del 1 al 5"
        >
          <thead>
            <tr>
              <th class="sr-only">Fila / columna</th>
              <th
                v-for="c in 5"
                :key="c"
                scope="col"
                class="text-xs text-slate-500"
              >
                {{ c }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in square" :key="r">
              <th scope="row" class="pr-1 text-xs text-slate-500">
                {{ r + 1 }}
              </th>
              <td
                v-for="(letter, c) in row"
                :key="c"
                class="size-10 rounded-lg border-2 text-lg font-bold transition-colors sm:size-12"
                :class="cellClass(r, c)"
              >
                {{ letter === 'I' ? 'I/J' : letter }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-sm text-slate-500">
          Escribe una clave con letras para construir la cuadrícula.
        </p>
        <p class="text-center text-xs">
          <span class="text-sky-700 dark:text-sky-300">Azul: entrada</span> ·
          <span class="text-emerald-700 dark:text-emerald-300"
            >Verde: salida</span
          >
          ·
          <span class="text-violet-700 dark:text-violet-300"
            >Violeta: ambas</span
          >
        </p>
        <div
          v-if="current"
          class="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-500/10"
          aria-live="polite"
        >
          <p class="mb-2 font-semibold">
            Par {{ selected + 1 }} ·
            <span class="font-mono"
              >{{ current.input }} → {{ current.output }}</span
            >
          </p>
          <p class="text-sm">{{ rules[current.rule] }}</p>
          <ol class="mt-3 space-y-1 font-mono text-sm">
            <li v-for="(p, i) in current.from" :key="i">
              {{ current.input[i] }} ({{ p.row + 1 }}, {{ p.column + 1 }}) →
              {{ current.output[i] }} ({{ current.to[i].row + 1 }},
              {{ current.to[i].column + 1 }})
            </li>
          </ol>
          <p class="mt-2 text-xs text-slate-500">
            Coordenadas: (fila, columna), desde 1.
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="result.ok && result.steps.length"
      class="border-t border-slate-200 p-4 sm:p-6 dark:border-slate-800"
    >
      <p class="mb-3 text-sm text-slate-600 dark:text-slate-400">
        Selecciona un par para seguir sus letras. También puedes usar Tab y
        Enter.
      </p>
      <div
        class="flex max-h-56 flex-wrap gap-2 overflow-y-auto p-1"
        aria-label="Pares del criptograma"
      >
        <button
          v-for="(step, i) in result.steps"
          :key="i"
          class="lab-block"
          :aria-pressed="selected === i"
          @click="selected = i"
        >
          <span class="mr-2 text-xs text-slate-500">{{ i + 1 }}</span
          ><span class="text-sky-700 dark:text-sky-300">{{ step.input }}</span>
          →
          <span class="text-emerald-700 dark:text-emerald-300">{{
            step.output
          }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
