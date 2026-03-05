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

## Add a CMS

**Status:** Not started  
**Priority:** Low — current YAML workflow is sufficient while the team stays technical

### Options to evaluate
- **[Decap CMS](https://decapcms.org/)** (formerly Netlify CMS) — Git-based, no backend, edits commit directly to the repo. Works well with Astro + GitHub Pages. Config lives in `public/admin/config.yml`.
- **[Keystatic](https://keystatic.com/)** — purpose-built for Astro, stores content in the repo as Markdown/YAML, local UI at `localhost:4321/keystatic`. No external service needed.
- **[Tina CMS](https://tina.io/)** — visual editing with live preview; requires a Tina Cloud account for the hosted UI but content stays in git.

### Recommendation
Keystatic is the lowest-friction option: it reads the existing `src/content/*.yml` files directly and adds a local admin UI with no deployment changes. Decap CMS is a good alternative if an online editing UI (without running dev server) is needed.

### What would need doing (Keystatic example)
1. `npm install @keystatic/core @keystatic/astro`
2. Add `keystatic()` to `astro.config.mjs` integrations
3. Create `keystatic.config.ts` mapping existing YAML collections (`team`, `research`, `supporters`, `alum`) to Keystatic schema
4. Add `src/pages/keystatic/[...params].astro` route for the admin UI
5. Test that existing `src/data/*.ts` imports still work (they should — Keystatic doesn't change file format)

### Further notes
Also we should add the private organiser calendar link embed: <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&showPrint=0&mode=AGENDA&src=dGhlb2ZhcnJlbGwxOEBnbWFpbC5jb20&src=ODk2ZWRjZjRmOWNkNDczMDUyMzJiMmM3OGNjMDZkNGQxMzY1YTE4ZGFiYmFjZTc0OWJkZTIzN2NmZDkyYmVhNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MTk4MTk0MjZmN2I5MDJiNjUyNGViZGM0MGMxMmI2NWZiYzg3ZTRhNTI4NWQ0ZDdlZTAwMjMxZDA5ZGQxMGJlM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZmFtaWx5MDYyNjg5NTYxMDkwNjQ1NDMzOTlAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=OGU2MTBkMzJjNTdiMDViNzcxYmQxNjUxZGM2NjVkMmFlZjMxNjBhMmI0M2I3ZjYzZDVmNGVmZWRkNTliYjFjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OWI2MmM1MTA3NDg4YTMxZTY1MjBlN2I5NzgxYmJjNzAxNzk0YTEzYTljZDhkYTE4YWMxOWY5ZWVlY2QxMGNjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MzJmMzE2MDdlMzc2YjdjNDU0MWYzNjZlNjRmM2I3ODhjMTAxNTg1YmZjZjNlNDQ2YjE4YjM0OTYxZDI1MGFlNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ODAxNWQwMThlM2E4ODcwZWE5ZTQxMjQ1ZTQ5Y2Y5NzBhMWVmMjg3MTgzNDg5YjlkYjEwOTIxYjNjNTFmYzM2YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Z3UwcDA5a3NvOWlkYTVlazIyajNqNGlnODUyZnNpZDZAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=bjJlNjQ4N2lrYTA4b2gwNmxxZ3VjOXRtZGdpMG1mb2NAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=YjdibzBxc2oyN2w3YWhmYXFncWlhdmpvbTlldGc3c2JAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=cmpmYXJyZWxsNkBnb29nbGVtYWlsLmNvbQ&color=%23039be5&color=%238e24aa&color=%23b39ddb&color=%237986cb&color=%23e4c441&color=%23c0ca33&color=%233f51b5&color=%23ef6c00&color=%23009688&color=%233f51b5&color=%23795548&color=%230b8043&color=%23c0ca33" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>

ideally we'd have a few tabs: a CMS to edit all the pages, then another tab to edit the content in src/content, and another to view the calendar