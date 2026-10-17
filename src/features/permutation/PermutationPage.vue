<script setup lang="ts">
import { computed } from 'vue'
import Collapsible from '../../components/ui/Collapsible.vue'
import PermutationPlayground from './PermutationPlayground.vue'
import { permuteBlocks } from '../../ciphers/permutation'
import { definition, theory, practice } from './content'

const blocks = computed(() => permuteBlocks(practice.text, practice.key))
const result = computed(() => blocks.value.map((b) => b.output.join('')).join(''))
const keyLabel = practice.key.map((k) => k + 1).join(' ')
</script>

<template>
  <div class="space-y-4">
    <PermutationPlayground />
    <div class="space-y-2">
      <p class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Material de apoyo</p>
      <Collapsible title="Definición" icon="📖">
        <p>{{ definition.summary }}</p>
        <p class="font-mono"><code class="rounded bg-brand-50 px-2 py-0.5 dark:bg-brand-600/20">{{ definition.encrypt }}</code> <code class="rounded bg-brand-50 px-2 py-0.5 dark:bg-brand-600/20">{{ definition.decrypt }}</code></p>
        <p class="text-xs text-slate-500">{{ definition.legend }}</p>
      </Collapsible>
      <Collapsible title="Teoría en puntos" icon="📌">
        <ul class="list-disc space-y-1 pl-5">
          <li v-for="point in theory" :key="point">{{ point }}</li>
        </ul>
      </Collapsible>
      <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
        <p>Cifrar <code class="font-mono font-semibold">{{ practice.text }}</code> con bloques de 4 y clave <code class="font-mono font-semibold">{{ keyLabel }}</code>.</p>
        <ol class="list-decimal space-y-1 pl-5">
          <li v-for="s in practice.steps" :key="s">{{ s }}</li>
        </ol>
        <div class="overflow-x-auto">
          <table class="w-full text-center font-mono text-sm">
            <thead class="text-slate-500"><tr><th class="p-1">Bloque</th><th>Entrada</th><th>Salida</th></tr></thead>
            <tbody>
              <tr v-for="(b, i) in blocks" :key="i" class="border-t border-slate-100 dark:border-slate-800">
                <td class="p-1">{{ i + 1 }}</td>
                <td class="text-sky-600 dark:text-sky-400">{{ b.input.join(' ') }}</td>
                <td class="font-bold text-emerald-600 dark:text-emerald-400">{{ b.output.join(' ') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="font-mono">{{ practice.text }} → <strong>{{ result }}</strong></p>
      </Collapsible>
    </div>
  </div>
</template>
