<script setup lang="ts">
defineProps<{ title: string; badge?: string }>()
</script>

<template>
  <section class="card">
    <h2>
      {{ title }}
      <span v-if="badge" class="badge">{{ badge }}</span>
    </h2>
    <slot />
  </section>
</template>

<style scoped>
.card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
.badge { font-size: 0.7rem; background: var(--accent-soft); color: var(--accent); border-radius: 99px; padding: 2px 10px; vertical-align: middle; margin-left: 8px; }
</style>
