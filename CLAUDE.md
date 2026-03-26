# CLAUDE.md — AI Assistant Guide

> Comprehensive reference for AI assistants (Claude Code, Copilot, etc.) working in this repository.

## Project Overview

Static website for **Durham AI Safety** (DAISI), deployed to [durhamaisafety.uk](https://durhamaisafety.uk) via Netlify. Built with Astro 6 (SSG), Tailwind CSS v4, and Tina CMS for content editing.

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
│       └── global.css        # Tailwind v4 entry: @import, @theme tokens, dark mode overrides
├── public/                   # Static assets served as-is
│   ├── css/styles.css        # Component classes, animations, theming (~1,600 lines)
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
├── astro.config.mjs          # Astro config (site URL, Vite plugins)
├── netlify.toml              # Netlify deploy config + secrets scan exclusions
├── .editorconfig             # UTF-8, LF, 2-space indent
├── .env.example              # Tina CMS credentials template
├── README.md                 # Human-readable quick-start guide
├── AGENTS.md                 # AI assistant guidelines (kept for compatibility)
└── TODO.md                   # Deferred work: styles.css refactoring, Tina CMS enhancements
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
| Framework | Astro (SSG) | 6.0.8 |
| Styling | Tailwind CSS | 4.2.2 |
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

Dark mode is implemented via a `.dark` class on `<html>`, toggled by `main.js`. The `@custom-variant dark` in `global.css` scopes the variant. Semantic CSS tokens in `global.css` flip automatically:

```css
/* global.css — light defaults in @theme, dark overrides in .dark {} */
--color-surface:       #ffffff;   /* #111118 in dark */
--color-body-text:     #475569;   /* #a0a0b8 in dark */
--color-heading-text:  #0f172a;   /* #e8e8f5 in dark */
```

Use these tokens (and their Tailwind equivalents `text-surface`, `text-body-text`, etc.) rather than hardcoded colours so that dark mode works automatically.

**SVG/image icons in dark mode**: Brand SVG icons (e.g. calendar icons) with black-fill paths become invisible on dark backgrounds. Add the `.cal-icon` class and the CSS in `styles.css` applies `filter: brightness(0) invert(1)` in dark mode.

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

### Tailwind v4 (Current)

Tailwind v4 is configured entirely in CSS — there is no `tailwind.config.mjs`. The entry point is `src/styles/global.css`:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-durham-purple: #68246D;
  /* ... other brand tokens */
}
```

Brand colour tokens and their Tailwind utility equivalents:

| Token | Hex | Tailwind class example |
|-------|-----|------------------------|
| `durham-purple` | `#68246D` | `bg-durham-purple` |
| `deep-purple` | `#39144F` | `text-deep-purple` |
| `bright-purple` | `#EB80FD` | `border-bright-purple` |
| `light-purple` | `#E2ACFE` | `text-light-purple` |
| `lavender` | `#B8BBFE` | `text-lavender` |

Semantic tokens (auto-flip in dark mode — prefer these over brand tokens for text/surface colours):

| Token | Light | Dark |
|-------|-------|------|
| `surface` | `#ffffff` | `#111118` |
| `surface-muted` | `#f8fafc` | `#1c1c28` |
| `body-text` | `#475569` | `#a0a0b8` |
| `heading-text` | `#0f172a` | `#e8e8f5` |
| `muted-text` | `#94a3b8` | `#52526a` |

Fonts: `font-display` / `font-body` → IBM Plex Sans; `font-secondary` / `font-inter` → Inter.

### CSS Architecture: Two Files

| File | Purpose |
|------|---------|
| `src/styles/global.css` | Tailwind entry point, `@theme` tokens, dark mode semantic overrides. **Keep small.** |
| `public/css/styles.css` | Component classes, section theming, animations. Loaded as a plain `<link>` tag. |

**Important**: `styles.css` is loaded as a static asset, outside Tailwind's CSS layer system. This means all rules in `styles.css` are *unlayered* and have **higher cascade priority** than Tailwind utilities (which live in `@layer utilities`). See CSS Layers pitfall below.

### Component CSS (`public/css/styles.css`)

For reusable component patterns that don't map cleanly to Tailwind utilities:
- Use CSS variables from `:root` for brand colours — no hardcoded hex
- Existing component classes: `.btn-cta`, `.section-heading`, `.gradient-text`, `.hero-heading`, `.reveal`

### Do Not

- Hardcode hex colour values — use Tailwind tokens or CSS variables
- Add new CSS to `src/styles/global.css` for component-level patterns (use `styles.css`)
- Add element-level margin/padding resets to `styles.css` — Tailwind v4's `@layer base` handles these, and unlayered resets will silently override all `mb-*`/`mt-*` utilities on those elements

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

Tailwind major updates are **ignored** (already on v4; further major bumps deferred).

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
| CSS layer conflict | `styles.css` is unlayered — any element reset (e.g. `h1-h6, p { margin: 0 }`) added there will override ALL Tailwind `mb-*`/`mt-*` utilities on those elements, because unlayered CSS beats `@layer utilities` regardless of specificity |
| Font Awesome + `block` | FA's `display: var(--fa-display, inline-block)` is unlayered and beats Tailwind's `display: block` on `<i>` elements. To centre an icon, put `text-center` on a wrapper `<div>`, not on the `<i>` itself |
| `onerror` variables | Use `var` in inline handlers, not `const`/`let` — causes Astro TS redeclaration errors |
| `html.js-enabled` | Do not remove or break this class contract in `Layout.astro`/`main.js` |
| Image paths | Always use leading `/` for paths under `public/` |
| Hex colours | Use Tailwind tokens or CSS variables, not raw hex values |
| British spelling | Use British English in all user-facing text |

---

## Deferred Work (TODO.md)

1. **`styles.css` refactoring** — ~1,600 lines; dead `.dark` rules partially removed and semantic CSS tokens introduced. Remaining work: migrate component classes to Tailwind utilities, refactor card components to accept a `variant` prop to remove CSS context selectors.
2. **Tina CMS enhancements** — Organiser calendar integration, visual editor exploration.

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Pages | kebab-case | `what-is-ai-safety.astro` |
| Components | PascalCase | `ResearchCard.astro` |
| Data loaders | camelCase | `get-involved.ts` |
| Images | descriptive, kebab-case | `bella-robertson.jpg` |
| YAML content | kebab-case | `get-involved.yml` |
