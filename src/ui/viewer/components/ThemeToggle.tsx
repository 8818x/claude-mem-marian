// Modified by the Marian fork: accessible Catppuccin theme selector.
import React from 'react';
import { THEMES, parseTheme } from '../themes';
import type { ThemePreference } from '../hooks/useTheme';

interface ThemeToggleProps {
  preference: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}

export function ThemeToggle({ preference, onThemeChange }: ThemeToggleProps) {
  return (
    <select className="theme-toggle-btn" aria-label="Catppuccin theme" title="Catppuccin theme"
      value={preference} onChange={event => onThemeChange(parseTheme(event.target.value, false))}>
      {THEMES.map(theme => <option key={theme.id} value={theme.id}>{theme.name}</option>)}
    </select>
  );
}
