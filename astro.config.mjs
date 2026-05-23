// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL,
  integrations: [sitemap(), tina()],
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
});
