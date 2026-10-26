import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/method': {
        target: 'http://192.168.101.175',
        changeOrigin: true,
        secure: false
      },
      '/api/erpnext': {
        target: 'http://192.168.101.175',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/erpnext/, '/api'),
        headers: {
          'Authorization': 'token f8d6e08a0be3b07:e5b48db47aa5e3a'
        }
      }
    }
  }
});
