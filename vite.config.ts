import * as path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: true,
    minify: true,
    target: 'esnext',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION') {
          return
        }
        warn(warning)
      },
      treeshake: true,
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('@pbe/react-yandex-maps') || id.includes('yandex-maps')) return 'maps-vendor'
          if (id.includes('tinymce')) return 'editor-vendor'
          if (id.includes('@react-pdf') || id.includes('react-to-print')) return 'pdf-vendor'
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'charts-vendor'

          return 'vendor'
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: '**/*.svg',
      esbuildOptions: { loader: 'tsx' },
    }),
    // nginx has no brotli module, so precompress with gzip for `gzip_static on`.
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['index.html', 'manifest.webmanifest', 'brand-logo.webp', 'favicon*.png', 'assets/*.{js,css}'],
        globIgnores: ['home.html', '**/*.mp4', 'android-chrome-*.png', 'pwa-icon.png', 'apple-touch-icon.png'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        // `/` is the nginx-served landing page, not the SPA shell.
        navigateFallbackDenylist: [
          /^\/$/,
          /^\/api/,
          /^\/services/,
          /^\/files/,
          /^\/swagger-ui/,
          /^\/v3\/api-docs/,
          /^\/metrics/,
          /^\/home/,
          /^\/robots\.txt$/,
          /^\/sitemap\.xml$/,
        ],
      },
      manifest: {
        name: 'Ekotizim',
        short_name: 'Ekotizim',
        description: 'Ekotizim axborot tizimi',
        theme_color: '#016b7b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/auth/login',
        scope: '/',
        icons: [
          {
            src: '/pwa-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-icon.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src'), buffer: 'buffer' },
  },
  define: {
    global: 'window',
  },
})
