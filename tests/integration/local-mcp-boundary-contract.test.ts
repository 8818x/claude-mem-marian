// SPDX-License-Identifier: Apache-2.0
//
// Decision 17 local MCP boundary contract (Task 42): both local transports.
//
// stdio and HTTP MCP servers are spawned as real processes against disposable
// fixture state (HOME/USERPROFILE/CLAUDE_CONFIG_DIR/CLAUDE_MEM_DATA_DIR under a
// temp root, worker autostart off, loopback-only listeners). The audited
// protocol distinctions are preserved, not tightened: stdio unknown tool is
// -32603 and a malformed line gets no parse response while the server stays
// alive; HTTP malformed body is 400 / -32700; the HTTP transport refuses a
// non-loopback bind target before listening. Tool lists are recorded as
// observed — no count is hardcoded.

import { afterAll, describe, expect, it } from 'bun:test';
import { spawn, type ChildProcess } from 'child_process';
import { createServer, request } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const fixtureRoot = mkdtempSync(join(tmpdir(), 'task42-mcp-'));
const MCP_ENTRY = join(import.meta.dir, '..', '..', 'src', 'servers', 'mcp-server.ts');
const WORKER_ENTRY = join(import.meta.dir, '..', '..', 'src', 'services', 'worker-service.ts');
const FIXTURE_WORKER_PORT = 39472;

function fixtureEnv(): Record<string, string> {
  return {
    ...process.env,
    HOME: fixtureRoot,
    USERPROFILE: fixtureRoot,
    CLAUDE_CONFIG_DIR: join(fixtureRoot, 'claude-config'),
    CLAUDE_MEM_DATA_DIR: join(fixtureRoot, 'data'),
    CLAUDE_MEM_WORKER_AUTOSTART: 'false',
    CLAUDE_MEM_WORKER_HOST: '127.0.0.1',
    CLAUDE_MEM_WORKER_PORT: String(FIXTURE_WORKER_PORT),
  };
}

// Worker-proxied tools need a live worker. One fixture worker (loopback bind,
// disposable state) serves this file; it is the real-process loopback
// compatibility control as well.
let fixtureWorker: ChildProcess | null = null;
async function ensureFixtureWorker(): Promise<void> {
  if (fixtureWorker) return;
  // stdio ignored: nobody drains these pipes in the test process, and a full
  // pipe blocks the worker mid-boot (the refusal probes exit fast and are safe;
  // this one runs for the whole file).
  fixtureWorker = spawn(process.execPath, [WORKER_ENTRY, '--daemon'], { env: fixtureEnv(), stdio: ['ignore', 'ignore', 'ignore'] });
  // 200 only: 503 means still initializing, and worker-proxied tool calls would race the boot.
  for (let i = 0; i < 200; i++) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      const res = await fetch(`http://127.0.0.1:${FIXTURE_WORKER_PORT}/api/health`, { signal: AbortSignal.timeout(1500) });
      if (res.status === 200) return;
    } catch { /* not up yet */ }
  }
  throw new Error('fixture worker did not become healthy (200) within 60s');
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      const port = address && typeof address !== 'string' ? address.port : 0;
      probe.close(() => (port > 0 ? resolve(port) : reject(new Error('no free port'))));
    });
    probe.on('error', reject);
  });
}

// A single sequential stdio MCP session: one request at a time, answers matched
// by JSON-RPC id. Non-JSON stdout lines are recorded, never parsed.
class StdioMcp {
  readonly child: ChildProcess;
  private buffer = '';
  private readonly queue: Array<Record<string, unknown>> = [];
  private readonly waiters: Array<(m: Record<string, unknown>) => void> = [];
  private stderrText = '';
  private exited = false;
  private readonly pendingRejects: Array<(e: Error) => void> = [];
  exitCode: number | null = null;

  constructor(env: Record<string, string>) {
    this.child = spawn(process.execPath, [MCP_ENTRY], { env, stdio: ['pipe', 'pipe', 'pipe'] });
    this.child.stdout!.setEncoding('utf8');
    this.child.stdout!.on('data', (chunk: string) => {
      this.buffer += chunk;
      let cut = this.buffer.indexOf('\n');
      while (cut >= 0) {
        const line = this.buffer.slice(0, cut).trim();
        this.buffer = this.buffer.slice(cut + 1);
        if (line) this.push(line);
        cut = this.buffer.indexOf('\n');
      }
    });
    this.child.stderr!.setEncoding('utf8');
    this.child.stderr!.on('data', (chunk: string) => { this.stderrText += chunk; });
    this.child.on('close', (code) => {
      this.exited = true;
      this.exitCode = code;
      const reason = new Error(`MCP child exited unexpectedly (code ${code}); stderr: ${this.stderrText.slice(-2000)}`);
      for (const reject of this.pendingRejects.splice(0)) reject(reason);
    });
  }

  private push(line: string): void {
    try {
      const msg = JSON.parse(line);
      const waiter = this.waiters.shift();
      if (waiter) waiter(msg);
      else this.queue.push(msg);
    } catch {
      this.rawLines.push(line);
    }
  }

  readonly rawLines: string[] = [];

  send(message: unknown): void {
    this.child.stdin!.write(JSON.stringify(message) + '\n');
  }

  sendRaw(line: string): void {
    this.child.stdin!.write(line + '\n');
  }

  next(timeoutMs = 15_000): Promise<Record<string, unknown>> {
    const queued = this.queue.shift();
    if (queued) return Promise.resolve(queued);
    if (this.exited) return Promise.reject(new Error(`MCP child already exited (code ${this.exitCode}); stderr: ${this.stderrText.slice(-2000)}`));
    return new Promise((resolve, reject) => {
      const waiter = (msg: Record<string, unknown>) => {
        clearTimeout(timer);
        const ridx = this.pendingRejects.indexOf(rejectEntry);
        if (ridx >= 0) this.pendingRejects.splice(ridx, 1);
        resolve(msg);
      };
      const rejectEntry = (e: Error) => {
        clearTimeout(timer);
        const widx = this.waiters.indexOf(waiter);
        if (widx >= 0) this.waiters.splice(widx, 1);
        reject(e);
      };
      const timer = setTimeout(() => {
        rejectEntry(new Error(`timed out waiting for MCP response; child exited=${this.exited} code=${this.exitCode}; stderr: ${this.stderrText.slice(-2000)}`));
      }, timeoutMs);
      this.pendingRejects.push(rejectEntry);
      this.waiters.push(waiter);
    });
  }

  async rpc(id: number, method: string, params: unknown, timeoutMs = 20_000): Promise<Record<string, unknown>> {
    this.send({ jsonrpc: '2.0', id, method, params });
    // Skip notifications; answers carry this request's id.
    for (let i = 0; i < 50; i++) {
      const msg = await this.next(timeoutMs);
      if (msg.id === id) return msg;
    }
    throw new Error(`no response with id ${id}`);
  }

  async close(): Promise<void> {
    if (!this.exited) {
      this.child.stdin!.end();
      this.child.kill();
    }
    await new Promise<void>((resolve) => {
      if (this.exited) return resolve();
      this.child.once('close', () => resolve());
      setTimeout(resolve, 5000);
    });
  }
}

async function portClosed(port: number): Promise<boolean> {
  try {
    await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1500) });
    return false;
  } catch {
    return true;
  }
}

// ---------------------------------------------------------------------------
// stdio transport — real process, disposable fixture state
// ---------------------------------------------------------------------------

describe('local MCP stdio — Decision 17 preservation probes', () => {
  let mcp: StdioMcp;
  let toolNames: string[] = [];

  const initialize = async (): Promise<void> => {
    const res = await mcp.rpc(1, 'initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'task42-boundary', version: '1' },
    });
    const result = res.result as { serverInfo?: { name?: string }; protocolVersion?: string } | undefined;
    expect(result?.serverInfo?.name ?? result?.protocolVersion).toBeTruthy();
    mcp.send({ jsonrpc: '2.0', method: 'notifications/initialized' });
  };

  mcp = new StdioMcp(fixtureEnv());

  afterAll(async () => {
    await mcp.close();
  });

  it('initialize', async () => {
    await initialize();
  }, 60_000);

  it('tools/list returns the real registry (recorded, not hardcoded)', async () => {
    const res = await mcp.rpc(2, 'tools/list', {});
    const tools = (res.result as { tools?: Array<{ name?: string }> } | undefined)?.tools;
    expect(Array.isArray(tools)).toBe(true);
    toolNames = tools!.map((t) => t.name ?? '');
    console.info(`[task42] stdio tools/list count=${toolNames.length}: ${toolNames.join(', ')}`);
    expect(toolNames).toContain('search');
    expect(toolNames).toContain('important_workflow');
  }, 60_000);

  it('unknown tool is a -32603 error, not a crash', async () => {
    const res = await mcp.rpc(3, 'tools/call', { name: 'task42_nonexistent_tool', arguments: {} });
    const error = res.error as { code?: number; message?: string } | undefined;
    expect(error?.code).toBe(-32603);
  }, 60_000);

  it('malformed JSON line: no parse response recorded, server stays alive', async () => {
    mcp.sendRaw('{task42-not-json');
    // The audited behavior: nothing comes back for the bad line. The probe's
    // own timeout rejection is swallowed, so only a real message can surface.
    const strayPromise = mcp.next(2000).then((m) => m, () => undefined);
    await new Promise((r) => setTimeout(r, 2200));
    const stray = await strayPromise;
    expect(stray).toBeUndefined();

    const res = await mcp.rpc(4, 'tools/list', {});
    const tools = (res.result as { tools?: unknown[] } | undefined)?.tools;
    expect(Array.isArray(tools)).toBe(true);
    expect(tools!.length).toBe(toolNames.length);
  }, 60_000);

  it('argument-shape cases respond and are tolerated per the real schema', async () => {
    await ensureFixtureWorker();
    const wrongType = await mcp.rpc(5, 'tools/call', { name: 'work_state_read', arguments: { name: 12345 } });
    expect(wrongType.error).toBeUndefined();
    expect((wrongType.result as { content?: unknown[] })?.content).toBeTruthy();

    const missing = await mcp.rpc(6, 'tools/call', { name: 'work_state_read', arguments: {} });
    expect(missing.error).toBeUndefined();
    expect((missing.result as { content?: unknown[] })?.content).toBeTruthy();
    console.info(`[task42] work_state_read wrong-type text: ${JSON.stringify((wrongType.result as { content?: unknown })?.content)?.slice(0, 200)}`);
    console.info(`[task42] work_state_read missing-args text: ${JSON.stringify((missing.result as { content?: unknown })?.content)?.slice(0, 200)}`);
  }, 90_000);

  it('harmless read-only tools succeed (important_workflow static; work_state_read via the fixture worker)', async () => {
    await ensureFixtureWorker();
    const res = await mcp.rpc(7, 'tools/call', { name: 'important_workflow', arguments: {} });
    const result = res.result as { isError?: boolean; content?: Array<{ text?: string }> } | undefined;
    expect(result).toBeTruthy();
    expect(result!.isError).toBeFalsy();
    expect((result!.content?.[0]?.text ?? '').startsWith('# Smart Search')).toBe(true);

    const proxied = await mcp.rpc(8, 'tools/call', { name: 'work_state_read', arguments: { name: 'task42-boundary-probe' } });
    expect(proxied.error).toBeUndefined();
    expect((proxied.result as { content?: unknown[] })?.content).toBeTruthy();
  }, 90_000);
});

// ---------------------------------------------------------------------------
// local HTTP transport — real process on loopback, disposable fixture state
// ---------------------------------------------------------------------------

describe('local MCP HTTP — Decision 17 preservation probes', () => {
  let port = 0;
  let sessionId = '';
  let child: ChildProcess | null = null;

  const base = (): string => `http://127.0.0.1:${port}/mcp`;
  const jsonHeaders = (): Record<string, string> => ({
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
  });

  async function post(body: string | unknown, extraHeaders: Record<string, string> = {}): Promise<{ status: number; sid: string | null; text: string }> {
    const res = await fetch(base(), {
      method: 'POST',
      headers: { ...jsonHeaders(), ...extraHeaders },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    return { status: res.status, sid: res.headers.get('mcp-session-id'), text: await res.text() };
  }

  /** Raw request with an explicit Host header (fetch cannot set Host). */
  function rawWithHost(host: string, origin?: string): Promise<{ status: number; body: string }> {
    return new Promise((resolve, reject) => {
      const req = request(
        {
          host: '127.0.0.1',
          port,
          path: '/mcp',
          method: 'POST',
          headers: {
            ...jsonHeaders(),
            ...(origin ? { origin } : {}),
            host,
          },
        },
        (res) => {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => { body += chunk; });
          res.on('end', () => resolve({ status: res.statusCode ?? 0, body }));
        },
      );
      req.on('error', reject);
      req.end(JSON.stringify({ jsonrpc: '2.0', id: 90, method: 'tools/list', params: {} }));
    });
  }

  function rpcResultText(text: string): string {
    // Streamable HTTP answers may be SSE-framed; take the first data line, else the body.
    const dataLine = text.split('\n').find((line) => line.startsWith('data:'));
    return dataLine ? dataLine.slice(5).trim() : text;
  }

  it('boots on loopback and answers /health', async () => {
    port = await freePort();
    child = spawn(process.execPath, [MCP_ENTRY, '--http', '--host', '127.0.0.1', '--port', String(port)], {
      env: fixtureEnv(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stderr!.setEncoding('utf8');
    let stderr = '';
    child.stderr!.on('data', (chunk: string) => { stderr += chunk; });

    let healthy = false;
    for (let i = 0; i < 50 && !healthy; i++) {
      await new Promise((r) => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1000) });
        healthy = res.status === 200;
      } catch { /* not up yet */ }
    }
    if (!healthy) throw new Error(`MCP HTTP server did not become healthy; stderr: ${stderr.slice(-2000)}`);
  }, 60_000);

  it('initialize creates a session; tools/list works under it', async () => {
    const init = await post({ jsonrpc: '2.0', id: 11, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'task42-boundary', version: '1' } } });
    expect(init.status).toBe(200);
    expect(rpcResultText(init.text)).toContain('"serverInfo"');
    expect(init.sid).toBeTruthy();
    sessionId = init.sid ?? '';

    await post({ jsonrpc: '2.0', method: 'notifications/initialized' });
    const list = await post({ jsonrpc: '2.0', id: 12, method: 'tools/list', params: {} });
    expect(list.status).toBe(200);
    const parsed = JSON.parse(rpcResultText(list.text));
    const names: string[] = (parsed.result?.tools ?? []).map((t: { name?: string }) => t.name ?? '');
    console.info(`[task42] http tools/list count=${names.length}: ${names.join(', ')}`);
    expect(names.length).toBeGreaterThan(0);
  }, 60_000);

  it('harmless read-only tool succeeds (important_workflow)', async () => {
    const read = await post({ jsonrpc: '2.0', id: 13, method: 'tools/call', params: { name: 'important_workflow', arguments: {} } });
    expect(read.status).toBe(200);
    const parsed = JSON.parse(rpcResultText(read.text));
    expect(parsed.result?.isError ?? false).toBeFalsy();
    expect((parsed.result?.content?.[0]?.text ?? '').startsWith('# Smart Search')).toBe(true);
  }, 60_000);

  it('malformed body: HTTP 400 with JSON-RPC -32700', async () => {
    const bad = await post('{task42-not-json');
    expect(bad.status).toBe(400);
    const parsed = JSON.parse(bad.text);
    expect(parsed.error?.code).toBe(-32700);

    // Liveness: the session still works afterwards.
    const list = await post({ jsonrpc: '2.0', id: 14, method: 'tools/list', params: {} });
    expect(list.status).toBe(200);
  }, 60_000);

  it('foreign Origin is refused; Host mismatch is refused; no-Origin local client is untouched', async () => {
    const foreign = await post({ jsonrpc: '2.0', id: 15, method: 'tools/list', params: {} }, { origin: 'http://evil.example' });
    expect(foreign.status).toBe(403);
    expect(foreign.text).toContain('Origin');

    const badHost = await rawWithHost('evil.example');
    expect(badHost.status).toBe(403);
    expect(badHost.body).toContain('not a loopback name');

    // No-Origin requests (the normal local client shape) keep working: proven
    // by the passing tools/list calls above and once more here.
    const clean = await post({ jsonrpc: '2.0', id: 16, method: 'tools/list', params: {} });
    expect(clean.status).toBe(200);
  }, 60_000);

  it('shutdown: the loopback listener is closed and cleaned up', async () => {
    child?.kill();
    await new Promise<void>((resolve) => {
      if (!child || child.exitCode !== null) return resolve();
      child.once('close', () => resolve());
      setTimeout(resolve, 5000);
    });
    expect(await portClosed(port)).toBe(true);
  }, 30_000);
});

// ---------------------------------------------------------------------------
// Non-loopback bind refusal — refused before listening (exit 1)
// ---------------------------------------------------------------------------

describe('local MCP HTTP — non-loopback bind refusal', () => {
  it('0.0.0.0 is refused before any listener exists', async () => {
    const port = await freePort();
    const child = spawn(process.execPath, [MCP_ENTRY, '--http', '--host', '0.0.0.0', '--port', String(port)], {
      env: fixtureEnv(),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const [stdout, stderr, code] = await Promise.all([
      new Response(child.stdout!).text(),
      new Response(child.stderr!).text(),
      new Promise<number>((resolve) => child.on('close', resolve)),
    ]);
    // process.exit can outrace the pipe flush; the refusal also lands in the
    // fixture log files under the data dir.
    let logText = '';
    try {
      const logsDir = join(fixtureRoot, 'data', 'logs');
      const { readdirSync, readFileSync } = await import('node:fs');
      for (const name of readdirSync(logsDir)) {
        if (name.endsWith('.log')) logText += readFileSync(join(logsDir, name), 'utf8');
      }
    } catch { /* no log dir */ }
    const output = stdout + stderr + logText;
    expect(code).not.toBe(0);
    expect(output).toContain('Refusing to listen on 0.0.0.0');
    expect(output).toContain('loopback only');
    expect(await portClosed(port)).toBe(true);
  }, 90_000);
});

afterAll(async () => {
  if (fixtureWorker) {
    fixtureWorker.kill();
    await new Promise<void>((resolve) => {
      if (fixtureWorker!.exitCode !== null) return resolve();
      fixtureWorker!.once('close', () => resolve());
      setTimeout(resolve, 8000);
    });
    expect(await portClosed(FIXTURE_WORKER_PORT)).toBe(true);
  }
  rmSync(fixtureRoot, { recursive: true, force: true, maxRetries: 5, retryDelay: 20 });
});
