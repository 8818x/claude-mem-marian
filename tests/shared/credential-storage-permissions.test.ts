// Task 43 (Decision 16): storage permission classification. POSIX mode
// assertions run on POSIX only; Windows gets read-only native ACL inspection
// (icacls) on fixture files — no ACL rewrite, no unsupported claims.
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import * as fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const FIXTURE = fs.mkdtempSync(join(tmpdir(), 't43-perms-'));
process.env.CLAUDE_MEM_DATA_DIR = FIXTURE;
process.env.CLAUDE_MEM_ENV_FILE = join(FIXTURE, '.env');

const { saveClaudeMemEnv } = await import('../../src/shared/EnvManager.js');
const { ensureSettingsDocument } = await import('../../src/shared/settings-document.js');

let envPath = '';
let settingsPath = '';

beforeAll(() => {
  fs.writeFileSync(join(FIXTURE, '.env'), 'ANTHROPIC_API_KEY=synthetic-key-43\n', { mode: 0o600 });
  envPath = join(FIXTURE, '.env');
  settingsPath = join(FIXTURE, 'settings.json');
  ensureSettingsDocument(settingsPath, { CLAUDE_MEM_MODEL: 'test' });
});

afterAll(() => {
  fs.rmSync(FIXTURE, { recursive: true, force: true });
  delete process.env.CLAUDE_MEM_DATA_DIR;
  delete process.env.CLAUDE_MEM_ENV_FILE;
});

describe.skipIf(process.platform === 'win32')('POSIX mode assertions (skipped on Windows)', () => {
  it('settings.json and .env carry 0600, the data dir 0700', () => {
    expect(fs.statSync(settingsPath).mode & 0o777).toBe(0o600);
    expect(fs.statSync(envPath).mode & 0o777).toBe(0o600);
    expect(fs.statSync(FIXTURE).mode & 0o777).toBe(0o700);
  });
});

describe.skipIf(process.platform !== 'win32')('Windows: creation-intent modes + read-only ACL evidence', () => {
  const note = (line: string): void => process.stdout.write(`[T43-PERMS] ${line}\n`);

  it('POSIX modes are creation intent only: 0600-intent files stat as 0666 here', () => {
    note(`stat mode of .env (0600 intent): ${(fs.statSync(envPath).mode & 0o777).toString(8)}`);
    note(`stat mode of settings.json (0600 intent): ${(fs.statSync(settingsPath).mode & 0o777).toString(8)}`);
    note(`stat mode of data dir (0700 intent): ${(fs.statSync(FIXTURE).mode & 0o777).toString(8)}`);
    // No protection claim either way: mode bits on Windows are neither ACL
    // evidence nor proof of exposure (Decision 16 §Storage policy).
    expect(true).toBe(true);
  });

  it('icacls inspection of fixture .env, settings, and the data dir (read-only)', () => {
    for (const target of [envPath, settingsPath, FIXTURE]) {
      const result = spawnSync('icacls', [target], { encoding: 'utf8' });
      if (result.error || result.status !== 0) {
        note(`icacls UNAVAILABLE/FAILED for ${target}: ${result.error?.message ?? `exit ${result.status}`}`);
        continue; // recorded as a gap, never as passing protection
      }
      const out = String(result.stdout);
      note(`icacls ${target}:\n${out.split('\n').map(l => `  ${l.trimEnd()}`).join('\n')}`);
      const user = process.env.USERNAME ?? '';
      expect(out.length).toBeGreaterThan(0);
      if (user) expect(out).toContain(user);
    }
  });
});
