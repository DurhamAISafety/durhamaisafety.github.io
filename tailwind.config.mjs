/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'durham-purple': '#68246D',
        'deep-purple': '#39144F',
        'bright-purple': '#EB80FD',
        'light-purple': '#E2ACFE',
        'lavender': '#B8BBFE',
        'pure-white': '#FFFFFF',
        // Legacy colors for compatibility
        'ocean-blue': '#0891b2',
        'deep-blue': '#0e4a5c',
        'teal': '#14b8a6',
        'emerald': '#10b981',
        'sage': '#84cc16',
        'mint': '#6ee7b7',
        'warm-blue': '#3b82f6',
        'navy': '#1e3a8a'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
