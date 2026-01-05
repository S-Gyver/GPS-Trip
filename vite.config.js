import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GPS-Trip/',
  plugins: [react()],
  server: {
    proxy: {
      // ให้เรียก /tripsync_api/... บน 5173 แล้ววิ่งไป localhost/tripsync_api/... จริง
      '/tripsync_api': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
