// Task 43 (Decision 16): the logger's mandatory, always-on credential scrub
// at the final serialization boundary. Fixture data dir; capture via spies —
// no real ~/.claude-mem state is touched.
import { describe, it, expect, beforeAll, afterAll, afterEach, spyOn } from 'bun:test';
import * as fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const FIXTURE_DATA = fs.mkdtempSync(join(tmpdir(), 't43-logger-'));
process.env.CLAUDE_MEM_DATA_DIR = FIXTURE_DATA;

const { logger } = await import('../../src/utils/logger.js');
const { registerScrubValues, _resetScrubValues } = await import('../../src/utils/credential-redaction.js');
const hookIoModule = await import('../../src/shared/hook-io.js');

const FIXTURE_TOKEN = 't43-sync-token-abcdef43';

afterEach(() => _resetScrubValues());

describe('logger credential boundary', () => {
  let captured: string[] = [];
  let appendSpy: ReturnType<typeof spyOn> | undefined;

  beforeAll(() => {
    appendSpy = spyOn(logger as unknown as Record<string, unknown>, 'appendLine').mockImplementation(
      (path: unknown, text: unknown) => {
        captured = [...captured, String(text)];
      },
    );
  });

  afterAll(() => {
    (appendSpy as unknown as { mockRestore: () => void }).mockRestore();
    fs.rmSync(FIXTURE_DATA, { recursive: true, force: true });
    delete process.env.CLAUDE_MEM_DATA_DIR;
  });

  it('scrubs message + context + data in one assembled line (INFO)', () => {
    registerScrubValues([FIXTURE_TOKEN]);
    logger.error('SYNC_CLIENT', `hub echoed ${FIXTURE_TOKEN}`, { pauseMs: 1000 }, new Error('x-failed-43'));
    const line = captured.find(l => l.includes('hub echoed') && l.includes('SYNC_CLIENT'));
    expect(line).toBeDefined();
    expect(line).not.toContain(FIXTURE_TOKEN);
    expect(line).toContain('pauseMs=1000');
    expect(line).toContain('x-failed-43');
  });

  it('scrubs DEBUG serialization of structured data', () => {
    // Force DEBUG level: the logger caches level from settings; use the
    // private field (same instance the suite captured appendLine from).
    const anyLogger = logger as unknown as { level: number | null };
    const saved = anyLogger.level;
    anyLogger.level = 0; // LogLevel.DEBUG
    try {
      logger.debug('SYNC_CLIENT', 'debug payload', { note: 'ctx43' }, { body: `token=${FIXTURE_TOKEN}` });
    } finally {
      anyLogger.level = saved;
    }
    const line = captured.find(l => l.includes('debug payload'));
    expect(line).toBeDefined();
    expect(line).not.toContain(FIXTURE_TOKEN);
    expect(line).toContain('ctx43');
  });

  it('scrubs the logger-failure diagnostic (stderr fallback of a failed append)', () => {
    const emitted: string[] = [];
    const spy = spyOn(hookIoModule, 'emitDiagnostic').mockImplementation((text: unknown) => {
      emitted.push(String(text));
    });
    try {
      const appendOrig = (logger as unknown as Record<string, unknown>).appendLine;
      (logger as unknown as Record<string, unknown>).appendLine = () => {
        throw new Error(`write failed: Bearer ${FIXTURE_TOKEN}`);
        };
      try {
        logger.error('WORKER', 'append blew up 43', undefined, new Error('payload'));
      } finally {
        (logger as unknown as Record<string, unknown>).appendLine = appendOrig;
      }
      const line = emitted.find(t => t.includes('Failed to write to log file'));
      expect(line).toBeDefined();
      expect(line).not.toContain(FIXTURE_TOKEN);
    } finally {
      spy.mockRestore();
    }
  });

  it('Stage M: loopback sync 401 echo through production error construction stays out of the log', async () => {
    registerScrubValues([FIXTURE_TOKEN]);
    const server = Bun.serve({
      port: 0,
      hostname: '127.0.0.1',
      fetch: async (request: Request) => {
        const auth = request.headers.get('authorization') ?? '';
        // The hub echoes the caller's bearer back in a 401 body.
        return new Response(`unauthorized echo: ${auth}`, { status: 401 });
      },
    });
    const { Database } = await import('bun:sqlite');
    const { SessionStore } = await import('../../src/services/sqlite/SessionStore.js');
    const { SyncApply } = await import('../../src/services/sync/SyncApply.js');
    const { SyncClient } = await import('../../src/services/sync/SyncClient.js');
    const db = new Database(':memory:');
    new SessionStore(db);
    const apply = new SyncApply(db, { deviceId: 'device-t43' });
    const client = new SyncClient(apply, {
      hubUrl: `http://127.0.0.1:${server.port}`,
      token: FIXTURE_TOKEN,
      userId: 'user-t43',
      deviceId: 'device-t43',
      fetchImpl: ((input: any, init?: any) => fetch(input, init)) as typeof fetch,
      wsEnabled: false,
      backoffInitialMs: 10,
      backoffMaxMs: 20,
      minPullGapMs: 0,
    });
    try {
      await client.pullOnce(5000);
      await new Promise(resolve => setTimeout(resolve, 50));
    } finally {
      client.stop();
      db.close();
      server.stop(true);
    }
    const lines = captured.filter(l => l.includes('SYNC_CLIENT'));
    const leakLine = lines.find(l => l.includes(FIXTURE_TOKEN));
    expect(leakLine).toBeUndefined();
    const pauseLine = lines.find(l => l.includes('Rejected by the sync server'));
    expect(pauseLine).toBeDefined();
    expect(pauseLine).toContain('401');
    expect(pauseLine).toContain('withheld');
  });
});