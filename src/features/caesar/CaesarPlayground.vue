<script setup lang="ts">
import { computed, ref } from 'vue'
import AlphabetStrip from '../../components/ui/AlphabetStrip.vue'
import { ALPHABETS } from '../../ciphers/caesar'
import { useCaesar } from './useCaesar'

const { text, shift, mode, alphabetKey, alphabet, output, steps, setShift, swap } = useCaesar()

const signed = computed(() => (mode.value === 'cifrar' ? shift.value : -shift.value))
const flow = computed(() => steps.value.slice(0, 16))
const used = computed(() => [...new Set(steps.value.map((s) => s.from))])

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* portapapeles no disponible */
  }
}

const field =
  'w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-950'
const btn =
  'rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition hover:border-brand-500 dark:border-slate-700'
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 class="text-xl font-semibold">🧪 Laboratorio</h2>
      <div class="flex items-center gap-3">
        <div class="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="group" aria-label="Modo">
          <button
            v-for="m in ['cifrar', 'descifrar'] as const"
            :key="m"
            class="rounded-md px-3 py-1 text-sm font-medium capitalize transition"
            :class="mode === m ? 'bg-brand-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'"
            @click="mode = m"
          >{{ m }}</button>
        </div>
        <select v-model="alphabetKey" class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950" aria-label="Alfabeto">
          <option v-for="(a, key) in ALPHABETS" :key="key" :value="key">{{ a.label }}</option>
        </select>
      </div>
    </div>

    <div class="mb-5 rounded-xl bg-brand-50 p-4 dark:bg-brand-600/10">
      <div class="mb-2 flex items-baseline justify-between">
        <label for="k" class="font-medium">Clave <span class="font-mono">k</span></label>
        <span class="font-mono text-3xl font-bold text-brand-600 dark:text-brand-500">{{ shift }}</span>
      </div>
      <div class="flex items-center gap-3">
        <input id="k" type="range" min="0" :max="alphabet.length - 1" :value="shift" class="flex-1 accent-brand-600" @input="setShift(+($event.target as HTMLInputElement).value)" />
        <button :class="btn" aria-label="Restar 1" @click="setShift(shift - 1)">−</button>
        <button :class="btn" aria-label="Sumar 1" @click="setShift(shift + 1)">+</button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-500">Entrada · {{ mode === 'cifrar' ? 'texto plano' : 'texto cifrado' }}</span>
        <textarea v-model="text" rows="4" spellcheck="false" placeholder="Escribe aquí…" :class="field" />
      </label>
      <button class="self-center rounded-full border border-slate-300 p-2 hover:border-brand-500 md:rotate-0 dark:border-slate-700" title="Usar salida como entrada" aria-label="Usar salida como entrada" @click="swap">⇄</button>
      <label class="block">
        <span class="mb-1 block text-sm font-medium text-slate-500">Salida · {{ mode === 'cifrar' ? 'texto cifrado' : 'texto plano' }}</span>
        <textarea :value="output" rows="4" readonly :class="[field, 'bg-brand-50 font-semibold dark:bg-brand-600/10']" />
      </label>
    </div>
    <div class="mt-2 flex justify-end">
      <button :class="btn" @click="copy">{{ copied ? '¡Copiado! ✓' : 'Copiar salida' }}</button>
    </div>

    <div v-if="flow.length" class="mt-5">
      <h3 class="mb-2 text-sm font-semibold text-slate-500">Letra por letra</h3>
      <div class="flex flex-wrap gap-2">
        <div v-for="(s, i) in flow" :key="i" class="w-12 rounded-lg border border-slate-200 text-center font-mono dark:border-slate-700">
          <div class="py-1">{{ s.from }}</div>
          <div class="text-xs text-slate-400">{{ s.fromIndex }}{{ signed >= 0 ? '+' : '−' }}{{ Math.abs(signed) }}</div>
          <div class="text-xs text-slate-400">↓ {{ s.toIndex }}</div>
          <div class="rounded-b-lg bg-brand-600 py-1 font-bold text-white">{{ s.to }}</div>
        </div>
        <span v-if="steps.length > flow.length" class="self-center text-sm text-slate-400">+{{ steps.length - flow.length }} más…</span>
      </div>
    </div>

    <div class="mt-5">
      <h3 class="mb-2 text-sm font-semibold text-slate-500">Rueda de correspondencia</h3>
      <AlphabetStrip :alphabet="alphabet" :shift="signed" :highlight="used" />
    </div>
  </section>
</template>
