// Modified by the claude-mem-marian fork: Windsurf active hook support is retired (Decision 10); the generic-uninstall cleanup route remains. Upstream attribution is retained.
import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { logger } from '../../utils/logger.js';
import { parseJsonWithBom } from '../../shared/atomic-json.js';
import { DATA_DIR } from '../../shared/paths.js';

interface WindsurfHookEntry {
  command: string;
  show_output: boolean;
  working_directory?: string;
}

interface WindsurfHooksJson {
  hooks: {
    [eventName: string]: WindsurfHookEntry[];
  };
}

interface WindsurfProjectRegistry {
  [workspacePath: string]: {
    installedAt: string;
  };
}

const WINDSURF_HOOKS_DIR = path.join(homedir(), '.codeium', 'windsurf');
const WINDSURF_HOOKS_JSON_PATH = path.join(WINDSURF_HOOKS_DIR, 'hooks.json');

const WINDSURF_REGISTRY_FILE = path.join(DATA_DIR, 'windsurf-projects.json');

const WINDSURF_HOOK_EVENTS = [
  'pre_user_prompt',
  'post_write_code',
  'post_run_command',
  'post_mcp_tool_use',
  'post_cascade_response',
] as const;

export function readWindsurfRegistry(registryFile: string = WINDSURF_REGISTRY_FILE): WindsurfProjectRegistry {
  try {
    if (!existsSync(registryFile)) return {};
    return JSON.parse(readFileSync(registryFile, 'utf-8'));
  } catch (error) {
    if (error instanceof Error) {
      logger.error('WORKER', 'Failed to read registry, using empty', { file: registryFile }, error);
    } else {
      logger.error('WORKER', 'Failed to read registry, using empty', { file: registryFile }, new Error(String(error)));
    }
    return {};
  }
}

export function writeWindsurfRegistry(registry: WindsurfProjectRegistry, registryFile: string = WINDSURF_REGISTRY_FILE): void {
  const dir = path.dirname(registryFile);
  mkdirSync(dir, { recursive: true });
  writeFileSync(registryFile, JSON.stringify(registry, null, 2));
}

export function unregisterWindsurfProject(workspacePath: string, registryFile: string = WINDSURF_REGISTRY_FILE): void {
  const registry = readWindsurfRegistry(registryFile);
  if (registry[workspacePath]) {
    delete registry[workspacePath];
    writeWindsurfRegistry(registry, registryFile);
    logger.info('WINDSURF', 'Unregistered project', { workspacePath });
  }
}

export function uninstallWindsurfHooks(options: { workspaceRoots?: readonly string[]; hooksPath?: string; registryPath?: string } = {}): number {
  console.log('\nUninstalling Claude-Mem Windsurf hooks...\n');

  const hooksPath = options.hooksPath === undefined ? WINDSURF_HOOKS_JSON_PATH : options.hooksPath;
  const registryPath = options.registryPath === undefined ? WINDSURF_REGISTRY_FILE : options.registryPath;
  if (existsSync(hooksPath)) {
    try {
      removeClaudeMemHookEntries(hooksPath);
    } catch (error) {
      if (error instanceof Error) {
        logger.error('WORKER', 'Could not parse hooks.json during uninstall', { path: hooksPath }, error);
      } else {
        logger.error('WORKER', 'Could not parse hooks.json during uninstall', { path: hooksPath }, new Error(String(error)));
      }
      console.log(`  Warning: could not parse hooks.json — leaving file intact to preserve other hooks`);
    }
  } else {
    console.log(`  No hooks.json found`);
  }

  const workspaceRoots = options.workspaceRoots ?? [process.cwd()];

  try {
    for (const workspaceRoot of workspaceRoots) removeWindsurfContextAndUnregister(workspaceRoot, registryPath);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\nUninstallation failed: ${message}`);
    return 1;
  }
}

function removeClaudeMemHookEntries(hooksPath: string = WINDSURF_HOOKS_JSON_PATH): void {
  const parsed = parseJsonWithBom<Partial<WindsurfHooksJson>>(readFileSync(hooksPath, 'utf-8'));
  const config = { ...parsed, hooks: parsed.hooks ?? {} } as WindsurfHooksJson & Record<string, unknown>;
  let removedCount = 0;

  for (const eventName of WINDSURF_HOOK_EVENTS) {
    const eventHooks = config.hooks[eventName] ?? [];
    if (eventHooks.length > 0) {
      config.hooks[eventName] = eventHooks.filter((hook) => {
        const keep = !hook.command.includes('worker-service') || !hook.command.includes('windsurf');
        if (!keep) removedCount += 1;
        return keep;
      });
      if (config.hooks[eventName].length === 0) {
        delete config.hooks[eventName];
      }
    }
  }

  if (removedCount === 0) return;

  if (Object.keys(config.hooks).length === 0) {
    const { hooks: _hooks, ...otherConfig } = config;
    if (Object.keys(otherConfig).length === 0) {
      unlinkSync(hooksPath);
    } else {
      writeFileSync(hooksPath, JSON.stringify(otherConfig, null, 2));
    }
    console.log(`  Removed hooks.json (no hooks remaining)`);
  } else {
    writeFileSync(hooksPath, JSON.stringify(config, null, 2));
    console.log(`  Removed claude-mem entries from hooks.json (other hooks preserved)`);
  }
}

function removeWindsurfContextAndUnregister(workspaceRoot: string, registryFile: string = WINDSURF_REGISTRY_FILE): void {
  const contextFile = path.join(workspaceRoot, '.windsurf', 'rules', 'claude-mem-context.md');
  if (existsSync(contextFile)) {
    unlinkSync(contextFile);
    console.log(`  Removed context file`);
  }

  unregisterWindsurfProject(workspaceRoot, registryFile);
  console.log(`  Unregistered from auto-context updates`);

  console.log(`\nUninstallation complete!\n`);
  console.log('Restart Windsurf to apply changes.');
}
