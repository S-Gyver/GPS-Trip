// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',  // 👈 1. แก้จาก '/GPS-Trip/' เป็น '/'
  plugins: [react()],
  server: {
    proxy: {
      '/tripsync_api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})