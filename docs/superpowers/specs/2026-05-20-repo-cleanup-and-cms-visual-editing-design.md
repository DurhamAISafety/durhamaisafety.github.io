# Repo Cleanup And CMS Visual Editing Design

**Date**: 2026-05-20
**Status**: Approved
**Authors**: Antigravity

---

## 1. Goal & Context

The goal is to implement high and medium priority tasks from the `docs/repo-cleanup-cms-visual-editing-audit.md` report. 
We want to:
- Move page-specific copy from `site-config.json` into typed, page-owned `.yml` files in a new `src/content/pages/` directory.
- Define separate collections in `tina/config.ts` for `homePage`, `aboutPage`, and `researchPage`.
- Clean up typescript types, `any` casts, and legacy shims (such as `siteConfig.social`).
- Split the monolithic `src/pages/index.astro` into focused section components in `src/components/`.
- Unify the supporters' display in the hero section and bottom grid.
- Implement robust schema validation in loaders.
- Improve tooling (add `tsconfig.json`).

---

## 2. Phase-by-Phase Plan

### Phase 1: CMS Migration, Schema Overhaul & Loaders

#### 2.1.1 New Page Content Files
We will create:
- `src/content/pages/home.yml` containing the homepage copy under a `home` wrapper key.
- `src/content/pages/about.yml` containing the About page copy under an `about` wrapper key.
- `src/content/pages/research.yml` containing the Research page copy under a `research` wrapper key.

#### 2.1.2 Schema Adjustments (`tina/config.ts`)
- Remove `homepage`, `aboutPage`, and `researchPage` fields from the `siteConfig` collection.
- Define separate `homePage`, `aboutPage`, and `researchPage` collections pointing to `src/content/pages/` with format `yml`.
- Structure them with a root wrapper object matching the wrapper key in the `.yml` files.

#### 2.1.3 Data Loader Updates (`src/data/config.ts`)
- Implement:
  - `getHomePageContent()`
  - `getAboutPageContent()`
  - `getResearchPageContent()`
- Refactor `getSiteConfigContent()` to only parse global settings.
- Implement validators for:
  - Leading slashes in image paths (`/images/...`).
  - Navigation menu labels and URLs being non-empty.
  - Required fields in pages.
- Strip all `any` casts and use fully generated Typescript types.
- Delete the legacy `social` object shim inside `SiteConfig` interface.

#### 2.1.4 Page and Layout Updates
- Update `src/layouts/Layout.astro` to derive JSON-LD social links from `siteConfig.socialLinks` instead of the legacy `social` shim.
- Update `src/pages/index.astro`, `src/pages/about.astro`, and `src/pages/research.astro` to fetch configuration using their respective new loaders.
- Update all `data-tina-field` bindings on those pages.

---

### Phase 2: Component Extraction & Supporter Unification

#### 2.2.1 Component Extraction
Extract sections from `src/pages/index.astro` into `src/components/`:
- `HeroSection.astro` (containing hero text, buttons, and supporters' hero strip)
- `EventsSection.astro` (containing the Luma calendar iframe and description)
- `ProgrammePreviewSection.astro` (containing the dynamic list of programmes)
- `ResearchPreviewSection.astro` (containing the research paper carousel)
- `SupportersSection.astro` (containing the bottom supporters grid)

#### 2.2.2 Supporter Unification
- Implement a helper or reusable component to render the supporter logos.
- Align both `SupportersHeroStrip` and `SupportersGrid` to consume the same unified list of supporters, ensuring consistent dark-mode styling and alt texts.

---

### Phase 3: Tooling & Documentation

#### 2.3.1 Tooling
- Add `tsconfig.json` using Astro's strict template.

#### 2.3.2 Documentation & Verification
- Add a manual checklist for visual editing smoke-testing.
- Refresh CMS coverage documentation in README.md.
- Trim completed TODO items from `TODO.md`.

---

## 3. Verification Plan

### Automated Verification
- Run `npx astro check` to verify that there are no TypeScript or Astro type-check errors.
- Run `npm run build` to verify the full static build and Tina CMS generation works cleanly.

### Manual Verification
- Verify in development mode (`npm run dev`) that all pages render correctly.
- Verify that live visual editing metadata is correctly embedded on elements.
