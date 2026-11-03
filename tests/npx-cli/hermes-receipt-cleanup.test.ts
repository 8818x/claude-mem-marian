import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { executePreparedTarget } from '../../src/npx-cli/commands/uninstall-plan.js';
import { prepareIntegrationTargets } from '../../src/npx-cli/commands/uninstall-targets.js';

const fixtures: string[] = [];

function fixtureRoot(): string {
  const directory = path.join(tmpdir(), `marian-hermes-cleanup-${crypto.randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  fixtures.push(directory);
  return directory;
}

function roots(home: string) {
  return {
    home,
    claudeConfig: path.join(home, '.claude'),
    dataDir: path.join(home, 'data'),
    localAppData: path.join(home, 'local'),
    cwd: home,
    environment: {
      HERMES_HOME: path.join(home, 'hermes'),
    },
  };
}

function byId<T extends { id: string }>(values: T[], id: string): T {
  const value = values.find(item => item.id === id);
  if (!value) throw new Error(`Missing target ${id}`);
  return value;
}

function writeJson(file: string, value: unknown): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeOwnedFiles(home: string): string {
  const directory = path.join(home, 'hermes', 'plugins', 'claude-mem');
  mkdirSync(directory, { recursive: true });
  for (const name of ['__init__.py', 'client.py', 'plugin.yaml', 'README.md']) {
    writeFileSync(path.join(directory, name), 'legacy provider file\n');
  }
  return directory;
}

async function runHermesCleanup(home: string) {
  pointHermesHomeAt(home);
  return executePreparedTarget(byId(await prepareIntegrationTargets(roots(home)), 'hermes'));
}

function pointHermesHomeAt(home: string): void {
  process.env.HERMES_HOME = path.join(home, 'hermes');
}

let savedHermesHome: string | undefined;

beforeEach(() => {
  savedHermesHome = process.env.HERMES_HOME;
});

afterEach(() => {
  if (savedHermesHome === undefined) delete process.env.HERMES_HOME;
  else process.env.HERMES_HOME = savedHermesHome;
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('Hermes receipt-driven legacy cleanup', () => {
  it('restores only receipt-owned provider and MCP state and preserves unrelated config and user files', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, [
      '# user notes',
      'credentials:',
      '  api_key: keep-me',
      'memory:',
      '  memory_enabled: true',
      '  provider: claude-mem',
      'mcp_servers:',
      '  other:',
      '    command: x',
      '  claude-mem:',
      '    command: node',
      '    args:',
      '      - mcp-server.cjs',
      '    enabled: true',
      '',
    ].join('\n'));
    const directory = writeOwnedFiles(home);
    writeFileSync(path.join(directory, 'user-notes.txt'), 'preserve');
    writeJson(path.join(directory, '.claude-mem-install.json'), {
      version: 1,
      provider: { memoryHeader: 'memory:', providerLine: '  provider: old' },
      mcp: { mcpHeader: 'mcp_servers:', installedEntry: '  claude-mem:\n    command: node\n    args:\n      - mcp-server.cjs\n    enabled: true' },
    });

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('removed');
    expect(readConfig(configPath)).toBe([
      '# user notes',
      'credentials:',
      '  api_key: keep-me',
      'memory:',
      '  memory_enabled: true',
      '  provider: old',
      'mcp_servers:',
      '  other:',
      '    command: x',
      '',
    ].join('\n'));
    for (const name of ['__init__.py', 'client.py', 'plugin.yaml', 'README.md', '.claude-mem-install.json']) {
      expect(existsSync(path.join(directory, name))).toBe(false);
    }
    expect(readFileSync(path.join(directory, 'user-notes.txt'), 'utf8')).toBe('preserve');
    expect(existsSync(directory)).toBe(true);

    const again = await runHermesCleanup(home);
    expect(again.state).toBe('already-absent');
  });

  it('removes an installer-created config only when restoration leaves it blank and the receipt records creation', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'memory:\n  provider: claude-mem\n');
    writeOwnedFiles(home);
    writeJson(path.join(home, 'hermes', 'plugins', 'claude-mem', '.claude-mem-install.json'), {
      version: 1,
      provider: { memoryHeader: null, providerLine: null },
      createdConfig: true,
    });

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('removed');
    expect(existsSync(configPath)).toBe(false);
    expect(existsSync(path.join(home, 'hermes', 'plugins', 'claude-mem'))).toBe(false);
  });

  it('keeps a pre-existing config file when the receipt does not record creation', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'memory:\n  provider: claude-mem\n');
    writeOwnedFiles(home);
    writeJson(path.join(home, 'hermes', 'plugins', 'claude-mem', '.claude-mem-install.json'), {
      version: 1,
      provider: { memoryHeader: null, providerLine: null },
      createdConfig: false,
    });

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('removed');
    expect(existsSync(configPath)).toBe(true);
    expect(readConfig(configPath)).toBe('');
  });

  it('removes named owned files without a receipt and leaves shared config untouched', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'memory:\n  provider: claude-mem\n  memory_enabled: true\n');
    const directory = writeOwnedFiles(home);
    pointHermesHomeAt(home);

    const planned = byId(await prepareIntegrationTargets(roots(home)), 'hermes');
    expect(planned.state).toBe('present');
    expect(planned.resources.some(resource => resource.path === configPath)).toBe(false);

    const result = await executePreparedTarget(planned);

    expect(result.state).toBe('removed');
    expect(readConfig(configPath)).toBe('memory:\n  provider: claude-mem\n  memory_enabled: true\n');
    expect(existsSync(path.join(directory, '__init__.py'))).toBe(false);
    expect(existsSync(path.join(directory, '.claude-mem-install.json'))).toBe(false);
    expect(existsSync(directory)).toBe(false);
  });

  it('skips cleanup as ambiguous on a corrupt receipt and preserves every resource', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'memory:\n  provider: claude-mem\n');
    const directory = writeOwnedFiles(home);
    writeFileSync(path.join(directory, '.claude-mem-install.json'), '{ not json');

    const planned = byId(await prepareIntegrationTargets(roots(home)), 'hermes');

    expect(planned.state).toBe('unknown');
    expect('execute' in planned).toBe(false);
    const result = await executePreparedTarget(planned);
    expect(result.state).toBe('skipped-ambiguous');
    expect(readConfig(configPath)).toBe('memory:\n  provider: claude-mem\n');
    expect(existsSync(path.join(directory, '__init__.py'))).toBe(true);
  });

  it('removes only matching managed bytecode and preserves unmatched cache and user files', async () => {
    const home = fixtureRoot();
    const directory = writeOwnedFiles(home);
    mkdirSync(path.join(directory, '__pycache__'), { recursive: true });
    writeFileSync(path.join(directory, '__pycache__', '__init__.cpython-311.pyc'), 'managed bytecode');
    writeFileSync(path.join(directory, '__pycache__', 'notes.pyc'), 'unrelated bytecode');

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('removed');
    expect(existsSync(path.join(directory, '__pycache__', '__init__.cpython-311.pyc'))).toBe(false);
    expect(existsSync(path.join(directory, '__pycache__', 'notes.pyc'))).toBe(true);
    expect(existsSync(path.join(directory, '__pycache__'))).toBe(true);
    expect(existsSync(directory)).toBe(true);
  });

  it('leaves a provider the user chose since install untouched', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'memory:\n  provider: myown\n  memory_enabled: true\n');
    const directory = writeOwnedFiles(home);
    writeJson(path.join(directory, '.claude-mem-install.json'), {
      version: 1,
      provider: { memoryHeader: 'memory:', providerLine: '  provider: old' },
    });

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('removed');
    expect(readConfig(configPath)).toBe('memory:\n  provider: myown\n  memory_enabled: true\n');
  });

  it('keeps a claude-mem MCP entry the user edited after install', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'mcp_servers:\n  claude-mem:\n    command: node\n    args:\n      - user-changed.cjs\n    enabled: true\n');
    const directory = writeOwnedFiles(home);
    writeJson(path.join(directory, '.claude-mem-install.json'), {
      version: 1,
      mcp: { mcpHeader: 'mcp_servers:', installedEntry: '  claude-mem:\n    command: node\n    args:\n      - mcp-server.cjs\n    enabled: true' },
    });

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('removed');
    expect(readConfig(configPath)).toBe('mcp_servers:\n  claude-mem:\n    command: node\n    args:\n      - user-changed.cjs\n    enabled: true\n');
  });

  it('fails before removing plugin files when the shared config cannot be restored', async () => {
    const home = fixtureRoot();
    const configPath = path.join(home, 'hermes', 'config.yaml');
    mkdirSync(path.dirname(configPath), { recursive: true });
    writeFileSync(configPath, 'memory: {provider: claude-mem}\n');
    const directory = writeOwnedFiles(home);
    writeJson(path.join(directory, '.claude-mem-install.json'), {
      version: 1,
      provider: { memoryHeader: null, providerLine: null },
    });

    const result = await runHermesCleanup(home);

    expect(result.state).toBe('failed');
    expect(readConfig(configPath)).toBe('memory: {provider: claude-mem}\n');
    expect(existsSync(path.join(directory, '__init__.py'))).toBe(true);
    expect(existsSync(path.join(directory, 'README.md'))).toBe(true);
  });
});

function readConfig(configPath: string): string {
  return existsSync(configPath) ? readFileSync(configPath, 'utf8') : '';
}
