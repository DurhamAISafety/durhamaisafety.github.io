# Durham AI Safety Initiative Website

[![Netlify Deploy](https://github.com/DurhamAISafety/durhamaisafety.github.io/actions/workflows/deploy-netlify.yml/badge.svg)](https://github.com/DurhamAISafety/durhamaisafety.github.io/actions/workflows/deploy-netlify.yml)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The official website for DAISI, built with Astro and deployed with Netlify at **[durhamaisafety.uk](https://durhamaisafety.uk)**. Content can be edited directly in the YAML/JSON files below, or via the [Sveltia CMS](https://sveltiacms.app) editor at [/admin/](https://durhamaisafety.uk/admin/).

## Quick Start

1. Clone and install:
   ```bash
   git clone https://github.com/DurhamAISafety/durhamaisafety.github.io.git
   cd durhamaisafety.github.io
   pnpm install
   ```
2. Start the dev server:
   ```bash
   pnpm dev
   ```
3. Open http://localhost:4321 to view the site

No credentials or `.env` are needed for local development — the site builds and runs entirely from the content files. The content editor is a hosted admin page (see [Content Management (CMS)](#content-management-cms)).

## Content Updates (Quick Reference)

All content below is edited directly in the file. Three collections — People, Research papers, and Supporters — can also be edited via the hosted CMS at [durhamaisafety.uk/admin](https://durhamaisafety.uk/admin); everything else is file-only.

| To update... | Edit this file | CMS section |
|---|---|---|
| Home page text & headers | `src/content/pages/home.yml` | — |
| About page intro & impact | `src/content/pages/about.yml` | — |
| Research opportunities & areas | `src/content/pages/research.yml` | — |
| Team members | `src/content/people.yml` + photo to `public/images/people/` | **People / Committee** |
| Alumni | `src/content/people.yml` + photo to `public/images/people/` | **People / Committee** |
| Supporters | `src/content/supporters.yml` + logo to `public/images/supporters/` | **Supporters** |
| Research papers | `src/content/research-papers.yml` | **Research papers** |
| Programmes | `src/content/programmes.yml` | — |
| Get Involved cards | `src/content/get-involved.yml` | — |
| Navigation links | `src/content/site-config.json` | — |
| Social links | `src/content/site-config.json` | — |
| Site title, email, OG image | `src/content/site-config.json` | — |
| Footer tagline | `src/content/site-config.json` | — |

### Adding a Team Member

1. Add their photo to `public/images/people/` (supported: `.jpg`, `.jpeg`, `.png`, `.webp`)
2. Edit `src/content/people.yml` and add a new entry under the `people:` key with `type: member`:
   ```yaml
   people:
     - name: Alice Smith
       type: member
       role: Co-organiser
       start_year: 2025
       photo: /images/people/alice.jpg
       linkedin: https://www.linkedin.com/in/alice-smith/        # optional
       durham-staff-link: https://www.durham.ac.uk/staff/alice/  # optional
       link: https://example.com                                 # optional (generic)
   ```

Alumni live in the same file — use `type: alumnus` instead of `type: member`, and optionally add a `years_active` field (e.g. `"2023-2024"`).

### Adding a Research Paper

Edit `src/content/research-papers.yml` and add at the top of the `papers:` list (most recent first):
```yaml
papers:
  - title: "Paper Title"
    url: https://link-to-paper
    thumbnail: /images/research/paper.png  # Optional: full public image path
    authors:
      - name: "Surname, F."
      - name: "Member, A."
        team: true                # Bold DAISI member names
    year: 2025
    month: 7                      # 1-12 for sorting (most recent first)
    venue: "ICML 2025"            # Shown as grey tag
    tags:
      - Interpretability          # Purple topic tags
    type: academic                # or 'non-academic'
```

### Adding or Editing a Programme

Edit `src/content/programmes.yml`. Each programme supports:

- `title`, `icon` (Font Awesome class), `short_description` — shown on the homepage card
- `long_description` — shown on the Programmes page; supports basic Markdown (`**bold**`, `_italic_`, `[link](url)`)
- `tags` — up to 3 icon+label pairs shown on the homepage card
- `whos_this_for` — bullet points shown in the right column on the Programmes page
- `feature_boxes` — optional coloured grid of up to 3 boxes, each with an icon, title, description, and optional link

The order of programmes in the file determines their order on the site and in the navigation.

### Adding or Editing a Get Involved Card

Edit `src/content/get-involved.yml`. Each card has:

- `title`, `description`, `icon` (Font Awesome class)
- `link_url`, `link_label`, `external` (opens in new tab if true)
- `featured` — featured cards appear in the top highlighted row; non-featured appear in the "More Ways to Get Involved" section below
- `recommended_label` — optional label on featured cards (e.g. `✨ Recommended`); leave blank to hide

### Updating Site Config

Edit `src/content/site-config.json` to update:

- **Site title and description** — used in browser tabs, OG tags, and the footer
- **Contact email** — shown in the footer and used for mailto links
- **Default OG image** — fallback social sharing image (1200×630px recommended)
- **Social links** — each link has a name, URL, icon image path, and an `inHeader` toggle (up to 4 links appear as icons in the desktop/mobile header)
- **Navigation** — main nav links and the header CTA button
- **Footer tagline** — short text shown under the email in the footer

## Content Management (CMS)

The site uses [Sveltia CMS](https://sveltiacms.app) — a lightweight, Git-based editor with no SaaS backend. It's hosted at [durhamaisafety.uk/admin](https://durhamaisafety.uk/admin); no local setup is needed to use it.

Sveltia commits edits to GitHub through an **editorial workflow**: each save opens a pull request against `main` that a maintainer reviews and merges before it goes live. Login uses **GitHub OAuth via Netlify** (OAuth app + Netlify provider, already configured). Anyone editing needs write access to the repo.

The CMS exposes three collections:

| CMS Section | File edited |
|---|---|
| People / Committee | `src/content/people.yml` |
| Research papers | `src/content/research-papers.yml` |
| Supporters | `src/content/supporters.yml` |

Everything else — home, about, research page, programmes, get-involved, and site config — is edited directly in the files under `src/content/`. The **About page is intentionally not in the CMS**: its text contains hand-written HTML links, so it's edited in code at `src/content/pages/about.yml`.

Content is read directly from `src/content/*` at build time — there is no CMS runtime or API. The `src/data/*.ts` modules parse the YAML/JSON via the `readYaml` / `readJson` helpers in [src/data/content.ts](./src/data/content.ts). Keep the data boundary intact: pages and components import typed helpers from `src/data`, not the raw content files. The Sveltia config (backend, collections, fields) lives in [public/admin/config.yml](./public/admin/config.yml).

---

## Deployment

To conserve Netlify build minutes and ensure robust builds under `pnpm` strict non-hoisting, our deployment system and local workflow are fully optimized:

### Decoupled Build Orchestration

1. **Netlify Production Site**:
   - Deployed at **[durhamaisafety.uk](https://durhamaisafety.uk)**.
   - Built and deployed via **GitHub Actions** (`Netlify Deploy` workflow) on every push to `main`, or manually triggered on-demand.
   - This shifts all build computation to GitHub's free runners, reducing Netlify Build Minute consumption to **zero**!
   - Automatic Git triggers are disabled in the Netlify Dashboard to avoid burning minutes on CMS git saves.
2. **GitHub Pages (Redirect Site)**:
   - Deployed at **[durhamaisafety.github.io](https://durhamaisafety.github.io)** on every push to `main` to serve as a redirect fallback.

---

### Local Netlify CLI Commands

When executing Netlify commands locally under `pnpm`, avoid running `pnpm dlx netlify` without `--package` as `netlify-cli` ships multiple binaries and triggers a `[ERR_PNPM_DLX_MULTIPLE_BINS]` error. Instead, use:
*   **Check status**: `npx netlify status`
*   **Local build preview**: `npx netlify build`
*   **Deploy preview**: `npx netlify deploy`
*   **Production deploy**: `npx netlify deploy --prod`

---

### Pure static build

The site is a **pure static** Astro build (no adapter, no serverless functions). `pnpm build`
runs `astro build` and outputs to `dist/`, which Netlify publishes directly — so there is no
`[functions]` block or SSR bundling to configure. This keeps builds simple and Netlify usage low.

For historical build/troubleshooting notes, see [docs/FIX_NOTES.md](./docs/FIX_NOTES.md).

## Key Reference Links

- Email: durhamaisi@durham.ac.uk
- Homepage: https://DurhamAISafety.uk
- Instagram: https://www.instagram.com/ais_durham
- Discord: https://forms.office.com/pages/responsepage.aspx?id=i9hQcmhLKUW-RNWaLYpvlEQMKT_SiZBCt87btAf__xhUQlRIVUdZSk5MUEJYSEFLQ0lUMFI1Wk41Ty4u
- LinkedIn: https://www.linkedin.com/company/durhamaisafety/
- LinkTree: https://linktr.ee/aisdurham
- GitHub: https://github.com/DurhamAISafety
- Events Calendar: https://luma.com/daisi

## Brand Colors

Defined in `src/styles/global.css` (`@theme {}` block):
- `durham-purple` (#68246D) - Primary
- `bright-purple` (#EB80FD) - Accent
- `light-purple` (#E2ACFE) - Light accent

## Troubleshooting

- **Build errors**: Run `pnpm build` locally to see details
- **Changes not appearing**: Check the Actions tab on GitHub for build status
- **Images not loading**: Paths should start with `/` for public assets
- **YAML errors**: Check indentation (use 2 spaces, not tabs)

## License

- Code: [MIT License](./LICENSE)
- Content: [CC BY 4.0](./CONTENT_LICENSE.md) (except team photos, personal data, and logos)
