// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',          // relative paths for assets
  plugins: [react()],
  build: {
    outDir: 'dist'     // make sure this matches your vercel.json
  }
})