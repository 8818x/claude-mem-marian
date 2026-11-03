// Modified by the claude-mem-marian fork: retired host routes and cleanup contracts. Upstream attribution is retained.
import { afterEach, describe, expect, it, mock } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  executePreparedTarget,
  executeUninstallPlan,
  prepareTargetAsync,
  summarizeUninstallResults,
  type TargetDefinition,
} from '../../src/npx-cli/commands/uninstall-plan.js';
import { prepareIntegrationTargets } from '../../src/npx-cli/commands/uninstall-targets.js';
import { uninstallWindsurfHooks } from '../../src/services/integrations/WindsurfHooksInstaller.js';

const fixtures: string[] = [];

function fixtureRoot(): string {
  const directory = path.join(tmpdir(), `marian-uninstall-plan-${crypto.randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  fixtures.push(directory);
  return directory;
}

function writeJson(file: string, value: unknown): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function snapshot(directory: string): string[] {
  const rows: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else rows.push(`${path.relative(directory, full)}:${readFileSync(full).toString('base64')}`);
    }
  };
  visit(directory);
  return rows.sort();
}

function roots(home: string) {
  const dataDir = path.join(home, 'data');
  return {
    home,
    claudeConfig: path.join(home, '.claude'),
    dataDir,
    localAppData: path.join(home, 'local'),
    cwd: home,
    environment: {
      CLAUDE_MEM_T3CODE_SETTINGS_PATH: path.join(home, 't3', 'settings.json'),
      HERMES_HOME: path.join(home, 'hermes'),
      KIMI_CODE_HOME: path.join(home, 'kimi'),
      OPENCODE_CONFIG_DIR: path.join(home, 'opencode'),
      PI_CODING_AGENT_DIR: path.join(home, 'pi-agent'),
    },
  };
}

function byId<T extends { id: string }>(values: T[], id: string): T {
  const value = values.find(item => item.id === id);
  if (!value) throw new Error(`Missing target ${id}`);
  return value;
}

afterEach(() => {
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('uninstall plan target invariants', () => {
  it('prepares absent and unknown targets without an executor', async () => {
    const absent = await prepareTargetAsync({
      id: 'absent', label: 'Absent', inspect: () => ({ state: 'absent', evidence: [], resources: [] }), apply: () => { throw new Error('must not run'); },
    });
    const unknown = await prepareTargetAsync({
      id: 'unknown', label: 'Unknown', inspect: () => ({ state: 'unknown', evidence: [], resources: [], reason: 'ambiguous' }), apply: () => { throw new Error('must not run'); },
    });

    expect(absent.state).toBe('absent');
    expect('execute' in absent).toBe(false);
    expect(unknown.state).toBe('unknown');
    expect('execute' in unknown).toBe(false);
  });

  it('rechecks evidence before applying and preserves changed targets', async () => {
    let state = true;
    let writes = 0;
    const home = fixtureRoot();
    const targetPath = path.join(home, 'fixture.json');
    writeFileSync(targetPath, 'owned');
    const definition: TargetDefinition = {
      id: 'fixture', label: 'Fixture',
      inspect: () => ({ state: state ? 'present' : 'absent', evidence: [String(state)], resources: state ? [{ path: targetPath, action: 'edit configuration', selection: 'key' }] : [] }),
      apply: () => { writes += 1; return 0; },
    };
    const prepared = await prepareTargetAsync(definition);
    state = false;
    const result = await executePreparedTarget(prepared);

    expect(result.state).toBe('failed');
    expect(result.detail).toContain('changed after the uninstall plan');
    expect(writes).toBe(0);
  });

  it('preserves a present target when resource bytes change after the plan', async () => {
    const home = fixtureRoot();
    const targetPath = path.join(home, 'plugin');
    mkdirSync(targetPath);
    writeFileSync(path.join(targetPath, 'index.js'), 'owned');
    let writes = 0;
    const definition: TargetDefinition = {
      id: 'fixture', label: 'Fixture',
      inspect: () => ({ state: 'present', evidence: ['managed plugin'], resources: [{ path: targetPath, action: 'remove tree', selection: 'recursive plugin directory', recursive: true }] }),
      apply: () => { writes += 1; return 0; },
    };
    const prepared = await prepareTargetAsync(definition);
    writeFileSync(path.join(targetPath, 'index.js'), 'user-edited');
    const result = await executePreparedTarget(prepared);

    expect(result.state).toBe('failed');
    expect(result.detail).toContain('changed after the uninstall plan');
    expect(readFileSync(path.join(targetPath, 'index.js'), 'utf8')).toBe('user-edited');
    expect(writes).toBe(0);
  });

  it('marks a present target unknown when its resources cannot be fingerprinted', async () => {
    const missingPath = path.join(fixtureRoot(), 'missing.json');
    const target = await prepareTargetAsync({
      id: 'fixture', label: 'Fixture',
      inspect: () => ({ state: 'present', evidence: ['claimed registration'], resources: [{ path: missingPath, action: 'edit configuration', selection: 'owned key', sharedConfiguration: true }] }),
      apply: () => { throw new Error('must not run'); },
    });

    expect(target.state).toBe('unknown');
    expect(target.resources[0]?.action).toBe('preserve');
    expect(target.reason).toContain(missingPath);
    expect('execute' in target).toBe(false);
  });

  it('continues independent cleanup after unknown and failed targets, and blocks marketplace on DSH failure', async () => {
    const calls: string[] = [];
    const home = fixtureRoot();
    const dshPath = path.join(home, 'dsh.json');
    const marketplacePath = path.join(home, 'marketplace');
    const codexPath = path.join(home, 'config.toml');
    writeFileSync(dshPath, 'receipt');
    mkdirSync(marketplacePath);
    writeFileSync(path.join(marketplacePath, 'index.js'), 'marketplace');
    writeFileSync(codexPath, 'plugin');
    const dsh = await prepareTargetAsync({
      id: 'dsh', label: 'DSH', inspect: () => ({ state: 'present', evidence: ['receipt'], resources: [{ path: dshPath, action: 'remove file', selection: 'receipt' }] }),
      apply: () => { calls.push('dsh'); return 1; },
    });
    const marketplace = await prepareTargetAsync({
      id: 'marketplace', label: 'Marketplace', inspect: () => ({ state: 'present', evidence: ['directory'], resources: [{ path: marketplacePath, action: 'remove tree', selection: 'all', recursive: true }] }),
      apply: () => { calls.push('marketplace'); return 0; },
    });
    const ambiguous = await prepareTargetAsync({
      id: 'kimi', label: 'Kimi', inspect: () => ({ state: 'unknown', evidence: [], resources: [{ path: 'mcp.json', action: 'preserve', selection: 'ambiguous mcp-search' }] }),
      apply: () => { calls.push('kimi'); return 0; },
    });
    const independent = await prepareTargetAsync({
      id: 'codex', label: 'Codex', inspect: () => ({ state: 'present', evidence: ['exact registration'], resources: [{ path: codexPath, action: 'edit configuration', selection: 'plugin id' }] }),
      apply: () => { calls.push('codex'); return 0; },
    });

    const results = await executeUninstallPlan([dsh, marketplace, ambiguous, independent]);

    expect(calls).toEqual(['dsh', 'codex']);
    expect(results.map(result => [result.id, result.state])).toEqual([
      ['dsh', 'failed'], ['marketplace', 'preserved'], ['kimi', 'skipped-ambiguous'], ['codex', 'removed'],
    ]);
    expect(summarizeUninstallResults(results)).toEqual({ state: 'partial', exitCode: 1 });
  });

  it('removes the DSH integration before the marketplace when both are present', async () => {
    const home = fixtureRoot();
    const dshPath = path.join(home, 'dsh.json');
    const marketplacePath = path.join(home, 'marketplace');
    writeFileSync(dshPath, 'receipt');
    mkdirSync(marketplacePath);
    writeFileSync(path.join(marketplacePath, 'index.js'), 'marketplace');
    const calls: string[] = [];
    const dsh = await prepareTargetAsync({
      id: 'dsh', label: 'DSH',
      inspect: () => ({ state: 'present', evidence: ['validated receipt'], resources: [{ path: dshPath, action: 'remove file', selection: 'receipt' }] }),
      apply: () => { calls.push('dsh'); return 0; },
    });
    const marketplace = await prepareTargetAsync({
      id: 'marketplace', label: 'Marketplace',
      inspect: () => ({ state: 'present', evidence: ['marketplace directory'], resources: [{ path: marketplacePath, action: 'remove tree', selection: 'entire tree', recursive: true }] }),
      apply: () => { calls.push('marketplace'); return 0; },
    });

    const results = await executeUninstallPlan([dsh, marketplace]);

    expect(calls).toEqual(['dsh', 'marketplace']);
    expect(results.map(result => result.state)).toEqual(['removed', 'removed']);
  });

  it('classifies an all-unknown run as failed and an all-absent run as complete', async () => {
    const unknown = await prepareTargetAsync({ id: 'unknown', label: 'Unknown', inspect: () => ({ state: 'unknown', evidence: [], resources: [] }), apply: () => 0 });
    const absent = await prepareTargetAsync({ id: 'absent', label: 'Absent', inspect: () => ({ state: 'absent', evidence: [], resources: [] }), apply: () => 0 });

    expect(summarizeUninstallResults(await executeUninstallPlan([unknown]))).toEqual({ state: 'failed', exitCode: 1 });
    expect(summarizeUninstallResults(await executeUninstallPlan([absent]))).toEqual({ state: 'complete', exitCode: 0 });
  });

  it('resolves no legacy hosts as absent and leaves the fixture unchanged', async () => {
    const home = fixtureRoot();
    const before = snapshot(home);
    const targets = await prepareIntegrationTargets(roots(home));

    expect(targets.every(target => target.state === 'absent')).toBe(true);
    expect(snapshot(home)).toEqual(before);
  });

  it('selects only the detected host in a single-host fixture and preserves unrelated host config', async () => {
    const home = fixtureRoot();
    const gooseConfig = path.join(home, '.config', 'goose', 'config.yaml');
    const kimiMcp = path.join(home, 'kimi', 'mcp.json');
    mkdirSync(path.dirname(gooseConfig), { recursive: true });
    writeFileSync(gooseConfig, 'extensions:\n  goose:\n    enabled: true\n  claude-mem:\n    enabled: true\n');
    writeJson(kimiMcp, { mcpServers: { 'user-server': { command: 'user-tool' } } });
    const before = snapshot(home);

    const targets = await prepareIntegrationTargets(roots(home));

    expect(targets.filter(target => target.state === 'present').map(target => target.id)).toEqual(['goose']);
    expect(snapshot(home)).toEqual(before);
  });

  it('marks Kimi suffix-only mcp-search ownership unknown without changing the fixture', async () => {
    const home = fixtureRoot();
    const root = roots(home);
    const configPath = path.join(home, 'kimi', 'config.toml');
    const mcpPath = path.join(home, 'kimi', 'mcp.json');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, '# >>> claude-mem kimi hooks (managed by claude-mem; do not edit) >>>\n[[hooks]]\n# <<< claude-mem kimi hooks <<<\n');
    writeJson(mcpPath, { mcpServers: { 'mcp-search': { command: 'node', args: ['other-tool/mcp-server.cjs'] } } });
    const before = snapshot(home);

    const kimi = byId(await prepareIntegrationTargets(root), 'kimi');

    expect(kimi.state).toBe('unknown');
    expect(kimi.execute).toBeUndefined();
    expect(snapshot(home)).toEqual(before);
  });

  it('does not mistake T3 Code synthesized default Codex for an installation', async () => {
    const home = fixtureRoot();
    writeJson(path.join(home, 't3', 'settings.json'), {});
    const targets = await prepareIntegrationTargets(roots(home));

    expect(byId(targets, 't3code').state).toBe('absent');
  });

  it('preserves a plugin in a shared standalone Codex home selected by T3 Code', async () => {
    const home = fixtureRoot();
    writeJson(path.join(home, 't3', 'settings.json'), {
      providerInstances: { codex: { driver: 'codex', config: { homePath: path.join(home, '.codex') } } },
    });
    mkdirSync(path.join(home, '.codex'), { recursive: true });
    writeFileSync(path.join(home, '.codex', 'config.toml'), '[plugins."claude-mem@claude-mem-local"]\nenabled = true\n');
    const before = snapshot(home);

    const t3 = byId(await prepareIntegrationTargets(roots(home)), 't3code');

    expect(t3.state).toBe('unknown');
    expect(t3.execute).toBeUndefined();
    expect(snapshot(home)).toEqual(before);
  });

  it('detects T3 provider homes configured through instance environment', async () => {
    const home = fixtureRoot();
    const providerHome = path.join(home, 't3-codex-home');
    writeJson(path.join(home, 't3', 'settings.json'), {
      providerInstances: {
        work: {
          driver: 'codex',
          config: {},
          environment: [{ name: 'CODEX_HOME', value: providerHome }],
        },
      },
    });
    mkdirSync(providerHome, { recursive: true });
    writeFileSync(path.join(providerHome, 'config.toml'), '[plugins."claude-mem@claude-mem-local"]\nenabled = true\n');

    const t3 = byId(await prepareIntegrationTargets(roots(home)), 't3code');

    expect(t3.state).toBe('present');
    expect(t3.evidence.join('\n')).toContain(`home=${providerHome}`);
    expect(t3.resources.map(resource => resource.path)).toContain(path.join(providerHome, 'config.toml'));
  });

  it('marks malformed T3 provider environment as unknown', async () => {
    const home = fixtureRoot();
    writeJson(path.join(home, 't3', 'settings.json'), {
      providerInstances: { work: { driver: 'codex', config: {}, environment: 'CODEX_HOME=/other' } },
    });

    const t3 = byId(await prepareIntegrationTargets(roots(home)), 't3code');

    expect(t3.state).toBe('unknown');
    expect(t3.execute).toBeUndefined();
  });

  it('shows OpenClaw recursive deletion and the user-added-file warning in the plan', async () => {
    const home = fixtureRoot();
    const directory = path.join(home, '.openclaw', 'extensions', 'claude-mem');
    writeJson(path.join(directory, 'package.json'), { name: 'claude-mem', main: 'dist/index.js' });
    mkdirSync(path.join(directory, 'dist'), { recursive: true });
    writeFileSync(path.join(directory, 'dist', 'index.js'), 'plugin');
    writeFileSync(path.join(directory, 'user-note.txt'), 'user data');
    writeJson(path.join(home, '.openclaw', 'openclaw.json'), { plugins: { entries: { 'claude-mem': { enabled: true } }, slots: { memory: 'claude-mem' } } });

    const openclaw = byId(await prepareIntegrationTargets(roots(home)), 'openclaw');
    const tree = openclaw.resources.find(resource => resource.recursive);

    expect(openclaw.state).toBe('present');
    expect(tree?.path).toBe(directory);
    expect(tree?.note).toContain('user-added files');
  });

  it('preserves an OpenClaw extension tree without ownership evidence as Unknown', async () => {
    const home = fixtureRoot();
    const directory = path.join(home, '.openclaw', 'extensions', 'claude-mem');
    mkdirSync(path.join(directory, 'dist'), { recursive: true });
    writeFileSync(path.join(directory, 'dist', 'index.js'), 'unrelated plugin build');
    writeFileSync(path.join(directory, 'user-note.txt'), 'user data');

    const openclaw = byId(await prepareIntegrationTargets(roots(home)), 'openclaw');

    expect(openclaw.state).toBe('unknown');
    const tree = openclaw.resources.find(resource => resource.recursive);
    expect(tree?.action).toBe('preserve');
    expect(tree?.path).toBe(directory);
  });

  it('detects DSH only from its validated receipt and preserves malformed state', async () => {
    const home = fixtureRoot();
    const marker = path.join(home, 'data', 'integrations', 'dsh.json');
    writeJson(marker, { profiles: ['web', 'work'] });
    const dsh = byId(await prepareIntegrationTargets(roots(home)), 'dsh');

    expect(dsh.state).toBe('present');
    expect(dsh.resources.some(resource => resource.path === marker)).toBe(true);
    expect(dsh.resources.some(resource => resource.action === 'run host command' && resource.path === 'dsh://profile/web')).toBe(true);
    writeFileSync(marker, '{broken');

    const malformed = byId(await prepareIntegrationTargets(roots(home)), 'dsh');
    expect(malformed.state).toBe('unknown');
    expect(malformed.execute).toBeUndefined();
  });

  it('preserves DSH when the shared watch config has an unsupported schema', async () => {
    const home = fixtureRoot();
    writeJson(path.join(home, 'data', 'integrations', 'dsh.json'), { profiles: ['web'] });
    writeJson(path.join(home, 'data', 'transcript-watch.json'), { version: 2, schemas: {}, watches: [] });

    const dsh = byId(await prepareIntegrationTargets(roots(home)), 'dsh');

    expect(dsh.state).toBe('unknown');
    expect(dsh.execute).toBeUndefined();
  });

  it('treats malformed Antigravity JSON as unknown', async () => {
    const home = fixtureRoot();
    const hooks = path.join(home, '.gemini', 'config', 'hooks.json');
    mkdirSync(path.dirname(hooks), { recursive: true });
    writeFileSync(hooks, '{broken');
    const before = snapshot(home);

    const target = byId(await prepareIntegrationTargets(roots(home)), 'antigravity');

    expect(target.state).toBe('unknown');
    expect(target.execute).toBeUndefined();
    expect(snapshot(home)).toEqual(before);
  });

  it('treats malformed legacy Antigravity hook collections as unknown', async () => {
    const home = fixtureRoot();
    const settings = path.join(home, '.gemini', 'settings.json');
    writeJson(settings, { hooks: { BeforeAgent: { name: 'user-hook' } } });

    const antigravity = byId(await prepareIntegrationTargets(roots(home)), 'antigravity');

    expect(antigravity.state).toBe('unknown');
    expect(antigravity.execute).toBeUndefined();
  });

  it('recognizes current named Antigravity hooks without treating unrelated hook objects as malformed legacy data', async () => {
    const home = fixtureRoot();
    writeJson(path.join(home, '.gemini', 'config', 'hooks.json'), {
      'claude-mem': { SessionStart: [{ command: 'worker-service hook antigravity' }] },
      'user-hook': { SessionStart: [{ command: 'user-hook' }] },
    });

    const antigravity = byId(await prepareIntegrationTargets(roots(home)), 'antigravity');

    expect(antigravity.state).toBe('present');
    expect(antigravity.resources.map(resource => resource.selection)).toContain('hooks.claude-mem only');
  });

  it('continues cleaning Hermes owned files when receipt-owned config is already absent', async () => {
    const home = fixtureRoot();
    const directory = path.join(home, 'hermes', 'plugins', 'claude-mem');
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, '__init__.py'), 'owned');
    writeJson(path.join(directory, '.claude-mem-install.json'), { version: 1, provider: {}, createdConfig: true });

    const hermes = byId(await prepareIntegrationTargets(roots(home)), 'hermes');

    expect(hermes.state).toBe('present');
    expect(hermes.resources.some(resource => resource.path === path.join(home, 'hermes', 'config.yaml'))).toBe(false);
    expect(hermes.evidence.join('\n')).toContain('config.yaml is absent');
  });

  it('plans only Goose, Pi, and OMP owned paths', async () => {
    const home = fixtureRoot();
    const goose = path.join(home, '.config', 'goose', 'config.yaml');
    mkdirSync(path.dirname(goose), { recursive: true });
    writeFileSync(goose, 'extensions:\n  other:\n    enabled: true\n  claude-mem:\n    enabled: true\n');
    const piDir = path.join(home, 'pi-agent', 'extensions', 'claude-mem');
    mkdirSync(piDir, { recursive: true });
    writeFileSync(path.join(piDir, 'index.js'), 'plugin');
    writeFileSync(path.join(piDir, 'user-note.txt'), 'preserve');
    const omp = path.join(home, 'pi-agent', 'hooks', 'pre', 'claude-mem.ts');
    mkdirSync(path.dirname(omp), { recursive: true });
    writeFileSync(omp, 'hook');

    const targets = await prepareIntegrationTargets(roots(home));
    const pi = byId(targets, 'pi');
    const gooseTarget = byId(targets, 'goose');
    const ompTarget = byId(targets, 'omp');

    expect(gooseTarget.state).toBe('present');
    expect(pi.resources.map(resource => path.basename(resource.path))).toEqual(['index.js']);
    expect(ompTarget.resources.map(resource => resource.path)).toEqual([omp]);
  });

  it('marks ambiguous Goose extension mappings unknown instead of absent', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, '.config', 'goose', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    for (const content of [
      'extensions:\n\tclaude-mem:\n    enabled: true\n',
      'extensions:\n  other:\n    enabled: true\nextensions:\n  claude-mem:\n    enabled: true\n',
    ]) {
      writeFileSync(configPath, content);
      const goose = byId(await prepareIntegrationTargets(roots(home)), 'goose');
      expect(goose.state).toBe('unknown');
      expect(goose.execute).toBeUndefined();
    }
  });

  it('removes only registered Windsurf workspace context and preserves hooks.json top-level data', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const workspace = path.join(home, 'workspace');
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    const registryPath = path.join(dataDir, 'windsurf-projects.json');
    const contextPath = path.join(workspace, '.windsurf', 'rules', 'claude-mem-context.md');
    mkdirSync(path.dirname(hooksPath), { recursive: true });
    mkdirSync(path.dirname(contextPath), { recursive: true });
    writeJson(hooksPath, {
      version: 3,
      userSetting: { preserve: true },
      hooks: { pre_user_prompt: [
        { command: 'bun worker-service.cjs hook windsurf', show_output: false },
        { command: 'user-hook', show_output: true },
      ] },
    });
    writeJson(registryPath, { [workspace]: { installedAt: '2026-10-30T00:00:00Z' } });
    writeFileSync(contextPath, 'managed context');

    const oldEnvironment = {
      HOME: process.env.HOME,
      USERPROFILE: process.env.USERPROFILE,
      LOCALAPPDATA: process.env.LOCALAPPDATA,
      CLAUDE_MEM_DATA_DIR: process.env.CLAUDE_MEM_DATA_DIR,
    };
    process.env.HOME = home;
    process.env.USERPROFILE = home;
    process.env.LOCALAPPDATA = path.join(home, 'local');
    process.env.CLAUDE_MEM_DATA_DIR = dataDir;
    try {
      const { uninstallWindsurfHooks } = await import('../../src/services/integrations/WindsurfHooksInstaller.js');
      expect(uninstallWindsurfHooks({
        workspaceRoots: [workspace],
        hooksPath,
        registryPath,
      })).toBe(0);
    } finally {
      for (const [key, value] of Object.entries(oldEnvironment)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }

    const hooks = JSON.parse(readFileSync(hooksPath, 'utf8'));
    expect(hooks.version).toBe(3);
    expect(hooks.userSetting).toEqual({ preserve: true });
    expect(hooks.hooks.pre_user_prompt).toEqual([{ command: 'user-hook', show_output: true }]);
    expect(existsSync(contextPath)).toBe(false);
    expect(JSON.parse(readFileSync(registryPath, 'utf8'))).toEqual({});
  });

  it('reports repeated cleanup as absent after the first successful run', async () => {
    const home = fixtureRoot();
    const targetFile = path.join(home, 'owned.json');
    writeFileSync(targetFile, '{}');
    const definition = {
      id: 'fixture',
      label: 'Fixture',
      inspect: () => existsSync(targetFile)
        ? { state: 'present' as const, evidence: ['owned marker'], resources: [{ path: targetFile, action: 'remove file' as const, selection: 'exact file' }] }
        : { state: 'absent' as const, evidence: [], resources: [], reason: 'already removed' },
      apply: () => { rmSync(targetFile); return 0; },
    };
    const first = await executePreparedTarget(await prepareTargetAsync(definition));
    const second = await executePreparedTarget(await prepareTargetAsync(definition));

    expect(first.state).toBe('removed');
    expect(second.state).toBe('already-absent');
  });

  it('finds maintained Codex registration and tagged legacy context', async () => {
    const home = fixtureRoot();
    const codexDir = path.join(home, '.codex');
    mkdirSync(codexDir, { recursive: true });
    writeFileSync(path.join(codexDir, 'config.toml'), '[marketplaces."claude-mem-local"]\nsource = "local"\n[plugins."claude-mem@claude-mem-local"]\nenabled = true\n');
    writeFileSync(path.join(codexDir, 'AGENTS.md'), '# Rules\n<claude-mem-context>legacy</claude-mem-context>\n');

    const codex = byId(await prepareIntegrationTargets(roots(home)), 'codex');

    expect(codex.state).toBe('present');
    expect(codex.resources.map(resource => resource.path)).toContain(path.join(codexDir, 'AGENTS.md'));
    expect(codex.resources.map(resource => resource.path)).toContain(path.join(codexDir, 'config.toml'));
  });

  it('does not treat Codex table text or unrelated transcript paths as owned registrations', async () => {
    const home = fixtureRoot();
    const codexDir = path.join(home, '.codex');
    const configPath = path.join(codexDir, 'config.toml');
    mkdirSync(codexDir, { recursive: true });
    writeFileSync(configPath, '# [plugins."claude-mem@claude-mem-local"]\nnotes = """\n[plugins."claude-mem@thedotmack"]\n[marketplaces."claude-mem-local"]\n"""\n');
    let codex = byId(await prepareIntegrationTargets(roots(home)), 'codex');
    expect(codex.state).toBe('absent');

    writeFileSync(configPath, '[plugins."claude-mem@claude-mem-local"]\nenabled = false\n');
    writeJson(path.join(home, 'data', 'transcript-watch.json'), {
      watches: [{ name: 'codex', context: { mode: 'agents', updateOn: ['session_start', 'session_end'], path: path.join(home, 'user-authored.md') } }],
    });
    codex = byId(await prepareIntegrationTargets(roots(home)), 'codex');
    expect(codex.state).toBe('present');
    expect(codex.resources.map(resource => resource.path)).toEqual([configPath]);
  });

  it('runs CLI dry-run against a disposable home without changing files or stopping the worker', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, '.claude-mem');
    const claudeConfig = path.join(home, '.claude');
    const marketplace = path.join(claudeConfig, 'plugins', 'marketplaces', 'thedotmack');
    const cache = path.join(claudeConfig, 'plugins', 'cache', 'thedotmack', 'claude-mem', '15.5.0');
    mkdirSync(marketplace, { recursive: true });
    mkdirSync(cache, { recursive: true });
    writeFileSync(path.join(marketplace, 'sentinel'), 'keep during dry-run');
    writeFileSync(path.join(cache, 'sentinel'), 'keep during dry-run');
    writeJson(path.join(claudeConfig, 'plugins', 'known_marketplaces.json'), { thedotmack: { installLocation: marketplace } });
    writeJson(path.join(claudeConfig, 'plugins', 'installed_plugins.json'), { plugins: { 'claude-mem@thedotmack': { version: '15.5.0' } } });
    writeJson(path.join(claudeConfig, 'settings.json'), { enabledPlugins: { 'claude-mem@thedotmack': true } });
    writeJson(path.join(dataDir, 'settings.json'), { env: { CLAUDE_MEM_RUNTIME: 'worker' } });
    const piDirectory = path.join(home, 'pi-agent', 'extensions', 'claude-mem');
    mkdirSync(piDirectory, { recursive: true });
    for (const name of ['index.js', 'package.json', 'LICENSE.txt', 'CLAUDE-MEM-LICENSE.txt', 'CLAUDE-MEM-NOTICE.txt', 'TYPEBOX-LICENSE.txt', 'TYPEBOX-PROVENANCE.json']) {
      writeFileSync(path.join(piDirectory, name), 'owned pi extension file\n');
    }
    writeFileSync(path.join(piDirectory, 'user-note.txt'), 'unlisted file');

    const oldEnvironment = {
      HOME: process.env.HOME,
      USERPROFILE: process.env.USERPROFILE,
      LOCALAPPDATA: process.env.LOCALAPPDATA,
      CLAUDE_CONFIG_DIR: process.env.CLAUDE_CONFIG_DIR,
      CLAUDE_MEM_DATA_DIR: process.env.CLAUDE_MEM_DATA_DIR,
      PI_CODING_AGENT_DIR: process.env.PI_CODING_AGENT_DIR,
    };
    process.env.HOME = home;
    process.env.USERPROFILE = home;
    process.env.LOCALAPPDATA = path.join(home, 'local');
    process.env.CLAUDE_CONFIG_DIR = claudeConfig;
    process.env.CLAUDE_MEM_DATA_DIR = dataDir;
    process.env.PI_CODING_AGENT_DIR = path.join(home, 'pi-agent');
    let shutdownCalled = false;
    let telemetryCalled = false;
    mock.module('../../src/services/install/shutdown-helper.js', () => ({
      shutdownWorkerAndWait: () => { shutdownCalled = true; throw new Error('dry-run attempted worker shutdown'); },
    }));
    mock.module('../../src/services/telemetry/cli-telemetry.js', () => ({
      captureCliEvent: () => { telemetryCalled = true; throw new Error('dry-run attempted telemetry'); },
    }));
    try {
      const before = snapshot(home);
      const { runUninstallCommand } = await import('../../src/npx-cli/commands/uninstall.js');
      await runUninstallCommand({ dryRun: true });
      expect(snapshot(home)).toEqual(before);
      for (const name of ['index.js', 'package.json', 'LICENSE.txt', 'CLAUDE-MEM-LICENSE.txt', 'CLAUDE-MEM-NOTICE.txt', 'TYPEBOX-LICENSE.txt', 'TYPEBOX-PROVENANCE.json', 'user-note.txt']) {
        expect(existsSync(path.join(piDirectory, name))).toBe(true);
      }
      expect(shutdownCalled).toBe(false);
      expect(telemetryCalled).toBe(false);
    } finally {
      for (const [key, value] of Object.entries(oldEnvironment)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});

describe('Antigravity cleanup inspection (Decision 11)', () => {
  it('lists both MCP files and both tagged context files while preserving peer entries', async () => {
    const home = fixtureRoot();
    const gemini = path.join(home, '.gemini');
    const hooks = path.join(gemini, 'config', 'hooks.json');
    mkdirSync(path.dirname(hooks), { recursive: true });
    writeFileSync(hooks, JSON.stringify({
      'claude-mem': { SessionStart: [{ command: 'bun worker-service.cjs hook antigravity-cli session-init' }] },
      'user-hook': { Stop: [{ command: './user.sh' }] },
    }));
    for (const mcp of [path.join(gemini, 'antigravity', 'mcp_config.json'), path.join(gemini, 'config', 'mcp_config.json')]) {
      mkdirSync(path.dirname(mcp), { recursive: true });
      writeFileSync(mcp, JSON.stringify({ mcpServers: { 'claude-mem': { command: 'node' }, peer: { command: 'peer' } } }));
    }
    writeFileSync(path.join(gemini, 'GEMINI.md'), 'user prose\n<claude-mem-context>\nstale\n</claude-mem-context>\n');
    const rules = path.join(home, '.agents', 'rules');
    mkdirSync(rules, { recursive: true });
    writeFileSync(path.join(rules, 'claude-mem-context.md'), '<claude-mem-context>\nstale\n</claude-mem-context>\n');

    const target = byId(await prepareIntegrationTargets(roots(home)), 'antigravity');
    expect(target.state).toBe('present');
    const paths = target.resources.map(resource => resource.path);
    expect(paths).toContain(path.join(gemini, 'antigravity', 'mcp_config.json'));
    expect(paths).toContain(path.join(gemini, 'config', 'mcp_config.json'));
    expect(paths).toContain(path.join(gemini, 'GEMINI.md'));
    expect(paths).toContain(path.join(rules, 'claude-mem-context.md'));
    // Inspection never rewrites peers or prose.
    expect(JSON.parse(readFileSync(hooks, 'utf-8'))['user-hook']).toBeDefined();
    expect(readFileSync(path.join(gemini, 'GEMINI.md'), 'utf-8')).toContain('user prose');
  });
});

describe('Windsurf malformed and partial cleanup (Decision 10)', () => {
  it('plans unknown and executes nothing when hooks.json is malformed', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    mkdirSync(path.dirname(hooksPath), { recursive: true });
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(hooksPath, '{ broken');
    writeFileSync(path.join(dataDir, 'windsurf-projects.json'), JSON.stringify({
      [path.join(home, 'workspace')]: { installedAt: '2026-01-01T00:00:00.000Z' },
    }));

    const prepared = byId(await prepareIntegrationTargets(roots(home)), 'windsurf');
    expect(prepared.state).toBe('unknown');

    const result = await executePreparedTarget(prepared);
    expect(result.state).toBe('skipped-ambiguous');
    expect(readFileSync(hooksPath, 'utf-8')).toBe('{ broken');
  });

  it('plans unknown and executes nothing when the registry is malformed', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    const registryPath = path.join(dataDir, 'windsurf-projects.json');
    mkdirSync(path.dirname(hooksPath), { recursive: true });
    mkdirSync(dataDir, { recursive: true });
    const hooksBytes = JSON.stringify({ hooks: { post_run_command: [{ command: 'bun worker-service.cjs hook windsurf observation' }] } });
    writeFileSync(hooksPath, hooksBytes);
    writeFileSync(registryPath, '{ broken');

    const prepared = byId(await prepareIntegrationTargets(roots(home)), 'windsurf');
    expect(prepared.state).toBe('unknown');

    const result = await executePreparedTarget(prepared);
    expect(result.state).toBe('skipped-ambiguous');
    expect(readFileSync(hooksPath, 'utf-8')).toBe(hooksBytes);
    expect(readFileSync(registryPath, 'utf-8')).toBe('{ broken');
  });

  it('direct cleanup tolerates a malformed hooks.json, keeps its bytes, and still cleans context and registry', () => {
    const home = fixtureRoot();
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    const registryPath = path.join(home, 'data', 'windsurf-projects.json');
    const workspace = path.join(home, 'workspace');
    mkdirSync(path.dirname(hooksPath), { recursive: true });
    mkdirSync(path.join(workspace, '.windsurf', 'rules'), { recursive: true });
    mkdirSync(path.dirname(registryPath), { recursive: true });
    writeFileSync(hooksPath, '{ broken');
    writeFileSync(path.join(workspace, '.windsurf', 'rules', 'claude-mem-context.md'), 'legacy');
    writeFileSync(registryPath, JSON.stringify({ [workspace]: { installedAt: '2026-01-01T00:00:00.000Z' } }));

    expect(uninstallWindsurfHooks({ hooksPath, registryPath, workspaceRoots: [workspace] })).toBe(0);

    expect(readFileSync(hooksPath, 'utf-8')).toBe('{ broken');
    expect(existsSync(path.join(workspace, '.windsurf', 'rules', 'claude-mem-context.md'))).toBe(false);
    expect(JSON.parse(readFileSync(registryPath, 'utf-8'))[workspace]).toBeUndefined();
  });

  it('empty explicit workspace roots clean hooks but leave the registry untouched', () => {
    const home = fixtureRoot();
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    const registryPath = path.join(home, 'data', 'windsurf-projects.json');
    mkdirSync(path.dirname(hooksPath), { recursive: true });
    mkdirSync(path.dirname(registryPath), { recursive: true });
    writeFileSync(hooksPath, JSON.stringify({ hooks: { post_run_command: [{ command: 'bun worker-service.cjs hook windsurf observation' }] }, unrelatedTopLevel: 'keep me' }));
    const registryBytes = JSON.stringify({ [path.join(home, 'workspace')]: { installedAt: '2026-01-01T00:00:00.000Z' } });
    writeFileSync(registryPath, registryBytes);

    expect(uninstallWindsurfHooks({ hooksPath, registryPath, workspaceRoots: [] })).toBe(0);

    const remaining = JSON.parse(readFileSync(hooksPath, 'utf-8'));
    expect(remaining.hooks).toBeUndefined();
    expect(remaining.unrelatedTopLevel).toBe('keep me');
    expect(readFileSync(registryPath, 'utf-8')).toBe(registryBytes);
  });
});

describe('Windsurf cleanup through the generic plan (Decision 10)', () => {
  it('cleans registered workspaces and managed hooks, preserves an unregistered peer and unrelated fields', async () => {
    const home = fixtureRoot();
    const dataDir = path.join(home, 'data');
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    const registryPath = path.join(dataDir, 'windsurf-projects.json');
    mkdirSync(path.dirname(hooksPath), { recursive: true });
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(hooksPath, JSON.stringify({
      version: 1,
      hooks: { post_run_command: [{ command: 'bun worker-service.cjs hook windsurf observation' }] },
      unrelatedTopLevel: 'keep me',
    }));
    const selected = path.join(home, 'selected-workspace');
    const peer = path.join(home, 'peer-workspace');
    for (const workspace of [selected, peer]) {
      mkdirSync(path.join(workspace, '.windsurf', 'rules'), { recursive: true });
      writeFileSync(path.join(workspace, '.windsurf', 'rules', 'claude-mem-context.md'), 'legacy context');
    }
    writeFileSync(registryPath, JSON.stringify({
      [selected]: { installedAt: '2026-01-01T00:00:00.000Z' },
    }, null, 2));

    const prepared = byId(await prepareIntegrationTargets(roots(home)), 'windsurf');
    expect(prepared.state).toBe('present');

    const result = await executePreparedTarget(prepared);
    expect(result.state).toBe('removed');

    const remaining = JSON.parse(readFileSync(hooksPath, 'utf-8'));
    expect(remaining.unrelatedTopLevel).toBe('keep me');
    expect(remaining.hooks).toBeUndefined();
    expect(existsSync(path.join(selected, '.windsurf', 'rules', 'claude-mem-context.md'))).toBe(false);
    // The unregistered peer workspace is outside the plan entirely.
    expect(readFileSync(path.join(peer, '.windsurf', 'rules', 'claude-mem-context.md'), 'utf-8')).toBe('legacy context');
    expect(JSON.parse(readFileSync(registryPath, 'utf-8'))[selected]).toBeUndefined();

    expect(byId(await prepareIntegrationTargets(roots(home)), 'windsurf').state).toBe('absent');
  });
});
