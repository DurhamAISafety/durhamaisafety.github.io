# Future Work

## Tooling And Package Manager

- Decide explicitly whether the repo should stay on npm or migrate to pnpm.
  - Current recommendation: stay on npm for now because CI, Dependabot, Netlify docs, and `package-lock.json` are already npm-based.
  - If migrating to pnpm, do it as one deliberate branch: replace `package-lock.json` with `pnpm-lock.yaml`, set `packageManager` to pnpm, update GitHub Actions install/cache steps, update README/AGENTS/Netlify docs, and remove npm-only instructions.
  - Do not keep npm and pnpm lockfiles together.
- Keep Astro on the 5.x line while `@tinacms/astro@0.2.0` peers on `astro@^5.0.0`.
  - Revisit Astro 6 only after Tina's Astro integration supports it.
  - Tailwind is already using the current v4 Vite plugin shape; do not add Tailwind v3-style config files.
- Add `tsconfig.json` using Astro's strict template once the current CMS branch is stable.

## CMS Model

- Move page-specific copy out of `src/content/site-config.json` into page-owned content documents.
  - Suggested files: `src/content/pages/home.yml`, `src/content/pages/about.yml`, `src/content/pages/research.yml`.
  - Keep `site-config.json` for global settings only: title, description, email, OG image, navigation, social links, footer, site-wide metadata.
- Add Tina collections for page-owned content.
  - Use separate collections for Home Page, About Page, and Research Page rather than extending Site Config further.
  - Add `ui.router` routes so each document opens the right visual preview route.
  - Preserve source objects in loaders so `tinaField(...)` bindings remain accurate.
- Migrate `/what-is-ai-safety/` to Tina after the page-owned model is proven.
  - It likely needs flexible rich text or a small block schema for definitions, timeline items, resource links, video embeds, and updateable examples.

## Data Loaders And Validation

- Add clear validation in `src/data/*.ts` loaders so malformed CMS content fails early at build time.
  - Check required fields are non-empty.
  - Check public image paths start with `/`.
  - Check research `month` is between 1 and 12 when present.
  - Check links that open externally are valid URLs where practical.
  - Check homepage programme tags respect the intended display limits.
- Remove temporary `any` casts from `src/data/config.ts` once Tina generated types include the new page fields.
- Remove the legacy `siteConfig.social` compatibility shim.
  - Derive JSON-LD `sameAs` links in `Layout.astro` from `siteConfig.socialLinks` instead.

## Homepage And Components

- Break `src/pages/index.astro` into focused section components.
  - `HeroSection.astro`
  - `EventsSection.astro`
  - `ProgrammePreviewSection.astro`
  - `ResearchPreviewSection.astro`
  - `SupportersSection.astro`
- Unify supporter rendering.
  - The hero strip and bottom grid should share logo path normalisation and a common logo/card component with variants.
  - Keep one CMS-backed supporter list, but allow per-section display options if needed.
- Split page-local JavaScript and styles out of `src/pages/index.astro` when the events and homepage sections are extracted.

## CSS And Components

- Delete redundant `.dark` rules in individual CSS modules where semantic tokens already cover light/dark variants.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind utilities or `@apply` only where it reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so styling no longer depends on broad section context selectors.

## Visual Editing QA

- Add a manual smoke-test checklist for Tina visual editing.
  - Open `/admin/index.html`.
  - Open each routed collection.
  - Confirm Tina navigates to the expected preview route.
  - Click a marked field in the preview.
  - Confirm the sidebar focuses the matching field.
  - Edit a field and confirm the relevant island live-refreshes.
- After the manual checklist is stable, consider a small Playwright smoke test for the public routes. Full Tina editor automation can wait.

## Content And Design

- Replace informal visual-overhaul notes with a short design spec before implementation.
  - Direction to explore: a more people-focused homepage while keeping Durham Cathedral/Durham identity visible.
  - Possible visual motif: restrained gothic/neural-network treatment, avoiding generic AI gradients.
  - Use Merriweather or another serif for headings only if it fits the final design direction; keep body/UI text readable and restrained.
- Add organiser calendar management to Tina only if event/calendar ownership moves into the site.
