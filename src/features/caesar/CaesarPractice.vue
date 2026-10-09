<script setup lang="ts">
import { computed } from 'vue'
import Collapsible from '../../components/ui/Collapsible.vue'
import AlphabetStrip from '../../components/ui/AlphabetStrip.vue'
import { ALPHABETS, caesarSteps } from '../../ciphers/caesar'
import { practice } from './content'

const alphabet = ALPHABETS[practice.alphabet].letters
const rows = computed(() => caesarSteps(practice.text, practice.shift, alphabet))
const result = computed(() => rows.value.map((r) => r.to).join(''))
</script>

<template>
  <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
    <p>
      Cifrar <code class="font-mono font-semibold">{{ practice.text }}</code> con
      <code class="font-mono font-semibold">k = {{ practice.shift }}</code> en español (n = {{ alphabet.length }}).
    </p>
    <ol class="list-decimal space-y-1 pl-5">
      <li v-for="s in practice.steps" :key="s">{{ s }}</li>
    </ol>
    <div class="overflow-x-auto">
      <table class="w-full text-center font-mono text-sm">
        <thead class="text-slate-500">
          <tr><th class="p-1">Letra</th><th>x</th><th>x + k</th><th>mod n</th><th>Resultado</th></tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in rows" :key="i" class="border-t border-slate-100 dark:border-slate-800">
            <td class="p-1">{{ r.from }}</td>
            <td>{{ r.fromIndex }}</td>
            <td>{{ r.fromIndex + practice.shift }}</td>
            <td>{{ r.toIndex }}</td>
            <td class="font-bold text-brand-600 dark:text-brand-500">{{ r.to }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="font-mono">{{ practice.text }} → <strong>{{ result }}</strong></p>
    <AlphabetStrip :alphabet="alphabet" :shift="practice.shift" :highlight="rows.map((r) => r.from)" />
  </Collapsible>
</template>
