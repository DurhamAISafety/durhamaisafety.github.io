# Copilot Instructions: Durham AI Safety Initiative Website

## Project Overview
Static website built with **Astro 5**, **Tailwind CSS v3**, deployed to **GitHub Pages**. Content lives in YAML files — no CMS involved.

## Architecture: YAML → TypeScript → Astro

1. **Content layer** (`src/content/*.yml`): source of truth for team, alumni, research, supporters
2. **Data layer** (`src/data/*.ts`): parse YAML with the `yaml` package, define TypeScript interfaces, resolve asset filenames → `ImageMetadata` via `import.meta.glob()`
3. **Component layer** (`src/pages/*.astro`, `src/components/*.astro`): consume typed data — no raw YAML access here

**Adding a team member** requires only two steps — no code changes needed:
1. Drop photo in `src/assets/team/`
2. Add entry to `src/content/team.yml`

`src/data/team.ts` resolves filenames automatically via `import.meta.glob('../assets/team/*.{jpeg,jpg,png,webp,gif}', { eager: true })`. Alumni photos share the same folder.

When adding a **new asset type**, update the glob pattern in the relevant `src/data/*.ts` file and add the filename → `ImageMetadata` mapping.

## Styling Architecture

Two parallel systems work together — don't conflate them:

- **Tailwind utilities** (in `.astro` files): layout, spacing, responsive breakpoints
- **`public/css/styles.css`**: component-level CSS classes for reusable patterns

### Key CSS classes (defined in `styles.css`)
| Class | Purpose |
|---|---|
| `.section-neutral` | Off-white (`#f8fafc`) section background; adapts card/text colours |
| `.section-light` | Lavender-tinted (`#f5f3ff`) alternate section background |
| `.section-heading` | IBM Plex Sans 600, tight tracking — for h2/h3 at ≥28 px only |
| `.btn-cta` | durham-purple pill button with hover scale — use for all primary CTAs |
| `.reveal` | Scroll-triggered fade-up entrance animation (observer in `public/js/main.js`) |
| `.hero-heading` / `.hero-subheading` | Text-shadow utilities for hero text overlaid on images |

Pages alternate `.section-neutral` / `.section-light` to create visual rhythm. Add `.reveal` to section headings and cards for entrance animations; stagger with inline `style="animation-delay: Xms"`.

### Typography
Single font family throughout: **IBM Plex Sans** (loaded via Google Fonts in `src/layouts/Layout.astro`).
- Body: IBM Plex Sans 400 (`font-body` Tailwind alias, set on `<body>`)
- Section headings: IBM Plex Sans 600 via `.section-heading`
- No serif fonts — DM Serif Display was removed.

### Brand Colors (`tailwind.config.mjs`)
- `durham-purple` (#68246D) — primary
- `bright-purple` (#EB80FD) — accents
- `light-purple` (#E2ACFE) — lighter accent
- Legacy ocean/teal/navy classes exist but prefer purple variants for new work.

### CSS Custom Properties
`styles.css` defines `--color-*`, `--gradient-*`, `--text-*`, `--bg-*` variables in `:root`. Prefer these over hardcoded hex values in new CSS rules.

## Dark Mode
**Disabled.** `Layout.astro` always removes the `dark` class on load. Toggle buttons are hidden with `display:none`. All `.dark { … }` rules in `styles.css` are preserved as reference for a future re-enable (planned for Tailwind v4 migration). Do not add new dark-mode-dependent code.

## Navigation
Centralised in `src/data/config.ts` under `siteConfig.navigation`. The Header component reads from this — **never hardcode nav links in `Header.astro`**.

## Development Workflow
```
npm run dev      # http://localhost:4321
npx astro check  # run after every change — catches type errors in .astro files
npm run build    # run after every change and before pushing — catches build errors
```
After making any change to the codebase, always run `npx astro check` and then `npm run build` to verify there are no type errors or build failures before considering the task complete.

Push to `main` → GitHub Actions deploys to GitHub Pages automatically.

## Common Tasks

**Add team member:** photo → `src/assets/team/`, entry → `src/content/team.yml`

**Add research paper:** entry at **top** of `src/content/research.yml` (sorted newest-first by `year` then `month`). Required fields: `title`, `url`, `authors`, `year`, `venue`, `tags`, `type`. Mark DAISI members with `team: true` in the authors array.

**Add new page:** create `src/pages/pagename.astro` — Astro file-based routing gives `/pagename/` automatically. Pass `title`, `description`, `heroImage` props to `Layout`.

**Update config (email, social links):** edit `src/data/config.ts`.

## Gotchas
- YAML: 2-space indent, no tabs. Arrays use `-` prefix.
- `public/` images: reference with leading `/` (e.g. `/images/logo.png`)
- `src/assets/` images: must go through `import.meta.glob()` or a direct `import`
- `alum.yml` may be empty — `src/data/alum.ts` guards with `(rawAlum || [])`
- Tailwind v4 migration is deferred (see `TODO.md`); stay on v3 patterns for now
