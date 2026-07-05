import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    // Configuracion para evitar que se cierre al editar
    hmr: {
      overlay: true,
      timeout: 30000
    },
    watch: {
      usePolling: true,
      interval: 1000
    },
  },
  plugins: [react()],
})
