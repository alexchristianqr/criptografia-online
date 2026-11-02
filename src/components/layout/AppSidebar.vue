<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue';
import type { CourseModule } from '../../courses';
import { useProgress } from '../../composables/useProgress';

const props = defineProps<{
  modules: CourseModule[];
  current: string;
  open: boolean;
}>();
const emit = defineEmits<{ close: [] }>();

const { isVisited, count } = useProgress();
const total = props.modules.filter((m) => m.load).length;

// CA-8: Esc cierra el menú móvil y el fondo no hace scroll mientras está abierto
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && emit('close');
watch(
  () => props.open,
  (o) => {
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) window.addEventListener('keydown', onKey);
    else window.removeEventListener('keydown', onKey);
  },
);
onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKey);
});
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-20 bg-black/40 lg:hidden"
    aria-hidden="true"
    @click="emit('close')"
  />
  <aside
    id="menu-lateral"
    class="fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform motion-reduce:transition-none lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="border-b border-slate-200 p-5 dark:border-slate-800">
      <a href="#/" class="text-lg font-bold">🔐 Criptografía Online</a>
      <p class="text-sm text-slate-600 dark:text-slate-400">Aprende haciendo</p>
      <div class="mt-3" :title="`${count} de ${total} lecciones visitadas`">
        <div class="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Progreso</span><span>{{ count }}/{{ total }}</span>
        </div>
        <div
          class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="progressbar"
          aria-label="Lecciones visitadas"
          :aria-valuenow="count"
          aria-valuemin="0"
          :aria-valuemax="total"
        >
          <div
            class="h-full rounded-full bg-brand-500 transition-all duration-500 motion-reduce:transition-none"
            :style="{ width: `${total ? (count / total) * 100 : 0}%` }"
          />
        </div>
      </div>
    </div>

    <nav
      class="flex-1 space-y-1 overflow-y-auto p-3"
      aria-label="Módulos del curso"
    >
      <p
        class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
      >
        Módulos
      </p>
      <a
        v-for="(m, i) in modules"
        :key="m.id"
        :href="`#/${m.id}`"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-500"
        :class="
          m.id === current
            ? 'bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-100'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        "
        :aria-current="m.id === current ? 'page' : undefined"
        @mouseenter="m.preload?.()"
        @focus="m.preload?.()"
      >
        <span
          class="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-sm font-semibold dark:bg-slate-800"
          :class="m.id === current && 'bg-brand-600! text-white'"
          >{{ i + 1 }}</span
        >
        <span class="min-w-0 flex-1">
          <span class="block truncate font-medium">{{ m.title }}</span>
          <span class="block truncate text-xs text-slate-600 dark:text-slate-400">{{
            m.load ? m.subtitle : 'Próximamente'
          }}</span>
        </span>
        <span
          v-if="isVisited(m.id)"
          class="text-emerald-700 dark:text-emerald-400"
          title="Visitada"
          ><span aria-hidden="true">✓</span
          ><span class="sr-only">Visitada</span></span
        >
      </a>
    </nav>
  </aside>
</template>
