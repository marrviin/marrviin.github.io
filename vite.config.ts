import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at the root of https://marrviin.github.io
export default defineConfig({
  base: '/',
  plugins: [react()],
})
