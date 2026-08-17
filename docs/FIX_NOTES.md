# Fix Notes

Past bugs and their fixes worth remembering.

---

## Mobile menu breakpoint mismatch

### The issue

On viewport widths between `1100px` and `1299px` (e.g. tablets or medium-sized desktop
browser windows), clicking the header burger button turned it into an "X" but did not
display the mobile navigation overlay.

- **Cause**: The burger button and desktop menu breakpoints switched at `1300px` (burger
  shown, desktop menu hidden below `1300px`). But `.mobile-nav` was hidden via
  `@media (min-width: 1100px) { display: none; }`. So between `1100px` and `1299px` the
  burger was visible while the menu itself was still `display: none`.
- **Correction**: Changed the `@media (min-width: 1100px)` query on `.mobile-nav` in
  `src/styles/layout.css` to `@media (min-width: 1300px)` to align with the other
  navigation breakpoints.
- **Lesson**: When a burger toggle and its target overlay have separate breakpoints, they
  must switch at the same width or there's a dead band where the button does nothing.

---

## Netlify deploys blocked: "Account credit usage exceeded"

### The issue

`Netlify Deploy` on `main` has been failing at the **Deploy to Netlify** step since
2026-08-15 (run on `49e4497`). The build itself is fine — `netlify deploy --prod` gets
back HTTP 403:

```
JSONHTTPError: 403
{ "error": "Account credit usage exceeded - new deploys are blocked until credits are added" }
```

- **Cause**: account-level, not a code or workflow problem. Netlify blocks *all* new
  deploys once the account's credit usage is exhausted, including CLI uploads of a
  prebuilt `dist/` (`--no-build`). Note this is separate from build minutes: we already
  build on GitHub Actions, so this is not something a workflow change can dodge.
- **Correction**: add credits / wait for the usage window to reset on the Netlify
  account, then re-run the failed `Netlify Deploy` run. Nothing to change in the repo.
- **Lesson**: a green GitHub Actions build does **not** mean the site updated. If
  durhamaisafety.uk looks stale, check the **Deploy to Netlify** step specifically —
  build success and publish success are different things.

---

## Action download failed with HTTP 429 (transient)

### The issue

`Netlify Deploy` on `594cb49` failed before running anything, while fetching an action:

```
Failed to download action 'https://codeload.github.com/pnpm/action-setup/tar.gz/0977fd99…'
Response status code does not indicate success: 429 (Too Many Requests)
```

- **Cause**: GitHub's own `codeload.github.com` rate-limiting the runner. The retries
  (3 attempts with back-off) all landed inside the throttle window. Nothing to do with
  `pnpm/action-setup` specifically — any action download can hit this.
- **Correction**: re-run the workflow. It is transient; no code change fixes it.
- **Lesson**: distinguish "failed to *download* an action" (infrastructure, re-run) from
  "a step failed" (real). Don't rewrite workflows to dodge a 429.

---

## CI signal on main

`.github/workflows/ci.yml` runs on pushes to `main` as well as on PRs, so `main` has a
`Type-check and build` status of its own rather than relying on the deploy. For a red PR
to actually be *unmergeable*, that check must be marked **required** in the branch
protection rule for `main` (Settings → Branches → main → Require status checks to pass) —
the workflow alone cannot enforce it.
