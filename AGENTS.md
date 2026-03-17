# Project Guidelines

## Project Snapshot
Static website built with Astro 5 and Tailwind CSS v3, deployed to https://durhamaisafety.uk via Netlify.
Content edits are done through Tina CMS at `/admin/` and saved back into YAML files.

## Build And Validation
Run these after every change:

```bash
npx astro check
npm run build
```

For local development:

```bash
npm run dev
```

For link-heavy or navigation changes, run link checks after `npm run build`:

```bash
lychee --base https://durhamaisafety.uk --max-concurrency 8 --accept 200,201,204,301,302,303,307,308,429 --timeout 20 --max-retries 3 --user-agent "Mozilla/5.0 (compatible; LinkChecker/1.0)" --exclude "http://localhost*" --exclude "https://localhost*" --exclude "http://127.0.0.1*" --exclude "https://example.com*" --exclude "https://twitter.com/*" --exclude "https://x.com/*" --exclude "https://linkedin.com/in/*" --exclude "https://www.linkedin.com/in/*" --exclude "https://scholar.google.com/*" --exclude "https://www.durham.ac.uk/*" --exclude "https://durham.ac.uk/*" --exclude "https://www.durhamsu.com/*" --exclude "https://durhamsu.com/*" --exclude "https://durhamaisafety.uk/404*" --exclude "https://durhamaisafety.uk/_astro/*" --cache --verbose './dist/**/*.html'
```

## Architecture
Use the existing YAML -> TypeScript -> Astro flow:

1. `src/content/*.yml`: source content
2. `src/data/*.ts`: YAML parsing, typing, data shaping
3. `src/pages/*.astro` and `src/components/*.astro`: rendering typed data

Do not read raw YAML directly from Astro pages/components.

## Tina-First Content Workflow
Default to Tina CMS for content updates.

- Open `/admin/` and edit people, research, and supporters there.
- Tina commits changes to the YAML files and triggers deploys.
- Use manual YAML edits only when explicitly requested or when changing schema/model structure.

Tina config and schema live in `tina/config.ts`.
Tina generated files are in `tina/__generated__/` (gitignored).
Use `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` for local/Netlify config.

## Content Conventions
Keep YAML root wrappers intact (no bare arrays):

- `src/content/people.yml` -> `people:`
- `src/content/research.yml` -> `papers:`
- `src/content/supporters.yml` -> `supporters:`

People/alumni are stored in one list (`people:`) and split in `src/data/people.ts` by `type: member` or `type: alumnus`.

Image path rules:

- People photos: `/images/people/...`
- Research thumbnails: `/images/research/...`
- Supporter logos: `/images/supporters/...`

Use leading `/` for `public/` assets.

## Frontend Conventions
- Keep navigation centralised in `src/data/config.ts` (`siteConfig.navigation`).
- Do not hardcode nav links in `src/components/Header.astro`.
- Dark mode is disabled; do not add new dark-mode-dependent behavior.
- Use `.reveal` for scroll animations, with `style="--reveal-delay: Xms"` for stagger.
- External links with `target="_blank"` must include `rel="noopener noreferrer"`.
- Add external-link icon after external link text:

```html
<i class="fas fa-external-link-alt ml-1 text-xs" aria-hidden="true"></i>
```

## Styling Rules
- Prefer Tailwind utilities for layout and spacing.
- Use component-level styles from `public/css/styles.css` when pattern reuse is better.
- Do not hardcode new brand hex values; use CSS variables from `:root` in `public/css/styles.css`.
- Tailwind v4 migration is deferred; keep Tailwind v3 patterns.

## Pitfalls
- YAML uses 2-space indentation; never tabs.
- Keep progressive enhancement intact for reveal animations (`html.js-enabled` contract in layout/main.js).
- For inline `onerror="..."` image handlers, use `var` (not `const`/`let`) to avoid Astro TS redeclaration issues.
