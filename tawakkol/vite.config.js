import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // Add this
      manifest: {
        name: 'Tawakkol Store',
        short_name: 'Tawakkol',
        description: 'Tawakkol store', // Add description
        theme_color: '#d4af37', // Add theme color
        background_color: '#d4af37',
        display: 'standalone',
        start_url: '/', // Changed from '/login' - start_url should be the root
        scope: '/', // Add scope
        icons: [
          {
            src: '../tawakkol/src/assets/tawakkol.png', // Fixed path - should be from public directory
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // Add purpose for better installability
          },
          {
            src: '../tawakkol/src/assets/tawakkol.png', // Fixed path
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Add purpose for better installability
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'], // Add glob patterns
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
        runtimeCaching: [ // Add runtime caching for API calls
          {
            urlPattern: /^https:\/\/tawakkol-shop\.onrender\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      },
      devOptions: {
        enabled: true, // Enable PWA in development
        type: 'module'
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
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'] // Add manual chunks
        }
      }
    }
  }
})