import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      'localhost',
      'distinguished-venezuela-household-rangers.trycloudflare.com', //cloudflare 임시테스트
      // 다른 허용할 호스트들...
    ]
  }
}); 