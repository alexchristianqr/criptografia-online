import { computed, ref, shallowRef, watch } from 'vue';
import {
  normalizeSeries,
  parseSeriesDrafts,
  transformSeries,
  type SeriesMode,
  type SeriesSuccess,
  type SeriesRule,
} from '../../ciphers/series';
import { useCopyResult } from '../../composables/useCopyResult';
import { example, exampleDrafts } from './content';

export function useSeries() {
  const text = ref(example.text),
    drafts = ref(exampleDrafts()),
    mode = ref<SeriesMode>('cifrar');
  const normalized = computed(() => normalizeSeries(text.value));
  const parsed = computed(() =>
    parseSeriesDrafts(drafts.value, normalized.value.length),
  );
  const result = computed(() =>
    parsed.value.ok
      ? transformSeries(text.value, parsed.value.rules, mode.value)
      : parsed.value,
  );
  const lastValid = shallowRef<{
    result: SeriesSuccess;
    rules: SeriesRule[];
  }>();
  watch(
    result,
    (value) => {
      if (value.ok && parsed.value.ok)
        lastValid.value = { result: value, rules: parsed.value.rules };
    },
    { immediate: true, flush: 'sync' },
  );
  const output = computed(() => (result.value.ok ? result.value.output : ''));
  const { copyStatus, copy } = useCopyResult(output);
  watch(
    [text, drafts, mode],
    () => {
      copyStatus.value = '';
    },
    { deep: true },
  );
  function reset() {
    text.value = example.text;
    drafts.value = exampleDrafts();
    mode.value = 'cifrar';
    copyStatus.value = '';
  }
  function swap() {
    if (!output.value) return;
    text.value = output.value;
    mode.value = mode.value === 'cifrar' ? 'descifrar' : 'cifrar';
  }
  return {
    text,
    drafts,
    mode,
    normalized,
    result,
    lastValid,
    output,
    copyStatus,
    copy,
    reset,
    swap,
  };
}
