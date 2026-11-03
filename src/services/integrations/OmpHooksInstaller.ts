// Modified by the claude-mem-marian fork: the OMP hook installer is retired; legacy uninstall cleanup and status remain available. Upstream attribution is retained.

import path from 'path';
import { homedir } from 'os';
import { existsSync, rmSync } from 'fs';

/**
 * OMP (Oh My Pi) legacy hook cleanup and status.
 *
 * The OMP hook installer is retired. No installation path ships or resolves
 * `omp/hooks/claude-mem.ts` anymore. This module remains for legacy users:
 * the generic uninstaller (src/npx-cli/commands/uninstall-targets.ts)
 * detects the user-global pre-hook file and removes exactly that file, and
 * the status helper reports whether the hook file is present.
 *
 * The hook target is `<agentDir>/hooks/pre/claude-mem.ts`, where agentDir
 * honours PI_CODING_AGENT_DIR and defaults to ~/.omp/agent. A missing file
 * is a successful no-op; cleanup preserves sibling hooks and parent
 * directories.
 */

const OMP_HOOK_FILENAME = 'claude-mem.ts';

/** OMP's user hook dir: `<agentDir>/hooks/pre`, where agentDir honours
 *  PI_CODING_AGENT_DIR (oh-my-pi docs/hooks.md) and defaults to ~/.omp/agent.
 *  Resolved per call so the environment at install time decides. */
function ompHooksPreDir(): string {
  const agentDir = process.env.PI_CODING_AGENT_DIR || path.join(homedir(), '.omp', 'agent');
  return path.join(agentDir, 'hooks', 'pre');
}

function ompHookDestination(): string {
  return path.join(ompHooksPreDir(), OMP_HOOK_FILENAME);
}

export function uninstallOmpHooks(): number {
  const destination = ompHookDestination();
  if (!existsSync(destination)) {
    console.log('  OMP hook not installed; nothing to remove.');
    return 0;
  }
  try {
    rmSync(destination, { force: true });
    console.log(`  Removed OMP hook: ${destination}`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to remove OMP hook: ${message}`);
    return 1;
  }
}

export function checkOmpStatus(): number {
  console.log('\nClaude-Mem OMP Integration Status\n');
  const hooksDir = ompHooksPreDir();
  const destination = ompHookDestination();
  console.log(`Hooks directory: ${hooksDir}`);
  console.log(`  Exists: ${existsSync(hooksDir) ? 'yes' : 'no'}`);
  console.log(`Hook file: ${destination}`);
  console.log(`  Installed: ${existsSync(destination) ? 'yes' : 'no'}`);
  console.log('');
  return 0;
}
