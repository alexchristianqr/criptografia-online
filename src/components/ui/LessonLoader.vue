<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch, type Component } from 'vue';
import LessonSkeleton from './LessonSkeleton.vue';
import LessonError from './LessonError.vue';

const props = defineProps<{ load: () => Promise<{ default: Component }> }>();
const emit = defineEmits<{ loading: [value: boolean]; ready: [] }>();

const DELAY_MS = 150;
const TIMEOUT_MS = 15000;

const comp = shallowRef<Component | null>(null);
const status = shallowRef<'idle' | 'loading' | 'ready' | 'error'>('idle');
const showSkeleton = shallowRef(false);
const timedOut = shallowRef(false);

let token = 0;
let delayTimer: ReturnType<typeof setTimeout> | undefined;
let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
const clear = () => {
  clearTimeout(delayTimer);
  clearTimeout(timeoutTimer);
};

function start() {
  const mine = ++token;
  clear();
  comp.value = null;
  status.value = 'loading';
  showSkeleton.value = false;
  timedOut.value = false;
  emit('loading', true);
  delayTimer = setTimeout(() => (showSkeleton.value = true), DELAY_MS); // CA-1: sin parpadeo si carga rápido
  timeoutTimer = setTimeout(() => {
    if (mine !== token) return;
    timedOut.value = true;
    fail();
  }, TIMEOUT_MS);

  props
    .load()
    .then((m) => {
      if (mine !== token || status.value === 'error') return;
      clear();
      comp.value = m.default;
      status.value = 'ready';
      emit('loading', false);
      emit('ready');
    })
    .catch(() => {
      if (mine === token) fail();
    });
}

function fail() {
  clear();
  status.value = 'error';
  emit('loading', false);
}

watch(() => props.load, start, { immediate: true });
onBeforeUnmount(() => {
  token++;
  clear();
  emit('loading', false);
});
</script>

<template>
  <component :is="comp" v-if="status === 'ready' && comp" />
  <LessonError
    v-else-if="status === 'error'"
    :timeout="timedOut"
    @retry="start"
  />
  <LessonSkeleton v-else-if="showSkeleton" />
</template>
