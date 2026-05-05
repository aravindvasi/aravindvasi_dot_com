import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aravindvasi.com',
  output: 'static',
  vite: {
    optimizeDeps: {
      exclude: ['lenis'],
    },
  },
});
