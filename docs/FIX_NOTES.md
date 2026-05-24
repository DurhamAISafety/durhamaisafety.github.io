# Production Bug Resolution Notes

This document logs critical production-only bugs, root cause analyses, and their resolutions to assist future maintainers of the DAISI website.

---

## [BROKEN - THIS FIX DIDNT WORK] 1. Tina CMS Visual Editing Fails on Production (Netlify SSR)

### Problem Description
Visual editing via Tina Cloud works perfectly on the local dev server (`pnpm run dev`), but fails on the production site. When navigating to `/admin/` on `https://durhamaisafety.uk`, clicking any page (e.g., "About") displays a blank sidebar with:
> "TinaCMS form fields will appear here"

No editable form fields are loaded, and the preview iframe does not synchronize.

### Root Cause Analysis
1. **Endpoint failure**: A check of the browser network tab shows that the endpoint `/_tina/bridge.js` returns **HTTP 500 Internal Server Error** on production.
2. **Endpoint implementation**: The `@tinacms/astro` integration registers a server route at `/_tina/bridge.js` ([bridge-route.ts](file:///Users/Subspace_Explorer/Projects/durhamaisafety.github.io/node_modules/@tinacms/astro/src/bridge-route.ts)) to serve the client-side bridge script at runtime.
3. **Dynamic Loading Issue**: The route loads the `@tinacms/bridge` package dynamically using `createRequire` and `readFileSync` to read its bundle content on demand:
   ```ts
   const require = createRequire(import.meta.url);
   const bridgePath = require.resolve('@tinacms/bridge');
   cached = readFileSync(bridgePath, 'utf-8');
   ```
4. **Serverless Bundling Exclusion**: During the production build, Astro's `@astrojs/netlify` adapter bundles the server-side code into a serverless function inside `.netlify/v1/functions/ssr/`. Since the bundler cannot statically trace dynamic dependencies (`createRequire` + `readFileSync`), it **does not copy `@tinacms/bridge`** into the serverless function's `node_modules` directory.
5. **Runtime Crash**: When the serverless function executes, `require.resolve('@tinacms/bridge')` throws a module resolution error, causing the `/_tina/bridge.js` endpoint to fail with an HTTP 500 error.

---

### Solution Strategy

To resolve this, we must ensure that the `@tinacms/bridge` package files are copied into the serverless function bundle so they are physically present on disk at runtime.

#### Approach A: Configure Netlify `included_files` (Recommended)
Add `@tinacms/bridge` to the list of files Netlify should explicitly bundle into the SSR function via `netlify.toml`:

```toml
[functions]
  included_files = [
    "node_modules/@tinacms/bridge/**",
    "node_modules/.pnpm/@tinacms+bridge*/**"
  ]
```

This forces the Netlify bundler to package the bridge files (resolving the pnpm symlinks appropriately) into the function zip, making them fully available to `createRequire().resolve` at runtime.

---

## 2. Reversion of `astro.config.mjs` (Vite `noExternal` limitation)
Initial testing explored adding `@tinacms/bridge` to Vite's `ssr.noExternal` list:
```js
vite: {
  ssr: {
    noExternal: ['@tinacms/bridge']
  }
}
```
**Why this alone was insufficient**: Vite inlining is done for ESM imports. Because the route dynamically resolves the path to read the physical file on disk (`readFileSync`), the physical file is still required to exist in the function's `node_modules` directory. Therefore, `included_files` is the definitive solution.
