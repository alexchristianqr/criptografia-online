<script setup lang="ts">
import { computed, ref } from 'vue';
import Collapsible from '../../components/ui/Collapsible.vue';
import PermutationPlayground from './PermutationPlayground.vue';
import { inverse, permuteBlocks } from '../../ciphers/permutation';
import KeyInput from './KeyInput.vue';
import {
  definition,
  theory,
  practice,
  practiceSteps,
  labExample,
} from './content';

const text = ref(practice.text);
const key = ref<number[]>(practice.key);
function load(example: { text: string; key: number[] }) {
  text.value = example.text;
  key.value = [...example.key];
}
const blocks = computed(() => permuteBlocks(text.value, key.value));
const result = computed(() =>
  blocks.value.map((b) => b.output.join('')).join(''),
);
const keyLabel = computed(() => key.value.map((k) => k + 1).join(' '));
const steps = computed(() => practiceSteps(key.value, inverse(key.value)));
</script>

<template>
  <div class="space-y-4">
    <PermutationPlayground />
    <div class="space-y-2">
      <p
        class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
      >
        Material de apoyo
      </p>
      <Collapsible title="Definición" icon="📖">
        <p>{{ definition.summary }}</p>
        <p class="font-mono">
          <code class="rounded bg-brand-50 px-2 py-0.5 dark:bg-brand-600/20">{{
            definition.encrypt
          }}</code>
          <code class="rounded bg-brand-50 px-2 py-0.5 dark:bg-brand-600/20">{{
            definition.decrypt
          }}</code>
        </p>
        <p class="text-xs text-slate-500">{{ definition.legend }}</p>
      </Collapsible>
      <Collapsible title="Teoría en puntos" icon="📌">
        <ul class="list-disc space-y-1 pl-5">
          <li v-for="point in theory" :key="point">{{ point }}</li>
        </ul>
      </Collapsible>
      <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block font-semibold">Texto a cifrar</span>
            <input
              v-model="text"
              type="text"
              spellcheck="false"
              class="w-full rounded-xl border-2 border-sky-300 bg-white p-2.5 font-mono text-base outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 dark:border-sky-800 dark:bg-slate-950"
            />
          </label>
          <KeyInput v-model="key" />
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            class="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            @click="load(practice)"
          >
            ↺ Restaurar ejemplo
          </button>
          <button
            class="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            @click="load(labExample)"
          >
            📚 Ejemplo MANOS · 2 4 5 3 1
          </button>
        </div>
        <p>
          Cifrar <code class="font-mono font-semibold">{{ text }}</code> con
          bloques de {{ key.length }} y clave
          <code class="font-mono font-semibold">{{ keyLabel }}</code
          >.
        </p>
        <ol class="list-decimal space-y-1 pl-5">
          <li v-for="s in steps" :key="s">{{ s }}</li>
        </ol>
        <div class="overflow-x-auto">
          <table class="w-full text-center font-mono text-sm">
            <thead class="text-slate-500">
              <tr>
                <th class="p-1">Bloque</th>
                <th>Entrada</th>
                <th>Salida</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(b, i) in blocks"
                :key="i"
                class="border-t border-slate-100 dark:border-slate-800"
              >
                <td class="p-1">{{ i + 1 }}</td>
                <td class="text-sky-600 dark:text-sky-400">
                  {{ b.input.join(' ') }}
                </td>
                <td class="font-bold text-emerald-600 dark:text-emerald-400">
                  {{ b.output.join(' ') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="font-mono">
          {{ text }} → <strong>{{ result }}</strong>
        </p>
      </Collapsible>
    </div>
  </div>
</template>
