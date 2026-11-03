// Modified by the claude-mem-marian fork: only Claude Code and Codex are installation targets. Upstream attribution is retained.
import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { IS_WINDOWS } from '../utils/paths.js';
import {
  MAINTAINED_INSTALL_TARGETS,
  requireMaintainedInstallTarget,
  UnsupportedInstallTargetError,
} from '../../shared/integration-id.js';

export interface IDEInfo {
  id: string;
  label: string;
  detected: boolean;
  hint?: string;
}

export function initialIDESelection(ides: IDEInfo[]): string[] {
  const detected = ides
    .filter((ide) => ide.detected)
    .flatMap((ide) => {
      try {
        return [requireMaintainedInstallTarget(ide.id)];
      } catch (error: unknown) {
        if (!(error instanceof UnsupportedInstallTargetError)) throw error;
        return [];
      }
    });
  return detected.length ? detected : [MAINTAINED_INSTALL_TARGETS[0].id];
}

function isCommandInPath(command: string): boolean {
  try {
    if (IS_WINDOWS) {
      execFileSync('where.exe', [command], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      execFileSync('which', [command], { stdio: 'ignore' });
    }
    return true;
  } catch (error: unknown) {
    if (process.env.DEBUG) {
      console.error(`[ide-detection] ${command} not in PATH:`, error instanceof Error ? error.message : String(error));
    }
    return false;
  }
}

export function detectInstalledIDEs(): IDEInfo[] {
  return MAINTAINED_INSTALL_TARGETS.map(({ id, label }) => ({
    id,
    label,
    detected: id === 'claude-code' ? isCommandInPath('claude') : existsSync(join(homedir(), '.codex')),
    hint: id === 'claude-code' ? 'recommended' : 'native hooks integration',
  }));
}
