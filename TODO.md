# Future Work

## ~~Replace `styles.css` with Tailwind Utilities~~ → Modular CSS Architecture ✅

**Status:** ✅ **COMPLETED** — Modular file split (April 2026)
**Priority:** Medium

~~`public/css/styles.css` is ~1,600 lines.~~ **Problem solved!** The monolithic 1,669-line `styles.css` has been refactored into 8 focused modules.

### What has been done (April 2026)
- ✅ **Modular file split complete** — Approach 1 implemented:
  - `tokens.css` (133 lines) - CSS variables, dark mode, base styles, typography
  - `layout.css` (752 lines) - Header, footer, navigation, hero, sections
  - `cards.css` (611 lines) - Card components and section context selectors
  - `buttons.css` (92 lines) - Button styles and variants
  - `forms.css` (108 lines) - Form input styles
  - `animations.css` (80 lines) - Keyframe animations and scroll reveals
  - `utilities.css` (69 lines) - Icon colors, viewport heights, responsive/print
  - `styles.css` (32 lines) - Main import file with @import statements
- ✅ **Build verified** — `npm run build` passes, all CSS modules load correctly
- ✅ **Zero behavior changes** — Pure file reorganization, no visual regressions
- ✅ **AI-agent friendly** — Each module is 69-752 lines (readable in one context window)
- ✅ **Backup preserved** — Original file saved as `styles.css.backup` (1,669 lines)

### Previous work (2025)
- Tailwind v4 migration complete: `@astrojs/tailwind` and `tailwind.config.mjs` replaced by `@tailwindcss/vite` plugin; theme values moved to `@theme {}` in `global.css`
- Semantic CSS tokens (`--color-surface`, `--color-body-text`, etc.) introduced — light/dark mode handled automatically via a `.dark {}` override block in `global.css`
- Hardcoded hex colours replaced with semantic tokens in most component rules; corresponding `.dark` overrides removed (~100 lines deleted)
- Element-level margin resets (`h1-h6, p { margin: 0 }`) removed — these were unlayered and silently overrode all Tailwind `mb-*`/`mt-*` utilities (see CLAUDE.md — CSS layer conflict pitfall)

### Next phase (optional future work)

Now that CSS is modular and maintainable, **Approach 2 or 3** (Tailwind migration + component extraction) can be done incrementally:

1. **Delete redundant `.dark` rules** in individual modules (quick wins)
2. **Migrate simple classes to Tailwind** (`.btn-cta`, `.section-heading`) — replace with `@apply` or inline utilities
3. **Extract card components** with `variant` props to eliminate CSS context selectors:
   ```astro
   <!-- Before: CSS context selector in cards.css -->
   <section class="section-neutral">
     <div class="program-card">…</div>
   </section>

   <!-- After: variant prop drives conditional Tailwind classes -->
   <ProgramCard variant="neutral" />
   ```
4. Each module can now be refactored independently without affecting others

**Benefit of modular approach:** Cards.css (611 lines) can be tackled separately from buttons.css (92 lines). No need to refactor everything at once.

---

## CMS (Tina)

- Would be good to put organiser calendar on the admin page somewhere
- visual editor would be great! but hard to link w astro (https://github.com/cassidoo/blahg)