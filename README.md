# Durham AI Safety Initiative Website

[![Deploy Astro site to GitHub Pages](https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io/actions/workflows/deploy-astro.yml/badge.svg)](https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io/actions/workflows/deploy-astro.yml)
[![PR Validation](https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io/actions/workflows/pr-validation.yml)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The official website for DAISI, built with Astro and deployed with Netlify at **[durhamaisafety.uk](https://durhamaisafety.uk)**.

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v18+)
2. Clone and run:
   ```bash
   git clone https://github.com/DurhamAISafety/durhamaisafety.github.io.git
   cd durhamaisafety.github.io
   npm install
   npm run dev
   ```
3. Open http://localhost:4321 in your browser

## Content Updates (Quick Reference)

| To update... | Edit this file |
|--------------|----------------|
| Team members | `src/content/team.yml` + add photo to `src/assets/team/` |
| Alumni | `src/content/alum.yml` + add photo to `src/assets/team/` |
| Supporters | `src/content/supporters.yml` + add logo to `public/images/supporters/` |
| Research papers | `src/content/research.yml` |
| Navigation links | `src/data/config.ts` (`siteConfig.navigation`) |
| Footer & social links | `src/data/config.ts` (`siteConfig.social`) |
| Site config (email, title) | `src/data/config.ts` |
| Page content | `src/pages/[pagename].astro` |

### Adding a Team Member

1. Add their photo to `src/assets/team/` (supported: `.jpg`, `.jpeg`, `.png`, `.webp`)
2. Edit `src/content/team.yml` and add:
   ```yaml
   - name: Alice Smith
     role: Co-organiser
     photo: alice.jpg
     linkedin: https://www.linkedin.com/in/alice-smith/        # optional
     durham-staff-link: https://www.durham.ac.uk/staff/alice/  # optional
     link: https://example.com                                 # optional (generic)
   ```

See the example template at the top of `team.yml` for more details.
`src/content/alum.yml` works the same way; alumni also support a `years_active` field.

### Adding a Research Paper

Edit `src/content/research.yml` and add at the top (most recent first):
```yaml
- title: "Paper Title"
  url: https://link-to-paper
  thumbnail: paper.png          # Optional: image in src/assets/research/
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

See the example template at the top of `research.yml` for all options.

## Deployment

Changes pushed to `main` trigger two deployments automatically:

| Host | URL | Role |
|---|---|---|
| **Netlify** | [durhamaisafety.uk](https://durhamaisafety.uk) | Primary — full Astro build, Lighthouse, custom domain |
| **GitHub Pages** | [durhamaisafety.github.io](https://durhamaisafety.github.io) | Redirect fallback → durhamaisafety.uk |

Netlify configuration lives in [`netlify.toml`](./netlify.toml). The canonical domain is set in [`astro.config.mjs`](./astro.config.mjs).

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
