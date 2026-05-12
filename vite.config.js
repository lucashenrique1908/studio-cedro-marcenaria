import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/studioMarcenaria/',
  plugins: [react()],
  define: {
    'process.env': {},
    VITE_BASE_URL: JSON.stringify(command === 'serve' ? '/' : '/studioMarcenaria/'),
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  // Substituição do placeholder no index.html
  transformIndexHtml: {
    enforce: 'pre',
    transform(html) {
      const base = command === 'serve' ? '/' : '/studioMarcenaria/';
      return html.replace(/%VITE_BASE_URL%/g, base);
    },
  },
}));
