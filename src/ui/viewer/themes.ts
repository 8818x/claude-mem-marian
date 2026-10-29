// Marian: shared Catppuccin preferences for My Work and Classic Viewer.
export const THEMES = [
  { id: 'latte', name: 'Latte' },
  { id: 'frappe', name: 'Frappé' },
  { id: 'macchiato', name: 'Macchiato' },
  { id: 'mocha', name: 'Mocha' },
] as const;

export type Theme = typeof THEMES[number]['id'];
const STORAGE_KEY = 'claude-mem-theme';

export function parseTheme(value: string | null, dark: boolean): Theme {
  switch (value) {
    case 'latte': case 'frappe': case 'macchiato': case 'mocha': return value;
    case 'light': return 'latte';
    case 'dark': return 'mocha';
    case 'system': return dark ? 'mocha' : 'latte';
    default: return 'mocha';
  }
}

export function readTheme(): Theme {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const requested = new URLSearchParams(window.location.search).get('theme');
  if (requested !== null) return parseTheme(requested, dark);
  try {
    return parseTheme(localStorage.getItem(STORAGE_KEY), dark);
  } catch {
    return parseTheme(null, dark);
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme !== 'latte');
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error: unknown) {
    console.warn('Failed to save theme preference to localStorage:', error instanceof Error ? error.message : String(error));
  }
  // A saved choice takes precedence over a one-off preview URL after reload.
  const url = new URL(window.location.href);
  if (url.searchParams.has('theme')) {
    url.searchParams.delete('theme');
    window.history.replaceState(null, '', url);
  }
  applyTheme(theme);
}
