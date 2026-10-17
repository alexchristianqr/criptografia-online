<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  MAX_M,
  MIN_M,
  identity,
  inverse,
  permuteBlocks,
} from '../../ciphers/permutation';
import KeyInput from './KeyInput.vue';
import { labExample } from './content';

const text = ref('ATACAR AL ALBA');
const key = ref<number[]>([2, 0, 3, 1]);
/** El tamaño de bloque es la longitud de la clave; cambiarlo con el slider reinicia la clave. */
const m = computed({
  get: () => key.value.length,
  set: (n: number) => (key.value = identity(n)),
});
const mode = ref<'cifrar' | 'descifrar'>('cifrar');
const picked = ref<number | null>(null);
const pinned = ref(0);
const hoverBlock = ref<number | null>(null);
const hoverPos = ref<number | null>(null);
const copied = ref(false);

const encrypting = computed(() => mode.value === 'cifrar');
/** Clave que realmente se aplica (la inversa al descifrar): salida[j] = entrada[effKey[j]]. */
const effKey = computed(() =>
  encrypting.value ? key.value : inverse(key.value),
);
/** Destino de cada letra de entrada, para dibujar el diagrama: la letra i viaja a la posición dest[i]. */
const dest = computed(() => inverse(effKey.value));
const blocks = computed(() => permuteBlocks(text.value, effKey.value));
const output = computed(() =>
  blocks.value.map((b) => b.output.join('')).join(''),
);
const curBlock = computed(() =>
  Math.min(hoverBlock.value ?? pinned.value, blocks.value.length - 1),
);
const cur = computed(() => blocks.value[curBlock.value]);
const keyLabel = computed(() => key.value.map((k) => k + 1).join(' '));
const total = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);

watch(
  () => key.value.length,
  () => (picked.value = null),
);

/** Intercambia los destinos de dos posiciones: la clave siempre sigue siendo una permutación válida. */
function pick(i: number) {
  if (picked.value === null) picked.value = i;
  else if (picked.value === i) picked.value = null;
  else {
    const k = [...key.value];
    [k[picked.value], k[i]] = [k[i]!, k[picked.value]!];
    key.value = k;
    picked.value = null;
  }
}
function shuffle() {
  const k = identity(m.value);
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j]!, k[i]!];
  }
  key.value = k;
}
const reverse = () => (key.value = inverse(key.value));
function loadExample() {
  text.value = labExample.text;
  key.value = [...labExample.key];
  mode.value = 'cifrar';
}
const reset = () => (key.value = identity(m.value));
function swapIO() {
  text.value = output.value;
  mode.value = encrypting.value ? 'descifrar' : 'cifrar';
}
async function copy() {
  try {
    await navigator.clipboard.writeText(output.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    /* portapapeles no disponible */
  }
}

/** Geometría del diagrama de cruces. */
const CELL = 52;
const W = computed(() => m.value * CELL);
const cx = (i: number) => i * CELL + CELL / 2;
const activePos = computed(() => hoverPos.value);
const COLORS = [
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#6366f1',
  '#a855f7',
  '#ec4899',
];

const field =
  'w-full rounded-xl border-2 bg-white p-3 font-mono text-base outline-none transition focus:ring-4 dark:bg-slate-950';
const btn =
  'rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:bg-amber-100 active:scale-95 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-amber-900/40';
const badge =
  'grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold text-white';
</script>

<template>
  <section
    class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <div
      class="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600 px-4 py-3 text-white sm:px-6"
    >
      <div>
        <h2 class="text-xl font-semibold">🧪 Laboratorio de permutación</h2>
        <p class="text-sm text-white/80">
          Reordena las letras: elige el bloque, arma la clave y mira cómo
          viajan.
        </p>
      </div>
      <div
        class="inline-flex rounded-lg bg-black/20 p-1"
        role="group"
        aria-label="Modo"
      >
        <button
          v-for="md in ['cifrar', 'descifrar'] as const"
          :key="md"
          class="rounded-md px-3 py-1 text-sm font-medium transition"
          :class="
            mode === md
              ? 'bg-white text-rose-700 shadow'
              : 'text-white/80 hover:text-white'
          "
          @click="mode = md"
        >
          {{ md === 'cifrar' ? '🔒 cifrar' : '🔓 descifrar' }}
        </button>
      </div>
    </div>

    <div class="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <!-- 1 tamaño + clave -->
      <div
        class="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-500/10"
      >
        <div class="flex items-center gap-3">
          <span :class="[badge, 'bg-amber-500']">1</span>
          <label for="m" class="flex-1 font-semibold"
            >Tamaño del bloque <span class="font-mono">m</span></label
          >
          <span class="font-mono text-3xl font-black text-amber-500">{{
            m
          }}</span>
        </div>
        <input
          id="m"
          v-model.number="m"
          type="range"
          :min="MIN_M"
          :max="MAX_M"
          class="w-full accent-amber-500"
        />

        <div>
          <p class="mb-1 font-semibold">
            Arma la clave
            <span class="text-sm font-normal text-slate-500"
              >(toca dos casillas para intercambiarlas)</span
            >
          </p>
          <div class="flex flex-wrap gap-2">
            <div v-for="(to, i) in key" :key="i" class="text-center">
              <div
                class="mb-0.5 font-mono text-xs text-sky-600 dark:text-sky-400"
              >
                posición {{ i + 1 }}
              </div>
              <button
                class="grid size-12 place-items-center rounded-xl border-2 font-mono text-xl font-bold transition active:scale-95"
                :class="
                  picked === i
                    ? 'scale-110 border-amber-500 bg-amber-400 text-white shadow-lg'
                    : 'border-amber-300 bg-white text-amber-700 hover:border-amber-500 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300'
                "
                :aria-label="`La posición ${i + 1} del resultado toma la letra ${to + 1}`"
                @click="pick(i)"
              >
                {{ to + 1 }}
              </button>
              <div class="mt-0.5 text-xs text-slate-500">← toma la letra</div>
            </div>
          </div>
          <KeyInput v-model="key" class="mt-3" />
          <div class="mt-3 flex flex-wrap gap-2">
            <button :class="btn" @click="shuffle">🎲 Aleatoria</button>
            <button :class="btn" @click="reverse">↔ Invertir clave</button>
            <button :class="btn" @click="reset">↺ Reiniciar</button>
            <button :class="btn" @click="loadExample">
              📚 Cargar ejemplo (MANOS · 2 4 5 3 1)
            </button>
          </div>
          <p class="mt-2 text-sm text-amber-800 dark:text-amber-200">
            Clave <b class="font-mono">{{ keyLabel }}</b
            >: hay {{ total(m).toLocaleString('es') }} claves posibles con m =
            {{ m }}.
            <template v-if="!encrypting">
              Al descifrar se usa la inversa.</template
            >
          </p>
        </div>
      </div>

      <!-- 2 y 3 texto -->
      <div class="space-y-4">
        <label class="block">
          <span class="mb-1 flex items-center gap-3 font-semibold">
            <span :class="[badge, 'bg-sky-500']">2</span> Escribe ·
            {{ encrypting ? 'texto plano' : 'texto cifrado' }}
          </span>
          <textarea
            v-model="text"
            rows="3"
            spellcheck="false"
            placeholder="Escribe aquí…"
            :class="[
              field,
              'border-sky-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-sky-800',
            ]"
          />
          <span class="mt-1 block text-xs text-slate-500"
            >Se ignoran espacios y signos; el último bloque se completa con
            X.</span
          >
        </label>
        <div class="flex justify-center">
          <button
            class="rounded-full border border-violet-300 px-3 py-1 text-sm font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/40"
            @click="swapIO"
          >
            ⇅ Pasar el resultado a la entrada y
            {{ encrypting ? 'descifrar' : 'cifrar' }}
          </button>
        </div>
        <label class="block">
          <span class="mb-1 flex items-center gap-3 font-semibold">
            <span :class="[badge, 'bg-emerald-500']">3</span>
            <span class="flex-1"
              >Resultado ·
              {{ encrypting ? 'texto cifrado' : 'texto plano' }}</span
            >
            <button
              type="button"
              class="rounded-lg border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
              @click.prevent="copy"
            >
              {{ copied ? '¡Copiado! ✓' : '📋 Copiar' }}
            </button>
          </span>
          <textarea
            :value="output"
            rows="3"
            readonly
            :class="[
              field,
              'border-emerald-300 bg-emerald-50 font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100',
            ]"
          />
        </label>
      </div>
    </div>

    <!-- 4 diagrama -->
    <div
      v-if="cur"
      class="border-t border-slate-200 p-4 sm:p-6 dark:border-slate-800"
    >
      <h3 class="mb-1 flex items-center gap-3 font-semibold">
        <span :class="[badge, 'bg-violet-500']">4</span> Mira cómo viaja cada
        letra
      </h3>
      <p class="mb-4 text-sm text-slate-500">
        Bloque <b>{{ curBlock + 1 }}</b> de {{ blocks.length }}. Cada letra
        <span class="font-semibold text-sky-600 dark:text-sky-400"
          >de arriba</span
        >
        baja por su línea de color hasta su nueva posición
        <span class="font-semibold text-emerald-600 dark:text-emerald-400"
          >abajo</span
        >. Toca otro bloque para cambiarlo.
      </p>

      <div class="overflow-x-auto pb-2">
        <svg
          :viewBox="`-40 -6 ${W + 48} 190`"
          :width="W + 48"
          class="mx-auto block max-w-full"
          role="img"
          aria-label="Diagrama de permutación del bloque"
        >
          <text
            x="-36"
            y="26"
            class="fill-sky-600 text-[10px] font-semibold dark:fill-sky-400"
          >
            entrada
          </text>
          <text
            x="-36"
            y="160"
            class="fill-emerald-600 text-[10px] font-semibold dark:fill-emerald-400"
          >
            salida
          </text>
          <g v-for="(to, i) in dest" :key="'l' + i">
            <line
              :x1="cx(i)"
              y1="46"
              :x2="cx(to)"
              y2="124"
              :stroke="COLORS[i % COLORS.length]"
              :stroke-width="activePos === i ? 6 : 3.5"
              stroke-linecap="round"
              :opacity="activePos === null || activePos === i ? 1 : 0.25"
              class="transition-all"
            />
            <circle
              :cx="cx(i)"
              cy="46"
              r="4"
              :fill="COLORS[i % COLORS.length]"
            />
            <circle
              :cx="cx(to)"
              cy="124"
              r="4"
              :fill="COLORS[i % COLORS.length]"
            />
          </g>
          <g
            v-for="(l, i) in cur.input"
            :key="'t' + i"
            @mouseenter="hoverPos = i"
            @mouseleave="hoverPos = null"
          >
            <rect
              :x="cx(i) - 20"
              y="4"
              width="40"
              height="40"
              rx="10"
              class="fill-sky-500"
              :stroke="COLORS[i % COLORS.length]"
              stroke-width="3"
            />
            <text
              :x="cx(i)"
              y="30"
              text-anchor="middle"
              class="fill-white font-mono text-lg font-bold"
            >
              {{ l }}
            </text>
            <text
              :x="cx(i)"
              y="-0"
              text-anchor="middle"
              class="fill-slate-500 font-mono text-[10px]"
            >
              {{ i + 1 }}
            </text>
          </g>
          <g v-for="(l, j) in cur.output" :key="'b' + j">
            <rect
              :x="cx(j) - 20"
              y="126"
              width="40"
              height="40"
              rx="10"
              class="fill-emerald-500"
              :stroke="COLORS[effKey[j]! % COLORS.length]"
              stroke-width="3"
            />
            <text
              :x="cx(j)"
              y="152"
              text-anchor="middle"
              class="fill-white font-mono text-lg font-bold"
            >
              {{ l }}
            </text>
            <text
              :x="cx(j)"
              y="180"
              text-anchor="middle"
              class="fill-slate-500 font-mono text-[10px]"
            >
              {{ j + 1 }}
            </text>
          </g>
        </svg>
      </div>
      <p v-if="activePos !== null" class="mt-2 text-center text-sm">
        La
        <b class="text-sky-600 dark:text-sky-400">{{ cur.input[activePos] }}</b>
        (posición {{ activePos + 1 }}) pasa a la posición
        <b class="text-emerald-600 dark:text-emerald-400">{{
          dest[activePos]! + 1
        }}</b
        >.
      </p>
      <p v-else class="mt-2 text-center text-sm text-slate-400">
        Pasa el cursor sobre una letra de arriba para resaltar su recorrido.
      </p>

      <h4 class="mb-2 mt-5 text-sm font-semibold text-slate-500">
        Todos los bloques
      </h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(b, i) in blocks"
          :key="i"
          class="rounded-xl border-2 px-3 py-2 text-left font-mono text-sm transition hover:-translate-y-0.5"
          :class="
            curBlock === i
              ? 'border-amber-400 ring-4 ring-amber-300/50'
              : 'border-slate-200 dark:border-slate-700'
          "
          @mouseenter="hoverBlock = i"
          @mouseleave="hoverBlock = null"
          @click="pinned = i"
        >
          <span class="font-bold text-sky-600 dark:text-sky-400">{{
            b.input.join('')
          }}</span>
          <span class="mx-1 text-amber-500">→</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">{{
            b.output.join('')
          }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
