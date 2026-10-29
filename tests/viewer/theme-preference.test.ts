// Marian: preferences remain compatible with old links and saved choices.
import { describe, expect, it } from 'bun:test';
import { THEMES, parseTheme } from '../../src/ui/viewer/themes';

describe('Catppuccin theme preferences', () => {
  it('keeps each of the four flavors in either system color scheme', () => {
    expect(THEMES.map(theme => theme.id)).toEqual(['latte', 'frappe', 'macchiato', 'mocha']);
    for (const { id } of THEMES) {
      expect(parseTheme(id, true)).toBe(id);
      expect(parseTheme(id, false)).toBe(id);
    }
  });

  it('migrates legacy light/dark and resolves system, missing and invalid values', () => {
    expect(parseTheme('light', true)).toBe('latte');
    expect(parseTheme('dark', false)).toBe('mocha');
    expect(parseTheme('system', false)).toBe('latte');
    expect(parseTheme('system', true)).toBe('mocha');
    for (const value of [null, 'invalid']) {
      expect(parseTheme(value, true)).toBe('mocha');
      expect(parseTheme(value, false)).toBe('mocha');
    }
  });
});
