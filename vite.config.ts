
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 確保在 GitHub Pages 上的路徑解析正確
  define: {
    // 將 GitHub Actions 中的 Secrets 注入到前端環境。
    // 使用空字串或空物件 JSON 作為回退，避免代碼中出現字面量 undefined 導致解析失敗。
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.FIREBASE_CONFIG': JSON.stringify(process.env.FIREBASE_CONFIG || '{}')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 生產環境優化
    minify: 'terser',
    rollupOptions: {
      output: {
        // 拆分程式碼塊以提升載入效能
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          genai: ['@google/genai']
        }
      }
    }
  }
});
