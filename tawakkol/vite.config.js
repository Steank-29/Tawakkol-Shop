import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Remove the '/api' prefix, so all requests are proxied directly
      '/': {
        target: 'https://tawakkol-shop.onrender.com',
        changeOrigin: true,
        secure: false,
        // Optional: rewrite paths if needed, here we keep them as-is
        rewrite: (path) => path
      }
    }
  }
})
