import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://makostar.github.io/',
  base: '/ss-dating/',
  output: 'static',
  vite: {
    optimizeDeps: {
      exclude: ['@makostar/ss-cursor'],
    },
  },
});