// Modified by the claude-mem-marian fork: retired host routes and cleanup contracts. Upstream attribution is retained.
import { describe, expect, it } from 'bun:test';
import { readdirSync, readFileSync, lstatSync, readlinkSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

const workerService = join(import.meta.dir, '../../src/services/worker-service.ts');

function snapshot(root: string): string[] {
  const entries: string[] = [];
  const visit = (directory: string): void => {
    for (const name of readdirSync(directory)) {
      const path = join(directory, name);
      const rel = relative(root, path).replaceAll('\\', '/');
      const stat = lstatSync(path);
      if (stat.isDirectory()) {
        entries.push(`directory:${rel}`);
        visit(path);
      } else if (stat.isSymbolicLink()) {
        entries.push(`symlink:${rel}:${readlinkSync(path)}`);
      } else {
        entries.push(`file:${rel}:${readFileSync(path).toString('base64')}`);
      }
    }
  };
  visit(root);
  return entries.sort();
}

describe('worker host install policy', () => {
  for (const host of ['cursor', 'kimi', 'antigravity-cli']) {
    for (const action of ['install', 'setup']) {
      it(`${host} ${action} rejects before worker settings, hook, or cache writes`, () => {
        const root = mkdtempSync(join(tmpdir(), 'cmem-worker-host-policy-'));
        try {
          const home = join(root, 'home');
          const data = join(root, 'data');
          mkdirSync(home);
          mkdirSync(data);
          const before = snapshot(root);
          const result = Bun.spawnSync([process.execPath, workerService, host, action], {
            cwd: root,
            env: {
              ...process.env,
              HOME: home,
              USERPROFILE: home,
              APPDATA: join(home, 'AppData', 'Roaming'),
              LOCALAPPDATA: join(home, 'AppData', 'Local'),
              XDG_CONFIG_HOME: join(home, '.config'),
              CLAUDE_CONFIG_DIR: join(home, '.claude'),
              CLAUDE_MEM_DATA_DIR: data,
              CODEX_HOME: join(home, '.codex'),
              KIMI_CODE_HOME: join(home, '.kimi'),
              GEMINI_CLI_HOME: join(home, '.gemini'),
              BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
              CLAUDE_MEM_TELEMETRY: '0',
            },
            stdout: 'pipe',
            stderr: 'pipe',
            timeout: 30_000,
          });
          expect(result.exitCode).toBe(1);
          expect(result.stderr.toString()).toContain(`Unsupported installation target "${host}"`);
          expect(snapshot(root)).toEqual(before);
        } finally {
          rmSync(root, { recursive: true, force: true });
        }
      }, 35_000);
    }
  }

  // Decision 08: the retired `hook cursor` route refuses before settings,
  // plugin-disabled checks, port resolution, or cwd restoration — exact
  // envelope, exit 0, zero filesystem effect (even with the plugin disabled).
  // Decision 09: identical hoist for the retired `hook kimi` route; the shared
  // `start` command legacy SessionStart rules invoke is untouched.
  for (const [platform, retiredStderr] of [
    ['cursor', 'claude-mem: Cursor hooks are retired; no event was captured. Use worker-service cursor status or cursor uninstall from the affected workspace.\n'],
    ['kimi', 'claude-mem: Kimi hooks are retired; no event was captured. Use worker-service kimi status or kimi uninstall from the affected workspace.\n'],
    ['windsurf', 'claude-mem: Windsurf hooks are retired; no event was captured. Use npx claude-mem uninstall to review legacy cleanup.\n'],
    ['antigravity', 'claude-mem: antigravity-cli hooks are retired; no event was captured. Use npx claude-mem antigravity-cli status|uninstall to inspect or remove legacy configuration.\n'],
    ['antigravity-cli', 'claude-mem: antigravity-cli hooks are retired; no event was captured. Use npx claude-mem antigravity-cli status|uninstall to inspect or remove legacy configuration.\n'],
  ] as const) {
    for (const pluginDisabled of [false, true]) {
      it(`hook ${platform} refuses with the retirement envelope and no filesystem effect (pluginDisabled=${pluginDisabled})`, () => {
        const root = mkdtempSync(join(tmpdir(), 'cmem-worker-host-policy-'));
        try {
          const home = join(root, 'home');
          const data = join(root, 'data');
          mkdirSync(join(home, '.claude'), { recursive: true });
          mkdirSync(data);
          if (pluginDisabled) {
            writeFileSync(join(home, '.claude', 'settings.json'), JSON.stringify({
              enabledPlugins: { 'claude-mem@thedotmack': false },
            }, null, 2));
          }
          const before = snapshot(root);
          const result = Bun.spawnSync([process.execPath, workerService, 'hook', platform, 'session-init'], {
            cwd: root,
            env: {
              ...process.env,
              HOME: home,
              USERPROFILE: home,
              CLAUDE_CONFIG_DIR: join(home, '.claude'),
              CLAUDE_MEM_DATA_DIR: data,
              BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
              CLAUDE_MEM_TELEMETRY: '0',
            },
            stdout: 'pipe',
            stderr: 'pipe',
            timeout: 30_000,
          });
          expect(result.exitCode).toBe(0);
          expect(result.stdout.toString()).toBe('{"continue":true}\n');
          expect(result.stderr.toString()).toBe(retiredStderr);
          expect(snapshot(root)).toEqual(before);
        } finally {
          rmSync(root, { recursive: true, force: true });
        }
      }, 35_000);
    }
  }

  it('the retirements guard only hook invocations — shared start is untouched (source pin)', () => {
    const source = readFileSync(workerService, 'utf8');
    // Both retired-token guards live inside the hoisted `command === 'hook'`
    // conditional at the very top of main(), before the plugin-disabled check.
    const mainHead = source.slice(source.indexOf('async function main()'), source.indexOf('const workerInstallTargets'));
    expect(mainHead).toContain("if (command === 'hook' && commandArgs[1]) {");
    expect(mainHead).toContain("commandArgs[0] === 'cursor'");
    expect(mainHead).toContain("commandArgs[0] === 'kimi'");
    expect(mainHead).toContain("commandArgs[0] === 'windsurf'");
    expect(mainHead).toContain("commandArgs[0] === 'antigravity' || commandArgs[0] === 'antigravity-cli'");
    const hoistEnd = source.indexOf('const workerInstallTargets');
    const pluginCheck = source.indexOf('isPluginDisabledInClaudeSettings()');
    expect(hoistEnd).toBeLessThan(pluginCheck);
  });
});
