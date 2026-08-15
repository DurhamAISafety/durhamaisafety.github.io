/**
 * Dark Mode theme management module
 */
export function initializeDarkMode(): void {
  const html = document.documentElement;

  function storageGet(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function storageSet(key: string, val: string): void {
    try {
      localStorage.setItem(key, val);
    } catch (_) {
      /* ignore */
    }
  }

  const stored = storageGet('theme');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersDark = mq.matches;
  const isDark = stored ? stored === 'dark' : prefersDark;

  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  updateDarkModeIcon(isDark);

  // Flip the theme atomically: suppress transitions for the switch, then restore
  // them next frame so the header doesn't lag the page and flash (see CSS
  // .theme-switching guard).
  function applyTheme(nowDark: boolean): void {
    html.classList.add('theme-switching');
    html.classList.toggle('dark', nowDark);
    updateDarkModeIcon(nowDark);
    void html.offsetHeight; // force the instant switch to commit
    requestAnimationFrame(() => {
      requestAnimationFrame(() => html.classList.remove('theme-switching'));
    });
  }

  // Wire up all toggle buttons (desktop + mobile)
  document.querySelectorAll('.dark-mode-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nowDark = !html.classList.contains('dark');
      storageSet('theme', nowDark ? 'dark' : 'light');
      applyTheme(nowDark);
    });
  });

  // Follow system preference changes if user hasn't manually set a preference.
  function onSchemeChange(e: MediaQueryListEvent): void {
    if (!storageGet('theme')) {
      applyTheme(e.matches);
    }
  }
  mq.addEventListener('change', onSchemeChange);
}

function updateDarkModeIcon(isDark: boolean): void {
  document.querySelectorAll('.dark-mode-toggle i').forEach((icon) => {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });
}
