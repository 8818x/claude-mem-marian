// Modified by the claude-mem-marian fork: covers the maintained installation-target policy. Upstream attribution is retained.
import { describe, expect, it } from 'bun:test';
import { canonicalIntegrationId, MAINTAINED_INSTALL_TARGETS, requireMaintainedInstallTarget } from '../../src/shared/integration-id.js';
import { getPlatformAdapter } from '../../src/cli/adapters/index.js';
import { claudeCodeAdapter } from '../../src/cli/adapters/claude-code.js';
import { detectInstalledIDEs } from '../../src/npx-cli/commands/ide-detection.js';

describe("'claude' is an alias for Claude Code (#2835)", () => {
  it('canonicalizes claude and leaves every other id alone', () => {
    expect(canonicalIntegrationId('claude')).toBe('claude-code');
    expect(canonicalIntegrationId('claude-code')).toBe('claude-code');
    expect(canonicalIntegrationId('cursor')).toBe('cursor');
    expect(canonicalIntegrationId('codex')).toBe('codex');
  });

  it('uses the canonical host target policy without reinterpreting provider ids', () => {
    expect(MAINTAINED_INSTALL_TARGETS.map(({ id }) => id)).toEqual(['claude-code', 'codex-cli']);
    expect(requireMaintainedInstallTarget('claude')).toBe('claude-code');
    expect(requireMaintainedInstallTarget('codex-cli')).toBe('codex-cli');
    expect(() => requireMaintainedInstallTarget('codex')).toThrow('Unsupported installation target "codex"');
    expect(() => requireMaintainedInstallTarget('cursor')).toThrow('Unsupported installation target "cursor"');
  });

  it('names an IDE the installer knows, so --ide claude is not an unknown IDE', () => {
    const ids = detectInstalledIDEs().map((ide) => ide.id);
    expect(ids).not.toContain('claude');
    expect(ids).toContain(canonicalIntegrationId('claude'));
  });

  it('uses the Claude Code adapter for hook claude', () => {
    expect(getPlatformAdapter('claude')).toBe(claudeCodeAdapter);
  });
});
