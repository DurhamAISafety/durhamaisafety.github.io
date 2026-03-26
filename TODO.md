# Future Work

## Replace `styles.css` with Tailwind Utilities

**Status:** In progress — semantic tokens migrated, dead dark rules partially removed
**Priority:** Medium

`public/css/styles.css` is ~1,600 lines. Much of it can move into Tailwind utilities, but a full migration requires more than search/replace.

### What has been done
- Tailwind v4 migration complete: `@astrojs/tailwind` and `tailwind.config.mjs` replaced by `@tailwindcss/vite` plugin; theme values moved to `@theme {}` in `global.css`
- Semantic CSS tokens (`--color-surface`, `--color-body-text`, etc.) introduced — light/dark mode handled automatically via a `.dark {}` override block in `global.css`
- Hardcoded hex colours replaced with semantic tokens in most component rules; corresponding `.dark` overrides removed (~100 lines deleted)
- Element-level margin resets (`h1-h6, p { margin: 0 }`) removed — these were unlayered and silently overrode all Tailwind `mb-*`/`mt-*` utilities (see CLAUDE.md — CSS layer conflict pitfall)

### What can still be deleted
- Remaining `.dark { … }` overrides that duplicate what semantic tokens now handle automatically

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