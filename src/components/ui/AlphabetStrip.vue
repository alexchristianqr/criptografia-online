<script setup lang="ts">
import { computed } from 'vue'
import { mod } from '../../ciphers/caesar'

const props = defineProps<{ alphabet: string; shift: number; highlight?: string[] }>()

const rows = computed(() => {
  const letters = Array.from(props.alphabet)
  const n = letters.length
  return letters.map((plain, i) => ({ plain, cipher: letters[mod(i + props.shift, n)]! }))
})
const isOn = (l: string) => props.highlight?.includes(l)
</script>

<template>
  <div class="overflow-x-auto pb-1 font-mono text-sm" role="table" aria-label="Correspondencia entre alfabeto plano y cifrado">
    <div v-for="(row, key) in { plain: 'Plano', cipher: 'Cifrado' }" :key="key" class="mb-0.5 flex w-max items-center gap-0.5">
      <span class="w-16 text-xs text-slate-500">{{ row }}</span>
      <span
        v-for="r in rows"
        :key="r.plain"
        class="w-7 rounded py-1 text-center"
        :class="isOn(r.plain) ? 'bg-brand-600 font-bold text-white' : key === 'cipher' ? 'bg-brand-50 dark:bg-brand-600/20' : 'bg-slate-100 dark:bg-slate-800'"
      >{{ key === 'plain' ? r.plain : r.cipher }}</span>
    </div>
  </div>
</template>
