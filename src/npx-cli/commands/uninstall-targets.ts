import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import type { DshUninstallOptions } from '../../services/integrations/DeepSeekHarnessInstaller.js';
import {
  prepareTargetAsync,
  type PlannedResource,
  type PreparedTarget,
  type TargetDefinition,
  type TargetEvidence,
} from './uninstall-plan.js';

export interface UninstallTargetRoots {
  home?: string;
  claudeConfig?: string;
  dataDir?: string;
  localAppData?: string;
  cwd?: string;
  environment?: NodeJS.ProcessEnv;
}

export interface UninstallTargetAdapters {
  dshCommandRunner?: NonNullable<DshUninstallOptions['runHostCommand']>;
}

function rootsOf(input: UninstallTargetRoots = {}): Required<Pick<UninstallTargetRoots, 'home' | 'claudeConfig' | 'dataDir' | 'localAppData' | 'cwd'>> & { environment: NodeJS.ProcessEnv } {
  const home = input.home ?? homedir();
  const environment = input.environment ?? process.env;
  return {
    home,
    claudeConfig: input.claudeConfig ?? environment.CLAUDE_CONFIG_DIR ?? path.join(home, '.claude'),
    dataDir: input.dataDir ?? environment.CLAUDE_MEM_DATA_DIR ?? path.join(home, '.claude-mem'),
    localAppData: input.localAppData ?? environment.LOCALAPPDATA ?? path.join(home, 'AppData', 'Local'),
    cwd: input.cwd ?? process.cwd(),
    environment,
  };
}

function transcriptWatchPath(root: ReturnType<typeof rootsOf>): { path: string; error?: string } {
  const defaultPath = path.join(root.dataDir, 'transcript-watch.json');
  const settingsPath = path.join(root.dataDir, 'settings.json');
  const envValue = root.environment.CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH;
  if (typeof envValue === 'string' && envValue.trim()) return { path: path.resolve(envValue.replace(/^~(?=$|[\\/])/, root.home)) };
  const settings = readJson(settingsPath);
  if (settings.state === 'invalid') return { path: defaultPath, error: settings.reason };
  if (settings.state === 'missing') return { path: defaultPath };
  const nested = settings.value.env;
  const configured = nested && typeof nested === 'object' && !Array.isArray(nested)
    ? nested.CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH
    : settings.value.CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH;
  if (configured === undefined) return { path: defaultPath };
  if (typeof configured !== 'string' || !configured.trim()) return { path: defaultPath, error: 'CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH is not a non-empty string.' };
  return { path: path.resolve(configured.replace(/^~(?=$|[\\/])/, root.home)) };
}

function resource(
  file: string,
  action: PlannedResource['action'],
  selection: string,
  options: Pick<PlannedResource, 'recursive' | 'sharedConfiguration' | 'note'> = {},
): PlannedResource {
  return { path: file, action, selection, ...options };
}

function digest(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function readJson(file: string): { state: 'missing' } | { state: 'valid'; value: Record<string, any>; fingerprint: string } | { state: 'invalid'; reason: string } {
  if (!existsSync(file)) return { state: 'missing' };
  try {
    const content = readFileSync(file);
    const value = JSON.parse(content.toString('utf8').replace(/^\uFEFF/, ''));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('expected a JSON object');
    return { state: 'valid', value, fingerprint: digest(content) };
  } catch (error) {
    return { state: 'invalid', reason: `${file}: ${error instanceof Error ? error.message : String(error)}` };
  }
}

function readText(file: string): { state: 'missing' } | { state: 'valid'; content: string; fingerprint: string } | { state: 'invalid'; reason: string } {
  if (!existsSync(file)) return { state: 'missing' };
  try {
    const content = readFileSync(file);
    return { state: 'valid', content: content.toString('utf8'), fingerprint: digest(content) };
  } catch (error) {
    return { state: 'invalid', reason: `${file}: ${error instanceof Error ? error.message : String(error)}` };
  }
}

function treeFingerprint(directory: string): string {
  const entries: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name);
      const stat = lstatSync(child);
      entries.push(`${path.relative(directory, child)}|${entry.isDirectory() ? 'd' : entry.isSymbolicLink() ? 'l' : 'f'}|${stat.size}|${stat.mtimeMs}`);
      if (entry.isDirectory()) visit(child);
    }
  };
  visit(directory);
  return digest(entries.sort().join('\n'));
}

function present(evidence: string[], resources: PlannedResource[]): TargetEvidence {
  return { state: 'present', evidence, resources };
}

function absent(reason: string): TargetEvidence {
  return { state: 'absent', evidence: [reason], resources: [], reason };
}

function unknown(reason: string, resources: PlannedResource[] = []): TargetEvidence {
  return { state: 'unknown', evidence: [], resources, reason };
}

function target(
  id: string,
  label: string,
  inspect: TargetDefinition['inspect'],
  apply: TargetDefinition['apply'],
): TargetDefinition {
  return { id, label, inspect, apply };
}

function managedTaggedBlock(file: string, tag = '<claude-mem-context>'): { state: 'present' | 'absent' | 'unknown'; fingerprint?: string; reason?: string } {
  const read = readText(file);
  if (read.state === 'missing') return { state: 'absent' };
  if (read.state === 'invalid') return { state: 'unknown', reason: read.reason };
  return read.content.includes(tag)
    ? { state: 'present', fingerprint: read.fingerprint }
    : { state: 'absent', fingerprint: read.fingerprint };
}

function inspectT3(root: ReturnType<typeof rootsOf>): TargetEvidence {
  const env = root.environment;
  const settingsPath = env.CLAUDE_MEM_T3CODE_SETTINGS_PATH
    ? path.resolve(env.CLAUDE_MEM_T3CODE_SETTINGS_PATH.replace(/^~(?=$|[\\/])/, root.home))
    : path.join((env.T3CODE_HOME || path.join(root.home, '.t3')).replace(/^~(?=$|[\\/])/, root.home), 'userdata', 'settings.json');
  const settings = readJson(settingsPath);
  if (settings.state === 'missing') return absent('T3 Code settings file is absent.');
  if (settings.state === 'invalid') return unknown(settings.reason, [resource(settingsPath, 'edit configuration', 'providerInstances/providers', { sharedConfiguration: true })]);

  const instances = settings.value.providerInstances;
  const legacy = settings.value.providers;
  if ((instances !== undefined && (!instances || typeof instances !== 'object' || Array.isArray(instances)))
    || (legacy !== undefined && (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)))) {
    return unknown('T3 Code provider settings have an invalid shape.', [resource(settingsPath, 'edit configuration', 'providerInstances/providers', { sharedConfiguration: true })]);
  }

  const entries: Array<{ id: string; driver: string; config: Record<string, any>; enabled: boolean; environment?: unknown }> = [];
  for (const [id, value] of Object.entries((instances ?? {}) as Record<string, any>)) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || !value.config || typeof value.config !== 'object' || Array.isArray(value.config)) {
      return unknown(`T3 Code provider instance ${id} is malformed.`, [resource(settingsPath, 'edit configuration', `providerInstances.${id}`, { sharedConfiguration: true })]);
    }
    entries.push({ id, driver: value.driver, config: value.config, enabled: value.enabled !== false && value.config.enabled !== false, environment: value.environment });
  }
  for (const driver of ['codex', 'claudeAgent']) {
    if (Object.hasOwn(instances ?? {}, driver) || !Object.hasOwn(legacy ?? {}, driver)) continue;
    const value = (legacy as Record<string, any>)[driver];
    if (!value || typeof value !== 'object' || Array.isArray(value)) return unknown(`T3 Code ${driver} settings are malformed.`, [resource(settingsPath, 'edit configuration', `providers.${driver}`, { sharedConfiguration: true })]);
    entries.push({ id: driver, driver, config: value, enabled: value.enabled !== false });
  }

  const selected = entries.filter(entry => entry.driver === 'codex' || entry.driver === 'claudeAgent');
  if (selected.length === 0) return absent('No explicit T3 Code Codex or Claude provider instance is configured.');

  const evidence = [`${settingsPath} sha256=${settings.fingerprint}`];
  const resources: PlannedResource[] = [];
  for (const provider of selected) {
    if (provider.config.homePath !== undefined && typeof provider.config.homePath !== 'string') return unknown(`T3 Code provider ${provider.id} has an invalid homePath.`, [resource(settingsPath, 'edit configuration', `providerInstances/providers.${provider.id}`, { sharedConfiguration: true })]);
    const providerEnvironment = { ...env };
    if (provider.environment !== undefined && !Array.isArray(provider.environment)) return unknown(`T3 Code provider ${provider.id} has an invalid environment list.`, [resource(settingsPath, 'edit configuration', `providerInstances.${provider.id}.environment`, { sharedConfiguration: true })]);
    for (const variable of (provider.environment ?? []) as unknown[]) {
      if (!variable || typeof variable !== 'object' || Array.isArray(variable)
        || typeof (variable as any).name !== 'string' || typeof (variable as any).value !== 'string') {
        return unknown(`T3 Code provider ${provider.id} has a malformed environment entry.`, [resource(settingsPath, 'edit configuration', `providerInstances.${provider.id}.environment`, { sharedConfiguration: true })]);
      }
      if ((variable as any).sensitive !== true && (variable as any).valueRedacted !== true) providerEnvironment[(variable as any).name] = (variable as any).value;
    }
    const managed = provider.driver === 'codex' && provider.config.setupMode === 'managed';
    const homeVariable = provider.driver === 'codex' ? 'CODEX_HOME' : 'CLAUDE_CONFIG_DIR';
    const defaultHome = path.join(root.home, provider.driver === 'codex' ? '.codex' : '.claude');
    const configuredHome = typeof provider.config.homePath === 'string' ? provider.config.homePath.trim() : '';
    const homeValue = configuredHome || (!managed ? providerEnvironment[homeVariable] : '') || defaultHome;
    if (typeof homeValue !== 'string' || !homeValue.trim()) return unknown(`T3 Code provider ${provider.id} has an invalid ${homeVariable}.`, [resource(settingsPath, 'edit configuration', `providerInstances.${provider.id}`, { sharedConfiguration: true })]);
    const resolvedHomeValue = homeValue.replace(/^~(?=$|[\\/])/, root.home);
    const providerHome = path.resolve(resolvedHomeValue);
    const configPath = path.join(providerHome, provider.driver === 'codex' ? 'config.toml' : 'settings.json');
    const config = provider.driver === 'codex' ? readText(configPath) : readJson(configPath);
    if (config.state === 'invalid') return unknown(config.reason, [resource(settingsPath, 'edit configuration', `providerInstances/providers`, { sharedConfiguration: true }), resource(configPath, 'edit configuration', 'claude-mem plugin enabled state', { sharedConfiguration: true })]);
    let pluginEnabled = false;
    if (provider.driver === 'codex') {
      pluginEnabled = config.state === 'valid' && 'content' in config
        && tomlBooleanInTable(config.content, '[plugins."claude-mem@claude-mem-local"]', 'enabled');
    } else {
      pluginEnabled = config.state === 'valid' && 'value' in config
        && config.value.enabledPlugins?.['claude-mem@thedotmack'] === true;
    }
    if (!pluginEnabled) continue;
    const canonicalHomeValue = provider.driver === 'codex'
      ? env.CODEX_HOME || path.join(root.home, '.codex')
      : env.CLAUDE_CONFIG_DIR || path.join(root.home, '.claude');
    const canonicalHome = path.resolve(canonicalHomeValue.replace(/^~(?=$|[\\/])/, root.home));
    if (providerHome === canonicalHome || !provider.enabled) {
      return unknown(`T3 Code provider ${provider.id} points at a shared or disabled ${provider.driver} home; T3 ownership cannot be distinguished from standalone use.`, [resource(configPath, 'edit configuration', 'claude-mem plugin enabled state', { sharedConfiguration: true, note: `Resolved provider home: ${providerHome}` }), resource(settingsPath, 'edit configuration', `providerInstances/providers.${provider.id}`, { sharedConfiguration: true })]);
    }
    evidence.push(`${provider.id} ${provider.driver} home=${providerHome} plugin-enabled`);
    resources.push(resource(configPath, 'edit configuration', 'disable only claude-mem plugin', { sharedConfiguration: true }));
  }
  return resources.length
    ? present(evidence, resources)
    : absent('Explicit T3 Code provider settings contain no enabled Claude-Mem plugin.');
}

function stripTomlComment(line: string): string {
  let quote: '"' | "'" | null = null;
  for (let index = 0; index < line.length; index++) {
    const character = line[index];
    if (quote !== null) {
      if (quote === '"' && character === '\\') index++;
      else if (character === quote) quote = null;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '#') {
      return line.slice(0, index);
    }
  }
  return line;
}

function tomlStructuralLines(lines: string[]): string[] {
  let multiline: '"""' | "'''" | null = null;
  return lines.map((line) => {
    const structural = multiline === null ? stripTomlComment(line) : '';
    let quote: '"' | "'" | null = null;
    for (let index = 0; index < line.length; index++) {
      if (multiline !== null) {
        if (multiline === '"""' && line[index] === '\\') index++;
        else if (line.startsWith(multiline, index)) {
          const character = multiline[0];
          let count = 3;
          while (count < 5 && line[index + count] === character) count++;
          index += count - 1;
          multiline = null;
        }
      } else if (quote !== null) {
        if (quote === '"' && line[index] === '\\') index++;
        else if (line[index] === quote) quote = null;
      } else if (line[index] === '#') {
        break;
      } else if (line.startsWith('"""', index) || line.startsWith("'''", index)) {
        multiline = line.slice(index, index + 3) as '"""' | "'''";
        index += 2;
      } else if (line[index] === '"' || line[index] === "'") {
        quote = line[index] as '"' | "'";
      }
    }
    return structural;
  });
}

function normalizeTomlHeader(line: string): string | null {
  const match = stripTomlComment(line).trim().match(/^\[([^\]]+)\]\s*$/);
  if (!match) return null;
  return match[1].replace(/\s+/g, '').replace(/"/g, '');
}

function hasTomlTable(content: string, table: string): boolean {
  return tomlStructuralLines(content.split(/\r?\n/)).some(line => normalizeTomlHeader(line) === table);
}

function tomlBooleanInTable(content: string, header: string, key: string): boolean {
  const expected = normalizeTomlHeader(header);
  let inTable = false;
  let value = false;
  for (const line of tomlStructuralLines(content.split(/\r?\n/))) {
    const table = normalizeTomlHeader(line);
    if (table !== null) {
      inTable = table === expected;
    } else if (inTable) {
      const match = line.match(new RegExp(`^\\s*${key}\\s*=\\s*(true|false)\\s*(?:#.*)?$`));
      if (match) value = match[1] === 'true';
    }
  }
  return value;
}

function gooseEntry(content: string): 'present' | 'absent' | 'unknown' {
  const lines = content.split(/\r?\n/);
  const headers = lines.flatMap((line, index) => /^(?:["']?)extensions(?:["']?)\s*:/.test(line) ? [index] : []);
  if (headers.length > 1) return 'unknown';
  const header = headers[0] ?? -1;
  if (header < 0) return /^(?:["']?)extensions(?:["']?)\s*:/m.test(content) ? 'unknown' : 'absent';
  const colon = lines[header].indexOf(':');
  if (lines[header].slice(colon + 1).trim() && !lines[header].slice(colon + 1).trimStart().startsWith('#')) return 'unknown';
  let end = header + 1;
  while (end < lines.length && !(lines[end].trim() && !lines[end].trimStart().startsWith('#') && !/^\s/.test(lines[end]))) end++;
  const firstEntry = lines.slice(header + 1, end).find(line => line.trim() && !line.trimStart().startsWith('#'));
  if (!firstEntry) return 'absent';
  const indentation = firstEntry.match(/^[ \t]*/)?.[0] ?? '';
  if (!indentation || indentation.includes('\t')) return 'unknown';
  const claudeMemEntries = lines.slice(header + 1, end).flatMap(line => {
    const match = line.match(/^([ \t]*)(["']?)claude-mem\2\s*:/);
    return match ? [match[1]] : [];
  });
  if (claudeMemEntries.length > 1) return 'unknown';
  if (claudeMemEntries.length === 0) return 'absent';
  return claudeMemEntries[0] === indentation && !indentation.includes('\t') ? 'present' : 'unknown';
}

function legacyAntigravityHookStatus(value: unknown, strictCollections = false): 'present' | 'absent' | 'unknown' {
  if (value === undefined) return 'absent';
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'unknown';
  let found = false;
  for (const groups of Object.values(value as Record<string, unknown>)) {
    if (!Array.isArray(groups)) {
      if (strictCollections) return 'unknown';
      continue;
    }
    for (const group of groups) {
      if (!group || typeof group !== 'object' || Array.isArray(group)) return 'unknown';
      const hooks = (group as Record<string, unknown>).hooks;
      if (hooks === undefined) return 'unknown';
      if (!Array.isArray(hooks)) return 'unknown';
      for (const hook of hooks) {
        if (!hook || typeof hook !== 'object' || Array.isArray(hook)) return 'unknown';
        if ((hook as Record<string, unknown>).name === 'claude-mem') found = true;
      }
    }
  }
  return found ? 'present' : 'absent';
}

function inspectCodex(root: ReturnType<typeof rootsOf>): { evidence: TargetEvidence; removeMarketplace: boolean } {
  const codexHome = path.join(root.home, '.codex');
  const configPath = path.join(codexHome, 'config.toml');
  const agentsPath = path.join(codexHome, 'AGENTS.md');
  const transcriptPathResult = transcriptWatchPath(root);
  const transcriptPath = transcriptPathResult.path;
  const config = readText(configPath);
  const agents = managedTaggedBlock(agentsPath);
  const transcript = readJson(transcriptPath);
  if (config.state === 'invalid') return { evidence: unknown(config.reason, [resource(configPath, 'edit configuration', 'Codex plugin and marketplace entries', { sharedConfiguration: true })]), removeMarketplace: false };
  if (agents.state === 'unknown') return { evidence: unknown(agents.reason ?? `Could not read ${agentsPath}`, [resource(agentsPath, 'edit configuration', 'claude-mem-context block', { sharedConfiguration: true })]), removeMarketplace: false };
  if (transcriptPathResult.error) return { evidence: unknown(`Could not resolve transcript-watch configuration: ${transcriptPathResult.error}`, [resource(transcriptPath, 'edit configuration', 'legacy Codex transcript context', { sharedConfiguration: true })]), removeMarketplace: false };
  if (transcript.state === 'invalid') return { evidence: unknown(transcript.reason, [resource(transcriptPath, 'edit configuration', 'legacy Codex transcript context', { sharedConfiguration: true })]), removeMarketplace: false };

  const text = config.state === 'valid' ? config.content : '';
  const currentPlugin = hasTomlTable(text, 'plugins.claude-mem@claude-mem-local');
  const legacyPlugin = hasTomlTable(text, 'plugins.claude-mem@thedotmack');
  const marketplace = hasTomlTable(text, 'marketplaces.claude-mem-local');
  const agentsPathResolved = path.resolve(agentsPath);
  let transcriptContext = false;
  if (transcript.state === 'valid') {
    const watches = transcript.value.watches;
    if (watches !== undefined && !Array.isArray(watches)) return { evidence: unknown(`${transcriptPath} has an invalid watches field.`, [resource(transcriptPath, 'edit configuration', 'Codex transcript context', { sharedConfiguration: true })]), removeMarketplace: false };
    transcriptContext = (watches ?? []).some((watch: any) => watch && typeof watch === 'object'
      && (watch.name === 'codex' || watch.schema === 'codex')
      && watch.context?.mode === 'agents'
      && Array.isArray(watch.context.updateOn)
      && watch.context.updateOn.length === 2
      && watch.context.updateOn.includes('session_start')
      && watch.context.updateOn.includes('session_end')
      && (watch.context.path === undefined || (typeof watch.context.path === 'string'
        && path.resolve(watch.context.path.replace(/^~(?=$|[\\/])/, root.home)) === agentsPathResolved)));
  }
  const presentAny = currentPlugin || legacyPlugin || marketplace || agents.state === 'present' || transcriptContext;
  if (!presentAny) return { evidence: absent('No Codex plugin registration, marketplace registration, or legacy context marker was found.'), removeMarketplace: false };

  const evidence: string[] = [];
  const resources: PlannedResource[] = [];
  if (config.state === 'valid' && (currentPlugin || legacyPlugin || marketplace)) {
    evidence.push(`${configPath} sha256=${config.fingerprint}`);
    resources.push(resource(configPath, 'edit configuration', 'claude-mem plugin and marketplace entries', { sharedConfiguration: true }));
  }
  if (agents.state === 'present') {
    evidence.push(`${agentsPath} claude-mem-context marker`);
    resources.push(resource(agentsPath, 'edit configuration', '<claude-mem-context> block', { sharedConfiguration: true }));
  }
  if (transcriptContext && transcript.state === 'valid') {
    evidence.push(`${transcriptPath} sha256=${transcript.fingerprint}`);
    resources.push(resource(transcriptPath, 'edit configuration', 'legacy Codex watch context only', { sharedConfiguration: true }));
  }
  return { evidence: present(evidence, resources), removeMarketplace: marketplace };
}

export async function prepareIntegrationTargets(input: UninstallTargetRoots = {}, adapters: UninstallTargetAdapters = {}): Promise<PreparedTarget[]> {
  const root = rootsOf(input);
  const home = root.home;
  const definitions: TargetDefinition[] = [];

  const dshMarker = path.join(root.dataDir, 'integrations', 'dsh.json');
  const dshWatchPath = transcriptWatchPath(root);
  const dshWatch = dshWatchPath.path;
  definitions.push(target('dsh', 'DeepSeek Harness', () => {
    if (dshWatchPath.error) return unknown(`Could not resolve transcript-watch configuration: ${dshWatchPath.error}`, [resource(dshWatch, 'edit configuration', 'managed DSH watch only', { sharedConfiguration: true })]);
    const marker = readJson(dshMarker);
    const watch = readJson(dshWatch);
    if (marker.state === 'invalid') return unknown(marker.reason, [resource(dshMarker, 'remove file', 'managed DSH profile receipt')]);
    if (watch.state === 'invalid') return unknown(watch.reason, [resource(dshWatch, 'edit configuration', 'managed DSH watch only', { sharedConfiguration: true })]);
    if (watch.state === 'valid' && (watch.value.version !== 1
      || (watch.value.schemas !== undefined && (!watch.value.schemas || typeof watch.value.schemas !== 'object' || Array.isArray(watch.value.schemas)))
      || !Array.isArray(watch.value.watches)
      || watch.value.watches.some((entry: unknown) => !entry || typeof entry !== 'object' || Array.isArray(entry)))) return unknown(`${dshWatch} has an invalid version, schemas, or watches field.`, [resource(dshWatch, 'edit configuration', 'managed DSH watch only', { sharedConfiguration: true })]);
    const dshWatches = watch.state === 'valid' && Array.isArray(watch.value.watches)
      ? watch.value.watches.filter((entry: any) => entry.schema === 'dsh' || entry.name === 'dsh')
      : [];
    if (dshWatches.some((entry: any) => entry.managedBy === 'claude-mem' && entry.name !== 'dsh')) return unknown('A managed DSH watch has an unexpected name and the existing cleaner cannot remove it safely.', [resource(dshWatch, 'edit configuration', 'managed DSH watch', { sharedConfiguration: true })]);
    if (marker.state === 'missing') {
      const managedWatch = dshWatches.some((entry: any) => entry?.managedBy === 'claude-mem');
      return managedWatch
        ? unknown('A managed DSH watch remains without its install receipt; marketplace ownership cannot be proven.', [resource(dshWatch, 'edit configuration', 'managedBy=claude-mem DSH watch', { sharedConfiguration: true }), resource(dshMarker, 'preserve', 'missing ownership receipt')])
        : absent('No DSH install receipt or managed DSH watch was found.');
    }
    if (!Array.isArray(marker.value.profiles) || !marker.value.profiles.every((profile: unknown) => typeof profile === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(profile))) {
      return unknown('DSH install receipt has an invalid profile list.', [resource(dshMarker, 'remove file', 'managed DSH profile receipt')]);
    }
    return present([`${dshMarker} sha256=${marker.fingerprint}`, `profiles=${marker.value.profiles.join(',') || '(none)'}`], [
      resource(dshMarker, 'remove file', 'managed DSH profile receipt'),
      ...marker.value.profiles.map((profile: string) => resource(`dsh://profile/${encodeURIComponent(profile)}`, 'run host command', `dsh plugin --profile ${profile} remove @claude-mem/dsh`)),
      ...(dshWatches.some((entry: any) => entry?.managedBy === 'claude-mem') ? [resource(dshWatch, 'edit configuration', 'name=dsh and managedBy=claude-mem', { sharedConfiguration: true })] : []),
    ]);
  }, async () => (await import('../../services/integrations/DeepSeekHarnessInstaller.js')).uninstallDeepSeekHarness({
    dataDir: root.dataDir,
    watchConfigPath: dshWatch,
    ...(adapters.dshCommandRunner ? { runHostCommand: adapters.dshCommandRunner } : {}),
  })));

  definitions.push(target('t3code', 'T3 Code provider plugins', () => inspectT3(root), async () => (await import('../../services/integrations/T3CodeInstaller.js')).uninstallT3Code()));

  definitions.push(target('hermes', 'Hermes Agent memory provider', () => {
    const envHome = root.environment.HERMES_HOME || (process.platform === 'win32' ? path.join(root.localAppData, 'hermes') : path.join(home, '.hermes'));
    const directory = path.join(envHome, 'plugins', 'claude-mem');
    const receiptPath = path.join(directory, '.claude-mem-install.json');
    const ownedNames = ['__init__.py', 'client.py', 'plugin.yaml', 'README.md'];
    const receipt = readJson(receiptPath);
    if (receipt.state === 'invalid' || (receipt.state === 'valid' && receipt.value.version !== 1)) return unknown(receipt.state === 'invalid' ? receipt.reason : 'Hermes receipt version is unsupported.', [resource(receiptPath, 'remove file', 'install receipt')]);
    const files = ownedNames.filter(name => existsSync(path.join(directory, name)));
    if (files.length === 0 && receipt.state === 'missing') return absent('No Hermes receipt or known Claude-Mem provider files were found.');
    const resources = [...files.map(name => resource(path.join(directory, name), 'remove file', 'known Claude-Mem provider file'))];
    let configMissing = false;
    if (receipt.state === 'valid') {
      if ((receipt.value.provider !== undefined && (!receipt.value.provider || typeof receipt.value.provider !== 'object' || Array.isArray(receipt.value.provider)))
        || (receipt.value.mcp !== undefined && (!receipt.value.mcp || typeof receipt.value.mcp !== 'object' || Array.isArray(receipt.value.mcp)))
        || (receipt.value.createdConfig !== undefined && typeof receipt.value.createdConfig !== 'boolean')) return unknown('Hermes receipt has an invalid field shape.', [resource(receiptPath, 'preserve', 'unverified receipt')]);
      resources.push(resource(receiptPath, 'remove file', 'version 1 install receipt'));
      if (receipt.value.provider || receipt.value.mcp || receipt.value.createdConfig) {
        const configPath = path.join(envHome, 'config.yaml');
        if (existsSync(configPath)) resources.push(resource(configPath, 'edit configuration', 'restore receipt-owned provider and MCP fields', { sharedConfiguration: true }));
        else configMissing = true;
      }
    }
    const cache = path.join(directory, '__pycache__');
    if (existsSync(cache)) resources.push(resource(cache, 'remove file', 'only __init__ and client .pyc files; remove directory only if empty'));
    const evidence = [...files.map(name => `owned file=${path.join(directory, name)}`)];
    if (receipt.state === 'valid') evidence.push(`${receiptPath} sha256=${receipt.fingerprint}`);
    if (configMissing) evidence.push(`${path.join(envHome, 'config.yaml')} is absent; no receipt-owned config remains to restore`);
    return present(evidence, resources);
  }, async () => (await import('../../services/integrations/HermesInstaller.js')).uninstallHermesIntegration()));

  definitions.push(target('pi', 'Pi extension', () => {
    const directory = path.join(root.environment.PI_CODING_AGENT_DIR || path.join(home, '.pi', 'agent'), 'extensions', 'claude-mem');
    const names = ['index.js', 'package.json', 'LICENSE.txt', 'CLAUDE-MEM-LICENSE.txt', 'CLAUDE-MEM-NOTICE.txt', 'TYPEBOX-LICENSE.txt', 'TYPEBOX-PROVENANCE.json'];
    const files = names.filter(name => existsSync(path.join(directory, name)));
    return files.length ? present(files.map(name => `owned file=${path.join(directory, name)}`), files.map(name => resource(path.join(directory, name), 'remove file', 'exact Pi owned filename'))) : absent('None of the seven exact Claude-Mem Pi files exists.');
  }, async () => (await import('../../services/integrations/PiInstaller.js')).uninstallPiExtension()));

  let windsurfWorkspaceRoots: string[] = [];
  definitions.push(target('windsurf', 'Windsurf hooks and project context', () => {
    const hooksPath = path.join(home, '.codeium', 'windsurf', 'hooks.json');
    const registryPath = path.join(root.dataDir, 'windsurf-projects.json');
    const hooks = readJson(hooksPath);
    const registry = readJson(registryPath);
    if (hooks.state === 'invalid') return unknown(hooks.reason, [resource(hooksPath, 'edit configuration', 'claude-mem worker-service hook entries', { sharedConfiguration: true })]);
    if (registry.state === 'invalid') return unknown(registry.reason, [resource(registryPath, 'edit configuration', 'registered workspace keys', { sharedConfiguration: true })]);
    if (hooks.state === 'valid' && hooks.value.hooks !== undefined && (!hooks.value.hooks || typeof hooks.value.hooks !== 'object' || Array.isArray(hooks.value.hooks))) return unknown(`${hooksPath} has an invalid hooks field.`, [resource(hooksPath, 'edit configuration', 'claude-mem worker-service hook entries', { sharedConfiguration: true })]);
    if (registry.state === 'valid' && Object.entries(registry.value).some(([workspace, entry]) => !path.isAbsolute(workspace) || !entry || typeof entry !== 'object' || Array.isArray(entry))) return unknown(`${registryPath} contains an invalid workspace entry.`, [resource(registryPath, 'edit configuration', 'registered workspace keys', { sharedConfiguration: true })]);
    const hookMatches: string[] = [];
    if (hooks.state === 'valid') {
      for (const [event, entries] of Object.entries(hooks.value.hooks ?? {})) {
        if (!Array.isArray(entries)) return unknown(`${hooksPath} hooks.${event} is not an array.`, [resource(hooksPath, 'edit configuration', 'claude-mem worker-service hook entries', { sharedConfiguration: true })]);
        for (const entry of entries as any[]) {
          if (!entry || typeof entry !== 'object' || typeof entry.command !== 'string') return unknown(`${hooksPath} contains an invalid ${event} hook entry.`, [resource(hooksPath, 'edit configuration', 'claude-mem worker-service hook entries', { sharedConfiguration: true })]);
          if (entry.command.includes('worker-service') && entry.command.includes('windsurf')) hookMatches.push(event);
        }
      }
    }
    const workspaceRoots = registry.state === 'valid' ? Object.keys(registry.value) : [];
    windsurfWorkspaceRoots = workspaceRoots;
    const contexts = workspaceRoots.map(workspace => path.join(workspace, '.windsurf', 'rules', 'claude-mem-context.md')).filter(existsSync);
    const evidence = [...hookMatches.map(event => `managed hook event=${event}`), ...contexts.map(file => `registered context=${file}`)];
    const resources = [
      ...(hookMatches.length ? [resource(hooksPath, 'edit configuration', 'remove only commands containing worker-service and windsurf; preserve all other top-level JSON properties', { sharedConfiguration: true })] : []),
      ...(workspaceRoots.length ? [resource(registryPath, 'edit configuration', `remove only registered workspace keys: ${workspaceRoots.join(', ')}`, { sharedConfiguration: true })] : []),
      ...contexts.map(file => resource(file, 'remove file', 'registered workspace context file')),
    ];
    if (!hookMatches.length && !workspaceRoots.length && !contexts.length) return absent('No managed Windsurf hooks or registered workspace entries were found.');
    return present([...(hooks.state === 'valid' ? [`${hooksPath} sha256=${hooks.fingerprint}`] : []), ...(registry.state === 'valid' ? [`${registryPath} sha256=${registry.fingerprint}`] : []), ...evidence], resources);
  }, async () => {
    return (await import('../../services/integrations/WindsurfHooksInstaller.js')).uninstallWindsurfHooks({
      workspaceRoots: windsurfWorkspaceRoots,
      hooksPath: path.join(home, '.codeium', 'windsurf', 'hooks.json'),
      registryPath: path.join(root.dataDir, 'windsurf-projects.json'),
    });
  }));

  definitions.push(target('goose', 'Goose MCP extension', () => {
    const configPath = path.join(home, '.config', 'goose', 'config.yaml');
    const read = readText(configPath);
    if (read.state === 'missing') return absent('Goose config.yaml is absent.');
    if (read.state === 'invalid') return unknown(read.reason, [resource(configPath, 'edit configuration', 'extensions.claude-mem', { sharedConfiguration: true })]);
    const status = gooseEntry(read.content);
    if (status === 'unknown') return unknown('Goose extensions mapping is inline or ambiguous; no YAML rewrite was attempted.', [resource(configPath, 'edit configuration', 'extensions.claude-mem', { sharedConfiguration: true })]);
    return status === 'present'
      ? present([`${configPath} sha256=${read.fingerprint}`, 'top-level extensions.claude-mem entry'], [resource(configPath, 'edit configuration', 'remove only extensions.claude-mem', { sharedConfiguration: true })])
      : absent('Goose has no top-level extensions.claude-mem entry.');
  }, async () => (await import('../../services/integrations/McpIntegrations.js')).uninstallGooseMcpIntegration()));

  definitions.push(target('opencode', 'OpenCode plugin', () => {
    const configDir = root.environment.OPENCODE_CONFIG_DIR || path.join(home, '.config', 'opencode');
    const configPath = path.join(configDir, 'opencode.json');
    const pluginPath = path.join(configDir, 'plugins', 'claude-mem.js');
    const agentsPath = path.join(configDir, 'AGENTS.md');
    const config = readJson(configPath);
    const context = managedTaggedBlock(agentsPath);
    if (config.state === 'invalid') return unknown(config.reason, [resource(configPath, 'edit configuration', 'plugin and mcp.claude-mem entries', { sharedConfiguration: true })]);
    if (context.state === 'unknown') return unknown(context.reason ?? `Could not read ${agentsPath}`, [resource(agentsPath, 'edit configuration', '<claude-mem-context> block', { sharedConfiguration: true })]);
    const pluginRefs = config.state === 'valid' && ['plugin', 'plugins'].some(key => {
      const value = config.value[key];
      return (Array.isArray(value) ? value : [value]).includes('./plugins/claude-mem.js');
    });
    const mcpRef = config.state === 'valid' && config.value.mcp && typeof config.value.mcp === 'object' && Object.hasOwn(config.value.mcp, 'claude-mem');
    const pluginExists = existsSync(pluginPath);
    if (!pluginRefs && !mcpRef && !pluginExists && context.state !== 'present') return absent('No OpenCode plugin, MCP entry, or managed AGENTS.md context was found.');
    const resources = [
      ...(pluginExists ? [resource(pluginPath, 'remove file', 'exact plugins/claude-mem.js plugin file')] : []),
      ...(pluginRefs || mcpRef ? [resource(configPath, 'edit configuration', 'remove only plugin ./plugins/claude-mem.js and mcp.claude-mem entries', { sharedConfiguration: true })] : []),
      ...(context.state === 'present' ? [resource(agentsPath, 'edit configuration', '<claude-mem-context> block', { sharedConfiguration: true })] : []),
    ];
    return present([...(config.state === 'valid' ? [`${configPath} sha256=${config.fingerprint}`] : []), ...(pluginExists ? [`${pluginPath} exists`] : []), ...(context.state === 'present' ? [`${agentsPath} context marker`] : [])], resources);
  }, async () => (await import('../../services/integrations/OpenCodeInstaller.js')).uninstallOpenCodePlugin()));

  definitions.push(target('openclaw', 'OpenClaw plugin', () => {
    const directory = path.join(home, '.openclaw', 'extensions', 'claude-mem');
    const configPath = path.join(home, '.openclaw', 'openclaw.json');
    const config = readJson(configPath);
    if (config.state === 'invalid') return unknown(config.reason, [resource(configPath, 'edit configuration', 'plugins.entries.claude-mem and plugins.slots.memory', { sharedConfiguration: true }), resource(directory, 'remove tree', 'all contents', { recursive: true })]);
    if (config.state === 'valid' && config.value.plugins !== undefined && (!config.value.plugins || typeof config.value.plugins !== 'object' || Array.isArray(config.value.plugins))) return unknown(`${configPath}.plugins has an invalid shape.`, [resource(configPath, 'edit configuration', 'plugins.entries.claude-mem and plugins.slots.memory', { sharedConfiguration: true })]);
    if (config.state === 'valid' && config.value.plugins?.entries !== undefined && (!config.value.plugins.entries || typeof config.value.plugins.entries !== 'object' || Array.isArray(config.value.plugins.entries))) return unknown(`${configPath}.plugins.entries has an invalid shape.`, [resource(configPath, 'edit configuration', 'plugins.entries.claude-mem', { sharedConfiguration: true })]);
    if (config.state === 'valid' && config.value.plugins?.slots !== undefined && (!config.value.plugins.slots || typeof config.value.plugins.slots !== 'object' || Array.isArray(config.value.plugins.slots))) return unknown(`${configPath}.plugins.slots has an invalid shape.`, [resource(configPath, 'edit configuration', 'plugins.slots.memory', { sharedConfiguration: true })]);
    const entry = config.state === 'valid' && Boolean(config.value.plugins?.entries?.['claude-mem']);
    const slot = config.state === 'valid' && config.value.plugins?.slots?.memory === 'claude-mem';
    const packagePath = path.join(directory, 'package.json');
    const packageInfo = readJson(packagePath);
    if (packageInfo.state === 'invalid') return unknown(packageInfo.reason, [resource(directory, 'remove tree', 'all contents', { recursive: true, note: 'Recursive deletion also removes user-added files placed inside this extension directory.' })]);
    const ownsTree = packageInfo.state === 'valid' && packageInfo.value.name === 'claude-mem' && packageInfo.value.main === 'dist/index.js' && existsSync(path.join(directory, 'dist', 'index.js'));
    if (!entry && !slot && !ownsTree) return existsSync(directory)
      ? unknown('OpenClaw extension directory exists without an exact Claude-Mem package manifest or registration; recursive ownership is unproven.', [resource(directory, 'preserve', 'unverified extension tree', { recursive: true })])
      : absent('No OpenClaw Claude-Mem registration or extension directory was found.');
    if (existsSync(directory) && !ownsTree) return unknown('OpenClaw registration exists, but the extension directory lacks the exact Claude-Mem package manifest and entry point; recursive deletion is unproven.', [resource(configPath, 'edit configuration', 'plugins.entries.claude-mem and plugins.slots.memory', { sharedConfiguration: true }), resource(directory, 'preserve', 'unverified extension tree', { recursive: true })]);
    const resources = [
      ...(existsSync(directory) ? [resource(directory, 'remove tree', 'entire extensions/claude-mem directory, including added files', { recursive: true, note: 'The approved recursive removal includes any user-added files inside this directory.' })] : []),
      ...(entry || slot ? [resource(configPath, 'edit configuration', 'plugins.entries.claude-mem and only memory slot value claude-mem', { sharedConfiguration: true })] : []),
    ];
    const evidence = [entry ? 'exact plugins.entries.claude-mem registration' : '', slot ? 'plugins.slots.memory=claude-mem' : '', ownsTree ? `${packagePath} sha256=${packageInfo.fingerprint}` : ''].filter(Boolean);
    if (config.state === 'valid') evidence.push(`${configPath} sha256=${config.fingerprint}`);
    if (existsSync(directory)) {
      try { evidence.push(`tree sha256=${treeFingerprint(directory)}`); }
      catch (error) { return unknown(`Could not inspect the OpenClaw extension tree: ${error instanceof Error ? error.message : String(error)}`, [resource(directory, 'preserve', 'unreadable recursive extension tree', { recursive: true })]); }
    }
    return present(evidence, resources);
  }, async () => (await import('../../services/integrations/OpenClawInstaller.js')).uninstallOpenClawPlugin()));

  let removeCodexMarketplace = false;
  definitions.push(target('codex', 'Codex CLI (maintained host)', () => {
    const inspection = inspectCodex(root);
    removeCodexMarketplace = inspection.removeMarketplace;
    return inspection.evidence;
  }, async () => (await import('../../services/integrations/CodexCliInstaller.js')).uninstallCodexCli({ removeMarketplace: removeCodexMarketplace })));

  definitions.push(target('antigravity', 'Antigravity CLI hooks + MCP', () => {
    const gemini = path.join(home, '.gemini');
    const hooksPath = path.join(gemini, 'config', 'hooks.json');
    const settingsPath = path.join(gemini, 'settings.json');
    const geminiMdPath = path.join(gemini, 'GEMINI.md');
    const rulesPath = path.join(home, '.agents', 'rules', 'claude-mem-context.md');
    const mcpPaths = [path.join(gemini, 'antigravity', 'mcp_config.json'), path.join(gemini, 'config', 'mcp_config.json')];
    const hooks = readJson(hooksPath);
    const settings = readJson(settingsPath);
    const mcp = mcpPaths.map(readJson);
    const bad = [hooks, settings, ...mcp].find(value => value.state === 'invalid');
    if (bad?.state === 'invalid') return unknown(bad.reason, [resource(hooksPath, 'edit configuration', 'named claude-mem hook entries', { sharedConfiguration: true }), ...mcpPaths.map(file => resource(file, 'edit configuration', 'mcpServers.claude-mem', { sharedConfiguration: true }))]);
    if (mcp.some(value => value.state === 'valid' && value.value.mcpServers !== undefined && (!value.value.mcpServers || typeof value.value.mcpServers !== 'object' || Array.isArray(value.value.mcpServers)))) return unknown('Antigravity MCP configuration has an invalid mcpServers field.', mcpPaths.map(file => resource(file, 'edit configuration', 'mcpServers.claude-mem', { sharedConfiguration: true })));
    if (hooks.state === 'valid' && Object.hasOwn(hooks.value, 'claude-mem') && (!hooks.value['claude-mem'] || typeof hooks.value['claude-mem'] !== 'object' || Array.isArray(hooks.value['claude-mem']))) return unknown(`${hooksPath} has a malformed claude-mem hook.`, [resource(hooksPath, 'edit configuration', 'named claude-mem hook', { sharedConfiguration: true })]);
    const legacyHookStatus = hooks.state === 'valid' ? legacyAntigravityHookStatus(hooks.value) : 'absent';
    const legacySettingStatus = settings.state === 'valid' ? legacyAntigravityHookStatus(settings.value.hooks, true) : 'absent';
    if (legacyHookStatus === 'unknown' || legacySettingStatus === 'unknown') return unknown('Antigravity legacy hook configuration has an ambiguous shape.', [resource(hooksPath, 'edit configuration', 'legacy event hook entries', { sharedConfiguration: true }), resource(settingsPath, 'edit configuration', 'legacy event hook entries', { sharedConfiguration: true })]);
    const hookPresent = hooks.state === 'valid' && (Object.hasOwn(hooks.value, 'claude-mem') || legacyHookStatus === 'present');
    const legacySetting = settings.state === 'valid' && legacySettingStatus === 'present';
    const mcpPresent = mcp.some(value => value.state === 'valid' && Boolean(value.value.mcpServers?.['claude-mem']));
    const geminiContext = managedTaggedBlock(geminiMdPath);
    const rulesContext = managedTaggedBlock(rulesPath);
    if (geminiContext.state === 'unknown' || rulesContext.state === 'unknown') return unknown(geminiContext.reason ?? rulesContext.reason ?? 'Could not inspect Antigravity context files.');
    const presentAny = hookPresent || legacySetting || mcpPresent || geminiContext.state === 'present' || rulesContext.state === 'present';
    if (!presentAny) return absent('No named Antigravity hooks, Claude-Mem MCP entries, or context markers were found.');
    const resources = [
      ...(hookPresent ? [resource(hooksPath, 'edit configuration', 'hooks.claude-mem only', { sharedConfiguration: true })] : []),
      ...(legacySetting ? [resource(settingsPath, 'edit configuration', 'legacy hooks entries named claude-mem', { sharedConfiguration: true })] : []),
      ...mcpPaths.filter((_, index) => mcp[index].state === 'valid' && (mcp[index] as any).value.mcpServers?.['claude-mem']).map(file => resource(file, 'edit configuration', 'mcpServers.claude-mem only', { sharedConfiguration: true })),
      ...(geminiContext.state === 'present' ? [resource(geminiMdPath, 'edit configuration', '<claude-mem-context> block', { sharedConfiguration: true })] : []),
      ...(rulesContext.state === 'present' ? [resource(rulesPath, 'edit configuration', '<claude-mem-context> block', { sharedConfiguration: true })] : []),
    ];
    const evidence = [hookPresent ? `${hooksPath} sha256=${(hooks as any).fingerprint}` : '', legacySetting ? `${settingsPath} sha256=${(settings as any).fingerprint}` : '', mcpPresent ? 'mcpServers.claude-mem registration' : '', geminiContext.state === 'present' ? `${geminiMdPath} context marker` : '', rulesContext.state === 'present' ? `${rulesPath} context marker` : ''].filter(Boolean);
    return present(evidence, resources);
  }, async () => (await import('../../services/integrations/AntigravityCliHooksInstaller.js')).uninstallAntigravityCliHooks()));

  definitions.push(target('kimi', 'Kimi Code hooks + MCP', () => {
    const kimiHome = root.environment.KIMI_CODE_HOME || path.join(home, '.kimi-code');
    const configPath = path.join(kimiHome, 'config.toml');
    const mcpPath = path.join(kimiHome, 'mcp.json');
    const config = readText(configPath);
    const mcp = readJson(mcpPath);
    if (config.state === 'invalid') return unknown(config.reason, [resource(configPath, 'edit configuration', 'managed Claude-Mem hook block', { sharedConfiguration: true })]);
    if (mcp.state === 'invalid') return unknown(mcp.reason, [resource(mcpPath, 'edit configuration', 'mcpServers.mcp-search', { sharedConfiguration: true })]);
    const markerBegin = '# >>> claude-mem kimi hooks (managed by claude-mem; do not edit) >>>';
    const markerEnd = '# <<< claude-mem kimi hooks <<<';
    const beginCount = config.state === 'valid' ? config.content.split(markerBegin).length - 1 : 0;
    const endCount = config.state === 'valid' ? config.content.split(markerEnd).length - 1 : 0;
    if (beginCount !== endCount || beginCount > 1) return unknown('Kimi managed hook markers are incomplete or duplicated.', [resource(configPath, 'preserve', 'ambiguous managed hook block', { sharedConfiguration: true })]);
    const marker = beginCount === 1;
    const entry = mcp.state === 'valid' ? mcp.value.mcpServers?.['mcp-search'] : undefined;
    const args = entry?.args;
    const ambiguousOurs = Array.isArray(args) && args.some((arg: unknown) => typeof arg === 'string' && arg.endsWith('mcp-server.cjs'));
    if (ambiguousOurs) return unknown('Kimi mcp-search command matches the legacy filename suffix, which does not prove Marian ownership.', [resource(mcpPath, 'preserve', 'ambiguous mcpServers.mcp-search entry', { sharedConfiguration: true }), ...(marker ? [resource(configPath, 'edit configuration', 'managed Claude-Mem hook block', { sharedConfiguration: true })] : [])]);
    if (!marker) return absent('No managed Kimi hook marker or unambiguous Marian MCP entry was found.');
    return present([`${configPath} sha256=${(config as any).fingerprint}`], [resource(configPath, 'edit configuration', 'remove only managed Claude-Mem hook block', { sharedConfiguration: true })]);
  }, async () => (await import('../../services/integrations/KimiHooksInstaller.js')).uninstallKimiHooks()));

  definitions.push(target('omp', 'OMP hooks', () => {
    const agentDir = root.environment.PI_CODING_AGENT_DIR || path.join(home, '.omp', 'agent');
    const file = path.join(agentDir, 'hooks', 'pre', 'claude-mem.ts');
    return existsSync(file) ? present([`${file} exists`], [resource(file, 'remove file', 'exact claude-mem.ts hook')]) : absent('OMP claude-mem.ts hook is absent.');
  }, async () => (await import('../../services/integrations/OmpHooksInstaller.js')).uninstallOmpHooks()));

  return Promise.all(definitions.map(prepareTargetAsync));
}
