# Durham AI Safety Initiative Website

The official website for Durham AISI, built with Astro and deployed to GitHub Pages.

## Quick Start

1. Install [Node.js](https://nodejs.org/) (v18+)
2. Clone and run:
   ```bash
   git clone https://github.com/AI-Safety-Durham/AI-Safety-Durham.github.io.git
   cd AI-Safety-Durham.github.io
   npm install
   npm run dev
   ```
3. Open http://localhost:4321 in your browser

## Content Updates (Quick Reference)

| To update... | Edit this file |
|--------------|----------------|
| Team members | `src/data/team.ts` + add photo to `src/assets/team/` |
| Research papers | `src/data/research.ts` |
| Navigation links | `src/components/Header.astro` |
| Footer & social links | `src/components/Footer.astro` |
| Site config (email, title) | `src/data/config.ts` |
| Page content | `src/pages/[pagename].astro` |

### Adding a Team Member

1. Add their photo to `src/assets/team/`
2. Edit `src/data/team.ts`:
   ```ts
   import newPhoto from '../assets/team/photo.jpg';
   
   // Add to the team array:
   { name: "Name", role: "Role", photo: newPhoto, link: "https://..." }
   ```

### Adding a Research Paper

Edit `src/data/research.ts` and add:
```ts
{
  title: "Paper Title",
  url: "https://link-to-paper",
  authors: [{ name: "Surname, F." }],
  year: 2025,
  venue: "Conference Name",
  tags: ["Topic", "Conference 2025"]
}
```
Team member authors are auto-bolded.

## Deployment

Changes pushed to `main` auto-deploy to GitHub Pages via GitHub Actions.

## Brand Colors

Defined in `tailwind.config.mjs`:
- `durham-purple` (#68246D) - Primary
- `bright-purple` (#EB80FD) - Accent
- `light-purple` (#E2ACFE) - Light accent

## Troubleshooting

- **Build errors**: Run `npm run build` locally to see details
- **Changes not appearing**: Check the Actions tab on GitHub for build status
- **Images not loading**: Paths should start with `/` for public assets

## License

- Code: [MIT License](./LICENSE.md)
- Content: [CC BY 4.0](./CONTENT_LICENSE.md) (except team photos, personal data, and logos)
