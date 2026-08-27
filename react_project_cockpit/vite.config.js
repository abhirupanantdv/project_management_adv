import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/erpnext': {
        target: 'http://192.168.101.125:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/erpnext/, '/api'),
        headers: {
          'Authorization': 'token f13b1b924ac9194:fa26ad1326aef0c'
        }
      }
    }
  }
});
