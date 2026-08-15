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
