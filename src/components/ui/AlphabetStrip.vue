<script setup lang="ts">
import { computed } from 'vue'
import { mod } from '../../ciphers/caesar'

const props = defineProps<{
  alphabet: string
  shift: number
  /** letra del alfabeto a resaltar (opcional) */
  highlight?: string
}>()

const rows = computed(() => {
  const letters = Array.from(props.alphabet)
  const n = letters.length
  return letters.map((plain, i) => ({ plain, cipher: letters[mod(i + props.shift, n)]! }))
})
</script>

<template>
  <div class="strip" role="table" aria-label="Correspondencia entre alfabeto plano y cifrado">
    <div class="row"><span class="tag">Plano</span><span v-for="r in rows" :key="r.plain" :class="{ on: r.plain === highlight }">{{ r.plain }}</span></div>
    <div class="row"><span class="tag">Cifrado</span><span v-for="r in rows" :key="r.plain" :class="{ on: r.plain === highlight }">{{ r.cipher }}</span></div>
  </div>
</template>

<style scoped>
.strip { overflow-x: auto; font-family: var(--mono); }
.row { display: flex; gap: 2px; margin-bottom: 2px; width: max-content; }
.row span { width: 1.8em; text-align: center; padding: 4px 0; border-radius: 4px; background: var(--bg); }
.row .tag { width: 5em; text-align: left; background: none; color: var(--muted); font-size: 0.8rem; }
.row span.on { background: var(--accent); color: #fff; }
</style>
