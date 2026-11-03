import { describe, it, expect, afterEach } from 'bun:test';
import {
  scrubCredentials,
  registerScrubValues,
  stripControlChars,
  CREDENTIAL_REDACTED,
  MAX_SCRUB_INPUT_CHARS,
  _resetScrubValues,
  _registeredScrubValues,
} from '../../src/utils/credential-redaction.js';
import {
  redactText,
  scrubMessage,
  REDACTED as T37_REDACTED,
} from '../../src/services/telemetry/error-scrub.js';
import {
  redactSensitive,
  OVERSIZE_MARKER,
} from '../../src/utils/redaction.js';

afterEach(() => _resetScrubValues());

describe('scrubCredentials — patterns', () => {
  it('redacts bearer tokens', () => {
    const out = scrubCredentials('hub said Bearer abcdef123456 refused');
    expect(out).toContain('[REDACTED]');
    expect(out).not.toContain('abcdef123456');
  });

  it('redacts Authorization headers (Bearer and Basic)', () => {
    const out = scrubCredentials('req failed Authorization: Bearer abcdef123456 and Basic dXNlcjpwYXNz');
    expect(out).not.toContain('abcdef123456');
    expect(out).not.toContain('dXNlcjpwYXNz');
  });

  it('redacts assignment-style secrets and keeps the key', () => {
    const out = scrubCredentials('bad token=xyz12345678 retry');
    expect(out).toContain('token=[REDACTED]');
    expect(out).not.toContain('xyz12345678');
  });

  it('redacts URL userinfo and credential query values, keeps origin', () => {
    const out = scrubCredentials('POST https://user:pass@hub.example/v1/sync?api_key=zzz9999999 failed');
    expect(out).not.toContain('user:pass');
    expect(out).not.toContain('zzz9999999');
    expect(out).toContain('https://[REDACTED]@hub.example/v1/sync');
  });

  it('redacts vendor-shaped keys (anthropic, github, google, aws, cmem)', () => {
    const out = scrubCredentials(
      'keys sk-ant-aaaaaaaaaaaaaaaaaaaa ghp_' + 'a'.repeat(36) +
      ' AIza' + 'a'.repeat(35) + ' AKIA' + 'B2C3D4E5F6A7B8C9' + ' cmem_' + 'A'.repeat(40) + ' cm_pro_abcdef1234',
    );
    expect(out).not.toContain('sk-ant-');
    expect(out).not.toContain('ghp_');
    expect(out).not.toContain('AIza');
    expect(out).not.toContain('B2C3D4E5F6A7B8C9');
    expect(out).not.toContain('cm_pro_abcdef1234');
  });

  it('redacts JWTs', () => {
    const out = scrubCredentials('auth error eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJVadQssw5c tail');
    expect(out).not.toContain('eyJhbGciOiJIUzI1NiJ9');
  });

  it('redacts private key PEM blocks', () => {
    const pem = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowAAAA\n-----END RSA PRIVATE KEY-----';
    const out = scrubCredentials(`handshake carried ${pem}`);
    expect(out).not.toContain('MIIEowAAAA');
  });

  it('redacts a registered exact value an arbitrary echo would leak', () => {
    registerScrubValues(['SYNC_TOKEN_abcdef43']);
    const out = scrubCredentials('hub echoed SYNC_TOKEN_abcdef43 in a 401 body');
    expect(out).not.toContain('SYNC_TOKEN_abcdef43');
    expect(out).toContain('[REDACTED]');
  });

  it('strips control characters that could forge log records, keeps newlines and tabs', () => {
    const out = scrubCredentials('line1\u0007FORGED line2\u000Bx tab\there\nkeep\u001Fme');
    expect(out).not.toContain('\u0007');
    expect(out).not.toContain('\u000B');
    expect(out).not.toContain('\u001F');
    expect(out).toContain('\there');
    expect(out).toContain('\n');
  });

  it('caps output at MAX_SCRUB_INPUT_CHARS', () => {
    const long = 'x'.repeat(MAX_SCRUB_INPUT_CHARS + 1000);
    const out = scrubCredentials(long);
    expect(out.length).toBe(MAX_SCRUB_INPUT_CHARS + CREDENTIAL_REDACTED.length);
  });

  it('never throws on hostile input', () => {
    expect(() => scrubCredentials(undefined)).not.toThrow();
    expect(() => scrubCredentials(null)).not.toThrow();
    expect(() => scrubCredentials(42)).not.toThrow();
    expect(scrubCredentials(undefined)).toBe('');
  });
});

describe('scrubCredentials — registry bounds', () => {
  afterEach(() => _resetScrubValues());

  it('skips short, oversize, and non-string values', () => {
    registerScrubValues(['short', undefined, null, 'v'.repeat(3000), 'valid_value_43']);
    expect(_registeredScrubValues()).toEqual(['valid_value_43']);
  });

  it('evicts oldest past 64 entries', () => {
    for (let i = 0; i < 70; i++) registerScrubValues([`value_number_${String(i).padStart(2, '0')}_xxxx`]);
    const values = _registeredScrubValues();
    expect(values.length).toBe(64);
    expect(values.some(v => v.startsWith('value_number_00'))).toBe(false);
    expect(values.some(v => v.startsWith('value_number_69'))).toBe(true);
  });
});

describe('composition with Task 37 helpers and redaction markers', () => {
  afterEach(() => _resetScrubValues());

  it('is idempotent', () => {
    const raw = 'Bearer abcdef123456 token=xyz12345678 SYNC_TOKEN_abcdef43';
    registerScrubValues(['SYNC_TOKEN_abcdef43']);
    const once = scrubCredentials(raw);
    expect(scrubCredentials(once)).toBe(once);
  });

  it('preserves existing redaction.ts markers and error-scrub [REDACTED]', () => {
    const marked = "field was <redacted type='github_pat'/> and [REDACTED] already";
    expect(scrubCredentials(marked)).toBe(marked);
  });

  it('composes with error-scrub redactText in both orders', () => {
    registerScrubValues(['SYNC_TOKEN_abcdef43']);
    const raw = 'hub SYNC_TOKEN_abcdef43 then https://u:p@h/x?a=b';
    const a = scrubCredentials(redactText(raw));
    const b = redactText(scrubCredentials(raw));
    expect(a).not.toContain('SYNC_TOKEN_abcdef43');
    expect(b).not.toContain('SYNC_TOKEN_abcdef43');
    expect(a).not.toContain('u:p@h');
    expect(b).not.toContain('u:p@h');
  });

  it('composes with scrubMessage without restoring removed data', () => {
    registerScrubValues(['SYNC_TOKEN_abcdef43']);
    const raw = 'echo SYNC_TOKEN_abcdef43 Bearer abcdef123456';
    const once = scrubMessage(scrubCredentials(raw));
    expect(once).not.toContain('SYNC_TOKEN_abcdef43');
    expect(once).not.toContain('abcdef123456');
    expect(scrubMessage(once)).toBe(once);
  });

  it('does not weaken redactSensitive marker output', () => {
    const result = redactSensitive('ghp_' + 'a'.repeat(36), { enabled: true });
    expect(result.redacted).toBe("<redacted type='github_pat'/>");
    expect(OVERSIZE_MARKER).toContain('redacted');
    expect(T37_REDACTED).toBe('[REDACTED]');
  });
});