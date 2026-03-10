/**
 * Injects the DAISI organiser calendar popup into public/admin/index.html.
 * Run after `tinacms build` — safe to call multiple times (idempotent).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_HTML = resolve(__dirname, '..', 'public', 'admin', 'index.html');

const CALENDAR_SRC =
  'https://calendar.google.com/calendar/u/0/embed' +
  '?src=19819426f7b902b6524ebdc40c12b65fbc87e4a5285d4d7ee00231d09dd10be3@group.calendar.google.com' +
  '&ctz=Europe/London&mode=AGENDA';

export function buildCalendarPayload() {
  return `
<!-- ── DAISI Calendar Popup (auto-injected) ─────────────────────────── -->
<style id="daisi-cal-styles">
  :root {
    --dcal-bg:         #0d0d1a;
    --dcal-surface:    #14142a;
    --dcal-surface-2:  #1c1c35;
    --dcal-border:     rgba(110, 86, 207, 0.30);
    --dcal-accent:     #7c6fcd;
    --dcal-accent-hi:  #9d8eeb;
    --dcal-accent-dim: rgba(124, 111, 205, 0.12);
    --dcal-text:       #e8e6f4;
    --dcal-text-muted: #8b849e;
    --dcal-radius:     14px;
    --dcal-z:          99990;
  }

  /* ── Floating trigger button ── */
  #daisi-cal-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: var(--dcal-z);
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px 9px 12px;
    background: var(--dcal-surface-2);
    border: 1px solid var(--dcal-border);
    border-radius: 100px;
    color: var(--dcal-text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", ui-sans-serif, sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.025em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow:
      0 4px 20px rgba(0,0,0,0.45),
      0 0 0 1px var(--dcal-border),
      inset 0 1px 0 rgba(255,255,255,0.06);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.2s ease,
                background 0.15s ease,
                color 0.15s ease;
    outline: none;
  }
  #daisi-cal-btn:hover {
    background: #22223e;
    color: var(--dcal-accent-hi);
    box-shadow:
      0 6px 28px rgba(0,0,0,0.55),
      0 0 0 1px var(--dcal-accent),
      0 0 24px rgba(124,111,205,0.18),
      inset 0 1px 0 rgba(255,255,255,0.06);
    transform: translateY(-3px) scale(1.03);
  }
  #daisi-cal-btn:active { transform: translateY(0) scale(0.97); }
  #daisi-cal-btn:focus-visible {
    box-shadow: 0 0 0 3px rgba(124,111,205,0.5);
  }
  .daisi-cal-icon {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    transition: stroke 0.15s ease;
  }
  #daisi-cal-btn:hover .daisi-cal-icon { stroke: var(--dcal-accent-hi); }

  /* ── Backdrop ── */
  #daisi-cal-backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--dcal-z) + 1);
    background: rgba(6, 4, 18, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.22s ease;
  }
  #daisi-cal-backdrop.dcal-open {
    opacity: 1;
    pointer-events: all;
  }

  /* ── Modal ── */
  #daisi-cal-modal {
    position: fixed;
    z-index: calc(var(--dcal-z) + 2);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -44%) scale(0.93);
    width: min(860px, calc(100vw - 40px));
    height: min(640px, calc(100vh - 72px));
    background: var(--dcal-surface);
    border: 1px solid var(--dcal-border);
    border-radius: var(--dcal-radius);
    box-shadow:
      0 32px 80px rgba(0,0,0,0.7),
      0 0 0 1px var(--dcal-border),
      0 0 60px rgba(124,111,205,0.06);
    display: flex;
    flex-direction: column;
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.32s cubic-bezier(0.34,1.5,0.64,1),
      opacity   0.22s ease;
    overflow: hidden;
  }
  #daisi-cal-modal.dcal-open {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    pointer-events: all;
  }

  /* ── Header ── */
  #daisi-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 16px 13px 18px;
    background: var(--dcal-bg);
    border-bottom: 1px solid var(--dcal-border);
    flex-shrink: 0;
  }
  #daisi-cal-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--dcal-text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", ui-sans-serif, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .dcal-pulse {
    position: relative;
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }
  .dcal-pulse::before,
  .dcal-pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--dcal-accent-hi);
  }
  .dcal-pulse::after {
    background: transparent;
    border: 1.5px solid var(--dcal-accent-hi);
    animation: dcal-pulse 2s ease-out infinite;
  }
  @keyframes dcal-pulse {
    0%   { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  #daisi-cal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 8px;
    color: var(--dcal-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
    flex-shrink: 0;
  }
  #daisi-cal-close:hover {
    background: var(--dcal-accent-dim);
    border-color: var(--dcal-border);
    color: var(--dcal-text);
  }
  #daisi-cal-close:focus-visible {
    box-shadow: 0 0 0 2px var(--dcal-accent);
    outline: none;
  }

  /* ── iframe wrapper ── */
  #daisi-cal-body {
    flex: 1;
    min-height: 0;
    background: #fff;
  }
  #daisi-cal-body iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
</style>

<button id="daisi-cal-btn" aria-label="Open organiser calendar" aria-expanded="false">
  <svg class="daisi-cal-icon" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true">
    <rect x="1.5" y="2.5" width="13" height="12" rx="2"/>
    <path d="M1.5 6.5h13"/>
    <path d="M5 1.5v2M11 1.5v2"/>
    <rect x="4" y="9" width="2" height="2" rx="0.4" fill="currentColor" stroke="none"/>
    <rect x="7" y="9" width="2" height="2" rx="0.4" fill="currentColor" stroke="none"/>
    <rect x="10" y="9" width="2" height="2" rx="0.4" fill="currentColor" stroke="none"/>
  </svg>
  Calendar
</button>

<div id="daisi-cal-backdrop" aria-hidden="true"></div>

<div id="daisi-cal-modal" role="dialog" aria-modal="true" aria-labelledby="daisi-cal-label" aria-hidden="true">
  <div id="daisi-cal-header">
    <div id="daisi-cal-title">
      <span class="dcal-pulse" aria-hidden="true"></span>
      <span id="daisi-cal-label">DAISI Organiser Calendar</span>
    </div>
    <button id="daisi-cal-close" aria-label="Close calendar">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M1.5 1.5l10 10M11.5 1.5l-10 10"/>
      </svg>
    </button>
  </div>
  <div id="daisi-cal-body">
    <iframe
      src="${CALENDAR_SRC}"
      title="DAISI Organiser Calendar"
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
</div>

<script>
(function () {
  var btn      = document.getElementById('daisi-cal-btn');
  var modal    = document.getElementById('daisi-cal-modal');
  var backdrop = document.getElementById('daisi-cal-backdrop');
  var closeBtn = document.getElementById('daisi-cal-close');

  function open() {
    modal.classList.add('dcal-open');
    backdrop.classList.add('dcal-open');
    modal.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function close() {
    modal.classList.remove('dcal-open');
    backdrop.classList.remove('dcal-open');
    modal.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('dcal-open')) close();
  });
})();
</script>
<!-- ── /DAISI Calendar Popup ────────────────────────────────────────── -->
`;
}

export function injectIntoHtml(html) {
  if (html.includes('daisi-cal-btn')) return null; // already injected
  return html.replace('</body>', buildCalendarPayload() + '\n</body>');
}

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!existsSync(ADMIN_HTML)) {
    console.error('[DAISI Calendar] public/admin/index.html not found — skipping.');
    process.exit(0);
  }

  const html = readFileSync(ADMIN_HTML, 'utf-8');
  const result = injectIntoHtml(html);

  if (result === null) {
    console.log('[DAISI Calendar] Already injected — nothing to do.');
  } else {
    writeFileSync(ADMIN_HTML, result);
    console.log('[DAISI Calendar] Injected into public/admin/index.html');
  }
}
