# Tina Visual Editing for Programmes and Get Involved Design

## Goal

Enable TinaCMS visual editing for the `programmes` and `get-involved` content slices, using the new `@tinacms/astro` bridge so editors can click page regions, focus the right Tina form field, and see preview updates without React islands.

## Current State

The site already has the correct integration shape for the new Tina Astro bridge:

- `astro.config.mjs` imports `@tinacms/astro/integration` and includes `tina()` in `integrations`.
- The Netlify adapter is configured and Astro runs with `output: 'server'`.
- The current checkout passes `npx astro check` and `npm run build`.

The missing piece is data flow. `src/data/programmes.ts` and `src/data/get-involved.ts` currently import YAML directly and parse it with `yaml`. That keeps normal builds simple, but it bypasses Tina's generated GraphQL client. As a result, rendered objects do not carry the metadata that `tinaField()` needs, and edit-mode responses cannot register forms with the bridge.

## Scope

This first migration covers:

- `src/content/programmes.yml`
- `src/content/get-involved.yml`
- `/programmes/`
- `/get-involved/`
- Homepage programme cards that reuse `programmes` content

It does not cover:

- Global site config, header navigation, footer, metadata, or layout editing.
- People, alumni, research, supporters, or homepage hero content.
- Rich-text migration to Tina rich text fields. Existing simple Markdown rendering for programme long descriptions remains in place.

## Architecture

Keep `src/data` as the content boundary. Pages and components should continue to import typed helper functions from `src/data/*`; they should not call Tina queries directly unless there is a strong route-specific reason.

The migrated data loaders will expose async functions:

- `getProgrammesContent()`
- `getGetInvolvedContent()`

Each function will call `client.queries.<collection>({ relativePath })`, wrap the result in `requestWithMetadata()`, normalise nullable Tina values into the existing frontend types, and preserve the source object references needed by `tinaField()`.

The page templates will add `data-tina-field` markers on obvious editable text and link fields. For list items, markers will be attached to the specific item object returned by Tina where possible, not to a copied plain object.

## Visual Editing Behaviour

In Tina edit mode:

- Clicking a programme title, description, tag, audience item, feature-box field, or get-involved card field should focus the relevant Tina sidebar field.
- The admin should see the right form for the page content.
- Production visitors should not receive bridge scripts or hidden `data-tina-form` payloads.

Live preview should be implemented in the smallest useful form first:

- Add Tina island support for the full `/programmes/` content region.
- Add Tina island support for the full `/get-involved/` card region.
- Defer finer per-card islands unless the full-region refresh feels too heavy in practice.

## Files and Responsibilities

- `src/data/programmes.ts`: Tina-backed programmes loader, existing types, Markdown helper, slug helper.
- `src/data/get-involved.ts`: Tina-backed get-involved loader and featured/more split helper.
- `src/pages/programmes.astro`: async data load, Tina field markers, programme island wrapper.
- `src/pages/get-involved.astro`: async data load, Tina field markers, get-involved island wrapper.
- `src/pages/index.astro`: async programmes load for homepage cards and field markers on homepage programme summaries.
- `src/lib/tina-islands.ts`: registry for editable island names and render functions.
- `src/pages/tina-island/[name].ts`: dynamic island endpoint backed by the registry.

## Validation

Baseline validation for each stage:

- `npx astro check`
- `npm run build`

Manual editor validation after implementation:

- Run `npm run dev`.
- Open `/admin/`.
- Edit programmes and get-involved content.
- Confirm click-to-focus, form selection, and live preview updates for the migrated regions.

## Rollout

Commit in stages:

1. Planning docs.
2. Tina-backed data loaders and build-preserving page updates.
3. Visual-editing markers and islands.
4. Final validation fixes.

This keeps the branch reviewable and makes it easy to bisect if the editor bridge exposes a package or runtime issue.
