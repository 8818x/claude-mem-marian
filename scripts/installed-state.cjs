// Modified by the claude-mem-marian fork to require explicit, preflighted installed-state operations. Upstream attribution is retained.

const fs = require('fs');
const path = require('path');

const PLUGIN_NAME = 'claude-mem';
const MARKETPLACE_NAME = 'thedotmack';
const CACHE_RELATIVE = ['.claude', 'plugins', 'cache', MARKETPLACE_NAME, PLUGIN_NAME];
const MARKETPLACE_RELATIVE = ['.claude', 'plugins', 'marketplaces', MARKETPLACE_NAME];
const WORKER_RELATIVE = ['plugin', 'scripts', 'worker-service.cjs'];

function canonicalExistingAncestor(input) {
  const absolute = path.resolve(input);
  const missing = [];
  let cursor = absolute;
  while (true) {
    try {
      fs.lstatSync(cursor);
      break;
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
    }
    const parent = path.dirname(cursor);
    if (parent === cursor) throw new Error(`No existing ancestor for path: ${input}`);
    missing.unshift(path.basename(cursor));
    cursor = parent;
  }
  return path.join(fs.realpathSync.native(cursor), ...missing);
}

function key(input) {
  const value = path.normalize(input).replace(/[\\/]+$/, '');
  return process.platform === 'win32' ? value.toLowerCase() : value;
}

function isSameOrNested(parent, child) {
  const parentKey = key(parent);
  const childKey = key(child);
  return childKey === parentKey || childKey.startsWith(`${parentKey}${path.sep}`);
}

function assertDisjoint(aName, aPath, bName, bPath) {
  if (isSameOrNested(aPath, bPath) || isSameOrNested(bPath, aPath)) {
    throw new Error(`${aName} and ${bName} must be separate, non-nested paths: ${aPath} <> ${bPath}`);
  }
}

function readJson(filePath, description) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read ${description} at ${filePath}: ${error.message}`);
  }
}

function validateVersionComponent(version, description) {
  const deviceName = typeof version === 'string' ? version.split('.')[0].toUpperCase() : '';
  if (typeof version !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._+-]*$/.test(version) || version === '.' || version === '..' || version.endsWith('.') || /^(CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])$/.test(deviceName)) {
    throw new Error(`Invalid ${description} version path segment: ${String(version)}`);
  }
  return version;
}

function requireDirectory(input, description) {
  let stat;
  try {
    stat = fs.statSync(input);
  } catch {
    throw new Error(`${description} does not exist: ${input}`);
  }
  if (!stat.isDirectory()) throw new Error(`${description} is not a directory: ${input}`);
  return canonicalExistingAncestor(input);
}

function requireFile(input, description) {
  let stat;
  try {
    stat = fs.statSync(input);
  } catch {
    throw new Error(`${description} does not exist: ${input}`);
  }
  if (!stat.isFile()) throw new Error(`${description} is not a file: ${input}`);
  return canonicalExistingAncestor(input);
}

function rejectUnsafeLinksInPath(pluginRoot, entryPath) {
  const relativeEntry = path.relative(pluginRoot, entryPath);
  if (!isSameOrNested(pluginRoot, entryPath)) {
    throw new Error(`Checkout worker service escapes plugin source: ${entryPath}`);
  }

  let current = pluginRoot;
  let pending = relativeEntry.split(path.sep).filter(Boolean);
  const visitedLinks = new Set();
  let linkCount = 0;
  while (pending.length) {
    const component = pending.shift();
    const next = path.join(current, component);
    let stat;
    try {
      stat = fs.lstatSync(next);
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return;
      throw error;
    }
    if (!stat.isSymbolicLink()) {
      current = next;
      continue;
    }

    const linkKey = key(next);
    if (visitedLinks.has(linkKey)) throw new Error(`Checkout worker service has a symbolic-link cycle: ${next}`);
    visitedLinks.add(linkKey);
    if (++linkCount > 40) throw new Error(`Checkout worker service exceeds 40 symbolic links: ${entryPath}`);

    const target = fs.readlinkSync(next);
    if (path.isAbsolute(target)) {
      const description = key(next) === key(path.join(pluginRoot, 'scripts'))
        ? 'Checkout worker scripts directory'
        : 'Checkout worker service path';
      throw new Error(`${description} must not be an absolute symbolic link: ${next}`);
    }

    const resolvedTarget = path.resolve(path.dirname(next), target);
    const targetRelative = path.relative(pluginRoot, resolvedTarget);
    if (!isSameOrNested(pluginRoot, resolvedTarget)) {
      throw new Error(`Checkout worker service symlink escapes plugin source: ${next}`);
    }
    current = pluginRoot;
    pending = [...targetRelative.split(path.sep).filter(Boolean), ...pending];
  }
}

function assertOptionalDirectory(input, description) {
  try {
    if (!fs.statSync(input).isDirectory()) throw new Error(`${description} is not a directory: ${input}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function readCheckoutIdentity(rootDir, requireSources) {
  const packagePath = path.join(rootDir, 'package.json');
  const marketplacePath = path.join(rootDir, '.claude-plugin', 'marketplace.json');
  const pluginPath = path.join(rootDir, 'plugin');
  const pluginManifestPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');
  if (requireSources) {
    requireFile(packagePath, 'Checkout package manifest');
    requireDirectory(pluginPath, 'Plugin source');
    requireFile(pluginManifestPath, 'Plugin manifest');
  }
  if (!isSameOrNested(rootDir, canonicalExistingAncestor(packagePath)) || !isSameOrNested(rootDir, canonicalExistingAncestor(marketplacePath))) {
    throw new Error('Checkout metadata redirects outside the checkout root');
  }
  if (!isSameOrNested(canonicalExistingAncestor(pluginPath), canonicalExistingAncestor(pluginManifestPath))) {
    throw new Error('Plugin manifest redirects outside the plugin source');
  }
  const rootPackage = readJson(packagePath, 'checkout package manifest');
  const marketplace = readJson(marketplacePath, 'checkout marketplace manifest');
  const plugin = readJson(pluginManifestPath, 'checkout plugin manifest');
  if (rootPackage.name !== PLUGIN_NAME) throw new Error(`Expected checkout package identity ${PLUGIN_NAME}, found ${rootPackage.name}`);
  if (plugin.name !== PLUGIN_NAME) throw new Error(`Expected plugin identity ${PLUGIN_NAME}, found ${plugin.name}`);
  if (marketplace.name !== MARKETPLACE_NAME) throw new Error(`Expected marketplace identity ${MARKETPLACE_NAME}, found ${marketplace.name}`);
  validateVersionComponent(plugin.version, 'plugin');
  const entry = Array.isArray(marketplace.plugins) ? marketplace.plugins.find(item => item?.name === PLUGIN_NAME) : undefined;
  if (!entry || entry.source !== './plugin' || entry.version !== plugin.version) {
    throw new Error(`Marketplace must contain the ${PLUGIN_NAME} entry at ./plugin with version ${plugin.version}`);
  }
  return { version: plugin.version, marketplacePath, pluginManifestPath };
}

function assertMarketplaceMetadata(root, expectedVersion, optional) {
  const manifestPath = path.join(root, '.claude-plugin', 'marketplace.json');
  if (!fs.existsSync(manifestPath) && optional) return undefined;
  if (!isSameOrNested(root, canonicalExistingAncestor(manifestPath))) throw new Error(`Installed marketplace metadata redirects outside its destination: ${manifestPath}`);
  const marketplace = readJson(manifestPath, 'installed marketplace manifest');
  if (marketplace.name !== MARKETPLACE_NAME) throw new Error(`Installed marketplace identity must be ${MARKETPLACE_NAME}: ${manifestPath}`);
  const entry = Array.isArray(marketplace.plugins) ? marketplace.plugins.find(item => item?.name === PLUGIN_NAME) : undefined;
  if (!entry || entry.source !== './plugin') {
    throw new Error(`Installed marketplace ${manifestPath} must identify ${PLUGIN_NAME}${expectedVersion === undefined ? '' : ` version ${expectedVersion}`} from ./plugin`);
  }
  const version = validateVersionComponent(entry.version, 'installed plugin');
  if (expectedVersion !== undefined && version !== expectedVersion) {
    throw new Error(`Installed marketplace ${manifestPath} must identify ${PLUGIN_NAME} version ${expectedVersion} from ./plugin`);
  }
  return version;
}

function assertPluginMetadata(root, expectedVersion, optional) {
  const manifestPath = path.join(root, '.claude-plugin', 'plugin.json');
  if (!fs.existsSync(manifestPath) && optional) return;
  if (!isSameOrNested(root, canonicalExistingAncestor(manifestPath))) throw new Error(`Installed plugin metadata redirects outside its destination: ${manifestPath}`);
  const plugin = readJson(manifestPath, 'installed plugin manifest');
  if (plugin.name !== PLUGIN_NAME) {
    throw new Error(`Installed plugin ${manifestPath} must identify ${PLUGIN_NAME} version ${expectedVersion}`);
  }
  const version = validateVersionComponent(plugin.version, 'installed plugin');
  if (expectedVersion !== undefined && version !== expectedVersion) {
    throw new Error(`Installed plugin ${manifestPath} must identify ${PLUGIN_NAME} version ${expectedVersion}`);
  }
}

function resolveIntegrationPlan({ rootDir, homeDir, kind, apply = false, force = false, restart = false }) {
  if (kind !== 'sync' && kind !== 'restart') throw new Error(`Unknown installed-state operation: ${kind}`);
  if (kind === 'restart' && (force || restart)) throw new Error('Standalone restart plans cannot include sync-only flags');
  const canonicalRoot = requireDirectory(rootDir, 'Checkout root');
  const canonicalHome = requireDirectory(homeDir, 'Home directory');
  const marketplaceSource = canonicalRoot;
  const marketplaceDestination = path.resolve(canonicalHome, ...MARKETPLACE_RELATIVE);
  const cacheBase = path.resolve(canonicalHome, ...CACHE_RELATIVE);
  let pluginSource;
  let version;
  let cacheDestination;
  let restartCwd = marketplaceDestination;

  if (kind === 'sync') {
    const checkout = readCheckoutIdentity(canonicalRoot, true);
    version = checkout.version;
    pluginSource = requireDirectory(path.join(canonicalRoot, 'plugin'), 'Plugin source');
    if (key(pluginSource) !== key(path.resolve(canonicalRoot, 'plugin'))) throw new Error(`Plugin source redirects from its expected path: ${pluginSource}`);
    cacheDestination = path.join(cacheBase, version);
    assertOptionalDirectory(marketplaceDestination, 'Marketplace destination');
    assertOptionalDirectory(cacheDestination, 'Versioned cache destination');
    const installedVersion = assertMarketplaceMetadata(canonicalExistingAncestor(marketplaceDestination), undefined, true);
    assertPluginMetadata(path.join(canonicalExistingAncestor(marketplaceDestination), 'plugin'), installedVersion, true);
    assertPluginMetadata(canonicalExistingAncestor(cacheDestination), version, true);
    assertDisjoint('marketplace source', marketplaceSource, 'marketplace destination', canonicalExistingAncestor(marketplaceDestination));
    assertDisjoint('plugin source', pluginSource, 'cache destination', canonicalExistingAncestor(cacheDestination));
    assertDisjoint('marketplace destination', canonicalExistingAncestor(marketplaceDestination), 'cache destination', canonicalExistingAncestor(cacheDestination));
    const expectedMarketplace = path.resolve(canonicalHome, ...MARKETPLACE_RELATIVE);
    const expectedCache = path.resolve(canonicalHome, ...CACHE_RELATIVE, version);
    if (key(canonicalExistingAncestor(marketplaceDestination)) !== key(expectedMarketplace)) throw new Error(`Marketplace destination redirects outside its expected path: ${marketplaceDestination}`);
    if (key(canonicalExistingAncestor(cacheDestination)) !== key(expectedCache)) throw new Error(`Cache destination redirects outside its expected version path: ${cacheDestination}`);
    if (restart) {
      const sourceScripts = path.join(pluginSource, 'scripts');
      const sourceWorkerPath = path.join(sourceScripts, 'worker-service.cjs');
      rejectUnsafeLinksInPath(pluginSource, sourceWorkerPath);
      const sourceWorker = requireFile(sourceWorkerPath, 'Checkout worker service');
      if (!isSameOrNested(pluginSource, sourceWorker)) throw new Error(`Checkout worker service escapes plugin source: ${sourceWorker}`);
    }
  } else {
    const canonicalMarketplace = canonicalExistingAncestor(marketplaceDestination);
    if (key(canonicalMarketplace) !== key(marketplaceDestination)) throw new Error(`Marketplace destination redirects outside its expected path: ${marketplaceDestination}`);
    assertMarketplaceMetadata(canonicalMarketplace, undefined, false);
    const marketplace = readJson(path.join(canonicalMarketplace, '.claude-plugin', 'marketplace.json'), 'installed marketplace manifest');
    const entry = Array.isArray(marketplace.plugins) ? marketplace.plugins.find(item => item?.name === PLUGIN_NAME) : undefined;
    if (!entry) throw new Error(`Installed marketplace has no ${PLUGIN_NAME} entry: ${canonicalMarketplace}`);
    version = entry.version;
    validateVersionComponent(version, 'installed plugin');
    pluginSource = path.join(canonicalMarketplace, 'plugin');
    requireDirectory(pluginSource, 'Installed plugin');
    assertPluginMetadata(pluginSource, version, false);
    const worker = requireFile(path.join(canonicalMarketplace, ...WORKER_RELATIVE), 'Installed worker service');
    if (!isSameOrNested(pluginSource, worker)) throw new Error(`Installed worker service escapes the installed plugin tree: ${worker}`);
    restartCwd = canonicalMarketplace;
  }

  const plan = {
    kind,
    apply: Boolean(apply),
    force: Boolean(force),
    restartRequested: kind === 'sync' && Boolean(restart),
    sourceCheckout: canonicalRoot,
    home: canonicalHome,
    marketplaceSource,
    marketplaceDestination,
    pluginSource,
    cacheBase,
    cacheDestination,
    version,
    restartCwd,
    staleRemoval: kind === 'sync',
    dependencyInstalls: kind === 'sync' ? [marketplaceDestination, cacheDestination] : [],
  };
  return freezeDeep(plan);
}

function freezeDeep(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) freezeDeep(child);
  }
  return value;
}

function validateIntegrationPlan(plan) {
  if (!plan || typeof plan !== 'object') throw new Error('Invalid installed-state plan');
  const fresh = resolveIntegrationPlan({
    rootDir: plan.sourceCheckout,
    homeDir: plan.home,
    kind: plan.kind,
    apply: plan.apply,
    force: plan.force,
    restart: plan.restartRequested,
  });
  if (JSON.stringify(fresh) !== JSON.stringify(plan)) throw new Error('Installed-state plan changed after preflight; resolve a new plan before applying');
  return fresh;
}

function formatIntegrationPlan(plan) {
  return [
    `Operation: ${plan.kind}${plan.apply ? ' (apply)' : ' (preview)'}`,
    `Source checkout: ${plan.sourceCheckout}`,
    `Marketplace destination: ${plan.marketplaceDestination}`,
    ...(plan.kind === 'sync' ? [`Versioned cache destination: ${plan.cacheDestination}`, `Plugin version: ${plan.version}`, 'Stale files may be removed: yes', `Dependency installs: ${plan.dependencyInstalls.join(', ')}`] : [`Installed plugin version: ${plan.version}`, 'Versioned cache destination: not applicable', 'Stale files may be removed: no', 'Dependency installs: none']),
    `Worker restart: ${plan.kind === 'restart' || plan.restartRequested ? `yes, cwd ${plan.restartCwd}, command bun plugin/scripts/worker-service.cjs restart` : 'not requested'}`,
  ].join('\n');
}

function runSync(plan, { exec, mirrorMarketplace, mirrorDirectory }) {
  const current = validateIntegrationPlan(plan);
  if (current.kind !== 'sync') throw new Error('Sync executor requires a sync plan');
  if (!current.apply) return;
  mirrorMarketplace(current.marketplaceSource, current.marketplaceDestination);
  validateIntegrationPlan(plan);
  exec('bun install', { cwd: current.dependencyInstalls[0], stdio: 'inherit' });
  validateIntegrationPlan(plan);
  mirrorDirectory(current.pluginSource, current.cacheDestination, { exclude: ['.git', ...getGitignoreExcludes(current.pluginSource)] });
  validateIntegrationPlan(plan);
  exec('bun install', { cwd: current.dependencyInstalls[1], stdio: 'inherit' });
}

function getGitignoreExcludes(basePath) {
  const gitignorePath = path.join(basePath, '.gitignore');
  if (!fs.existsSync(gitignorePath)) return [];
  return fs.readFileSync(gitignorePath, 'utf8').split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#') && !line.startsWith('!'));
}

function runRestart(plan, { exec }) {
  const current = validateIntegrationPlan(plan);
  if (current.kind === 'sync' && !current.restartRequested) throw new Error('Sync plan did not request a worker restart');
  if (!current.apply) return;
  if (current.kind === 'sync') {
    const marketplace = canonicalExistingAncestor(current.restartCwd);
    if (key(marketplace) !== key(current.restartCwd)) throw new Error(`Installed marketplace redirects outside its expected path: ${current.restartCwd}`);
    assertMarketplaceMetadata(marketplace, current.version, false);
    const pluginRoot = path.join(marketplace, 'plugin');
    requireDirectory(pluginRoot, 'Installed plugin');
    assertPluginMetadata(pluginRoot, current.version, false);
    const worker = requireFile(path.join(marketplace, ...WORKER_RELATIVE), 'Installed worker service');
    if (!isSameOrNested(pluginRoot, worker)) throw new Error(`Installed worker service escapes the installed plugin tree: ${worker}`);
  }
  exec('bun plugin/scripts/worker-service.cjs restart', { cwd: current.restartCwd, stdio: 'inherit' });
}

module.exports = {
  resolveIntegrationPlan,
  validateIntegrationPlan,
  formatIntegrationPlan,
  runSync,
  runRestart,
  canonicalExistingAncestor,
  assertDisjoint,
};
