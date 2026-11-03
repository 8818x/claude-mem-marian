// Modified by the claude-mem-marian fork: Kimi active hook support is retired (Decision 09); worker/npx `kimi status`/`kimi uninstall` migration diagnostics and cleanup remain. Upstream attribution is retained.
/**
 * KimiHooksInstaller.ts — legacy Kimi Code CLI cleanup + diagnostics.
 *
 * Kimi hooks live in `[[hooks]]` tables inside $KIMI_CODE_HOME/config.toml
 * (TOML) inside a marker-delimited managed block — no TOML library. The MCP
 * server registration went into $KIMI_CODE_HOME/mcp.json (plain JSON merge).
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { kimiCodeHome, kimiConfigPath, kimiMcpJsonPath } from '../../shared/kimi-paths.js';
import { requireMaintainedInstallTarget, UnsupportedInstallTargetError } from '../../shared/integration-id.js';

export const KIMI_MARKER_BEGIN = '# >>> claude-mem kimi hooks (managed by claude-mem; do not edit) >>>';
export const KIMI_MARKER_END = '# <<< claude-mem kimi hooks <<<';

export function removeManagedBlock(content: string): string {
  const begin = content.indexOf(KIMI_MARKER_BEGIN);
  const end = content.indexOf(KIMI_MARKER_END);
  if (begin === -1 || end === -1 || end <= begin) return content;
  const prefix = content.slice(0, begin).replace(/\n+$/, '');
  const suffix = content.slice(end + KIMI_MARKER_END.length).replace(/^\n+/, '');
  if (prefix.length === 0) return suffix;
  if (suffix.length === 0) return `${prefix}\n`;
  return `${prefix}\n\n${suffix}`;
}

/**
 * Remove the `mcp-search` server from mcp.json, but only the entry claude-mem
 * wrote (its args point at our mcp-server.cjs): the name is generic, and a
 * pre-existing entry of that name is left alone.
 */
function removeKimiMcpServer(): void {
  const mcpPath = kimiMcpJsonPath();
  if (!existsSync(mcpPath)) return;
  const config: { mcpServers?: Record<string, { args?: unknown }> } = JSON.parse(readFileSync(mcpPath, 'utf-8'));
  const args = config.mcpServers?.['mcp-search']?.args;
  const isOurs = Array.isArray(args) && args.some((arg) => typeof arg === 'string' && arg.endsWith('mcp-server.cjs'));
  if (!isOurs) return;
  delete config.mcpServers!['mcp-search'];
  writeFileSync(mcpPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`  Removed MCP server mcp-search from ${mcpPath}`);
}

export function uninstallKimiHooks(): number {
  try {
    removeKimiMcpServer();
  } catch (error) {
    console.error(`Failed to remove the Kimi MCP server: ${(error as Error).message}`);
    return 1;
  }
  const configPath = kimiConfigPath();
  if (!existsSync(configPath)) {
    console.log('  No Kimi config.toml found; nothing to uninstall');
    return 0;
  }
  try {
    const current = readFileSync(configPath, 'utf-8');
    const next = removeManagedBlock(current);
    if (next !== current) {
      writeFileSync(configPath, next);
      console.log('  Removed claude-mem hooks from config.toml');
    } else {
      console.log('  No claude-mem hook block found in config.toml');
    }
    return 0;
  } catch (error) {
    console.error(`Failed to uninstall Kimi hooks: ${(error as Error).message}`);
    return 1;
  }
}

export function checkKimiHooksStatus(): number {
  const configPath = kimiConfigPath();
  const installed = existsSync(configPath) && readFileSync(configPath, 'utf-8').includes(KIMI_MARKER_BEGIN);
  if (installed) {
    console.log(`  Legacy Kimi hook block: detected (${configPath}); active capture is retired`);
    return 0;
  }
  console.log('  Legacy Kimi hook block: not detected; active capture is retired');
  return 1;
}

export async function handleKimiCommand(subcommand: string | undefined, _args: string[]): Promise<number> {
  if (subcommand === 'install' || subcommand === 'setup') {
    try {
      requireMaintainedInstallTarget('kimi');
    } catch (error: unknown) {
      if (!(error instanceof UnsupportedInstallTargetError)) throw error;
      console.error(error.message);
      return 1;
    }
  }
  switch (subcommand) {
    case 'uninstall':
      return uninstallKimiHooks();
    case 'status':
      return checkKimiHooksStatus();
    default:
      console.log('Usage: claude-mem kimi <status|uninstall>');
      return subcommand === undefined || subcommand === 'help' ? 0 : 1;
  }
}
