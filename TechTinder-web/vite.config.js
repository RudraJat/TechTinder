import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/upload': 'http://localhost:1111',
      '/get-signature': 'http://localhost:1111',
      '/stats': 'http://localhost:1111',
      '/user': 'http://localhost:1111',
      '/request': 'http://localhost:1111',
      '/chat': 'http://localhost:1111',
      '/socket.io': {
        target: 'http://localhost:1111',
        ws: true,
        changeOrigin: true,
      },
      '/api': 'http://localhost:1111',
      '/razorpay-key': 'http://localhost:1111',
      '/subscription-status': 'http://localhost:1111',
      '/create-order': 'http://localhost:1111',
      '/create-subscription': 'http://localhost:1111',
      '/cancel-subscription': 'http://localhost:1111',
      '/verify-payment': 'http://localhost:1111',
    },
  },
});
