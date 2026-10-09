<script setup lang="ts">
import type { CourseModule } from '../../courses'

defineProps<{ modules: CourseModule[]; current: string; open: boolean }>()
defineEmits<{ select: [id: string]; close: [] }>()
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-20 bg-black/40 lg:hidden" @click="$emit('close')" />
  <aside
    class="fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="border-b border-slate-200 p-5 dark:border-slate-800">
      <p class="text-lg font-bold">🔐 Criptografía Online</p>
      <p class="text-sm text-slate-500">Aprende haciendo</p>
    </div>

    <nav class="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Módulos del curso">
      <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Módulos</p>
      <button
        v-for="(m, i) in modules"
        :key="m.id"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
        :class="m.id === current ? 'bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-100' : 'hover:bg-slate-100 dark:hover:bg-slate-800'"
        :aria-current="m.id === current ? 'page' : undefined"
        @click="$emit('select', m.id)"
      >
        <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-semibold dark:bg-slate-800" :class="m.id === current && 'bg-brand-600! text-white'">{{ i + 1 }}</span>
        <span class="min-w-0">
          <span class="block truncate font-medium">{{ m.title }}</span>
          <span class="block truncate text-xs text-slate-500">{{ m.component ? m.subtitle : 'Próximamente' }}</span>
        </span>
      </button>
    </nav>
  </aside>
</template>
