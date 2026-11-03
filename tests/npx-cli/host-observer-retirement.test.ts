// SPDX-License-Identifier: Apache-2.0

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { spawnSync } from 'child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { SettingsDefaultsManager } from '../../src/shared/SettingsDefaultsManager.js';

const repoRoot = join(__dirname, '..', '..');

// Mirror of what the retired '--provider host' setup persisted (Decision 05):
// generic OpenRouter settings pointing at a loopback observer, plus one
// unrelated key a saved file could carry beside them.
const SAVED_HOST_OBSERVER_SETTINGS = {
  CLAUDE_MEM_PROVIDER: 'openrouter',
  CLAUDE_MEM_OPENROUTER_BASE_URL: 'http://127.0.0.1:37777/v1',
  CLAUDE_MEM_OPENROUTER_MODEL: 'cursor',
  CLAUDE_MEM_OPENROUTER_API_KEY: 'host-observer-local',
  CLAUDE_MEM_WORKER_PORT: '37777',
};

// printHelp() reads the package version relative to dist/npx-cli/, so run a
// bundle laid out like the published package instead of the TypeScript source.
const packageRoot = mkdtempSync(join(tmpdir(), 'claude-mem-retire-pkg-'));
const cliEntry = join(packageRoot, 'dist', 'npx-cli', 'index.js');

beforeAll(() => {
  mkdirSync(join(packageRoot, 'dist', 'npx-cli'), { recursive: true });
  copyFileSync(join(repoRoot, 'package.json'), join(packageRoot, 'package.json'));
  const build = spawnSync(
    process.execPath,
    ['build', join(repoRoot, 'src', 'npx-cli', 'index.ts'), '--target', 'node', '--outfile', cliEntry],
    { encoding: 'utf-8', cwd: repoRoot, timeout: 120_000 },
  );
  if (build.status !== 0) throw new Error(`bundling the CLI failed: ${build.stderr}`);
});

afterAll(() => {
  rmSync(packageRoot, { recursive: true, force: true });
});

const homes: string[] = [];

afterEach(() => {
  while (homes.length) rmSync(homes.pop()!, { recursive: true, force: true });
});

function runCli(args: string[], prepareHome?: (home: string) => void) {
  // Isolated HOME so a regression that runs the real command cannot touch a real install.
  const home = mkdtempSync(join(tmpdir(), 'claude-mem-retire-'));
  homes.push(home);
  prepareHome?.(home);
  // Drop inherited pointers at a real install so every path resolves inside the temp home.
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    HOME: home,
    USERPROFILE: home,
    CLAUDE_CONFIG_DIR: join(home, '.claude'),
    CLAUDE_MEM_DATA_DIR: join(home, '.claude-mem'),
    // Bun's transpiler cache lands in ~/Library/Caches/bun on macOS; it is not CLI output.
    BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
  };
  delete env.CLAUDE_MEM_WORKER_SCRIPT_PATH;
  delete env.CLAUDE_PLUGIN_ROOT;
  const result = spawnSync(process.execPath, [cliEntry, ...args], {
    encoding: 'utf-8',
    timeout: 30_000,
    stdin: 'ignore',
    cwd: home,
    env,
  });
  // Bun itself creates ~/.bun for its runtime cache; that is not CLI output.
  return { ...result, home, homeEntries: readdirSync(home).filter((entry) => entry !== '.bun') };
}

describe('retired --provider host setup path', () => {
  it('rejects --provider host before touching the isolated home', () => {
    const result = runCli(['install', '--provider', 'host']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('no longer supported');
    expect(result.stderr).toContain('keep working unchanged');
    expect(result.homeEntries).toEqual([]);
  });

  it('leaves already-saved host-observer settings byte-identical on rejection', () => {
    let before!: Buffer;
    const result = runCli(['install', '--provider', 'host'], (home) => {
      mkdirSync(join(home, '.claude-mem'), { recursive: true });
      const settingsPath = join(home, '.claude-mem', 'settings.json');
      writeFileSync(settingsPath, JSON.stringify(SAVED_HOST_OBSERVER_SETTINGS, null, 2), 'utf-8');
      before = readFileSync(settingsPath);
    });
    expect(result.status).toBe(1);
    expect(result.homeEntries).toEqual(['.claude-mem']);
    expect(readFileSync(join(result.home, '.claude-mem', 'settings.json')).equals(before)).toBe(true);
  });

  it('rejects an unknown provider and no longer offers host', () => {
    const result = runCli(['install', '--provider', 'bogus']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Unknown --provider: bogus. Allowed: claude, codex, gemini, openrouter');
    expect(result.stderr).not.toContain('host');
    expect(result.homeEntries).toEqual([]);
  });
});

describe('saved host-observer settings load as generic OpenRouter settings', () => {
  let dir: string;
  let settingsPath: string;

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = '';
  });

  function writeSavedSettings(document: Record<string, unknown>): Buffer {
    dir = mkdtempSync(join(tmpdir(), 'claude-mem-retire-settings-'));
    settingsPath = join(dir, 'settings.json');
    writeFileSync(settingsPath, JSON.stringify(document, null, 2), 'utf-8');
    return readFileSync(settingsPath);
  }

  function loadSavedSettings(): ReturnType<typeof SettingsDefaultsManager.loadFromFile> {
    return SettingsDefaultsManager.loadFromFile(settingsPath, false, { readOnly: true });
  }

  it('loads a nested env document with provider, loopback base URL and model unchanged', () => {
    writeSavedSettings({ env: { ...SAVED_HOST_OBSERVER_SETTINGS } });

    const settings = loadSavedSettings();

    expect(settings.CLAUDE_MEM_PROVIDER).toBe('openrouter');
    expect(settings.CLAUDE_MEM_OPENROUTER_BASE_URL).toBe('http://127.0.0.1:37777/v1');
    expect(settings.CLAUDE_MEM_OPENROUTER_MODEL).toBe('cursor');
    expect(settings.CLAUDE_MEM_WORKER_PORT).toBe('37777');
  });

  it('loads a flat document the same way', () => {
    writeSavedSettings({ ...SAVED_HOST_OBSERVER_SETTINGS });

    const settings = loadSavedSettings();

    expect(settings.CLAUDE_MEM_PROVIDER).toBe('openrouter');
    expect(settings.CLAUDE_MEM_OPENROUTER_BASE_URL).toBe('http://127.0.0.1:37777/v1');
    expect(settings.CLAUDE_MEM_OPENROUTER_MODEL).toBe('cursor');
    expect(settings.CLAUDE_MEM_WORKER_PORT).toBe('37777');
  });

  it('preserves a grok-bot model variant', () => {
    writeSavedSettings({ ...SAVED_HOST_OBSERVER_SETTINGS, CLAUDE_MEM_OPENROUTER_MODEL: 'grok-bot' });

    expect(loadSavedSettings().CLAUDE_MEM_OPENROUTER_MODEL).toBe('grok-bot');
  });

  it('loads twice to identical results without rewriting the file', () => {
    const before = writeSavedSettings({ env: { ...SAVED_HOST_OBSERVER_SETTINGS } });

    const first = loadSavedSettings();
    const second = loadSavedSettings();

    expect(second).toEqual(first);
    expect(readFileSync(settingsPath).equals(before)).toBe(true);
  });

  it('loads incomplete saved settings without throwing', () => {
    writeSavedSettings({
      CLAUDE_MEM_PROVIDER: 'openrouter',
      CLAUDE_MEM_OPENROUTER_MODEL: 'cursor',
      CLAUDE_MEM_OPENROUTER_API_KEY: 'host-observer-local',
    });
    expect(() => loadSavedSettings()).not.toThrow();

    writeSavedSettings({
      CLAUDE_MEM_PROVIDER: 'openrouter',
      CLAUDE_MEM_OPENROUTER_BASE_URL: 'http://127.0.0.1:37777/v1',
      CLAUDE_MEM_OPENROUTER_MODEL: 'cursor',
    });
    expect(() => loadSavedSettings()).not.toThrow();
  });
});
