// Modified by the claude-mem-marian fork: only Claude Code and Codex are installation targets. Upstream attribution is retained.
import { execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { IS_WINDOWS } from '../utils/paths.js';

export interface IDEInfo {
  id: string;
  label: string;
  detected: boolean;
  hint?: string;
}

export function initialIDESelection(ides: IDEInfo[]): string[] {
  const detected = ides.filter(ide => ide.detected).map(ide => ide.id);
  return detected.length ? detected : ['claude-code'];
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
  return [
    { id: 'claude-code', label: 'Claude Code', detected: isCommandInPath('claude'), hint: 'recommended' },
    { id: 'codex-cli', label: 'Codex CLI', detected: existsSync(join(homedir(), '.codex')), hint: 'native hooks integration' },
  ];
}
