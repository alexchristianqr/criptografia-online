import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// base relativo: funciona en GitHub Pages (https://usuario.github.io/repo/) sin importar el nombre del repo
export default defineConfig({
  base: './',
  plugins: [vue(), tailwindcss()],
})
