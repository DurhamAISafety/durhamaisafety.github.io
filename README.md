# Durham AI Safety Initiative Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/a0b6c037-c40b-4180-89c3-5df235e24684/deploy-status)](https://app.netlify.com/projects/durhamaisafety/deploys)
[![PR Validation](https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io/actions/workflows/pr-validation.yml)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The official website for DAISI, built with Astro and deployed with Netlify at **[durhamaisafety.uk](https://durhamaisafety.uk)**. Content can be edited directly in the YAML/JSON files below, or via the [Tina CMS](https://app.tina.io) editor at [/admin/](https://durhamaisafety.uk/admin/).

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v18+)
2. Clone and install:
   ```bash
   git clone https://github.com/DurhamAISafety/durhamaisafety.github.io.git
   cd durhamaisafety.github.io
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your [Tina Cloud credentials](#content-management-cms) (required to run the CMS editor locally)
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:4321 to view the site, or http://localhost:4321/admin to open the CMS editor

## Content Updates (Quick Reference)

All content below can be edited either directly in the file or via the CMS at [durhamaisafety.uk/admin](https://durhamaisafety.uk/admin).

| To update... | Edit this file | CMS section |
|---|---|---|
| Team members | `src/content/people.yml` + photo to `public/images/people/` | **People** |
| Alumni | `src/content/people.yml` + photo to `public/images/people/` | **People** |
| Supporters | `src/content/supporters.yml` + logo to `public/images/supporters/` | **Supporters** |
| Research papers | `src/content/research.yml` | **Research Papers** |
| Programmes | `src/content/programmes.yml` | **Programmes** |
| Get Involved cards | `src/content/get-involved.yml` | **Get Involved Cards** |
| Navigation links | `src/content/site-config.json` | **Site Config → Navigation** |
| Social links | `src/content/site-config.json` | **Site Config → Social Links** |
| Site title, email, OG image | `src/content/site-config.json` | **Site Config** |
| Footer tagline | `src/content/site-config.json` | **Site Config → Footer Tagline** |
| Page content | `src/pages/[pagename].astro` | *(not CMS-editable)* |

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

Edit `src/content/research.yml` and add at the top of the `papers:` list (most recent first):
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

Edit `src/content/site-config.json` (or use the CMS **Site Config** section) to update:

- **Site title and description** — used in browser tabs, OG tags, and the footer
- **Contact email** — shown in the footer and used for mailto links
- **Default OG image** — fallback social sharing image (1200×630px recommended)
- **Social links** — each link has a name, URL, icon image path, and an `inHeader` toggle (up to 4 links appear as icons in the desktop/mobile header)
- **Navigation** — main nav links and the header CTA button
- **Footer tagline** — short text shown under the email in the footer

## Content Management (CMS)

The site uses [Tina CMS](https://tina.io) — a Git-backed editor that writes directly to the content files. Changes made in the CMS are committed to the repo and trigger a Netlify deploy automatically.

The simplest way to edit content is through the live editor at [durhamaisafety.uk/admin](https://durhamaisafety.uk/admin) — no local setup needed.

The following collections are available in the CMS:

| CMS Section | File edited |
|---|---|
| Site Config | `src/content/site-config.json` |
| People | `src/content/people.yml` |
| Research Papers | `src/content/research.yml` |
| Supporters | `src/content/supporters.yml` |
| Get Involved Cards | `src/content/get-involved.yml` |
| Programmes | `src/content/programmes.yml` |

### Local CMS setup

To run the CMS editor locally, you need credentials for the existing Tina Cloud project. Get the **Client ID** and **Read-only token** from a current maintainer or from the [Tina Cloud dashboard](https://app.tina.io) (you'll need to be added as a collaborator first).

Once you have them:

1. Copy `.env.example` to `.env` and paste in the values:
   ```
   TINA_CLIENT_ID=...
   TINA_TOKEN=...
   ```
2. Run the dev server:
   ```bash
   npm run dev
   # visit http://localhost:4321/admin
   ```

The Tina config (schema, collections) lives in [tina/config.ts](./tina/config.ts).

---

## Deployment

Changes pushed to `main` trigger two deployments automatically:

| Host | URL | Role |
|---|---|---|
| **Netlify** | [durhamaisafety.uk](https://durhamaisafety.uk) | Primary — full Astro build, custom domain |
| **GitHub Pages** | [durhamaisafety.github.io](https://durhamaisafety.github.io) | Redirect fallback → durhamaisafety.uk |

The build command is `tinacms build && astro build`. The canonical domain is set in [`astro.config.mjs`](./astro.config.mjs).

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

Defined in `tailwind.config.mjs`:
- `durham-purple` (#68246D) - Primary
- `bright-purple` (#EB80FD) - Accent
- `light-purple` (#E2ACFE) - Light accent

## Troubleshooting

- **Build errors**: Run `npm run build` locally to see details
- **Changes not appearing**: Check the Actions tab on GitHub for build status
- **Images not loading**: Paths should start with `/` for public assets
- **YAML errors**: Check indentation (use 2 spaces, not tabs)

## License

- Code: [MIT License](./LICENSE)
- Content: [CC BY 4.0](./CONTENT_LICENSE.md) (except team photos, personal data, and logos)