import { effectScope, nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { useSeries } from './useSeries';
import { example } from './content';

describe('Estado del laboratorio y la práctica de series', () => {
  it('CA-10/11: conserva el último resultado válido y bloquea acciones con una clave inválida', async () => {
    const scope = effectScope();
    try {
      const state = scope.run(() => useSeries())!;
      expect(state.output.value).toBe(example.ciphertext);
      state.drafts.value = [{ kind: 'posiciones', value: '999' }];
      await nextTick();
      expect(state.result.value.ok).toBe(false);
      expect(state.output.value).toBe('');
      expect(state.lastValid.value?.result.output).toBe(example.ciphertext);
      expect(state.lastValid.value?.rules).toEqual([
        { kind: 'primos' },
        { kind: 'pares' },
      ]);
      const text = state.text.value;
      state.swap();
      await state.copy();
      expect(state.text.value).toBe(text);
      expect(state.copyStatus.value).toBe('');
      state.reset();
      await nextTick();
      expect(state.output.value).toBe(example.ciphertext);
      expect(state.mode.value).toBe('cifrar');
    } finally {
      scope.stop();
    }
  });
  it('CA-11: intercambia resultado y modo conservando la clave; las instancias son independientes', async () => {
    const scope = effectScope();
    try {
      const [lab, practice] = scope.run(() => [useSeries(), useSeries()])!;
      lab.swap();
      await nextTick();
      expect(lab.text.value).toBe(example.ciphertext);
      expect(lab.mode.value).toBe('descifrar');
      expect(lab.output.value).toBe('ERRARESHUMANOPERDONARDIVINO');
      lab.drafts.value = [{ kind: 'pares', value: '' }];
      await nextTick();
      expect(practice.mode.value).toBe('cifrar');
      expect(practice.text.value).toBe(example.text);
      expect(practice.output.value).toBe(example.ciphertext);
    } finally {
      scope.stop();
    }
  });
});
