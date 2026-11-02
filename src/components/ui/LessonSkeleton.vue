<script setup lang="ts"></script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="space-y-4 motion-safe:animate-pulse"
  >
    <span class="sr-only">Cargando lección…</span>
    <div class="h-8 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
    <div class="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
    <div class="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
    <div class="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />
    <div class="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
  </div>
</template>
