<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  formatKey,
  parseKey,
  type PermutationKey,
} from '../../ciphers/permutation';

const key = defineModel<PermutationKey>({ required: true });

const text = ref(formatKey(key.value));
const error = ref('');

// Si la clave cambia desde fuera (casillas, aleatoria, slider...) se refleja en el texto.
watch(key, (k) => {
  const parsed = parseKey(text.value);
  if (!parsed.ok || formatKey(parsed.key) !== formatKey(k))
    text.value = formatKey(k);
  error.value = '';
});

function onInput() {
  const parsed = parseKey(text.value);
  if (parsed.ok) {
    error.value = '';
    key.value = parsed.key;
  } else error.value = parsed.error;
}
</script>

<template>
  <label class="block">
    <span class="mb-1 block font-semibold"
      >Escribe la clave
      <span class="text-sm font-normal text-slate-500"
        >(base 1, separada por espacios o comas)</span
      ></span
    >
    <input
      v-model="text"
      type="text"
      inputmode="numeric"
      spellcheck="false"
      autocomplete="off"
      placeholder="3 1 4 2"
      :aria-invalid="error !== ''"
      class="w-full rounded-xl border-2 bg-white p-2.5 font-mono text-base outline-none transition focus:ring-4 dark:bg-slate-950"
      :class="
        error
          ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-700'
      "
      @input="onInput"
    />
    <span
      v-if="error"
      class="mt-1 block text-sm text-rose-600 dark:text-rose-400"
      role="alert"
      >{{ error }} Se sigue usando la última clave válida.</span
    >
  </label>
</template>
