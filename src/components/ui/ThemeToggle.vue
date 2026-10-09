<script setup lang="ts">
import { useTheme, type Theme } from '../../composables/useTheme'

const { theme } = useTheme()
const options: { value: Theme; icon: string; label: string }[] = [
  { value: 'light', icon: '☀️', label: 'Claro' },
  { value: 'system', icon: '💻', label: 'Sistema' },
  { value: 'dark', icon: '🌙', label: 'Oscuro' },
]
</script>

<template>
  <div class="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800" role="radiogroup" aria-label="Tema">
    <button
      v-for="o in options"
      :key="o.value"
      role="radio"
      :aria-checked="theme === o.value"
      :title="o.label"
      :aria-label="o.label"
      class="rounded-md px-2 py-1 text-sm transition"
      :class="theme === o.value ? 'bg-white shadow dark:bg-slate-600' : 'opacity-60 hover:opacity-100'"
      @click="theme = o.value"
    >{{ o.icon }}</button>
  </div>
</template>
