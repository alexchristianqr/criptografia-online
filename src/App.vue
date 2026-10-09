<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import { modules } from './courses'
import { useHashRoute } from './composables/useHashRoute'

const { current, go } = useHashRoute(modules[0]!.id)
const active = computed(() => modules.find((m) => m.id === current.value) ?? modules[0]!)
const menuOpen = ref(false)
watch(current, () => (menuOpen.value = false))
</script>

<template>
  <div class="flex min-h-screen">
    <AppSidebar :modules="modules" :current="active.id" :open="menuOpen" @select="go" @close="menuOpen = false" />

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <button class="rounded-md p-1.5 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" aria-label="Abrir menú" @click="menuOpen = true">☰</button>
        <div>
          <p class="text-xs font-medium uppercase tracking-wide text-brand-600 dark:text-brand-500">Curso · Criptografía clásica</p>
          <h1 class="text-lg font-semibold leading-tight">{{ active.title }}</h1>
        </div>
      </header>

      <main class="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
        <component :is="active.component" v-if="active.component" />
        <div v-else class="grid place-items-center rounded-2xl border border-dashed border-slate-300 p-16 text-center dark:border-slate-700">
          <div>
            <p class="text-4xl">🚧</p>
            <h2 class="mt-2 text-xl font-semibold">{{ active.title }} — próximamente</h2>
            <p class="text-slate-500">{{ active.subtitle }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
