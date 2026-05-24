# Project Guidelines

**CRITICAL** For netlify, use the `.agents/skills/netlify-deploy` skill - it details how to use the CLI to interact with netlify.

## Project Snapshot
Static website for Durham AI Safety (DAISI), deployed to https://durhamaisafety.uk via Netlify. The site is currently built with Astro 5, Tailwind CSS v4, TypeScript, and Tina CMS. Keep Astro on the 5.x line while `@tinacms/astro` peers on `astro@^5.0.0`. Content is managed via Tina CMS at `/admin/` and stored in YAML/JSON files under `src/content/`.

## Build & Validation
```bash
pnpm install          # install dependencies
pnpm run dev          # local dev server + Tina CMS at /admin/ NOTE - ALWAYS ASK THE USER TO RUN THIS THEN YOU (the agent) check the url
pnpx astro check      # TypeScript/Astro type-check (always fix all these issues)
pnpm run build        # production build: tinacms build && astro build
pnpm run preview      # preview production build locally
pnpx netlify build
pnpx netlify deploy
```

Use pnpm as the package manager. Keep `pnpm-lock.yaml` and `pnpm-workspace.yaml` tracked.

There is no separate unit/integration test suite configured. Use `pnpx astro check` and `pnpm run build` as the baseline validation for most code changes.

## Fixes and Documentation
- Document any environment, deployment, or technical fixes systematically in `docs/FIX_NOTES.md`.
- Always keep `docs/FIX_NOTES.md` up to date with newly discovered issues or modifications to the build/deployment orchestration scripts.

## Architecture
Content flows in one direction:

```text
src/content/*.yml / *.json
  -> src/data/*.ts
  -> src/pages/*.astro / src/components/*.astro
```

`src/data/*.ts` owns parsing and typing for content files. Do not read YAML/JSON directly from pages or components.

## Repository Structure
- `src/assets/` - build-time optimised images.
- `src/components/` - Astro components, using PascalCase filenames.
- `src/content/` - YAML/JSON content files edited by Tina CMS.
- `src/data/` - TypeScript data loaders and content types.
- `src/layouts/Layout.astro` - base HTML, metadata, structured data, and global assets.
- `src/pages/` - route-based pages, using kebab-case filenames.
- `src/styles/global.css` - Tailwind v4 entry point and `@theme` tokens.
- `public/` - static assets served as-is, including `css/`, `js/`, and `images/`.
- `tina/config.ts` - Tina CMS schema.
- `netlify.toml` - Netlify deploy configuration and secrets-scan exclusions.

## Content
Prefer Tina CMS (`/admin/`) for content edits. It commits to YAML/JSON and triggers deploys automatically. Use direct YAML edits only when changing schema, repairing content structure, or when explicitly requested.

YAML root wrappers must not be removed:
- `people.yml` -> `people:` (members and alumni in one list, split by `type: member` / `type: alumnus`)
- `research.yml` -> `papers:`
- `supporters.yml` -> `supporters:`
- `get-involved.yml` -> `cards:`
- `programmes.yml` -> `programmes:`
- `site-config.json` has no YAML wrapper; it controls site title, email, OG image, social links, navigation, and footer tagline.

Image paths must use leading `/` public paths:
- People photos: `/images/people/...`
- Research thumbnails: `/images/research/...`
- Supporter logos: `/images/supporters/...`

Long programme descriptions support basic Markdown such as `**bold**`, `_italic_`, and `[link text](url)`.

## Frontend Conventions
- Use British English spellings throughout user-facing content and UI text: colour, organised, centralised, behaviour, programme, fulfil, etc.
- Navigation is centralised in `src/content/site-config.json`; do not hardcode navigation links in `Header.astro`.
- Dark mode is enabled via the `.dark` class on `<html>`, toggled by `public/js/main.js`, and backed by `@custom-variant dark` plus semantic CSS tokens in `src/styles/global.css`.
- Use semantic Tailwind/CSS tokens such as `surface`, `surface-muted`, `body-text`, `heading-text`, and `muted-text` for surfaces and text where possible.
- Scroll animations use `.reveal` with `style="--reveal-delay: Xms"` for stagger.
- Keep the `html.js-enabled` contract intact for reveal animations in `Layout.astro` and `main.js`.
- External links must have `target="_blank"` when opening a new tab, `rel="noopener noreferrer"`, and a trailing Font Awesome icon:
  ```html
  <i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>
  ```

## Styling
- Tailwind v4 is configured in CSS through `src/styles/global.css`; there is no `tailwind.config.mjs`.
- `src/styles/global.css` should stay focused on Tailwind imports, `@custom-variant`, `@theme` tokens, and semantic theme values.
- `public/css/styles.css` and split CSS files under `public/css/` hold reusable component patterns, section theming, animations, and legacy styles.
- Use CSS variables from `:root` in the public CSS files for brand colours; avoid hardcoded hex values in component CSS.
- Tailwind v4 patterns are current. Do not reintroduce Tailwind v3 configuration patterns.

Important cascade pitfall: CSS loaded from `public/css/*.css` is unlayered and can override Tailwind utilities. Avoid broad element resets such as `p { margin: 0 }` or heading margin resets there, because they can silently beat `mt-*` and `mb-*` utilities.

## Tina CMS
Tina CMS provides a visual editing interface at `/admin/` and writes directly to content files.

Local CMS setup uses `.env.example` as the template. Required credentials are provided by the Tina Cloud project maintainers.

Do not remove Netlify secrets-scan exclusions for Tina public IDs. `netlify.toml` must continue omitting `NEXT_PUBLIC_TINA_CLIENT_ID` and Tina generated paths from secrets scanning.

Visual-editable Tina collections must have all of these pieces:
- `ui.router` in `tina/config.ts` so Tina opens a preview route instead of only the basic collection form.
- An async loader in `src/data/*.ts` that calls the generated Tina client and wraps it with `requestWithMetadata()`.
- Original Tina source objects preserved on normalised data so components can call `tinaField(source, "field")`.
- `data-tina-field` attributes on rendered editable elements.
- `data-tina-island="/tina-island/name"` plus a `src/lib/tina-islands.ts` registry entry when live preview should refresh a page region.

Current visual-editing coverage: Home Page, About Page, Research Page, People, Programmes, Get Involved Cards, Research Papers, and Supporters. Prefer extending Tina schemas and content files over adding new hardcoded page copy when maintainers may need to edit it. Page-specific copy is queried via page-specific loaders in `src/data/config.ts` (`getHomePageContent()`, `getAboutPageContent()`, `getResearchPageContent()`).

## CI/CD
PR validation runs dependency install, `pnpx astro check`, `pnpm build`, and link validation. Netlify is the primary deployment target for the production site. GitHub Pages is used as a redirect/fallback path to the canonical domain.

## File Naming
- Pages: kebab-case, for example `what-is-ai-safety.astro`.
- Components: PascalCase, for example `ResearchCard.astro`.
- Data loaders: camelCase or existing content-name convention, for example `get-involved.ts`.
- YAML content files: kebab-case.
- Images: descriptive kebab-case filenames.

## Pitfalls
- YAML indentation is 2 spaces, never tabs.
- Inline `onerror` image handlers in `.astro` files must use `var`, not `const` or `let`, to avoid Astro TypeScript redeclaration errors.
- Font Awesome display rules can beat Tailwind `block` on `<i>` elements. Centre icons using a wrapper element when needed.
- Brand SVG/image icons with black fills can become invisible in dark mode. Existing `.cal-icon` CSS handles calendar icons.
- Keep image paths absolute from `public/`, with a leading `/`.
- Keep navigation and social links in `src/content/site-config.json`.
- Check `TODO.md` before broad CSS or Tina CMS refactors; it tracks deferred cleanup work.
