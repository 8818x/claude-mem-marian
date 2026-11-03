import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { readCursorRegistry } from '../src/utils/cursor-utils';

// Decision 08: automatic Cursor context updates are retired. The shared summary
// path no longer calls the updater, so registered workspaces keep their legacy
// context files and registry bytes exactly as the user left them — and missing
// context files are never recreated.
describe('Cursor context retirement (no automatic writes)', () => {
  let tempDir: string;
  let workspacePath: string;
  let registryFile: string;
  let contextFile: string;
  const legacyContextBytes = '---\nalwaysApply: true\n---\n\n# Memory Context from Past Sessions\n\nlegacy context\n';

  beforeEach(() => {
    tempDir = join(tmpdir(), `cursor-context-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    workspacePath = join(tempDir, 'my-project');
    registryFile = join(tempDir, 'cursor-projects.json');
    contextFile = join(workspacePath, '.cursor', 'rules', 'claude-mem-context.mdc');
    mkdirSync(join(workspacePath, '.cursor', 'rules'), { recursive: true });
    writeFileSync(contextFile, legacyContextBytes);
    writeFileSync(registryFile, JSON.stringify({
      'my-project': { workspacePath, installedAt: '2026-01-01T00:00:00.000Z' }
    }, null, 2) + '\n');
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('retires the automatic context updater', async () => {
    const mod = await import('../src/services/integrations/CursorHooksInstaller.js');
    expect((mod as Record<string, unknown>).updateCursorContextForProject).toBeUndefined();
  });

  it('leaves an existing registered context file byte-identical through a summary cycle', async () => {
    await import('../src/services/worker/agents/ResponseProcessor.js');

    expect(readFileSync(contextFile, 'utf-8')).toBe(legacyContextBytes);
    expect(readCursorRegistry(registryFile)).toEqual({
      'my-project': { workspacePath, installedAt: '2026-01-01T00:00:00.000Z' }
    });
  });

  it('never recreates a missing context file for a registered workspace', async () => {
    rmSync(contextFile);
    await import('../src/services/worker/agents/ResponseProcessor.js');

    expect(existsSync(contextFile)).toBe(false);
  });
});
