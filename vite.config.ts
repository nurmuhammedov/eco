import * as path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true,
      output: { manualChunks: { vendor: ['react', 'react-dom'] } },
    },
  },
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      esbuildOptions: {
        loader: 'tsx',
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
