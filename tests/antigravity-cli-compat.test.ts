// Modified by the claude-mem-marian fork: retired host routes and cleanup contracts. Upstream attribution is retained.
import { describe, it, expect } from 'bun:test';
import { spawnSync } from 'child_process';
import { extractLastMessage } from '../src/shared/transcript-parser.js';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  describeAntigravityHooks,
  removeClaudeMemHooks,
} from '../src/services/integrations/AntigravityCliHooksInstaller.js';

// These assertions lock in the REAL agy 1.2.1 hook contract (issue #4057).
// The prior version of this file asserted the legacy Gemini-CLI event map
// (BeforeTool/AfterTool/BeforeAgent/SessionStart) written into settings.json —
// none of which agy actually fires — so it "passed" while recording zero
// observations. Do not reintroduce those names.


describe('AntigravityCliHooksInstaller - status sees leftover legacy hooks (issue #4196)', () => {
  // Explicit legacy fixture: the named-hook shape an old installer wrote.
  const legacyUnifiedInstall = {
    'claude-mem': {
      SessionStart: [{ command: 'bun worker-service.cjs hook antigravity-cli session-init' }],
      PreInvocation: [{ command: 'bun worker-service.cjs hook antigravity-cli session-init' }],
      PostToolUse: [{ matcher: '*', hooks: [{ command: 'bun worker-service.cjs hook antigravity-cli observation' }] }],
      PostInvocation: [{ command: 'bun worker-service.cjs hook antigravity-cli observation' }],
      Stop: [{ command: 'bun worker-service.cjs hook antigravity-cli summarize' }],
    },
  };

  it('counts legacy claude-mem handlers next to a current install, without touching the config', () => {
    const config = {
      ...legacyUnifiedInstall,
      PreToolUse: [{ matcher: '*', hooks: [{ name: 'claude-mem', command: 'old' }, { name: 'other', command: 'keep' }] }],
      Stop: [{ matcher: '*', hooks: [{ name: 'claude-mem', command: 'old', timeout: 10000 }] }],
    } as unknown as Parameters<typeof describeAntigravityHooks>[0];

    const { installedEvents, legacyHandlerCount, hasStalePreInvocation } = describeAntigravityHooks(config);

    expect(installedEvents).toEqual(['SessionStart', 'PreInvocation', 'PostToolUse', 'PostInvocation', 'Stop']);
    expect(legacyHandlerCount).toBe(2);
    expect(hasStalePreInvocation).toBe(false);
    expect((config as Record<string, any>).PreToolUse[0].hooks).toHaveLength(2);
    expect((config as Record<string, any>).Stop).toHaveLength(1);
  });

  it('flags stale PreInvocation handler in named claude-mem config (issue #4911, #4912)', () => {
    const config = {
      'claude-mem': {
        PreInvocation: [{ command: 'bun worker-service.cjs hook antigravity-cli context' }],
        PostToolUse: [{ matcher: '*', hooks: [{ command: 'bun worker-service.cjs hook antigravity-cli observation' }] }],
      },
    } as unknown as Parameters<typeof describeAntigravityHooks>[0];

    const { installedEvents, legacyHandlerCount, hasStalePreInvocation } = describeAntigravityHooks(config);

    expect(hasStalePreInvocation).toBe(true);
    // The stale context handler is not the session-init mapping, so it isn't installed.
    expect(installedEvents).toEqual(['PostToolUse']);
    expect(legacyHandlerCount).toBe(0);
  });

  it('treats a PreInvocation routed to session-init as current, not stale (#5078)', () => {
    const config = {
      'claude-mem': {
        PreInvocation: [{ command: 'bun worker-service.cjs hook antigravity-cli session-init' }],
      },
    } as unknown as Parameters<typeof describeAntigravityHooks>[0];

    const { installedEvents, hasStalePreInvocation } = describeAntigravityHooks(config);

    expect(hasStalePreInvocation).toBe(false);
    expect(installedEvents).toEqual(['PreInvocation']);
  });

  it("does not count another tool's top-level event arrays as claude-mem leftovers", () => {
    const config = {
      Stop: [{ matcher: '*', hooks: [{ name: 'other', command: './other.sh' }] }],
    } as unknown as Parameters<typeof describeAntigravityHooks>[0];

    expect(describeAntigravityHooks(config)).toEqual({ installedEvents: [], legacyHandlerCount: 0, hasStalePreInvocation: false });
  });
});


describe('platform-source - antigravity-cli support', () => {
  it('normalizes antigravity, agy, and antigravity-cli to antigravity-cli', async () => {
    const { normalizePlatformSource, sortPlatformSources } = await import('../src/shared/platform-source.js');
    expect(normalizePlatformSource('antigravity')).toBe('antigravity-cli');
    expect(normalizePlatformSource('agy')).toBe('antigravity-cli');
    expect(normalizePlatformSource('antigravity-cli')).toBe('antigravity-cli');
    expect(normalizePlatformSource('ANTIGRAVITY')).toBe('antigravity-cli');

    expect(normalizePlatformSource('Antigravity CLI')).toBe('antigravity-cli');

    const sorted = sortPlatformSources(['cursor', 'antigravity-cli', 'codex', 'claude']);
    expect(sorted).toEqual(['claude', 'codex', 'antigravity-cli', 'cursor']);
  });

  it('matches whole tokens only, so unrelated names are left alone', async () => {
    const { normalizePlatformSource } = await import('../src/shared/platform-source.js');
    expect(normalizePlatformSource('legacy-agy-tool')).toBe('legacy-agy-tool');
    expect(normalizePlatformSource('agyle')).toBe('agyle');
  });

  it('gives the source a badge colour in the viewer and on Observation TV', () => {
    const viewer = readFileSync(join(import.meta.dir, '../src/ui/viewer-template.html'), 'utf-8');
    const tv = readFileSync(join(import.meta.dir, '../src/ui/tv.html'), 'utf-8');
    expect(viewer).toContain('.source-antigravity-cli {');
    // Both themes define the badge token: tests/viewer/theme-tokens.test.ts.
    expect(viewer).toContain('var(--color-source-antigravity-cli-text)');
    expect(tv).toContain("'antigravity-cli':");
  });
});


describe('transcript-parser - Antigravity PLANNER_RESPONSE / USER_INPUT nodes', () => {
  function writeTranscript(lines: object[]): string {
    const dir = mkdtempSync(join(tmpdir(), 'agy-parser-'));
    const p = join(dir, 'transcript.jsonl');
    writeFileSync(p, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
    return p;
  }

  it('extracts the last PLANNER_RESPONSE as the assistant message', () => {
    const p = writeTranscript([
      { type: 'USER_INPUT', source: 'USER_EXPLICIT', content: 'hello' },
      { type: 'PLANNER_RESPONSE', source: 'MODEL', content: 'first answer' },
      { type: 'RUN_COMMAND', source: 'MODEL', content: 'ls -la' },
      { type: 'PLANNER_RESPONSE', source: 'MODEL', content: 'final answer' },
    ]);
    expect(extractLastMessage(p, 'assistant')).toBe('final answer');
  });

  it('extracts the last USER_INPUT as the user message', () => {
    const p = writeTranscript([
      { type: 'USER_INPUT', source: 'USER_EXPLICIT', content: 'first request' },
      { type: 'PLANNER_RESPONSE', source: 'MODEL', content: 'ok' },
      { type: 'USER_INPUT', source: 'USER_EXPLICIT', content: 'second request' },
    ]);
    expect(extractLastMessage(p, 'user')).toBe('second request');
  });

  it('does not treat MODEL-sourced tool nodes as assistant text', () => {
    const p = writeTranscript([
      { type: 'PLANNER_RESPONSE', source: 'MODEL', content: 'the real answer' },
      { type: 'VIEW_FILE', source: 'MODEL', content: 'file contents that must be ignored' },
    ]);
    expect(extractLastMessage(p, 'assistant')).toBe('the real answer');
  });
});

// Decision 11: active installation is retired; the approved cleanup contract
// must still remove both MCP files and both tagged context files while keeping
// unrelated settings/hooks/prose. Module paths resolve from homedir() at import,
// so each fixture runs in a spawned process with HOME/USERPROFILE redirected.
describe('Antigravity legacy cleanup fixtures (Decision 11)', () => {
  function runInHome(home: string, call: string) {
    const modulePath = join(import.meta.dir, '..', 'src', 'services', 'integrations', 'AntigravityCliHooksInstaller.ts');
    const script = `const m = await import(${JSON.stringify(modulePath)});\n${call}`;
    return spawnSync(process.execPath, ['-e', script], {
      encoding: 'utf-8',
      cwd: home,
      env: {
        ...process.env,
        HOME: home,
        USERPROFILE: home,
        CLAUDE_MEM_DATA_DIR: join(home, 'data'),
        BUN_RUNTIME_TRANSPILER_CACHE_PATH: '0',
        CLAUDE_MEM_TELEMETRY: '0',
      },
      timeout: 30_000,
    });
  }

  it('removes named and legacy hooks, both MCP entries, and both tagged context blocks, preserving peers', () => {
    const home = mkdtempSync(join(tmpdir(), 'agy-cleanup-'));
    try {
      const gemini = join(home, '.gemini');
      mkdirSync(join(gemini, 'config'), { recursive: true });
      const hooksPath = join(gemini, 'config', 'hooks.json');
      writeFileSync(hooksPath, JSON.stringify({
        'claude-mem': { SessionStart: [{ command: 'bun worker-service.cjs hook antigravity-cli session-init' }] },
        'other-tool': { Stop: [{ command: './other.sh' }] },
      }));
      writeFileSync(join(gemini, 'settings.json'), JSON.stringify({
        hooks: { PreInvocation: [{ hooks: [{ name: 'claude-mem', command: 'old' }, { name: 'peer', command: './peer.sh' }] }] },
        theme: 'dark',
      }));
      for (const mcp of [join(gemini, 'antigravity', 'mcp_config.json'), join(gemini, 'config', 'mcp_config.json')]) {
        mkdirSync(join(mcp, '..'), { recursive: true });
        writeFileSync(mcp, JSON.stringify({ mcpServers: { 'claude-mem': { command: 'node' }, peer: { command: 'peer' } } }));
      }
      writeFileSync(join(gemini, 'GEMINI.md'), 'user prose\n<claude-mem-context>\nstale\n</claude-mem-context>\n');
      const rules = join(home, '.agents', 'rules');
      mkdirSync(rules, { recursive: true });
      writeFileSync(join(rules, 'claude-mem-context.md'), '<claude-mem-context>\nstale\n</claude-mem-context>\n');

      const run = runInHome(home, 'process.exit(m.uninstallAntigravityCliHooks());');
      expect(run.status).toBe(0);

      const hooks = JSON.parse(readFileSync(hooksPath, 'utf-8'));
      expect(hooks['claude-mem']).toBeUndefined();
      expect(hooks['other-tool']).toEqual({ Stop: [{ command: './other.sh' }] });
      const settings = JSON.parse(readFileSync(join(gemini, 'settings.json'), 'utf-8'));
      expect(settings.theme).toBe('dark');
      expect(JSON.stringify(settings)).not.toContain('claude-mem');
      expect(settings.hooks.PreInvocation[0].hooks).toEqual([{ name: 'peer', command: './peer.sh' }]);
      for (const mcp of [join(gemini, 'antigravity', 'mcp_config.json'), join(gemini, 'config', 'mcp_config.json')]) {
        const config = JSON.parse(readFileSync(mcp, 'utf-8'));
        expect(config.mcpServers['claude-mem']).toBeUndefined();
        expect(config.mcpServers.peer).toBeDefined();
      }
      expect(readFileSync(join(gemini, 'GEMINI.md'), 'utf-8')).toContain('user prose');
      expect(readFileSync(join(gemini, 'GEMINI.md'), 'utf-8')).not.toContain('<claude-mem-context>');
      // The tagged block is removed; the file itself may remain (empty).
      const rulesContent = existsSync(join(rules, 'claude-mem-context.md')) ? readFileSync(join(rules, 'claude-mem-context.md'), 'utf-8') : '';
      expect(rulesContent).not.toContain('<claude-mem-context>');

      const again = runInHome(home, 'process.exit(m.uninstallAntigravityCliHooks());');
      expect(again.status).toBe(0);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  it('reports absent state and keeps malformed hooks untouched', () => {
    const home = mkdtempSync(join(tmpdir(), 'agy-cleanup-empty-'));
    try {
      const absent = runInHome(home, 'process.exit(m.checkAntigravityCliHooksStatus());');
      expect(absent.status).toBe(0);
      expect(absent.stdout).toContain('not detected');
      expect(absent.stdout).toContain('Active capture is retired');

      const gemini = join(home, '.gemini');
      mkdirSync(join(gemini, 'config'), { recursive: true });
      const hooksPath = join(gemini, 'config', 'hooks.json');
      writeFileSync(hooksPath, '{ broken');
      const run = runInHome(home, 'process.exit(m.uninstallAntigravityCliHooks());');
      expect(run.status).toBe(0);
      expect(readFileSync(hooksPath, 'utf-8')).toBe('{ broken');
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });
});
