<script setup lang="ts">
defineProps<{ title: string; icon?: string; open?: boolean }>()
</script>

<template>
  <details class="group rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" :open="open">
    <summary class="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium select-none [&::-webkit-details-marker]:hidden">
      <span v-if="icon">{{ icon }}</span>
      <span class="flex-1">{{ title }}</span>
      <span class="text-slate-400 transition group-open:rotate-180">⌄</span>
    </summary>
    <div class="space-y-2 border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
      <slot />
    </div>
  </details>
</template>
