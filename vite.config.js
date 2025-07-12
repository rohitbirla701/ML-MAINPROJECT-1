import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
              host: true,
              port: 5173,
    //     proxy: {
    //   '/api': 'http://localhost:5000', // Proxy API to backend
    // // proxy: {
    // //   '/api': {
    // //     target: 'https://instructor-api-xi.vercel.app',
    // //     changeOrigin: true,
    // //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    },
  
});
