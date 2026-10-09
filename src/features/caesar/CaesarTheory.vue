<script setup lang="ts">
import SectionCard from '../../components/ui/SectionCard.vue'
import { theory } from './content'
</script>

<template>
  <SectionCard title="Teoría" badge="2">
    <ul>
      <li v-for="point in theory" :key="point">{{ point }}</li>
    </ul>
  </SectionCard>
</template>

<style scoped>
ul { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
</style>
