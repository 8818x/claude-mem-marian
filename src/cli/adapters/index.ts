// Modified by the claude-mem-marian fork: retired host adapters are reserved tokens and never fall through to the raw adapter. Upstream attribution is retained.
import type { PlatformAdapter } from '../types.js';
import { claudeCodeAdapter } from './claude-code.js';
import { codexAdapter } from './codex.js';
import { rawAdapter } from './raw.js';

export function getPlatformAdapter(platform: string): PlatformAdapter {
  switch (platform) {
    case 'claude':
    case 'claude-code': return claudeCodeAdapter;
    case 'codex': return codexAdapter;
    // Decision 08 / 09 / 10: the Cursor, Kimi, and Windsurf adapters are
    // retired. The tokens stay reserved so stale hook entries can never
    // silently fall through to the raw adapter.
    case 'cursor': throw new Error('claude-mem: Cursor hooks are retired; the cursor adapter no longer exists.');
    case 'kimi': throw new Error('claude-mem: Kimi hooks are retired; the kimi adapter no longer exists.');
    case 'windsurf': throw new Error('claude-mem: Windsurf hooks are retired; the windsurf adapter no longer exists.');
    case 'antigravity': throw new Error('claude-mem: antigravity-cli hooks are retired; the antigravity adapter no longer exists.');
    case 'antigravity-cli': throw new Error('claude-mem: antigravity-cli hooks are retired; the antigravity-cli adapter no longer exists.');
    case 'raw': return rawAdapter;
    default: return rawAdapter;
  }
}

export { claudeCodeAdapter, codexAdapter, rawAdapter };
