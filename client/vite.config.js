import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: '/index.html' // 👈 Asegúrate de que la ruta es absoluta, no relativa
    }
  },
  server: {
    host: true, // 👈 Esto permite acceder al servidor desde fuera (Railway lo necesita)
    port: 4173  // 👈 Puerto que declaramos en el package.json
  },
  preview: {
    host: true,
    port: 4173
  }
});
