import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
        if (id.includes('node_modules/@ckeditor')) {
          return 'vendor-ckeditor';
        }
        if (id.includes('node_modules/react') || 
            id.includes('node_modules/react-dom')) {
          return 'vendor-react';
        }
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      }
    }
  }},
  server: {
    port: 3000,
    allowedHosts: [
      'localhost',
      'distinguished-venezuela-household-rangers.trycloudflare.com', //cloudflare 임시테스트
      // 다른 허용할 호스트들...
    ]
  }
}); 