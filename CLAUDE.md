# CLAUDE.md

Project-specific instructions for Claude Code. See `AGENTS.md` and `README.md` §Deployment
for fuller detail.

## ⚠️ Netlify builds are OFF on purpose — do NOT turn them back on

To conserve Netlify **build minutes** (the metered credit), Netlify does **no building**:

- **Automatic Git-triggered builds are disabled** in the Netlify dashboard.
- **Deploy Previews are disabled** — that's why Netlify's PR checks (`Header rules`,
  `Pages changed`, `Redirect rules`) show red on PRs. This is expected, not a failure.
- Production deploys instead **build on GitHub Actions' free runners** and upload the
  prebuilt `dist/` via `netlify deploy --prod --no-build` (`.github/workflows/deploy-netlify.yml`,
  push-to-`main` + manual). Netlify build-minute usage stays at **zero**.

**Do not** re-enable Netlify Git builds or Deploy Previews to "fix" the red checks or make
deploys automatic — that reintroduces the exact credit drain this setup avoids. The site
already deploys on every push to `main`. If a deploy misbehaves, debug the GitHub Actions
workflow, not the Netlify build settings.

## Other

- Sveltia CMS auth uses GitHub OAuth **via Netlify** (a free, separate service — not builds).
  Keeping the Netlify site alive for OAuth costs no build minutes; don't delete it.
- Record build/deploy fixes in `docs/FIX_NOTES.md`.
