# Future Work

## Tailwind CSS v4 Migration

**Status:** Deferred — older browser compatibility concerns  
**Priority:** Medium

### What needs doing

1. **Remove** `@astrojs/tailwind` integration and `tailwind.config.mjs`
2. **Install** `tailwindcss@^4` and `@tailwindcss/vite`
3. **`astro.config.mjs`** — replace the Astro integration with a Vite plugin:
   ```js
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({
     vite: { plugins: [tailwindcss()] },
   });
   ```
4. **`src/styles/global.css`** — replace the three `@tailwind` directives with:
   ```css
   @import "tailwindcss";
   ```
5. **Move theme values** from `tailwind.config.mjs` into a `@theme {}` block in CSS:
   ```css
   @theme {
     --color-durham-purple: #68246D;
     --color-bright-purple: #EB80FD;
     --color-light-purple: #E2ACFE;
     --color-lavender: #B8BBFE;
     --font-display: 'DM Serif Display', serif;
     --font-body: 'IBM Plex Sans', sans-serif;
   }
   ```
6. **Dark mode** — replace `darkMode: 'class'` config with CSS variant:
   ```css
   @variant dark (&:where(.dark, .dark *));
   ```
   Then migrate `.dark .section-neutral ...` rules in `styles.css` to `dark:` utility
   classes in each `.astro` file, page by page.

7. **Test build** — run `npm run build` and fix any renamed utilities (e.g. `shadow-sm` → `shadow-xs`).

### Browser compatibility note
Tailwind v4 uses CSS custom properties and modern CSS features more aggressively.
Check [caniuse.com](https://caniuse.com) for `@property`, `color-mix()`, and cascade layers
before migrating if older browser support is required.
