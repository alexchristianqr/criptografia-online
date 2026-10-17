<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Collapsible from '../../components/ui/Collapsible.vue'
import AlphabetStrip from '../../components/ui/AlphabetStrip.vue'
import { ALPHABETS, caesarSteps, mod, parseShift, type AlphabetKey } from '../../ciphers/caesar'
import { practice } from './content'

const text = ref(practice.text)
const kText = ref(String(practice.shift))
const alphabetKey = ref<AlphabetKey>(practice.alphabet)
const alphabet = computed(() => ALPHABETS[alphabetKey.value].letters)
const parsed = computed(() => parseShift(kText.value))
// con k inválido se conserva el último valor válido
const k = ref(practice.shift)
watch(parsed, (p) => { if (p.ok) k.value = p.value }, { immediate: true })
const shiftMod = computed(() => mod(k.value, alphabet.value.length))
const rows = computed(() => caesarSteps(text.value, k.value, alphabet.value))
const restore = () => {
  text.value = practice.text
  kText.value = String(practice.shift)
  alphabetKey.value = practice.alphabet
}
const inputCls = 'w-full rounded-xl border-2 border-sky-300 bg-white p-2.5 font-mono text-base outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 dark:border-sky-800 dark:bg-slate-950'
const result = computed(() => rows.value.map((r) => r.to).join(''))
</script>

<template>
  <Collapsible title="Práctica resuelta paso a paso" icon="✍️">
    <div class="grid gap-3 sm:grid-cols-3">
      <label class="block sm:col-span-1">
        <span class="mb-1 block font-semibold">Texto a cifrar</span>
        <input v-model="text" type="text" spellcheck="false" :class="inputCls" />
      </label>
      <label class="block">
        <span class="mb-1 block font-semibold">Clave <span class="font-mono">k</span></span>
        <input v-model="kText" type="text" inputmode="numeric" autocomplete="off" :aria-invalid="!parsed.ok" :class="inputCls" />
      </label>
      <label class="block">
        <span class="mb-1 block font-semibold">Alfabeto</span>
        <select v-model="alphabetKey" :class="inputCls">
          <option v-for="(a, key) in ALPHABETS" :key="key" :value="key">{{ a.label }}</option>
        </select>
      </label>
    </div>
    <p v-if="!parsed.ok" class="text-sm text-rose-600 dark:text-rose-400" role="alert">{{ parsed.error }} Se sigue usando k = {{ k }}.</p>
    <button class="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" @click="restore">↺ Restaurar ejemplo</button>
    <p>
      Cifrar <code class="font-mono font-semibold">{{ text }}</code> con
      <code class="font-mono font-semibold">k = {{ k }}</code>
      <template v-if="k !== shiftMod"> (equivale a {{ shiftMod }})</template> (n = {{ alphabet.length }}).
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
            <td>{{ r.fromIndex + k }}</td>
            <td>{{ r.toIndex }}</td>
            <td class="font-bold text-brand-600 dark:text-brand-500">{{ r.to }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="font-mono">{{ text }} → <strong>{{ result }}</strong></p>
    <AlphabetStrip :alphabet="alphabet" :shift="shiftMod" :highlight="rows.map((r) => r.from)" />
  </Collapsible>
</template>
