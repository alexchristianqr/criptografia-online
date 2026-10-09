<script setup lang="ts">
import Collapsible from '../../components/ui/Collapsible.vue'
import { definition } from './content'
</script>

<template>
  <Collapsible title="Definición" icon="📖">
    <p>{{ definition.summary }}</p>
    <p class="font-mono"><code class="rounded bg-brand-50 px-2 py-0.5 dark:bg-brand-600/20">{{ definition.encrypt }}</code> <code class="rounded bg-brand-50 px-2 py-0.5 dark:bg-brand-600/20">{{ definition.decrypt }}</code></p>
    <p class="text-xs text-slate-500">{{ definition.legend }}</p>
  </Collapsible>
</template>
