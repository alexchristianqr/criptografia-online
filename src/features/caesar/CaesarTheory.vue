<script setup lang="ts">
import Collapsible from '../../components/ui/Collapsible.vue'
import { theory } from './content'
</script>

<template>
  <Collapsible title="Teoría en puntos" icon="📌">
    <ul class="list-disc space-y-1 pl-5">
      <li v-for="point in theory" :key="point">{{ point }}</li>
    </ul>
  </Collapsible>
</template>
