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
      registerType: 'prompt',
      injectRegister: null,
      workbox: {
        // Only the shell is precached; hashed chunks are cached on demand instead
        // of pushing several megabytes at every first visit.
        globPatterns: ['index.html', 'manifest.webmanifest', 'brand-logo.webp', 'favicon*.png'],
        globIgnores: ['home.html', '**/*.mp4', 'android-chrome-*.png', 'apple-touch-icon.png'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        // Workbox defaults this to 'index.html', which makes the precache answer `/`
        // with the SPA shell. `/` is the nginx-served landing page, so that alias has
        // to be off; navigateFallbackDenylist cannot help because the precache route
        // matches before the navigation route ever runs.
        directoryIndex: null,
        runtimeCaching: [
          {
            // Asset names carry a content hash, so a cache hit can never be stale.
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/assets/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ekotizim-assets',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
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
        name: 'Sanoat xavfsizligi ekotizimi',
        short_name: 'Ekotizim',
        description: 'Xavfli ishlab chiqarish obyektlarini ro‘yxatga olish va nazorat qilish axborot tizimi',
        lang: 'uz',
        dir: 'ltr',
        theme_color: '#016b7b',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/auth/login',
        scope: '/',
        // Sizes must match the real files; a mismatch makes the browser reject the icon.
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      // The dev service worker only gets in the way of hot reloads.
      devOptions: {
        enabled: false,
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
