#!/usr/bin/env node
// Modified by the claude-mem-marian fork to require explicit, preflighted installed-state operations. Upstream attribution is retained.

const { execSync } = require('child_process');
const { existsSync, readFileSync } = require('fs');
const path = require('path');
const os = require('os');
const { mirrorDirectory } = require('./mirror-dir.cjs');
const {
  resolveIntegrationPlan,
  formatIntegrationPlan,
  runSync,
  runRestart,
} = require('./installed-state.cjs');

const INSTALLED_PATH = path.join(os.homedir(), '.claude', 'plugins', 'marketplaces', 'thedotmack');
const CACHE_BASE_PATH = path.join(os.homedir(), '.claude', 'plugins', 'cache', 'thedotmack', 'claude-mem');

const BASE_EXCLUDES = [
  '.git',
  'bun.lock',
  'package-lock.json',
  'scripts/package.json',
  'scripts/node_modules',
  '/workers',
];

function getCurrentBranch(installedPath = INSTALLED_PATH, exec = execSync) {
  try {
    if (!existsSync(path.join(installedPath, '.git'))) return null;
    return exec('git rev-parse --abbrev-ref HEAD', {
      cwd: installedPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function getGitignoreExcludes(basePath) {
  const gitignorePath = path.join(basePath, '.gitignore');
  if (!existsSync(gitignorePath)) return [];

  const syncManagedFiles = new Set();
  const lines = readFileSync(gitignorePath, 'utf-8').split('\n');
  return lines
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && !line.startsWith('!') && !syncManagedFiles.has(line));
}

function getMarketplaceExcludes(rootDir) {
  return [...BASE_EXCLUDES, ...getGitignoreExcludes(rootDir)];
}

function mirrorMarketplace(rootDir, installedPath) {
  const exclude = getMarketplaceExcludes(rootDir);
  const stats = mirrorDirectory(rootDir, installedPath, { exclude });
  // These release bundles are generated under ignored directories. Sync only
  // their explicit subtrees, keeping the rest of dist and ignored data excluded.
  for (const relativePath of ['dist/pi-extension', 'dsh/lib']) {
    const source = path.join(rootDir, relativePath);
    if (!existsSync(source)) continue;
    const bundle = mirrorDirectory(source, path.join(installedPath, relativePath), { exclude });
    for (const key of ['copied', 'metadata', 'deleted']) stats[key] += bundle[key];
  }
  return stats;
}

function parseArgs(args) {
  const allowed = new Set(['--apply', '--force', '--restart']);
  const seen = new Set();
  for (const arg of args) {
    if (!allowed.has(arg)) throw new Error(`Unknown argument: ${arg}`);
    if (seen.has(arg)) throw new Error(`Duplicate argument: ${arg}`);
    seen.add(arg);
  }
  return { apply: seen.has('--apply'), force: seen.has('--force'), restart: seen.has('--restart') };
}

function main({ argv = process.argv.slice(2), rootDir = path.join(__dirname, '..'), homeDir = os.homedir(), exec = execSync } = {}) {
  let options;
  try {
    options = parseArgs(argv);
    const plan = resolveIntegrationPlan({ rootDir, homeDir, kind: 'sync', ...options });
    console.log(formatIntegrationPlan(plan));
    const branch = getCurrentBranch(plan.marketplaceDestination, exec);
    if (branch) console.log(`Installed marketplace Git branch: ${branch}`);
    if (branch && branch !== 'main' && !options.force) {
      console.log('Apply is blocked because syncing would overwrite a non-main installed branch. Use --force to bypass only this branch guard.');
      if (options.apply) throw new Error('Installed marketplace branch guard failed');
      return 0;
    }
    if (!options.apply) return 0;
    console.log('Applying installed-state sync.');
    runSync(plan, {
      exec,
      mirrorMarketplace,
      mirrorDirectory,
    });
    console.log('Sync complete.');
    if (options.restart) {
      console.log('Restarting the installed worker after successful sync and dependency installation.');
      runRestart(plan, { exec });
    }
    return 0;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Sync failed:', error.message);
    return 1;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = {
  getGitignoreExcludes,
  getMarketplaceExcludes,
  mirrorMarketplace,
  getCurrentBranch,
  parseArgs,
  main,
  INSTALLED_PATH,
  CACHE_BASE_PATH,
};
