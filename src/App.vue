<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import ThemeToggle from './components/ui/ThemeToggle.vue';
import LessonLoader from './components/ui/LessonLoader.vue';
import RouteProgress from './components/ui/RouteProgress.vue';
import NotFound from './components/ui/NotFound.vue';
import AppSidebar from './components/layout/AppSidebar.vue';
import LessonPager from './components/layout/LessonPager.vue';
import { modules } from './courses';
import { useHashRoute } from './composables/useHashRoute';
import { useProgress } from './composables/useProgress';
import { neighbors, resolveRoute } from './lib/navigation';

const BASE_TITLE = 'Criptografía Online';
const { hash } = useHashRoute();
const { markVisited } = useProgress();

const route = computed(() =>
  resolveRoute(
    modules.map((m) => m.id),
    hash.value,
    modules[0]!.id,
  ),
);
const active = computed(() =>
  route.value.kind === 'ok'
    ? modules.find((m) => m.id === route.value.id)!
    : null,
);
const pager = computed(() =>
  active.value
    ? neighbors(
        modules.map((m) => ({ ...m, available: !!m.load })),
        active.value.id,
      )
    : { prev: null, next: null },
);

const menuOpen = ref(false);
const menuButton = ref<HTMLButtonElement>();
const heading = ref<HTMLElement>();
const loading = ref(false);
const announce = ref('');
let first = true;

function closeMenu() {
  if (!menuOpen.value) return;
  menuOpen.value = false;
  menuButton.value?.focus(); // CA-8
}

// CA-6: título, scroll arriba y foco al <h1> tras navegar (no en la primera carga)
watch(
  route,
  async (r) => {
    menuOpen.value = false;
    const title = active.value?.title ?? 'No encontrada';
    document.title = `${title} · ${BASE_TITLE}`;
    if (active.value?.load) markVisited(active.value.id);
    if (first) return void (first = false);
    announce.value = `Lección: ${title}`;
    window.scrollTo({ top: 0 });
    await nextTick();
    heading.value?.focus({ preventScroll: true });
  },
  { immediate: true },
);
</script>

<template>
  <a
    href="#contenido"
    class="sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    @click.prevent="heading?.focus()"
    >Saltar al contenido</a
  >
  <RouteProgress :active="loading" />
  <p class="sr-only" role="status" aria-live="polite">{{ announce }}</p>

  <div class="flex min-h-screen">
    <AppSidebar
      :modules="modules"
      :current="active?.id ?? ''"
      :open="menuOpen"
      @close="closeMenu"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
      >
        <button
          ref="menuButton"
          class="rounded-md p-1.5 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-500 lg:hidden dark:hover:bg-slate-800"
          aria-label="Abrir menú"
          aria-controls="menu-lateral"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          ☰
        </button>
        <div class="flex-1">
          <p
            class="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-indigo-400"
          >
            Curso · Criptografía clásica
          </p>
          <h1
            id="contenido"
            ref="heading"
            tabindex="-1"
            class="text-lg font-semibold leading-tight outline-none"
          >
            {{ active?.title ?? 'Lección no encontrada' }}
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main class="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
        <Transition name="lesson" mode="out-in">
          <div :key="active?.id ?? 'notfound'">
            <NotFound
              v-if="!active"
              :raw="route.kind === 'notfound' ? route.raw : ''"
            />
            <LessonLoader
              v-else-if="active.load"
              :load="active.load"
              @loading="loading = $event"
            />
            <div
              v-else
              class="grid place-items-center rounded-2xl border border-dashed border-slate-300 p-16 text-center dark:border-slate-700"
            >
              <div>
                <p class="text-4xl" aria-hidden="true">🚧</p>
                <h2 class="mt-2 text-xl font-semibold">
                  {{ active.title }} — próximamente
                </h2>
                <p class="text-slate-600 dark:text-slate-400">{{ active.subtitle }}</p>
              </div>
            </div>
            <LessonPager v-if="active" :prev="pager.prev" :next="pager.next" />
          </div>
        </Transition>
      </main>
    </div>
  </div>
</template>

<style>
.lesson-enter-active,
.lesson-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.lesson-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.lesson-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .lesson-enter-active,
  .lesson-leave-active {
    transition: none;
  }
}
</style>
