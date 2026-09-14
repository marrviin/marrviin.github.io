import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served at the root of https://marrviin.github.io
export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), react()],
})
