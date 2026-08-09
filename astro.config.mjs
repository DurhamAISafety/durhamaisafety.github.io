// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Pure static site (no adapter needed); Netlify serves the built `dist/` directly.
export default defineConfig({
  site: "https://durhamaisafety.uk/",
  redirects: {
    '/events': '/#events',
    '/what-is-ai-safety': '/#what-is-ai-safety',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
