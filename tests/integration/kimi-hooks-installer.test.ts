import { afterEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import {
  checkKimiHooksStatus,
  handleKimiCommand,
  KIMI_MARKER_BEGIN,
  KIMI_MARKER_END,
  removeManagedBlock,
  uninstallKimiHooks,
} from '../../src/services/integrations/KimiHooksInstaller.js';

// Decision 09: Kimi installation is retired. Coverage keeps the approved
// cleanup/diagnostics contracts (marker seams, selective MCP removal, failure
// ordering, backup preservation, status labels, install/setup refusal) with
// legacy TOML/MCP/backup fixtures seeded directly.
const BLOCK = `${KIMI_MARKER_BEGIN}\n[[hooks]]\nevent = "Stop"\ncommand = 'x'\n${KIMI_MARKER_END}`;

const ORIGINAL_HOME = process.env.KIMI_CODE_HOME;
let scratch: string | undefined;

afterEach(() => {
  if (ORIGINAL_HOME === undefined) delete process.env.KIMI_CODE_HOME;
  else process.env.KIMI_CODE_HOME = ORIGINAL_HOME;
  if (scratch) rmSync(scratch, { recursive: true, force: true });
  scratch = undefined;
});

function makeScratchHome(): string {
  scratch = path.join(tmpdir(), `kimi-cleanup-test-${process.pid}-${Date.now()}`);
  mkdirSync(scratch, { recursive: true });
  process.env.KIMI_CODE_HOME = scratch;
  return scratch;
}

describe('removeManagedBlock seams', () => {
  test('strips exactly the managed block and keeps user content', () => {
    const merged = `default_model = "kimi-code/k3"\n\n${BLOCK}\n`;
    const restored = removeManagedBlock(merged);
    expect(restored).not.toContain(KIMI_MARKER_BEGIN);
    expect(restored).toContain('default_model');
  });

  test('only collapses blank lines at the seam', () => {
    const merged = `a = 1\n\n\n\nb = 2\n\n${BLOCK}\n`;
    const restored = removeManagedBlock(merged);
    expect(restored).not.toContain(KIMI_MARKER_BEGIN);
    // Unrelated triple blank lines in user content must stay untouched.
    expect(restored).toContain('a = 1\n\n\n\nb = 2');
  });

  test('leaves at most one blank line at the join', () => {
    const merged = `a = 1\n\n\n${BLOCK}\n\n\nb = 2\n`;
    const restored = removeManagedBlock(merged);
    expect(restored).toBe('a = 1\n\nb = 2\n');
  });
});

describe('uninstallKimiHooks', () => {
  test('removes the managed block and keeps user TOML', () => {
    const home = makeScratchHome();
    const configPath = path.join(home, 'config.toml');
    writeFileSync(configPath, `default_model = "kimi-code/k3"\n\n${BLOCK}\n`);

    expect(uninstallKimiHooks()).toBe(0);

    const config = readFileSync(configPath, 'utf-8');
    expect(config).not.toContain(KIMI_MARKER_BEGIN);
    expect(config).toContain('default_model');
  });

  test('removes only the mcp-search entry claude-mem wrote and keeps foreign entries', () => {
    const home = makeScratchHome();
    writeFileSync(path.join(home, 'mcp.json'), JSON.stringify({
      mcpServers: {
        context7: { url: 'https://mcp.context7.com/mcp' },
        'mcp-search': { type: 'stdio', command: 'node', args: ['/x/mcp-server.cjs'] },
      },
    }, null, 2));
    const configPath = path.join(home, 'config.toml');
    writeFileSync(configPath, BLOCK + '\n');

    expect(uninstallKimiHooks()).toBe(0);

    const mcp = JSON.parse(readFileSync(path.join(home, 'mcp.json'), 'utf-8'));
    expect(mcp.mcpServers['mcp-search']).toBeUndefined();
    expect(mcp.mcpServers.context7).toBeDefined();
    expect(readFileSync(configPath, 'utf-8')).not.toContain(KIMI_MARKER_BEGIN);
  });

  test('leaves a foreign mcp-search entry alone', () => {
    const home = makeScratchHome();
    const foreign = { mcpServers: { 'mcp-search': { type: 'stdio', command: 'other-tool', args: ['serve'] } } };
    writeFileSync(path.join(home, 'mcp.json'), JSON.stringify(foreign, null, 2));

    expect(uninstallKimiHooks()).toBe(0);

    expect(JSON.parse(readFileSync(path.join(home, 'mcp.json'), 'utf-8'))).toEqual(foreign);
  });

  test('is a visible no-op when config.toml is missing', () => {
    makeScratchHome();
    expect(uninstallKimiHooks()).toBe(0);
  });

  test('is stable on repeated cleanup', () => {
    const home = makeScratchHome();
    writeFileSync(path.join(home, 'config.toml'), BLOCK + '\n');
    expect(uninstallKimiHooks()).toBe(0);
    expect(uninstallKimiHooks()).toBe(0);
    expect(readFileSync(path.join(home, 'config.toml'), 'utf-8')).not.toContain(KIMI_MARKER_BEGIN);
  });

  test('fails before mutating config.toml when mcp.json is malformed', () => {
    const home = makeScratchHome();
    writeFileSync(path.join(home, 'mcp.json'), '{ broken');
    const configPath = path.join(home, 'config.toml');
    writeFileSync(configPath, BLOCK + '\n');

    expect(uninstallKimiHooks()).toBe(1);
    // Failure ordering: the TOML block must survive when the MCP half fails.
    expect(readFileSync(configPath, 'utf-8')).toContain(KIMI_MARKER_BEGIN);
  });

  test('preserves daily backup artifacts byte for byte', () => {
    const home = makeScratchHome();
    const configPath = path.join(home, 'config.toml');
    const backupBytes = 'default_model = "kimi-code/k3"\n\n' + BLOCK + '\n';
    writeFileSync(configPath, 'default_model = "kimi-code/k3"\n');
    writeFileSync(`${configPath}.bak-20261031`, backupBytes);

    expect(uninstallKimiHooks()).toBe(0);

    expect(existsSync(`${configPath}.bak-20261031`)).toBe(true);
    expect(readFileSync(`${configPath}.bak-20261031`, 'utf-8')).toBe(backupBytes);
  });
});

describe('checkKimiHooksStatus', () => {
  test('labels a detected legacy block as retired', () => {
    const home = makeScratchHome();
    const configPath = path.join(home, 'config.toml');
    writeFileSync(configPath, BLOCK + '\n');
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.join(' ')); };
    try {
      expect(checkKimiHooksStatus()).toBe(0);
    } finally {
      console.log = originalLog;
    }
    expect(lines.some((line) => line.startsWith('  Legacy Kimi hook block: detected'))).toBe(true);
  });

  test('labels an undetected block as retired and keeps the return code', () => {
    makeScratchHome();
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.join(' ')); };
    try {
      expect(checkKimiHooksStatus()).toBe(1);
    } finally {
      console.log = originalLog;
    }
    expect(lines.some((line) => line.startsWith('  Legacy Kimi hook block: not detected; active capture is retired'))).toBe(true);
  });
});

describe('handleKimiCommand refusal', () => {
  test('refuses install and setup with a message and no writes', async () => {
    const home = makeScratchHome();
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => { errors.push(args.join(' ')); };
    try {
      expect(await handleKimiCommand('install', [])).toBe(1);
      expect(await handleKimiCommand('setup', [])).toBe(1);
    } finally {
      console.error = originalError;
    }
    expect(errors.some((line) => line.includes('Unsupported installation target'))).toBe(true);
    expect(existsSync(path.join(home, 'config.toml'))).toBe(false);
    expect(existsSync(path.join(home, 'mcp.json'))).toBe(false);
  });
});
