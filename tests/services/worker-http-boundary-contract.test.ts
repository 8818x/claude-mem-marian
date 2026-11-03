// SPDX-License-Identifier: Apache-2.0
//
// Decision 17 worker HTTP boundary contract (Task 42).
//
// Covers the binding/token contract, the TV remote read-only surface, loopback
// compatibility, Origin/Host/forwarded-header policy, and spool authentication
// independence. Isolated: express fixtures bind loopback port 0 only; the
// real-process refusal probes spawn the worker entrypoint against disposable
// HOME/USERPROFILE/CLAUDE_CONFIG_DIR/CLAUDE_MEM_DATA_DIR fixture state. No real
// user state is touched and no listener is ever bound to a non-loopback
// address — the token-required non-loopback path is exercised as a refusal
// before listen(), never as a live bind.
//
// The remote guard's 23-case matrix lives in tests/server/tv-remote-guard.test.ts;
// this file re-covers the Decision 17 contract points against the current tree.

import { afterAll, beforeAll, describe, expect, it, spyOn } from 'bun:test';
import { spawn } from 'child_process';
import { request } from 'node:http';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import express from 'express';
import type { Application, Request, Response } from 'express';
import {
  createMiddleware,
  decideRemoteAccess,
  isLoopbackBindHost,
  workerBindRefusal,
} from '../../src/services/worker/http/middleware.js';
import { hasForwardedClientHeaders, isLocalhost } from '../../src/server/middleware/request-auth-helpers.js';
import { Server, type ServerOptions } from '../../src/services/server/Server.js';
import { listenOnEphemeralPort } from '../helpers/ephemeral-port.js';
import { logger } from '../../src/utils/logger.js';
import { HookSpool } from '../../src/shared/hook-spool.js';
import { HookSpoolRoutes } from '../../src/services/worker/http/routes/HookSpoolRoutes.js';
import { hookSpoolConsumedMarkers } from '../../src/services/worker/hook-spool-drain.js';
import { SessionStore } from '../../src/services/sqlite/SessionStore.js';

const TV_TOKEN = 'task42-tv-synthetic-token';
const INGEST_TOKEN = 'task42-ingest-synthetic-token';
const REMOTE = { 'x-forwarded-for': '203.0.113.5' };

// ---------------------------------------------------------------------------
// Bind classification and token contract (Decision 17 Stage B)
// ---------------------------------------------------------------------------

describe('bind classification — isLoopbackBindHost', () => {
  it('accepts only the established loopback forms the codebase already treats as local', () => {
    for (const host of ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost', '[::1]', 'LOCALHOST', ' 127.0.0.1 ']) {
      expect(isLoopbackBindHost(host)).toBe(true);
    }
  });

  it('classifies wildcard, LAN, DNS, ambiguous, and 127/8-off-form binds as non-loopback', () => {
    for (const host of ['', '   ', '0.0.0.0', '::', '192.0.2.10', 'worker.internal', '127.0.0.2', '127.1', '0:0:0:0:0:0:0:1', 'evil.example']) {
      expect(isLoopbackBindHost(host)).toBe(false);
    }
  });

  it('never gains locality from request headers — helpers consulted for the record', () => {
    // These stay header-driven per request; the bind classifier is the only
    // startup-locality input and takes no request object at all.
    expect(isLocalhost({ ip: '127.0.0.1' } as never)).toBe(true);
    expect(hasForwardedClientHeaders({ header: (n: string) => (n === 'x-forwarded-for' ? '1.2.3.4' : undefined) } as never)).toBe(true);
  });
});

describe('token contract — workerBindRefusal', () => {
  it('allows loopback binds with or without a token', () => {
    for (const host of ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost']) {
      expect(workerBindRefusal(host, undefined)).toBeNull();
      expect(workerBindRefusal(host, '')).toBeNull();
      expect(workerBindRefusal(host, TV_TOKEN)).toBeNull();
    }
  });

  it('refuses non-loopback binds on missing, empty, and whitespace-only tokens', () => {
    for (const host of ['0.0.0.0', '::', '', '192.0.2.10', 'worker.internal', '127.0.0.2']) {
      expect(workerBindRefusal(host, undefined)).toBeString();
      expect(workerBindRefusal(host, '')).toBeString();
      expect(workerBindRefusal(host, '   ')).toBeString();
      expect(workerBindRefusal(host, TV_TOKEN)).toBeNull();
    }
  });

  it('names the two settings and never prints a token value', () => {
    const refusal = workerBindRefusal('0.0.0.0', '');
    expect(refusal).toContain('CLAUDE_MEM_TV_TOKEN');
    expect(refusal).toContain('CLAUDE_MEM_WORKER_HOST');
    expect(refusal).toContain('Refusing to bind');
    expect(refusal).not.toContain(TV_TOKEN);
  });
});

// ---------------------------------------------------------------------------
// Real-process startup refusal — exit 78 before any listener exists.
// Disposable HOME/USERPROFILE/CLAUDE_CONFIG_DIR/CLAUDE_MEM_DATA_DIR; a synthetic
// token is used only as a negative (it must never appear in output).
// ---------------------------------------------------------------------------

const fixtureRoot = mkdtempSync(join(tmpdir(), 'task42-refusal-'));
const REFUSAL_PORT = 39471;
const spawnEnvBase = (): Record<string, string> => ({
  ...process.env,
  HOME: fixtureRoot,
  USERPROFILE: fixtureRoot,
  CLAUDE_CONFIG_DIR: join(fixtureRoot, 'claude-config'),
  CLAUDE_MEM_DATA_DIR: join(fixtureRoot, 'data'),
  CLAUDE_MEM_WORKER_AUTOSTART: 'false',
  CLAUDE_MEM_WORKER_HOST: '0.0.0.0',
  CLAUDE_MEM_WORKER_PORT: String(REFUSAL_PORT),
});
const WORKER_ENTRY = join(import.meta.dir, '..', '..', 'src', 'services', 'worker-service.ts');

async function runRefusalSpawn(env: Record<string, string>): Promise<{ code: number; output: string; logText: string }> {
  const child = spawn(process.execPath, [WORKER_ENTRY, '--daemon'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    new Promise<number>((resolve) => child.on('close', resolve)),
  ]);
  // process.exit() can outrace the stdout pipe flush on Windows, so the durable
  // refusal diagnostic is asserted from the worker's own log file as well.
  let logText = '';
  try {
    const logsDir = join(fixtureRoot, 'data', 'logs');
    for (const name of readdirSync(logsDir)) {
      if (name.endsWith('.log')) logText += readFileSync(join(logsDir, name), 'utf8');
    }
  } catch { /* no log dir yet */ }
  return { code, output: stdout + stderr, logText };
}

async function portClosed(port: number): Promise<boolean> {
  try {
    await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(1500) });
    return false; // something answered: a listener exists
  } catch {
    return true; // connection refused / timeout: no listener
  }
}

describe('startup refusal — real worker process (disposable fixture state)', () => {
  it('token missing: exits non-zero before listening, no token anywhere, port stays closed', async () => {
    const env = spawnEnvBase();
    delete env.CLAUDE_MEM_TV_TOKEN;
    const { code, output, logText } = await runRefusalSpawn(env);
    expect(code).toBe(78);
    expect(output + logText).toContain('Refusing to bind');
    expect(logText).toContain('CLAUDE_MEM_TV_TOKEN');
    expect(output + logText).not.toContain(TV_TOKEN);
    expect(await portClosed(REFUSAL_PORT)).toBe(true);
  }, 120_000);

  it('token empty: same refusal', async () => {
    const { code, output, logText } = await runRefusalSpawn({ ...spawnEnvBase(), CLAUDE_MEM_TV_TOKEN: '' });
    expect(code).toBe(78);
    expect(output + logText).toContain('Refusing to bind');
    expect(await portClosed(REFUSAL_PORT)).toBe(true);
  }, 120_000);

  it('token whitespace-only: same refusal — whitespace is OFF, not a secret', async () => {
    const { code, output, logText } = await runRefusalSpawn({ ...spawnEnvBase(), CLAUDE_MEM_TV_TOKEN: '   ' });
    expect(code).toBe(78);
    expect(output + logText).toContain('Refusing to bind');
    expect(await portClosed(REFUSAL_PORT)).toBe(true);
  }, 120_000);
});

// ---------------------------------------------------------------------------
// TV remote surface and loopback compatibility — live Server fixture with the
// guard mounted (same fixture shape as tests/server/tv-remote-guard.test.ts).
// ---------------------------------------------------------------------------

function baseOptions(overrides: Partial<ServerOptions> = {}): ServerOptions {
  return {
    getInitializationComplete: () => true,
    getMcpReady: () => true,
    onShutdown: () => Promise.resolve(),
    onRestart: () => Promise.resolve(),
    workerPath: '/test/worker-service.cjs',
    getAiStatus: () => ({ provider: 'disabled', authMethod: 'api-key', lastInteraction: null }),
    ...overrides,
  };
}

const stubRoutes = {
  setupRoutes(app: Application): void {
    const ok = (_req: Request, res: Response) => { res.json({ stub: true }); };
    app.get('/api/settings', ok);
    app.get('/api/observations', ok);
    app.get('/api/logs', ok);
    app.get('/viewer.html', ok);
    app.post('/api/settings', ok);
    app.delete('/api/observation/1', ok);
    app.get('/', ok);
    app.get('/tv', ok);
    app.get('/tv.html', ok);
    app.get('/stream', ok);
  },
};

let guarded: Server;
let guardedPort = 0;
let hostPolicyServer: Server;
let hostPolicyPort = 0;

async function start(options: ServerOptions): Promise<{ server: Server; port: number }> {
  const server = new Server(options);
  const port = await listenOnEphemeralPort(server);
  server.registerRoutes(stubRoutes);
  return { server, port };
}

async function closeQuietly(server: Server): Promise<void> {
  if (!server?.getHttpServer()) return;
  try { await server.close(); } catch { /* ignore */ }
}

// A request that passes the guard is stamped `Cache-Control: no-store`, which
// makes "allowed" observable independently of the downstream handler.
function allowed(res: globalThis.Response): boolean {
  return res.headers.get('cache-control') === 'no-store';
}

beforeAll(async () => {
  for (const method of ['info', 'warn', 'debug', 'failure'] as const) {
    spyOn(logger, method).mockImplementation(() => {});
  }
  ({ server: guarded, port: guardedPort } = await start(
    baseOptions({ remoteReadOnly: { getToken: () => TV_TOKEN } }),
  ));
  ({ server: hostPolicyServer, port: hostPolicyPort } = await start(
    baseOptions({ originPolicy: { allowedOrigins: [], workerHost: '127.0.0.1' } }),
  ));
});

afterAll(async () => {
  await closeQuietly(guarded);
  await closeQuietly(hostPolicyServer);
  rmSync(fixtureRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 });
});

function guardUrl(path: string): string {
  return `http://127.0.0.1:${guardedPort}${path}`;
}

describe('TV remote surface — only the read-only allowlist is reachable with a valid token', () => {
  it('remote GET /tv, /tv.html, /stream, /api/observations with the correct token: 200 + no-store', async () => {
    for (const path of ['/tv', '/tv.html', '/stream', '/api/observations']) {
      const res = await fetch(guardUrl(path), { headers: { ...REMOTE, 'x-api-key': TV_TOKEN } });
      expect(res.status).toBe(200);
      expect(allowed(res)).toBe(true);
    }
    // Credential presentation via the query parameter alone (EventSource shape).
    const withQuery = await fetch(guardUrl(`/tv?token=${encodeURIComponent(TV_TOKEN)}`), { headers: REMOTE });
    expect(withQuery.status).toBe(200);
    expect(allowed(withQuery)).toBe(true);
  });

  it('remote HEAD /tv with the correct token: 200', async () => {
    const res = await fetch(guardUrl('/tv'), { method: 'HEAD', headers: { ...REMOTE, 'x-api-key': TV_TOKEN } });
    expect(res.status).toBe(200);
  });

  it('remote missing/wrong token on an allowlisted path: 401', async () => {
    for (const headers of [REMOTE, { ...REMOTE, 'x-api-key': 'wrong-task42' }]) {
      const res = await fetch(guardUrl('/tv'), { headers });
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: 'Unauthorized', message: 'Missing or invalid Observation TV token' });
    }
  });

  it('settings GET 404, settings POST 403, memory delete 403, unlisted route 404 — even with the correct token', async () => {
    const settingsGet = await fetch(guardUrl('/api/settings'), { headers: { ...REMOTE, 'x-api-key': TV_TOKEN } });
    expect(settingsGet.status).toBe(404);

    const settingsPost = await fetch(guardUrl('/api/settings'), {
      method: 'POST', headers: { ...REMOTE, 'x-api-key': TV_TOKEN, 'content-type': 'application/json' }, body: '{}',
    });
    expect(settingsPost.status).toBe(403);

    const memoryDelete = await fetch(guardUrl('/api/observation/1'), {
      method: 'DELETE', headers: { ...REMOTE, 'x-api-key': TV_TOKEN },
    });
    expect(memoryDelete.status).toBe(403);

    const unlisted = await fetch(guardUrl('/restart'), { headers: { ...REMOTE, 'x-api-key': TV_TOKEN } });
    expect(unlisted.status).toBe(404);
  });

  it('decideRemoteAccess: only GET/HEAD on the four allowlisted paths pass', () => {
    for (const path of ['/tv', '/tv.html', '/stream', '/api/observations']) {
      expect(decideRemoteAccess({ method: 'GET', path, presentedToken: TV_TOKEN, expectedToken: TV_TOKEN })).toEqual({ allow: true });
      expect(decideRemoteAccess({ method: 'HEAD', path, presentedToken: TV_TOKEN, expectedToken: TV_TOKEN })).toEqual({ allow: true });
    }
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      expect(decideRemoteAccess({ method, path: '/tv', presentedToken: TV_TOKEN, expectedToken: TV_TOKEN }))
        .toEqual({ allow: false, status: 403, reason: 'method' });
    }
    for (const path of ['/api/observations/by-file', '/api/observations/', '/tv/', '/TV', '/api/settings', '/health', '/']) {
      expect(decideRemoteAccess({ method: 'GET', path, presentedToken: TV_TOKEN, expectedToken: TV_TOKEN }))
        .toEqual({ allow: false, status: 404, reason: 'path' });
    }
  });
});

describe('loopback compatibility — local requests are never gated', () => {
  it('loopback GET /api/settings reaches the handler with no token', async () => {
    const res = await fetch(guardUrl('/api/settings'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ stub: true });
    expect(res.headers.get('cache-control')).toBeNull();
  });

  it('loopback /tv without any token: 200 (guard short-circuits before token checks)', async () => {
    const res = await fetch(guardUrl('/tv'));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBeNull();
  });
});

describe('Origin / Host / forwarded-header policy — preserved', () => {
  it('allowed local Origin is accepted; foreign and malformed Origins are 403', async () => {
    const local = await fetch(guardUrl('/api/settings'), { headers: { origin: `http://127.0.0.1:${guardedPort}` } });
    expect(local.status).toBe(200);
    expect(local.headers.get('access-control-allow-origin')).toBe(`http://127.0.0.1:${guardedPort}`);

    const foreign = await fetch(guardUrl('/api/settings'), { headers: { origin: 'http://evil.example' } });
    expect(foreign.status).toBe(403);
    expect(await foreign.json()).toEqual({ error: 'Forbidden', message: 'CORS not allowed' });

    const malformed = await fetch(guardUrl('/api/settings'), { headers: { origin: 'not-a-url' } });
    expect(malformed.status).toBe(403);
  });

  it('untrusted Host is refused by the DNS-rebinding guard', async () => {
    const status = await new Promise<number>((resolve, reject) => {
      const req = request(
        { host: '127.0.0.1', port: hostPolicyPort, path: '/api/settings', method: 'GET', headers: { host: 'evil.example' } },
        (res) => { res.resume(); res.on('end', () => resolve(res.statusCode ?? 0)); },
      );
      req.on('error', reject);
      req.end();
    });
    expect(status).toBe(403);
  });

  it('a forwarded-client header removes the loopback exemption; X-Forwarded-Proto alone does not', async () => {
    const xff = await fetch(guardUrl('/api/settings'), { headers: { 'x-forwarded-for': '1.2.3.4' } });
    expect(xff.status).toBe(404);
    expect(await xff.json()).toEqual({ error: 'Not found' });

    const xfpOnly = await fetch(guardUrl('/api/settings'), { headers: { 'x-forwarded-proto': 'https' } });
    expect(xfpOnly.status).toBe(200);
    expect(await xfpOnly.json()).toEqual({ stub: true });

    for (const header of ['forwarded', 'x-forwarded-host', 'x-real-ip']) {
      const res = await fetch(guardUrl('/api/settings'), { headers: { [header]: 'proxy.example' } });
      expect(res.status).toBe(404);
    }
  });
});

// ---------------------------------------------------------------------------
// Spool independence (Decision 17 Stage D): independent bearer auth, checked
// before parsing; TV and ingest tokens never substitute for each other.
// ---------------------------------------------------------------------------

const VALID_ENTRY = {
  kind: 'observation', enqueuedAtEpochMs: 1700000000000,
  payload: { contentSessionId: 'task42-boundary', platformSource: 'codex',
    toolName: 'exec_command', toolInput: { cmd: 'read fixture' }, toolResponse: 'boundary fixture',
    toolUseId: 'task42-tool-1', cwd: '/repo' },
};

describe('spool — independent bearer auth, checked before parsing', () => {
  let directory: string;
  let store: SessionStore;
  let spool: HookSpool;
  let spoolHttp: import('node:http').Server;
  let spoolAddress = '';

  beforeAll(async () => {
    directory = mkdtempSync(join(tmpdir(), 'task42-spool-'));
    store = new SessionStore(join(directory, 'worker.db'));
    spool = new HookSpool(join(directory, 'server-spool'));
    const app = express();
    app.use(...createMiddleware());
    new HookSpoolRoutes(spool, () => hookSpoolConsumedMarkers(store), () => {}, () => INGEST_TOKEN).setupRoutes(app);
    await new Promise<void>((resolve) => {
      spoolHttp = app.listen(0, '127.0.0.1', () => {
        const bound = spoolHttp.address();
        if (!bound || typeof bound === 'string') throw new Error('spool fixture did not bind');
        spoolAddress = `http://127.0.0.1:${bound.port}/api/spool/ingest`;
        resolve();
      });
    });
  });

  afterAll(() => {
    spoolHttp?.closeAllConnections?.();
    spoolHttp?.close();
    store.close();
    Bun.gc(true);
    rmSync(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 });
  });

  function sendSpool(value: unknown = VALID_ENTRY, authorization?: string, rawBody?: string): Promise<Response> {
    return fetch(spoolAddress, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(authorization !== undefined ? { authorization } : {}) },
      body: rawBody ?? JSON.stringify({ protocolVersion: 1, entry: value }),
    });
  }

  it('positive control: valid bearer + valid envelope reaches envelope validation and enqueues', async () => {
    const res = await sendSpool(VALID_ENTRY, `Bearer ${INGEST_TOKEN}`);
    expect(res.status).toBe(202);
    expect(spool.entries()).toHaveLength(1);
  });

  it('missing bearer is 401; wrong bearer is 401; spool content unchanged', async () => {
    expect((await sendSpool(VALID_ENTRY, '')).status).toBe(401);
    expect((await sendSpool(VALID_ENTRY, 'Bearer someone-elses')).status).toBe(401);
    expect(spool.entries()).toHaveLength(1);
  });

  it('the TV token does not authorize spool ingestion; the ingest token does not open TV routes', async () => {
    expect((await sendSpool(VALID_ENTRY, `Bearer ${TV_TOKEN}`)).status).toBe(401);

    const tvRoute = await fetch(guardUrl('/tv'), { headers: { ...REMOTE, 'x-api-key': INGEST_TOKEN } });
    expect(tvRoute.status).toBe(401);
  });

  it('valid bearer + invalid envelope: reaches envelope validation only, 400, nothing enqueued', async () => {
    const res = await sendSpool({ ...VALID_ENTRY, kind: 'unknown-kind' }, `Bearer ${INGEST_TOKEN}`);
    expect(res.status).toBe(400);
    expect(spool.entries()).toHaveLength(1);
  });

  it('malformed JSON with a missing or wrong bearer fails authentication before parsing', async () => {
    const missing = await sendSpool(undefined, '', '{definitely-not-json');
    expect(missing.status).toBe(401);
    const wrong = await sendSpool(undefined, 'Bearer wrong-task42', '{definitely-not-json');
    expect(wrong.status).toBe(401);
    // Auth-before-parse proof: bodies that would fail JSON parsing never produced a parse 400.
    expect(spool.entries()).toHaveLength(1);
  });
});
