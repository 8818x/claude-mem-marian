// Modified by the claude-mem-marian fork: retired-host hook refusals extracted to a leaf module so the npx CLI bundle can refuse retired hosts without bundling the hook handler graph (which statically imports bun:sqlite and crashes under Node). Upstream attribution is retained.

export interface RetiredHookOptions {
  skipExit?: boolean;
  stdinSafetyTimeoutMs?: number;
}

export const RETIRED_CURSOR_HOOK_STDOUT = '{"continue":true}\n';
export const RETIRED_CURSOR_HOOK_STDERR = 'claude-mem: Cursor hooks are retired; no event was captured. Use worker-service cursor status or cursor uninstall from the affected workspace.\n';
export const RETIRED_KIMI_HOOK_STDOUT = '{"continue":true}\n';
export const RETIRED_KIMI_HOOK_STDERR = 'claude-mem: Kimi hooks are retired; no event was captured. Use worker-service kimi status or kimi uninstall from the affected workspace.\n';
export const RETIRED_WINDSURF_HOOK_STDOUT = '{"continue":true}\n';
export const RETIRED_WINDSURF_HOOK_STDERR = 'claude-mem: Windsurf hooks are retired; no event was captured. Use npx claude-mem uninstall to review legacy cleanup.\n';
export const RETIRED_ANTIGRAVITY_HOOK_STDOUT = '{"continue":true}\n';
export const RETIRED_ANTIGRAVITY_HOOK_STDERR = 'claude-mem: antigravity-cli hooks are retired; no event was captured. Use npx claude-mem antigravity-cli status|uninstall to inspect or remove legacy configuration.\n';

/**
 * Decision 08 (Cursor active hook retirement): legacy `hook cursor <event>`
 * invocations from old hooks.json entries are acknowledged without capture and
 * without any other side effect — no stdin read, cwd change, settings, logging,
 * telemetry, worker contact, child spawn, storage, or spooling.
 */
export function refuseRetiredCursorHook(options: RetiredHookOptions = {}): number {
  process.stdout.write(RETIRED_CURSOR_HOOK_STDOUT);
  process.stderr.write(RETIRED_CURSOR_HOOK_STDERR);
  if (!options.skipExit) process.exit(0);
  return 0;
}

export function isRetiredCursorHookPlatform(rawPlatform: string): boolean {
  return rawPlatform === 'cursor';
}

export function isRetiredKimiHookPlatform(rawPlatform: string): boolean {
  return rawPlatform === 'kimi';
}

export function refuseRetiredKimiHook(options: RetiredHookOptions = {}): number {
  process.stdout.write(RETIRED_KIMI_HOOK_STDOUT);
  process.stderr.write(RETIRED_KIMI_HOOK_STDERR);
  if (!options.skipExit) process.exit(0);
  return 0;
}

export function isRetiredWindsurfHookPlatform(rawPlatform: string): boolean {
  return rawPlatform === 'windsurf';
}

export function refuseRetiredWindsurfHook(options: RetiredHookOptions = {}): number {
  process.stdout.write(RETIRED_WINDSURF_HOOK_STDOUT);
  process.stderr.write(RETIRED_WINDSURF_HOOK_STDERR);
  if (!options.skipExit) process.exit(0);
  return 0;
}

export function isRetiredAntigravityHookPlatform(rawPlatform: string): boolean {
  return rawPlatform === 'antigravity' || rawPlatform === 'antigravity-cli';
}

export function refuseRetiredAntigravityHook(options: RetiredHookOptions = {}): number {
  process.stdout.write(RETIRED_ANTIGRAVITY_HOOK_STDOUT);
  process.stderr.write(RETIRED_ANTIGRAVITY_HOOK_STDERR);
  if (!options.skipExit) process.exit(0);
  return 0;
}
