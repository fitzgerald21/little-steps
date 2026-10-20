import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://<user>.github.io/little-steps/
export default defineConfig({
  base: '/little-steps/',
  plugins: [react()],
})
