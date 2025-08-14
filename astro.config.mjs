// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  build: {
    format: 'directory', // This creates clean URLs like /about/ instead of /about.html
  },

  server: {
    port: 4000,
    host: true
  },

  site: 'https://durhamaisafety.netlify.app',

  vite: {
    plugins: [tailwindcss()],
  },
});