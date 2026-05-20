# Future Work

## visual overhaul

Problem - current site looks ai generated and generic

ideas:
- replace homepage hero with something people-focused
- go for gothic neural network theme - like durham cathedral identity mixed with ai safety
  - https://claude.ai/chat/0e2c7bee-816c-410a-b0d9-059bf4f2bb48
  - page background is a cathedral corridor with neural network features
  - scrolling down the page could go further down the corridor?
- serif font - just nicer imo, eg. merryweather. at least for headings
- 

## CSS And Components

- Delete redundant `.dark` rules in individual CSS modules where semantic tokens already handle light/dark variants.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind utilities or `@apply` where that reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so styling no longer depends on broad section context selectors.

## Content And CMS

- Add schema validation for `src/content/*.yml` and `site-config.json` in the `src/data/*.ts` loaders, so malformed content fails clearly at build time.
- Add organiser calendar management to Tina CMS if event/calendar ownership moves into the site.
- Move calendar URLs and labels out of `src/pages/index.astro` into content/config if organisers need to update them without code edits.

## Tina Visual Editor Extensions

<!-- - Move the hardcoded homepage hero headline, subheading, CTA labels, CTA links, and background image into Tina so the first viewport can be edited without code changes. -->
- Create a unified visual editor for the homepage (incl supporters - which are duplicated in hero and at bottom - currently the bottom icons are invisible on tina dashboard BUG)
- Move the hardcoded Research Opportunities and Research Areas sections in `src/pages/research.astro` into the Research collection or a new page-content collection. (Completed)
- Move the hardcoded About page mission cards, impact copy, and Join Our Team section into Tina or a page-content collection. (Completed)
- Add visual editing for Site Config fields that visibly render in the header/footer, especially navigation labels, CTA text, social icons, email, and footer tagline.
- Consider a general page-content collection for static pages such as About and What Is AI Safety once the desired editor model is clear.
- [ ] Migrate the "What is AI Safety?" educational page (/what-is-ai-safety) to Tina CMS using a flexible MDX or block-based layout to easily update definitions, timeline items, news references, video embeds, and resource lists without editing code.
- Add a small smoke-test checklist for visual editing: open `/admin/index.html`, select each routed collection, confirm Tina navigates to `#/~...`, click a marked field, and confirm sidebar focus/live refresh.

## Pages

- Break the homepage into smaller sections, starting with events, programmes preview, research preview, and supporters.
- Split page-local JavaScript and styles out of `src/pages/index.astro` once the homepage sections are extracted.
