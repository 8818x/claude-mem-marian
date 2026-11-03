// Modified by the claude-mem-marian fork. Upstream attribution is retained.
// Cleanup-contract coverage migrated from the retired OpenCode installer suites
// (Task 21): plugin/MCP ownership, AGENTS.md block cleanup, missing/malformed/repeated.
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  deregisterOpenCodePluginFromConfig,
  getOpenCodeAgentsMdPath,
  getOpenCodeConfigPath,
  removeOpenCodeMcpReference,
  removeOpenCodePluginReference,
  uninstallOpenCodePlugin,
} from '../../src/services/integrations/OpenCodeInstaller.js';

const tempDirs: string[] = [];

function fixtureDir(): string {
  const directory = join(tmpdir(), `opencode-cleanup-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(directory, { recursive: true });
  tempDirs.push(directory);
  return directory;
}

let previousConfigDir: string | undefined;

beforeEach(() => {
  previousConfigDir = process.env.OPENCODE_CONFIG_DIR;
  process.env.OPENCODE_CONFIG_DIR = fixtureDir();
});

afterEach(() => {
  if (previousConfigDir === undefined) delete process.env.OPENCODE_CONFIG_DIR;
  else process.env.OPENCODE_CONFIG_DIR = previousConfigDir;
  for (const directory of tempDirs.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('OpenCode config cleanup ownership', () => {
  it('removes only claude-mem from plugin entries and keeps other keys', () => {
    const config = removeOpenCodePluginReference({
      plugin: ['context-mode', './plugins/claude-mem.js'],
      plugins: ['other', './plugins/claude-mem.js'],
      provider: { openai: { models: {} } },
    });

    expect(config.plugin).toEqual(['context-mode']);
    expect(config.plugins).toEqual(['other']);
    expect(config.provider).toEqual({ openai: { models: {} } });
  });

  it('removes the plugin and MCP references from opencode.json during deregistration', () => {
    writeFileSync(getOpenCodeConfigPath(), JSON.stringify({
      $schema: 'https://opencode.ai/config.json',
      plugin: ['context-mode', './plugins/claude-mem.js'],
      mcp: { 'claude-mem': { type: 'local', command: ['node', '/x/mcp-server.cjs'] }, context7: { enabled: true } },
    }), 'utf-8');

    expect(deregisterOpenCodePluginFromConfig()).toBe(0);
    const config = JSON.parse(readFileSync(getOpenCodeConfigPath(), 'utf-8'));
    expect(config.plugin).toEqual(['context-mode']);
    expect(config.mcp).toEqual({ context7: { enabled: true } });
  });

  it('drops the mcp block when the removal leaves it empty', () => {
    const config = removeOpenCodeMcpReference({
      plugin: ['./plugins/claude-mem.js'],
      mcp: { 'claude-mem': { type: 'local', command: ['node', '/x/mcp-server.cjs'] } },
    });

    expect('mcp' in config).toBe(false);
  });

  it('is a visible failure on a malformed opencode.json and stays stable on repeated cleanup', () => {
    writeFileSync(getOpenCodeConfigPath(), '{ broken json', 'utf-8');
    expect(deregisterOpenCodePluginFromConfig()).toBe(1);

    writeFileSync(getOpenCodeConfigPath(), JSON.stringify({
      $schema: 'https://opencode.ai/config.json',
      provider: { openai: { models: {} } },
    }), 'utf-8');
    expect(deregisterOpenCodePluginFromConfig()).toBe(0);
    expect(deregisterOpenCodePluginFromConfig()).toBe(0);
    const config = JSON.parse(readFileSync(getOpenCodeConfigPath(), 'utf-8'));
    expect(config.provider).toEqual({ openai: { models: {} } });
  });
});

describe('OpenCode global AGENTS.md cleanup', () => {
  it("strips the block an older install wrote and keeps the user's own instructions", () => {
    writeFileSync(
      getOpenCodeAgentsMdPath(),
      '# My rules\n\nAlways run the tests.\n\n<claude-mem-context>\n# Memory Context from Past Sessions\n\nstale memory\n</claude-mem-context>\n',
      'utf-8',
    );

    expect(uninstallOpenCodePlugin()).toBe(0);

    const agentsMd = readFileSync(getOpenCodeAgentsMdPath(), 'utf-8');
    expect(agentsMd).toContain('# My rules');
    expect(agentsMd).toContain('Always run the tests.');
    expect(agentsMd).not.toContain('claude-mem-context');
    expect(agentsMd).not.toContain('stale memory');
  });

  it('strips only the old block when the user text mentions a closing tag before it', () => {
    writeFileSync(
      getOpenCodeAgentsMdPath(),
      '# My rules\n\nNever edit the </claude-mem-context> tag by hand.\n\n<claude-mem-context>\nstale memory\n</claude-mem-context>\n',
      'utf-8',
    );

    expect(uninstallOpenCodePlugin()).toBe(0);

    expect(readFileSync(getOpenCodeAgentsMdPath(), 'utf-8'))
      .toBe('# My rules\n\nNever edit the </claude-mem-context> tag by hand.\n');
  });

  it('removes the file when the old block was all it held', () => {
    writeFileSync(
      getOpenCodeAgentsMdPath(),
      '# Claude-Mem Memory Context\n\n<claude-mem-context>\n*No context yet. Complete your first session and context will appear here.*\n</claude-mem-context>\n',
      'utf-8',
    );

    expect(uninstallOpenCodePlugin()).toBe(0);

    expect(existsSync(getOpenCodeAgentsMdPath())).toBe(false);
  });

  it('is a no-op without an AGENTS.md and fails visibly when the file is unreadable', () => {
    expect(uninstallOpenCodePlugin()).toBe(0);
    expect(existsSync(getOpenCodeAgentsMdPath())).toBe(false);

    mkdirSync(getOpenCodeAgentsMdPath());
    expect(uninstallOpenCodePlugin()).toBe(1);
  });
});

describe('OpenCode legacy uninstall end to end', () => {
  it('cleans a mixed fixture and stays green on a repeat', () => {
    writeFileSync(getOpenCodeConfigPath(), JSON.stringify({
      $schema: 'https://opencode.ai/config.json',
      plugin: ['context-mode', './plugins/claude-mem.js'],
      mcp: { 'claude-mem': { type: 'local', command: ['node', '/x/mcp-server.cjs'] }, context7: { enabled: true } },
    }), 'utf-8');
    mkdirSync(join(getOpenCodeConfigPath(), '..', 'plugins'), { recursive: true });
    writeFileSync(join(getOpenCodeConfigPath(), '..', 'plugins', 'claude-mem.js'), 'export default {};\n', 'utf-8');
    writeFileSync(getOpenCodeAgentsMdPath(), '# My rules\n\n<claude-mem-context>\nstale memory\n</claude-mem-context>\n', 'utf-8');

    expect(uninstallOpenCodePlugin()).toBe(0);

    const config = JSON.parse(readFileSync(getOpenCodeConfigPath(), 'utf-8'));
    expect(config.plugin).toEqual(['context-mode']);
    expect(config.mcp).toEqual({ context7: { enabled: true } });
    expect(existsSync(join(getOpenCodeConfigPath(), '..', 'plugins', 'claude-mem.js'))).toBe(false);
    expect(readFileSync(getOpenCodeAgentsMdPath(), 'utf-8')).toBe('# My rules\n');

    expect(uninstallOpenCodePlugin()).toBe(0);
    expect(JSON.parse(readFileSync(getOpenCodeConfigPath(), 'utf-8'))).toEqual(JSON.parse(JSON.stringify({
      $schema: 'https://opencode.ai/config.json',
      plugin: ['context-mode'],
      mcp: { context7: { enabled: true } },
    })));
  });
});
