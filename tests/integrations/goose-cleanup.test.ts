import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { uninstallGooseMcpIntegration } from '../../src/services/integrations/McpIntegrations.js';

// Cleanup-contract coverage for the Goose extensions mapping, migrated from the
// retired install suite (Task 23) so the YAML line-span parser contracts stay
// pinned from the cleanup side.
describe('Goose uninstall removes the claude-mem extension', () => {
  let tmp: string;
  let configPath: string;
  let logSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    tmp = mkdtempSync(path.join(tmpdir(), 'goose-cleanup-'));
    configPath = path.join(tmp, 'config.yaml');
    logSpy = spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    rmSync(tmp, { recursive: true, force: true });
  });

  it('restores a config with other extensions byte for byte', () => {
    const original = [
      'GOOSE_PROVIDER: anthropic',
      'extensions:',
      '  developer:',
      '    bundled: true',
      '    enabled: true',
      '    name: developer',
      '    timeout: 300',
      '    type: builtin',
      'GOOSE_MODE: smart_approve',
      '',
    ].join('\n');
    const installed = [
      'GOOSE_PROVIDER: anthropic',
      'extensions:',
      '  developer:',
      '    bundled: true',
      '    enabled: true',
      '    name: developer',
      '    timeout: 300',
      '    type: builtin',
      '  claude-mem:',
      '    enabled: true',
      '    type: stdio',
      '    name: claude-mem',
      '    cmd: node',
    '    args:',
    '      - /plugin/scripts/mcp-server.cjs',
      '    timeout: 300',
      'GOOSE_MODE: smart_approve',
      '',
    ].join('\n');
    writeFileSync(configPath, installed);

    expect(uninstallGooseMcpIntegration(configPath)).toBe(0);

    expect(readFileSync(configPath, 'utf-8')).toBe(original);
    expect((Bun.YAML.parse(readFileSync(configPath, 'utf-8')) as any).extensions['claude-mem']).toBeUndefined();
  });

  it('drops the extensions key when claude-mem was the only entry', () => {
    writeFileSync(configPath, 'extensions:\n  claude-mem:\n    enabled: true\n    cmd: node\n    args:\n      - /plugin/scripts/mcp-server.cjs\nGOOSE_PROVIDER: ollama\n');

    expect(uninstallGooseMcpIntegration(configPath)).toBe(0);

    expect(Bun.YAML.parse(readFileSync(configPath, 'utf-8'))).toEqual({ GOOSE_PROVIDER: 'ollama' });
  });

  it('removes an entry that sits between other extensions', () => {
    writeFileSync(configPath, [
      'extensions:',
      '  alpha:',
      '    enabled: true',
      '  claude-mem:',
      '    enabled: true',
      '    cmd: node',
      '  omega:',
      '    enabled: false',
      '',
    ].join('\n'));

    expect(uninstallGooseMcpIntegration(configPath)).toBe(0);

    expect((Bun.YAML.parse(readFileSync(configPath, 'utf-8')) as any).extensions).toEqual({
      alpha: { enabled: true },
      omega: { enabled: false },
    });
  });

  it('leaves the file alone when there is nothing to remove and stays visible on missing files', () => {
    const original = 'extensions:\n  developer:\n    enabled: true\n';
    writeFileSync(configPath, original);

    expect(uninstallGooseMcpIntegration(configPath)).toBe(1);
    expect(uninstallGooseMcpIntegration(path.join(tmp, 'missing.yaml'))).toBe(1);
    expect(readFileSync(configPath, 'utf-8')).toBe(original);
  });

  it('finds and removes claude-mem under an extensions key written in quotes', () => {
    const installed = [
      '"extensions":',
      '  claude-mem:',
      '    enabled: true',
      '  developer:',
      '    enabled: true',
      '',
    ].join('\n');
    writeFileSync(configPath, installed);

    expect(uninstallGooseMcpIntegration(configPath)).toBe(0);

    expect(readFileSync(configPath, 'utf-8')).toBe('"extensions":\n  developer:\n    enabled: true\n');
  });

  it('strips a byte order mark and removes the entry beneath it', () => {
    writeFileSync(configPath, '﻿extensions:\n  claude-mem:\n    enabled: true\n  developer:\n    enabled: true\n');

    expect(uninstallGooseMcpIntegration(configPath)).toBe(0);

    expect(readFileSync(configPath, 'utf-8')).toBe('extensions:\n  developer:\n    enabled: true\n');
  });

  it('removes only the claude-mem entry when entries use deeper indentation', () => {
    const installed = [
      'extensions:',
      '    alpha:',
      '      enabled: true',
      '    claude-mem:',
      '      enabled: true',
      '    omega:',
      '      enabled: false',
      '',
    ].join('\n');
    writeFileSync(configPath, installed);

    expect(uninstallGooseMcpIntegration(configPath)).toBe(0);

    expect(readFileSync(configPath, 'utf-8')).toBe([
      'extensions:',
      '    alpha:',
      '      enabled: true',
      '    omega:',
      '      enabled: false',
      '',
    ].join('\n'));
  });

  it('fails visibly when extensions is written inline instead of a block mapping', () => {
    const inline = 'extensions: {claude-mem: {enabled: true}}\n';
    writeFileSync(configPath, inline);

    expect(() => uninstallGooseMcpIntegration(configPath)).toThrow(/extensions/);
    expect(readFileSync(configPath, 'utf-8')).toBe(inline);
  });
});
