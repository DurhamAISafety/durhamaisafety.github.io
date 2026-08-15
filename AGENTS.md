# Project Guidelines

**CRITICAL** For netlify, use the `.agents/skills/netlify-deploy` skill - it details how to use the CLI to interact with netlify.

## Project Snapshot
Static website for Durham AI Safety (DAISI), deployed to https://durhamaisafety.uk via Netlify. The site is a pure static Astro 7 build (no adapter — `astro.config.mjs` is just sitemap + the Tailwind Vite plugin), with Tailwind CSS v4 and TypeScript. Content lives in YAML/JSON files under `src/content/` and is read directly at build time; three collections are also editable via Sveltia CMS at `/admin/`.

## Build & Validation
```bash
pnpm install          # install dependencies
pnpm dev          # local dev server NOTE - ALWAYS ASK THE USER TO RUN THIS THEN YOU (the agent) check the url
pnpm exec astro check # TypeScript/Astro type-check (always fix all these issues)
pnpm build        # production build: astro build (pure static output to dist/)
pnpm run preview      # preview production build locally
pnpm --package=netlify-cli dlx netlify build
pnpm --package=netlify-cli dlx netlify deploy
```

Use pnpm as the package manager. Keep `pnpm-lock.yaml` and `pnpm-workspace.yaml` tracked.

There is no separate unit/integration test suite configured. Use `pnpm exec astro check` and `pnpm run build` as the baseline validation for most code changes.

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
- `src/content/` - YAML/JSON content files (edited via Sveltia CMS or directly).
- `src/data/` - TypeScript data loaders and content types; `content.ts` holds the `readYaml`/`readJson` file readers.
- `src/layouts/Layout.astro` - base HTML, metadata, structured data, and global assets.
- `src/pages/` - route-based pages, using kebab-case filenames.
- `src/styles/global.css` - Tailwind v4 entry point and `@theme` tokens.
- `public/` - static assets served as-is, including `css/`, `js/`, and `images/`.
- `public/admin/` - Sveltia CMS admin page (`index.html`) and its `config.yml`.
- `netlify.toml` - Netlify deploy configuration.

## Content
Content is read directly from `src/content/*` at build time via the readers in `src/data/content.ts`; there is no CMS runtime or API. Most content is code-edited in the files. Sveltia CMS (`/admin/`) covers only three collections — People / Committee, Research papers, and Supporters — committing edits as pull requests against `main`.

YAML root wrappers must not be removed:
- `people.yml` -> `people:` (members and alumni in one list, split by `type: member` / `type: alumnus`)
- `research-papers.yml` -> `papers:`
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
- **Jump Navigation**: For long, multi-section pages (e.g. consolidated hubs or resource indices), include a premium, sleek horizontal jump navigation bar (e.g. pill layout with smooth-scrolling anchors and icons) at the top of the content area to improve scannability and user engagement.

## Styling
- Tailwind v4 is configured in CSS through `src/styles/global.css`; there is no `tailwind.config.mjs`.
- `src/styles/global.css` should stay focused on Tailwind imports, `@custom-variant`, `@theme` tokens, and semantic theme values.
- `public/css/styles.css` and split CSS files under `public/css/` hold reusable component patterns, section theming, animations, and legacy styles.
- Use CSS variables from `:root` in the public CSS files for brand colours; avoid hardcoded hex values in component CSS.
- Tailwind v4 patterns are current. Do not reintroduce Tailwind v3 configuration patterns.

Important cascade pitfall: CSS loaded from `public/css/*.css` is unlayered and can override Tailwind utilities. Avoid broad element resets such as `p { margin: 0 }` or heading margin resets there, because they can silently beat `mt-*` and `mb-*` utilities.

## Content Editing (Sveltia CMS)
Non-technical maintainers edit content via [Sveltia CMS](https://sveltiacms.app) at `/admin/` — a Git-based editor with no SaaS backend. It's hosted: `public/admin/index.html` loads Sveltia from a CDN and reads `public/admin/config.yml`. There is no local CMS process to run and no credentials are needed to build the site. Each save opens a pull request against `main` (editorial workflow) for review before publish. Auth is GitHub OAuth via Netlify (already configured).

The CMS exposes three collections only:
- People / Committee -> `src/content/people.yml`
- Research papers -> `src/content/research-papers.yml`
- Supporters -> `src/content/supporters.yml`

Everything else — home, research page, programmes, get-involved, and site config — is code-edited under `src/content/`. The About page is intentionally NOT in the CMS (its copy contains hand-written HTML links); edit it in `src/content/pages/about.yml`.

Content is read directly from the files at build time via `src/data/content.ts`; no CMS runtime client, GraphQL, or editing-preview markup is involved. Page-specific copy is loaded via `src/data/config.ts` (`getHomePageContent()`, `getAboutPageContent()`, `getResearchPageContent()`). Prefer extending content files over adding hardcoded page copy that maintainers may need to edit.

## CI/CD
PR validation runs dependency install, `pnpm exec astro check`, `pnpm build`, and link validation. Netlify is the primary deployment target for the production site. GitHub Pages is used as a redirect/fallback path to the canonical domain.

### ⚠️ Netlify builds are OFF on purpose — do NOT turn them back on

To conserve Netlify **build minutes** (the metered credit), Netlify does **no building**:

- **Automatic Git-triggered builds are disabled** in the Netlify dashboard.
- **Deploy Previews are disabled** — that's why Netlify's PR checks (`Header rules`,
  `Pages changed`, `Redirect rules`) show red on PRs. This is expected, not a failure.
- Production deploys instead **build on GitHub Actions' free runners** and upload the
  prebuilt `dist/` via `netlify deploy --prod --no-build` (`.github/workflows/deploy-netlify.yml`,
  push-to-`main` + manual). Netlify build-minute usage stays at **zero**.

**Do not** re-enable Netlify Git builds or Deploy Previews to "fix" the red checks or make
deploys automatic — that reintroduces the exact credit drain this setup avoids. The site
already deploys on every push to `main`. If a deploy misbehaves, debug the GitHub Actions
workflow, not the Netlify build settings.

Sveltia CMS auth uses GitHub OAuth **via Netlify** (a free, separate service — not builds).
Keeping the Netlify site alive for OAuth costs no build minutes; don't delete it.

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
- Check `docs/TODO.md` before broad CSS refactors; it tracks deferred cleanup work.
- The `get-involved.yml` "Join Discord" card links to a Microsoft **Forms** URL by design — an anti-scam gate that vets people before the real invite, not a broken link. Do not "fix" it to a raw Discord invite.
