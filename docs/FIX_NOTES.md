# Production Bug Resolution Notes

This document logs critical production-only bugs, root cause analyses, and their resolutions to assist future maintainers of the DAISI website.

---

## Visual editing fields not appearing in TinaCMS Cloud

**Symptom:** Visual editing works in local dev (`tinacms dev`) but the admin sidebar shows "TinaCMS form fields will appear here" on the live Netlify deployment.

### Root Cause 1: Missing Middleware (`src/middleware.ts`)
The `@tinacms/astro` integration relies on an Astro middleware to intercept HTML responses in edit mode and splice the visual editing bridge script (`/_tina/bridge.js`) and `<div data-tina-form>` metadata payloads into the page. Without `src/middleware.ts` present in the project, Astro does not activate the middleware pipeline, causing the bridge to be silently skipped.

### Root Cause 2: Serverless Functions Bundling Error
Under `pnpm`'s strict, non-hoisted dependency architecture, nested sub-dependencies like `@tinacms/bridge` are not placed at the root level of `node_modules`. 
During the Netlify **Functions bundling** stage, the serverless functions bundler (`esbuild`) was unable to locate `@tinacms/bridge` inside the server-side entrypoint, causing the deployment to crash during bundling.

### Root Cause 3: Dynamic Route Resolution Failure (500 Error)
Even if the SSR function compiled successfully, the dynamic integration route `/_tina/bridge.js` resolved the bridge package at runtime using `readFileSync` and `createRequire` in the serverless Lambda function container. Since `node_modules` is not uploaded or present in the live AWS Lambda/Netlify runtime container, the function threw a `Cannot find module` error, causing the `/_tina/bridge.js` route to fail with an **`HTTP/2 500` Internal Server Error** at runtime.

---

### The Fixes

1. **Selective Dependency Hoisting (`.npmrc`)**
   We added a targeted `.npmrc` file with the native `pnpm` public hoisting pattern to selectively hoist only TinaCMS packages to the root `node_modules` while keeping the rest of the project completely isolated:
   ```ini
   public-hoist-pattern[]=*tinacms*
   public-hoist-pattern[]=*tina*
   ```

2. **Middleware Activation (`src/middleware.ts`)**
   We created `src/middleware.ts` to export the Astro middleware handler:
   ```ts
   export { onRequest } from '@tinacms/astro/middleware';
   ```

3. **Statically Pre-Rendered Bridge (`public/_tina/bridge.js`)**
   We copied the bundled `@tinacms/bridge` script directly into the `public/_tina/bridge.js` directory. 
   Because files in the `public` folder bypass Astro's routing engine and are copied directly into the static assets directory at build time (when `node_modules` is fully present), Netlify's CDN serves the bridge natively as a static asset, completely avoiding serverless Lambda execution and preventing runtime 500 errors.

---

### Previous Commits: What was necessary?

The previous commit (`940209496bd6c0ab2bba4b82a3fc47d2df7e492a`) which updated the `tinaField` references to use the raw query objects (e.g. `document.about!`) instead of the spread configurations (e.g. `{ ...doc }`) **was absolutely correct and must NOT be undone**.

* **Why?** TinaCMS attaches the GraphQL field path metadata (`_content_source`) as a **non-enumerable** property on the query objects. When an object is copied using the spread operator (`const aboutConfig = { ...doc }`), non-enumerable properties are lost.
* As a result, `tinaField(aboutConfig, 'introText')` returns `""` (empty string). Passing the original raw reference `doc` keeps the metadata intact, enabling the elements to render correct `data-tina-field` attributes that the visual editing bridge uses to identify fields.