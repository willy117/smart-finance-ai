
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 封裝一個安全獲取環境變數的函式
const getEnvValue = (key: string, defaultValue: string = '') => {
  const value = process.env[key];
  if (!value) return JSON.stringify(defaultValue);
  // 如果是 FIREBASE_CONFIG，我們希望它是字串形式存入，由前端解析
  return JSON.stringify(value);
};

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    // 這裡會將編譯環境的變數替換進前端程式碼中
    'process.env.API_KEY': getEnvValue('API_KEY'),
    'process.env.FIREBASE_CONFIG': getEnvValue('FIREBASE_CONFIG', '{}')
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'recharts'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
