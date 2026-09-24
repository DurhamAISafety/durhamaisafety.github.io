# Project Guidelines

Instructions for coding agents (Codex, Claude Code, etc.). `CLAUDE.md` is a symlink to this file, so edit `AGENTS.md` only.

## ⚠️ Deployment: production is GitHub Pages, not Netlify
`durhamaisafety.uk` is served by **GitHub Pages** as of 2026-08-17 (free and unmetered for public repos).

- `.github/workflows/deploy-astro.yml` builds and publishes the site on every push to `main`. This is the only thing that puts changes live.
- The custom domain is set in **Settings → Pages**, with `public/CNAME` as a backup copy. DNS lives in Netlify's (free) DNS panel: apex A records point at GitHub's `185.199.10{8,9,10,11}.153` and `www` is CNAMEd to `durhamaisafety.github.io`.

**Netlify no longer deploys the site — do NOT wire it back up.** Netlify metered production deploys (~15 credits each) and build minutes; the account ran out and blocked deploys with a 403 for two days, which is why the site moved.
- `.github/workflows/deploy-netlify.yml` is manual-only (`workflow_dispatch`), kept as a fallback. Running it does nothing useful while the domain points at Pages.
- Netlify's PR checks (`Header rules`, `Pages changed`, `Redirect rules`) show red because Deploy Previews are disabled. Expected, not a failure.
- Do not re-enable Netlify Git builds, Deploy Previews, or the push trigger on `deploy-netlify.yml`. Nothing needs a Netlify serving feature: `netlify.toml` only sets build options that `--no-build` ignores, there are no `_headers` or `_redirects`, and the site's two redirects are Astro's own, emitted as static pages into `dist/`.

**Keep the Netlify account** — deleting the team or site would break CMS logins and take the domain offline:
1. **Sveltia CMS auth** uses GitHub OAuth via Netlify (`public/admin/config.yml` sets no `base_url`, so it falls back to Netlify's provider).
2. **DNS for `durhamaisafety.uk`** is hosted in Netlify's DNS panel (domain registered at Porkbun, nameservers delegated to Netlify).

If you must touch Netlify, use the `.agents/skills/netlify-deploy` skill.

## Project Snapshot
Static website for Durham AI Safety (DAISI), deployed to https://durhamaisafety.uk via GitHub Pages (`.github/workflows/deploy-astro.yml` on push to `main`). The site is a pure static Astro 7 build (no adapter — `astro.config.mjs` is just sitemap + the Tailwind Vite plugin), with Tailwind CSS v4 and TypeScript. Content lives in YAML/JSON files under `src/content/` and is read directly at build time; most of them are also editable via Sveltia CMS at `/admin/`.

## Build & Validation
```bash
pnpm install          # install dependencies
pnpm dev          # local dev server NOTE - ALWAYS ASK THE USER TO RUN THIS THEN YOU (the agent) check the url
pnpm lint             # ESLint (astro-eslint-parser + jsx-a11y; tuned rules explained in eslint.config.js)
pnpm exec astro check # TypeScript/Astro type-check (always fix all these issues)
pnpm build        # production build: astro build (pure static output to dist/)
pnpm run preview      # preview production build locally
```

Use pnpm as the package manager. Keep `pnpm-lock.yaml` and `pnpm-workspace.yaml` tracked.

There is no separate unit/integration test suite configured. Use `pnpm lint`, `pnpm exec astro check` and `pnpm run build` as the baseline validation for most code changes.

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
- `src/scripts/` - client-side TypeScript (dark mode, scroll animations, forms).
- `src/styles/` - CSS: `global.css` (Tailwind entry and tokens) plus component files it imports.
- `public/` - static assets served as-is, mainly `images/`.
- `public/admin/` - Sveltia CMS admin page (`index.html`) and its `config.yml`.
- `netlify.toml` - build options for the manual-only Netlify fallback (not used for production).

## Content
Content is read directly from `src/content/*` at build time via the readers in `src/data/content.ts`; there is no CMS runtime or API. Most content is code-edited in the files. Sveltia CMS (`/admin/`) has one singleton per content file (see `public/admin/config.yml`), committing edits as pull requests against `main`.

YAML root wrappers must not be removed:
- `people.yml` -> `people:` (members and alumni in one list, split by `type: member` / `type: alumnus`)
- `research-papers.yml` -> `papers:`
- `supporters.yml` -> `supporters:`
- `get-involved.yml` -> `cards:`
- `programmes.yml` -> `programmes:`
- `faq.yml` -> `faqs:`
- `site-config.json` has no YAML wrapper; it controls site title, email, OG image, social links, navigation, and footer tagline.

Image paths must use leading `/` public paths:
- People photos: `/images/people/...`
- Research thumbnails: `/images/research/...`
- Supporter logos: `/images/supporters/...`

Long programme descriptions support basic Markdown such as `**bold**`, `_italic_`, and `[link text](url)`.

## Frontend Conventions
- Use British English spellings throughout user-facing content and UI text: colour, organised, centralised, behaviour, programme, fulfil, etc.
- Navigation is centralised in `src/content/site-config.json`; do not hardcode navigation links in `Header.astro`.
- Dark mode is enabled via the `.dark` class on `<html>`, toggled by `src/scripts/dark-mode.ts`, and backed by `@custom-variant dark` plus semantic CSS tokens in `src/styles/global.css`.
- Use semantic Tailwind/CSS tokens such as `surface`, `surface-muted`, `body-text`, `heading-text`, and `muted-text` for surfaces and text where possible.
- Scroll animations use `.reveal` with `style="--reveal-delay: Xms"` for stagger.
- Keep the `html.js-enabled` contract intact for reveal animations in `Layout.astro` and `src/scripts/`.
- External links must have `target="_blank"` when opening a new tab, `rel="noopener noreferrer"`, and a trailing icon:
  ```astro
  <Icon name="fas fa-external-link-alt" class="ml-1 text-xs" />
  ```
- Icons are Font Awesome 6 SVGs inlined at build time by `src/components/Icon.astro` (no icon font or CDN). An unknown icon name fails the build.
- **Jump Navigation**: For long, multi-section pages (e.g. consolidated hubs or resource indices), include a premium, sleek horizontal jump navigation bar (e.g. pill layout with smooth-scrolling anchors and icons) at the top of the content area to improve scannability and user engagement.

## Styling
- Tailwind v4 is configured in CSS through `src/styles/global.css`; there is no `tailwind.config.mjs`.
- `src/styles/global.css` should stay focused on Tailwind imports, `@custom-variant`, `@theme` tokens, and semantic theme values.
- Component patterns, section theming, animations and legacy styles live in the split files under `src/styles/` (`layout.css`, `cards.css`, `buttons.css`, ...), imported by `global.css`.
- Use CSS variables from `:root` for brand colours; avoid hardcoded hex values in component CSS.
- Tailwind v4 patterns are current. Do not reintroduce Tailwind v3 configuration patterns.

Important cascade pitfall: the split CSS files under `src/styles/` are unlayered and can override Tailwind utilities. Avoid broad element resets such as `p { margin: 0 }` or heading margin resets there, because they can silently beat `mt-*` and `mb-*` utilities.

## Content Editing (Sveltia CMS)
Non-technical maintainers edit content via [Sveltia CMS](https://sveltiacms.app) at `/admin/` — a Git-based editor with no SaaS backend. It's hosted: `public/admin/index.html` loads Sveltia from a CDN and reads `public/admin/config.yml`. There is no local CMS process to run and no credentials are needed to build the site. Each save opens a pull request against `main` (editorial workflow) for review before publish. Auth is GitHub OAuth via Netlify (already configured).

The CMS exposes one singleton per content file — Announcement banner, People / Committee, Research papers, Supporters, Site config, Get Involved cards, FAQ, Home page, About page, Programmes and Research page. `public/admin/config.yml` is the source of truth; README §Content Management (CMS) has the file mapping.

- `announcement.yml` -> banner above the header on every page (`src/data/announcement.ts`, rendered in `Layout.astro`); `expires` is evaluated at build time.
- `faq.yml` -> `faqs:` list of `{question, answer}` rendered at `/faq/` with FAQPage JSON-LD.

Content is read directly from the files at build time via `src/data/content.ts`; no CMS runtime client, GraphQL, or editing-preview markup is involved. Page-specific copy is loaded via `src/data/config.ts` (`getHomePageContent()`, `getAboutPageContent()`, `getResearchPageContent()`). Prefer extending content files over adding hardcoded page copy that maintainers may need to edit.

## CI/CD
- `ci.yml` ("Type-check and build") runs `pnpm lint`, `pnpm check`, `pnpm build` and an offline lychee check for dead internal links and `#anchors` on PRs and pushes to `main`.
- Deployment is GitHub Pages only — see the Deployment section above.
- Record build/deploy fixes in `docs/FIX_NOTES.md`.

## File Naming
- Pages: kebab-case, for example `what-is-ai-safety.astro`.
- Components: PascalCase, for example `ResearchCard.astro`.
- Data loaders: camelCase or existing content-name convention, for example `get-involved.ts`.
- YAML content files: kebab-case.
- Images: descriptive kebab-case filenames.

## Pitfalls
- YAML indentation is 2 spaces, never tabs.
- Inline `onerror` image handlers in `.astro` files must use `var`, not `const` or `let`, to avoid Astro TypeScript redeclaration errors.
- Icon SVGs don't stretch in a flex column like the old `<i>` did; add `self-center` (or a wrapper) to centre them.
- Brand SVG/image icons with black fills can become invisible in dark mode. Existing `.cal-icon` CSS handles calendar icons.
- Keep image paths absolute from `public/`, with a leading `/`.
- Keep navigation and social links in `src/content/site-config.json`.
- Check `docs/TODO.md` before broad CSS refactors; it tracks deferred cleanup work.
- The `get-involved.yml` "Join Discord" card links to a Microsoft **Forms** URL by design — an anti-scam gate that vets people before the real invite, not a broken link. Do not "fix" it to a raw Discord invite.
