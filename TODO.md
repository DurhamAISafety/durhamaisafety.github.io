# Future Work

## [NEEDS FIX] TinaCMS visual editing works on local dev but not tinacloud (/admin/ page on live build)

[24/05/2026]
Tried several things - LLMs just can't figure it out.
Current plan: just wait as it's not urgent and see if tinacms devs fix it, since the astro visual editing is very new.

Concerns packages:
- "@tinacms/astro" --> this is apparently all we need
- "@tinacms/bridge" --> apparently astro frontend doesnt need this, but i tried adding it anyway to see if it fixed the problem

References:
- Initial astro vis editing release: https://github.com/tinacms/tinacms/releases/tag/tinacms%403.8.0
- reference example: https://github.com/tinacms/tinacms/tree/main/examples/astro/visual-editing


## CSS And Components

- Delete redundant `.dark` rules in individual CSS modules where semantic tokens already cover light/dark variants.
- Migrate simple reusable classes such as `.btn-cta` and `.section-heading` to Tailwind utilities or `@apply` only where it reduces custom CSS.
- Extract repeated card patterns into Astro components with explicit `variant` props, so styling no longer depends on broad section context selectors.

## Visual Editing QA

- Add a manual smoke-test checklist for Tina visual editing.
  - Open `/admin/index.html`.
  - Open each routed collection.
  - Confirm Tina navigates to the expected preview route.
  - Click a marked field in the preview.
  - Confirm the sidebar focuses the matching field.
  - Edit a field and confirm the relevant island live-refreshes.
- After the manual checklist is stable, consider a small Playwright smoke test for the public routes. Full Tina editor automation can wait.

## Content And Design

- Replace informal visual-overhaul notes with a short design spec before implementation.
  - Direction to explore: a more people-focused homepage while keeping Durham Cathedral/Durham identity visible.
  - Possible visual motif: restrained gothic/neural-network treatment, avoiding generic AI gradients.
  - Use Merriweather or another serif for headings only if it fits the final design direction; keep body/UI text readable and restrained.
- Add organiser calendar management to Tina only if event/calendar ownership moves into the site.
