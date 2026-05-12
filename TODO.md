# Future Work

## CSS And Components

- Delete redundant `.dark` rules in individual CSS modules where semantic tokens already handle light/dark variants.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind utilities or `@apply` where that reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so styling no longer depends on broad section context selectors.

## Content And CMS

- Add schema validation for `src/content/*.yml` and `site-config.json` in the `src/data/*.ts` loaders, so malformed content fails clearly at build time.
- Add organiser calendar management to Tina CMS if event/calendar ownership moves into the site.
- Explore Tina visual editing for Astro pages.
- Move calendar URLs and labels out of `src/pages/index.astro` into content/config if organisers need to update them without code edits.

## Pages

- Break the homepage into smaller sections, starting with events, programmes preview, research preview, and supporters.
- Split page-local JavaScript and styles out of `src/pages/index.astro` once the homepage sections are extracted.
