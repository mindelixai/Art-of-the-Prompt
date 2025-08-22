import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: set to your repo name so assets load on GitHub Pages
  base: '/Art-of-the-Prompt/',
})
