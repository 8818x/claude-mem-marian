// Modified by the claude-mem-marian fork: new file for Decision 16.
/**
 * Pure, bounded, never-throwing credential scrubber for log output
 * (Decision 16 §Required log redaction).
 *
 * This module sits at the logger's final serialization boundary, so it must
 * NEVER import the logger (or anything that imports it): redaction.ts and
 * Task 37's error-scrub.ts both depend on the logger, so their pure patterns
 * are reused by copy — the pattern definitions are kept textually in step with
 * their sources (redaction.ts BUILTIN_REDACTION deliberately excludes the
 * telemetry-only classes (emails, IPv4 addresses, UUIDs, plain long hex) that
 * are not credential material and would destroy log diagnostics (request ids,
 * endpoint origins).
 *
 * Idempotent: scrubbing is removal-only, and the replacement marker
 * `[REDACTED]` plus the `<redacted type='...'/>` markers produced by
 * redaction.ts/error-scrub.ts contain no credential shape, so a scrubbed line
 * scrubs to itself.
 */

/** Replacement marker — same word error-scrub.ts uses, so composition is stable. */
export const CREDENTIAL_REDACTED = '[REDACTED]';

/**
 * Hard ceiling on the raw length a scrub sees, applied before any regex runs
 * (same posture and same bound as error-scrub.ts MAX_RAW_INPUT_CHARS: log
 * lines are already size-bounded by the logger's formatting, and a quadratic
 * regex over an adversarial run must stay sub-second).
 */
export const MAX_SCRUB_INPUT_CHARS = 8192;

/**
 * Exact active credential values supplied by the operation (sync tokens,
 * selected provider keys, realtime grants), held in bounded in-memory context
 * only — never persisted, never read from the environment or a credential
 * store, never dumped. Oldest values are evicted past the caps.
 */
const MAX_REGISTERED_VALUES = 64;
const MAX_REGISTERED_VALUE_CHARS = 2048;
const registeredScrubValues: string[] = [];

/**
 * Supply exact values the pattern scrubber cannot recognize on its own
 * (arbitrary opaque tokens). Values under 8 characters are ignored: an exact
 * match that short would mangle ordinary text. undefined/null entries skipped.
 */
export function registerScrubValues(values: Array<string | undefined | null>): void {
  for (const value of values) {
    if (typeof value !== 'string') continue;
    if (value.length < 8 || value.length > MAX_REGISTERED_VALUE_CHARS) continue;
    if (registeredScrubValues.includes(value)) continue;
    registeredScrubValues.push(value);
    while (registeredScrubValues.length > MAX_REGISTERED_VALUES) registeredScrubValues.shift();
  }
}

/** Test/worker-shutdown helper: clears the in-memory exact-value registry. */
export function _resetScrubValues(): void {
  registeredScrubValues.length = 0;
}

/** Test helper: current registry snapshot (bounded; never the log itself). */
export function _registeredScrubValues(): string[] {
  return [...registeredScrubValues];
}

/**
 * Removes C0 control characters (except \n and \t, which keep the line's
 * structure) and DEL, so untrusted text cannot forge log records.
 */
export function stripControlChars(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

interface CredentialPattern {
  name: string;
  regex: RegExp;
  /** Custom replacement; default is the [REDACTED] marker. */
  transform?: (match: string) => string;
}

// The keyed-lookbehind builder shared with redaction.ts (`key=value`,
// `key: value`, `"key": "value"`, JSON-escaped quotes too), bounded so an
// unbounded \s* lookbehind cannot rescan the whole whitespace run.
const GENERIC_VALUE_CLASS = String.raw`[A-Za-z0-9_.\-+/=~@#$%^*!?]`;
const OPTIONAL_QUOTE = String.raw`(?:\\{0,3}["'])?`;
const BOUNDED_SPACE = String.raw`\s{0,8}`;
function keyedLookbehind(key: string): string {
  return `(?<=${key}${BOUNDED_SPACE}[=:]${BOUNDED_SPACE}${OPTIONAL_QUOTE})`;
}

function buildCredentialPatterns(): CredentialPattern[] {
  return [
    // --- Authorization headers, bearer/basic credentials.
    { name: 'authorization_header', regex: /\bAuthorization["']?\s*:\s*["']?\s*(?:Bearer|Basic|token)\s+[^"'\s,;)}\]]{6,}/gi },
    { name: 'bearer', regex: /\bBearer\s+[A-Za-z0-9._-]{8,512}\b/gi },
    { name: 'basic_auth', regex: /\bBasic\s+[A-Za-z0-9+/]{8,}={0,2}/g },
    // --- redaction.ts built-ins, kept in step with src/utils/redaction.ts.
    { name: 'aws_access_key', regex: /(?:AKIA|ASIA)[0-9A-Z]{16}/g },
    { name: 'aws_secret_key', regex: new RegExp(`${keyedLookbehind(String.raw`(?:aws_secret_access_key|\bSecretAccessKey)`)}[A-Za-z0-9/+=]{40}`, 'gi') },
    { name: 'aws_session_token', regex: new RegExp(`${keyedLookbehind(String.raw`\b(?:aws_session_token|SessionToken)`)}[A-Za-z0-9/+=]{100,}`, 'gi') },
    { name: 'github_pat', regex: /\bgh[oprsu]_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{82}\b/g },
    { name: 'openai_key', regex: /\bsk-(?!ant-)[A-Za-z0-9_-]{20,}(?!\w)/g },
    { name: 'anthropic_key', regex: /\bsk-ant-[A-Za-z0-9_-]{20,}(?!\w)/g },
    { name: 'slack_token', regex: /\b(?:xox[abeprs]|xapp)-[A-Za-z0-9-]{10,}(?!\w)/g },
    { name: 'jwt', regex: /\beyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+(?!\w)/g },
    { name: 'private_key_pem', regex: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----[\s\S]*?-----END (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----/g },
    { name: 'stripe_key', regex: /\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{24,}\b/g },
    { name: 'google_api_key', regex: /\bAIza[0-9A-Za-z_-]{35}(?!\w)/g },
    // claude-mem's own keys: server API keys and cmem.ai Pro memory keys.
    { name: 'claude_mem_key', regex: /\bcmem_[A-Za-z0-9_-]{32,}|\bcm_pro_[A-Za-z0-9_-]{8,}/g },
    // --- error-scrub.ts URL/userinfo pattern: any scheme://… match is
    // rewritten keeping scheme+host+path, dropping ?query/#fragment and
    // replacing user:pass@ with [REDACTED]@ (connection-string credentials).
    {
      name: 'url_credentials',
      regex: /\b[A-Za-z][A-Za-z0-9+.-]*:\/\/[^\s"'()]+/g,
      transform: (match: string): string => match
        .replace(/[?#].*$/, '')
        .replace(/^([A-Za-z][A-Za-z0-9+.-]*:\/\/)[^/@\s]+@/, `$1${CREDENTIAL_REDACTED}@`),
    },
  ];
}

/**
 * `token=…` / `api_key=…` / `--token=…` / `--api-key …` assignments outside
 * URL matches (error-scrub.ts redactAssignmentSecrets + the CLI-flag style).
 */
function redactAssignmentSecrets(text: string): string {
  return text
    .replace(
      /\b(access[_-]?token|api[_-]?key|auth(?:orization)?|secret|password|passwd|jwt|session[_-]?id|token)=(?!"?$)([^"'\s&]{1,})/gi,
      (_match: string, key: string) => `${key}=${CREDENTIAL_REDACTED}`,
    )
    .replace(
      /(--(?:token|secret|api[_-]key)(?:=|[ ]))([^"&\s]{6,})/gi,
      (_match: string, prefix: string) => `${prefix}${CREDENTIAL_REDACTED}`,
    );
}

/**
 * Exact registered values first (pattern matching cannot catch an arbitrary
 * echoed secret), then the pattern set, then control-character stripping.
 * Removal-only and marker-safe, so it is idempotent.
 */
export function scrubCredentials(text: unknown): string {
  if (typeof text !== 'string' || text.length === 0) {
    return typeof text === 'string' ? text : '';
  }
  let working = text;
  for (const value of registeredScrubValues) {
    if (working.includes(value)) {
      working = working.split(value).join(CREDENTIAL_REDACTED);
    }
  }
  working = redactAssignmentSecrets(working);
  for (const pattern of buildCredentialPatterns()) {
    pattern.regex.lastIndex = 0;
    working = pattern.regex.global
      ? working.replace(pattern.regex, pattern.transform ?? ((): string => CREDENTIAL_REDACTED))
      : working.replace(pattern.regex, pattern.transform ?? ((): string => CREDENTIAL_REDACTED));
  }
  working = stripControlChars(working);
  if (working.length > MAX_SCRUB_INPUT_CHARS) {
    working = `${working.slice(0, MAX_SCRUB_INPUT_CHARS)}${CREDENTIAL_REDACTED}`;
  }
  return working;
}
// __T43_PATTERNS6__
