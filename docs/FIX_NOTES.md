# Fix Notes: Netlify CLI Local Build Environment Variable Overwrite

This document details the issues encountered when deploying locally with `netlify deploy` under `pnpm` and the clean, non-intrusive solution implemented to resolve it.

---

## 1. The Core Issues

### Issue A: `pnpm dlx` / `pnpx` Executable Ambiguity
When running `pnpm dlx netlify-cli status` or legacy `pnpx netlify-cli status`, pnpm failed with the following error:
```text
[ERR_PNPM_DLX_MULTIPLE_BINS] Could not determine executable to run. netlify-cli has multiple binaries: ntl, netlify
```
*   **Cause**: `netlify-cli` ships with multiple entrypoints (`netlify` and `ntl`). Under strict `pnpm dlx` syntax, pnpm will not assume which binary to run unless explicitly configured with `--package`.
*   **Correction**: Use `npx netlify <cmd>` or `pnpm --package=netlify-cli dlx netlify <cmd>`.

### Issue B: Masked Environment Variables Overwriting Local Credentials
When running `npx netlify deploy` (which triggers local building through Netlify's build engine), `tinacms build` crashed with the following error:
```text
Invalid URL format provided. Expected: https://content.tinajs.io/<Version>/content/<ClientID>/github/<Branch> but received https://content.tinajs.io/2.4/content/****************a8f1/github/main
```
*   **Cause**: 
    1. Netlify CLI automatically downloads remote environment variables from the connected Netlify site configuration to mimic production during local builds.
    2. Because remote variables like `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` are secured/masked in the Netlify site UI, the CLI's API request fetched the literal masked asterisks string (e.g. `****************a8f1`).
    3. The Netlify CLI injected these masked strings into the local shell process, which aggressively overrode the correct, raw credentials defined in the local `.env` file.
    4. When `tina/config.ts` was read, it parsed the literal masked asterisks string as the Client ID, causing `tinacms build` to fail.

---

## 2. The Solution

To make local deployment work flawlessly while keeping the project optimized and completely flat-free (no global `shamefully-hoist=true` required), the local build was decoupled from the environment injection using a build wrapper.

### A. Restoring Browser-Compatible config (`tina/config.ts`)
We restored [tina/config.ts](../tina/config.ts) to a clean, bundle-safe state. Statically importing Node-specific modules like `fs` or `path` inside `tina/config.ts` causes Rollup/Vite to crash when compiling the Tina client bundle for the browser editor.

### B. Created a Safe Build Wrapper (`scripts/build.js`)
We created [scripts/build.js](./build.js) to orchestrate building. This script:
1.  Locates and parses the local `.env` file natively (correctly stripping surrounding quotes and ignoring inline comments starting with `#`).
2.  Inspects the active process environment variables. If it detects they have been overridden with masked asterisks (e.g. starting with `*`), it swaps them back with the raw, correct values from `.env`.
3.  Spawns `pnpm exec tinacms build` followed by `pnpm exec astro build` inside a child process containing the corrected environment.

### C. Configured `package.json`
We pointed the project's `"build"` command directly to the new wrapper script in [package.json](../package.json):
```json
"scripts": {
  "build": "node scripts/build.js"
}
```

---

## 3. Deployment Workflow

This setup is fully automated and works out-of-the-box locally and remotely:

### Local Deployments (`netlify deploy`)
Run the deployment command normally:
```bash
npx netlify deploy
# or
npx netlify deploy --prod
```
The Netlify CLI will download remote variables, trigger `pnpm run build` (which runs `node scripts/build.js`), the wrapper script will restore your real credentials, and the build/deploy will complete successfully.

### Remote / Continuous Deployment (Git Push)
Since `.env` is ignored by git and does not exist on remote build machines, the wrapper script will automatically bypass overriding and gracefully default to using the unmasked, secure credentials injected natively on Netlify's production infrastructure.