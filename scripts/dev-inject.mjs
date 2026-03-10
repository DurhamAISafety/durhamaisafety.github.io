/**
 * Dev wrapper: starts `tinacms dev -c "astro dev"` and watches
 * public/admin/index.html, re-injecting the calendar popup whenever
 * Tina regenerates the file.
 */

import { spawn } from 'child_process';
import { watch, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { injectIntoHtml } from './inject-calendar.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const ADMIN_DIR = resolve(ROOT, 'public', 'admin');
const ADMIN_HTML = resolve(ADMIN_DIR, 'index.html');

const RESET  = '\x1b[0m';
const CYAN   = '\x1b[36m';
const YELLOW = '\x1b[33m';

let debounce   = null;
let processing = false;

function tryInject() {
  if (processing) return;
  if (!existsSync(ADMIN_HTML)) return;

  processing = true;
  // Small delay so Tina finishes writing before we read
  setTimeout(() => {
    try {
      const html   = readFileSync(ADMIN_HTML, 'utf-8');
      const result = injectIntoHtml(html);
      if (result !== null) {
        writeFileSync(ADMIN_HTML, result);
        console.log(`${CYAN}[DAISI Calendar]${RESET} Injected into public/admin/index.html`);
      }
    } catch (e) {
      console.warn(`${YELLOW}[DAISI Calendar]${RESET} Could not inject: ${e.message}`);
    }
    processing = false;
  }, 150);
}

function startWatch() {
  if (!existsSync(ADMIN_DIR)) {
    setTimeout(startWatch, 400);
    return;
  }

  // Try right away in case the file already exists
  tryInject();

  watch(ADMIN_DIR, { persistent: true }, (event, filename) => {
    if (filename === 'index.html') {
      clearTimeout(debounce);
      debounce = setTimeout(tryInject, 200);
    }
  });
}

// ── Start tinacms dev ────────────────────────────────────────────────
const child = spawn('npx tinacms dev -c "astro dev"', [], {
  stdio: 'inherit',
  shell: true,
  cwd: ROOT,
  env: process.env,
});

// Start watching once Tina has had a moment to boot
startWatch();
// Also retry after a longer delay to handle slower startup
setTimeout(tryInject, 5000);

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT',  () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
