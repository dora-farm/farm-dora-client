import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3000,
    allowedHosts: [
      'localhost',
      'distinguished-venezuela-household-rangers.trycloudflare.com', //cloudflare 임시테스트
      // 다른 허용할 호스트들...
    ]
  }
}); 