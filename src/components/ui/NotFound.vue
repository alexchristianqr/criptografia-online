<script setup lang="ts">
defineProps<{ raw: string }>();
</script>

<template>
  <div
    class="grid place-items-center rounded-2xl border border-dashed border-slate-300 p-16 text-center dark:border-slate-700"
  >
    <div>
      <p class="text-4xl" aria-hidden="true">🧭</p>
      <h2 class="mt-2 text-xl font-semibold">Lección no encontrada</h2>
      <p class="text-slate-600 dark:text-slate-400">No existe «{{ raw }}».</p>
      <a
        href="#/"
        class="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >Ir al inicio</a
      >
    </div>
  </div>
</template>
