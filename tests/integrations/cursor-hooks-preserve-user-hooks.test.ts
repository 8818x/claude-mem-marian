import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

// Decision 08: Cursor hook installation is retired. Legacy fixtures are seeded
// directly (never through the removed installer); the retained contracts are
// selective uninstall, status diagnostics, and the install/setup refusal.
describe('Cursor hooks.json cleanup preserves user hooks', () => {
  let tmp: string;
  let home: string;
  let hooksJsonPath: string;
  let originalCwd: string;
  const saved: Record<string, string | undefined> = {};

  const userHook = { command: './my-audit.sh' };
  const ours = (event: string) => ({ command: `bun "W\\worker-service.cjs" hook cursor ${event}` });

  beforeEach(() => {
    tmp = realpathSync(mkdtempSync(path.join(tmpdir(), 'cursor-hooks-')));
    home = path.join(tmp, 'workspace');
    mkdirSync(path.join(home, '.cursor'), { recursive: true });
    hooksJsonPath = path.join(home, '.cursor', 'hooks.json');
    // Isolate the registry (DATA_DIR) and config roots: cleanup unregisters the
    // project, which must never touch the real ~/.claude-mem on this machine.
    for (const key of ['CLAUDE_MEM_DATA_DIR', 'CLAUDE_CONFIG_DIR', 'HOME', 'USERPROFILE']) saved[key] = process.env[key];
    const dataDir = path.join(tmp, 'data');
    mkdirSync(dataDir, { recursive: true });
    process.env.CLAUDE_MEM_DATA_DIR = dataDir;
    process.env.CLAUDE_CONFIG_DIR = path.join(tmp, 'claude');
    process.env.HOME = tmp;
    process.env.USERPROFILE = tmp;
    // Use the 'project' target (.cursor under cwd): never touches the real ~/.cursor.
    originalCwd = process.cwd();
    process.chdir(home);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    rmSync(tmp, { recursive: true, force: true });
  });

  async function installer() {
    const mod = await import('../../src/services/integrations/CursorHooksInstaller.js');
    // Safety: the hooks.json under test must live in the temp workspace.
    expect(path.dirname(hooksJsonPath)).toBe(mod.getTargetDir('project')!);
    return mod;
  }

  const read = () => JSON.parse(readFileSync(hooksJsonPath, 'utf-8'));

  it('refuses install and setup with a message and no writes', async () => {
    const { handleCursorCommand } = await installer();
    const errors: string[] = [];
    const originalError = console.error;
    console.error = (...args: unknown[]) => { errors.push(args.join(' ')); };
    try {
      expect(await handleCursorCommand('install', [])).toBe(1);
      expect(await handleCursorCommand('setup', [])).toBe(1);
    } finally {
      console.error = originalError;
    }
    expect(errors.some((line) => line.includes('not comparable') || line.includes('Unsupported installation target'))).toBe(true);
    expect(existsSync(hooksJsonPath)).toBe(false);
  });

  it('uninstall removes only claude-mem entries and keeps the user\'s', async () => {
    writeFileSync(hooksJsonPath, JSON.stringify({
      version: 1,
      hooks: {
        stop: [userHook, ours('summarize')],
        beforeSubmitPrompt: [ours('session-init'), ours('context'), userHook],
      },
    }));
    const { uninstallCursorHooks } = await installer();

    expect(uninstallCursorHooks('project')).toBe(0);

    expect(read()).toEqual({
      version: 1,
      hooks: {
        stop: [userHook],
        beforeSubmitPrompt: [userHook],
      },
    });
  });

  it('uninstall deletes hooks.json when claude-mem was its only author', async () => {
    writeFileSync(hooksJsonPath, JSON.stringify({ version: 1, hooks: { stop: [ours('summarize')] } }));
    const { uninstallCursorHooks } = await installer();

    expect(uninstallCursorHooks('project')).toBe(0);

    expect(existsSync(hooksJsonPath)).toBe(false);
  });

  it('uninstall leaves an unparseable hooks.json untouched', async () => {
    writeFileSync(hooksJsonPath, '{ not json');
    const { uninstallCursorHooks } = await installer();

    expect(uninstallCursorHooks('project')).toBe(0);
    expect(readFileSync(hooksJsonPath, 'utf-8')).toBe('{ not json');
  });

  it('uninstall removes legacy script entries along with their scripts', async () => {
    const legacyScript = path.join(home, '.cursor', 'hooks', 'session-init.sh');
    mkdirSync(path.dirname(legacyScript), { recursive: true });
    writeFileSync(legacyScript, '#!/bin/sh\n');
    writeFileSync(hooksJsonPath, JSON.stringify({
      version: 1,
      hooks: { beforeSubmitPrompt: [{ command: './.cursor/hooks/session-init.sh' }, userHook] },
    }));
    const { uninstallCursorHooks } = await installer();

    expect(uninstallCursorHooks('project')).toBe(0);

    expect(read()).toEqual({ version: 1, hooks: { beforeSubmitPrompt: [userHook] } });
    expect(existsSync(legacyScript)).toBe(false);
  });

  for (const [label, malformed] of [
    ['an event value that is not an array', { version: 1, hooks: { stop: { command: 'x' } } }],
    ['a hooks value that is not an object', { version: 1, hooks: ['x'] }],
  ] as const) {
    it(`uninstall leaves hooks.json untouched when it has ${label}`, async () => {
      const original = JSON.stringify(malformed);
      writeFileSync(hooksJsonPath, original);
      const { uninstallCursorHooks } = await installer();

      expect(uninstallCursorHooks('project')).toBe(0);
      expect(readFileSync(hooksJsonPath, 'utf-8')).toBe(original);
    });
  }

  async function projectStatusLines(): Promise<string[]> {
    const { checkCursorHooksStatus } = await installer();
    const lines: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => { lines.push(args.join(' ')); };
    try {
      expect(checkCursorHooksStatus()).toBe(0);
    } finally {
      console.log = originalLog;
    }
    const start = lines.findIndex((line) => line.startsWith('Project:'));
    const end = lines.indexOf('', start);
    return lines.slice(start, end);
  }

  it('status reports not installed when only the user\'s hooks remain', async () => {
    writeFileSync(hooksJsonPath, JSON.stringify({ version: 1, hooks: { stop: [userHook] } }));

    expect((await projectStatusLines())[0]).toBe('Project: Not installed (hooks.json has 1 user hook)');
  });

  it('status reports unified entries with a user hook first and no reinstall advice', async () => {
    writeFileSync(hooksJsonPath, JSON.stringify({
      version: 1,
      hooks: { beforeSubmitPrompt: [userHook, ours('session-init'), ours('context')] },
    }));

    const status = await projectStatusLines();
    expect(status[0]).toBe('Project: Installed');
    expect(status).toContain('   Mode: Unified CLI (bun worker-service.cjs)');
    expect(status).toContain('   Other hooks: 1 (preserved)');
    expect(status.join('\n')).not.toContain('reinstall');
  });

  it('status recognises legacy script residue as retired installer leftovers', async () => {
    writeFileSync(hooksJsonPath, JSON.stringify({ version: 1, hooks: { beforeSubmitPrompt: [{ command: './.cursor/hooks/session-init.sh' }] } }));

    const status = await projectStatusLines();
    expect(status[0]).toBe('Project: Installed');
    expect(status).toContain('   Mode: Legacy shell scripts (retired installer residue; \'cursor uninstall\' removes these)');
    expect(status).toContain('   Platform: Unix (bash)');
  });

  it('status reports a legacy project context file as a retired artifact', async () => {
    const rulesDir = path.join(home, '.cursor', 'rules');
    mkdirSync(rulesDir, { recursive: true });
    writeFileSync(path.join(rulesDir, 'claude-mem-context.mdc'), '---\nalwaysApply: true\n---\nlegacy context\n');
    writeFileSync(hooksJsonPath, JSON.stringify({ version: 1, hooks: { stop: [ours('summarize')] } }));

    const status = await projectStatusLines();
    expect(status).toContain('   Context: legacy claude-mem context file present (automatic updates are retired; \'cursor uninstall\' removes it)');
  });
});
