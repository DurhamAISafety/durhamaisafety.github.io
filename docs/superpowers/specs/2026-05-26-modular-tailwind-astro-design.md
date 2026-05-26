# Design Spec: Modular Tailwind v4 & Astro Bundling

- **Date**: 2026-05-26
- **Status**: Approved
- **Topic**: Upgrading CSS & Script Bundling to Tailwind v4 and Astro Module Standards

---

## 1. Goal

The goal of this refactor is to optimize the front-end asset delivery, performance, and modularity of the Durham AI Safety Initiative (DAISI) website. We will align the site fully with **Tailwind v4** and **Astro** bundling features to eliminate multiple blocking HTTP network requests, modularize client-side JS into clean, maintainable TypeScript files, and improve overall page speed and maintainability.

---

## 2. Current Architecture vs. Target Architecture

### CSS Stylesheets
*   **Current**: `Layout.astro` imports `src/styles/global.css` (Tailwind v4 compiler) AND links static `/css/styles.css` (from `public/css/`), which uses `@import` to load 7 additional CSS files.
    *   *Result*: The browser is forced to make **8 parallel blocking HTTP requests** just to render styles, loading raw, unminified CSS.
*   **Target**: Move all 7 CSS files from `public/css/` to `src/styles/` and load them directly inside `src/styles/global.css` using modern Tailwind v4 `@import` syntax. Remove the external `/css/styles.css` stylesheet link in `Layout.astro`.
    *   *Result*: Vite/Astro parses and bundles everything into **1 single, highly-optimized, minified CSS stylesheet** with full vendor-prefixing and dead-code elimination.

### Client-side Scripts
*   **Current**: `Layout.astro` references `/js/main.js` via an inline, unbundled `<script is:inline src="/js/main.js" defer></script>`. The script is 341 lines long and handles dark mode, smooth scrolling, scroll reveals, form actions, and navigation dropdowns.
    *   *Result*: Unminified script, zero bundle optimizations, and a hard-to-maintain "mega-script."
*   **Target**: Split `main.js` into modern ES/TypeScript modules under a new `src/scripts/` directory:
    *   `src/scripts/dark-mode.ts` (Handles toggle logic, localStorage cache, system preference sync)
    *   `src/scripts/smooth-scroll.ts` (Handles anchor jumps safe-guarding missing IDs)
    *   `src/scripts/form-handling.ts` (Handles simulated form submissions, loading, notifications)
    *   `src/scripts/scroll-animations.ts` (IntersectionObserver triggers for `.reveal` fades)
    *   `src/scripts/main.ts` (Central coordinator entry point)
    Import `../scripts/main.ts` inside a standard `<script>` block in `Layout.astro`.
    *   *Result*: Astro/Vite automatically processes, compiles, bundles, and minifies the scripts, appending cache-busting hashes.

---

## 3. Directory Layout & Proposed Changes

```text
src/
 ├── layouts/
 │    └── Layout.astro         <-- Update style & script links
 ├── styles/
 │    ├── global.css           <-- Main entry point importing sub-sheets
 │    ├── tokens.css           <-- Moved from public/css/
 │    ├── layout.css           <-- Moved from public/css/
 │    ├── cards.css            <-- Moved from public/css/
 │    ├── buttons.css          <-- Moved from public/css/
 │    ├── forms.css            <-- Moved from public/css/
 │    ├── animations.css       <-- Moved from public/css/
 │    └── utilities.css        <-- Moved from public/css/
 └── scripts/
      ├── dark-mode.ts         <-- Modular Dark Mode feature
      ├── smooth-scroll.ts     <-- Modular Smooth Scroll feature
      ├── form-handling.ts     <-- Modular Form & Notification helper
      ├── scroll-animations.ts <-- Modular IntersectionObserver scroll reveals
      └── main.ts              <-- Entry-point importing other modules
```

---

## 4. Verification & Performance Validation

*   **Static Type Checks**: Run `pnpm check` (`pnpx astro check`) to ensure no TypeScript or Astro syntax compiler errors occur.
*   **Production Build Checks**: Run `pnpm build` to verify successful Astro bundling and that files in `dist/` contain the single compiled CSS and JS files with version hashes.
*   **Regression Checks**: Verify that dark mode toggling works, smooth scroll is active, forms submit correctly, and scroll reveals trigger smoothly when scrolling down.
