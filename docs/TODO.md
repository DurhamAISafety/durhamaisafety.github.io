# Future Work

## CSS de-bloat (partly done)

Custom CSS down from ~2007 to ~1800 lines. Done (branch `chore/css-dead-code`):

- Added `--surface-glass` / `--surface-elevated` semantic pairs in `global.css` that flip
  under `.dark`; migrated `.card`, `.program/.research/.info-card` and the section-neutral
  elevated cards onto them and deleted the now-redundant `.dark` overrides. Verified light
  **and** dark in-browser on home, get-involved, research, about, what-is-ai-safety.
- Deleted dead code: `.section-alt`/`.section-alt-2`, the empty `hover-bounce` animation,
  and the entire `forms.css` (`.form-input`/`.checkbox-custom` unused in every template).

Remaining (each its own focused effort):

- The rest of the `.dark` rules are genuine **one-offs** (footer, dropdown, mobile-nav,
  header borders, section backgrounds, `.btn-secondary/.btn-cta`, `.learn-more`,
  `.program-badge`) plus page-specific `!important` icon-contrast hacks in `cards.css`.
  These are not repeated pairs — tokenising a value used once adds indirection without
  removing lines, so leave them unless a component is being reworked anyway.
- Extract repeated card patterns into Astro components with explicit `variant` props, so
  styling no longer depends on broad `.section-neutral .program-card`-style context
  selectors. This is the big lever for killing the `!important` icon hacks — but it's a
  component-architecture change across 13 pages, not a CSS edit. Do it deliberately, per
  component, with browser checks.

## Optional / conditional

- Add organiser calendar management to the CMS (Sveltia) only if event/calendar ownership moves into the site.

<!-- Not doing: git-history trim. `.git` is ~20M and clones fast; node_modules (gitignored,
     ~1.4G) is what's slow to install, not clone. A history rewrite + force-push would break
     every clone and open CMS PR branch to save ~10M. Not worth it. -->
