// Modified by the claude-mem-marian fork: retired the host provider selection option (Decision 05). Upstream attribution is retained.
type InstallerProviderId = 'claude' | 'gemini' | 'openrouter';
type InstallerProviderChoice = InstallerProviderId | 'cmem';

/**
 * Implicit provider when `--provider` is omitted.
 * Grok Bot's user-facing default is CMEM Pro (openrouter transport +
 * cmem-observer via installer OAuth). Other IDEs have no non-interactive implicit provider.
 *
 * Applied at the CLI boundary in `src/npx-cli/index.ts` for non-TTY
 * `install --ide grok-bot`. Interactive grok-bot still shows the CMEM/Claude
 * prompt (`initialValues: ['cmem']`). The 'cmem' sentinel must never be
 * written to settings.json.
 */
export function resolveInstallerProviderChoice(
  options: { ide?: string; provider?: InstallerProviderId },
): InstallerProviderChoice | undefined {
  if (options.provider) return options.provider;
  if (options.ide === 'grok-bot') return 'cmem';
  return undefined;
}
