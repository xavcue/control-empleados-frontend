import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',         // Simula el DOM de un navegador
    setupFiles: './src/setupTests.js', // Ejecuta este archivo antes de todos los tests
    globals: true                 // Permite usar 'expect', 'describe', etc. globalmente
  }
})