// Modified by the claude-mem-marian fork: OpenCode host installation is retired; legacy plugin/MCP/AGENTS cleanup and the status helper remain per Decision 04. Upstream attribution is retained.
import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { logger } from '../../utils/logger.js';
import { CONTEXT_TAG_OPEN, findContextBlockRange } from '../../utils/context-injection.js';

const OPENCODE_PLUGIN_CONFIG_PATH = './plugins/claude-mem.js';
const OPENCODE_MCP_SERVER_KEY = 'claude-mem';

type OpenCodeConfig = {
  $schema?: string;
  plugin?: unknown;
  plugins?: unknown;
  [key: string]: unknown;
};

export function getOpenCodeConfigDirectory(): string {
  if (process.env.OPENCODE_CONFIG_DIR) {
    return process.env.OPENCODE_CONFIG_DIR;
  }
  return path.join(homedir(), '.config', 'opencode');
}

export function getOpenCodePluginsDirectory(): string {
  return path.join(getOpenCodeConfigDirectory(), 'plugins');
}

export function getOpenCodeConfigPath(): string {
  return path.join(getOpenCodeConfigDirectory(), 'opencode.json');
}

export function getOpenCodeAgentsMdPath(): string {
  return path.join(getOpenCodeConfigDirectory(), 'AGENTS.md');
}

export function getInstalledPluginPath(): string {
  return path.join(getOpenCodePluginsDirectory(), 'claude-mem.js');
}

function getOpenCodePluginEntries(config: OpenCodeConfig, key: 'plugin' | 'plugins' = 'plugin'): unknown[] {
  if (Array.isArray(config[key])) {
    return config[key] as unknown[];
  }
  return config[key] === undefined ? [] : [config[key]];
}

/**
 * Remove claude-mem's entry from `plugin` (OpenCode 1) and `plugins`
 * (OpenCode 2), keeping every other entry. A key the config lacks stays absent.
 */
export function removeOpenCodePluginReference(config: OpenCodeConfig): OpenCodeConfig {
  const next: OpenCodeConfig = { ...config };
  for (const key of ['plugin', 'plugins'] as const) {
    if (config[key] === undefined) continue;
    next[key] = getOpenCodePluginEntries(config, key).filter(
      (plugin) => plugin !== OPENCODE_PLUGIN_CONFIG_PATH,
    );
  }
  return next;
}

function getOpenCodeMcpEntry(config: OpenCodeConfig): Record<string, unknown> {
  return (config.mcp && typeof config.mcp === 'object')
    ? config.mcp as Record<string, unknown>
    : {};
}

/**
 * Remove only claude-mem's MCP entry from opencode.json, preserving every other
 * MCP server. The `mcp` block itself is dropped when it becomes empty.
 */
export function removeOpenCodeMcpReference(config: OpenCodeConfig): OpenCodeConfig {
  const existingMcp = getOpenCodeMcpEntry(config);
  if (!(OPENCODE_MCP_SERVER_KEY in existingMcp)) {
    return config;
  }

  const { [OPENCODE_MCP_SERVER_KEY]: _removed, ...remainingMcp } = existingMcp;
  const next: OpenCodeConfig = { ...config, mcp: remainingMcp };
  if (Object.keys(remainingMcp).length === 0) {
    delete next.mcp;
  }
  return next;
}

export function deregisterOpenCodePluginFromConfig(): number {
  const configPath = getOpenCodeConfigPath();
  if (!existsSync(configPath)) {
    return 0;
  }

  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8')) as OpenCodeConfig;
    const updatedConfig = removeOpenCodeMcpReference(removeOpenCodePluginReference(config));

    if (JSON.stringify(updatedConfig) === JSON.stringify(config)) return 0;

    writeFileSync(configPath, `${JSON.stringify(updatedConfig, null, 2)}\n`, 'utf-8');
    console.log(`  Plugin deregistered from: ${configPath}`);
    logger.info('OPENCODE', 'Plugin deregistered from config', { path: configPath });

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to deregister OpenCode plugin from config: ${message}`);
    return 1;
  }
}

function writeOrRemoveCleanedAgentsMd(agentsMdPath: string, trimmedContent: string): void {
  if (
    trimmedContent.length === 0 ||
    trimmedContent === '# Claude-Mem Memory Context'
  ) {
    unlinkSync(agentsMdPath);
    console.log(`  Removed empty AGENTS.md`);
  } else {
    writeFileSync(agentsMdPath, trimmedContent + '\n', 'utf-8');
    console.log(`  Cleaned context from AGENTS.md`);
  }
}

export function uninstallOpenCodePlugin(): number {
  let hasErrors = false;

  const pluginPath = getInstalledPluginPath();
  if (existsSync(pluginPath)) {
    try {
      unlinkSync(pluginPath);
      console.log(`  Removed plugin: ${pluginPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  Failed to remove plugin: ${message}`);
      hasErrors = true;
    }
  }

  if (deregisterOpenCodePluginFromConfig() !== 0) {
    hasErrors = true;
  }

  if (!removeContextBlockFromAgentsMd()) {
    hasErrors = true;
  }

  return hasErrors ? 1 : 0;
}

/**
 * Strip claude-mem's context block from OpenCode's global AGENTS.md
 * (`~/.config/opencode/AGENTS.md`). Older installs wrote memory there, read
 * from the `opencode` project key, which nothing has written since #3803.
 * OpenCode loads that file for every project, so one stale block showed up in
 * all of them. The plugin now injects each project's own context into the
 * system prompt instead. The user's own content in the file stays, and a file
 * holding nothing else is removed. Returns false when the file could not be
 * read or rewritten.
 */
export function removeContextBlockFromAgentsMd(): boolean {
  const agentsMdPath = getOpenCodeAgentsMdPath();
  if (!existsSync(agentsMdPath)) return true;

  let content: string;
  try {
    content = readFileSync(agentsMdPath, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  Failed to read AGENTS.md: ${message}`);
    return false;
  }

  const block = findContextBlockRange(content);
  if (!block) return true;

  const trimmedContent = (
    content.slice(0, block.start).trimEnd() +
    '\n' +
    content.slice(block.end).trimStart()
  ).trim();
  try {
    writeOrRemoveCleanedAgentsMd(agentsMdPath, trimmedContent);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  Failed to clean AGENTS.md: ${message}`);
    return false;
  }
}

export function checkOpenCodeStatus(): number {
  console.log('\nClaude-Mem OpenCode Integration Status\n');

  const configDirectory = getOpenCodeConfigDirectory();
  const pluginPath = getInstalledPluginPath();
  const agentsMdPath = getOpenCodeAgentsMdPath();

  console.log(`Config directory: ${configDirectory}`);
  console.log(`  Exists: ${existsSync(configDirectory) ? 'yes' : 'no'}`);
  console.log('');

  console.log(`Plugin: ${pluginPath}`);
  console.log(`  Installed: ${existsSync(pluginPath) ? 'yes' : 'no'}`);
  console.log('');

  console.log(`Context: injected by the plugin into each request's system prompt`);
  if (existsSync(agentsMdPath) && readFileSync(agentsMdPath, 'utf-8').includes(CONTEXT_TAG_OPEN)) {
    console.log(`  Leftover claude-mem block from an older install in ${agentsMdPath}`);
    console.log(`  (shown in every OpenCode project): legacy cleanup removes it`);
  }
  console.log('');

  console.log(`MCP server (opencode.json):`);
  try {
    if (existsSync(getOpenCodeConfigPath())) {
      const config = JSON.parse(readFileSync(getOpenCodeConfigPath(), 'utf-8')) as OpenCodeConfig;
      const mcpEntry = getOpenCodeMcpEntry(config)[OPENCODE_MCP_SERVER_KEY];
      if (mcpEntry && typeof mcpEntry === 'object') {
        const command = (mcpEntry as { command?: unknown }).command;
        console.log(`  Registered: yes`);
        console.log(`  Command: ${Array.isArray(command) ? command.join(' ') : 'unknown'}`);
      } else {
        console.log(`  Registered: no`);
      }
    } else {
      console.log(`  Registered: no (${getOpenCodeConfigPath()} does not exist)`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  Registered: unknown (could not read config: ${message})`);
  }

  console.log('');
  return 0;
}
