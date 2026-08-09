// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: "https://durhamaisafety.uk/",
  integrations: [sitemap()],
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'static',
});
