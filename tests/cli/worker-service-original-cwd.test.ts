// Modified by the claude-mem-marian fork: retired host routes and cleanup contracts. Upstream attribution is retained.
import { afterEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// The on-PATH launcher (and bun-runner.js) start Bun in a neutral directory
// and pass the caller's directory in CLAUDE_MEM_HOOK_ORIGINAL_CWD (#4628).
// Subcommands that act on the current project must run there, not in the
// neutral directory.
const repoRoot = join(import.meta.dir, '..', '..');
const workerService = join(repoRoot, 'src', 'services', 'worker-service.ts');
const sandboxes: string[] = [];
afterEach(() => { for (const root of sandboxes.splice(0)) rmSync(root, { recursive: true, force: true }); });

describe('worker-service subcommands launched from a neutral directory', () => {
  it('clean acts on the caller\'s directory', () => {
    const root = mkdtempSync(join(tmpdir(), 'cm-original-cwd-')); sandboxes.push(root);
    const neutral = join(root, 'neutral'); const project = join(root, 'project'); const data = join(root, 'data');
    mkdirSync(neutral); mkdirSync(join(project, 'sub'), { recursive: true }); mkdirSync(data);
    const generated = '<claude-mem-context>\nold activity\n</claude-mem-context>\n';
    writeFileSync(join(project, 'sub', 'CLAUDE.md'), generated);
    writeFileSync(join(neutral, 'CLAUDE.md'), generated);

    const run = Bun.spawnSync([process.execPath, workerService, 'clean'], {
      cwd: neutral,
      env: { ...process.env, CLAUDE_MEM_HOOK_ORIGINAL_CWD: project, CLAUDE_MEM_DATA_DIR: data, CLAUDE_CONFIG_DIR: data, CLAUDE_MEM_TELEMETRY: '0' },
      stdout: 'pipe', stderr: 'pipe',
    });
    expect(run.exitCode).toBe(0);

    const projectFile = join(project, 'sub', 'CLAUDE.md');
    expect(existsSync(projectFile) ? readFileSync(projectFile, 'utf8') : '').not.toContain('old activity');
    expect(readFileSync(join(neutral, 'CLAUDE.md'), 'utf8')).toBe(generated);
  }, 30_000);
  it('cursor status reads the caller\'s project .cursor', () => {
    const root = mkdtempSync(join(tmpdir(), 'cm-original-cwd-')); sandboxes.push(root);
    const neutral = join(root, 'neutral'); const project = join(root, 'project'); const data = join(root, 'data');
    mkdirSync(neutral); mkdirSync(join(project, '.cursor'), { recursive: true }); mkdirSync(data);
    // A hooks.json with no claude-mem entries: status reports it by its user-hook count.
    writeFileSync(join(project, '.cursor', 'hooks.json'), '{"version":1,"hooks":{}}');

    const run = Bun.spawnSync([process.execPath, workerService, 'cursor', 'status'], {
      cwd: neutral,
      env: { ...process.env, HOME: data, USERPROFILE: data, CLAUDE_MEM_HOOK_ORIGINAL_CWD: project, CLAUDE_MEM_DATA_DIR: data, CLAUDE_CONFIG_DIR: data, CLAUDE_MEM_TELEMETRY: '0' },
      stdout: 'pipe', stderr: 'pipe',
    });
    const stdout = run.stdout.toString();
    expect(stdout).toContain('Project: Not installed (hooks.json has 0 user hooks)');
  }, 30_000);

  it('keeps the direct cursor uninstall route reachable from the caller\'s project', () => {
    const root = mkdtempSync(join(tmpdir(), 'cm-original-cwd-')); sandboxes.push(root);
    const neutral = join(root, 'neutral'); const project = join(root, 'project'); const data = join(root, 'data');
    const hooksPath = join(project, '.cursor', 'hooks.json');
    const userHooks = { version: 1, hooks: { stop: [{ command: 'user-hook' }] } };
    mkdirSync(neutral); mkdirSync(join(project, '.cursor'), { recursive: true }); mkdirSync(data);
    writeFileSync(hooksPath, JSON.stringify(userHooks));

    const run = Bun.spawnSync([process.execPath, workerService, 'cursor', 'uninstall', 'project'], {
      cwd: neutral,
      env: { ...process.env, HOME: data, USERPROFILE: data, CLAUDE_MEM_HOOK_ORIGINAL_CWD: project, CLAUDE_MEM_DATA_DIR: data, CLAUDE_CONFIG_DIR: data, CLAUDE_MEM_TELEMETRY: '0' },
      stdout: 'pipe', stderr: 'pipe',
    });
    const stdout = run.stdout.toString();
    expect(run.exitCode).toBe(0);
    expect(stdout).toContain('Uninstalling Claude-Mem Cursor hooks (project level)');
    expect(JSON.parse(readFileSync(hooksPath, 'utf8'))).toEqual(userHooks);
  }, 30_000);
});

describe('worker-service retired Kimi hook refusal (Decision 09)', () => {
  it('refuses hook kimi before cwd restoration, with the exact envelope', () => {
    const root = mkdtempSync(join(tmpdir(), 'cm-kimi-refusal-')); sandboxes.push(root);
    const neutral = join(root, 'neutral');
    mkdirSync(neutral);
    writeFileSync(join(neutral, 'sentinel'), 'unchanged');

    const run = Bun.spawnSync([process.execPath, workerService, 'hook', 'kimi', 'summarize'], {
      cwd: neutral,
      env: {
        ...process.env,
        CLAUDE_MEM_HOOK_ORIGINAL_CWD: root,
        CLAUDE_CONFIG_DIR: join(root, 'claude'),
        CLAUDE_MEM_DATA_DIR: join(root, 'data'),
        BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
        CLAUDE_MEM_TELEMETRY: '0',
      },
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 30_000,
    });

    expect(run.exitCode).toBe(0);
    expect(run.stdout.toString()).toBe('{"continue":true}\n');
    expect(run.stderr.toString()).toBe('claude-mem: Kimi hooks are retired; no event was captured. Use worker-service kimi status or kimi uninstall from the affected workspace.\n');
    // The refusal precedes cwd restoration: the sentinel in the original cwd
    // is untouched and no capture-side artifacts appeared anywhere.
    expect(existsSync(join(neutral, 'sentinel'))).toBe(true);
    expect(readFileSync(join(neutral, 'sentinel'), 'utf-8')).toBe('unchanged');
  });
});

describe('worker-service retired Windsurf hook refusal (Decision 10)', () => {
  it('places the hoist before plugin checks, port resolution, and cwd restoration (source order)', () => {
    const source = readFileSync(workerService, 'utf8');
    const guard = source.indexOf("commandArgs[0] === 'windsurf'");
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(source.indexOf('isPluginDisabledInClaudeSettings()'));
    // getWorkerPort is called by earlier helpers too; compare against the call
    // that follows the guard in main().
    expect(source.indexOf('getWorkerPort(', guard)).toBeGreaterThan(guard);
    expect(guard).toBeLessThan(source.indexOf('restoreHookOriginalCwd()'));
  });

  it('refuses hook windsurf with the exact envelope even with an invalid original cwd', () => {
    const root = mkdtempSync(join(tmpdir(), 'cm-windsurf-refusal-')); sandboxes.push(root);
    const neutral = join(root, 'neutral');
    mkdirSync(neutral);

    const run = Bun.spawnSync([process.execPath, workerService, 'hook', 'windsurf', 'observation'], {
      cwd: neutral,
      env: {
        ...process.env,
        CLAUDE_MEM_HOOK_ORIGINAL_CWD: join(root, 'does-not-exist'),
        CLAUDE_CONFIG_DIR: join(root, 'claude'),
        CLAUDE_MEM_DATA_DIR: join(root, 'data'),
        BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
        CLAUDE_MEM_TELEMETRY: '0',
      },
      stdout: 'pipe',
      stderr: 'pipe',
      timeout: 30_000,
    });

    expect(run.exitCode).toBe(0);
    expect(run.stdout.toString()).toBe('{"continue":true}\n');
    expect(run.stderr.toString()).toBe('claude-mem: Windsurf hooks are retired; no event was captured. Use npx claude-mem uninstall to review legacy cleanup.\n');
  });
});

describe('worker-service retired antigravity-cli hook refusal (Decision 11)', () => {
  it('places both-token hoist before plugin checks, port resolution, and cwd restoration (source order)', () => {
    const source = readFileSync(workerService, 'utf8');
    const guard = source.indexOf("commandArgs[0] === 'antigravity'");
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(source.indexOf('isPluginDisabledInClaudeSettings()'));
    expect(source.indexOf('getWorkerPort(', guard)).toBeGreaterThan(guard);
    expect(guard).toBeLessThan(source.indexOf('restoreHookOriginalCwd()'));
  });

  for (const token of ['antigravity', 'antigravity-cli']) {
    it(`refuses hook ${token} with the exact envelope even with an invalid original cwd`, () => {
      const root = mkdtempSync(join(tmpdir(), 'cm-antigravity-refusal-')); sandboxes.push(root);
      const neutral = join(root, 'neutral');
      mkdirSync(neutral);

      const run = Bun.spawnSync([process.execPath, workerService, 'hook', token, 'PreInvocation'], {
        cwd: neutral,
        env: {
          ...process.env,
          CLAUDE_MEM_HOOK_ORIGINAL_CWD: join(root, 'does-not-exist'),
          CLAUDE_CONFIG_DIR: join(root, 'claude'),
          CLAUDE_MEM_DATA_DIR: join(root, 'data'),
          BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
          CLAUDE_MEM_TELEMETRY: '0',
        },
        stdout: 'pipe',
        stderr: 'pipe',
        timeout: 30_000,
      });

      expect(run.exitCode).toBe(0);
      expect(run.stdout.toString()).toBe('{"continue":true}\n');
      expect(run.stderr.toString()).toBe('claude-mem: antigravity-cli hooks are retired; no event was captured. Use npx claude-mem antigravity-cli status|uninstall to inspect or remove legacy configuration.\n');
    });
  }
});
