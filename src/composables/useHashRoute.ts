import { onMounted, onUnmounted, ref } from 'vue'

/** Ruta basada en el hash (#/cesar): funciona en GitHub Pages sin configuración de servidor. */
export function useHashRoute(defaultId: string) {
  const read = () => location.hash.replace(/^#\/?/, '') || defaultId
  const current = ref(read())
  const sync = () => (current.value = read())

  onMounted(() => window.addEventListener('hashchange', sync))
  onUnmounted(() => window.removeEventListener('hashchange', sync))

  const go = (id: string) => (location.hash = `/${id}`)
  return { current, go }
}
