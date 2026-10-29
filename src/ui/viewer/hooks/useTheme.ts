// Modified by the Marian fork: four persistent Catppuccin themes.
import { useState, useEffect } from 'react';
import { applyTheme, readTheme, saveTheme, type Theme } from '../themes';

export type ThemePreference = Theme;
export type ResolvedTheme = Theme;

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readTheme);
  useEffect(() => { applyTheme(preference); }, [preference]);
  const setThemePreference = (newPreference: ThemePreference) => {
    saveTheme(newPreference);
    setPreference(newPreference);
  };
  return { preference, setThemePreference };
}
