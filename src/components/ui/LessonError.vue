<script setup lang="ts">
defineProps<{ timeout?: boolean }>();
defineEmits<{ retry: [] }>();
</script>

<template>
  <div
    role="alert"
    class="grid place-items-center rounded-2xl border border-rose-300 bg-rose-50 p-10 text-center dark:border-rose-800 dark:bg-rose-500/10"
  >
    <div>
      <p class="text-4xl" aria-hidden="true">📡</p>
      <h2 class="mt-2 text-xl font-semibold">No se pudo cargar la lección</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {{
          timeout
            ? 'La conexión tardó demasiado.'
            : 'Revisa tu conexión e inténtalo de nuevo.'
        }}
      </p>
      <button
        class="mt-4 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        @click="$emit('retry')"
      >
        Reintentar
      </button>
    </div>
  </div>
</template>
