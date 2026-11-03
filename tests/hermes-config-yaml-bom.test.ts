import { describe, expect, it } from 'bun:test';
import {
  HermesConfigShapeError,
  removeMcpServer,
  restoreMemoryProvider,
} from '../src/services/integrations/hermes-config-yaml.js';

describe('Hermes config edits on files other editors wrote', () => {
  it('drops the added provider beside a leading byte-order mark instead of losing the memory block', () => {
    const installed = '﻿memory:\n  provider: claude-mem\n  memory_enabled: true\n';
    const restored = restoreMemoryProvider(installed, 'claude-mem', { memoryHeader: null, providerLine: null });
    expect(restored).toBe('﻿memory:\n  memory_enabled: true\n');
  });

  it('puts back the recorded provider line beside a leading byte-order mark', () => {
    const installed = '﻿memory:\n  memory_enabled: true\n  provider: claude-mem\n';
    const restored = restoreMemoryProvider(installed, 'claude-mem', { memoryHeader: 'memory:', providerLine: '  provider: old' });
    expect(restored).toBe('﻿memory:\n  memory_enabled: true\n  provider: old\n');
  });

  it('keeps the mark and the CRLF endings when it removes an MCP server', () => {
    const installed = '﻿mcp_servers:\r\n  other:\r\n    command: x\r\n  claude-mem:\r\n    command: node\r\n    args:\r\n      - mcp-server.cjs\r\n    enabled: true\r\n';
    const receipt = { mcpHeader: 'mcp_servers:', installedEntry: '  claude-mem:\n    command: node\n    args:\n      - mcp-server.cjs\n    enabled: true' };
    const restored = removeMcpServer(installed, 'claude-mem', receipt);
    expect(restored.startsWith('﻿mcp_servers:\r\n')).toBe(true);
    expect(restored).toContain('other:');
    expect(restored).not.toContain('claude-mem');
  });

  it('refuses a file whose root keys are all indented, and changes nothing', () => {
    const original = '  memory:\n    provider: claude-mem\n';
    expect(() => restoreMemoryProvider(original, 'claude-mem', { memoryHeader: null, providerLine: null })).toThrow(HermesConfigShapeError);
    expect(() => removeMcpServer(original.replace('memory', 'mcp_servers'), 'claude-mem', { mcpHeader: null, installedEntry: '  claude-mem: x' })).toThrow(HermesConfigShapeError);
  });

  it('refuses an indented root that follows a document marker or a directive', () => {
    for (const original of ['---\n  memory:\n    provider: claude-mem\n', '%YAML 1.2\n---\n  memory:\n    provider: old\n']) {
      expect(() => restoreMemoryProvider(original, 'claude-mem', { memoryHeader: null, providerLine: null })).toThrow(HermesConfigShapeError);
    }
  });

  it('still restores a normal root that follows a document marker', () => {
    const restored = restoreMemoryProvider('---\nmemory:\n  provider: claude-mem\n  memory_enabled: true\n', 'claude-mem', { memoryHeader: null, providerLine: null });
    expect(restored).toBe('---\nmemory:\n  memory_enabled: true\n');
  });

  it('gives back a file that held only the mark once the added blocks are removed', () => {
    const providerRestored = restoreMemoryProvider('﻿memory:\n  provider: claude-mem\n', 'claude-mem', { memoryHeader: null, providerLine: null });
    expect(providerRestored).toBe('﻿');
    const mcpRemoved = removeMcpServer(
      '﻿mcp_servers:\n  claude-mem:\n    command: node\n    args:\n      - mcp-server.cjs\n    enabled: true\n',
      'claude-mem',
      { mcpHeader: null, installedEntry: '  claude-mem:\n    command: node\n    args:\n      - mcp-server.cjs\n    enabled: true' },
    );
    expect(mcpRemoved).toBe('﻿');
  });
});
