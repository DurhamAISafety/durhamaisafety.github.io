# Copilot Instructions: Durham AI Safety Initiative Website

## Project Overview
Static website built with **Astro 5**, **Tailwind CSS**, and deployed to **GitHub Pages**. Content is managed via YAML files, not a CMS.

## Architecture Pattern: YAML → TypeScript → Astro

Content updates flow through a three-layer architecture:

1. **Content Layer** (`src/content/*.yml`): YAML files for team, research, supporters
2. **Data Layer** (`src/data/*.ts`): Parse YAML with `yaml` package, add TypeScript types, auto-import assets
3. **Component Layer** (`src/pages/*.astro`, `src/components/*.astro`): Consume typed data

**Example:** Adding a team member:
- Add photo to `src/assets/team/alice.jpg`
- Edit `src/content/team.yml` with name/role/photo filename
- `src/data/team.ts` automatically imports the photo via `import.meta.glob()` and maps filename → ImageMetadata
- No code changes needed in components!

## Critical Patterns

### Asset Auto-Import System
Files in `src/data/*.ts` use Vite's `import.meta.glob()` to automatically discover assets:

```typescript
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/team/*.{jpeg,jpg,png,webp,gif}',
  { eager: true }
);
```

**When adding new asset types**, update the glob pattern and create a mapping from filename → ImageMetadata.

### YAML Content Schema
All YAML files have inline documentation templates at the top. When adding fields:
- Add to the TypeScript interface in corresponding `src/data/*.ts` file
- Update the example template in the YAML file
- Preserve sorting rules (research papers: newest first by `year` then `month`)

### Brand Colors (Tailwind)
Use Durham-specific classes from [tailwind.config.mjs](tailwind.config.mjs):
- `durham-purple` (#68246D) - Primary brand color
- `bright-purple` (#EB80FD) - Accent/highlights
- `light-purple` (#E2ACFE) - Lighter accent

Legacy ocean/teal colors exist but prefer purple variants for new features.

### Layout Structure
- Base layout: [src/layouts/Layout.astro](src/layouts/Layout.astro) - Handles SEO, structured data, meta tags
- All pages import Layout and pass `title`, `description`, `heroImage` props
- Pages are in `src/pages/*.astro` (file-based routing)
- Shared components: [src/components/Header.astro](src/components/Header.astro), [src/components/Footer.astro](src/components/Footer.astro)

### Navigation
Navigation links are centralized in [src/data/config.ts](src/data/config.ts) under `siteConfig.navigation`. Header component reads from this config - **do not hardcode nav links in Header.astro**.

## Development Workflow

**Local dev:** `npm run dev` → http://localhost:4321

**Build test:** `npm run build` (always run before pushing to catch errors)

**Deployment:** Push to `main` → GitHub Actions auto-deploys to GitHub Pages

## Common Tasks

**Add team member:**
1. Save photo to `src/assets/team/` (jpg/png/webp)
2. Add entry to `src/content/team.yml` with `name`, `role`, `photo` filename
3. No code changes needed

**Add research paper:**
1. (Optional) Save thumbnail to `src/assets/research/`
2. Add entry at **top** of `src/content/research.yml` with required fields: `title`, `url`, `authors`, `year`, `venue`, `tags`, `type`
3. Mark DAISI members with `team: true` in authors array

**Update site config (email, social links):**
Edit [src/data/config.ts](src/data/config.ts)

**Add new page:**
Create `src/pages/pagename.astro` - file-based routing means `/pagename/` URL automatically

## Gotchas

- **YAML indentation:** Use 2 spaces, not tabs. Arrays need `-` prefix.
- **Image paths in public/:** Reference with leading `/` (e.g., `/images/logo.png`)
- **Image paths from src/assets/:** Import via `import.meta.glob()` or direct `import` statements
- **Research sorting:** Auto-sorted in `src/data/research.ts` by year descending, then month descending
- **Team member boldness:** Authors with `team: true` are bolded in research cards
