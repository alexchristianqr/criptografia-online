import { onMounted, onUnmounted, ref } from 'vue';

/** Hash crudo (#/cesar) reactivo: funciona en GitHub Pages sin configuración de servidor. */
export function useHashRoute() {
  const hash = ref(location.hash);
  const sync = () => (hash.value = location.hash);

  onMounted(() => window.addEventListener('hashchange', sync));
  onUnmounted(() => window.removeEventListener('hashchange', sync));

  return { hash };
}
