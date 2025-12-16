import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GPS-Trip/',   // ✅ ต้องตรงกับชื่อ repo
  plugins: [react()],
})
