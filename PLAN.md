# Design Improvement Plan

## Overview

Five focused improvements to `index.astro` and `styles.css` (plus a small addition to `main.js`).
No pages other than `index.astro` are touched. All changes are backwards-compatible with Tailwind v3.

---

## Step 1 — Typography upgrade

**Files:** `src/layouts/Layout.astro`, `public/css/styles.css`, `tailwind.config.mjs`

- Add **DM Serif Display** (headings) and **IBM Plex Sans** (body) to the Google Fonts `<link>` in `Layout.astro`, replacing the current Inter-only import.
- Declare both font families in `tailwind.config.mjs` under `fontFamily` so they're available as `font-display` and `font-body` Tailwind utilities.
- In `styles.css`, update `body` to use `IBM Plex Sans` and add a `.section-heading` utility class that applies `DM Serif Display` — used on all `<h2>` section titles in `index.astro`.
- Remove the `font-inter` class from `<body>` in `Layout.astro` and replace with `font-body`.

---

## Step 2 — Section rhythm (alternating backgrounds)

**Files:** `public/css/styles.css`, `src/pages/index.astro`

- Add a `section-light` class to `styles.css` alongside `section-neutral`. It uses a very slightly lavender-tinted off-white (`#f5f3ff`) so it reads as distinct from `section-neutral`'s cool grey (`#f8fafc`) without being jarring.
- Include a `dark .section-light` variant that maps to a slightly warmer dark surface than `section-neutral`'s dark variant.
- In `index.astro`, alternate the Events section (`section-neutral`) and the Programmes section (`section-light`) so adjacent sections have distinct backgrounds.
- Research and Supported-By sections stay `section-neutral`.

---

## Step 3 — Scroll-triggered entrance animations

**Files:** `public/css/styles.css`, `public/js/main.js`, `src/pages/index.astro`

- In `styles.css`, add a `@keyframes fade-up` and two classes:
  - `.reveal` — initial hidden state (`opacity: 0`, `translateY(1.5rem)`)
  - `.reveal.visible` — animated final state (`opacity: 1`, `translateY(0)`)
- Wrap the existing `initializeScrollAnimations()` in `main.js` to also observe `.reveal` elements and add `.visible` on intersection — the existing `.animate-on-scroll` logic is preserved.
- Respect `prefers-reduced-motion`: if set, `.reveal` elements are shown immediately without animation.
- In `index.astro`, add `reveal` class to:
  - Each section's heading + divider wrapper
  - Each program card (with `animation-delay` stagger via inline style)
  - The research carousel wrapper
  - The supporters grid

---

## Step 4 — DRY program cards refactor

**Files:** `src/pages/index.astro` only

- Define a typed `programs` array in the frontmatter with objects shaped:
  ```ts
  { icon: string, title: string, description: string, badge?: { icon: string, label: string }, href: string }
  ```
- Five entries matching the current cards: AIS101, Reading Groups, Research Project Support, Speaker Events, Social Events.
- Replace the two hardcoded grid blocks (2-col + 3-col) with a single responsive grid that loops over `programs`, rendering one shared card template.
- The first two items already display slightly differently (wider cards) — this is handled by the grid being `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with the array naturally filling rows.

---

## Step 5 — Hero markup cleanup

**Files:** `src/pages/index.astro`, `public/css/styles.css`

- Move both inline `text-shadow` styles from the `<h1>` and `<p>` into CSS classes `.hero-heading` and `.hero-subheading` in `styles.css`.
- Simplify the `<h1>` from two `<span>` elements with conflicting font-weight classes to a single clean element — the italic accent on "reducing catastrophic risks..." is kept but applied via a `<em>` tag styled in CSS rather than mixed inline weight utilities.
- Remove the redundant `font-medium` / `font-bold` conflict on adjacent spans.

---

## Implementation order

1. Step 1 (typography) — lays the foundation for all headings
2. Step 5 (hero cleanup) — CSS classes depend on step 1 being in place
3. Step 4 (DRY cards) — purely structural, no style dependencies
4. Step 2 (section rhythm) — needs step 4 done so section contents are final
5. Step 3 (animations) — applied last so `.reveal` classes go on final markup

---

## Out of scope

- Other pages (`about.astro`, `programmes.astro`, etc.) — untouched
- Dark mode migration to `dark:` Tailwind utilities — deferred (see `TODO.md`)
- Tailwind v4 upgrade — deferred (see `TODO.md`)
