# Repo Cleanup And CMS Visual Editing Audit

Date: 2026-05-20
Branch reviewed: `visual-editor`

## Summary

This branch is moving the site in the right direction for Tina visual editing. The main progress is that header/footer/navigation, calendar config, homepage hero text, homepage section headings, About page copy, Research page cards, People descriptions, and supporter preview contrast are now CMS-backed or better marked for Tina.

The main cleanup theme is not "add more config"; it is "make the CMS model easier to reason about". Keep one package manager, keep one content/data/rendering path, and move page-owned copy into page-owned CMS documents instead of growing `site-config.json` indefinitely.

## Done In This Audit

- Removed accidental pnpm files from the npm-based repo:
  - `pnpm-lock.yaml`
  - `pnpm-workspace.yaml`
- Added `packageManager: "npm@11.6.2"` to `package.json`.
- Replaced the broad upstream-style `.gitignore` with a project-specific ignore list.
- Kept `package-lock.json` as the canonical lockfile and blocked accidental alternate lockfiles.
- Fixed whitespace issues found by `git diff --check`.
- Updated `AGENTS.md` to say the live stack is Astro 5, not Astro 6.
- Trimmed completed/stale TODO items that are now handled by the branch.

## Package Manager Decision

Use npm for now.

Reasoning:

- CI already uses `npm ci` and npm caching.
- Dependabot is configured for the npm ecosystem.
- `package-lock.json` already exists and is the deploy-aligned lockfile.
- The repo is a single package, not a monorepo, so pnpm workspaces do not buy much.
- The added `pnpm-workspace.yaml` contained placeholder values and made setup less tidy.

pnpm would be reasonable only as a deliberate migration. If you choose that later, do all of this in one branch:

- Replace `package-lock.json` with `pnpm-lock.yaml`.
- Set `packageManager` to the chosen pnpm version.
- Update `.github/workflows/pr-validation.yml` to use pnpm install/cache.
- Update Netlify/developer docs to use pnpm.
- Remove npm-specific instructions from README/AGENTS.

Do not keep npm and pnpm lockfiles together.

## Framework And Tooling State

Do not upgrade to Astro 6 yet.

Current registry check on 2026-05-20:

- `astro` latest is `6.3.5`.
- `@astrojs/netlify` latest is `7.0.10` and peers on `astro@^6.0.0`.
- `@tinacms/astro` latest is `0.2.0` and peers on `astro@^5.0.0`.

So the current Astro 5 + `@astrojs/netlify@6` setup is intentional while Tina's Astro integration is still pinned to Astro 5.

Tailwind is already on the current v4 shape:

- `@tailwindcss/vite` is wired in `astro.config.mjs`.
- `src/styles/global.css` uses `@import "tailwindcss"` and `@theme`.
- There is no `tailwind.config.mjs`, which is correct for this setup.

## High Priority Cleanup

1. Create page-owned CMS documents for page copy.

   `site-config.json` is doing too much. It should own global site settings: metadata, nav, social links, footer, and perhaps global contact details. Page-specific fields such as homepage hero copy, About page mission cards, and Research page area cards should move to page-owned documents, for example:

   - `src/content/pages/home.yml`
   - `src/content/pages/about.yml`
   - `src/content/pages/research.yml`
   - later, `src/content/pages/what-is-ai-safety.yml`

   Keep reusable collections separate:

   - People
   - Programmes
   - Research Papers
   - Supporters
   - Get Involved Cards

2. Split homepage rendering into reusable section components.

   `src/pages/index.astro` still owns too much markup, script, and local CSS. Extract sections in this order:

   - `HeroSection.astro`
   - `EventsSection.astro`
   - `ProgrammePreviewSection.astro`
   - `ResearchPreviewSection.astro`
   - `SupportersSection.astro`

   This will make Tina island boundaries clearer and reduce repeated card markup.

3. Unify the two supporter renderings.

   The homepage currently renders supporters in the hero strip and again in the bottom grid. That is fine visually, but the data/rendering contract should be shared:

   - one helper for logo path normalisation
   - one shared supporter-card/logo component with variants
   - one page-owned section config for title/display options

4. Add content validation in loaders.

   Each `src/data/*.ts` loader should fail clearly when required content is missing or malformed. This matters more now because Tina editing lets non-developers change structured content.

   Start with:

   - required image paths start with `/`
   - required URLs are present
   - navigation items have title and URL
   - programme tags and feature boxes do not exceed intended display limits
   - research month is 1-12 when present

5. Add visual editing smoke checks.

   There is no automated visual editing test. Add a manual checklist first, then consider Playwright later:

   - open `/admin/index.html`
   - open Site Config, People, Programmes, Get Involved, Research Papers, Supporters
   - confirm each collection routes to the expected preview URL
   - click a marked field in the preview
   - confirm the Tina sidebar focuses the matching field
   - edit a field and confirm the relevant island live-refreshes

## Medium Priority Cleanup

1. Remove `any` casts from `src/data/config.ts`.

   The casts were useful during schema expansion, but they hide schema drift. After the generated Tina types are stable, use typed access for `homepage`, `aboutPage`, and `researchPage`.

2. Remove the legacy `siteConfig.social` shim.

   `Header.astro` and `Footer.astro` now use `socialLinks`; `Layout.astro` still uses `siteConfig.social` for JSON-LD. Replace that with a derived helper based on `socialLinks`, then delete the shim from `src/data/config.ts`.

3. Add `tsconfig.json`.

   The project depends on TypeScript and runs `npx astro check`, but no root `tsconfig.json` is currently present. Add Astro's strict template once the current branch is otherwise stable.

4. Refresh README CMS coverage.

   The README still says page content is not CMS-editable, but this branch has moved significant page copy into Tina. Update the content table after the page-owned CMS model is chosen.

5. Review Tina generated files policy.

   The repo tracks Tina generated files. That may be fine for Netlify/Tina stability, but document the decision in README or AGENTS so future cleanup does not remove them by accident.

## Low Priority Cleanup

1. Continue CSS consolidation gradually.

   Avoid a broad CSS rewrite. The safer path is to remove duplicated dark-mode/component rules while extracting sections.

2. Move local homepage script into a small public/module script if it grows.

   Keep it inline for now unless extraction of the events section makes the boundary obvious.

3. Clean visual-overhaul notes from `TODO.md`.

   The current notes are useful but informal. Once a redesign spec exists, move the durable decisions into a design doc and keep TODO focused on implementation tasks.

## Not Recommended Now

- Do not upgrade to Astro 6 until `@tinacms/astro` supports it.
- Do not add Tailwind config files; Tailwind v4 is already configured through CSS and the Vite plugin.
- Do not keep both npm and pnpm lockfiles.
- Do not build a fully generic block builder before the page-first CMS model is proven.
