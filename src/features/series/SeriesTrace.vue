<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  SeriesMode,
  SeriesStep,
  SeriesSuccess,
} from '../../ciphers/series';
const props = defineProps<{ result: SeriesSuccess; mode: SeriesMode }>();
const selectedGroup = ref(0),
  selectedLetter = ref<number | null>(null);
watch(
  () => props.result,
  () => {
    selectedGroup.value = 0;
    selectedLetter.value = null;
  },
  { flush: 'sync' },
);
const group = computed(() => props.result.groups[selectedGroup.value]);
const plainSteps = computed(() => {
  const ordered = new Array<SeriesStep>(props.result.steps.length);
  for (const step of props.result.steps) ordered[step.plainPosition - 1] = step;
  return ordered;
});
const letter = computed(() =>
  selectedLetter.value === null
    ? undefined
    : props.result.steps[selectedLetter.value - 1],
);
function pick(step: SeriesStep) {
  selectedGroup.value = step.groupIndex;
  selectedLetter.value = step.cipherPosition;
}
function highlight(step: SeriesStep) {
  return selectedLetter.value === step.cipherPosition
    ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-slate-900'
    : step.groupIndex === selectedGroup.value
      ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/20'
      : '';
}
const positions = (values: number[]) =>
  values.length ? values.join(', ') : '∅';
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-slate-600 dark:text-slate-400">
      {{
        mode === 'cifrar'
          ? 'Lee las posiciones de cada serie y concatena sus letras.'
          : 'Separa el criptograma con los tamaños de las series y coloca cada letra en su posición original.'
      }}
      Selecciona una serie o una letra para seguir el recorrido.
    </p>
    <div class="flex flex-wrap gap-2" aria-label="Seleccionar serie">
      <button
        v-for="(g, i) in result.groups"
        :key="i"
        type="button"
        class="lab-block max-w-full text-left"
        :aria-pressed="selectedGroup === i"
        @click="
          selectedGroup = i;
          selectedLetter = null;
        "
      >
        <span class="block font-sans text-xs font-semibold"
          >{{ i + 1 }}. {{ g.label }} · {{ g.positions.length }} letras</span
        ><span
          class="mt-1 block max-w-56 truncate text-emerald-700 dark:text-emerald-300"
          >{{ g.text || '∅ (vacía)' }}</span
        >
      </button>
    </div>
    <div
      v-if="group"
      class="space-y-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm dark:border-indigo-800 dark:bg-indigo-500/10"
      aria-live="polite"
    >
      <h4 class="font-semibold">{{ selectedGroup + 1 }}. {{ group.label }}</h4>
      <dl class="grid gap-2 sm:grid-cols-2">
        <div>
          <dt class="font-medium">Posiciones candidatas</dt>
          <dd class="max-h-24 overflow-y-auto break-words font-mono">
            {{ positions(group.candidates) }}
          </dd>
        </div>
        <div>
          <dt class="font-medium">Ya utilizadas · se omiten</dt>
          <dd class="max-h-24 overflow-y-auto break-words font-mono">
            {{ positions(group.skipped) }}
          </dd>
        </div>
        <div>
          <dt class="font-medium">Posiciones originales efectivas</dt>
          <dd class="max-h-24 overflow-y-auto break-words font-mono">
            {{ positions(group.positions) }}
          </dd>
        </div>
        <div>
          <dt class="font-medium">Segmento del criptograma</dt>
          <dd
            class="max-h-24 overflow-y-auto break-all font-mono text-emerald-700 dark:text-emerald-300"
          >
            {{ group.text || '∅' }}
          </dd>
        </div>
      </dl>
      <p v-if="group.positions.length">
        Ocupa las posiciones
        <b
          >{{ group.cipherStart + 1 }}–{{
            group.cipherStart + group.positions.length
          }}</b
        >
        del criptograma ({{ group.positions.length }} letras).
      </p>
      <p v-else>
        Esta serie no aporta letras y no consume posiciones del criptograma.
      </p>
      <p v-if="group.skipped.length" class="text-xs">
        Las posiciones omitidas ya pertenecen a una serie anterior; así cada
        letra viaja una sola vez.
      </p>
    </div>
    <div v-if="result.steps.length" class="space-y-4">
      <div v-for="row in ['plano', 'cifrado'] as const" :key="row">
        <p
          class="mb-2 text-sm font-semibold"
          :class="
            row === 'plano'
              ? 'text-sky-700 dark:text-sky-300'
              : 'text-emerald-700 dark:text-emerald-300'
          "
        >
          {{
            row === 'plano'
              ? 'Texto plano · posiciones originales'
              : 'Texto cifrado · orden de transmisión'
          }}
          ·
          {{ (row === 'plano') === (mode === 'cifrar') ? 'entrada' : 'salida' }}
        </p>
        <div
          class="flex max-h-56 flex-wrap gap-2 overflow-y-auto p-1"
          :aria-label="
            row === 'plano'
              ? 'Letras del texto plano'
              : 'Letras del texto cifrado'
          "
        >
          <button
            v-for="step in row === 'plano' ? plainSteps : result.steps"
            :key="step.cipherPosition"
            type="button"
            class="lab-block flex min-w-12 flex-col items-center px-2"
            :class="highlight(step)"
            :aria-label="`${step.letter}: posición original ${step.plainPosition}, cifrada ${step.cipherPosition}, serie ${step.groupIndex + 1}`"
            :aria-pressed="selectedLetter === step.cipherPosition"
            @click="pick(step)"
          >
            <span class="text-[10px] text-slate-500">{{
              row === 'plano' ? step.plainPosition : step.cipherPosition
            }}</span
            ><b
              :class="
                row === 'plano'
                  ? 'text-sky-700 dark:text-sky-300'
                  : 'text-emerald-700 dark:text-emerald-300'
              "
              >{{ step.letter }}</b
            >
          </button>
        </div>
      </div>
      <p
        class="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800"
        aria-live="polite"
      >
        <template v-if="letter"
          ><b>{{ letter.letter }}</b
          >: posición original <b>{{ letter.plainPosition }}</b> ↔ posición
          cifrada <b>{{ letter.cipherPosition }}</b> · serie
          {{ letter.groupIndex + 1 }} ({{
            result.groups[letter.groupIndex].label
          }}).</template
        ><template v-else
          >Se resaltan las letras de {{ group.label }}. Toca una letra o usa Tab
          y Enter para ver ambas posiciones.</template
        >
      </p>
    </div>
    <p v-else class="text-sm text-slate-500">
      El mensaje está vacío. Escribe un texto para explorar sus posiciones.
    </p>
  </div>
</template>
