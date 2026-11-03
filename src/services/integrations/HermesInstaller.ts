// Modified by the claude-mem-marian fork: the Hermes installer is retired; legacy uninstall cleanup remains available. Upstream attribution is retained.

import path from 'path';
import { homedir } from 'os';
import { chmodSync, existsSync, readFileSync, readdirSync, renameSync, rmSync, rmdirSync, statSync, writeFileSync } from 'fs';
import {
  HermesConfigShapeError,
  removeMcpServer,
  restoreMemoryProvider,
  type McpReceipt,
  type ProviderReceipt,
} from './hermes-config-yaml.js';

/**
 * Hermes Agent (Nous Research) legacy cleanup.
 *
 * Legacy installs put a provider in `$HERMES_HOME/plugins/<name>/` (a folder
 * whose `__init__.py` registers a MemoryProvider) and run the one named by
 * `memory.provider` in `$HERMES_HOME/config.yaml`; MCP servers are listed
 * under `mcp_servers`. New installation is retired: `hermes` is not a
 * maintained install target and the repository no longer ships
 * `hermes/claude-mem/`.
 *
 * The receipt in the plugin folder records what config.yaml held before, so
 * uninstall puts back exactly that and removes only what install added.
 */

export const HERMES_PLUGIN_NAME = 'claude-mem';
const OWNED_FILES = ['__init__.py', 'client.py', 'plugin.yaml', 'README.md'];
const RECEIPT_FILE = '.claude-mem-install.json';

interface HermesReceipt {
  version: 1;
  /** Present when install selected the provider. */
  provider?: ProviderReceipt;
  /** Present when install added (and so owns) mcp_servers.claude-mem. */
  mcp?: McpReceipt;
  /** Install wrote config.yaml where Hermes had none. */
  createdConfig?: boolean;
}

export function hermesHome(): string {
  if (process.env.HERMES_HOME) return process.env.HERMES_HOME;
  if (process.platform === 'win32') {
    const base = process.env.LOCALAPPDATA?.trim() || path.join(homedir(), 'AppData', 'Local');
    return path.join(base, 'hermes');
  }
  return path.join(homedir(), '.hermes');
}

export function hermesPluginDirectory(): string {
  return path.join(hermesHome(), 'plugins', HERMES_PLUGIN_NAME);
}

function hermesConfigPath(): string {
  return path.join(hermesHome(), 'config.yaml');
}

function readReceipt(): HermesReceipt | null {
  try {
    const parsed = JSON.parse(readFileSync(path.join(hermesPluginDirectory(), RECEIPT_FILE), 'utf-8'));
    return parsed && parsed.version === 1 ? parsed as HermesReceipt : null;
  } catch {
    return null;
  }
}

function readConfig(): string {
  return existsSync(hermesConfigPath()) ? readFileSync(hermesConfigPath(), 'utf-8') : '';
}

function writeConfig(text: string): void {
  const target = hermesConfigPath();
  // config.yaml can hold credentials: the replacement keeps the file's own
  // permissions, and is never readable by others while it is being written.
  const mode = existsSync(target) ? statSync(target).mode & 0o777 : 0o600;
  const staging = `${target}.claude-mem-${process.pid}.tmp`;
  writeFileSync(staging, text, { encoding: 'utf-8', mode: 0o600 });
  chmodSync(staging, mode);
  renameSync(staging, target);
}

export function uninstallHermesIntegration(): number {
  const directory = hermesPluginDirectory();
  const receipt = readReceipt();
  if (!receipt && !OWNED_FILES.some(name => existsSync(path.join(directory, name)))) {
    console.log('  Hermes plugin not installed; nothing to remove.');
    return 0;
  }
  try {
    if (receipt && existsSync(hermesConfigPath())) {
      const original = readConfig();
      let text = original;
      if (receipt.provider) text = restoreMemoryProvider(text, HERMES_PLUGIN_NAME, receipt.provider);
      if (receipt.mcp) text = removeMcpServer(text, HERMES_PLUGIN_NAME, receipt.mcp);
      if (receipt.createdConfig && text.trim() === '') rmSync(hermesConfigPath(), { force: true });
      else if (text !== original) writeConfig(text);
    }
    for (const name of [...OWNED_FILES, RECEIPT_FILE]) rmSync(path.join(directory, name), { force: true });
    // Python leaves compiled copies of the provider beside it.
    const cache = path.join(directory, '__pycache__');
    if (existsSync(cache)) {
      for (const name of readdirSync(cache)) {
        if (/^(__init__|client)\..+\.pyc$/.test(name)) rmSync(path.join(cache, name), { force: true });
      }
      if (readdirSync(cache).length === 0) rmdirSync(cache);
    }
    if (existsSync(directory) && readdirSync(directory).length === 0) rmdirSync(directory);
    console.log(`  Removed Hermes plugin: ${directory}`);
    return 0;
  } catch (error) {
    if (error instanceof HermesConfigShapeError) {
      console.error(`Hermes config.yaml was not changed: ${error.message}. Remove memory.provider: claude-mem by hand.`);
      return 1;
    }
    console.error(`Failed to remove the Hermes plugin: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}
