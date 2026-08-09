# DAISI site refresh — plan

Branch: `theo-aug-2026`. Trim & refresh **in place** (not a rewrite — the Tina
visual-editing wiring and Luma sync are the valuable, working parts).

## Constraints
- **Keep all human-written copy.** Restructure / re-order / re-skin only. No AI-written body text.
- Keep the stack: Astro + TinaCMS (visual editing at `/admin`) + Tailwind 4 + Luma.
- Durham identity stays: palatinate purple primary, serif headings — but not a generic Durham group.
- Two audiences: skeptical freshers (who we are / what we do / when) **and** talent (research).
  Lead with curiosity & rigour, not doom (per branding field guide).

## Target pages (5 + 1 sub)
1. **Home** — hero (people, not cathedral) · 1-para "what is AI safety" + embedded video
   (youtu.be/5KVDDfAkRgc) · events preview · what-we-do preview · research preview.
2. **About** — who we are, freshers-fair photos; links out to **Alumni** (sub-page only).
3. **Events** — Luma calendar embed + highlighted upcoming.
4. **What we do** — keep custom subpages; each briefly describes the activity (incl.
   non-events like dissertation support) + past events.
5. **Research** — showcase for talent (members-presenting / talks photos).
6. **Get Involved** — CTA.

`what-is-ai-safety.astro` (328 lines) → one paragraph of its existing copy on Home.
`alumni` stays separate, reachable only from About.

## Photos (`new_photos/`)
- `post_event_pizza` → community / after-events.
- `freshers_fair/` → About + Get Involved.
- `talks/`, `members_presenting_their_own_work/` → hero + Research + What-we-do.

## CMS decision (agreed)
Drop **TinaCMS** (it's the main bloat + it coupled us to Tina Cloud & blocked the Astro
upgrade) → **Sveltia CMS** (git-based, no SaaS). Collections: **People, About, Research,
Supporters**. Blog = easy later (Sveltia folder collection of markdown + an Astro glob route).
- CMS edits use **editorial workflow** (branch + PR per edit) → review, no merge clashes.
- Removing Tina lets us go **`output: 'static'`** (no Netlify function) → far fewer Netlify
  credits. Hosting: GitHub Pages (free) or Netlify static — see Open.

## Phases (commit per phase)
- [ ] **0a. Remove Tina.** Delete `tina/`, `middleware.ts`, `lib/tina-islands.ts`,
      `tina-island` route, `@tinacms/*` deps, Tina step in `build.js`. Rewrite `src/data/*.ts`
      to read YAML/JSON directly (`yaml` dep, already installed); strip `tinaField`/`_source`/
      `data-tina-*` from ~20 components/pages. Removing Tina also frees the Vite-6 pin.
- [ ] **0b. Finish upgrade + static.** Reinstall (Vite 8 resolves → Astro 7 builds),
      `output: 'static'`. Gate: `pnpm build` passes, all routes render.
- [ ] **0c. Add Sveltia.** `public/admin/` (index.html + config.yml) mapping People/About/
      Research/Supporters to the YAML files; editorial workflow; GitHub OAuth. Gate: `/admin` loads.
- [ ] **1. Photos in.** Optimise `new_photos/`, swap hero, place across pages. Visible win, low risk.
- [ ] **2. IA.** Fold `what-is-ai-safety` into Home para + video; wire Alumni under About;
      confirm What-we-do subpages carry non-event activities.
- [ ] **3. CSS de-bloat.** Collapse ~2000 lines (`layout.css` 756, `cards.css` 625) into Tailwind;
      kill duplicated `.dark` rules (per `TODO.md`). Do last — refresh reveals what's actually used.
- [ ] **4. Optional.** `git gc` / history trim (14M of 28M is old images); delete dead files.

Design direction (palette, type, signature) lives in `DESIGN.md`.

## Open
- Exact hero photo — pick together in phase 1.
