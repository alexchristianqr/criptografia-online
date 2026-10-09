<script setup lang="ts">
import { computed, ref } from 'vue'
import AlphabetStrip from '../../components/ui/AlphabetStrip.vue'
import CaesarWheel from '../../components/ui/CaesarWheel.vue'
import { ALPHABETS } from '../../ciphers/caesar'
import { useCaesar } from './useCaesar'

const { text, shift, mode, alphabetKey, alphabet, output, steps, setShift, swap } = useCaesar()

const signed = computed(() => (mode.value === 'cifrar' ? shift.value : -shift.value))
const flow = computed(() => steps.value.slice(0, 16))
const used = computed(() => [...new Set(steps.value.map((s) => s.from))])
const hovered = ref<string | null>(null)
const encrypting = computed(() => mode.value === 'cifrar')

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
  'w-full rounded-xl border-2 bg-white p-3 font-mono text-base outline-none transition focus:ring-4 dark:bg-slate-950'
const btn =
  'rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100 active:scale-95 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-amber-900/40'
const badge = 'grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold text-white'
</script>

<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 px-4 py-3 text-white sm:px-6">
      <div>
        <h2 class="text-xl font-semibold">🧪 Laboratorio</h2>
        <p class="text-sm text-white/80">Sigue los 4 pasos: elige, gira la clave, escribe y observa.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <div class="inline-flex rounded-lg bg-black/20 p-1" role="group" aria-label="Modo">
          <button
            v-for="m in ['cifrar', 'descifrar'] as const"
            :key="m"
            class="rounded-md px-3 py-1 text-sm font-medium capitalize transition"
            :class="mode === m ? 'bg-white text-brand-700 shadow' : 'text-white/80 hover:text-white'"
            @click="mode = m"
          >{{ m === 'cifrar' ? '🔒 cifrar' : '🔓 descifrar' }}</button>
        </div>
        <select v-model="alphabetKey" class="rounded-lg border-0 bg-white/90 px-2 py-1.5 text-sm text-slate-800" aria-label="Alfabeto">
          <option v-for="(a, key) in ALPHABETS" :key="key" :value="key">{{ a.label }}</option>
        </select>
      </div>
    </div>

    <div class="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <!-- columna izquierda: pasos -->
      <div class="space-y-5">
        <!-- 1 clave -->
        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-500/10">
          <div class="mb-3 flex items-center gap-3">
            <span :class="[badge, 'bg-amber-500']">1</span>
            <label for="k" class="flex-1 font-semibold">Gira la clave <span class="font-mono">k</span></label>
            <span class="font-mono text-4xl font-black text-amber-500">{{ shift }}</span>
          </div>
          <div class="flex items-center gap-3">
            <button :class="btn" aria-label="Restar 1" @click="setShift(shift - 1)">−</button>
            <input id="k" type="range" min="0" :max="alphabet.length - 1" :value="shift" class="flex-1 accent-amber-500" @input="setShift(+($event.target as HTMLInputElement).value)" />
            <button :class="btn" aria-label="Sumar 1" @click="setShift(shift + 1)">+</button>
          </div>
          <p class="mt-2 text-sm text-amber-800 dark:text-amber-200">
            Cada letra se desplaza <b>{{ shift }}</b> {{ shift === 1 ? 'lugar' : 'lugares' }}
            {{ encrypting ? 'hacia adelante' : 'hacia atrás' }} en el alfabeto.
          </p>
        </div>

        <!-- 2 entrada -->
        <label class="block">
          <span class="mb-1 flex items-center gap-3 font-semibold">
            <span :class="[badge, 'bg-sky-500']">2</span>
            Escribe · {{ encrypting ? 'texto plano' : 'texto cifrado' }}
          </span>
          <textarea v-model="text" rows="3" spellcheck="false" placeholder="Escribe aquí…" :class="[field, 'border-sky-300 focus:border-sky-500 focus:ring-sky-500/20 dark:border-sky-800']" />
        </label>

        <div class="flex items-center justify-center gap-3 text-sm text-slate-500">
          <span class="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />
          <button class="rounded-full border border-violet-300 px-3 py-1 font-medium text-violet-700 transition hover:bg-violet-100 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/40" title="Usar salida como entrada" @click="swap">
            ⇅ {{ encrypting ? 'cifrar' : 'descifrar' }} (k={{ shift }}) · invertir
          </button>
          <span class="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
        </div>

        <!-- 3 salida -->
        <label class="block">
          <span class="mb-1 flex items-center gap-3 font-semibold">
            <span :class="[badge, 'bg-emerald-500']">3</span>
            <span class="flex-1">Resultado · {{ encrypting ? 'texto cifrado' : 'texto plano' }}</span>
            <button type="button" class="rounded-lg border border-emerald-300 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/40" @click.prevent="copy">
              {{ copied ? '¡Copiado! ✓' : '📋 Copiar' }}
            </button>
          </span>
          <textarea :value="output" rows="3" readonly :class="[field, 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100']" />
        </label>
      </div>

      <!-- columna derecha: rueda -->
      <div class="rounded-xl bg-slate-50 p-3 dark:bg-slate-950/50">
        <div class="mb-2 flex items-center gap-3 font-semibold">
          <span :class="[badge, 'bg-violet-500']">4</span> Observa la rueda
        </div>
        <CaesarWheel :alphabet="alphabet" :shift="signed" :highlight="used" :active="hovered" />
        <div class="mt-2 flex justify-center gap-4 text-xs">
          <span class="flex items-center gap-1"><i class="size-3 rounded-full bg-sky-500" /> entrada</span>
          <span class="flex items-center gap-1"><i class="size-3 rounded-full bg-emerald-500" /> salida (anillo que gira)</span>
        </div>
        <p class="mt-2 text-center text-xs text-slate-500">Cada letra del anillo azul se lee en el verde que tiene justo debajo.</p>
      </div>
    </div>

    <!-- proceso -->
    <div class="border-t border-slate-200 p-4 sm:p-6 dark:border-slate-800">
      <div v-if="flow.length" class="mb-6">
        <h3 class="mb-1 font-semibold">🔍 Letra por letra</h3>
        <p class="mb-3 text-sm text-slate-500">
          <span class="font-semibold text-sky-600 dark:text-sky-400">entrada</span> →
          <span class="font-semibold text-amber-600 dark:text-amber-400">posición {{ signed >= 0 ? '+' : '−' }} clave (mod {{ alphabet.length }})</span> →
          <span class="font-semibold text-emerald-600 dark:text-emerald-400">salida</span>. Pasa el cursor sobre una letra para verla en la rueda.
        </p>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(s, i) in flow"
            :key="i"
            class="w-14 cursor-default overflow-hidden rounded-xl border-2 text-center font-mono shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            :class="hovered === s.from ? 'border-amber-400' : 'border-slate-200 dark:border-slate-700'"
            @mouseenter="hovered = s.from"
            @mouseleave="hovered = null"
          >
            <div class="bg-sky-500 py-1 text-lg font-bold text-white">{{ s.from }}</div>
            <div class="bg-sky-50 py-0.5 text-xs text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">pos {{ s.fromIndex }}</div>
            <div class="bg-amber-50 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">{{ signed >= 0 ? '+' : '−' }}{{ Math.abs(signed) }} ↓</div>
            <div class="bg-emerald-50 py-0.5 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">pos {{ s.toIndex }}</div>
            <div class="bg-emerald-500 py-1 text-lg font-bold text-white">{{ s.to }}</div>
          </div>
          <span v-if="steps.length > flow.length" class="self-center text-sm text-slate-400">+{{ steps.length - flow.length }} más…</span>
        </div>
      </div>

      <div>
        <h3 class="mb-1 font-semibold">🔡 Tabla de correspondencia</h3>
        <p class="mb-3 text-sm text-slate-500">Las letras de tu mensaje aparecen resaltadas.</p>
        <AlphabetStrip :alphabet="alphabet" :shift="signed" :highlight="used" :active="hovered" />
      </div>
    </div>
  </section>
</template>
