import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3001,
    proxy: {
      '/admin_api': {
        target: 'https://gym.tangoplus.co.kr',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})