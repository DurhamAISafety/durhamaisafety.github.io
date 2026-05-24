# Future Work

## [FIX NEEDED] Netlify deploys
Problem:
- Netlify automatically deploys the site to production when changes are pushed to main branch. These builds consistently fail because of issues relating to pnpm I think.
- However, `npx netlify deploy` and `npx netlify deploy --prod` both work!

Ideas:
- need to change prod env / something in netlify.toml ? MUST use .agents/skills/netlify-deploy

## Netlify minutes
Problem:
- limited netlify minutes get used up quickly by tina cms pushes, because netlify automatically deploys from main on every push to main.

Proposed solution:
- set up a workflow that automatically runs (eg. twice a day) `npx netlify deploy --prod` if non-prod version succeeds. 
- This should only run if the main branch has been updated since the last deploy
- Then turn off automatic deploys whenever something is pushed to main branch.
- Alternatively, could use something like https://docs.netlify.com/build/configure-builds/build-hooks/


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
