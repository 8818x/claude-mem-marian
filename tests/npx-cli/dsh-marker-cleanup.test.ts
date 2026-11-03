import { afterEach, describe, expect, it, spyOn } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { uninstallDeepSeekHarness } from '../../src/services/integrations/DeepSeekHarnessInstaller.js';
import { prepareIntegrationTargets } from '../../src/npx-cli/commands/uninstall-targets.js';

const fixtures: string[] = [];

const OWNED_WATCH = { name: 'dsh', schema: 'dsh', managedBy: 'claude-mem' };
const USER_WATCH = { name: 'user-watch', schema: 'user' };
const SCHEMAS = { dsh: { fields: { session_id: 'string' } }, user: { fields: { id: 'string' } } };

function fixtureRoot(): string {
  const directory = path.join(tmpdir(), `marian-dsh-cleanup-${crypto.randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  fixtures.push(directory);
  return directory;
}

function writeMarker(dataDir: string, profiles: unknown): string {
  const marker = path.join(dataDir, 'integrations', 'dsh.json');
  mkdirSync(path.dirname(marker), { recursive: true });
  writeFileSync(marker, typeof profiles === 'string' ? profiles : JSON.stringify({ profiles }, null, 2) + '\n');
  return marker;
}

function writeWatchConfig(home: string, watches = [OWNED_WATCH, USER_WATCH]): string {
  const watchPath = path.join(home, 'data', 'transcript-watch.json');
  mkdirSync(path.dirname(watchPath), { recursive: true });
  writeFileSync(watchPath, JSON.stringify({ version: 1, schemas: SCHEMAS, watches }, null, 2) + '\n');
  return watchPath;
}

async function runCleanup(home: string, options: Parameters<typeof uninstallDeepSeekHarness>[0] = {}) {
  return uninstallDeepSeekHarness({
    dataDir: path.join(home, 'data'),
    watchConfigPath: path.join(home, 'data', 'transcript-watch.json'),
    ...options,
  });
}

afterEach(() => {
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('DSH marker-driven legacy cleanup', () => {
  it('is a safe no-op when no marker exists', async () => {
    const home = fixtureRoot();
    const watchPath = writeWatchConfig(home);

    expect(await runCleanup(home)).toBe(0);
    expect(existsSync(watchPath)).toBe(true);
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).watches).toHaveLength(2);
  });

  it('removes managed watch and marker without host commands when the marker records no profiles', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const marker = writeMarker(dataDir, []);
    const watchPath = writeWatchConfig(home);
    const hostCalls: string[] = [];

    expect(await runCleanup(home, { runHostCommand: async (profile, operation, target) => { hostCalls.push(`${profile}:${operation}:${target}`); return 0; } })).toBe(0);

    expect(hostCalls).toEqual([]);
    expect(existsSync(marker)).toBe(false);
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).watches).toEqual([USER_WATCH]);
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).schemas).toEqual(SCHEMAS);
  });

  it('removes every recorded profile in order, then the managed watch, then the marker, keeping a user-owned watch named dsh', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    writeMarker(dataDir, ['web', 'tui']);
    const watchPath = writeWatchConfig(home, [OWNED_WATCH, USER_WATCH, { name: 'dsh', schema: 'dsh' }]);
    const hostCalls: string[] = [];

    expect(await runCleanup(home, { runHostCommand: async (profile, operation, target) => { hostCalls.push(`${profile}:${operation}:${target}`); return 0; } })).toBe(0);

    expect(hostCalls).toEqual(['web:remove:@claude-mem/dsh', 'tui:remove:@claude-mem/dsh']);
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).watches).toEqual([USER_WATCH, { name: 'dsh', schema: 'dsh' }]);
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).schemas).toEqual(SCHEMAS);
    expect(existsSync(path.join(dataDir, 'integrations', 'dsh.json'))).toBe(false);
  });

  it('preserves retry state, the managed watch, and the marker when a profile removal fails', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const marker = writeMarker(dataDir, ['web', 'tui']);
    const watchPath = writeWatchConfig(home);
    const hostCalls: string[] = [];

    expect(await runCleanup(home, {
      runHostCommand: async (profile, operation, target) => {
        hostCalls.push(`${profile}:${operation}:${target}`);
        return profile === 'tui' ? 1 : 0;
      },
    })).toBe(1);

    expect(hostCalls).toEqual(['web:remove:@claude-mem/dsh', 'tui:remove:@claude-mem/dsh']);
    expect(JSON.parse(readFileSync(marker, 'utf8'))).toEqual({ profiles: ['web', 'tui'] });
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).watches).toEqual([OWNED_WATCH, USER_WATCH]);
  });

  it('fails visibly on a malformed marker and preserves every state', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const marker = writeMarker(dataDir, '{ "profiles": "web" }');
    const watchPath = writeWatchConfig(home);
    const errors: string[] = [];
    const stderr = spyOn(console, 'error').mockImplementation((...values: unknown[]) => { errors.push(values.map(String).join(' ')); });

    try {
      expect(await runCleanup(home)).toBe(1);
    } finally {
      stderr.mockRestore();
    }
    expect(errors.some(line => line.startsWith('DSH uninstall failed:'))).toBe(true);
    expect(readFileSync(marker, 'utf8')).toBe('{ "profiles": "web" }');
    expect(JSON.parse(readFileSync(watchPath, 'utf8')).watches).toEqual([OWNED_WATCH, USER_WATCH]);
  });

  it('plans absent, present, and unknown DSH targets from marker state', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const watchPath = writeWatchConfig(home, [USER_WATCH]);
    const saved = { HOME: process.env.HOME, USERPROFILE: process.env.USERPROFILE, LOCALAPPDATA: process.env.LOCALAPPDATA, CLAUDE_MEM_DATA_DIR: process.env.CLAUDE_MEM_DATA_DIR, CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH: process.env.CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH };
    Object.assign(process.env, { HOME: home, USERPROFILE: home, LOCALAPPDATA: path.join(home, 'local'), CLAUDE_MEM_DATA_DIR: dataDir, CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH: watchPath });
    try {
      writeWatchConfig(home, [OWNED_WATCH, USER_WATCH]);
      const orphanedWatch = (await prepareIntegrationTargets({
        home,
        claudeConfig: path.join(home, '.claude'),
        dataDir,
        localAppData: path.join(home, 'local'),
        cwd: home,
        environment: { ...process.env },
      })).find(target => target.id === 'dsh');
      expect(orphanedWatch?.state).toBe('unknown');

      writeWatchConfig(home, [USER_WATCH]);
      const absent = (await prepareIntegrationTargets({
        home,
        claudeConfig: path.join(home, '.claude'),
        dataDir,
        localAppData: path.join(home, 'local'),
        cwd: home,
        environment: { ...process.env },
      })).find(target => target.id === 'dsh');
      expect(absent?.state).toBe('absent');

      writeMarker(dataDir, ['web']);
      writeWatchConfig(home, [OWNED_WATCH, USER_WATCH]);
      const present = (await prepareIntegrationTargets({
        home,
        claudeConfig: path.join(home, '.claude'),
        dataDir,
        localAppData: path.join(home, 'local'),
        cwd: home,
        environment: { ...process.env },
      })).find(target => target.id === 'dsh');
      expect(present?.state).toBe('present');

      writeMarker(dataDir, '{ broken');
      const unknown = (await prepareIntegrationTargets({
        home,
        claudeConfig: path.join(home, '.claude'),
        dataDir,
        localAppData: path.join(home, 'local'),
        cwd: home,
        environment: { ...process.env },
      })).find(target => target.id === 'dsh');
      expect(unknown?.state).toBe('unknown');
    } finally {
      for (const [key, value] of Object.entries(saved)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
