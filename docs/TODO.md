# Future Work

## CSS de-bloat (real refactor, not a quick delete)

~2000 lines of custom CSS, dominated by `layout.css` (756) and `cards.css` (660).

The ~60 `.dark` rules are **not redundant duplicates** — they set hardcoded dark
colours (e.g. `.dark .program-card { background: rgba(0,0,0,0.3) }`) that the token
system in `global.css` does not produce. Deleting them breaks dark mode. Making them
redundant is the actual task:

- Migrate hardcoded `rgba()` light/dark pairs into semantic tokens (a `--surface`-style
  token that flips under `.dark`), *then* delete the now-dead `.dark` overrides. Do this
  per component, verifying light **and** dark in the browser each time.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind
  utilities or `@apply` only where it reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so
  styling no longer depends on broad section-context selectors.

## Optional / conditional

- Add organiser calendar management to the CMS (Sveltia) only if event/calendar ownership moves into the site.

<!-- Not doing: git-history trim. `.git` is ~20M and clones fast; node_modules (gitignored,
     ~1.4G) is what's slow to install, not clone. A history rewrite + force-push would break
     every clone and open CMS PR branch to save ~10M. Not worth it. -->
