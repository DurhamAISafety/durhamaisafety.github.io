/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'ocean-blue': '#0891b2',
        'deep-blue': '#0e4a5c',
        'navy': '#1e3a8a',
        'teal': '#14b8a6',
        'emerald': '#10b981',
        'sage': '#84cc16',
        'mint': '#6ee7b7'
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
};
