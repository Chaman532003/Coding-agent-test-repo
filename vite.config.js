import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the frontend app. Uses the React plugin and
// proxies /api to a local backend during development.
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000'
    }
  }
})
