# CLAUDE.md

Project-specific instructions for Claude Code. See `AGENTS.md` and `README.md` §Deployment
for fuller detail.

## Production is GitHub Pages, not Netlify

`durhamaisafety.uk` is served by **GitHub Pages** as of 2026-08-17. Pages is free and
unmetered for public repos, so there is no per-deploy cost and no credit ceiling.

- `.github/workflows/deploy-astro.yml` builds the site and publishes it on every push to
  `main`. This is the only thing that puts changes live.
- The custom domain is set in **Settings → Pages**, with `public/CNAME` as a backup copy.
  DNS for the domain still lives in Netlify's (free) DNS panel, with apex A records
  pointing at GitHub's `185.199.10{8,9,10,11}.153` and `www` CNAMEd to
  `durhamaisafety.github.io`.

## ⚠️ Netlify no longer deploys the site — do NOT wire it back up

Netlify metered **production deploys** (~15 credits each) as well as build minutes, and the
account ran out, blocking deploys with a 403 for two days. That is why the site moved.

- `.github/workflows/deploy-netlify.yml` is **manual-only** (`workflow_dispatch`). It is
  kept as a fallback, not as a deploy path. Running it does nothing useful while the
  domain points at Pages.
- Netlify's PR checks (`Header rules`, `Pages changed`, `Redirect rules`) show red because
  Deploy Previews are disabled. Expected, not a failure.
- **Do not** re-enable Netlify Git builds, Deploy Previews, or the push trigger on
  `deploy-netlify.yml` to "fix" red checks or make deploys automatic. Nothing here needs a
  Netlify serving feature: `netlify.toml` sets only build options that `--no-build`
  ignores, there are no `_headers` or `_redirects`, and the site's two redirects are
  Astro's own, emitted as static pages into `dist/`.

## Keep the Netlify account — two things still depend on it

1. **Sveltia CMS auth** uses GitHub OAuth **via Netlify** (`public/admin/config.yml` sets
   no `base_url`, so it falls back to Netlify's provider). Free, unrelated to deploys.
2. **DNS for `durhamaisafety.uk`** is hosted in Netlify's DNS panel — the domain is
   registered at Porkbun with nameservers delegated to Netlify. Free.

Deleting the Netlify team or site would break CMS logins and take the domain offline.

## Other

- CI (`ci.yml`) runs `pnpm lint`, `pnpm check` and `pnpm build` on PRs and on pushes to
  `main`. Lint is ESLint with `astro-eslint-parser` plus `jsx-a11y` rules — see
  `eslint.config.js`, where the tuned rules carry their reasoning inline.
- Record build/deploy fixes in `docs/FIX_NOTES.md`.
