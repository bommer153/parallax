import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for Electron
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5177, // Match the port used in main.js for development
  },
})
