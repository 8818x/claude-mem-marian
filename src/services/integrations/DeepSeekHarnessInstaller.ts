// Modified by the claude-mem-marian fork: native DSH installation is retired; marker-driven legacy cleanup with retry semantics remains per Decision 04. Upstream attribution is retained.
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { DATA_DIR, USER_SETTINGS_PATH, expandHome } from '../../shared/paths.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { writeJsonFileAtomic, readJsonFileWithBom } from '../../shared/atomic-json.js';
import { buildSpawnSyncInvocation, lookupWindowsCommand, spawnHidden } from '../../shared/spawn.js';
import type { TranscriptWatchConfig } from '../transcripts/types.js';

const PACKAGE_NAME = '@claude-mem/dsh';
const WATCH_NAME = 'dsh';
const PROFILE_NAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
function markerPath(dataDir = DATA_DIR): string { return join(dataDir, 'integrations', 'dsh.json'); }
function readInstallState(dataDir = DATA_DIR): { profiles: string[] } {
  if (!existsSync(markerPath(dataDir))) return { profiles: [] };
  const state = readJsonFileWithBom<{ profiles: string[] }>(markerPath(dataDir));
  if (!Array.isArray(state.profiles) || !state.profiles.every(profile => typeof profile === 'string' && PROFILE_NAME.test(profile))) {
    throw new Error('Invalid managed DSH profile state: ' + markerPath(dataDir));
  }
  return state;
}
export function dshWatchConfigPath(settingsPath = USER_SETTINGS_PATH): string {
  const settings = SettingsDefaultsManager.loadFromFile(settingsPath, true, { readOnly: true });
  return expandHome(settings.CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH);
}

function readWatchConfig(file = dshWatchConfigPath(), dataDir = DATA_DIR): TranscriptWatchConfig {
  if (!existsSync(file)) return { version: 1, schemas: {}, watches: [], stateFile: join(dataDir, 'transcript-watch-state.json') };
  const config = readJsonFileWithBom<TranscriptWatchConfig>(file);
  if (config.version !== 1 || !Array.isArray(config.watches) || (config.schemas !== undefined && (!config.schemas || typeof config.schemas !== 'object' || Array.isArray(config.schemas)))) {
    throw new Error('Invalid transcript-watch config; repair ' + file + ' and retry.');
  }
  return config;
}
export function uninstallDshTranscriptWatch(options: { dataDir?: string; watchConfigPath?: string } = {}): void {
  const file = options.watchConfigPath ?? dshWatchConfigPath();
  if (!existsSync(file)) return;
  const config = readWatchConfig(file, options.dataDir ?? DATA_DIR);
  const watchCount = config.watches.length;
  config.watches = config.watches.filter(watch => !(watch.name === WATCH_NAME && (watch as typeof watch & { managedBy?: string }).managedBy === 'claude-mem'));
  if (config.watches.length === watchCount) return;
  // A schema may be used by a user-managed watch; it is harmless to keep it.
  writeJsonFileAtomic(file, config);
}

async function runDsh(profile: string, operation: 'remove', target: string): Promise<number> {
  const command = process.platform === 'win32' ? lookupWindowsCommand('dsh') ?? 'dsh.cmd' : 'dsh';
  const invocation = buildSpawnSyncInvocation(command, ['plugin', '--profile', profile, operation, '--workspace-root', target], {
    encoding: 'utf8', timeout: 120_000,
  });
  return new Promise(resolve => {
    const child = spawnHidden(invocation.command, invocation.args, { ...invocation.options, stdio: 'pipe' });
    let output = '';
    const collect = (chunk: Buffer): void => { output = (output + chunk.toString()).slice(-16_384); };
    child.stdout?.on('data', collect);
    child.stderr?.on('data', collect);
    child.once('error', error => {
      console.error('DSH could not run: ' + error.message + '. Install dsh and pnpm, then retry.');
      resolve(1);
    });
    child.once('close', code => {
      if (code !== 0 && output) console.error(output);
      resolve(code ?? 1);
    });
  });
}

export interface DshUninstallOptions {
  dataDir?: string;
  watchConfigPath?: string;
  runHostCommand?: (profile: string, operation: 'remove', target: string) => Promise<number>;
}

export async function uninstallDeepSeekHarness(options: DshUninstallOptions = {}): Promise<number> {
  const dataDir = options.dataDir ?? DATA_DIR;
  const marker = markerPath(dataDir);
  if (!existsSync(marker)) return 0;
  try {
    const state = readInstallState(dataDir);
    const runHostCommand = options.runHostCommand ?? ((profile: string, _operation: 'remove', target: string) => runDsh(profile, 'remove', target));
    for (const profile of state.profiles) {
      if (await runHostCommand(profile, 'remove', PACKAGE_NAME) !== 0) return 1;
    }
    uninstallDshTranscriptWatch({ dataDir, watchConfigPath: options.watchConfigPath });
    rmSync(marker, { force: true });
    return 0;
  } catch (error) { console.error('DSH uninstall failed: ' + String(error)); return 1; }
}
