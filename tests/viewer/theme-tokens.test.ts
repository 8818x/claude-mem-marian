// Modified by the Marian fork: verify all four shared Catppuccin palettes.
import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

const viewerTemplate = readFileSync(join(import.meta.dir, '../../src/ui/viewer-template.html'), 'utf-8');
const stylesheet = readFileSync(join(import.meta.dir, '../../src/ui/catppuccin.css'), 'utf-8');

/** Custom properties declared in the first rule that opens with `ruleOpener`. */
function themeTokens(ruleOpener: string): Record<string, string> {
  const start = stylesheet.indexOf(ruleOpener);
  expect(start).toBeGreaterThan(-1);
  const body = stylesheet.slice(start + ruleOpener.length, stylesheet.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]));
}

const lightTheme = themeTokens('[data-theme="latte"] {');
const darkTheme = themeTokens('[data-theme="mocha"] {');
// Applies before the theme hook sets data-theme, so the page never flashes light first.
const initialPalette = themeTokens(':root,\n[data-theme="mocha"] {');

describe('viewer theme tokens', () => {
  it('defaults to Mocha before JavaScript, in either system color scheme', () => {
    expect(Object.keys(darkTheme).length).toBeGreaterThan(0);
    expect(initialPalette).toEqual(darkTheme);
  });

  it('defines every source badge token through the shared semantic map', () => {
    // Any var() read of the token counts: with or without spaces or a fallback value.
    const badgeTokens = new Set([...viewerTemplate.matchAll(/var\(\s*(--color-source-[\w-]+)/g)].map(match => match[1]));
    expect(badgeTokens.size).toBeGreaterThan(0);
    const semanticTokens = themeTokens(':root {');
    const missing = [...badgeTokens].filter(token => !(token in semanticTokens));
    expect(missing).toEqual([]);
  });

  it('supplies every palette color used by semantic tokens in all four themes', () => {
    const required = [...stylesheet.matchAll(/var\((--ctp-[\w-]+)\)/g)].map(match => match[1]);
    for (const name of ['latte', 'frappe', 'macchiato', 'mocha']) {
      const palette = themeTokens(`[data-theme="${name}"] {`);
      expect(Object.keys(palette)).toHaveLength(26);
      expect(required.filter(token => !(token in palette))).toEqual([]);
    }
    expect(lightTheme['--ctp-base']).toBe('#eff1f5');
    expect(darkTheme['--ctp-base']).toBe('#1e1e2e');
  });
});
