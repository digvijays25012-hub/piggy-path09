import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-icon.png'],
      manifest: {
        name: 'Piggypath - Smart Trading',
        short_name: 'Piggypath',
        description: 'Smart and simple mobile-first trading app with a reactive mascot.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
