import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base relativo: funciona en GitHub Pages (https://usuario.github.io/repo/) sin importar el nombre del repo
export default defineConfig({
  base: './',
  plugins: [vue()],
})
