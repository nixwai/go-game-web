import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Unocss()],
  base: './',
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: { emptyOutDir: true, outDir: resolve(import.meta.dirname, '../dist/play') },
});
