# CLAUDE.md — AI Assistant Guide

> Comprehensive reference for AI assistants (Claude Code, Copilot, etc.) working in this repository.

## Project Overview

Static website for **Durham AI Safety** (DAISI), deployed to [durhamaisafety.uk](https://durhamaisafety.uk) via Netlify. Built with Astro 5 (SSG), Tailwind CSS v3, and Tina CMS for content editing.

---

## Quick Reference

### Build & Validation Commands

```bash
npm install           # Install dependencies
npm run dev           # Local dev server + Tina CMS at /admin/
npx astro check       # TypeScript type-check (run before committing)
npm run build         # Production build: tinacms build && astro build
npm run preview       # Preview production build locally
```

There is **no separate unit/integration test suite**. Use `npx astro check` + `npm run build` as baseline validation for all code changes.

### Development Branch

Always develop on `claude/add-claude-documentation-FOkJC` and push via:
```bash
git push -u origin <branch-name>
```

---

## Repository Structure

```
durhamaisafety.github.io/
├── src/
│   ├── assets/               # Build-time optimised images (hero, etc.)
│   ├── components/           # Astro components (PascalCase)
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── IconCard.astro
│   │   ├── ResearchCard.astro
│   │   └── ResearchCarousel.astro
│   ├── content/              # YAML/JSON content files (Tina CMS edits these)
│   │   ├── site-config.json  # Site title, email, nav, social links, OG image
│   │   ├── people.yml        # Team members and alumni
│   │   ├── research.yml      # Academic papers
│   │   ├── programmes.yml    # Educational programmes
│   │   ├── get-involved.yml  # CTA cards
│   │   └── supporters.yml    # Supporter logos and links
│   ├── data/                 # TypeScript data loaders (parse and type YAML)
│   │   ├── config.ts
│   │   ├── people.ts
│   │   ├── research.ts
│   │   ├── programmes.ts
│   │   ├── get-involved.ts
│   │   └── supporters.ts
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout (metadata, structured data)
│   ├── pages/                # Route-based pages (kebab-case filenames)
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── research.astro
│   │   ├── programmes.astro
│   │   ├── get-involved.astro
│   │   ├── alumni.astro
│   │   ├── what-is-ai-safety.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css        # Tailwind directives + global utilities (~1,700 lines)
├── public/                   # Static assets served as-is
│   ├── css/styles.css        # Component classes, animations, theming
│   ├── js/main.js            # Scroll animations, dropdowns, form handling
│   └── images/               # People photos, research thumbnails, logos, icons
├── tina/
│   ├── config.ts             # Tina CMS schema (~800 lines)
│   └── tina-lock.json
├── .github/
│   ├── workflows/
│   │   ├── deploy-astro.yml  # GitHub Pages redirect to durhamaisafety.uk
│   │   └── pr-validation.yml # Type-check + build + link validation on PRs
│   └── dependabot.yml        # Weekly npm updates (grouped)
├── astro.config.mjs          # Astro config (site URL, integrations)
├── tailwind.config.mjs       # Tailwind v3 theme (brand colours, fonts)
├── netlify.toml              # Netlify deploy config + secrets scan exclusions
├── .editorconfig             # UTF-8, LF, 2-space indent
├── .env.example              # Tina CMS credentials template
├── README.md                 # Human-readable quick-start guide
├── AGENTS.md                 # AI assistant guidelines (kept for compatibility)
└── TODO.md                   # Deferred work: Tailwind v4 migration, CSS refactoring
```

---

## Architecture

### Data Flow

Content always flows in one direction:

```
src/content/*.yml / *.json
        ↓
src/data/*.ts          (parse YAML, define TypeScript types)
        ↓
src/pages/*.astro      (fetch data, render HTML)
src/components/*.astro (receive data as props)
```

**Never** read YAML/JSON directly from pages or components — always go through `src/data/*.ts`.

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Astro (SSG) | 5.18.0 |
| Styling | Tailwind CSS | 3.4.17 |
| CMS | Tina CMS | 3.6.3 |
| Language | TypeScript | 5.9.3 |
| Icons | Font Awesome | 6.7.2 (CDN) |
| Fonts | IBM Plex Sans, Inter | Google Fonts (CDN) |
| Sitemap | @astrojs/sitemap | 3.7.0 |

**Deployment**: Netlify (primary) + GitHub Pages (redirect only).

---

## Content Collections

### YAML Root Wrappers

Every YAML file has a required root key — do not remove these:

| File | Root key | Notes |
|------|----------|-------|
| `people.yml` | `people:` | Members and alumni in one list |
| `research.yml` | `papers:` | Sorted newest-first |
| `supporters.yml` | `supporters:` | |
| `get-involved.yml` | `cards:` | |
| `programmes.yml` | `programmes:` | |
| `site-config.json` | — | JSON, no wrapper |

### People (`people.yml`)

```yaml
people:
  - name: Firstname Lastname
    type: member          # "member" or "alumnus"
    role: Role Title
    start_year: 2024      # members only
    years_active: "2022–2024"  # alumni only
    photo: /images/people/filename.jpg
    linkedin: https://linkedin.com/in/...    # optional
    durham_staff: https://dur.ac.uk/...      # optional
    website: https://...                     # optional
```

### Research (`research.yml`)

```yaml
papers:
  - title: "Paper Title"
    url: https://arxiv.org/...
    thumbnail: /images/research/filename.png
    authors:
      - name: Author Name
        team: true    # bold in UI if true
    year: 2025
    month: July
    venue: "Conference Name"
    type: "Paper"     # or "Preprint", "Report", etc.
    tags:
      - mechanistic interpretability
```

### Programmes (`programmes.yml`)

Long descriptions support basic Markdown: `**bold**`, `_italic_`, `[link text](url)`.

### Site Config (`site-config.json`)

Controls: site title, description, contact email, OG image, navigation items, social links, footer tagline. Edit here — never hardcode navigation in `Header.astro`.

### Image Paths

Always use leading `/` (absolute public paths):
- People photos: `/images/people/...`
- Research thumbnails: `/images/research/...`
- Supporter logos: `/images/supporters/...`

---

## Frontend Conventions

### Language

**British English** throughout all content and UI text:
- colour, organised, centralised, behaviour, programme, fulfil, etc.

### Navigation

Navigation is managed in `src/content/site-config.json`. The `Header.astro` component reads from there. Do **not** hardcode nav links in `Header.astro`.

### Dark Mode

Dark mode is **disabled**. The CSS classes and variables remain in `styles.css` as reference for a future implementation. Do not add dark-mode-dependent behaviour or toggle logic.

### Scroll Animations

Use the `.reveal` class with a CSS custom property for stagger timing:

```html
<div class="reveal" style="--reveal-delay: 100ms">...</div>
<div class="reveal" style="--reveal-delay: 200ms">...</div>
```

The `html.js-enabled` class on `<html>` gates animations — this is set by `main.js` and consumed by `Layout.astro`. Do not break this contract.

### External Links

All external links must include:
1. `rel="noopener noreferrer"`
2. A trailing Font Awesome icon with `aria-hidden="true"`

```html
<a href="https://..." target="_blank" rel="noopener noreferrer">
  Link text
  <i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>
</a>
```

### Inline Image Error Handlers

In `.astro` files, inline `onerror` handlers must use `var` (not `const` or `let`):

```html
<!-- Correct -->
<img onerror="var el=this; el.src='/images/fallback.jpg'" />

<!-- Wrong — causes Astro TS redeclaration errors -->
<img onerror="const el=this; el.src='/images/fallback.jpg'" />
```

---

## Styling

### Tailwind v3 (Current)

Use Tailwind utilities for layout and spacing. The `tailwind.config.mjs` defines brand colours and fonts — use these token names, not hardcoded hex values:

| Token | Hex | Use |
|-------|-----|-----|
| `durham-purple` | `#68246D` | Primary brand |
| `deep-purple` | `#39144F` | Darkest shade |
| `bright-purple` | `#EB80FD` | Accent |
| `light-purple` | `#E2ACFE` | Light accent |
| `lavender` | `#B8BBFE` | Tertiary |

Fonts: `font-display` / `font-body` → IBM Plex Sans; `font-secondary` → Inter.

### Component CSS (`public/css/styles.css`)

For reusable component patterns that don't map cleanly to Tailwind utilities:
- Use CSS variables from `:root` for brand colours — no hardcoded hex
- Existing component classes: `.btn-cta`, `.section-heading`, `.gradient-text`, `.hero-heading`, `.reveal`

### Do Not

- Hardcode hex colour values — use Tailwind tokens or CSS variables
- Add new CSS to `src/styles/global.css` for component-level patterns (use `styles.css`)
- Upgrade to Tailwind v4 (deferred — see TODO.md)

---

## CI/CD

### PR Validation (`pr-validation.yml`)

All PRs to `main` run:
1. `npm ci` — clean install
2. `npx astro check` — TypeScript type-check
3. `npm run build` — production build
4. **Lychee** link validation — checks all links with exclusions for:
   - Localhost, example.com
   - Twitter/X, LinkedIn personal profiles, Google Scholar
   - Durham University, Durham SU domains
   - Accepts HTTP 200–308, 429 (rate limit)
   - 20s timeout, 3 retries per link

### Deployment (`deploy-astro.yml`)

Pushes to `main` trigger a GitHub Pages redirect page (HTML 301 → durhamaisafety.uk). Actual site builds happen on Netlify automatically.

### Dependabot

Weekly npm updates, grouped into:
- Astro packages (`astro`, `@astrojs/*`)
- Dev dependencies

Tailwind major updates are **ignored** (waiting for v4 migration).

---

## Tina CMS

Tina CMS (`/admin/`) provides a visual editing interface that commits directly to YAML/JSON files and triggers Netlify deploys.

**Prefer Tina CMS** for all content edits when running locally. Use direct YAML edits only for schema changes or when explicitly required.

### Environment Setup

Copy `.env.example` to `.env` and fill in credentials:
```
NEXT_PUBLIC_TINA_CLIENT_ID=...
TINA_TOKEN=...
TINA_BRANCH=main          # optional
```

### Netlify Secrets Scan

`netlify.toml` whitelists Tina's public client ID from Netlify's secret scanner:
```toml
SECRETS_SCAN_OMIT_KEYS = "NEXT_PUBLIC_TINA_CLIENT_ID"
SECRETS_SCAN_OMIT_PATHS = "tina/__generated__/**,tina/generated/**"
```
Do not remove these entries.

---

## Common Pitfalls

| Pitfall | Detail |
|---------|--------|
| YAML indentation | Always 2 spaces, never tabs |
| Missing YAML root key | Each YAML file needs its root wrapper (e.g. `papers:`) |
| Hardcoded nav links | Add navigation only to `site-config.json`, not `Header.astro` |
| Dark mode | Do not add dark-mode logic — it is intentionally disabled |
| `onerror` variables | Use `var` in inline handlers, not `const`/`let` |
| `html.js-enabled` | Do not remove or break this class contract in `Layout.astro`/`main.js` |
| Image paths | Always use leading `/` for paths under `public/` |
| Hex colours | Use Tailwind tokens or CSS variables, not raw hex values |
| British spelling | Use British English in all user-facing text |
| Tailwind v4 | Do not upgrade — deferred, see TODO.md |

---

## Deferred Work (TODO.md)

1. **Tailwind v4 migration** — Replace `@astrojs/tailwind` + `tailwind.config.mjs` with `@tailwindcss/vite` plugin and `@theme {}` CSS block. Blocked on browser compatibility review.
2. **`styles.css` refactoring** — ~1,700 lines; ~400 lines of dead `.dark` rules to delete, remainder to migrate to Tailwind utilities + component `variant` props.
3. **Tina CMS enhancements** — Organiser calendar integration, visual editor exploration.

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Pages | kebab-case | `what-is-ai-safety.astro` |
| Components | PascalCase | `ResearchCard.astro` |
| Data loaders | camelCase | `get-involved.ts` |
| Images | descriptive, kebab-case | `bella-robertson.jpg` |
| YAML content | kebab-case | `get-involved.yml` |
