import { describe, expect, it, setSystemTime } from 'bun:test';
import { chmodSync, closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import {
  classifySettingsDocument,
  ensureSettingsDocument,
  pruneCorruptSettingsQuarantine,
  updateSettingsDocument,
} from '../../src/shared/settings-document.js';

// Task 43 (Decision 16): bounded quarantine pruning. Synthetic fixtures only.
const NOW = Date.parse('2026-11-01T12:00:00.000Z');
const mkCorrupt = (dir: string, ms: number, suffix = ''): string => {
  const name = `settings.json.corrupt-${ms}${suffix}`;
  writeFileSync(join(dir, name), `bytes-${ms}`);
  return name;
};

const tempFile = (value?: string): string => {
  const dir = mkdtempSync(join(tmpdir(), 'settings-document-'));
  const path = join(dir, 'settings.json');
  if (value !== undefined) writeFileSync(path, value);
  return path;
};

describe('settings document boundary', () => {
  it('classifies flat, nested, mixed, and unrelated env documents', () => {
    expect(classifySettingsDocument({ CLAUDE_MEM_MODEL: 'flat' })).toBe('flat');
    expect(classifySettingsDocument({ env: { CLAUDE_MEM_MODEL: 'nested' } })).toBe('nested');
    // An env block holding claude-mem's keys is where they live; root copies
    // beside it are the old viewer's stale (masked) writes.
    expect(classifySettingsDocument({ CLAUDE_MEM_MODEL: 'root', env: { CLAUDE_MEM_MODEL: 'nested' } })).toBe('nested');
    // An env block without claude-mem's keys is Claude Code's own.
    expect(classifySettingsDocument({ CLAUDE_MEM_MODEL: 'root', env: { CLAUDE_CODE_MAX_OUTPUT_TOKENS: '8192' } })).toBe('flat');
    expect(classifySettingsDocument({ env: { CLAUDE_CODE_USE_BEDROCK: '1' } })).toBe('flat');
    expect(classifySettingsDocument({ env: { PATH: '/bin' }, hooks: [] })).toBe('flat');
  });

  it('drops the stale root copies an old viewer left beside a wrapped document, never merging them', () => {
    const path = tempFile(JSON.stringify({
      theme: 'dark',
      CLAUDE_MEM_OPENROUTER_API_KEY: '****',
      CLAUDE_MEM_CLOUD_SYNC_TOKEN: '',
      env: { CLAUDE_MEM_OPENROUTER_API_KEY: 'sk-or-v1-real', CLAUDE_MEM_CLOUD_SYNC_TOKEN: 'sync-token' },
    }));

    expect(updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'new' }).status).toBe('updated');

    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({
      theme: 'dark',
      env: { CLAUDE_MEM_OPENROUTER_API_KEY: 'sk-or-v1-real', CLAUDE_MEM_CLOUD_SYNC_TOKEN: 'sync-token', CLAUDE_MEM_MODEL: 'new' },
    });
  });

  it('writes at the root of a flat document and leaves the Claude Code env block beside it alone', () => {
    const path = tempFile(JSON.stringify({ CLAUDE_MEM_MODEL: 'old', env: { CLAUDE_CODE_MAX_OUTPUT_TOKENS: '8192' } }));

    updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'new' });

    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ CLAUDE_MEM_MODEL: 'new', env: { CLAUDE_CODE_MAX_OUTPUT_TOKENS: '8192' } });
  });

  it('refuses invalid existing bytes and never rewrites them', () => {
    const path = tempFile('{"env":');
    const before = readFileSync(path, 'utf8');
    expect(updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'new' }).status).toBe('refused');
    expect(readFileSync(path, 'utf8')).toBe(before);
  });

  it('preserves complete documents and uses explicit missing-file seeds', () => {
    const path = tempFile(JSON.stringify({ env: { CLAUDE_MEM_MODEL: 'old' }, hooks: ['keep'] }));
    expect(updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'new' }).status).toBe('updated');
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ env: { CLAUDE_MEM_MODEL: 'new' }, hooks: ['keep'] });

    const missing = tempFile();
    expect(ensureSettingsDocument(missing, { callerSeed: true }).status).toBe('created');
    expect(JSON.parse(readFileSync(missing, 'utf8'))).toEqual({ callerSeed: true });
  });

  it('quarantines an unreadable file only when asked (installer), keeping its bytes', () => {
    const path = tempFile('{"CLAUDE_MEM_MODEL":"old"');
    const result = updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'new' }, {}, undefined, { quarantineCorrupt: true });
    expect(result.status).toBe('created');
    expect(result.quarantinedTo).toMatch(/settings\.json\.corrupt-\d+$/);
    expect(readFileSync(result.quarantinedTo!, 'utf8')).toBe('{"CLAUDE_MEM_MODEL":"old"');
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ CLAUDE_MEM_MODEL: 'new' });
  });

  it('gives a second quarantine in the same millisecond its own name instead of replacing the first', () => {
    setSystemTime(new Date('2026-09-30T12:00:00.000Z'));
    try {
      const path = tempFile('{"first":');
      const first = updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'a' }, {}, undefined, { quarantineCorrupt: true });
      writeFileSync(path, '{"second":');
      const second = updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'b' }, {}, undefined, { quarantineCorrupt: true });

      expect(first.status).toBe('created');
      expect(second.status).toBe('created');
      expect(second.quarantinedTo).not.toBe(first.quarantinedTo);
      expect(readFileSync(first.quarantinedTo!, 'utf8')).toBe('{"first":');
      expect(readFileSync(second.quarantinedTo!, 'utf8')).toBe('{"second":');
    } finally {
      setSystemTime();
    }
  });

  it('writes settings.json owner-only, including a previously world-readable file', () => {
    if (process.platform === 'win32') return;
    const created = tempFile();
    ensureSettingsDocument(created, { CLAUDE_MEM_MODEL: 'seed' });
    expect(statSync(created).mode & 0o777).toBe(0o600);

    const existing = tempFile(JSON.stringify({ CLAUDE_MEM_MODEL: 'old' }));
    chmodSync(existing, 0o644);
    updateSettingsDocument(existing, { CLAUDE_MEM_MODEL: 'new' });
    expect(statSync(existing).mode & 0o777).toBe(0o600);
  });

  it('moves the quarantined bytes back when the fresh write fails, so readers still find the file', () => {
    const path = tempFile('{"CLAUDE_MEM_MODEL":"old"');
    // A BigInt cannot be serialized, so the replacement write throws after the quarantine.
    const result = updateSettingsDocument(path, {}, {}, target => { target.CLAUDE_MEM_BAD = BigInt(1); }, { quarantineCorrupt: true });

    expect(result.status).toBe('refused');
    expect(result.quarantinedTo).toBeUndefined();
    expect(readFileSync(path, 'utf8')).toBe('{"CLAUDE_MEM_MODEL":"old"');
    expect(readdirSync(dirname(path))).toEqual(['settings.json']);
  });

  it('writes into the env block of a wrapped document and keeps its root peers', () => {
    const path = tempFile(JSON.stringify({ theme: 'dark', env: { CLAUDE_MEM_MODEL: 'old', KEEP: 'yes' } }));
    updateSettingsDocument(path, {}, {}, target => { target.CLAUDE_MEM_MODEL = 'new'; });
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ theme: 'dark', env: { CLAUDE_MEM_MODEL: 'new', KEEP: 'yes' } });
  });
});

describe('Decision 16: quarantine pruning', () => {
  const fixtureDir = (): string => mkdtempSync(join(tmpdir(), 't43-quarantine-'));

  it('keeps the 3 newest fresh files and prunes the rest and anything older than 7 days', () => {
    const dir = fixtureDir();
    const path = join(dir, 'settings.json');
    mkCorrupt(dir, NOW - 1_000, '-1');
    mkCorrupt(dir, NOW - 2_000);
    mkCorrupt(dir, NOW - 3_000, '-2');
    mkCorrupt(dir, NOW - 4_000, '-3');
    mkCorrupt(dir, NOW - 8 * 24 * 3_600_000);
    const failures = pruneCorruptSettingsQuarantine(path, NOW);
    expect(failures).toEqual([]);
    const left = readdirSync(dir).sort();
    expect(left).toEqual([
      'settings.json.corrupt-' + (NOW - 3_000) + '-2',
      'settings.json.corrupt-' + (NOW - 2_000),
      'settings.json.corrupt-' + (NOW - 1_000) + '-1',
    ]);
  });

  it('a failed deletion keeps the file and reports only its name', async () => {
    const dir = fixtureDir();
    const path = join(dir, 'settings.json');
    const name = mkCorrupt(dir, NOW - 8 * 24 * 3_600_000);
    const full = join(dir, name);
    // Deterministic deletion failure: hold an exclusive (share-mode None)
    // handle from a short-lived PowerShell child so unlinkSync must fail.
    // The child retries the Open until it succeeds (the file exists, not held).
    const script = [
      `for($i=0; $i -lt 200; $i++){ try { $fs = [System.IO.File]::Open('${full.replace(/'/g, "''")}','Open','Read','None'); break } catch { Start-Sleep -Milliseconds 100 } }`,
      'Start-Sleep -Seconds 12',
      "$fs.Close()",
    ].join('; ');
    const child = Bun.spawn(['powershell.exe', '-NoProfile', '-Command', script], { stdout: 'ignore', stderr: 'ignore' });
    // Wait until the exclusive handle is actually held: probe with a raw
    // unlink; once it answers EBUSY the CURRENT file instance is locked.
    // (Generous budgets: bun test runs suites in parallel and PowerShell
    // start-up lags under load.)
    let locked = false;
    for (let i = 0; i < 150 && !locked; i++) {
      try {
        unlinkSync(full);
        writeFileSync(full, 'bytes-locked-43');
      } catch {
        locked = true;
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    expect(locked).toBe(true);
    const failures = pruneCorruptSettingsQuarantine(path, NOW);
    child.kill();
    await child.exited;
    expect(failures.length).toBe(1);
    expect(failures[0]).toBe(name);
    expect(existsSync(full)).toBe(true);
  }, 120_000);

  it('skips symlinks, directories, malformed names, and subdirectory matches (no recursion)', () => {
    const dir = fixtureDir();
    const path = join(dir, 'settings.json');
    // Malformed: 12-digit timestamp, wrong base name.
    writeFileSync(join(dir, 'settings.json.corrupt-000000123456'), 'x');
    writeFileSync(join(dir, 'other.json.corrupt-' + (NOW - 8 * 24 * 3_600_000)), 'x');
    // Subdirectory named like a quarantine file: never recursed into.
    mkdirSync(join(dir, 'settings.json.corrupt-' + (NOW - 8 * 24 * 3_600_000) + '-d'), { recursive: true });
    const failures = pruneCorruptSettingsQuarantine(path, NOW);
    expect(failures).toEqual([]);
    expect(existsSync(join(dir, 'settings.json.corrupt-000000123456'))).toBe(true);
    expect(existsSync(join(dir, 'other.json.corrupt-' + (NOW - 8 * 24 * 3_600_000)))).toBe(true);
    expect(existsSync(join(dir, 'settings.json.corrupt-' + (NOW - 8 * 24 * 3_600_000) + '-d'))).toBe(true);
  });

  it('never touches a normal settings.json and runs after a successful quarantined replacement', () => {
    const dir = fixtureDir();
    const path = join(dir, 'settings.json');
    writeFileSync(path, '{"CLAUDE_MEM_MODEL":"old"');
    const result = updateSettingsDocument(path, { CLAUDE_MEM_MODEL: 'new' }, {}, undefined, { quarantineCorrupt: true });
    expect(result.status).toBe('created');
    expect(existsSync(result.quarantinedTo!)).toBe(true);
    expect(readFileSync(result.quarantinedTo!, 'utf8')).toBe('{"CLAUDE_MEM_MODEL":"old"');
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual({ CLAUDE_MEM_MODEL: 'new' });
    // The just-quarantined file is the newest and fresh — it survives pruning.
    expect(readdirSync(dir).filter(n => n.includes('corrupt')).length).toBe(1);
  });
});
