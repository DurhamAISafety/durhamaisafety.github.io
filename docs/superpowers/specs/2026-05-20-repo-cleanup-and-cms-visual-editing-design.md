# Repo Cleanup And CMS Visual Editing Design

**Date**: 2026-05-20
**Status**: Proposed
**Authors**: Antigravity

---

## 1. Goal & Context

The goal is to implement high and medium priority tasks from the `docs/repo-cleanup-cms-visual-editing-audit.md` report. 

### Core Decisions
- **Package Manager**: Remain strictly on `npm` for lockfile management. Remove any accidental pnpm lockfiles/workspaces from the repository to avoid split dependencies.
- **Framework Version**: Do not upgrade to Astro 6. Remain on Astro 5 because `@tinacms/astro@0.2.0` has a peer dependency of `astro@^5.0.0`.
- **Validation**: Implement a simple, custom TypeScript utility in `src/data/config.ts` (no heavy validation library dependencies).

---

## 2. Phase-by-Phase Plan

### Phase 1: CMS Migration, Schema Overhaul & Loaders

#### Phase 1.1: Content File Migration
Create the following page-owned `.yml` files in a new directory `src/content/pages/` containing content moved from `src/content/site-config.json`:
- `src/content/pages/home.yml` (under a `home:` root wrapper key)
- `src/content/pages/about.yml` (under an `about:` root wrapper key)
- `src/content/pages/research.yml` (under a `research:` root wrapper key)

#### Phase 1.2: Tina Schema Changes
- Remove the `homepage`, `aboutPage`, and `researchPage` fields from the `siteConfig` collection in `tina/config.ts`.
- Define three new independent collections in `tina/config.ts` with these properties:
  - **`homePage`**:
    - `name: "homePage"`
    - `path: "src/content/pages"`
    - `match: { include: "home" }`
    - `format: "yml"`
  - **`aboutPage`**:
    - `name: "aboutPage"`
    - `path: "src/content/pages"`
    - `match: { include: "about" }`
    - `format: "yml"`
  - **`researchPage`**:
    - `name: "researchPage"`
    - `path: "src/content/pages"`
    - `match: { include: "research" }`
    - `format: "yml"`

#### Phase 1.3: Generated Type Refresh
- Run `npm run build` or the Tina Dev CLI (`npx tinacms schema:compile` and `npx tinacms codegen`) to refresh `tina/__generated__/` types and client queries:
  - `client.queries.homePage`
  - `client.queries.aboutPage`
  - `client.queries.researchPage`

#### Phase 1.4: Loader Refactor
- Refactor `src/data/config.ts` to implement three new loaders:
  - `getHomePageContent()` -> queries `client.queries.homePage({ relativePath: 'home.yml' })`
  - `getAboutPageContent()` -> queries `client.queries.aboutPage({ relativePath: 'about.yml' })`
  - `getResearchPageContent()` -> queries `client.queries.researchPage({ relativePath: 'research.yml' })`
- Update `getSiteConfigContent()` to fetch only global configuration.
- Strip all `any` casts from loaders and leverage the refreshed generated TypeScript types.
- Delete the legacy `social` object shim inside `SiteConfig` interface.

#### Phase 1.5: Page Rewiring
- Update `src/layouts/Layout.astro` to derive social links from `siteConfig.socialLinks` dynamically rather than relying on `siteConfig.social`.
- Update `src/pages/index.astro`, `src/pages/about.astro`, and `src/pages/research.astro` to use their corresponding page loaders.
- Update all `data-tina-field` properties on pages to bind to the new page-specific `_source` properties.

#### Phase 1.6: Local Content Validation
- Implement a lightweight, custom local validation helper function within `src/data/config.ts`.
- Perform checks on content parsed by loaders:
  - Navigation links have valid `title` and `url`.
  - Image paths are absolute (must start with `/`).
  - Required fields in page contents are non-empty.

---

### Phase 2: Component Extraction & Supporter Unification

#### Phase 2.1: Component Extraction
Extract monolithic code blocks from `src/pages/index.astro` into `src/components/sections/`:
- `HeroSection.astro` (text, CTA buttons, and supporters' hero strip)
- `EventsSection.astro` (contains events layout and Luma calendar)
- `ProgrammePreviewSection.astro` (programmes list)
- `ResearchPreviewSection.astro` (carousel)
- `SupportersSection.astro` (bottom grid)

##### Component Guidelines
- **Tina Island Boundaries**: Preserve all existing `data-tina-island` configurations and boundaries.
- **Scroll Animations**: Maintain exact `.reveal` class hooks, `style="--reveal-delay: Xms"`, and general reveal structures.
- **Calendar Scripts**: Maintain inline iframe rendering, custom scripts, backup links, and `.cal-icon` styling logic precisely.

#### Phase 2.2: Supporter Unification
- Implement a single logo normalization helper to ensure absolute paths with leading slashes.
- Create a shared `SupporterLogo.astro` / `SupporterCard.astro` component which takes the logo metadata and handles:
  - **Hero Variant**: Greyscale styling with standard opacity.
  - **Grid Variant**: Full-contrast hover states with distinct border styles.

---

### Phase 3: Tooling, Documentation & Cleanup

#### Phase 3.1: Tooling Configuration
- Initialize `tsconfig.json` conforming to Astro's strict template.

#### Phase 3.2: Documentation Updates
- Update `README.md` to document the new page-owned CMS model structure.
- Update `AGENTS.md` to specify the package manager policy (`npm` only) and dependency policies.
- Clean up completed items in `TODO.md`.

---

## 4. Verification Plan

### Automated Checks
Run the following commands inside the repository:
1.  **Whitespace & Git Check**: `git diff --check`
2.  **TypeScript & Astro Compilation Diagnostics**: `npx astro check`
3.  **Production Bundle Verification**: `npm run build`

### Manual Tina Visual-Editing Smoke Checklist
1.  Launch development environment: `npm run dev`.
2.  Log into `/admin/index.html` locally.
3.  Navigate to Site Config, People, Programmes, Get Involved Cards, Research Papers, and Supporters.
4.  Confirm each collection correctly previews and routes to its expected preview URL.
5.  Click marked fields in the live preview iframe and verify that the editor sidebar correctly focuses them.
6.  Edit a field in the sidebar and verify that the target Tina Island re-renders dynamically.
