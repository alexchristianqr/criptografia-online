<script setup lang="ts">
import { useId } from 'vue';
import SeriesKeyEditor from './SeriesKeyEditor.vue';
import SeriesTrace from './SeriesTrace.vue';
import { useSeries } from './useSeries';
defineProps<{ practice?: boolean }>();
const id = useId();
const {
  text,
  drafts,
  mode,
  normalized,
  result,
  lastValid,
  output,
  copyStatus,
  copy,
  reset,
  swap,
} = useSeries();
</script>

<template>
  <section class="cipher-lab" :aria-labelledby="`${id}-title`">
    <div
      class="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-orange-500 via-rose-600 to-violet-600 px-4 py-4 text-white sm:px-6"
    >
      <div>
        <h2 :id="`${id}-title`" class="text-xl font-semibold">
          {{
            practice
              ? '✍️ Práctica de transposición por series'
              : '🧪 Laboratorio de transposición por series'
          }}
        </h2>
        <p class="mt-1 text-sm text-white/90">
          {{
            practice
              ? 'Cambia el texto y la clave para resolver tu propio ejercicio.'
              : 'Agrupa posiciones del mensaje completo y sigue el viaje de cada letra.'
          }}
        </p>
      </div>
      <div
        class="inline-flex rounded-lg bg-black/20 p-1"
        role="group"
        :aria-label="practice ? 'Modo de la práctica' : 'Modo del laboratorio'"
      >
        <button
          v-for="m in ['cifrar', 'descifrar'] as const"
          :key="m"
          type="button"
          class="rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-white"
          :class="
            mode === m ? 'bg-white text-rose-800 shadow' : 'hover:bg-white/10'
          "
          :aria-pressed="mode === m"
          @click="mode = m"
        >
          {{ m === 'cifrar' ? '🔒 Cifrar' : '🔓 Descifrar' }}
        </button>
      </div>
    </div>
    <div class="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
      <div
        class="min-w-0 space-y-4 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-500/10"
      >
        <h3 class="lab-label">
          <span class="lab-number bg-orange-500">1</span> Define el recorrido
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-400">
          Convención del curso: la regla de primos incluye 1 para coincidir con
          los ejercicios del profesor. Matemáticamente, 1 no es primo.
        </p>
        <SeriesKeyEditor
          v-model="drafts"
          :error="!result.ok ? result : undefined"
        />
        <button type="button" class="lab-button" @click="reset">
          ↺ Restaurar ejemplo
        </button>
      </div>
      <div class="min-w-0 space-y-4">
        <label :for="`${id}-input`" class="lab-label"
          ><span class="lab-number bg-sky-500">2</span>
          {{ mode === 'cifrar' ? 'Texto plano' : 'Texto cifrado' }}</label
        >
        <textarea
          :id="`${id}-input`"
          v-model="text"
          rows="4"
          class="lab-field border-sky-300 dark:border-sky-800"
          spellcheck="false"
          :aria-describedby="`${id}-normalized`"
          :aria-invalid="!result.ok"
        />
        <p
          :id="`${id}-normalized`"
          class="text-xs text-slate-600 dark:text-slate-400"
        >
          {{ normalized.length }} letras · Normalizado:
          <span
            class="inline-block max-h-24 w-full overflow-y-auto break-all font-mono"
            >{{ normalized || '∅' }}</span
          >Mayúsculas, sin espacios ni signos; se simplifican vocales acentuadas
          y se conserva Ñ. Las posiciones empiezan en 1. No se añade relleno.
        </p>
        <div v-if="!result.ok" class="lab-error" role="status">
          Último resultado válido; no corresponde a los datos actuales. Corrige
          la clave para volver a calcular.
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <label :for="`${id}-output`" class="lab-label"
            ><span class="lab-number bg-emerald-500">3</span>
            {{
              mode === 'cifrar' ? 'Texto cifrado' : 'Texto recuperado'
            }}</label
          ><button
            type="button"
            class="lab-button"
            :disabled="!output"
            @click="copy"
          >
            📋 Copiar
          </button>
        </div>
        <textarea
          :id="`${id}-output`"
          :value="result.ok ? output : (lastValid?.result.output ?? '')"
          rows="4"
          readonly
          class="lab-field border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-100"
          :aria-label="
            !result.ok
              ? 'Último resultado válido; no corresponde a los datos actuales'
              : undefined
          "
        />
        <p role="status" class="text-sm text-emerald-700 dark:text-emerald-300">
          {{ copyStatus }}
        </p>
        <button
          type="button"
          class="lab-button"
          :disabled="!output"
          @click="swap"
        >
          ⇅ Pasar resultado a entrada y
          {{ mode === 'cifrar' ? 'descifrar' : 'cifrar' }}
        </button>
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Al descifrar se recupera el texto normalizado. Los espacios, signos y
          tildes eliminados no se reconstruyen.
        </p>
      </div>
    </div>
    <div
      v-if="result.ok"
      class="space-y-4 border-t border-slate-200 p-4 sm:p-6 dark:border-slate-800"
    >
      <h3 class="lab-label">
        <span class="lab-number bg-violet-500">4</span>
        {{
          practice
            ? 'Resolución paso a paso'
            : 'Explora las series y sus letras'
        }}
      </h3>
      <ol v-if="practice" class="list-decimal space-y-1 pl-5 text-sm">
        <li>
          Normaliza el mensaje y numera sus
          {{ result.normalized.length }} letras desde 1.
        </li>
        <li>
          Evalúa cada regla sobre las posiciones originales. Omite las ya
          tomadas y añade Restantes al final.
        </li>
        <li>
          {{
            mode === 'cifrar'
              ? 'Lee las letras de las posiciones efectivas y concatena los submensajes.'
              : 'Divide el criptograma según los tamaños efectivos y devuelve cada letra a su posición original.'
          }}
        </li>
        <li>
          Comprueba que la salida conserva {{ result.output.length }} letras,
          sin duplicados de posiciones ni relleno.
        </li>
      </ol>
      <SeriesTrace :result="result" :mode="mode" />
    </div>
  </section>
</template>
