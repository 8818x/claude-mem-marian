// Modified by the claude-mem-marian fork to cover explicit installed-state preview/apply boundaries. Upstream attribution is retained.
import { afterEach, describe, expect, it } from 'bun:test';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

const rootRepo = join(import.meta.dir, '..', '..');
const temporaryRoots: string[] = [];
const { resolveIntegrationPlan, formatIntegrationPlan, runSync, runRestart, validateIntegrationPlan } = require('../../scripts/installed-state.cjs');
const { mirrorDirectory } = require('../../scripts/mirror-dir.cjs');
const syncCli = require('../../scripts/sync-marketplace.cjs');
const restartCli = require('../../scripts/restart-marketplace-worker.cjs');

function tempRoot() {
  const root = mkdtempSync(join(tmpdir(), 'marian-installed-state-'));
  temporaryRoots.push(root);
  return root;
}

function writeJson(file: string, value: unknown) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function fixture() {
  const root = tempRoot();
  const checkout = join(root, 'checkout');
  const home = join(root, 'home');
  mkdirSync(checkout, { recursive: true });
  mkdirSync(home, { recursive: true });
  writeJson(join(checkout, 'package.json'), { name: 'claude-mem' });
  writeJson(join(checkout, '.claude-plugin', 'marketplace.json'), {
    name: 'thedotmack',
    plugins: [{ name: 'claude-mem', version: '15.5.0', source: './plugin' }],
  });
  writeFileSync(join(checkout, '.gitignore'), 'ignored.txt\n');
  mkdirSync(join(checkout, 'scripts'), { recursive: true });
  writeFileSync(join(checkout, 'source.txt'), 'checkout source\n');
  writeJson(join(checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '15.5.0' });
  writeFileSync(join(checkout, 'plugin', 'plugin.txt'), 'plugin source\n');
  mkdirSync(join(checkout, 'plugin', 'scripts'), { recursive: true });
  writeFileSync(join(checkout, 'plugin', 'scripts', 'worker-service.cjs'), '');
  return { root, checkout, home, market: join(home, '.claude', 'plugins', 'marketplaces', 'thedotmack'), cache: join(home, '.claude', 'plugins', 'cache', 'thedotmack', 'claude-mem', '15.5.0') };
}

function copyToInstalledTargets(f: ReturnType<typeof fixture>) {
  mkdirSync(f.market, { recursive: true });
  mkdirSync(f.cache, { recursive: true });
  cpSync(join(f.checkout, '.claude-plugin'), join(f.market, '.claude-plugin'), { recursive: true });
  cpSync(join(f.checkout, 'plugin'), join(f.market, 'plugin'), { recursive: true });
}

function snapshot(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const file = join(root, entry.name);
    if (entry.isDirectory()) return [`${entry.name}/`, ...snapshot(file).map(child => `${entry.name}/${child}`)];
    return [`${entry.name}:${readFileSync(file).toString('base64')}`];
  }).sort();
}

function capture<T>(run: () => T): { result: T; output: string } {
  const logs: string[] = [];
  const oldLog = console.log;
  const oldError = console.error;
  console.log = (...args: unknown[]) => logs.push(args.join(' '));
  console.error = (...args: unknown[]) => logs.push(args.join(' '));
  try {
    return { result: run(), output: logs.join('\n') };
  } finally {
    console.log = oldLog;
    console.error = oldError;
  }
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('installed-state integration boundary', () => {
  it('previews sync without changing destination bytes or executing child commands', () => {
    const f = fixture();
    mkdirSync(f.market, { recursive: true });
    writeFileSync(join(f.market, 'sentinel.txt'), 'keep');
    const before = snapshot(join(f.home, '.claude'));
    const calls: unknown[] = [];
    const plan = resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' });

    expect(Object.isFrozen(plan)).toBe(true);
    expect(formatIntegrationPlan(plan)).toContain(`Versioned cache destination: ${f.cache}`);
    expect(formatIntegrationPlan(plan)).toContain('Stale files may be removed: yes');
    expect(() => runRestart({ ...plan, apply: true }, { exec: () => calls.push('restart') })).toThrow('did not request a worker restart');
    runSync(plan, { exec: (...args: unknown[]) => calls.push(args), mirrorMarketplace: syncCli.mirrorMarketplace, mirrorDirectory });

    expect(snapshot(join(f.home, '.claude'))).toEqual(before);
    expect(calls).toEqual([]);
  });

  it('applies both mirrors, preserves exclusions, removes stale entries, and is stable on repeat', () => {
    const f = fixture();
    mkdirSync(join(f.market, '.git'), { recursive: true });
    mkdirSync(join(f.market, 'scripts', 'node_modules'), { recursive: true });
    writeFileSync(join(f.market, '.git', 'keep.txt'), 'git data');
    writeFileSync(join(f.market, 'scripts', 'node_modules', 'keep.txt'), 'installed deps');
    writeFileSync(join(f.market, 'stale.txt'), 'remove');
    mkdirSync(f.cache, { recursive: true });
    writeFileSync(join(f.cache, 'stale.txt'), 'remove');
    const calls: Array<{ command: string; cwd: string }> = [];
    const plan = resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync', apply: true });
    const execute = (command: string, options: { cwd: string }) => calls.push({ command, cwd: options.cwd });

    runSync(plan, { exec: execute, mirrorMarketplace: syncCli.mirrorMarketplace, mirrorDirectory });
    const firstMarket = snapshot(f.market);
    const firstCache = snapshot(f.cache);
    runSync(plan, { exec: execute, mirrorMarketplace: syncCli.mirrorMarketplace, mirrorDirectory });

    expect(readFileSync(join(f.market, 'source.txt'), 'utf8')).toBe('checkout source\n');
    expect(readFileSync(join(f.cache, 'plugin.txt'), 'utf8')).toBe('plugin source\n');
    expect(existsSync(join(f.market, 'stale.txt'))).toBe(false);
    expect(existsSync(join(f.cache, 'stale.txt'))).toBe(false);
    expect(readFileSync(join(f.market, '.git', 'keep.txt'), 'utf8')).toBe('git data');
    expect(readFileSync(join(f.market, 'scripts', 'node_modules', 'keep.txt'), 'utf8')).toBe('installed deps');
    expect(snapshot(f.market)).toEqual(firstMarket);
    expect(snapshot(f.cache)).toEqual(firstCache);
    expect(calls).toEqual([
      { command: 'bun install', cwd: f.market },
      { command: 'bun install', cwd: f.cache },
      { command: 'bun install', cwd: f.market },
      { command: 'bun install', cwd: f.cache },
    ]);
  });

  it('rejects invalid source identity, version, missing source, and source/destination nesting before writes', () => {
    const f = fixture();
    expect(() => resolveIntegrationPlan({ rootDir: join(f.checkout, 'missing'), homeDir: f.home, kind: 'sync' })).toThrow('Checkout root does not exist');
    rmSync(join(f.checkout, 'plugin'), { recursive: true, force: true });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Plugin source does not exist');
    writeJson(join(f.checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '15.5.0' });
    writeJson(join(f.checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'wrong', version: '15.5.0' });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Expected plugin identity');
    writeJson(join(f.checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '../escape' });
    writeJson(join(f.checkout, '.claude-plugin', 'marketplace.json'), { name: 'thedotmack', plugins: [{ name: 'claude-mem', version: '../escape', source: './plugin' }] });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Invalid plugin version path segment');
    writeJson(join(f.checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '15.5.0' });
    writeJson(join(f.checkout, '.claude-plugin', 'marketplace.json'), { name: 'thedotmack', plugins: [{ name: 'claude-mem', version: '15.5.0', source: './plugin' }] });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.checkout, kind: 'sync' })).toThrow('must be separate, non-nested paths');
  });

  it('rejects present destination metadata with a wrong identity', () => {
    const f = fixture();
    writeJson(join(f.market, '.claude-plugin', 'marketplace.json'), { name: 'other', plugins: [] });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Installed marketplace identity');
    rmSync(f.market, { recursive: true, force: true });
    writeJson(join(f.market, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'wrong', version: '15.5.0' });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Installed plugin');
    rmSync(f.market, { recursive: true, force: true });
    writeJson(join(f.cache, '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '14.0.0' });
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Installed plugin');
  });

  it('upgrades an older installed version while preserving its versioned cache', () => {
    const f = fixture();
    const oldCache = join(dirname(f.cache), '14.0.0');
    writeJson(join(f.market, '.claude-plugin', 'marketplace.json'), {
      name: 'thedotmack',
      plugins: [{ name: 'claude-mem', version: '14.0.0', source: './plugin' }],
      legacy: true,
    });
    writeJson(join(f.market, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '14.0.0', legacy: true });
    writeFileSync(join(f.market, 'plugin', 'installed.txt'), 'old marketplace plugin');
    writeJson(join(oldCache, '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '14.0.0' });
    writeFileSync(join(oldCache, 'installed.txt'), 'old cache');
    const oldCacheBefore = snapshot(oldCache);
    const calls: Array<{ command: string; cwd: string }> = [];
    const plan = resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync', apply: true });

    runSync(plan, {
      exec: (command: string, options: { cwd: string }) => calls.push({ command, cwd: options.cwd }),
      mirrorMarketplace: syncCli.mirrorMarketplace,
      mirrorDirectory,
    });

    expect(readFileSync(join(f.market, 'plugin', '.claude-plugin', 'plugin.json'), 'utf8')).toContain('15.5.0');
    expect(readFileSync(join(f.cache, '.claude-plugin', 'plugin.json'), 'utf8')).toContain('15.5.0');
    expect(snapshot(oldCache)).toEqual(oldCacheBefore);
    expect(calls.map(call => call.cwd)).toEqual([f.market, f.cache]);
  });

  it('rejects Windows-reserved and trailing-dot versions for sync and restart before writes', () => {
    for (const version of ['NUL', 'CON.txt', '15.5.0.']) {
      const f = fixture();
      mkdirSync(f.market, { recursive: true });
      writeFileSync(join(f.market, 'sentinel.txt'), 'untouched');
      writeJson(join(f.checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version });
      writeJson(join(f.checkout, '.claude-plugin', 'marketplace.json'), { name: 'thedotmack', plugins: [{ name: 'claude-mem', version, source: './plugin' }] });
      const sync = capture(() => syncCli.main({ argv: ['--apply'], rootDir: f.checkout, homeDir: f.home }));
      expect(sync.result).toBe(1);
      expect(sync.output).toContain('Invalid plugin version path segment');
      expect(readFileSync(join(f.market, 'sentinel.txt'), 'utf8')).toBe('untouched');

      const restart = fixture();
      copyToInstalledTargets(restart);
      writeJson(join(restart.market, '.claude-plugin', 'marketplace.json'), { name: 'thedotmack', plugins: [{ name: 'claude-mem', version, source: './plugin' }] });
      writeJson(join(restart.market, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version });
      writeFileSync(join(restart.market, 'sentinel.txt'), 'untouched');
      expect(() => resolveIntegrationPlan({ rootDir: restart.checkout, homeDir: restart.home, kind: 'restart' })).toThrow('Invalid installed plugin version path segment');
      expect(readFileSync(join(restart.market, 'sentinel.txt'), 'utf8')).toBe('untouched');
    }
  });

  it('rejects a redirected cache target before touching the marketplace', () => {
    const f = fixture();
    const sentinel = join(f.market, 'sentinel.txt');
    mkdirSync(f.market, { recursive: true });
    writeFileSync(sentinel, 'untouched');
    const cacheParent = join(f.home, '.claude', 'plugins', 'cache', 'thedotmack');
    const outside = join(f.root, 'outside');
    mkdirSync(cacheParent, { recursive: true });
    mkdirSync(outside, { recursive: true });
    try {
      symlinkSync(outside, join(cacheParent, 'claude-mem'), 'junction');
    } catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes((error as NodeJS.ErrnoException).code ?? '')) return;
      throw error;
    }
    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync' })).toThrow('Cache destination redirects');
    expect(capture(() => syncCli.main({ argv: ['--apply'], rootDir: f.checkout, homeDir: f.home })).result).toBe(1);
    expect(readFileSync(sentinel, 'utf8')).toBe('untouched');
  });

  it('rejects a redirected plugin source before touching the marketplace', () => {
    const f = fixture();
    const sentinel = join(f.market, 'sentinel.txt');
    mkdirSync(f.market, { recursive: true });
    writeFileSync(sentinel, 'untouched');
    const pluginSource = join(f.checkout, 'plugin');
    const redirectedSource = join(f.checkout, 'plugin-source');
    try {
      renameSync(pluginSource, redirectedSource);
      symlinkSync(redirectedSource, pluginSource, 'junction');
    } catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes((error as NodeJS.ErrnoException).code ?? '')) return;
      throw error;
    }
    const result = capture(() => syncCli.main({ argv: ['--apply'], rootDir: f.checkout, homeDir: f.home }));
    expect(result.result).toBe(1);
    expect(result.output).toContain('Plugin source redirects from its expected path');
    expect(readFileSync(sentinel, 'utf8')).toBe('untouched');
  });

  it('rejects corrupted plans and source changes before applying', () => {
    const f = fixture();
    const plan = resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync', apply: true });
    expect(() => validateIntegrationPlan({ ...plan, marketplaceDestination: join(f.root, 'other') })).toThrow('plan changed after preflight');
    writeJson(join(f.checkout, 'plugin', '.claude-plugin', 'plugin.json'), { name: 'claude-mem', version: '16.0.0' });
    const calls: unknown[] = [];
    expect(() => runSync(plan, { exec: (...args: unknown[]) => calls.push(args), mirrorMarketplace: syncCli.mirrorMarketplace, mirrorDirectory })).toThrow();
    expect(existsSync(f.market)).toBe(false);
    expect(calls).toEqual([]);

    const fresh = fixture();
    const redirectPlan = resolveIntegrationPlan({ rootDir: fresh.checkout, homeDir: fresh.home, kind: 'sync', apply: true });
    const cacheParent = dirname(fresh.cache);
    mkdirSync(cacheParent, { recursive: true });
    const outside = join(fresh.root, 'redirect-after-plan');
    mkdirSync(outside);
    symlinkSync(outside, fresh.cache, 'junction');
    expect(() => runSync(redirectPlan, { exec: (...args: unknown[]) => calls.push(args), mirrorMarketplace: syncCli.mirrorMarketplace, mirrorDirectory })).toThrow('Cache destination redirects');
    expect(existsSync(fresh.market)).toBe(false);
  });

  it('preflights a requested restart source before the first mirror', () => {
    const f = fixture();
    rmSync(join(f.checkout, 'plugin', 'scripts', 'worker-service.cjs'));
    mkdirSync(f.market, { recursive: true });
    writeFileSync(join(f.market, 'sentinel.txt'), 'untouched');
    const result = capture(() => syncCli.main({ argv: ['--apply', '--restart'], rootDir: f.checkout, homeDir: f.home }));
    expect(result.result).toBe(1);
    expect(result.output).toContain('Checkout worker service does not exist');
    expect(readFileSync(join(f.market, 'sentinel.txt'), 'utf8')).toBe('untouched');
  });

  it('rejects an absolute in-plugin scripts junction before mirroring or executing restart', () => {
    const f = fixture();
    const sourceScripts = join(f.checkout, 'plugin', 'scripts');
    const generatedScripts = join(f.checkout, 'plugin', 'generated');
    const sentinel = join(f.market, 'sentinel.txt');
    renameSync(sourceScripts, generatedScripts);
    try {
      symlinkSync(generatedScripts, sourceScripts, 'junction');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(code ?? '')) {
        console.warn(`SKIP: unable to create the junction fixture (${code})`);
        return;
      }
      throw error;
    }
    mkdirSync(f.market, { recursive: true });
    writeFileSync(sentinel, 'untouched');
    const execCalls: string[] = [];
    const result = capture(() => syncCli.main({
      argv: ['--apply', '--restart'],
      rootDir: f.checkout,
      homeDir: f.home,
      exec: (command: string) => {
        execCalls.push(command);
        writeFileSync(sentinel, 'executed');
      },
    }));

    expect(result.result).toBe(1);
    expect(result.output).toContain('Checkout worker scripts directory must not be an absolute symbolic link');
    expect(execCalls).toEqual([]);
    expect(readFileSync(sentinel, 'utf8')).toBe('untouched');
  });

  it('rejects an absolute junction reached through a relative scripts link before mirroring', () => {
    const f = fixture();
    const plugin = join(f.checkout, 'plugin');
    const sourceScripts = join(plugin, 'scripts');
    const generatedScripts = join(plugin, 'generated');
    const realScripts = join(plugin, 'real-scripts');
    const sentinel = join(f.market, 'sentinel.txt');
    renameSync(sourceScripts, realScripts);
    try {
      symlinkSync(realScripts, generatedScripts, 'junction');
      symlinkSync('generated', sourceScripts, 'dir');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(code ?? '')) {
        console.warn(`SKIP: unable to create the relative-directory/absolute-junction chain (${code})`);
        return;
      }
      throw error;
    }
    mkdirSync(f.market, { recursive: true });
    writeFileSync(sentinel, 'untouched');
    const execCalls: string[] = [];
    const result = capture(() => syncCli.main({
      argv: ['--apply', '--restart'],
      rootDir: f.checkout,
      homeDir: f.home,
      exec: (command: string) => {
        execCalls.push(command);
        writeFileSync(sentinel, 'executed');
      },
    }));

    expect(result.result).toBe(1);
    expect(result.output).toContain('must not be an absolute symbolic link');
    expect(execCalls).toEqual([]);
    expect(readFileSync(sentinel, 'utf8')).toBe('untouched');
  });

  it('rejects an absolute worker link reached through a relative file link before mirroring', () => {
    const f = fixture();
    const scripts = join(f.checkout, 'plugin', 'scripts');
    const worker = join(scripts, 'worker-service.cjs');
    const intermediate = join(scripts, 'intermediate.cjs');
    const realWorker = join(scripts, 'real-worker.cjs');
    const sentinel = join(f.market, 'sentinel.txt');
    renameSync(worker, realWorker);
    try {
      symlinkSync(realWorker, intermediate, 'file');
      symlinkSync('intermediate.cjs', worker, 'file');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(code ?? '')) {
        console.warn(`SKIP: unable to create the relative-file/absolute-file chain (${code})`);
        return;
      }
      throw error;
    }
    mkdirSync(f.market, { recursive: true });
    writeFileSync(sentinel, 'untouched');
    const execCalls: string[] = [];
    const result = capture(() => syncCli.main({
      argv: ['--apply', '--restart'],
      rootDir: f.checkout,
      homeDir: f.home,
      exec: (command: string) => {
        execCalls.push(command);
        writeFileSync(sentinel, 'executed');
      },
    }));

    expect(result.result).toBe(1);
    expect(result.output).toContain('must not be an absolute symbolic link');
    expect(execCalls).toEqual([]);
    expect(readFileSync(sentinel, 'utf8')).toBe('untouched');
  });

  it('accepts a simple relative contained scripts link', () => {
    const f = fixture();
    const plugin = join(f.checkout, 'plugin');
    const scripts = join(plugin, 'scripts');
    const realScripts = join(plugin, 'real-scripts');
    renameSync(scripts, realScripts);
    try {
      symlinkSync('real-scripts', scripts, 'dir');
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(code ?? '')) {
        console.warn(`SKIP: unable to create the relative-directory symlink fixture (${code})`);
        return;
      }
      throw error;
    }

    expect(() => resolveIntegrationPlan({ rootDir: f.checkout, homeDir: f.home, kind: 'sync', restart: true })).not.toThrow();
  });

  it('keeps --force preview-only and rejects unknown flags', () => {
    const f = fixture();
    mkdirSync(join(f.market, '.git'), { recursive: true });
    writeFileSync(join(f.market, 'sentinel.txt'), 'untouched');
    const calls: string[] = [];
    const execute = (command: string) => {
      calls.push(command);
      if (command.startsWith('git ')) return 'beta\n';
      if (command === 'bun install') return '';
      throw new Error(`unexpected child command: ${command}`);
    };
    const preview = capture(() => syncCli.main({ argv: ['--force'], rootDir: f.checkout, homeDir: f.home, exec: execute }));
    expect(preview.result).toBe(0);
    expect(preview.output).toContain('Operation: sync (preview)');
    expect(preview.output).toContain('Installed marketplace Git branch: beta');
    expect(calls).toEqual(['git rev-parse --abbrev-ref HEAD']);
    expect(readFileSync(join(f.market, 'sentinel.txt'), 'utf8')).toBe('untouched');
    const blockedApply = capture(() => syncCli.main({ argv: ['--apply'], rootDir: f.checkout, homeDir: f.home, exec: execute }));
    expect(blockedApply.result).toBe(1);
    expect(readFileSync(join(f.market, 'sentinel.txt'), 'utf8')).toBe('untouched');
    const forcedApply = capture(() => syncCli.main({ argv: ['--force', '--apply'], rootDir: f.checkout, homeDir: f.home, exec: execute }));
    expect(forcedApply.result).toBe(0);
    expect(readFileSync(join(f.market, 'source.txt'), 'utf8')).toBe('checkout source\n');
    expect(() => syncCli.parseArgs(['--apply', '--apply'])).toThrow('Duplicate argument');
    expect(() => syncCli.parseArgs(['--root', 'elsewhere'])).toThrow('Unknown argument');
  });

  it('previews standalone restart without checkout manifests and applies only the fixed worker command', () => {
    const f = fixture();
    copyToInstalledTargets(f);
    const emptyCheckout = join(f.root, 'checkout-without-sources');
    mkdirSync(emptyCheckout);
    const plan = resolveIntegrationPlan({ rootDir: emptyCheckout, homeDir: f.home, kind: 'restart' });
    const calls: Array<{ command: string; cwd: string }> = [];
    expect(formatIntegrationPlan(plan)).toContain('Versioned cache destination: not applicable');
    expect(formatIntegrationPlan(plan)).toContain('Stale files may be removed: no');
    expect(formatIntegrationPlan(plan)).toContain('Dependency installs: none');
    expect(() => runSync({ ...plan, apply: true }, { exec: () => calls.push({ command: 'install', cwd: f.market }), mirrorMarketplace: syncCli.mirrorMarketplace, mirrorDirectory })).toThrow('Sync executor requires a sync plan');
    runRestart(plan, { exec: (command: string, options: { cwd: string }) => calls.push({ command, cwd: options.cwd }) });
    expect(calls).toEqual([]);
    const apply = resolveIntegrationPlan({ rootDir: emptyCheckout, homeDir: f.home, kind: 'restart', apply: true });
    runRestart(apply, { exec: (command: string, options: { cwd: string }) => calls.push({ command, cwd: options.cwd }) });
    expect(calls).toEqual([{ command: 'bun plugin/scripts/worker-service.cjs restart', cwd: f.market }]);
    expect(() => restartCli.parseArgs(['--root', 'elsewhere'])).toThrow('Unknown argument');
  });

  it('leaves the cache untouched when the marketplace dependency install fails', () => {
    const f = fixture();
    let restartCalls = 0;
    const cliExec = (command: string, options: { cwd: string }) => {
      if (command === 'bun install') throw new Error(`inert install failure at ${options.cwd}`);
      if (command === 'bun plugin/scripts/worker-service.cjs restart') restartCalls++;
      return '';
    };
    const result = capture(() => syncCli.main({ argv: ['--apply', '--restart'], rootDir: f.checkout, homeDir: f.home, exec: cliExec }));
    expect(result.result).toBe(1);
    expect(restartCalls).toBe(0);
    expect(result.output).toContain('inert install failure');
    expect(existsSync(f.cache)).toBe(false);
  });

  it('gates combined restart on explicit apply and --restart', () => {
    const f = fixture();
    let restartCalls = 0;
    const exec = (command: string) => {
      if (command === 'bun plugin/scripts/worker-service.cjs restart') restartCalls++;
      return '';
    };
    const preview = capture(() => syncCli.main({ argv: ['--restart'], rootDir: f.checkout, homeDir: f.home, exec }));
    expect(preview.result).toBe(0);
    expect(preview.output).toContain('Worker restart: yes');
    expect(restartCalls).toBe(0);
    expect(existsSync(f.market)).toBe(false);
    const apply = capture(() => syncCli.main({ argv: ['--apply', '--restart'], rootDir: f.checkout, homeDir: f.home, exec }));
    expect(apply.result).toBe(0);
    expect(restartCalls).toBe(1);
  });

  it('keeps build/dev local and routes integration npm aliases through preview CLIs', () => {
    const packageJson = JSON.parse(readFileSync(join(rootRepo, 'package.json'), 'utf8'));
    expect(packageJson.scripts.build).toBe('node scripts/sync-plugin-manifests.js && node scripts/build-hooks.js && node scripts/gen-plugin-lockfile.cjs');
    expect(packageJson.scripts.dev).toBe('npm run build');
    expect(packageJson.scripts['build-and-sync']).toBe('npm run build && node scripts/sync-marketplace.cjs --restart');
    expect(packageJson.scripts['sync-marketplace']).toBe('node scripts/sync-marketplace.cjs');
    expect(packageJson.scripts['sync-marketplace:force']).toBe('node scripts/sync-marketplace.cjs --force');
    expect(packageJson.scripts['worker:restart']).toBe('node scripts/restart-marketplace-worker.cjs');
    expect(syncCli.parseArgs(['--restart', '--apply'])).toEqual({ apply: true, force: false, restart: true });
    expect(restartCli.parseArgs(['--apply'])).toEqual({ apply: true });
  });
});
