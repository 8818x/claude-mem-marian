import * as p from '@clack/prompts';
import { styleText } from 'node:util';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import {
  claudeSettingsPath,
  installedPluginsPath,
  isPluginInstalled,
  knownMarketplacesPath,
  marketplaceDirectory,
  pluginsDirectory,
  writeJsonFileAtomic,
} from '../utils/paths.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { DATA_DIR, USER_SETTINGS_PATH } from '../../shared/paths.js';
import { updateSettingsDocument } from '../../shared/settings-document.js';
import { shutdownWorkerAndWait, type ShutdownResult } from '../../services/install/shutdown-helper.js';
import { getWorkerHost, getWorkerPort } from '../../shared/worker-utils.js';
import {
  normalizeRuntimeFlag,
  SERVER_RUNTIME_SETTINGS_KEYS,
  type InstallRuntimeId,
} from './server-runtime-setup.js';
import { captureCliEvent } from '../../services/telemetry/cli-telemetry.js';
import {
  currentLauncherHostEnvironment,
  removeInstalledLauncher,
  resolveLauncherBinaryPath,
} from '../../launcher/install-launcher.js';
import {
  executeUninstallPlan,
  prepareTargetAsync,
  summarizeUninstallResults,
  type PlannedResource,
  type PreparedTarget,
  type TargetDefinition,
  type TargetEvidence,
  type UninstallResult,
} from './uninstall-plan.js';
import { prepareIntegrationTargets } from './uninstall-targets.js';

// #2568 — read the runtime the operator installed so uninstall can dispatch to
// the matching teardown. The worker path is the default and is unchanged: only
// when the recorded runtime is the server runtime do we run the extra teardown.
function readSelectedRuntime(): InstallRuntimeId {
  try {
    const settings = SettingsDefaultsManager.loadFromFile(USER_SETTINGS_PATH, true, { readOnly: true });
    return normalizeRuntimeFlag(settings.CLAUDE_MEM_RUNTIME) ?? 'worker';
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.warn('[uninstall] Could not read selected runtime from settings, defaulting to worker:', err);
    return 'worker';
  }
}

export function clearServerRuntimeSettings(
  keys: readonly string[],
  settingsPath: string = USER_SETTINGS_PATH,
): boolean {
  if (!existsSync(settingsPath)) return true;
  const result = updateSettingsDocument(settingsPath, {}, {}, document => {
    for (const key of keys) delete document[key];
  });
  if (result.status === 'refused') {
    console.warn('[uninstall] Could not write settings during server runtime cleanup:', result.error instanceof Error ? result.error.message : String(result.error));
    return false;
  }
  return true;
}

function removeMarketplaceDirectory(): boolean {
  const marketplaceDir = marketplaceDirectory();
  if (existsSync(marketplaceDir)) {
    rmSync(marketplaceDir, { recursive: true, force: true });
    return true;
  }
  return false;
}

function removeCacheDirectory(): boolean {
  const cacheDirectory = join(pluginsDirectory(), 'cache', 'thedotmack', 'claude-mem');
  if (existsSync(cacheDirectory)) {
    rmSync(cacheDirectory, { recursive: true, force: true });
    return true;
  }
  return false;
}

function readStrictJsonObject(filePath: string): Record<string, any> | null {
  if (!existsSync(filePath)) return null;
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, ''));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(`Expected a JSON object in ${filePath}`);
  return parsed as Record<string, any>;
}

function removeFromKnownMarketplaces(): void {
  const knownMarketplaces = readStrictJsonObject(knownMarketplacesPath()) ?? {};
  if (knownMarketplaces['thedotmack']) {
    delete knownMarketplaces['thedotmack'];
    writeJsonFileAtomic(knownMarketplacesPath(), knownMarketplaces);
  }
}

function removeFromInstalledPlugins(): void {
  const installedPlugins = readStrictJsonObject(installedPluginsPath()) ?? {};
  if (installedPlugins.plugins?.['claude-mem@thedotmack']) {
    delete installedPlugins.plugins['claude-mem@thedotmack'];
    writeJsonFileAtomic(installedPluginsPath(), installedPlugins);
  }
}

function stripLegacyClaudeMemAlias(): void {
  const home = homedir();
  const candidateFiles = [
    join(home, '.bashrc'),
    join(home, '.zshrc'),
    join(home, 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1'),
  ];

  const aliasLineRegex = /^\s*alias\s+claude-mem\s*=/;

  for (const filePath of candidateFiles) {
    if (!existsSync(filePath)) continue;
    let content: string;
    try {
      content = readFileSync(filePath, 'utf-8');
    } catch (error: unknown) {
      console.warn(`[uninstall] Could not read ${filePath}:`, error instanceof Error ? error.message : String(error));
      continue;
    }
    const lines = content.split('\n');
    const filtered = lines.filter((line) => !aliasLineRegex.test(line));
    if (filtered.length === lines.length) continue;
    try {
      writeFileSync(filePath, filtered.join('\n'));
      console.error(`Removed legacy claude-mem alias from ${filePath}`);
    } catch (error: unknown) {
      console.warn(`[uninstall] Could not rewrite ${filePath}:`, error instanceof Error ? error.message : String(error));
    }
  }
}

export function removeFromClaudeSettings(): void {
  const settings = readStrictJsonObject(claudeSettingsPath()) ?? {};
  let dirty = false;

  if (settings.enabledPlugins?.['claude-mem@thedotmack'] !== undefined) {
    delete settings.enabledPlugins['claude-mem@thedotmack'];
    dirty = true;
  }

  // Symmetric counterpart to disableClaudeAutoMemory() in install.ts. The
  // installer sets env.CLAUDE_CODE_DISABLE_AUTO_MEMORY = "1" to suppress
  // Claude Code's built-in auto-memory; on uninstall we restore the host
  // CLI's default behavior by removing that key. The value-equality guard
  // (=== '1') ensures we only strip the specific token the installer wrote
  // — if a user had pre-set this key to something else (e.g. '0' to force
  // auto-memory on), or to '1' themselves before installing claude-mem,
  // their intent is preserved. The installer's own no-op-when-already-'1'
  // path means the worst case is leaving behind a value claude-mem would
  // have written anyway. Any other env entries the user added themselves
  // (ANTHROPIC_AUTH_TOKEN, AWS_REGION, etc.) are preserved. If the env
  // block becomes empty as a result, the block itself is dropped to keep
  // settings.json tidy.
  if (settings.env && typeof settings.env === 'object' && !Array.isArray(settings.env)) {
    if (
      Object.prototype.hasOwnProperty.call(settings.env, 'CLAUDE_CODE_DISABLE_AUTO_MEMORY') &&
      settings.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY === '1'
    ) {
      delete settings.env.CLAUDE_CODE_DISABLE_AUTO_MEMORY;
      dirty = true;
      if (Object.keys(settings.env).length === 0) {
        delete settings.env;
      }
    }
  }

  if (dirty) {
    writeJsonFileAtomic(claudeSettingsPath(), settings);
  }
}

/** Exported for tests; `home` is injectable so tests never touch the real home directory. */
export function removeStrayClaudeMemPaths(home: string = homedir()): number {
  let removedCount = 0;

  const npxRoot = join(home, '.npm', '_npx');
  if (existsSync(npxRoot)) {
    let hashDirs: string[] = [];
    try {
      hashDirs = readdirSync(npxRoot);
    } catch (error: unknown) {
      console.warn(`[uninstall] Could not read ${npxRoot}:`, error instanceof Error ? error.message : String(error));
    }
    for (const hashDir of hashDirs) {
      const candidate = join(npxRoot, hashDir, 'node_modules', 'claude-mem');
      if (!existsSync(candidate)) continue;
      try {
        rmSync(candidate, { recursive: true, force: true });
        removedCount++;
      } catch (error: unknown) {
        console.warn(`[uninstall] Could not remove ${candidate}:`, error instanceof Error ? error.message : String(error));
      }
    }
  }

  const cacheRoot = join(home, '.cache', 'claude-cli-nodejs');
  if (existsSync(cacheRoot)) {
    let projectDirs: string[] = [];
    try {
      projectDirs = readdirSync(cacheRoot);
    } catch (error: unknown) {
      console.warn(`[uninstall] Could not read ${cacheRoot}:`, error instanceof Error ? error.message : String(error));
    }
    for (const projectDir of projectDirs) {
      const projectPath = join(cacheRoot, projectDir);
      let logEntries: string[] = [];
      try {
        logEntries = readdirSync(projectPath);
      } catch (error: unknown) {
        console.warn(`[uninstall] Could not read ${projectPath}:`, error instanceof Error ? error.message : String(error));
        continue;
      }
      for (const entry of logEntries) {
        if (!entry.startsWith('mcp-logs-plugin-claude-mem-')) continue;
        const logPath = join(projectPath, entry);
        try {
          rmSync(logPath, { recursive: true, force: true });
          removedCount++;
        } catch (error: unknown) {
          console.warn(`[uninstall] Could not remove ${logPath}:`, error instanceof Error ? error.message : String(error));
        }
      }
    }
  }

  const pluginDataDir = join(pluginsDirectory(), 'data', 'claude-mem-thedotmack');
  if (existsSync(pluginDataDir)) {
    try {
      rmSync(pluginDataDir, { recursive: true, force: true });
      removedCount++;
    } catch (error: unknown) {
      console.warn(`[uninstall] Could not remove ${pluginDataDir}:`, error instanceof Error ? error.message : String(error));
    }
  }

  return removedCount;
}

function coreResource(
  targetPath: string,
  action: PlannedResource['action'],
  selection: string,
  options: Pick<PlannedResource, 'recursive' | 'sharedConfiguration' | 'note'> = {},
): PlannedResource {
  return { path: targetPath, action, selection, ...options };
}

function inspectCoreJson(targetPath: string, label: string): { value: Record<string, any> | null; error?: string } {
  try {
    return { value: readStrictJsonObject(targetPath) };
  } catch (error) {
    return { value: null, error: `${label}: ${error instanceof Error ? error.message : String(error)}` };
  }
}

function listStrayClaudeMemPaths(home: string): string[] {
  const matches: string[] = [];
  const npxRoot = join(home, '.npm', '_npx');
  if (existsSync(npxRoot)) {
    for (const hashDir of readdirSync(npxRoot)) {
      const candidate = join(npxRoot, hashDir, 'node_modules', 'claude-mem');
      if (existsSync(candidate)) matches.push(candidate);
    }
  }
  const cacheRoot = join(home, '.cache', 'claude-cli-nodejs');
  if (existsSync(cacheRoot)) {
    for (const projectDir of readdirSync(cacheRoot)) {
      const projectPath = join(cacheRoot, projectDir);
      for (const entry of readdirSync(projectPath)) {
        if (entry.startsWith('mcp-logs-plugin-claude-mem-')) matches.push(join(projectPath, entry));
      }
    }
  }
  const pluginDataDir = join(pluginsDirectory(), 'data', 'claude-mem-thedotmack');
  if (existsSync(pluginDataDir)) matches.push(pluginDataDir);
  return matches;
}

async function resolveCoreTargets(selectedRuntime: InstallRuntimeId): Promise<PreparedTarget[]> {
  const definitions: TargetDefinition[] = [];
  let workerHost = '';
  let workerPort = 0;

  definitions.push({
    id: 'worker',
    label: 'Worker process',
    inspect: () => {
      workerHost = getWorkerHost({ readOnly: true });
      workerPort = getWorkerPort({ readOnly: true });
      if (!workerHost.trim() || !Number.isInteger(workerPort) || workerPort < 1 || workerPort > 65535) {
        return { state: 'unknown', evidence: [], resources: [], reason: 'The configured worker endpoint is invalid; no process stop was attempted.' };
      }
      return {
        state: 'present',
        evidence: [`endpoint=${workerHost}:${workerPort}`],
        resources: [coreResource(`http://${workerHost}:${workerPort}`, 'stop process', 'claude-mem worker only')],
      };
    },
    apply: async () => {
      const result = await shutdownWorkerAndWait(workerPort, 10000);
      const notice = uninstallShutdownNotice(result);
      if (notice?.level === 'warn') p.log.warn(notice.message);
      else if (notice) p.log.info(notice.message);
      return result.stopped || result.blocker.kind === 'port-held-by-other-process' ? 0 : 1;
    },
  });

  definitions.push({
    id: 'server-runtime-settings',
    label: 'Server runtime settings',
    inspect: () => {
      const settings = inspectCoreJson(USER_SETTINGS_PATH, 'Could not inspect user settings');
      if (settings.error) return { state: 'unknown', evidence: [], resources: [coreResource(USER_SETTINGS_PATH, 'edit configuration', 'server runtime keys only', { sharedConfiguration: true })], reason: settings.error };
      if (selectedRuntime !== 'server') return { state: 'absent', evidence: ['Selected runtime is not server.'], resources: [], reason: 'No server runtime settings cleanup is required.' };
      if (!settings.value) return { state: 'absent', evidence: ['User settings file is absent.'], resources: [], reason: 'No saved server runtime settings were found.' };
      const env = settings.value.env && typeof settings.value.env === 'object' && !Array.isArray(settings.value.env) ? settings.value.env : settings.value;
      const keys = SERVER_RUNTIME_SETTINGS_KEYS.filter(key => Object.hasOwn(env, key));
      return keys.length
        ? { state: 'present', evidence: [`${USER_SETTINGS_PATH}: ${keys.join(', ')}`], resources: [coreResource(USER_SETTINGS_PATH, 'edit configuration', `delete only ${keys.join(', ')}`, { sharedConfiguration: true })] }
        : { state: 'absent', evidence: ['No server runtime keys are present.'], resources: [], reason: 'No saved server runtime settings were found.' };
    },
    apply: () => clearServerRuntimeSettings(SERVER_RUNTIME_SETTINGS_KEYS) ? 0 : 1,
  });

  definitions.push({
    id: 'marketplace',
    label: 'Claude plugin marketplace directory',
    inspect: () => {
      const targetPath = marketplaceDirectory();
      return existsSync(targetPath)
        ? { state: 'present', evidence: [`${targetPath} exists`], resources: [coreResource(targetPath, 'remove tree', 'entire thedotmack marketplace directory', { recursive: true, note: 'Existing core behavior removes the entire marketplace tree, including user-added files. Removal is held if DSH is unknown or fails.' })] }
        : { state: 'absent', evidence: [`${targetPath} is absent`], resources: [], reason: 'Marketplace directory is absent.' };
    },
    apply: () => {
      removeMarketplaceDirectory();
      if (existsSync(marketplaceDirectory())) return 1;
      return 0;
    },
  });

  definitions.push({
    id: 'plugin-cache',
    label: 'Claude plugin cache directory',
    inspect: () => {
      const targetPath = join(pluginsDirectory(), 'cache', 'thedotmack', 'claude-mem');
      return existsSync(targetPath)
        ? { state: 'present', evidence: [`${targetPath} exists`], resources: [coreResource(targetPath, 'remove tree', 'entire claude-mem version cache', { recursive: true })] }
        : { state: 'absent', evidence: [`${targetPath} is absent`], resources: [], reason: 'Plugin cache directory is absent.' };
    },
    apply: () => {
      removeCacheDirectory();
      return existsSync(join(pluginsDirectory(), 'cache', 'thedotmack', 'claude-mem')) ? 1 : 0;
    },
  });

  definitions.push({
    id: 'marketplace-registration',
    label: 'Claude marketplace registration',
    inspect: () => {
      const targetPath = knownMarketplacesPath();
      const parsed = inspectCoreJson(targetPath, 'Could not inspect known_marketplaces.json');
      if (parsed.error) return { state: 'unknown', evidence: [], resources: [coreResource(targetPath, 'edit configuration', 'thedotmack key only', { sharedConfiguration: true })], reason: parsed.error };
      return parsed.value?.thedotmack !== undefined
        ? { state: 'present', evidence: [`${targetPath} contains thedotmack`], resources: [coreResource(targetPath, 'edit configuration', 'remove only thedotmack entry', { sharedConfiguration: true })] }
        : { state: 'absent', evidence: [`${targetPath} has no thedotmack entry`], resources: [], reason: 'Marketplace registration is absent.' };
    },
    apply: () => { removeFromKnownMarketplaces(); return 0; },
  });

  definitions.push({
    id: 'installed-plugin-registration',
    label: 'Claude installed plugin registration',
    inspect: () => {
      const targetPath = installedPluginsPath();
      const parsed = inspectCoreJson(targetPath, 'Could not inspect installed_plugins.json');
      if (parsed.error) return { state: 'unknown', evidence: [], resources: [coreResource(targetPath, 'edit configuration', 'plugins.claude-mem@thedotmack only', { sharedConfiguration: true })], reason: parsed.error };
      if (!parsed.value) return { state: 'absent', evidence: [`${targetPath} is absent`], resources: [], reason: 'Installed plugin registration is absent.' };
      if (parsed.value.plugins !== undefined && (!parsed.value.plugins || typeof parsed.value.plugins !== 'object' || Array.isArray(parsed.value.plugins))) return { state: 'unknown', evidence: [], resources: [coreResource(targetPath, 'edit configuration', 'plugins.claude-mem@thedotmack only', { sharedConfiguration: true })], reason: `${targetPath}.plugins has an invalid shape.` };
      return parsed.value.plugins?.['claude-mem@thedotmack'] !== undefined
        ? { state: 'present', evidence: [`${targetPath} contains plugins.claude-mem@thedotmack`], resources: [coreResource(targetPath, 'edit configuration', 'remove only plugins.claude-mem@thedotmack', { sharedConfiguration: true })] }
        : { state: 'absent', evidence: [`${targetPath} has no claude-mem entry`], resources: [], reason: 'Installed plugin registration is absent.' };
    },
    apply: () => { removeFromInstalledPlugins(); return 0; },
  });

  definitions.push({
    id: 'claude-settings',
    label: 'Claude Code settings',
    inspect: () => {
      const targetPath = claudeSettingsPath();
      const parsed = inspectCoreJson(targetPath, 'Could not inspect Claude settings');
      if (parsed.error) return { state: 'unknown', evidence: [], resources: [coreResource(targetPath, 'edit configuration', 'enabledPlugins.claude-mem@thedotmack and env.CLAUDE_CODE_DISABLE_AUTO_MEMORY', { sharedConfiguration: true })], reason: parsed.error };
      if (!parsed.value) return { state: 'absent', evidence: [`${targetPath} is absent`], resources: [], reason: 'Claude settings are absent.' };
      if (parsed.value.enabledPlugins !== undefined && (!parsed.value.enabledPlugins || typeof parsed.value.enabledPlugins !== 'object' || Array.isArray(parsed.value.enabledPlugins))) return { state: 'unknown', evidence: [], resources: [coreResource(targetPath, 'edit configuration', 'Claude-Mem settings keys only', { sharedConfiguration: true })], reason: `${targetPath}.enabledPlugins has an invalid shape.` };
      const keys = [
        ...(parsed.value.enabledPlugins?.['claude-mem@thedotmack'] !== undefined ? ['enabledPlugins.claude-mem@thedotmack'] : []),
        ...(parsed.value.env?.CLAUDE_CODE_DISABLE_AUTO_MEMORY === '1' ? ['env.CLAUDE_CODE_DISABLE_AUTO_MEMORY=1'] : []),
      ];
      return keys.length
        ? { state: 'present', evidence: [`${targetPath}: ${keys.join(', ')}`], resources: [coreResource(targetPath, 'edit configuration', `remove only ${keys.join(', ')}`, { sharedConfiguration: true })] }
        : { state: 'absent', evidence: [`${targetPath} has no targeted Claude-Mem settings`], resources: [], reason: 'No targeted Claude settings are present.' };
    },
    apply: () => { removeFromClaudeSettings(); return 0; },
  });

  definitions.push({
    id: 'legacy-shell-alias',
    label: 'Legacy claude-mem shell aliases',
    inspect: () => {
      const files = [join(homedir(), '.bashrc'), join(homedir(), '.zshrc'), join(homedir(), 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1')];
      const matches: string[] = [];
      try {
        for (const file of files) {
          if (!existsSync(file)) continue;
          const content = readFileSync(file, 'utf-8');
          if (content.split('\n').some(line => /^\s*alias\s+claude-mem\s*=/.test(line))) matches.push(file);
        }
      } catch (error) {
        return { state: 'unknown', evidence: [], resources: files.map(file => coreResource(file, 'preserve', 'unmarked alias; read failed', { sharedConfiguration: true })), reason: `Could not inspect shell aliases: ${error instanceof Error ? error.message : String(error)}` };
      }
      return matches.length
        ? { state: 'unknown', evidence: matches.map(file => `${file}: unmarked alias line`), resources: matches.map(file => coreResource(file, 'preserve', 'unmarked alias claude-mem; authorship cannot be proven', { sharedConfiguration: true })) , reason: 'Unmarked shell aliases may be user-authored; they were preserved.' }
        : { state: 'absent', evidence: ['No legacy alias lines found.'], resources: [], reason: 'No matching alias lines were found.' };
    },
    apply: () => { stripLegacyClaudeMemAlias(); return 0; },
  });

  definitions.push({
    id: 'hook-launcher',
    label: 'Claude-Mem hook launcher',
    inspect: () => {
      try {
        const targetPath = resolveLauncherBinaryPath(currentLauncherHostEnvironment());
        return existsSync(targetPath)
          ? { state: 'present', evidence: [`${targetPath} exists`], resources: [coreResource(targetPath, 'remove file', 'installed Claude-Mem hook launcher')] }
          : { state: 'absent', evidence: [`${targetPath} is absent`], resources: [], reason: 'Hook launcher is absent.' };
      } catch (error) {
        return { state: 'unknown', evidence: [], resources: [], reason: `Could not resolve launcher: ${error instanceof Error ? error.message : String(error)}` };
      }
    },
    apply: () => {
      const result = removeInstalledLauncher();
      if (result.pathCleanupHint) p.log.info(result.pathCleanupHint);
      return result.removedBinaryPath ? 0 : 1;
    },
  });

  definitions.push({
    id: 'stray-caches-and-logs',
    label: 'Stray Claude-Mem caches and logs',
    inspect: () => {
      try {
        const paths = listStrayClaudeMemPaths(homedir());
        return paths.length
          ? { state: 'present', evidence: paths, resources: paths.map(targetPath => coreResource(targetPath, 'remove tree', 'exact claude-mem package/cache/log path', { recursive: true })) }
          : { state: 'absent', evidence: ['No matching npx, CLI log, or plugin-data paths found.'], resources: [], reason: 'No stray Claude-Mem paths were found.' };
      } catch (error) {
        return { state: 'unknown', evidence: [], resources: [], reason: `Could not enumerate stray paths: ${error instanceof Error ? error.message : String(error)}` };
      }
    },
    apply: () => {
      removeStrayClaudeMemPaths();
      return listStrayClaudeMemPaths(homedir()).length === 0 ? 0 : 1;
    },
  });

  return Promise.all(definitions.map(prepareTargetAsync));
}

/**
 * What uninstall says about the worker stop. Uninstall never blocks on it —
 * cleanup always continues — but a worker that is still running is named by
 * PID so the user can end it. Exported for tests.
 */
export function uninstallShutdownNotice(result: ShutdownResult): { level: 'info' | 'warn'; message: string } | null {
  if (result.stopped) return result.workerWasRunning ? { level: 'info', message: 'Worker service stopped.' } : null;
  switch (result.blocker.kind) {
    case 'port-held-by-other-process':
      return { level: 'info', message: 'The worker port is held by another process, not a claude-mem worker; nothing to stop.' };
    case 'port-rebound': {
      const owner = result.blocker.ownerPid === null ? 'another process' : `another claude-mem worker (PID ${result.blocker.ownerPid})`;
      return { level: 'warn', message: `Worker service stopped, but ${owner} took its port again; continuing uninstall cleanup.` };
    }
    case 'worker-still-running':
      return { level: 'warn', message: `Worker service (PID ${result.blocker.pid}) did not confirm shutdown; continuing uninstall cleanup.` };
  }
}

interface UninstallPlan {
  targets: PreparedTarget[];
  notes: string[];
}

async function resolveUninstallPlan(): Promise<UninstallPlan> {
  const selectedRuntime = readSelectedRuntime();
  const core = await resolveCoreTargets(selectedRuntime);
  const integrations = await prepareIntegrationTargets();
  const find = (targets: PreparedTarget[], id: string): PreparedTarget => {
    const result = targets.find(target => target.id === id);
    if (!result) throw new Error(`Missing uninstall target: ${id}`);
    return result;
  };
  const worker = find(core, 'worker');
  const server = find(core, 'server-runtime-settings');
  const dsh = find(integrations, 'dsh');
  const marketplace = find(core, 'marketplace');
  const remainingCore = core.filter(target => !['worker', 'server-runtime-settings', 'marketplace'].includes(target.id));
  const remainingIntegrations = integrations.filter(target => target.id !== 'dsh');
  return {
    targets: [worker, server, dsh, marketplace, ...remainingCore, ...remainingIntegrations],
    notes: [
      `Data directory ${DATA_DIR} is preserved; the completion event may append telemetry there.`,
      'Recursive marketplace removal includes user-added files in the configured thedotmack directory.',
      'Unmarked shell aliases are shown as ambiguous and preserved.',
      'Codex CLI cleanup remains active because it is a maintained host.',
      'Cursor remains on its separate worker-service uninstall route.',
    ],
  };
}

function formatUninstallPlan(plan: UninstallPlan): string {
  const lines = ['Uninstall plan (inspection is read-only):'];
  for (const target of plan.targets) {
    lines.push(`\n${target.state.toUpperCase()} — ${target.label} [${target.id}]`);
    if (target.reason) lines.push(`  Reason: ${target.reason}`);
    for (const evidence of target.evidence) lines.push(`  Evidence: ${evidence}`);
    for (const item of target.resources) {
      const flags = [item.recursive ? 'recursive' : '', item.sharedConfiguration ? 'shared config' : ''].filter(Boolean).join(', ');
      lines.push(`  ${item.action}: ${item.path} — ${item.selection}${flags ? ` (${flags})` : ''}${item.note ? `; ${item.note}` : ''}`);
    }
  }
  lines.push('\nPreservation and risk notes:');
  for (const note of plan.notes) lines.push(`  - ${note}`);
  return lines.join('\n');
}

function logUninstallResult(result: UninstallResult): void {
  const message = `${result.label}: ${result.detail}`;
  if (result.state === 'removed' || result.state === 'already-absent') p.log.info(message);
  else if (result.state === 'failed') p.log.error(message);
  else p.log.warn(message);
}

export async function runUninstallCommand(options: { dryRun?: boolean } = {}): Promise<void> {
  p.intro(styleText(['bgRed', 'white'], ' claude-mem uninstall '));

  const pluginInstalled = isPluginInstalled();
  if (!pluginInstalled && !process.stdin.isTTY && !options.dryRun) {
    p.log.warn('claude-mem does not appear to be installed.');
    p.outro('Nothing to do.');
    return;
  }

  const plan = await resolveUninstallPlan();
  console.log(formatUninstallPlan(plan));
  if (options.dryRun) {
    p.outro('Dry run complete. No cleanup, worker shutdown, or telemetry was run.');
    return;
  }

  if (process.stdin.isTTY) {
    const shouldContinue = await p.confirm({
      message: pluginInstalled ? 'Apply the uninstall plan shown above?' : 'Clean up the residual resources shown above?',
      initialValue: false,
    });

    if (p.isCancel(shouldContinue) || !shouldContinue) {
      p.cancel('Uninstall cancelled.');
      return;
    }
  }

  const dsh = plan.targets.find(target => target.id === 'dsh');
  const results = await executeUninstallPlan(plan.targets, logUninstallResult);
  if (dsh && dsh.state !== 'absent' && results.find(result => result.id === 'dsh')?.state !== 'removed') {
    p.log.error('DeepSeek Harness did not complete; its ownership receipt and the marketplace directory are preserved. Independent targets continued.');
  }

  p.note(
    [
      `Your data directory at ${styleText('cyan', '~/.claude-mem')} was preserved.`,
      'To remove it manually: rm -rf ~/.claude-mem',
    ].join('\n'),
    'Note',
  );

  try {
    await captureCliEvent('uninstall_completed', {}, { person: true });
  } catch (error) {
    const result: UninstallResult = { id: 'telemetry', label: 'Uninstall completion event', state: 'failed', detail: error instanceof Error ? error.message : String(error) };
    results.push(result);
    logUninstallResult(result);
  }

  const summary = summarizeUninstallResults(results);
  if (summary.exitCode !== 0) process.exitCode = summary.exitCode;
  p.outro(summary.state === 'complete'
    ? styleText('green', 'claude-mem uninstall completed.')
    : styleText('yellow', `claude-mem uninstall ${summary.state}; review the target results above and retry failed cleanup.`));
}
