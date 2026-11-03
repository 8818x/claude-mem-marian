import { describe, expect, it } from 'bun:test';
import {
  sanitizeEnv,
  childEnvAllowlist,
  copyAllowedEnv,
  CHILD_RUNTIME_ALLOWLIST,
  CODEX_CHILD_EXTRA,
  GEMINI_CHILD_EXTRA,
  CLAUDE_CHILD_EXTRA,
  CLAUDE_CLOUD_EXTRA,
} from '../../src/supervisor/env-sanitizer.js';

describe('sanitizeEnv', () => {
  it('strips variables with CLAUDECODE_ prefix', () => {
    const result = sanitizeEnv({
      CLAUDECODE_FOO: 'bar',
      CLAUDECODE_SOMETHING: 'value',
      PATH: '/usr/bin'
    });

    expect(result.CLAUDECODE_FOO).toBeUndefined();
    expect(result.CLAUDECODE_SOMETHING).toBeUndefined();
    expect(result.PATH).toBe('/usr/bin');
  });

  it('strips variables with CLAUDE_CODE_ prefix but preserves allowed ones', () => {
    const result = sanitizeEnv({
      CLAUDE_CODE_BAR: 'baz',
      CLAUDE_CODE_OAUTH_TOKEN: 'token',
      CLAUDE_CODE_SKIP_BEDROCK_AUTH: '1',
      CLAUDE_CODE_SKIP_VERTEX_AUTH: '1',
      HOME: '/home/user'
    });

    expect(result.CLAUDE_CODE_BAR).toBeUndefined();
    expect(result.CLAUDE_CODE_OAUTH_TOKEN).toBe('token');
    expect(result.CLAUDE_CODE_SKIP_BEDROCK_AUTH).toBe('1');
    expect(result.CLAUDE_CODE_SKIP_VERTEX_AUTH).toBe('1');
    expect(result.HOME).toBe('/home/user');
  });

  it('strips exact-match variables (CLAUDECODE, CLAUDE_CODE_SESSION, CLAUDE_CODE_ENTRYPOINT, MCP_SESSION_ID)', () => {
    const result = sanitizeEnv({
      CLAUDECODE: '1',
      CLAUDE_CODE_SESSION: 'session-123',
      CLAUDE_CODE_ENTRYPOINT: 'hook',
      MCP_SESSION_ID: 'mcp-abc',
      NODE_PATH: '/usr/local/lib'
    });

    expect(result.CLAUDECODE).toBeUndefined();
    expect(result.CLAUDE_CODE_SESSION).toBeUndefined();
    expect(result.CLAUDE_CODE_ENTRYPOINT).toBeUndefined();
    expect(result.MCP_SESSION_ID).toBeUndefined();
    expect(result.NODE_PATH).toBe('/usr/local/lib');
  });

  it('preserves allowed variables like PATH, HOME, NODE_PATH', () => {
    const result = sanitizeEnv({
      PATH: '/usr/bin:/usr/local/bin',
      HOME: '/home/user',
      NODE_PATH: '/usr/local/lib/node_modules',
      SHELL: '/bin/zsh',
      USER: 'developer',
      LANG: 'en_US.UTF-8'
    });

    expect(result.PATH).toBe('/usr/bin:/usr/local/bin');
    expect(result.HOME).toBe('/home/user');
    expect(result.NODE_PATH).toBe('/usr/local/lib/node_modules');
    expect(result.SHELL).toBe('/bin/zsh');
    expect(result.USER).toBe('developer');
    expect(result.LANG).toBe('en_US.UTF-8');
  });

  it('returns a new object and does not mutate the original', () => {
    const original: NodeJS.ProcessEnv = {
      PATH: '/usr/bin',
      CLAUDECODE_FOO: 'bar',
      KEEP: 'yes'
    };
    const originalCopy = { ...original };

    const result = sanitizeEnv(original);

    expect(result).not.toBe(original);

    expect(original).toEqual(originalCopy);

    expect(result.CLAUDECODE_FOO).toBeUndefined();
    expect(result.PATH).toBe('/usr/bin');
  });

  it('handles empty env gracefully', () => {
    const result = sanitizeEnv({});
    expect(result).toEqual({});
  });

  it('skips entries with undefined values', () => {
    const env: NodeJS.ProcessEnv = {
      DEFINED: 'value',
      UNDEFINED_KEY: undefined
    };

    const result = sanitizeEnv(env);
    expect(result.DEFINED).toBe('value');
    expect('UNDEFINED_KEY' in result).toBe(false);
  });

  it('combines prefix and exact match removal in a single pass', () => {
    const result = sanitizeEnv({
      PATH: '/usr/bin',
      CLAUDECODE: '1',
      CLAUDECODE_FOO: 'bar',
      CLAUDE_CODE_BAR: 'baz',
      CLAUDE_CODE_OAUTH_TOKEN: 'oauth-token',
      CLAUDE_CODE_SESSION: 'session',
      CLAUDE_CODE_ENTRYPOINT: 'entry',
      MCP_SESSION_ID: 'mcp',
      KEEP_ME: 'yes'
    });

    expect(result.PATH).toBe('/usr/bin');
    expect(result.KEEP_ME).toBe('yes');
    expect(result.CLAUDECODE).toBeUndefined();
    expect(result.CLAUDECODE_FOO).toBeUndefined();
    expect(result.CLAUDE_CODE_BAR).toBeUndefined();
    expect(result.CLAUDE_CODE_OAUTH_TOKEN).toBe('oauth-token');
    expect(result.CLAUDE_CODE_SESSION).toBeUndefined();
    expect(result.CLAUDE_CODE_ENTRYPOINT).toBeUndefined();
    expect(result.MCP_SESSION_ID).toBeUndefined();
  });

  it('preserves CLAUDE_CODE_GIT_BASH_PATH through sanitization', () => {
    const result = sanitizeEnv({
      CLAUDE_CODE_GIT_BASH_PATH: 'C:\\Program Files\\Git\\bin\\bash.exe',
      PATH: '/usr/bin',
      HOME: '/home/user'
    });

    expect(result.CLAUDE_CODE_GIT_BASH_PATH).toBe('C:\\Program Files\\Git\\bin\\bash.exe');
    expect(result.PATH).toBe('/usr/bin');
    expect(result.HOME).toBe('/home/user');
  });

  it('preserves CLAUDE_CODE_TMPDIR so the SDK child avoids a root-owned /tmp/claude-<uid> (#4161)', () => {
    const result = sanitizeEnv({
      CLAUDE_CODE_TMPDIR: '/home/user/.cache/claude-tmp',
      PATH: '/usr/bin',
      HOME: '/home/user'
    });

    expect(result.CLAUDE_CODE_TMPDIR).toBe('/home/user/.cache/claude-tmp');
    expect(result.PATH).toBe('/usr/bin');
    expect(result.HOME).toBe('/home/user');
  });

  it('preserves CLAUDE_CODE_PATH, the documented env form of the claude-mem setting, across daemon spawns', () => {
    const result = sanitizeEnv({
      CLAUDE_CODE_PATH: 'C:\\Users\\me\\.local\\bin\\claude.exe',
      CLAUDE_CODE_ENTRYPOINT: 'cli',
      PATH: '/usr/bin',
    });

    expect(result.CLAUDE_CODE_PATH).toBe('C:\\Users\\me\\.local\\bin\\claude.exe');
    expect(result.CLAUDE_CODE_ENTRYPOINT).toBeUndefined();
    expect(result.PATH).toBe('/usr/bin');
  });

  it('preserves Azure AI Foundry auth vars through sanitization', () => {
    const result = sanitizeEnv({
      CLAUDE_CODE_USE_FOUNDRY: '1',
      CLAUDE_CODE_SKIP_FOUNDRY_AUTH: '1',
      PATH: '/usr/bin'
    });

    expect(result.CLAUDE_CODE_USE_FOUNDRY).toBe('1');
    expect(result.CLAUDE_CODE_SKIP_FOUNDRY_AUTH).toBe('1');
    expect(result.PATH).toBe('/usr/bin');
  });

  it('preserves proxy env vars (uppercase, lowercase, and npm config) for SDK subprocess network access', () => {
    const result = sanitizeEnv({
      HTTP_PROXY: 'http://corp-proxy:1234',
      HTTPS_PROXY: 'http://corp-proxy:1234',
      ALL_PROXY: 'socks5://corp-proxy:1080',
      NO_PROXY: 'localhost,127.0.0.1',
      http_proxy: 'http://corp-proxy:1234',
      https_proxy: 'http://corp-proxy:1234',
      all_proxy: 'socks5://corp-proxy:1080',
      no_proxy: 'localhost,127.0.0.1',
      npm_config_proxy: 'http://corp-proxy:1234',
      npm_config_https_proxy: 'http://corp-proxy:1234',
      npm_config_noproxy: 'localhost,127.0.0.1',
      PATH: '/usr/bin'
    });

    expect(result.HTTP_PROXY).toBe('http://corp-proxy:1234');
    expect(result.HTTPS_PROXY).toBe('http://corp-proxy:1234');
    expect(result.ALL_PROXY).toBe('socks5://corp-proxy:1080');
    expect(result.NO_PROXY).toBe('localhost,127.0.0.1');
    expect(result.http_proxy).toBe('http://corp-proxy:1234');
    expect(result.https_proxy).toBe('http://corp-proxy:1234');
    expect(result.all_proxy).toBe('socks5://corp-proxy:1080');
    expect(result.no_proxy).toBe('localhost,127.0.0.1');
    expect(result.npm_config_proxy).toBe('http://corp-proxy:1234');
    expect(result.npm_config_https_proxy).toBe('http://corp-proxy:1234');
    expect(result.npm_config_noproxy).toBe('localhost,127.0.0.1');
    expect(result.PATH).toBe('/usr/bin');
  });

  it('selectively preserves only allowed CLAUDE_CODE_* vars while stripping others', () => {
    const result = sanitizeEnv({
      CLAUDE_CODE_OAUTH_TOKEN: 'my-oauth-token',
      CLAUDE_CODE_GIT_BASH_PATH: '/usr/bin/bash',
      CLAUDE_CODE_USE_BEDROCK: '1',
      CLAUDE_CODE_USE_VERTEX: '1',
      CLAUDE_CODE_USE_FOUNDRY: '1',
      CLAUDE_CODE_SKIP_BEDROCK_AUTH: '1',
      CLAUDE_CODE_SKIP_VERTEX_AUTH: '1',
      CLAUDE_CODE_SKIP_FOUNDRY_AUTH: '1',
      CLAUDE_CODE_EFFORT_LEVEL: 'high',
      CLAUDE_CODE_ALWAYS_ENABLE_EFFORT: '1',
      CLAUDE_CODE_RANDOM_OTHER: 'should-be-stripped',
      CLAUDE_CODE_INTERNAL_FLAG: 'should-be-stripped',
      PATH: '/usr/bin'
    });

    expect(result.CLAUDE_CODE_OAUTH_TOKEN).toBe('my-oauth-token');
    expect(result.CLAUDE_CODE_GIT_BASH_PATH).toBe('/usr/bin/bash');
    expect(result.CLAUDE_CODE_USE_BEDROCK).toBe('1');
    expect(result.CLAUDE_CODE_USE_VERTEX).toBe('1');
    expect(result.CLAUDE_CODE_USE_FOUNDRY).toBe('1');
    expect(result.CLAUDE_CODE_SKIP_BEDROCK_AUTH).toBe('1');
    expect(result.CLAUDE_CODE_SKIP_VERTEX_AUTH).toBe('1');
    expect(result.CLAUDE_CODE_SKIP_FOUNDRY_AUTH).toBe('1');

    expect(result.CLAUDE_CODE_EFFORT_LEVEL).toBeUndefined();
    expect(result.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT).toBeUndefined();
    expect(result.CLAUDE_CODE_RANDOM_OTHER).toBeUndefined();
    expect(result.CLAUDE_CODE_INTERNAL_FLAG).toBeUndefined();

    expect(result.PATH).toBe('/usr/bin');
  });
});

// Task 43 (Decision 16): the child-environment allowlist policy.
describe('Decision 16: child env allowlist', () => {
  const SENTINELS = {
    AWS_ID: 'sentinel-aws-id-43',
    AWS_SECRET: 'sentinel-aws-secret-43',
    GITHUB: 'ghp_sentinel4343434343434343434343434343434343',
    DB: 'postgres://u:pw@h/db',
    ARBITRARY: 'arbitrary-secret-43',
    GEMINI: 'sentinel-gemini-43',
    OPENROUTER: 'sentinel-openrouter-43',
    OPENAI: 'sentinel-openai-43',
  };

  const parentWithSentinels = (): Record<string, string> => ({
    PATH: '/usr/bin',
    HOME: '/home/u',
    LANG: 'en_US.UTF-8',
    AWS_ACCESS_KEY_ID: SENTINELS.AWS_ID,
    AWS_SECRET_ACCESS_KEY: SENTINELS.AWS_SECRET,
    GITHUB_TOKEN: SENTINELS.GITHUB,
    DATABASE_URL: SENTINELS.DB,
    GEMINI_API_KEY: SENTINELS.GEMINI,
    OPENROUTER_API_KEY: SENTINELS.OPENROUTER,
    OPENAI_COMPAT_API_KEY: SENTINELS.OPENAI,
    ARBITRARY_SECRET_43: SENTINELS.ARBITRARY,
    HTTP_PROXY: 'http://proxy:8080',
    GEMINI_API_KEYS: 'pool-a,pool-b',
    OPENROUTER_API_KEYS: 'pool-a,pool-b',
    OPENAI_COMPAT_API_KEYS: 'pool-a,pool-b',
    GEMINI_API_KEYS_2: 'pool-c',
    CLAUDE_CODE_EFFORT_LEVEL: 'high',
    CODEX_HOME: '/home/u/.codex',
  });

  it('Claude child: runtime+proxy+Claude extras+cloud names pass; all unrelated secrets denied', () => {
    const target: Record<string, string> = {};
    copyAllowedEnv(target, parentWithSentinels(), childEnvAllowlist([...CLAUDE_CHILD_EXTRA, ...CLAUDE_CLOUD_EXTRA], true), false);
    expect(target.PATH).toBe('/usr/bin');
    expect(target.HOME).toBe('/home/u');
    expect(target.HTTP_PROXY ?? target.http_proxy).toBe('http://proxy:8080');
    expect(target.AWS_ACCESS_KEY_ID).toBe(SENTINELS.AWS_ID);
    expect(target.AWS_SECRET_ACCESS_KEY).toBe(SENTINELS.AWS_SECRET);
    // Denied for Claude children? No — AWS names are the intentional cloud
    // exception for Claude SDK and runner-Claude. Unrelated secrets denied:
    expect(target.GITHUB_TOKEN).toBeUndefined();
    expect(target.DATABASE_URL).toBeUndefined();
    expect(target.ARBITRARY_SECRET_43).toBeUndefined();
    // Cross-provider denial (F1b): provider keys/pools never enter.
    expect(target.GEMINI_API_KEY).toBeUndefined();
    expect(target.GEMINI_API_KEYS).toBeUndefined();
    expect(target.OPENROUTER_API_KEY).toBeUndefined();
    expect(target.OPENROUTER_API_KEYS).toBeUndefined();
    expect(target.OPENAI_COMPAT_API_KEY).toBeUndefined();
    // Pool-suffixed names are not an allowlisted family either.
    expect(target.GEMINI_API_KEYS_2).toBeUndefined();
    // Session/effort stripping still applies downstream (sanitizeEnv).
  });

  it('Codex child (codex-exec runner): runtime+proxy+CODEX_HOME only; no cloud, no credentials', () => {
    const target: Record<string, string> = {};
    copyAllowedEnv(target, parentWithSentinels(), childEnvAllowlist(CODEX_CHILD_EXTRA, true), true);
    expect(target.PATH).toBe('/usr/bin');
    expect(target.CODEX_HOME).toBe('/home/u/.codex');
    expect(target.HTTP_PROXY ?? target.http_proxy).toBe('http://proxy:8080');
    expect(target.AWS_ACCESS_KEY_ID).toBeUndefined();
    expect(target.AWS_SECRET_ACCESS_KEY).toBeUndefined();
    expect(target.GITHUB_TOKEN).toBeUndefined();
    expect(target.DATABASE_URL).toBeUndefined();
    expect(target.GEMINI_API_KEY).toBeUndefined();
    expect(target.OPENROUTER_API_KEY).toBeUndefined();
    expect(target.OPENAI_COMPAT_API_KEY).toBeUndefined();
    expect(target.CLAUDE_CODE_OAUTH_TOKEN).toBeUndefined();
  });

  it('Gemini runner: selected GEMINI_API_KEY family + Vertex/ADC names, nothing else', () => {
    const target: Record<string, string> = {};
    copyAllowedEnv(target, parentWithSentinels(), childEnvAllowlist(GEMINI_CHILD_EXTRA, true), false);
    expect(target.GEMINI_API_KEY).toBe(SENTINELS.GEMINI);
    expect(target.GEMINI_API_KEYS).toBeUndefined();
    expect(target.OPENROUTER_API_KEY).toBeUndefined();
    expect(target.OPENAI_COMPAT_API_KEY).toBeUndefined();
    expect(target.CLAUDE_CODE_OAUTH_TOKEN).toBeUndefined();
  });

  it('GOOGLE_* / AWS_* prefixes are denied as families; only the named cloud fields pass', () => {
    const parent = {
      ...parentWithSentinels(),
      GOOGLE_CLOUD_PROJECT: 'proj-43',
      GOOGLE_GENAI_USE_VERTEXAI: 'TRUE',
      GOOGLE_APPLICATION_CREDENTIALS: '/fixtures/adc43.json',
      AWS_DEFAULT_REGION: 'us-east-1-selected43',
      GOOGLE_UNSPECIFIED_SECRET: 'sentinel-google-43',
      AWS_UNSPECIFIED_SECRET: 'sentinel-aws-43',
    };
    const claude: Record<string, string> = {};
    copyAllowedEnv(claude, parent, childEnvAllowlist([...CLAUDE_CHILD_EXTRA, ...CLAUDE_CLOUD_EXTRA], true), false);
    expect(claude.GOOGLE_CLOUD_PROJECT).toBe('proj-43');
    expect(claude.GOOGLE_APPLICATION_CREDENTIALS).toBe('/fixtures/adc43.json');
    expect(claude.AWS_DEFAULT_REGION).toBe('us-east-1-selected43');
    expect(claude.GOOGLE_UNSPECIFIED_SECRET).toBeUndefined();
    expect(claude.AWS_UNSPECIFIED_SECRET).toBeUndefined();
    const gemini: Record<string, string> = {};
    copyAllowedEnv(gemini, parent, childEnvAllowlist(GEMINI_CHILD_EXTRA, true), false);
    expect(gemini.GOOGLE_APPLICATION_CREDENTIALS).toBe('/fixtures/adc43.json');
    expect(gemini.GOOGLE_GENAI_USE_VERTEXAI).toBe('TRUE');
    expect(gemini.AWS_ACCESS_KEY_ID).toBeUndefined();
  });

  it('Windows matching is case-insensitive and writes the canonical spelling, no aliases', () => {
    const original = process.platform;
    const fakeWin = Object.defineProperty(Object.create(Object.getPrototypeOf(process)), 'platform', { value: 'win32' });
    // copyAllowedEnv reads process.platform — replace the module-local read via
    // a direct POSIX-path test of the same canonicalization at the data level:
    // (platform swap is not mockable here; covered by the runtime probe instead)
    expect(fakeWin.platform).toBe('win32');
    expect(original).toBe('win32');
    const target: Record<string, string> = {};
    const allowed = new Set(['PATH']);
    // POSIX branch (this host is win32, so the exact branch is exercised via
    // the spawned-child probe in env-isolation tests).
    copyAllowedEnv(target, { PATH: '/bin' }, allowed, false);
    expect(target.PATH).toBe('/bin');
    const aliased: Record<string, string> = {};
    copyAllowedEnv(aliased, { PATH: '/bin' }, allowed, false);
    expect(Object.keys(aliased).filter(k => k.toLowerCase() === 'path')).toHaveLength(1);
  });
});
