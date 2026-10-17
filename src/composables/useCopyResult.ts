import { ref, watch, type Ref } from 'vue';

/** Evita confirmar una copia antigua si cambia el resultado mientras espera el portapapeles. */
export function useCopyResult(output: Readonly<Ref<string>>) {
  const copyStatus = ref('');
  let revision = 0;
  watch(
    output,
    () => {
      revision++;
      copyStatus.value = '';
    },
    { flush: 'sync' },
  );
  async function copy() {
    const text = output.value,
      currentRevision = revision;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (currentRevision === revision)
        copyStatus.value = '¡Resultado copiado!';
    } catch {
      if (currentRevision === revision)
        copyStatus.value =
          'No se pudo copiar. Selecciona el resultado y cópialo manualmente.';
    }
  }
  return { copyStatus, copy };
}
