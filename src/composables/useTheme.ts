import { ref, watchEffect } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const KEY = 'theme'
const media = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null

function load(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* almacenamiento no disponible */
  }
  return 'system'
}

const theme = ref<Theme>(load())
const systemDark = ref(media?.matches ?? false)
media?.addEventListener('change', (e) => (systemDark.value = e.matches))

watchEffect(() => {
  const dark = theme.value === 'dark' || (theme.value === 'system' && systemDark.value)
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem(KEY, theme.value)
  } catch {
    /* ignorar */
  }
})

export const useTheme = () => ({ theme })
