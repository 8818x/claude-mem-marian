import { afterEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { executeUninstallPlan, prepareTargetAsync, type PreparedTarget } from '../../src/npx-cli/commands/uninstall-plan.js';
import { prepareIntegrationTargets } from '../../src/npx-cli/commands/uninstall-targets.js';

const fixtures: string[] = [];

function fixtureRoot(): string {
  const directory = path.join(tmpdir(), `marian-dsh-uninstall-${crypto.randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  fixtures.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('generic uninstall DSH ordering', () => {
  it('runs the native DSH removal before marketplace cleanup through a fake CLI boundary', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, '.claude-mem');
    const markerPath = path.join(dataDir, 'integrations', 'dsh.json');
    const watchPath = path.join(dataDir, 'transcript-watch.json');
    const marketplacePath = path.join(home, 'marketplace');
    mkdirSync(path.dirname(markerPath), { recursive: true });
    mkdirSync(marketplacePath, { recursive: true });
    writeFileSync(markerPath, JSON.stringify({ profiles: ['web'] }));
    writeFileSync(watchPath, JSON.stringify({
      version: 1,
      schemas: { dsh: { preserve: true } },
      watches: [
        { name: 'dsh', schema: 'dsh', managedBy: 'claude-mem' },
        { name: 'user-watch', schema: 'user' },
      ],
    }));

    const oldEnvironment = {
      HOME: process.env.HOME,
      USERPROFILE: process.env.USERPROFILE,
      LOCALAPPDATA: process.env.LOCALAPPDATA,
      CLAUDE_MEM_DATA_DIR: process.env.CLAUDE_MEM_DATA_DIR,
      CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH: process.env.CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH,
    };
    Object.assign(process.env, {
      HOME: home,
      USERPROFILE: home,
      LOCALAPPDATA: path.join(home, 'local'),
      CLAUDE_MEM_DATA_DIR: dataDir,
      CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH: watchPath,
    });

    const calls: string[] = [];
    const dshCommandRunner = async (profile: string, operation: 'remove', target: string): Promise<number> => {
      calls.push(`dsh:plugin --profile ${profile} ${operation} --workspace-root ${target}`);
      expect(existsSync(marketplacePath)).toBe(true);
      return 0;
    };

    try {
      const targets = await prepareIntegrationTargets({
        home,
        claudeConfig: path.join(home, '.claude'),
        dataDir,
        localAppData: path.join(home, 'local'),
        cwd: home,
        environment: { ...process.env },
      }, { dshCommandRunner });
      const dsh = targets.find(target => target.id === 'dsh');
      expect(dsh?.state).toBe('present');

      const marketplace = await prepareTargetAsync({
        id: 'marketplace',
        label: 'Marketplace',
        inspect: () => existsSync(marketplacePath)
          ? { state: 'present', evidence: ['fixture marketplace'], resources: [{ path: marketplacePath, action: 'remove tree', selection: 'fixture only', recursive: true }] }
          : { state: 'absent', evidence: [], resources: [], reason: 'fixture marketplace absent' },
        apply: () => {
          expect(existsSync(markerPath)).toBe(false);
          calls.push('marketplace');
          rmSync(marketplacePath, { recursive: true, force: true });
          return 0;
        },
      });

      const results = await executeUninstallPlan([dsh as PreparedTarget, marketplace]);

      expect(results.map(result => `${result.id}:${result.state}:${result.detail}`)).toEqual([
        'dsh:removed:Cleanup completed.',
        'marketplace:removed:Cleanup completed.',
      ]);
      expect(calls).toEqual(['dsh:plugin --profile web remove --workspace-root @claude-mem/dsh', 'marketplace']);
      expect(existsSync(marketplacePath)).toBe(false);
      const watch = JSON.parse(readFileSync(watchPath, 'utf8'));
      expect(watch.watches).toEqual([{ name: 'user-watch', schema: 'user' }]);
      expect(watch.schemas).toEqual({ dsh: { preserve: true } });
    } finally {
      for (const [key, value] of Object.entries(oldEnvironment)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
