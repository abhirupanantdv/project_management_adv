import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/erpnext': {
        target: 'http://192.168.101.175',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/erpnext/, '/api'),
        headers: {
          'Authorization': 'token ccea7f132f74703:73677ab6bce0827'
        }
      }
    }
  }
});
