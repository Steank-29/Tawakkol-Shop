import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tawakkol Shop',
        short_name: 'Tawakkol',
        start_url: '/login',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: '../tawakkol/src/assets/tawakkol.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '../tawakkol/src/assets/tawakkol.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 // Increase to 4MB
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://tawakkol-shop.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 4000, // Increase warning limit to 4000kb
    rollupOptions: {
      output: {
        // For Rolldown, we need to use a different approach
        // Let's skip manualChunks for now and just increase the limit
      }
    }
  }
})