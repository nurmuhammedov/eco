import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssMinify: true,
    minify: true,
    target: 'esnext',
    rollupOptions: {
      treeshake: true,
      output: { manualChunks: { vendor: ['react', 'react-dom'] } },
    },
  },
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      esbuildOptions: { loader: 'tsx' },
    }),
    compression({
      algorithm: 'brotliCompress', // 🔥 Brotli ni ishlatamiz
      threshold: 1024, // 1KB dan katta fayllarni siqish
      deleteOriginFile: false, // Asl fayllarni o‘chirmaslik
    }),
  ],
  // server: {
  //   host: true,
  //   port: 5173,
  // },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
