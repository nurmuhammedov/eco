import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: true,
      output: { manualChunks: { vendor: ['react', 'react-dom'] } },
    },
  },
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
