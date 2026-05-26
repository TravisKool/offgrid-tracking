import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/offgrid-tracking/',
  publicDir: 'public',
  plugins: [react()]
})
