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
     --font-display: 'IBM Plex Sans', sans-serif;
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

---

## Replace `styles.css` with Tailwind Utilities

**Status:** Not started — do this during (or after) the Tailwind v4 migration  
**Priority:** Medium

`public/css/styles.css` is ~1,700 lines. Much of it can move into Tailwind utilities, but a full migration requires more than search/replace:

### What can be deleted outright
- All `.dark { … }` rules (~400 lines) — dark mode is disabled; these are dead code. Delete them before doing anything else.

### What converts cleanly to Tailwind
- **Simple component classes** (`.btn-cta`, `.section-heading`, `.gradient-text`, `.hero-heading`, `.reveal`) — replace with `@apply` blocks in a small `src/styles/components.css`, or move the classes inline onto each element.
- **CSS custom properties** (`:root { --color-* … }`) — move a minimal set into `@theme {}` (v4) or keep in a tiny `src/styles/tokens.css`. Most are already duplicated in `tailwind.config.mjs`.
- **Animation keyframes** (`@keyframes fade-up`, `.reveal`) — define via `theme.extend.keyframes` / `theme.extend.animation` in `tailwind.config.mjs` and use `animate-*` utilities, or keep in a tiny CSS file.

### What requires Astro component refactoring (the hard part)
The ~350-line block of `.section-neutral .program-card`, `.section-light .research-card` etc. are CSS context selectors that change card colours based on the parent section's background. To remove these, each card component needs a `variant` prop:

```astro
<!-- Before: CSS context selector does the work -->
<section class="section-neutral">
  <div class="program-card">…</div>
</section>

<!-- After: variant prop drives conditional Tailwind classes -->
<ProgramCard variant="neutral" />
```

This is the biggest chunk of work and should be done page-by-page after the v4 migration is stable.

### Suggested order
1. Delete all `.dark` rules (quick win, ~400 lines gone)
2. Migrate simple component classes to `@apply` or inline utilities
3. Move `:root` tokens to `@theme` (during v4 migration)
4. Refactor card components to accept a `variant` prop, then delete context selectors

---

## CMS (Tina)

- Would be good to put organiser calendar on the admin page somewhere
- visual editor would be great! but hard to link w astro (https://github.com/cassidoo/blahg)