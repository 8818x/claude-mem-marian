import { afterEach, describe, expect, it, mock } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const fixtures: string[] = [];

function fixtureRoot(): string {
  const directory = path.join(tmpdir(), `marian-uninstall-apply-${crypto.randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  fixtures.push(directory);
  return directory;
}

function writeJson(file: string, value: unknown): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

afterEach(() => {
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('generic uninstall application', () => {
  it('cleans detected mixed-host resources, preserves ambiguous Kimi state, and reports partial completion', async () => {
    const home = fixtureRoot();
    const claudeConfig = path.join(home, '.claude');
    const dataDir = path.join(home, '.claude-mem');
    const marketplace = path.join(claudeConfig, 'plugins', 'marketplaces', 'thedotmack');
    const kimiHome = path.join(home, 'kimi');
    const piHome = path.join(home, 'pi-agent');
    const gooseConfig = path.join(home, '.config', 'goose', 'config.yaml');
    const marketplacePath = path.join(marketplace, 'plugin', 'scripts', 'worker-service.cjs');
    mkdirSync(path.dirname(marketplacePath), { recursive: true });
    writeFileSync(marketplacePath, 'fixture worker');
    writeJson(path.join(marketplace, 'package.json'), { version: '15.5.0' });
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(path.join(dataDir, 'preserved-sentinel'), 'user data');

    const knownMarketplaces = path.join(claudeConfig, 'plugins', 'known_marketplaces.json');
    const installedPlugins = path.join(claudeConfig, 'plugins', 'installed_plugins.json');
    const claudeSettings = path.join(claudeConfig, 'settings.json');
    writeJson(knownMarketplaces, { thedotmack: { source: 'fixture' }, other: { source: 'user' } });
    writeJson(installedPlugins, { plugins: { 'claude-mem@thedotmack': { version: '15.5.0' }, 'other@market': { version: '1' } } });
    writeJson(claudeSettings, {
      enabledPlugins: { 'claude-mem@thedotmack': true, 'user-plugin@market': true },
      env: { CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1', USER_SETTING: 'keep' },
      permissions: { allow: ['Read'] },
    });

    const kimiConfig = path.join(kimiHome, 'config.toml');
    const kimiMcp = path.join(kimiHome, 'mcp.json');
    mkdirSync(kimiHome, { recursive: true });
    writeFileSync(kimiConfig, '# user line\n# >>> claude-mem kimi hooks (managed by claude-mem; do not edit) >>>\n[hooks]\n# <<< claude-mem kimi hooks <<<\n# keep this too\n');
    writeJson(kimiMcp, { mcpServers: { 'mcp-search': { command: 'node', args: ['other-tool/mcp-server.cjs'] }, 'user-server': { command: 'user-tool' } } });
    const originalKimiConfig = readFileSync(kimiConfig);
    const originalKimiMcp = readFileSync(kimiMcp);
    const piDirectory = path.join(piHome, 'extensions', 'claude-mem');
    mkdirSync(piDirectory, { recursive: true });
    writeFileSync(path.join(piDirectory, 'index.js'), 'owned extension');
    writeFileSync(path.join(piDirectory, 'user-note.txt'), 'unlisted file');
    const ompHook = path.join(piHome, 'hooks', 'pre', 'claude-mem.ts');
    mkdirSync(path.dirname(ompHook), { recursive: true });
    writeFileSync(ompHook, 'owned hook');
    mkdirSync(path.dirname(gooseConfig), { recursive: true });
    writeFileSync(gooseConfig, 'extensions:\n  other:\n    enabled: true\n  claude-mem:\n    enabled: true\n');

    const originalEnvironment = { ...process.env };
    const originalExitCode = process.exitCode;
    for (const key of [
      'CLAUDE_MEM_WORKER_SCRIPT_PATH', 'CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH',
      'CLAUDE_MEM_T3CODE_SETTINGS_PATH', 'T3CODE_HOME', 'HERMES_HOME',
      'CODEX_HOME', 'OPENCODE_CONFIG_DIR', 'OPENCLAW_CONFIG_DIR',
      'DSH_HOME', 'GOOSE_CONFIG_DIR',
    ]) delete process.env[key];
    Object.assign(process.env, {
      HOME: home,
      USERPROFILE: home,
      LOCALAPPDATA: path.join(home, 'local'),
      CLAUDE_CONFIG_DIR: claudeConfig,
      CLAUDE_MEM_DATA_DIR: dataDir,
      KIMI_CODE_HOME: kimiHome,
      PI_CODING_AGENT_DIR: piHome,
    });
    let shutdownCalls = 0;
    let telemetryCalls = 0;
    mock.module('../../src/services/install/shutdown-helper.js', () => ({
      shutdownWorkerAndWait: async () => {
        shutdownCalls++;
        return { stopped: true, workerWasRunning: false };
      },
    }));
    mock.module('../../src/services/telemetry/cli-telemetry.js', () => ({
      captureCliEvent: async () => { telemetryCalls++; },
    }));

    try {
      const { runUninstallCommand } = await import('../../src/npx-cli/commands/uninstall.js');
      await runUninstallCommand();

      expect(process.exitCode).toBe(1);
      expect(shutdownCalls).toBe(1);
      expect(telemetryCalls).toBe(1);
      expect(existsSync(marketplace)).toBe(false);
      expect(JSON.parse(readFileSync(knownMarketplaces, 'utf8'))).toEqual({ other: { source: 'user' } });
      expect(JSON.parse(readFileSync(installedPlugins, 'utf8'))).toEqual({ plugins: { 'other@market': { version: '1' } } });
      expect(JSON.parse(readFileSync(claudeSettings, 'utf8'))).toEqual({
        enabledPlugins: { 'user-plugin@market': true },
        env: { USER_SETTING: 'keep' },
        permissions: { allow: ['Read'] },
      });
      expect(readFileSync(kimiConfig)).toEqual(originalKimiConfig);
      expect(readFileSync(kimiMcp)).toEqual(originalKimiMcp);
      expect(existsSync(path.join(piDirectory, 'index.js'))).toBe(false);
      expect(readFileSync(path.join(piDirectory, 'user-note.txt'), 'utf8')).toBe('unlisted file');
      expect(existsSync(ompHook)).toBe(false);
      expect(readFileSync(gooseConfig, 'utf8')).toBe('extensions:\n  other:\n    enabled: true\n');
      expect(existsSync(dataDir)).toBe(true);
      expect(readFileSync(path.join(dataDir, 'preserved-sentinel'), 'utf8')).toBe('user data');
    } finally {
      for (const [key, value] of Object.entries(originalEnvironment)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      process.exitCode = originalExitCode ?? 0;
    }
  });
});
