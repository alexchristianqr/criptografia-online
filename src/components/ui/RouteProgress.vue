<script setup lang="ts">
defineProps<{ active: boolean }>();
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
    aria-hidden="true"
  >
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="active" class="route-progress h-full bg-brand-500" />
    </Transition>
  </div>
</template>

<style scoped>
.route-progress {
  animation: route-progress 15s cubic-bezier(0.1, 0.6, 0.2, 1) forwards;
}
@keyframes route-progress {
  from {
    width: 0;
  }
  to {
    width: 92%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .route-progress {
    animation: none;
    width: 60%;
  }
}
</style>
