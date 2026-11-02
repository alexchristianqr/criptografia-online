<script setup lang="ts">
import type { CourseModule } from '../../courses';

defineProps<{ prev: CourseModule | null; next: CourseModule | null }>();
const warm = (m: CourseModule) => m.preload?.();
</script>

<template>
  <nav
    v-if="prev || next"
    class="mt-10 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800"
    aria-label="Navegación entre lecciones"
  >
    <a
      v-if="prev"
      :href="`#/${prev.id}`"
      class="pager-link"
      @mouseenter="warm(prev)"
      @focus="warm(prev)"
    >
      <span class="text-xs text-slate-600 dark:text-slate-400">← Anterior</span>
      <span class="font-semibold">{{ prev.title }}</span>
    </a>
    <span v-else class="hidden sm:block" />
    <a
      v-if="next"
      :href="`#/${next.id}`"
      class="pager-link text-right"
      @mouseenter="warm(next)"
      @focus="warm(next)"
    >
      <span class="text-xs text-slate-600 dark:text-slate-400">Siguiente →</span>
      <span class="font-semibold">{{ next.title }}</span>
    </a>
  </nav>
</template>
