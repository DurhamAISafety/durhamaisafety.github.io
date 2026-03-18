# Project Guidelines

## Project Snapshot
Static site built with Astro 5 and Tailwind CSS v3, deployed to https://durhamaisafety.uk via Netlify. Content is managed via Tina CMS at `/admin/` and stored in YAML/JSON files under `src/content/`.

## Build & Validation
```bash
npm install          # install dependencies
npm run dev          # local dev server
npx astro check      # type-check
npm run build        # production build
npm run preview      # preview production build
```

There is no separate unit/integration test suite configured; use `npx astro check` + `npm run build` as the baseline validation for most code changes.

## Architecture
Content flows: `src/content/*.yml` → `src/data/*.ts` (parsing, typing) → `src/pages/*.astro` / `src/components/*.astro`. Do not read YAML directly from pages or components.

## Content
**Prefer Tina CMS** (`/admin/`) for all content edits — it commits to YAML and triggers deploys automatically. Use direct YAML edits only when changing schema or when explicitly requested.

YAML root wrappers (do not remove):
- `people.yml` → `people:` (members and alumni in one list, split by `type: member` / `type: alumnus`)
- `research.yml` → `papers:`
- `supporters.yml` → `supporters:`
- `get-involved.yml` → `cards:`
- `programmes.yml` → `programmes:`
- `site-config.json` — site title, email, OG image, social links, navigation, footer tagline

Image paths (always use leading `/`):
- People: `/images/people/...`
- Research thumbnails: `/images/research/...`
- Supporter logos: `/images/supporters/...`

## Frontend Conventions
- Navigation is centralised in `src/content/site-config.json`; do not hardcode links in `Header.astro`.
- Dark mode is disabled; do not add dark-mode-dependent behaviour.
- Scroll animations: use `.reveal` with `style="--reveal-delay: Xms"` for stagger.
- External links must have `rel="noopener noreferrer"` and a trailing icon:
  ```html
  <i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>
  ```

## Styling
- Tailwind utilities for layout/spacing; `public/css/styles.css` for reusable component patterns.
- Use CSS variables from `:root` in `public/css/styles.css` for brand colours — no hardcoded hex values.
- Tailwind v4 migration is deferred; keep v3 patterns.

## Pitfalls
- YAML indentation is 2 spaces, never tabs.
- Inline `onerror` image handlers must use `var` (not `const`/`let`) to avoid Astro TS redeclaration errors.
- Keep the `html.js-enabled` contract intact for reveal animations (`Layout.astro` / `main.js`).
- Netlify secrets scan can flag Tina public IDs unless `SECRETS_SCAN_OMIT_KEYS="NEXT_PUBLIC_TINA_CLIENT_ID"` remains set in `netlify.toml`.