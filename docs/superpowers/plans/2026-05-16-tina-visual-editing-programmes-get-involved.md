# Tina Visual Editing Programmes Get Involved Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the programmes and get-involved content paths to Tina-backed Astro visual editing.

**Architecture:** Keep `src/data` as the content boundary. Data loaders call Tina's generated client through `requestWithMetadata()`, pages render typed data plus `tinaField()` markers, and optional Tina islands refresh the two migrated page regions in edit mode.

**Tech Stack:** Astro 5, Netlify SSR adapter, TinaCMS 3, `@tinacms/astro`, TypeScript, YAML content managed by Tina.

---

## File Structure

- Modify `src/data/programmes.ts`: replace direct YAML parsing for rendered content with an async Tina query loader while preserving `renderMarkdown()` and `programmeSlug()`.
- Modify `src/data/get-involved.ts`: replace direct YAML parsing for rendered content with an async Tina query loader and split helpers.
- Modify `src/pages/programmes.astro`: await the programmes loader, add `data-tina-field` markers, and wrap the content region in a Tina island.
- Modify `src/pages/get-involved.astro`: await the get-involved loader, add `data-tina-field` markers, and wrap the card region in a Tina island.
- Modify `src/pages/index.astro`: await the programmes loader for homepage cards and keep the existing homepage layout.
- Create `src/lib/tina-islands.ts`: island registry for `programmes` and `get-involved`.
- Create `src/pages/tina-island/[name].ts`: dynamic endpoint using `experimental_createIslandRoute()`.

## Task 1: Make Programmes Data Tina-Backed

**Files:**
- Modify: `src/data/programmes.ts`

- [ ] **Step 1: Replace direct YAML export with an async Tina loader**

Use the generated client and `requestWithMetadata()`:

```ts
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  ProgrammesProgrammes,
  ProgrammesQuery,
} from '../../tina/__generated__/types';
```

Add these types and helper:

```ts
export type ProgrammeSource = NonNullable<
  NonNullable<ProgrammesQuery['programmes']['programmes']>[number]
>;

export interface Programme extends Omit<ProgrammesProgrammes, '__typename'> {
  _source: ProgrammeSource;
  tags?: ProgrammeTag[];
  whos_this_for?: WhosThisFor[];
  feature_boxes?: FeatureBoxes;
}

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];
```

Implement the loader:

```ts
export async function getProgrammesContent(): Promise<{
  document: ProgrammesQuery['programmes'];
  programmes: Programme[];
}> {
  const result = await requestWithMetadata(
    client.queries.programmes({ relativePath: 'programmes.yml' })
  );

  const document = result.data.programmes;
  const programmes = compact(document.programmes).map((programme) => ({
    ...programme,
    _source: programme,
    tags: compact(programme.tags),
    whos_this_for: compact(programme.whos_this_for),
    feature_boxes: programme.feature_boxes
      ? {
          ...programme.feature_boxes,
          items: compact(programme.feature_boxes.items),
        }
      : undefined,
  }));

  return { document, programmes };
}
```

- [ ] **Step 2: Preserve helpers**

Keep `renderMarkdown(input: string)` and `programmeSlug(title: string)` unchanged except for removing stale comments that say the data is direct YAML.

- [ ] **Step 3: Run Astro check**

Run: `npx astro check`

Expected: the existing pages will fail until they are updated from sync imports to async loaders. Continue to Task 2 before treating this as a blocker.

## Task 2: Make Get Involved Data Tina-Backed

**Files:**
- Modify: `src/data/get-involved.ts`

- [ ] **Step 1: Replace direct YAML export with an async Tina loader**

Use the generated client and `requestWithMetadata()`:

```ts
import { requestWithMetadata } from '@tinacms/astro';
import client from '../../tina/__generated__/client';
import type {
  GetInvolvedCards,
  GetInvolvedQuery,
} from '../../tina/__generated__/types';
```

Define source-preserving card types:

```ts
export type GetInvolvedCardSource = NonNullable<
  NonNullable<GetInvolvedQuery['getInvolved']['cards']>[number]
>;

export interface GetInvolvedCard extends Omit<GetInvolvedCards, '__typename'> {
  _source: GetInvolvedCardSource;
  external: boolean;
  featured: boolean;
}

const compact = <T>(items: Array<T | null> | null | undefined): T[] =>
  items?.filter((item): item is T => item !== null) ?? [];
```

Implement the loader and splitter:

```ts
export async function getGetInvolvedContent(): Promise<{
  document: GetInvolvedQuery['getInvolved'];
  cards: GetInvolvedCard[];
  featuredCards: GetInvolvedCard[];
  moreCards: GetInvolvedCard[];
}> {
  const result = await requestWithMetadata(
    client.queries.getInvolved({ relativePath: 'get-involved.yml' })
  );

  const document = result.data.getInvolved;
  const cards = compact(document.cards).map((card) => ({
    ...card,
    _source: card,
    external: card.external ?? false,
    featured: card.featured ?? false,
  }));

  return {
    document,
    cards,
    featuredCards: cards.filter((card) => card.featured),
    moreCards: cards.filter((card) => !card.featured),
  };
}
```

- [ ] **Step 2: Run Astro check**

Run: `npx astro check`

Expected: page import errors remain until Task 3 updates the callers.

## Task 3: Update Pages to Await New Loaders

**Files:**
- Modify: `src/pages/programmes.astro`
- Modify: `src/pages/get-involved.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update programmes page imports and data load**

Change:

```astro
import { programmes, renderMarkdown, programmeSlug } from '../data/programmes';
```

to:

```astro
import { getProgrammesContent, renderMarkdown, programmeSlug } from '../data/programmes';

const { programmes } = await getProgrammesContent();
```

- [ ] **Step 2: Update get-involved page imports and data load**

Change:

```astro
import { featuredCards, moreCards } from "../data/get-involved";
```

to:

```astro
import { getGetInvolvedContent } from "../data/get-involved";

const { featuredCards, moreCards } = await getGetInvolvedContent();
```

- [ ] **Step 3: Update homepage programme load**

Change:

```astro
import { programmes, programmeSlug } from '../data/programmes';
```

to:

```astro
import { getProgrammesContent, programmeSlug } from '../data/programmes';

const { programmes } = await getProgrammesContent();
```

- [ ] **Step 4: Verify build-preserving migration**

Run: `npx astro check`

Expected: `0 errors`, `0 warnings`, `0 hints`.

Run: `npm run build`

Expected: Tina build completes, then Astro build completes.

- [ ] **Step 5: Commit the data-flow migration**

Run:

```bash
rtk git add src/data/programmes.ts src/data/get-involved.ts src/pages/programmes.astro src/pages/get-involved.astro src/pages/index.astro
rtk git commit -m "Use Tina queries for editable content slices"
```

## Task 4: Add Tina Field Markers

**Files:**
- Modify: `src/pages/programmes.astro`
- Modify: `src/pages/get-involved.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Import `tinaField`**

In each page with editable fields, add:

```astro
import { tinaField } from '@tinacms/astro';
```

- [ ] **Step 2: Mark programme fields**

Add field markers to rendered programme values:

```astro
<h3
  class="section-heading text-3xl md:text-4xl mb-6"
  data-tina-field={tinaField(programme._source, 'title')}
>
  {programme.title}
</h3>

<div
  data-tina-field={tinaField(programme._source, 'long_description')}
  set:html={renderMarkdown(programme.long_description!)}
/>
```

For feature boxes:

```astro
<h5
  class="text-lg font-bold mb-2 text-heading-text"
  data-tina-field={tinaField(box, 'title')}
>
  {box.title}
</h5>
```

- [ ] **Step 3: Mark get-involved card fields**

Add field markers to card title, description, recommended label, and link label:

```astro
<h4 class="text-xl font-bold mb-4" data-tina-field={tinaField(card._source, 'title')}>
  {card.title}
</h4>
<p class="text-sm leading-relaxed mb-4" data-tina-field={tinaField(card._source, 'description')}>
  {card.description}
</p>
```

- [ ] **Step 4: Mark homepage programme card fields**

Add markers to homepage programme card titles and short descriptions using `programme._source`.

- [ ] **Step 5: Verify marker-only change**

Run: `npx astro check`

Expected: `0 errors`, `0 warnings`, `0 hints`.

Run: `npm run build`

Expected: Tina build completes, then Astro build completes.

- [ ] **Step 6: Commit field markers**

Run:

```bash
rtk git add src/pages/programmes.astro src/pages/get-involved.astro src/pages/index.astro
rtk git commit -m "Add Tina visual editing markers"
```

## Task 5: Add Tina Islands for Live Refresh

**Files:**
- Create: `src/lib/tina-islands.ts`
- Create: `src/pages/tina-island/[name].ts`
- Modify: `src/pages/programmes.astro`
- Modify: `src/pages/get-involved.astro`

- [ ] **Step 1: Create island registry**

Create `src/lib/tina-islands.ts`:

```ts
import type { IslandRegistry } from '@tinacms/astro/experimental';
import ProgrammesPageIsland from '../components/tina-islands/ProgrammesPageIsland.astro';
import GetInvolvedPageIsland from '../components/tina-islands/GetInvolvedPageIsland.astro';

export const tinaIslands = {
  programmes: {
    component: ProgrammesPageIsland,
    wrapper: { tag: 'div', className: 'contents' },
  },
  'get-involved': {
    component: GetInvolvedPageIsland,
    wrapper: { tag: 'div', className: 'contents' },
  },
} satisfies IslandRegistry;
```

- [ ] **Step 2: Extract page regions into island components**

Create `src/components/tina-islands/ProgrammesPageIsland.astro` and move only the programme jump nav and programme sections into it. Props:

```ts
interface Props {
  programmes: Programme[];
}
```

Create `src/components/tina-islands/GetInvolvedPageIsland.astro` and move only the featured/more card sections into it. Props:

```ts
interface Props {
  featuredCards: GetInvolvedCard[];
  moreCards: GetInvolvedCard[];
}
```

- [ ] **Step 3: Create dynamic island route**

Create `src/pages/tina-island/[name].ts`:

```ts
import { experimental_createIslandRoute } from '@tinacms/astro/experimental';
import { tinaIslands } from '../../lib/tina-islands';

export const POST = experimental_createIslandRoute(tinaIslands);
```

- [ ] **Step 4: Wrap page regions**

In `src/pages/programmes.astro`, import:

```astro
import TinaIsland from '@tinacms/astro/TinaIsland.astro';
import ProgrammesPageIsland from '../components/tina-islands/ProgrammesPageIsland.astro';
import { tinaIslands } from '../lib/tina-islands';
```

Render:

```astro
<TinaIsland name="programmes" wrapper={tinaIslands.programmes.wrapper}>
  <ProgrammesPageIsland programmes={programmes} />
</TinaIsland>
```

In `src/pages/get-involved.astro`, use the same pattern for `get-involved`.

- [ ] **Step 5: Verify islands**

Run: `npx astro check`

Expected: `0 errors`, `0 warnings`, `0 hints`.

Run: `npm run build`

Expected: Tina build completes, then Astro build completes.

- [ ] **Step 6: Commit islands**

Run:

```bash
rtk git add src/lib/tina-islands.ts src/pages/tina-island/[name].ts src/components/tina-islands/ProgrammesPageIsland.astro src/components/tina-islands/GetInvolvedPageIsland.astro src/pages/programmes.astro src/pages/get-involved.astro
rtk git commit -m "Add Tina live preview islands"
```

## Task 6: Manual Editor Validation

**Files:**
- No planned source edits unless validation reveals a bug.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

Expected: Tina starts and Astro dev serves the site.

- [ ] **Step 2: Validate programmes editing**

Open `/admin/`, select programmes content, and confirm:

- Clicking a programme title on `/programmes/` focuses the title field.
- Editing a programme title updates the preview.
- Clicking a feature-box title focuses the matching field.
- Homepage programme cards still render.

- [ ] **Step 3: Validate get-involved editing**

Open `/admin/`, select get-involved content, and confirm:

- Clicking a card title focuses the title field.
- Editing a card description updates the preview.
- External-link icons still appear for external links.

- [ ] **Step 4: Final verification**

Stop the dev server, then run:

```bash
npx astro check
npm run build
git status --short
```

Expected:

- Astro check passes with no diagnostics.
- Production build completes.
- Git status shows only intentional changes.

- [ ] **Step 5: Commit final fixes if needed**

If manual validation required source fixes, run:

```bash
rtk git add <changed-files>
rtk git commit -m "Polish Tina visual editing pilot"
```

If no fixes were needed, do not create an empty commit.
