// Modified by the claude-mem-marian fork: verifies unsupported host installs reject before home-directory writes.
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { spawnSync } from 'child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const repoRoot = join(__dirname, '..', '..');

// printHelp() reads the package version relative to dist/npx-cli/, so run a
// bundle laid out like the published package instead of the TypeScript source.
const packageRoot = mkdtempSync(join(tmpdir(), 'claude-mem-help-pkg-'));
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

function runCli(args: string[]) {
  // Isolated HOME so a regression that runs the real command cannot touch a real install.
  const home = mkdtempSync(join(tmpdir(), 'claude-mem-help-'));
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
  try {
    const result = spawnSync(process.execPath, [cliEntry, ...args], {
      encoding: 'utf-8',
      timeout: 30_000,
      stdin: 'ignore',
      cwd: home,
      env,
    });
    // Bun itself creates ~/.bun for its runtime cache; that is not CLI output.
    return { ...result, homeEntries: readdirSync(home).filter((entry) => entry !== '.bun') };
  } finally {
    rmSync(home, { recursive: true, force: true });
  }
}

describe('npx CLI subcommand --help', () => {
  for (const sub of ['install', 'update', 'upgrade', 'uninstall', 'remove', 'repair', 'prune', 'start', 'stop', 'restart']) {
    for (const flag of ['--help', '-h']) {
      it(`${sub} ${flag} prints help and does not run the command`, () => {
        const r = runCli([sub, flag]);
        expect(r.status).toBe(0);
        expect(r.stdout).toContain('Install Commands');
        expect(r.stdout).not.toContain('Stopped running worker');
        expect(r.stdout).not.toContain('Uninstall');
        expect(r.stdout).not.toContain('Cache root:');
        expect(r.homeEntries).toEqual([]);
      });
    }
  }

  it('root install help lists only maintained host identifiers', () => {
    const r = runCli(['--help']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('--ide claude-code');
    expect(r.stdout).toContain('--ide codex-cli');
    expect(r.stdout).not.toContain('--ide <id>');
    expect(r.homeEntries).toEqual([]);
  });
});

describe('npx CLI retired Cursor hook route (Decision 08)', () => {
  it('refuses the exact cursor token at the hook boundary and keeps unknown platforms raw', () => {
    const entrySource = readFileSync(join(__dirname, '..', '..', 'src', 'npx-cli', 'index.ts'), 'utf8');
    // Exact token only — Decision 08 forbids case folding or new aliases.
    expect(entrySource).toContain("args[1] === 'cursor'");
    expect(entrySource).not.toContain("toLowerCase() === 'cursor'");
    // The active-forwarding help line is gone.
    expect(entrySource).not.toContain('hook cursor <event>');
  });
});

describe('npx CLI retired Kimi hook route (Decision 09)', () => {
  it('refuses the exact kimi token at the hook boundary', () => {
    const entrySource = readFileSync(join(__dirname, '..', '..', 'src', 'npx-cli', 'index.ts'), 'utf8');
    expect(entrySource).toContain("args[1] === 'kimi'");
    expect(entrySource).not.toContain("toLowerCase() === 'kimi'");
  });
});


describe('npx CLI retired Windsurf hook route (Decision 10)', () => {
  for (const args of [['hook', 'windsurf'], ['hook', 'windsurf', 'post_run_command'], ['hook', 'windsurf', 'some-future-event']]) {
    it(`refuses ${args.join(' ')} with the retirement envelope and no files`, () => {
      const r = runCli(args);
      expect(r.status).toBe(0);
      expect(r.stdout).toBe('{"continue":true}\n');
      expect(r.stderr).toBe('claude-mem: Windsurf hooks are retired; no event was captured. Use npx claude-mem uninstall to review legacy cleanup.\n');
      expect(r.homeEntries).toEqual([]);
    });
  }

  it('guards before the runtime forwarding import and matches the exact token', () => {
    const entrySource = readFileSync(join(__dirname, '..', '..', 'src', 'npx-cli', 'index.ts'), 'utf8');
    const hookCase = entrySource.indexOf("case 'hook':");
    const guard = entrySource.indexOf("args[1] === 'windsurf'");
    expect(hookCase).toBeGreaterThan(-1);
    expect(guard).toBeGreaterThan(hookCase);
    // The guard precedes the hook case's own runtime-forwarding import.
    expect(guard).toBeLessThan(entrySource.indexOf("'./commands/runtime.js'", guard));
    expect(entrySource).not.toContain("toLowerCase() === 'windsurf'");
  });
});

describe('npx CLI maintained-host installation policy', () => {
  for (const args of [
    ['install', '--ide', 'cursor'],
    ['install', '--ide', 'windsurf'],
    ['install', '--ide', 'codex'],
    ['install', '--ide', 'unknown-host'],
    ['install', '--ide', 'openclaw'],
    ['install', '--ide', 'grok-bot'],
    ['pi', 'install'],
    ['pi', 'setup'],
    ['kimi', 'install'],
    ['kimi', 'setup'],
    ['antigravity-cli', 'install'],
    ['antigravity-cli', 'setup'],
    ['t3code', 'install'],
    ['t3code', 'setup'],
  ]) {
    it(`${args.join(' ')} rejects before writing to the isolated home`, () => {
      const result = runCli(args);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Unsupported installation target');
      expect(result.homeEntries).toEqual([]);
    });
  }
});

describe('npx CLI retired antigravity-cli hook route (Decision 11)', () => {
  for (const args of [
    ['hook', 'antigravity'],
    ['hook', 'antigravity-cli'],
    ['hook', 'antigravity-cli', 'PreInvocation'],
    ['hook', 'antigravity', 'some-future-event'],
  ]) {
    it(`refuses ${args.join(' ')} with the retirement envelope and no files`, () => {
      const r = runCli(args);
      expect(r.status).toBe(0);
      expect(r.stdout).toBe('{"continue":true}\n');
      expect(r.stderr).toBe('claude-mem: antigravity-cli hooks are retired; no event was captured. Use npx claude-mem antigravity-cli status|uninstall to inspect or remove legacy configuration.\n');
      expect(r.homeEntries).toEqual([]);
    });
  }

  it('guards both exact tokens before the runtime forwarding import', () => {
    const entrySource = readFileSync(join(__dirname, '..', '..', 'src', 'npx-cli', 'index.ts'), 'utf8');
    const hookCase = entrySource.indexOf("case 'hook':");
    const guard = entrySource.indexOf("args[1] === 'antigravity' || args[1] === 'antigravity-cli'");
    expect(hookCase).toBeGreaterThan(-1);
    expect(guard).toBeGreaterThan(hookCase);
    expect(guard).toBeLessThan(entrySource.indexOf("'./commands/runtime.js'", guard));
    expect(entrySource).not.toContain("toLowerCase() === 'antigravity");
  });

  it('keeps the legacy management command in help, worded as status/uninstall', () => {
    const r = runCli(['--help']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('npx claude-mem antigravity-cli status|uninstall');
    expect(r.stdout).not.toContain('hook antigravity-cli <event>');
  });
});
