<script setup lang="ts">
import CaesarPlayground from './CaesarPlayground.vue'
import CaesarDefinition from './CaesarDefinition.vue'
import CaesarTheory from './CaesarTheory.vue'
import CaesarPractice from './CaesarPractice.vue'
</script>

<template>
  <div class="space-y-4">
    <CaesarPlayground />
    <div class="space-y-2">
      <p class="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Material de apoyo</p>
      <CaesarDefinition />
      <CaesarTheory />
      <CaesarPractice />
    </div>
  </div>
</template>
