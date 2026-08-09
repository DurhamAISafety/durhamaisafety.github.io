# Action required — things only you can do

Short list of manual steps I can't do for you. Nothing here blocks the site building or
deploying; it's needed to switch the **content editor** (Sveltia CMS at `/admin`) on and to
tidy old settings. Do them when you're back at a computer.

---

## 1. Turn on the CMS login (GitHub OAuth via Netlify) — ~15 min

Sveltia commits your edits to GitHub. Because we're on Netlify, we use Netlify's built-in
GitHub OAuth provider — **no extra server/worker needed**, and no config change.

1. **Create a GitHub OAuth app**: GitHub → Settings → *Developer settings* → *OAuth Apps* →
   *New OAuth App*.
   - Application name: `DAISI CMS` (anything)
   - Homepage URL: `https://durhamaisafety.uk`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done` (this exact value)
   - Register, then **Generate a client secret**. Copy the **Client ID** and **Client Secret**.
2. **Give them to Netlify** — this is a **dashboard-only** step (no CLI/env var exists for it):
   Netlify → your site → *Site configuration → Access & security → OAuth* (older UI:
   *Access control → OAuth*) → **Install provider → GitHub** → paste the **Client ID** and
   **Client Secret**, save. Paste the **secret directly into that form** — never into chat, a
   config file, or an env var. (Follow Netlify's own "Sveltia/Decap CMS + GitHub" guide if the
   menu names differ — the callback URL above is the stable part.)
   - Client ID on file: `Ov23liSqpa1IDRusNroy` (this is fine to keep in the repo; it isn't secret).
3. **Test**: go to `https://durhamaisafety.uk/admin/` (after PR #76 is merged), click
   *Login with GitHub*. You should see three editors: **People / Committee, Research papers,
   Supporters**. Try a tiny edit → it should open a **pull request** (not commit to `main`
   directly). Merge the PR to publish.

   NOTE — the CMS reads from `main`. People / Supporters / Research-papers are **new files that
   only land on `main` when PR #76 is merged**, so before merging they show as empty ("0
   People"). That's expected, not a bug — they populate after merge. (Test the CMS on the real
   site after merging, not on the deploy-preview.) The About page is intentionally NOT in the
   CMS — its text has hand-written HTML links, so it stays code-edited.

Anyone you want to let edit must have **write access** to the `DurhamAISafety/durhamaisafety.github.io`
repo. (For quick solo testing without any of the above, Sveltia also supports a personal
access token — but the OAuth setup is the right one for a committee.)

## 2. Remove the old TinaCMS settings — ✅ mostly done

- **Netlify env vars**: ✅ `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` removed via the CLI
  (only `NODE_VERSION` / `NODE_OPTIONS` remain).
- **Local `.env`**: you can drop those two Tina lines (kept for now, harmless).
- Optional: archive/close the project on Tina Cloud (app.tina.io).

## 3. Confirm the deploy branch — ✅ done

Confirmed via the Netlify API: production branch is **`main`**, which matches
`public/admin/config.yml`. Nothing to change.

---

## Notes (no action needed unless you care)

- **CMS branch vs this branch**: I'm working on `theo-aug-2026`. The CMS won't work until this
  is merged to `main` and deployed (so `/admin` and `config.yml` exist in production).
- **Committee photos**: new uploads in the People editor go to `public/images/people`. Existing
  photo paths are untouched.
- **Security hardening (optional)**: the admin page loads Sveltia from the unpkg CDN without a
  Subresource-Integrity hash (Sveltia ships as an auto-updating bundle, so pinning a hash
  breaks updates). If you'd rather pin a fixed version + SRI, say so. Sveltia also has a CSP
  guide if we add a Content-Security-Policy later.
- **A blog later**: easy to add — a folder of markdown files + one Astro route. Ask when you want it.
