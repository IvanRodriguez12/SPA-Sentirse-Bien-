import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 Esto le indica a Vite que los assets se buscan en la misma ruta.
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
})
