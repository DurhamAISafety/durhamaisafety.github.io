# Design Improvement Plan

## Overview

Five focused improvements to the site's typography, visual rhythm, and code structure.
All changes are backwards-compatible with Tailwind v3.

Design reference: [aiscu.org](https://aiscu.org/) — editorial typography, clean section rhythm, subtle animations.

---

## Step 1 — Typography upgrade ✅

**Files:** `src/layouts/Layout.astro`, `public/css/styles.css`, `tailwind.config.mjs`, all `src/pages/*.astro`

- Added **DM Serif Display** (headings) and **IBM Plex Sans** (body) via Google Fonts.
- Registered as `font-display` / `font-body` Tailwind utilities in `tailwind.config.mjs`.
- Added `.section-heading` class (DM Serif Display, weight 400) — applied to h2/h3 section titles at `text-3xl`+ across all 7 pages.
- h4/h5 elements stay IBM Plex Sans for readability below the 28px display-font threshold.

> **Accessibility note:** `.section-heading` must not be used below ~28px. Card titles and sub-headings intentionally remain IBM Plex Sans.

---

## Step 5 — Hero markup cleanup ✅

**Files:** `src/pages/index.astro`, `public/css/styles.css`

- Added `.hero-heading` and `.hero-subheading` CSS classes; removed both inline `style=""` text-shadows.
- Simplified hero `<h1>` from two conflicting-weight spans to a single element with `<em>` styled via CSS.

---

## Step 4 — DRY program cards refactor ✅

**Files:** `src/pages/index.astro`

- Extracted 5 programme entries into a typed `programs: Program[]` array in the frontmatter.
- Two-grid layout (2-col + 3-col) preserved via `programs.slice(0,2)` and `programs.slice(2)`.

---

## Step 2 — Section rhythm (alternating backgrounds) ✅

**Files:** `public/css/styles.css`, all `src/pages/*.astro`

- Added `.section-light` class: lavender-tinted off-white (`#f5f3ff`), distinct from `section-neutral` (`#f8fafc`).
- Dark variant mapped to `rgba(30,10,40,0.65)` (deferred — dark mode disabled, see below).
- Applied alternating neutral/light rhythm across all 7 pages:
  - **index:** Events=neutral → Programmes=light → Research=neutral → Supported By=neutral
  - **programmes:** AIS101=neutral → Reading Groups=light → Research Projects=neutral → Speaker Events=light → Socials=neutral
  - **research:** hero=neutral → Research Areas+Recent Research=light → Opportunities=neutral
  - **what-is-ai-safety:** hero+What Is AIS=neutral → Why It Matters+Getting Started=light
  - **about:** Intro=neutral → Team=light → Join+AlumniLink=neutral → `/alumni/` page (neutral→light)
  - **get-involved:** hero=neutral → Ways=light → Additional=neutral

---

## Dark mode — disabled ✅

Disabled until Tailwind v4 migration. All `.dark { ... }` CSS rules preserved as reference.

- `Layout.astro` init script now always removes the `dark` class (clears stale localStorage)
- `main.js` `initializeDarkMode` / `updateDarkModeIcon` are no-op stubs
- Toggle buttons hidden with `display:none` + `aria-hidden`

> To re-enable: remove `style="display:none"` from header buttons, restore the two JS functions, and update the `Layout.astro` init script.

---

## CTA Buttons — DRY refactor ✅

**Files:** `public/css/styles.css`, all `src/pages/*.astro`, `src/components/Header.astro`

- Added `.btn-cta` class: durham-purple pill, shadow, `scale(1.05)` on hover, white border.
- Applied to all primary CTAs: hero, what-is-ai-safety, 404, research, index View All Research, header nav (desktop + mobile).

---

## Step 3 — Scroll-triggered entrance animations

**Files:** `public/css/styles.css`, `public/js/main.js`, `src/pages/index.astro`

- Add `@keyframes fade-up` and `.reveal` / `.reveal.visible` classes in `styles.css`.
- Extend `initializeScrollAnimations()` in `main.js` to observe `.reveal` elements.
- Respect `prefers-reduced-motion`.
- Apply `.reveal` to section headings, program cards (staggered `animation-delay`), research carousel, supporters grid.

---

## Implementation order

1. ~~Step 1 (typography)~~ ✅
2. ~~Step 5 (hero cleanup)~~ ✅
3. ~~Step 4 (DRY cards)~~ ✅
4. ~~Step 2 (section rhythm)~~ ✅
5. Step 3 (animations) — applied last so `.reveal` classes go on final markup

---

## Out of scope / deferred

- Dark mode: re-implement properly during Tailwind v4 upgrade (see `TODO.md`)
- Tailwind v4 upgrade (see `TODO.md`)
