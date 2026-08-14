# Future Work

## CSS de-bloat (the one deferred refresh item)

~2000 lines of custom CSS, dominated by `layout.css` (756) and `cards.css` (660),
with ~60 duplicated `.dark` rules. **Do this after the visual revamp in `DESIGN.md`,
not before** — the refresh reveals what's actually used, so collapsing CSS first means
polishing rules you're about to delete.

- Delete redundant `.dark` rules in individual CSS modules where semantic tokens already cover light/dark variants.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind utilities or `@apply` only where it reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so styling no longer depends on broad section context selectors.

## Optional / conditional

- Trim git history (old images are ~half the repo). Needs `git filter-repo` and a force-push — only worth it if repo size becomes a problem.
- Add organiser calendar management to the CMS (Sveltia) only if event/calendar ownership moves into the site.
