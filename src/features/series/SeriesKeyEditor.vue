<script setup lang="ts">
import { useId } from 'vue';
import {
  MAX_SERIES_RULES,
  type SeriesDraft,
  type SeriesError,
  type SeriesKind,
} from '../../ciphers/series';
const drafts = defineModel<SeriesDraft[]>({ required: true });
defineProps<{ error?: SeriesError }>();
const prefix = useId();
const kinds: { value: SeriesKind; label: string }[] = [
  { value: 'primos', label: 'Primos (incluye 1 · curso)' },
  { value: 'pares', label: 'Números pares' },
  { value: 'impares', label: 'Números impares' },
  { value: 'multiplos', label: 'Múltiplos de k' },
  { value: 'posiciones', label: 'Posiciones explícitas' },
];
function update(index: number, patch: Partial<SeriesDraft>) {
  drafts.value = drafts.value.map((draft, i) =>
    i === index ? { ...draft, ...patch } : draft,
  );
}
function changeKind(index: number, event: Event) {
  const kind = (event.target as HTMLSelectElement).value as SeriesKind;
  update(index, {
    kind,
    value: kind === 'multiplos' ? '3' : kind === 'posiciones' ? '1' : '',
  });
}
function move(index: number, offset: number) {
  const next = [...drafts.value],
    other = index + offset;
  if (other < 0 || other >= next.length) return;
  [next[index], next[other]] = [next[other], next[index]];
  drafts.value = next;
}
</script>

<template>
  <fieldset class="min-w-0 space-y-3" :aria-describedby="`${prefix}-help`">
    <legend class="mb-2 font-semibold">Clave · orden de las series</legend>
    <p
      :id="`${prefix}-help`"
      class="text-xs text-slate-600 dark:text-slate-400"
    >
      La primera regla que toma una posición se queda con ella. Nunca se
      renumeran las posiciones originales.
    </p>
    <div
      v-for="(draft, i) in drafts"
      :key="i"
      class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label :for="`${prefix}-kind-${i}`" class="text-sm font-semibold"
          >Serie {{ i + 1 }}</label
        >
        <div class="flex gap-1">
          <button
            type="button"
            class="lab-button px-2 py-1"
            :disabled="i === 0"
            :aria-label="`Subir serie ${i + 1}`"
            @click="move(i, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            class="lab-button px-2 py-1"
            :disabled="i === drafts.length - 1"
            :aria-label="`Bajar serie ${i + 1}`"
            @click="move(i, 1)"
          >
            ↓
          </button>
          <button
            type="button"
            class="lab-button px-2 py-1"
            :disabled="drafts.length === 1"
            :aria-label="`Eliminar serie ${i + 1}`"
            @click="drafts = drafts.filter((_, j) => j !== i)"
          >
            Eliminar
          </button>
        </div>
      </div>
      <select
        :id="`${prefix}-kind-${i}`"
        :value="draft.kind"
        class="lab-field p-2 text-sm"
        @change="changeKind(i, $event)"
      >
        <option v-for="kind in kinds" :key="kind.value" :value="kind.value">
          {{ kind.label }}
        </option>
      </select>
      <div
        v-if="draft.kind === 'multiplos' || draft.kind === 'posiciones'"
        class="mt-3"
      >
        <label :for="`${prefix}-value-${i}`" class="mb-1 block text-sm">{{
          draft.kind === 'multiplos'
            ? 'Divisor k (entero desde 2)'
            : 'Posiciones desde 1, en el orden de lectura'
        }}</label>
        <input
          :id="`${prefix}-value-${i}`"
          :value="draft.value"
          class="lab-field p-2 text-sm"
          :inputmode="draft.kind === 'multiplos' ? 'numeric' : 'text'"
          :placeholder="draft.kind === 'multiplos' ? '3' : '5, 1, 3'"
          autocomplete="off"
          spellcheck="false"
          :aria-invalid="error?.ruleIndex === i"
          :aria-describedby="
            error?.ruleIndex === i ? `${prefix}-error` : undefined
          "
          @input="
            update(i, { value: ($event.target as HTMLInputElement).value })
          "
        />
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="lab-button"
        :disabled="drafts.length >= MAX_SERIES_RULES"
        @click="drafts = [...drafts, { kind: 'impares', value: '' }]"
      >
        ＋ Añadir serie</button
      ><span class="text-xs text-slate-500"
        >{{ drafts.length }} / {{ MAX_SERIES_RULES }} reglas</span
      >
    </div>
    <p class="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
      <b>Restantes · automático al final.</b> Recoge en orden ascendente las
      posiciones que ninguna regla tomó.
    </p>
    <p v-if="error" :id="`${prefix}-error`" class="lab-error" role="alert">
      {{ error.error }}
    </p>
  </fieldset>
</template>
