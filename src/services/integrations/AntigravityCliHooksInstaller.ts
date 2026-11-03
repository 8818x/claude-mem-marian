
// Modified by the claude-mem-marian fork: Antigravity CLI active hooks are retired (Decision 11); install/setup reject before writes, and legacy status/uninstall cleanup remains. Upstream attribution is retained.
import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { requireMaintainedInstallTarget, UnsupportedInstallTargetError } from '../../shared/integration-id.js';
import { logger } from '../../utils/logger.js';
import { readJsonSafe } from '../../utils/json-utils.js';

// agy hook schema (builtin `agy-customizations/docs/hooks.md`): each top-level
// key of hooks.json is a hook NAME, mapping to an object of event keys. Only
// PreToolUse/PostToolUse use the grouped { matcher, hooks } shape; the remaining
// events are flat arrays of handlers. Handlers carry type/command/timeout only
// (no per-handler `name`; `timeout` is seconds).
interface AntigravityHookHandler {
  type?: 'command';
  command: string;
  timeout?: number;
}

interface AntigravityHookGroup {
  matcher: string;
  hooks: AntigravityHookHandler[];
}

interface AntigravityNamedHook {
  enabled?: boolean;
  SessionStart?: AntigravityHookHandler[];
  PreToolUse?: AntigravityHookGroup[];
  PostToolUse?: AntigravityHookGroup[];
  PreInvocation?: AntigravityHookHandler[];
  PostInvocation?: AntigravityHookHandler[];
  Stop?: AntigravityHookHandler[];
}

interface AntigravityHooksConfig {
  [hookName: string]: AntigravityNamedHook;
}

// Legacy shape written by pre-#4196 installers: top-level keys are EVENT names,
// every event is wrapped in a {matcher, hooks} group, and the hook is identified
// by a handler-level `name`. Retained only so merge/uninstall can migrate it.
interface LegacyAntigravityHookEntry {
  name?: string;
  type?: string;
  command: string;
  timeout?: number;
}

interface LegacyAntigravityHookGroup {
  matcher?: string;
  hooks: LegacyAntigravityHookEntry[];
}

interface AntigravitySettingsJson {
  hooks?: Record<string, LegacyAntigravityHookGroup[]>;
  [key: string]: unknown;
}

// Antigravity CLI (`agy`) shares Gemini CLI's `~/.gemini/` config tree for
// context (GEMINI.md) and MCP, but — contrary to an earlier assumption — it
// does NOT read lifecycle hooks from `settings.json`. Confirmed against
// `agy` 1.2.1 (issue #4057, #4911): the CLI loads hook definitions from a dedicated
// `hooks.json` and fires lifecycle events including `SessionStart`, `PreToolUse`,
// `PostToolUse`, `PreInvocation`, `PostInvocation`, and `Stop` (the Gemini-CLI
// `BeforeTool` / `AfterTool` / `BeforeAgent` settings.json names do not exist
// in the binary, so hooks written under those keys in settings.json never execute).
const GEMINI_CONFIG_DIR = path.join(homedir(), '.gemini');
// Legacy path — retained ONLY so uninstall can strip hooks written by prior
// (pre-#4057) versions that mistakenly registered them here. New installs
// never write hooks to settings.json.
const GEMINI_SETTINGS_PATH = path.join(GEMINI_CONFIG_DIR, 'settings.json');
// The hooks file `agy` actually loads (issue #4057). Lives alongside the
// already-used `~/.gemini/config/mcp_config.json`.
const GEMINI_HOOKS_CONFIG_PATH = path.join(GEMINI_CONFIG_DIR, 'config', 'hooks.json');
const GEMINI_MD_PATH = path.join(GEMINI_CONFIG_DIR, 'GEMINI.md');

// B0 found two real, genuinely ambiguous MCP config paths on a live machine —
// one already populated (old path), one present but empty (newer path per
// third-party docs). Dual-write to both until Phase C's hands-on gate
// resolves which one `agy` actually reads.
const ANTIGRAVITY_MCP_CONFIG_PATHS = [
  path.join(GEMINI_CONFIG_DIR, 'antigravity', 'mcp_config.json'),
  path.join(GEMINI_CONFIG_DIR, 'config', 'mcp_config.json'),
];

// Plural "agents", home-relative — confirmed real and populated in B0 at
// ~/.agents/rules/. The prior MCP-only ANTIGRAVITY_CONFIG used process.cwd()
// instead, which a live install test (Phase C) proved wrong: it writes into
// whatever directory the installer happens to run from rather than the
// user's actual global rules directory.
const RULES_CONTEXT_PATH = path.join(homedir(), '.agents', 'rules', 'claude-mem-context.md');

const HOOK_NAME = 'claude-mem';

// The 5 hook events claude-mem registers in `agy`, mapped to its internal handlers:
//   - SessionStart   → context     (inject startup memory once when a session starts;
//                                    prevents invalidating LLM prefix cache on every
//                                    turn/invocation, issue #4911)
//   - PreInvocation  → session-init (agy has no prompt-submit hook. Records the
//                                    prompt on the first model call of a user turn
//                                    only; a follow-up call after a tool step gets
//                                    file-context for the files that step read.
//                                    See runAntigravityPreInvocation, #5078)
//   - PostToolUse    → observation (records the tool result)
//   - PostInvocation → observation (records the assistant response, pulled from
//                                    the transcript's PLANNER_RESPONSE node)
//   - Stop           → summarize   (session/turn end → summary)
// PreToolUse is not registered. A PreToolUse hook must answer with a decision,
// and agy treats "allow" as auto-approval, so a `*`-matched observation hook
// there skipped agy's own permission prompt for every tool and recorded each
// call twice (#5078). Observations come from PostToolUse, as on Claude Code.
// Note: SessionStart is the official agy lifecycle event for startup context injection
// (builtin `agy-customizations/docs/hooks.md`). Mapping PreInvocation to context
// injected the memory timeline into every model call, destroying prefix cache hit
// rates (#4911). PreInvocation → session-init doesn't bring that back: it injects
// nothing on most calls. It injects only (a) file-context after a tool step read a
// file with history, deduped per session and file, so a file's timeline is injected
// once until a newer observation lands, and (b) semantic context on a new user turn
// when CLAUDE_MEM_SEMANTIC_INJECT is on (default off).
// Legacy Gemini-CLI names (BeforeAgent/AfterAgent/BeforeTool/AfterTool/Notification/
// PreCompress) are not present in agy.
const ANTIGRAVITY_EVENT_TO_INTERNAL_EVENT: Record<string, string> = {
  'SessionStart': 'context',
  'PreInvocation': 'session-init',
  'PostToolUse': 'observation',
  'PostInvocation': 'observation',
  'Stop': 'summarize',
};





function readAntigravitySettings(): AntigravitySettingsJson {
  if (!existsSync(GEMINI_SETTINGS_PATH)) {
    return {};
  }

  const content = readFileSync(GEMINI_SETTINGS_PATH, 'utf-8');
  try {
    return JSON.parse(content) as AntigravitySettingsJson;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('WORKER', 'Corrupt JSON in Antigravity CLI (shared Gemini) settings', { path: GEMINI_SETTINGS_PATH }, error);
    } else {
      logger.error('WORKER', 'Corrupt JSON in Antigravity CLI (shared Gemini) settings', { path: GEMINI_SETTINGS_PATH }, new Error(String(error)));
    }
    throw new Error(`Corrupt JSON in ${GEMINI_SETTINGS_PATH}, refusing to overwrite user settings`);
  }
}

function writeAntigravitySettings(settings: AntigravitySettingsJson): void {
  mkdirSync(GEMINI_CONFIG_DIR, { recursive: true });
  writeFileSync(GEMINI_SETTINGS_PATH, JSON.stringify(settings, null, 2) + '\n');
}

// Read the standalone `hooks.json` agy loads. Returns the whole file (named
// hooks → event config). Empty/missing file → {}. Genuinely corrupt (non-empty,
// unparseable) content throws so we never clobber a user's hand-edited hooks.
// The on-disk value may still be the legacy event-keyed shape; callers migrate
// or strip that via stripLegacyEventHooks().
function readAntigravityHooksConfig(): AntigravityHooksConfig {
  if (!existsSync(GEMINI_HOOKS_CONFIG_PATH)) {
    return {};
  }
  const content = readFileSync(GEMINI_HOOKS_CONFIG_PATH, 'utf-8');
  if (!content.trim()) {
    return {};
  }
  try {
    return JSON.parse(content) as AntigravityHooksConfig;
  } catch (error) {
    logger.error(
      'WORKER',
      'Corrupt JSON in Antigravity CLI hooks config',
      { path: GEMINI_HOOKS_CONFIG_PATH },
      error instanceof Error ? error : new Error(String(error)),
    );
    throw new Error(`Corrupt JSON in ${GEMINI_HOOKS_CONFIG_PATH}, refusing to overwrite user hooks`);
  }
}

function writeAntigravityHooksConfig(hooksConfig: AntigravityHooksConfig): void {
  mkdirSync(path.dirname(GEMINI_HOOKS_CONFIG_PATH), { recursive: true });
  writeFileSync(GEMINI_HOOKS_CONFIG_PATH, JSON.stringify(hooksConfig, null, 2) + '\n');
}


// Remove entries written by the pre-#4196 event-keyed layout (top-level keys are
// event names, handlers carry `name: 'claude-mem'`). Returns the number of
// handlers removed. The new layout never has arrays at the top level, so an
// Array value is unambiguously legacy.
export function stripLegacyEventHooks(config: AntigravityHooksConfig): number {
  const loose = config as unknown as Record<string, unknown>;
  let removed = 0;

  for (const [eventName, value] of Object.entries(loose)) {
    if (!Array.isArray(value)) continue;

    const filteredGroups = (value as LegacyAntigravityHookGroup[])
      .map(group => {
        if (!group || !Array.isArray(group.hooks)) return group;
        const remainingHooks = group.hooks.filter(hook => hook?.name !== HOOK_NAME);
        removed += group.hooks.length - remainingHooks.length;
        return { ...group, hooks: remainingHooks };
      })
      .filter(group => !group || !Array.isArray(group.hooks) || group.hooks.length > 0);

    if (filteredGroups.length > 0) {
      loose[eventName] = filteredGroups;
    } else {
      delete loose[eventName];
    }
  }

  return removed;
}








// Same empty-file tolerance as seedEmptyMcpConfigFile above, for read paths
// (status check + uninstall) that don't go through writeMcpJsonConfig. A
// genuinely empty file has nothing to lose; readJsonSafe's "corrupt" guard
// stays fully intact for real (non-empty) malformed content.
function readMcpConfigTolerantly(mcpConfigPath: string): Record<string, any> {
  if (!existsSync(mcpConfigPath)) return {};
  if (readFileSync(mcpConfigPath, 'utf-8').trim() === '') return {};
  return readJsonSafe<Record<string, any>>(mcpConfigPath, {});
}

function removeClaudeMemFromMcpConfig(mcpConfigPath: string): boolean {
  if (!existsSync(mcpConfigPath)) return false;

  const config = readMcpConfigTolerantly(mcpConfigPath);
  if (!config.mcpServers || !('claude-mem' in config.mcpServers)) {
    return false;
  }

  delete config.mcpServers['claude-mem'];
  writeFileSync(mcpConfigPath, JSON.stringify(config, null, 2) + '\n');
  return true;
}

function removeContextTagBlock(filePath: string): boolean {
  if (!existsSync(filePath)) return false;

  let content = readFileSync(filePath, 'utf-8');
  const contextRegex = /\n?<claude-mem-context>[\s\S]*?<\/claude-mem-context>\n?/;
  if (!contextRegex.test(content)) return false;

  content = content.replace(contextRegex, '');
  writeFileSync(filePath, content);
  return true;
}

export function uninstallAntigravityCliHooks(): number {
  console.log('\nUninstalling Claude-Mem Antigravity CLI hooks + MCP...\n');

  try {
    removeAntigravityHooksFromHooksConfig();

    // Legacy cleanup: strip hooks that pre-#4057 versions wrote into
    // settings.json (agy never read them, but leave the user's file tidy).
    if (existsSync(GEMINI_SETTINGS_PATH)) {
      removeAntigravityHooksFromSettings();
    }

    if (removeContextTagBlock(GEMINI_MD_PATH)) {
      console.log(`  Removed context section from ${GEMINI_MD_PATH}`);
    }

    for (const mcpConfigPath of ANTIGRAVITY_MCP_CONFIG_PATHS) {
      const removed = removeClaudeMemFromMcpConfig(mcpConfigPath);
      if (removed) {
        console.log(`  Removed claude-mem entry from ${mcpConfigPath}`);
      }
    }

    if (removeContextTagBlock(RULES_CONTEXT_PATH)) {
      console.log(`  Removed context section from ${RULES_CONTEXT_PATH}`);
    }

    console.log('\nUninstallation complete!\n');
    console.log('Restart Antigravity CLI (agy) to apply changes.');
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\nUninstallation failed: ${message}`);
    return 1;
  }
}

function removeAntigravityHooksFromHooksConfig(): void {
  if (!existsSync(GEMINI_HOOKS_CONFIG_PATH)) {
    console.log('  No Antigravity CLI hooks.json found — nothing to uninstall.');
    return;
  }

  let config: AntigravityHooksConfig;
  try {
    config = readAntigravityHooksConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  Skipping hooks.json cleanup: ${message}`);
    return;
  }

  const { config: cleanedConfig, removed: removedCount } = removeClaudeMemHooks(config);
  if (removedCount === 0 && JSON.stringify(cleanedConfig) === JSON.stringify(config)) return;
  writeAntigravityHooksConfig(cleanedConfig);
  console.log(`  Removed ${removedCount} claude-mem hook(s) from ${GEMINI_HOOKS_CONFIG_PATH}`);
}

function removeAntigravityHooksFromSettings(): void {
  const settings = readAntigravitySettings();
  if (!settings.hooks) {
    return;
  }

  let removedCount = 0;

  for (const [eventName, groups] of Object.entries(settings.hooks)) {
    const filteredGroups = groups
      .map(group => {
        const remainingHooks = group.hooks.filter(hook => hook.name !== HOOK_NAME);
        removedCount += group.hooks.length - remainingHooks.length;
        return { ...group, hooks: remainingHooks };
      })
      .filter(group => group.hooks.length > 0);

    if (filteredGroups.length > 0) {
      settings.hooks[eventName] = filteredGroups;
    } else {
      delete settings.hooks[eventName];
    }
  }

  if (Object.keys(settings.hooks).length === 0) {
    delete settings.hooks;
  }

  if (removedCount > 0) {
    writeAntigravitySettings(settings);
    console.log(`  Removed ${removedCount} claude-mem hook(s) from ${GEMINI_SETTINGS_PATH}`);
  }
}

// Count the underlying handler objects in a named hook (used for the uninstall
// summary so grouped and flat events are both counted). Every event on the hook
// is counted, since uninstall removes the whole hook, including the PreToolUse
// entry an older install left there (#5078).
function countNamedHookHandlers(namedHook: AntigravityNamedHook): number {
  let count = 0;

  for (const event of Object.keys(namedHook)) {
    const value = (namedHook as Record<string, unknown>)[event];
    if (!Array.isArray(value)) continue;

    for (const item of value) {
      const grouped = item as AntigravityHookGroup;
      if (grouped && Array.isArray(grouped.hooks)) {
        count += grouped.hooks.length;
      } else {
        count += 1;
      }
    }
  }

  return count;
}

// Remove every claude-mem trace from hooks.json — the named `claude-mem` hook
// plus any legacy event-keyed entries — while preserving other hooks/handlers.
// Exported for tests (issue #4196).
export function removeClaudeMemHooks(
  config: AntigravityHooksConfig,
): { config: AntigravityHooksConfig; removed: number } {
  const result: AntigravityHooksConfig = { ...config };
  let removed = 0;

  const namedHook = result[HOOK_NAME];
  if (namedHook && typeof namedHook === 'object' && !Array.isArray(namedHook)) {
    removed += countNamedHookHandlers(namedHook);
    delete result[HOOK_NAME];
  }

  removed += stripLegacyEventHooks(result);

  return { config: result, removed };
}

// What `status` reports for a hooks.json: the events the named `claude-mem`
// hook covers, how many claude-mem handlers a pre-#4196 install left under
// top-level event keys, and whether a stale pre-#4911 PreInvocation handler
// remains registered. Other tools' entries there are not counted, because
// re-running install only migrates claude-mem's. Exported for tests (#4196, #4911).
export function describeAntigravityHooks(
  config: AntigravityHooksConfig,
): { installedEvents: string[]; legacyHandlerCount: number; hasStalePreInvocation: boolean } {
  const installedEvents: string[] = [];
  let hasStalePreInvocation = false;
  const namedHook = config[HOOK_NAME];
  if (namedHook && typeof namedHook === 'object' && !Array.isArray(namedHook)) {
    // PreInvocation is current when it routes to session-init; only the
    // pre-#4911 handler that routed it to `context` is stale, and that one is
    // not the mapped event, so it isn't listed as installed.
    const preInvocation = (namedHook as Record<string, unknown>)['PreInvocation'];
    if (
      Array.isArray(preInvocation) &&
      preInvocation.some((h: any) => typeof h?.command === 'string' && /\bcontext\s*$/.test(h.command))
    ) {
      hasStalePreInvocation = true;
    }

    for (const event of Object.keys(ANTIGRAVITY_EVENT_TO_INTERNAL_EVENT)) {
      if (event === 'PreInvocation' && hasStalePreInvocation) continue;
      const value = (namedHook as Record<string, unknown>)[event];
      if (Array.isArray(value) && value.length > 0) {
        installedEvents.push(event);
      }
    }
  }

  // stripLegacyEventHooks replaces top-level keys on the copy only.
  const legacyHandlerCount = stripLegacyEventHooks({ ...config });
  return { installedEvents, legacyHandlerCount, hasStalePreInvocation };
}

export function checkAntigravityCliHooksStatus(): number {
  console.log('\nClaude-Mem Antigravity CLI Status\n');

  if (!existsSync(GEMINI_HOOKS_CONFIG_PATH)) {
    console.log('Antigravity CLI legacy hooks.json: not detected');
    console.log(`  Expected at: ${GEMINI_HOOKS_CONFIG_PATH}\n`);
    console.log('No legacy claude-mem hooks detected. Active capture is retired; new installations are not supported.');
    return 0;
  }

  let hooksConfig: AntigravityHooksConfig;
  try {
    hooksConfig = readAntigravityHooksConfig();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('WORKER', 'Failed to read Antigravity CLI hooks config', { path: GEMINI_HOOKS_CONFIG_PATH }, error instanceof Error ? error : new Error(String(error)));
    console.log(`Antigravity CLI hooks.json: ${message}\n`);
    return 0;
  }

  const { installedEvents, legacyHandlerCount, hasStalePreInvocation } = describeAntigravityHooks(hooksConfig);

  if (installedEvents.length === 0 && !hasStalePreInvocation) {
    console.log('Legacy claude-mem hooks: not detected');
    console.log('Active capture is retired; new installations are not supported.');
  } else {
    console.log(`Hooks config: ${GEMINI_HOOKS_CONFIG_PATH}`);
    console.log(`Detected legacy configuration: unified CLI (bun worker-service.cjs hook antigravity-cli); active capture is retired`);
    console.log(`Events: ${installedEvents.length} of ${Object.keys(ANTIGRAVITY_EVENT_TO_INTERNAL_EVENT).length} mapped`);
    for (const event of installedEvents) {
      const internalEvent = ANTIGRAVITY_EVENT_TO_INTERNAL_EVENT[event] ?? 'unknown';
      console.log(`  ${event} → ${internalEvent}`);
    }
  }

  // A pre-#4911 install leaves a named PreInvocation handler that injects context
  // on every invocation, busting prefix cache. Warn the user to migrate.
  if (hasStalePreInvocation) {
    console.log('Stale hooks: legacy PreInvocation context handler found (pre-#4911 configuration shape); active capture is retired.');
    console.log('Automatic hook migration is unavailable; existing configuration was left unchanged.\n');
  }

  // A pre-#4196 install leaves claude-mem under top-level event keys, which agy
  // ignores. Point at the migration whenever any are left, including next to a
  // current install.
  if (legacyHandlerCount > 0) {
    console.log(`Legacy hooks: ${legacyHandlerCount} pre-#4196 event-keyed claude-mem hook(s) found. Existing configuration was left unchanged.\n`);
  }

  if (existsSync(GEMINI_MD_PATH)) {
    const mdContent = readFileSync(GEMINI_MD_PATH, 'utf-8');
    if (mdContent.includes('<claude-mem-context>')) {
      console.log(`Context (GEMINI.md): legacy claude-mem section present (${GEMINI_MD_PATH}); automatic updates are retired`);
    } else {
      console.log('Context (GEMINI.md): exists but missing claude-mem section');
    }
  } else {
    console.log('Context (GEMINI.md): No GEMINI.md found');
  }

  console.log('');
  for (const mcpConfigPath of ANTIGRAVITY_MCP_CONFIG_PATHS) {
    if (!existsSync(mcpConfigPath)) {
      console.log(`MCP config (${mcpConfigPath}): Not found`);
      continue;
    }
    const config = readMcpConfigTolerantly(mcpConfigPath);
    const hasEntry = Boolean(config.mcpServers?.['claude-mem']);
    console.log(`MCP config (${mcpConfigPath}): ${hasEntry ? 'legacy claude-mem entry present' : 'found, but no claude-mem entry'}`);
  }

  console.log('');
  return 0;
}

export async function handleAntigravityCliCommand(subcommand: string | undefined, _args: string[]): Promise<number> {
  if (subcommand === 'install' || subcommand === 'setup') {
    try {
      requireMaintainedInstallTarget('antigravity-cli');
    } catch (error: unknown) {
      if (!(error instanceof UnsupportedInstallTargetError)) throw error;
      console.error(error.message);
      return 1;
    }
  }
  switch (subcommand) {
    case 'uninstall':
      return uninstallAntigravityCliHooks();

    case 'status':
      return checkAntigravityCliHooksStatus();

    default:
      console.log(`
Claude-Mem Antigravity CLI Integration

Usage: claude-mem antigravity-cli <status|uninstall>

Commands:
  uninstall           Remove legacy claude-mem hooks/MCP entries (preserves other config)
  status              Detect legacy artifacts; active capture is retired

Examples:
  npx claude-mem antigravity-cli status      # Inspect legacy configuration
  npx claude-mem antigravity-cli uninstall   # Remove legacy hooks + MCP

For more info: https://docs.claude-mem.ai/antigravity-cli/setup
      `);
      return 0;
  }
}
