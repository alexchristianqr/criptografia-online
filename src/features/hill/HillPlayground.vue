<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  normalizeHill,
  transformHill,
  type HillMode,
} from '../../ciphers/hill';
import { useCopyResult } from '../../composables/useCopyResult';
import { examples } from './content';

const size = ref<2 | 3>(2);
const cells = ref<(number | string)[][]>(
  examples[2].key.map((row) => [...row]),
);
const text = ref<string>(examples[2].text),
  mode = ref<HillMode>('cifrar'),
  selected = ref(0);
const key = computed(() =>
  cells.value.map((row) =>
    row.map((cell) =>
      typeof cell === 'number' ? cell : cell.trim() === '' ? NaN : Number(cell),
    ),
  ),
);
const result = computed(() => transformHill(text.value, key.value, mode.value));
const analysis = computed(() => result.value.analysis);
const output = computed(() => (result.value.ok ? result.value.output : ''));
const current = computed(() =>
  result.value.ok ? result.value.blocks[selected.value] : undefined,
);
const { copyStatus, copy } = useCopyResult(output);
const normalized = computed(() => normalizeHill(text.value));
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
watch(
  [text, mode, cells],
  () => {
    selected.value = 0;
    copyStatus.value = '';
  },
  { deep: true },
);
function reset() {
  const example = examples[size.value];
  cells.value = example.key.map((row) => [...row]);
  text.value = example.text;
  mode.value = 'cifrar';
  selected.value = 0;
  copyStatus.value = '';
}
watch(size, reset);
function swap() {
  if (!output.value) return;
  text.value = output.value;
  mode.value = mode.value === 'cifrar' ? 'descifrar' : 'cifrar';
}
const formatMatrix = (matrix: number[][]) =>
  matrix.map((row) => `[ ${row.join('  ')} ]`).join('\n');
</script>

<template>
  <section class="cipher-lab" aria-labelledby="hill-title">
    <div
      class="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 px-4 py-4 text-white sm:px-6"
    >
      <div>
        <h2 id="hill-title" class="text-xl font-semibold">
          🧪 Laboratorio de Hill
        </h2>
        <p class="text-sm text-white/90">
          Convierte letras en vectores y descubre cómo opera la matriz.
        </p>
      </div>
      <div
        class="inline-flex rounded-lg bg-black/20 p-1"
        role="group"
        aria-label="Modo de Hill"
      >
        <button
          v-for="m in ['cifrar', 'descifrar'] as const"
          :key="m"
          class="rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-white"
          :class="
            mode === m ? 'bg-white text-teal-800 shadow' : 'hover:bg-white/10'
          "
          :aria-pressed="mode === m"
          @click="mode = m"
        >
          {{ m === 'cifrar' ? '🔒 Cifrar' : '🔓 Descifrar' }}
        </button>
      </div>
    </div>
    <div class="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <div
        class="space-y-4 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-500/10"
      >
        <label for="hill-size" class="lab-label"
          ><span class="lab-number bg-teal-500">1</span> Tamaño y clave K</label
        >
        <select id="hill-size" v-model="size" class="lab-field">
          <option :value="2">2 × 2 · bloques de 2 letras</option>
          <option :value="3">3 × 3 · bloques de 3 letras</option>
        </select>
        <fieldset>
          <legend class="mb-2 text-sm font-medium">
            Matriz clave · enteros de 0 a 25
          </legend>
          <div
            class="mx-auto grid w-fit gap-2"
            :style="{ gridTemplateColumns: `repeat(${size}, minmax(0, 4rem))` }"
          >
            <template v-for="(row, r) in cells" :key="r"
              ><input
                v-for="(_, c) in row"
                :key="c"
                v-model.number="cells[r][c]"
                type="number"
                min="0"
                max="25"
                step="1"
                class="lab-field min-w-0 p-2 text-center"
                :aria-label="`Clave, fila ${r + 1}, columna ${c + 1}`"
                :aria-invalid="
                  !Number.isInteger(key[r][c]) ||
                  key[r][c] < 0 ||
                  key[r][c] > 25
                "
            /></template>
          </div>
        </fieldset>
        <div
          v-if="analysis"
          class="rounded-lg border border-teal-200 bg-white/70 p-3 text-sm dark:border-teal-800 dark:bg-slate-950/50"
        >
          <p class="font-mono">det(K) = {{ analysis.determinant }}</p>
          <p class="font-mono">det(K) mod 26 = {{ analysis.determinantMod }}</p>
          <p class="font-mono">
            mcd({{ analysis.determinant }}, 26) = {{ analysis.gcd }}
          </p>
          <p
            class="mt-2 font-medium"
            :class="
              analysis.inverse
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-rose-700 dark:text-rose-300'
            "
          >
            {{
              analysis.inverse
                ? '✓ Clave invertible: puede cifrar y descifrar.'
                : 'La clave necesita un determinante coprimo con 26.'
            }}
          </p>
          <template v-if="analysis.inverse"
            ><p class="mt-3 font-semibold">Inversa K⁻¹ módulo 26</p>
            <pre class="mt-1 overflow-x-auto font-mono">{{
              formatMatrix(analysis.inverse)
            }}</pre>
          </template>
        </div>
        <button class="lab-button" @click="reset">
          ↺ Reiniciar ejemplo de {{ size }} × {{ size }}
        </button>
        <p class="text-xs text-slate-600 dark:text-slate-400">
          Cambiar el tamaño carga una clave válida y su ejemplo. Se usan
          vectores columna, multiplicados por la matriz a la izquierda.
        </p>
      </div>
      <div class="space-y-4">
        <label for="hill-input" class="lab-label"
          ><span class="lab-number bg-sky-500">2</span>
          {{ mode === 'cifrar' ? 'Texto plano' : 'Texto cifrado' }}</label
        >
        <textarea
          id="hill-input"
          v-model="text"
          rows="3"
          class="lab-field border-sky-300 dark:border-sky-800"
          spellcheck="false"
          aria-describedby="hill-normalized"
          :aria-invalid="!result.ok"
        />
        <p
          id="hill-normalized"
          class="break-words text-xs text-slate-600 dark:text-slate-400"
        >
          Normalizado: <span class="font-mono">{{ normalized || '∅' }}</span
          >. Solo A–Z; se eliminan tildes, espacios y signos; Ñ → N. J se
          conserva.
        </p>
        <p v-if="!result.ok" class="lab-error" role="alert">
          {{ result.error }}
        </p>
        <p v-else class="text-sm text-slate-600 dark:text-slate-400">
          {{
            mode === 'cifrar'
              ? `Relleno añadido: ${result.padding} letras X.`
              : 'Se conserva cualquier relleno: no se eliminan letras X.'
          }}
        </p>
        <div class="text-center">
          <button class="lab-button" :disabled="!output" @click="swap">
            ⇅ Pasar resultado a entrada y
            {{ mode === 'cifrar' ? 'descifrar' : 'cifrar' }}
          </button>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <label for="hill-output" class="lab-label"
            ><span class="lab-number bg-emerald-500">3</span>
            {{
              mode === 'cifrar' ? 'Texto cifrado' : 'Texto recuperado'
            }}</label
          >
          <button class="lab-button" :disabled="!output" @click="copy">
            📋 Copiar
          </button>
        </div>
        <textarea
          id="hill-output"
          :value="output"
          rows="3"
          readonly
          class="lab-field border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100"
        />
        <p role="status" class="text-sm text-emerald-700 dark:text-emerald-300">
          {{ copyStatus }}
        </p>
      </div>
    </div>
    <div class="border-t border-slate-200 p-4 sm:p-6 dark:border-slate-800">
      <h3 class="lab-label">
        <span class="lab-number bg-indigo-500">4</span> Sigue el cálculo por
        bloques
      </h3>
      <div
        class="my-4 flex max-h-28 flex-wrap gap-1 overflow-y-auto font-mono"
        aria-label="Correspondencia de letras y números"
      >
        <span
          v-for="(letter, i) in alphabet"
          :key="letter"
          class="rounded bg-slate-100 px-1.5 py-1 text-xs dark:bg-slate-800"
          >{{ letter }}={{ i }}</span
        >
      </div>
      <template v-if="result.ok && current">
        <div
          class="mb-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto p-1"
          aria-label="Selecciona un bloque"
        >
          <button
            v-for="(block, i) in result.blocks"
            :key="i"
            class="lab-block"
            :aria-pressed="selected === i"
            @click="selected = i"
          >
            <span class="mr-2 text-xs text-slate-500">{{ i + 1 }}</span
            ><span class="text-sky-700 dark:text-sky-300">{{
              block.input
            }}</span>
            →
            <span class="text-emerald-700 dark:text-emerald-300">{{
              block.output
            }}</span>
          </button>
        </div>
        <div
          class="grid gap-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 md:grid-cols-2 dark:border-indigo-800 dark:bg-indigo-500/10"
          aria-live="polite"
        >
          <div>
            <p class="font-semibold">
              Bloque {{ selected + 1 }} de {{ result.blocks.length }} ·
              {{ current.input }} → {{ current.output }}
            </p>
            <p class="mt-2 text-sm">
              {{
                mode === 'cifrar' ? 'C = K · P mod 26' : 'P = K⁻¹ · C mod 26'
              }}
            </p>
            <p class="mt-3 text-xs font-semibold uppercase tracking-wide">
              {{
                mode === 'cifrar'
                  ? 'Matriz efectiva K'
                  : 'Matriz efectiva K⁻¹ (inversa de la clave)'
              }}
            </p>
            <pre class="mt-1 overflow-x-auto font-mono">{{
              formatMatrix(result.effectiveKey)
            }}</pre>
            <p
              class="mt-3 break-words font-mono text-sm text-sky-700 dark:text-sky-300"
            >
              {{ current.input }} → [{{ current.inputValues.join(', ') }}]ᵀ
            </p>
          </div>
          <ol class="space-y-3 text-sm">
            <li
              v-for="(row, r) in result.effectiveKey"
              :key="r"
              class="rounded-lg bg-white/70 p-3 dark:bg-slate-950/50"
            >
              <p class="mb-1 font-semibold">Fila {{ r + 1 }}</p>
              <p class="break-words font-mono">
                {{
                  row
                    .map((k, j) => `${k} × ${current!.inputValues[j]}`)
                    .join(' + ')
                }}
                = {{ current.sums[r] }}
              </p>
              <p class="font-mono">
                {{ current.sums[r] }} mod 26 =
                <b>{{ current.outputValues[r] }}</b> →
                <b class="text-emerald-700 dark:text-emerald-300">{{
                  current.output[r]
                }}</b>
              </p>
            </li>
          </ol>
        </div>
      </template>
      <p v-else class="text-sm text-slate-500">
        {{
          result.ok
            ? 'Escribe un mensaje para explorar sus bloques.'
            : 'Corrige los datos para ver los cálculos.'
        }}
      </p>
    </div>
  </section>
</template>
