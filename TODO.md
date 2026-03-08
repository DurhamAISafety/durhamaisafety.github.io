# Future Work

## Tailwind CSS v4 Migration

**Status:** Deferred — older browser compatibility concerns  
**Priority:** Medium

### What needs doing

1. **Remove** `@astrojs/tailwind` integration and `tailwind.config.mjs`
2. **Install** `tailwindcss@^4` and `@tailwindcss/vite`
3. **`astro.config.mjs`** — replace the Astro integration with a Vite plugin:
   ```js
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({
     vite: { plugins: [tailwindcss()] },
   });
   ```
4. **`src/styles/global.css`** — replace the three `@tailwind` directives with:
   ```css
   @import "tailwindcss";
   ```
5. **Move theme values** from `tailwind.config.mjs` into a `@theme {}` block in CSS:
   ```css
   @theme {
     --color-durham-purple: #68246D;
     --color-bright-purple: #EB80FD;
     --color-light-purple: #E2ACFE;
     --color-lavender: #B8BBFE;
     --font-display: 'IBM Plex Sans', sans-serif;
     --font-body: 'IBM Plex Sans', sans-serif;
   }
   ```
6. **Dark mode** — replace `darkMode: 'class'` config with CSS variant:
   ```css
   @variant dark (&:where(.dark, .dark *));
   ```
   Then migrate `.dark .section-neutral ...` rules in `styles.css` to `dark:` utility
   classes in each `.astro` file, page by page.

7. **Test build** — run `npm run build` and fix any renamed utilities (e.g. `shadow-sm` → `shadow-xs`).

### Browser compatibility note
Tailwind v4 uses CSS custom properties and modern CSS features more aggressively.
Check [caniuse.com](https://caniuse.com) for `@property`, `color-mix()`, and cascade layers
before migrating if older browser support is required.

---

## Replace `styles.css` with Tailwind Utilities

**Status:** Not started — do this during (or after) the Tailwind v4 migration  
**Priority:** Medium

`public/css/styles.css` is ~1,700 lines. Much of it can move into Tailwind utilities, but a full migration requires more than search/replace:

### What can be deleted outright
- All `.dark { … }` rules (~400 lines) — dark mode is disabled; these are dead code. Delete them before doing anything else.

### What converts cleanly to Tailwind
- **Simple component classes** (`.btn-cta`, `.section-heading`, `.gradient-text`, `.hero-heading`, `.reveal`) — replace with `@apply` blocks in a small `src/styles/components.css`, or move the classes inline onto each element.
- **CSS custom properties** (`:root { --color-* … }`) — move a minimal set into `@theme {}` (v4) or keep in a tiny `src/styles/tokens.css`. Most are already duplicated in `tailwind.config.mjs`.
- **Animation keyframes** (`@keyframes fade-up`, `.reveal`) — define via `theme.extend.keyframes` / `theme.extend.animation` in `tailwind.config.mjs` and use `animate-*` utilities, or keep in a tiny CSS file.

### What requires Astro component refactoring (the hard part)
The ~350-line block of `.section-neutral .program-card`, `.section-light .research-card` etc. are CSS context selectors that change card colours based on the parent section's background. To remove these, each card component needs a `variant` prop:

```astro
<!-- Before: CSS context selector does the work -->
<section class="section-neutral">
  <div class="program-card">…</div>
</section>

<!-- After: variant prop drives conditional Tailwind classes -->
<ProgramCard variant="neutral" />
```

This is the biggest chunk of work and should be done page-by-page after the v4 migration is stable.

### Suggested order
1. Delete all `.dark` rules (quick win, ~400 lines gone)
2. Migrate simple component classes to `@apply` or inline utilities
3. Move `:root` tokens to `@theme` (during v4 migration)
4. Refactor card components to accept a `variant` prop, then delete context selectors

---

## Add a CMS

**Status:** Not started  
**Priority:** Medium — now on Netlify, which enables previously-awkward auth flows  
**Decision:** Sveltia CMS

### Why Sveltia CMS

After evaluating the options, Sveltia is the best fit for this project:

- Browser-based editor at `/admin/` — no dev server needed for non-technical editors
- Zero changes to the existing site architecture (no server functions, no hybrid mode)
- Talks directly to GitHub via OAuth to read and save YAML files
- Drop-in replacement for Decap CMS, but avoids the deprecated Netlify Identity dependency
- Easiest option to hand over to next year's committee
- Free, actively maintained in 2025

### How it works

Sveltia is just two static files in your `public/admin/` folder. The editor UI runs entirely in the browser and commits changes directly to your GitHub repo via the GitHub API. Your Astro build process is completely unchanged — Sveltia just edits the same `src/content/*.yml` files you already have.

### Implementation steps

#### 1. Create the admin UI file

Create `public/admin/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DAISI Content Manager</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

#### 2. Create the config file

Create `public/admin/config.yml` — this tells Sveltia about your content collections:

```yaml
backend:
  name: github
  repo: DurhamAISafety/durhamaisafety.github.io
  branch: main

media_folder: public/images
public_folder: /images

collections:
  - name: team
    label: Team Members
    files:
      - name: team
        label: Team
        file: src/content/team.yml
        fields:
          - label: Members
            name: members  # adjust to match your actual YAML structure
            widget: list
            fields:
              - { label: Name, name: name, widget: string }
              - { label: Role, name: role, widget: string }
              - { label: Start Year, name: start_year, widget: number, required: false }
              - { label: Photo, name: photo, widget: string, required: false }
              - { label: LinkedIn, name: linkedin, widget: string, required: false }

  - name: alumni
    label: Alumni
    files:
      - name: alum
        label: Alumni
        file: src/content/alum.yml
        fields:
          - label: Alumni
            name: alumni  # adjust to match your actual YAML structure
            widget: list
            fields:
              - { label: Name, name: name, widget: string }
              - { label: Role, name: role, widget: string }
              - { label: Years Active, name: years_active, widget: string, required: false }
              - { label: Photo, name: photo, widget: string, required: false }
              - { label: LinkedIn, name: linkedin, widget: string, required: false }

  - name: research
    label: Research Papers
    files:
      - name: research
        label: Research
        file: src/content/research.yml
        fields:
          - label: Papers
            name: papers  # adjust to match your actual YAML structure
            widget: list
            fields:
              - { label: Title, name: title, widget: string }
              - { label: URL, name: url, widget: string }
              - { label: Year, name: year, widget: number }
              - { label: Venue, name: venue, widget: string }
              - { label: Type, name: type, widget: select, options: [academic, non-academic] }
              - { label: Tags, name: tags, widget: list }

  - name: supporters
    label: Supporters
    files:
      - name: supporters
        label: Supporters
        file: src/content/supporters.yml
        fields:
          - label: Supporters
            name: supporters  # adjust to match your actual YAML structure
            widget: list
            fields:
              - { label: Name, name: name, widget: string }
              - { label: Logo filename, name: logo, widget: string }
              - { label: Link, name: link, widget: string }
              - { label: Subtitle, name: subtitle, widget: string, required: false }
```

> **Note:** The field structure above is based on your TypeScript interfaces in `src/data/*.ts`. Check your actual YAML files in `src/content/` and adjust the top-level list field name if needed — Sveltia needs to know whether the YAML root is an array or a named key.

#### ~~3. Set up a GitHub OAuth App~~ ✅ Done

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - Application name: `DAISI CMS`
   - Homepage URL: `https://durhamaisafety.uk`
   - Authorization callback URL: `https://durhamaisafety.uk/admin/`
3. Copy the **Client ID** and generate a **Client Secret**

#### ~~4. Add a Netlify OAuth proxy~~ ✅ Done

Sveltia uses GitHub OAuth, but OAuth requires a server-side step to exchange the auth code for a token (browsers can't do this securely). Netlify has a built-in OAuth proxy for exactly this:

1. In Netlify: **Site configuration → Access & security → OAuth**
2. Add a GitHub provider using your Client ID and Client Secret from step 3
3. That's it — Netlify handles the token exchange

#### 5. Deploy and test

Push the two new files (`public/admin/index.html` and `public/admin/config.yml`) to your repo. Once the build deploys, visit `https://durhamaisafety.uk/admin/` and you should see the Sveltia login screen. Log in with GitHub and test editing a team member.

### Protecting against broken builds

When editors save via the CMS, it commits directly to `main`, which triggers a deploy. A malformed YAML entry will cause the build to fail. Two things help here:

- **Enable deploy previews** in Netlify (they may already be on) — if you ever want to review CMS changes before they go live, editors could work on a branch
- **Add a branch** called `cms` or `content` and set `branch: cms` in `config.yml`, then set up a simple GitHub Actions rule or just manually merge PRs — optional but worth it once you have non-technical editors

### Future: multi-tab admin dashboard

The vision for a unified admin panel with tabs maps naturally to Sveltia:

- **Tab 1 — Pages**: Could add Sveltia collections for editable page content (e.g. the AIS101 topic cards on the Programmes page) by adding more entries to `config.yml`
- **Tab 2 — Content**: The four collections above (`team`, `alum`, `research`, `supporters`)
- **Tab 3 — Calendar**: Embed the private organiser Google Calendar as an iframe

<details>
<summary>Google Calendar embed link (private organiser view)</summary>

```
https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLondon&showPrint=0&mode=AGENDA&src=dGhlb2ZhcnJlbGwxOEBnbWFpbC5jb20&src=ODk2ZWRjZjRmOWNkNDczMDUyMzJiMmM3OGNjMDZkNGQxMzY1YTE4ZGFiYmFjZTc0OWJkZTIzN2NmZDkyYmVhNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MTk4MTk0MjZmN2I5MDJiNjUyNGViZGM0MGMxMmI2NWZiYzg3ZTRhNTI4NWQ0ZDdlZTAwMjMxZDA5ZGQxMGJlM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZmFtaWx5MDYyNjg5NTYxMDkwNjQ1NDMzOTlAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=OGU2MTBkMzJjNTdiMDViNzcxYmQxNjUxZGM2NjVkMmFlZjMxNjBhMmI0M2I3ZjYzZDVmNGVmZWRkNTliYjFjYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OWI2MmM1MTA3NDg4YTMxZTY1MjBlN2I5NzgxYmJjNzAxNzk0YTEzYTljZDhkYTE4YWMxOWY5ZWVlY2QxMGNjZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MzJmMzE2MDdlMzc2YjdjNDU0MWYzNjZlNjRmM2I3ODhjMTAxNTg1YmZjZjNlNDQ2YjE4YjM0OTYxZDI1MGFlNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ODAxNWQwMThlM2E4ODcwZWE5ZTQxMjQ1ZTQ5Y2Y5NzBhMWVmMjg3MTgzNDg5YjlkYjEwOTIxYjNjNTFmYzM2YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=Z3UwcDA5a3NvOWlkYTVlazIyajNqNGlnODUyZnNpZDZAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=bjJlNjQ4N2lrYTA4b2gwNmxxZ3VjOXRtZGdpMG1mb2NAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=YjdibzBxc2oyN2w3YWhmYXFncWlhdmpvbTlldGc3c2JAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=ZW4udWsjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=cmpmYXJyZWxsNkBnb29nbGVtYWlsLmNvbQ&color=%23039be5&color=%238e24aa&color=%23b39ddb&color=%237986cb&color=%23e4c441&color=%23c0ca33&color=%233f51b5&color=%23ef6c00&color=%23009688&color=%233f51b5&color=%23795548&color=%230b8043&color=%23c0ca33
```

</details>