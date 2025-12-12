import * as path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'

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
          if (id.includes('node_modules')) {
            if (id.includes('@pbe/react-yandex-maps') || id.includes('yandex-maps')) {
              return 'maps-vendor'
            }

            if (id.includes('tinymce') || id.includes('@tinymce')) {
              return 'editor-vendor'
            }

            return 'vendor'
          }
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
    compression({
      algorithm: 'brotliCompress',
      threshold: 1024,
      deleteOriginFile: false,
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
