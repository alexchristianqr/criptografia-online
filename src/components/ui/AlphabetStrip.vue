<script setup lang="ts">
import { computed } from 'vue'
import { mod } from '../../ciphers/caesar'

const props = defineProps<{ alphabet: string; shift: number; highlight?: string[]; active?: string | null }>()

const rows = computed(() => {
  const letters = Array.from(props.alphabet)
  const n = letters.length
  return letters.map((plain, i) => ({ plain, cipher: letters[mod(i + props.shift, n)]! }))
})
const isOn = (l: string) => props.highlight?.includes(l)
</script>

<template>
  <div class="overflow-x-auto pb-1 font-mono text-sm" role="table" aria-label="Correspondencia entre alfabeto de entrada y de salida">
    <div v-for="(row, key) in { plain: 'Entrada', cipher: 'Salida' }" :key="key" class="mb-1 flex w-max items-center gap-0.5">
      <span class="w-16 text-xs font-semibold" :class="key === 'plain' ? 'text-sky-600 dark:text-sky-400' : 'text-emerald-600 dark:text-emerald-400'">{{ row }}</span>
      <span
        v-for="r in rows"
        :key="r.plain"
        class="w-7 rounded py-1 text-center transition"
        :class="[
          active === r.plain
            ? 'scale-110 bg-amber-400 font-bold text-white'
            : isOn(r.plain)
              ? key === 'plain' ? 'bg-sky-500 font-bold text-white' : 'bg-emerald-500 font-bold text-white'
              : key === 'plain' ? 'bg-sky-50 text-sky-800 dark:bg-sky-500/10 dark:text-sky-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200',
        ]"
      >{{ key === 'plain' ? r.plain : r.cipher }}</span>
    </div>
  </div>
</template>
