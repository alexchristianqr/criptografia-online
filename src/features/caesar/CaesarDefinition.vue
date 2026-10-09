<script setup lang="ts">
import SectionCard from '../../components/ui/SectionCard.vue'
import { definition } from './content'
</script>

<template>
  <SectionCard title="Definición" badge="1">
    <p>{{ definition.summary }}</p>
    <p><code>{{ definition.encrypt }}</code> &nbsp; <code>{{ definition.decrypt }}</code></p>
    <p class="legend">{{ definition.legend }}</p>
  </SectionCard>
</template>

<style scoped>
.legend { color: var(--muted); font-size: 0.9rem; }
</style>
