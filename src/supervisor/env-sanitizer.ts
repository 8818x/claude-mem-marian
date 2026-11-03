// Modified by the claude-mem-marian fork: Decision 16 child-environment allowlist policy.
// Filters CLAUDE_CODE_* (and CLAUDECODE_*) unless explicitly preserved in
// ENV_PRESERVE. This is layer 2 of defense for #2357 (CLAUDE_CODE_EFFORT_LEVEL
// / CLAUDE_CODE_ALWAYS_ENABLE_EFFORT leaking into the SDK subprocess) — layer 1
// is BLOCKED_ENV_VARS in EnvManager.ts. Do NOT add the EFFORT_* vars to
// ENV_PRESERVE: preserving them would defeat the strip.
export const ENV_PREFIXES = ['CLAUDECODE_', 'CLAUDE_CODE_'];
export const ENV_EXACT_MATCHES = new Set([
  'CLAUDECODE',
  'CLAUDE_CODE_SESSION',
  'CLAUDE_CODE_ENTRYPOINT',
  'MCP_SESSION_ID',
]);

export const ENV_PROXY_VARS = new Set([
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'ALL_PROXY',
  'NO_PROXY',
  'http_proxy',
  'https_proxy',
  'all_proxy',
  'no_proxy',
  'npm_config_proxy',
  'npm_config_https_proxy',
  'npm_config_noproxy',
]);

export const ENV_PRESERVE = new Set([
  'CLAUDE_CODE_OAUTH_TOKEN',
  'CLAUDE_CODE_GIT_BASH_PATH',
  // The CLI documents CLAUDE_CODE_TMPDIR as the fix for a root-owned per-uid
  // /tmp/claude-<uid> directory (#4161). Stripping it here sent the SDK child
  // back to /tmp, so the child hit that directory and exited 1 on every spawn
  // — the user's only documented escape did nothing.
  'CLAUDE_CODE_TMPDIR',
  // claude-mem's own setting, not a CLI knob (the CLI never reads it): the
  // path to the claude binary, documented as settable from the file OR the
  // env. Every daemon spawn passes through sanitizeEnv, and the worker reads
  // the env override (SettingsDefaultsManager.applyEnvOverrides), so
  // stripping it silently dropped the env form.
  'CLAUDE_CODE_PATH',
  'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_USE_VERTEX',
  'CLAUDE_CODE_USE_FOUNDRY',
  'CLAUDE_CODE_SKIP_BEDROCK_AUTH',
  'CLAUDE_CODE_SKIP_VERTEX_AUTH',
  'CLAUDE_CODE_SKIP_FOUNDRY_AUTH',
  'ANTHROPIC_BEDROCK_BASE_URL',
  'AWS_REGION',
  'AWS_PROFILE',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_SESSION_TOKEN',
  'ANTHROPIC_VERTEX_PROJECT_ID',
  'CLOUD_ML_REGION',
  'GOOGLE_APPLICATION_CREDENTIALS',
  ...ENV_PROXY_VARS,
]);

export function sanitizeEnv(env: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const sanitized: NodeJS.ProcessEnv = {};

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) continue;
    if (ENV_PRESERVE.has(key)) { sanitized[key] = value; continue; }
    if (ENV_EXACT_MATCHES.has(key)) continue;
    if (ENV_PREFIXES.some(prefix => key.startsWith(prefix))) continue;
    sanitized[key] = value;
  }

  return sanitized;
}

// --- Decision 16 child-environment allowlist policy -------------------------
//
// Child environments are built from explicit name allowlists, never from
// parent-minus-blocklist (Decision 16 §Common boundary). The base is the
// existing Codex app-server runtime set; `CODEX_HOME` is scoped to Codex
// children. Claude and agent-runner children additionally retain the exact
// existing proxy names (ENV_PROXY_VARS) and their role's named extras.

/** The Codex app-server runtime set WITHOUT CODEX_HOME (scoped per child). */
export const CHILD_RUNTIME_ALLOWLIST: readonly string[] = [
  'APPDATA', 'HOME', 'HOMEDRIVE', 'HOMEPATH', 'LANG', 'LOCALAPPDATA',
  'NODE_EXTRA_CA_CERTS', 'PATH', 'PATHEXT', 'SHELL', 'SSL_CERT_DIR',
  'SSL_CERT_FILE', 'SystemRoot', 'TEMP', 'TMP', 'TMPDIR', 'USER',
  'USERPROFILE', 'USERNAME', 'WINDIR', 'XDG_CACHE_HOME', 'XDG_CONFIG_HOME',
  'XDG_DATA_HOME',
];

/** Codex children (codex-exec runner; the app-server keeps its own builder). */
export const CODEX_CHILD_EXTRA: readonly string[] = ['CODEX_HOME'];

/** Claude children's exact runtime controls (no arbitrary host knobs). */
export const CLAUDE_CHILD_EXTRA: readonly string[] = [
  'CLAUDE_CODE_GIT_BASH_PATH',
  'CLAUDE_CODE_TMPDIR',
  'CLAUDE_CODE_PATH',
  'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_USE_VERTEX',
  'CLAUDE_CODE_USE_FOUNDRY',
  'CLAUDE_CODE_SKIP_BEDROCK_AUTH',
  'CLAUDE_CODE_SKIP_VERTEX_AUTH',
  'CLAUDE_CODE_SKIP_FOUNDRY_AUTH',
];

/** Claude children's intentional Bedrock/Vertex fields + profile/ADC selectors. */
export const CLAUDE_CLOUD_EXTRA: readonly string[] = [
  'ANTHROPIC_BEDROCK_BASE_URL',
  'AWS_REGION',
  'AWS_PROFILE',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_SESSION_TOKEN',
  'ANTHROPIC_VERTEX_PROJECT_ID',
  'CLOUD_ML_REGION',
  'GOOGLE_APPLICATION_CREDENTIALS',
  'AWS_DEFAULT_REGION',
  'AWS_CONFIG_FILE',
  'AWS_SHARED_CREDENTIALS_FILE',
  'GOOGLE_CLOUD_PROJECT',
  'GCLOUD_PROJECT',
  'GOOGLE_CLOUD_LOCATION',
];

/** Gemini runner's Vertex/ADC exception plus its selected-key name. */
export const GEMINI_CHILD_EXTRA: readonly string[] = [
  'GEMINI_API_KEY',
  'GEMINI_CLI_SYSTEM_SETTINGS_PATH',
  'GOOGLE_APPLICATION_CREDENTIALS',
  'GOOGLE_CLOUD_PROJECT',
  'GCLOUD_PROJECT',
  'GOOGLE_CLOUD_LOCATION',
  'CLOUD_ML_REGION',
  'GOOGLE_GENAI_USE_VERTEXAI',
];

/** Compose one child's allowlist (runtime base + per-child extras + proxies). */
export function childEnvAllowlist(extras: readonly string[], withProxyVars: boolean): Set<string> {
  const allowed = new Set(CHILD_RUNTIME_ALLOWLIST);
  for (const name of extras) allowed.add(name);
  if (withProxyVars) for (const name of ENV_PROXY_VARS) allowed.add(name);
  return allowed;
}

/**
 * Copy `source` entries whose name is allowlisted into `target`, writing the
 * allowlist's canonical spelling. Windows compares names case-insensitively
 * (and never produces conflicting case aliases); POSIX matches exactly.
 * `lcPrefix` additionally copies `LC_*` locale entries.
 */
export function copyAllowedEnv(
  target: Record<string, string>,
  source: NodeJS.ProcessEnv,
  allowed: Set<string>,
  lcPrefix: boolean,
): void {
  const windows = process.platform === 'win32';
  const canonical = new Map<string, string>();
  for (const name of allowed) canonical.set(name.toLowerCase(), name);
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    let name: string | undefined;
    if (windows) {
      name = canonical.get(key.toLowerCase())
        ?? (lcPrefix && key.toLowerCase().startsWith('lc_') ? key : undefined);
    } else if (allowed.has(key)) {
      name = key;
    } else if (lcPrefix && key.startsWith('LC_')) {
      name = key;
    }
    if (name !== undefined) target[name] = value;
  }
}
