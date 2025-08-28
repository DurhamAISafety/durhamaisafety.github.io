Contributing Guide
==================

Thanks for helping improve the Durham AISI website! This guide covers local setup, coding conventions, and checks.

Setup
-----
1. Install Ruby (>= 3.2) and Bundler.
2. Install dependencies:
   - macOS: `bundle install`
3. Start the site locally:
   - `bundle exec jekyll serve`

Conventions
-----------
- Use the shared layout in `_layouts/default.html` instead of inlining full HTML pages.
- Prefer data-driven content via `_data/*.yml` when possible (e.g., team members, links).
- Put shared markup in `_includes/` and shared styles in `assets/css/styles.css`.
- Keep images under `images/` and use relative_url / absolute_url filters.

Quality checks
--------------
- Build: `bundle exec jekyll build`
- Links: `bundle exec htmlproofer ./_site --config ./.htmlproofer.yml`

Pull requests
-------------
- Branch from `main`, open a PR, and ensure CI is green.
- Include screenshots for visual changes where useful.
