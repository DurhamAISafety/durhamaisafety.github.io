---
description: Standard development workflow for the Durham AI Safety Initiative (DAISI) Astro website
---

# DAISI Website Development Workflow

// turbo-all

## Architecture (read before making changes)

Content lives in YAML → parsed by TypeScript data files → consumed by Astro pages. Never access YAML directly in `.astro` files.

| Layer | Location | Notes |
|---|---|---|
| Content | `src/content/*.yml` | Source of truth (team, alumni, research, supporters) |
| Data | `src/data/*.ts` | Parse YAML, define TS interfaces, resolve images via `import.meta.glob()` |
| Components | `src/pages/*.astro`, `src/components/*.astro` | Consume typed data only |

Photos go in `src/assets/team/` (optimised via Astro) or `public/images/` (no optimisation needed, reference with leading `/`).

Navigation is centralised in `src/data/config.ts` → **never hardcode nav links in `Header.astro`**.

## Code Standards to Follow

### Links
- All `target="_blank"` → must have `rel="noopener noreferrer"` (not `rel="noopener"` alone)
- Add `<i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>` after every external link text

### CSS
- Never hardcode brand hex values — use CSS custom properties: `var(--color-durham-purple)`, `var(--color-bright-purple)`, etc.
- Two parallel systems: Tailwind utilities (layout/spacing) + `public/css/styles.css` (reusable component classes)
- Alternate `.section-neutral` / `.section-light` between sections for visual rhythm
- Use `.reveal` for scroll-triggered entrance animations; stagger with `style="--reveal-delay: Xms"`

### Inline `onerror` handlers on `<img>`
- Use `var` (not `const`/`let`) for any variables inside `onerror=""` attributes — `const`/`let` triggers `ts(2451)` redeclaration errors across sibling handlers

### Dark mode
- **Disabled.** Do not add new dark-mode-dependent code. `Layout.astro` always strips the `dark` class.

### YAML
- 2-space indent, no tabs. Arrays use `-` prefix.

## Development Steps

1. Start the dev server (if not running):
```
npm run dev
```
Server runs at http://localhost:4321

2. Make your changes.

3. After every change, run the type checker:
```
npx astro check
```

4. Then run the production build to catch any build errors:
```
npm run build
```

5. After **significant changes** (new pages, navigation updates, new/removed links), run the link checker:
```
lychee --base https://durhamaisafety.github.io --max-concurrency 8 --accept 200,201,204,301,302,303,307,308,429 --timeout 20 --max-retries 3 --user-agent "Mozilla/5.0 (compatible; LinkChecker/1.0)" --exclude "http://localhost*" --exclude "https://localhost*" --exclude "http://127.0.0.1*" --exclude "https://example.com*" --exclude "https://twitter.com/*" --exclude "https://x.com/*" --exclude "https://linkedin.com/in/*" --exclude "https://www.linkedin.com/in/*" --exclude "https://scholar.google.com/*" --exclude "https://www.durham.ac.uk/*" --exclude "https://durham.ac.uk/*" --exclude "https://www.durhamsu.com/*" --exclude "https://durhamsu.com/*" --exclude "https://durhamaisafety.github.io/404*" --exclude "https://durhamaisafety.github.io/_astro/*" --cache --verbose './dist/**/*.html'
```
Note: requires `lychee` (`brew install lychee`). Run `npm run build` first. 404s for paths that exist in the PR but not yet on the live site are expected false positives.

6. Push to `main` → GitHub Actions deploys to GitHub Pages automatically.

## Common Tasks

**Add team member:** photo → `src/assets/team/`, entry → `src/content/team.yml`
Optional fields: `linkedin`, `durham-staff-link`, `link`, `start_year` (displays as "YYYY–present")

**Add alumni:** entry → `src/content/alum.yml` with `years_active` field (e.g. `"2023–2024"`)

**Add supporter:** logo → `public/images/supporters/`, entry → `src/content/supporters.yml`

**Add research paper:** entry at **top** of `src/content/research.yml` (sorted newest-first by `year` then `month`).
Required fields: `title`, `url`, `authors`, `year`, `venue`, `tags`, `type`. Mark DAISI members with `team: true` in the authors array.

**Add new page:** create `src/pages/pagename.astro` — file-based routing gives `/pagename/` automatically. Pass `title`, `description`, `heroImage` props to `Layout`.

**Update config (email, social links):** edit `src/data/config.ts`.

**Add new optimised asset type:** update the `import.meta.glob()` pattern in the relevant `src/data/*.ts` file.

## Gotchas
- `alum.yml` may be empty — `src/data/alum.ts` already guards with `(rawAlum || [])`. Keep this guard.
- `public/` images: reference with leading `/` (e.g. `/images/logo.png`)
- `src/assets/` images: must go through `import.meta.glob()` or a direct `import`
- Tailwind v4 migration is deferred — stay on v3 patterns for now
