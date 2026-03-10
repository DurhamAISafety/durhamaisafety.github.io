# Copilot Instructions: Durham AI Safety Initiative Website

## Project Overview
Static website built with **Astro 5**, **Tailwind CSS v3**, deployed to **[durhamaisafety.uk](https://durhamaisafety.uk)** via Netlify (primary). Also deployed to GitHub Pages which redirects to the primary domain. Content lives in YAML files and is editable via the browser-based CMS at `/admin/` (Tina CMS).

## Architecture: YAML → TypeScript → Astro

1. **Content layer** (`src/content/*.yml`): source of truth for team, alumni, research, supporters
2. **Data layer** (`src/data/*.ts`): parse YAML with the `yaml` package, define TypeScript interfaces, resolve asset filenames → `ImageMetadata` via `import.meta.glob()`
3. **Component layer** (`src/pages/*.astro`, `src/components/*.astro`): consume typed data — no raw YAML access here

**Adding a team member** requires only two steps — no code changes needed:
1. Drop photo in `src/assets/team/`
2. Add entry to `src/content/people.yml` under `members:`

`src/data/people.ts` resolves filenames automatically via `import.meta.glob('../assets/team/*.{jpeg,jpg,png,webp,gif}', { eager: true })`. Alumni photos share the same folder.

Optional link fields for a team member (all shown as icons): `linkedin`, `durham-staff-link`, `link` (generic). Example:
```yaml
members:
  - name: Alice Smith
    role: Advisor
    photo: alice.jpg
    linkedin: https://www.linkedin.com/in/alice-smith/
    durham-staff-link: https://www.durham.ac.uk/staff/alice-smith/
```

**Supporters logos** are different: they live in `public/images/supporters/` and are referenced with a plain `/images/supporters/logo.svg` path — no `import.meta.glob()` needed.

When adding a **new asset type** that needs Astro image optimisation, update the glob pattern in the relevant `src/data/*.ts` file. For assets that don't need optimisation, use `public/` instead.

## YAML Content Structure

All four content files use a **named wrapper key** at the root rather than a bare array. This is required for the CMS to read and write entries correctly.

| File | Root key(s) | TS loader unwraps via |
|---|---|---|
| `src/content/people.yml` | `people:` | `src/data/people.ts` |
| `src/content/research.yml` | `papers:` | `src/data/research.ts` |
| `src/content/supporters.yml` | `supporters:` | `src/data/supporters.ts` |

When adding entries manually, always nest them under the root key:
```yaml
members:
  - name: Alice Smith
    role: Co-organiser
```
Never write a bare top-level array — the TypeScript loaders and the CMS both expect the named key.

## CMS (Tina)

A Git-backed editor is live at `/admin/`. It reads and writes the YAML content files directly, committing to the repo and triggering a Netlify deploy on save.

- Config: `tina/config.ts` — schema, collections, field definitions
- Generated types: `tina/__generated__/` (gitignored)
- Access: `https://durhamaisafety.uk/admin/` — requires Tina Cloud credentials
- Footer link: the shield icon in the footer bottom row links to `/admin/`
- Env vars: `TINA_CLIENT_ID` and `TINA_TOKEN` (Netlify site settings; locally via `.env`)

To add a new editable collection to the CMS, add a new entry to `schema.collections` in `tina/config.ts` and ensure the corresponding YAML file uses a named root key.

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

Pages alternate `.section-neutral` / `.section-light` to create visual rhythm. Add `.reveal` to section headings and cards for entrance animations; stagger with inline `style="--reveal-delay: Xms"`.

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
npx astro check  # run after every change — catches type errors in .astro files
npm run build    # run after every change and before pushing — catches build errors
```
After making any change to the codebase, always run `npx astro check` and then `npm run build` to verify there are no type errors or build failures before considering the task complete.

After **significant changes** (adding pages, updating navigation, adding/removing links), also run the link checker:
```
lychee --base https://durhamaisafety.uk --max-concurrency 8 --accept 200,201,204,301,302,303,307,308,429 --timeout 20 --max-retries 3 --user-agent "Mozilla/5.0 (compatible; LinkChecker/1.0)" --exclude "http://localhost*" --exclude "https://localhost*" --exclude "http://127.0.0.1*" --exclude "https://example.com*" --exclude "https://twitter.com/*" --exclude "https://x.com/*" --exclude "https://linkedin.com/in/*" --exclude "https://www.linkedin.com/in/*" --exclude "https://scholar.google.com/*" --exclude "https://www.durham.ac.uk/*" --exclude "https://durham.ac.uk/*" --exclude "https://www.durhamsu.com/*" --exclude "https://durhamsu.com/*" --exclude "https://durhamaisafety.uk/404*" --exclude "https://durhamaisafety.uk/_astro/*" --cache --verbose './dist/**/*.html'
```
Note: `lychee` must be installed (`brew install lychee`). Run `npm run build` first to generate `dist/`. 404s for `durhamaisafety.uk/` paths that exist in the PR but not yet on the live site are expected false positives.

## Common Tasks

**Add team member:** photo → `src/assets/team/`, entry → `src/content/people.yml` under `people:` with `type: member` (optional: `start_year`, `linkedin`, `durham-staff-link`, `link`)

**Add alumni:** entry → `src/content/people.yml` under `people:` with `type: alumnus` (optional: `years_active` e.g. `"2023-2024"`, `linkedin`, `durham-staff-link`, `link`)

**Add supporter:** logo → `public/images/supporters/`, entry → `src/content/supporters.yml`

**Add research paper:** entry at **top** of the `papers:` list in `src/content/research.yml` (sorted newest-first by `year` then `month`). Required fields: `title`, `url`, `authors`, `year`, `venue`, `tags`, `type`. Mark DAISI members with `team: true` in the authors array.

**Add new page:** create `src/pages/pagename.astro` — Astro file-based routing gives `/pagename/` automatically. Pass `title`, `description`, `heroImage` props to `Layout`.

**Update config (email, social links):** edit `src/data/config.ts`.

## Code Standards

### Links
- All `target="_blank"` links must use `rel="noopener noreferrer"` — never `rel="noopener"` alone.
- Add a Font Awesome external link icon after the text of every external link: `<i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>`

### CSS
- Never hardcode brand hex values in new CSS rules. Use CSS custom properties from `:root` in `styles.css`: `var(--color-durham-purple)`, `var(--color-bright-purple)`, `var(--color-deep-purple)`, etc.
- Do not introduce new hex values for brand colours — add a CSS variable to `:root` first if one doesn't exist.

### Scroll animations
- Use `.reveal` (not the removed `.animate-on-scroll`) for entrance animations. Stagger with `style="--reveal-delay: Xms"` (not `animation-delay`).
- `.reveal` is hidden only when `html.js-enabled` is present (set in `Layout.astro`). Content is visible by default — keep this progressive-enhancement contract intact.
- `IntersectionObserver` usage in `main.js` already includes a feature-detect fallback. Do not add new `IntersectionObserver` calls without a similar fallback.

### Inline event handlers
- Inline `onerror="..."` attributes on `<img>` tags must use `var` (not `const`/`let`) for any variables — `const`/`let` in sibling handlers share a TypeScript scope and trigger `ts(2451)` redeclaration errors.

## Gotchas
- YAML: 2-space indent, no tabs. Arrays use `-` prefix.
- All four content YAML files use a named root key (`members:`, `alumni:`, `papers:`, `supporters:`) — never a bare top-level array.
- `public/` images: reference with leading `/` (e.g. `/images/logo.png`)
- `src/assets/` images: must go through `import.meta.glob()` or a direct `import`
- `people.yml` uses a single `people:` list; `type: member` entries go to `team`, `type: alumnus` to `alumni` in `src/data/people.ts`
- Tailwind v4 migration is deferred (see `TODO.md`); stay on v3 patterns for now
- Font Awesome 6.7.2 is loaded from cdnjs in `Layout.astro`
