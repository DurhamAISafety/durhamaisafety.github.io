# Future Work


## CSS And Components

- Delete redundant `.dark` rules in individual CSS modules where semantic tokens already cover light/dark variants.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind utilities or `@apply` only where it reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so styling no longer depends on broad section context selectors.

## Content And Design

- Replace informal visual-overhaul notes with a short design spec before implementation.
  - Direction to explore: a more people-focused homepage while keeping Durham Cathedral/Durham identity visible.
  - Possible visual motif: restrained gothic/neural-network treatment, avoiding generic AI gradients.
  - Use Merriweather or another serif for headings only if it fits the final design direction; keep body/UI text readable and restrained.
- Add organiser calendar management to the CMS (Sveltia) only if event/calendar ownership moves into the site.
