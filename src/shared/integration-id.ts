// Modified by the claude-mem-marian fork: defines maintained installation targets. Upstream attribution is retained.
/**
 * `claude` is what people type for Claude Code: `npx claude-mem install --ide
 * claude` and `hook claude <event>`. Canonicalized where an id enters, so every
 * check downstream (IDE validation, the per-host hook limits, the handlers'
 * `platform === 'claude-code'` branches) sees one spelling.
 */
const INTEGRATION_ID_ALIASES: Readonly<Record<string, string>> = {
  claude: 'claude-code', t3: 't3code', 't3-code': 't3code',
  'pi-mono': 'pi', 'deepseek-harness': 'dsh',
};

export function canonicalIntegrationId(id: string): string {
  return Object.hasOwn(INTEGRATION_ID_ALIASES, id) ? INTEGRATION_ID_ALIASES[id] : id;
}

export const MAINTAINED_INSTALL_TARGETS = [
  { id: 'claude-code', label: 'Claude Code' },
  { id: 'codex-cli', label: 'Codex CLI' },
] as const;

export type MaintainedInstallTarget = (typeof MAINTAINED_INSTALL_TARGETS)[number]['id'];

export class UnsupportedInstallTargetError extends Error {
  constructor(target: string) {
    const supported = MAINTAINED_INSTALL_TARGETS.map(({ id, label }) => `${label} (${id})`).join(' and ');
    super(`Unsupported installation target "${target}". Marian maintains new installations for ${supported}.`);
    this.name = 'UnsupportedInstallTargetError';
  }
}

export function requireMaintainedInstallTarget(id: string): MaintainedInstallTarget {
  const canonicalId = canonicalIntegrationId(id);
  if (!MAINTAINED_INSTALL_TARGETS.some((target) => target.id === canonicalId)) {
    throw new UnsupportedInstallTargetError(id);
  }
  return canonicalId as MaintainedInstallTarget;
}
