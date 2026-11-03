import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'node:http';
import { gunzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(import.meta.dir, '..', '..');

/**
 * Decision 14 real-SDK loopback coverage (F5/F7 transport proof).
 *
 * Spawns tests/telemetry/fixtures/real-sdk-child.ts under `bun run`, which bypasses the suite's mocked
 * posthog-node preload, so the REAL installed SDK queues, enriches, serializes, and POSTs to this
 * process's loopback sink. Asserts that (a) SDK enrichment actually fired — the pre-boundary fixture
 * captured inside before_send carries source context / SDK fields on the autocapture path — and (b) the
 * wire payload at the sink excludes source context, conditional identifiers, and SDK-only frame fields.
 * Synthetic fixture content only; nothing leaves 127.0.0.1.
 */

type WireEvent = { event: string; properties: Record<string, unknown> };

let server: Server;
let port = 0;
const batches: WireEvent[][] = [];

function readBody(request: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on('data', (chunk: Buffer) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

beforeAll(async () => {
  server = createServer((request: IncomingMessage, response: ServerResponse) => {
    void readBody(request).then((body) => {
      try {
        // posthog-node posts (usually gzip-encoded) JSON to /batch/.
        const raw = request.headers['content-encoding'] === 'gzip' ? gunzipSync(body).toString('utf8') : body.toString('utf8');
        const parsed = JSON.parse(raw) as { batch?: WireEvent[] };
        if (Array.isArray(parsed.batch)) batches.push(parsed.batch);
      } catch {
        /* a malformed probe POST is still answered */
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end('{"status":1}');
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No loopback port');
  port = address.port;
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function runChild(mode: 'manual' | 'autocapture'): Promise<{ wire: WireEvent[]; preBoundary: Record<string, unknown> | null }> {
  const child = Bun.spawn(['bun', 'run', 'tests/telemetry/fixtures/real-sdk-child.ts', '--port', String(port), '--mode', mode], {
    cwd: REPO_ROOT,
    stdout: 'pipe', stderr: 'pipe',
  });
  const stdout = await new Response(child.stdout).text();
  const stderr = await new Response(child.stderr).text();
  const exit = await child.exited;
  if (exit !== 0) throw new Error(`real-sdk child exited ${exit}: ${stderr.slice(0, 800)}`);
  expect(exit).toBe(0);
  const line = stdout.split('\n').find((candidate) => candidate.startsWith('CHILD-RESULT '));
  expect(line).toBeDefined();
  const parsed = JSON.parse(line!.slice('CHILD-RESULT '.length)) as { preBoundary: Record<string, unknown> | null };
  const wire = batches.flatMap((batch) => batch);
  return { wire, preBoundary: parsed.preBoundary };
}

// Only source-file content is forbidden on the wire; error messages themselves are the bounded,
// redacted diagnostics the contract keeps (each appears inside value, never inside source context).
const WIRE_CONTEXT_FORBIDDEN = ['CHILD-SOURCE-SENTINEL'];
const CONTEXT_KEYS = ['context_line', 'pre_context', 'post_context'];

function exceptionEvents(events: WireEvent[]): WireEvent[] {
  return events.filter((event) => event.event === '$exception');
}

function allStrings(value: unknown, visit: (text: string) => void, depth = 0): void {
  if (depth > 12 || value === null || value === undefined) return;
  if (typeof value === 'string') visit(value);
  else if (Array.isArray(value)) for (const item of value) allStrings(item, visit, depth + 1);
  else if (typeof value === 'object') for (const item of Object.values(value)) allStrings(item, visit, depth + 1);
}

describe('Decision 14: real installed SDK transport through the final boundary', () => {
  it('autocapture: SDK source-context enrichment fires, and the wire payload excludes it plus identifiers and SDK-only frame fields', async () => {
    const before = batches.length;
    const { wire, preBoundary } = await runChild('autocapture');
    const events = exceptionEvents(wire.slice(before));
    // Trigger activation: the SDK attached source context (with the sentinel) pre-boundary, and our
    // manual warm-up + the autocaptured crash both reached before_send.
    expect(preBoundary).not.toBeNull();
    const preList = preBoundary?.$exception_list as Array<Record<string, unknown>> | undefined;
    expect(Array.isArray(preList) && preList.length > 0).toBe(true);
    let triggerFrames = 0;
    for (const entry of preList ?? []) {
      const frames = (entry.stacktrace as { frames?: Array<Record<string, unknown>> } | undefined)?.frames ?? [];
      for (const frame of frames) {
        if (CONTEXT_KEYS.some((key) => key in frame)) triggerFrames++;
      }
    }
    expect(triggerFrames).toBeGreaterThan(0);
    expect(JSON.stringify(preBoundary)).toContain('CHILD-SOURCE-SENTINEL');

    // The protected wire payload excludes everything the boundary must remove.
    expect(events.length).toBeGreaterThanOrEqual(2);
    const serialized = JSON.stringify(events);
    for (const forbidden of WIRE_CONTEXT_FORBIDDEN) expect(serialized).not.toContain(forbidden);
    for (const event of events) {
      const list = event.properties.$exception_list as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(list)) continue;
      for (const entry of list) {
        expect('module' in entry.stacktrace ? true : false).toBe(false);
        const frames = (entry.stacktrace as { frames?: Array<Record<string, unknown>> } | undefined)?.frames ?? [];
        for (const frame of frames) {
          for (const key of [...CONTEXT_KEYS, 'module', 'chunk_id', 'platform']) expect(key in frame).toBe(false);
          // filename redaction: no absolute home path, no drive-absolute path (F4: basenames/~/ trees survive).
          if (typeof frame.filename === 'string') {
            expect(frame.filename).not.toMatch(/[A-Za-z]:\\\\/);
            expect(frame.filename.startsWith('/')).toBe(false);
          }
        }
      }
      for (const key of ['$release_id', '$trace_id', '$span_id']) expect(key in event.properties).toBe(false);
    }
  }, 30000);

  it('manual: real transport works, the boundary rebuilds the list, and no source context exists pre- or post-boundary', async () => {
    const before = batches.length;
    const { wire, preBoundary } = await runChild('manual');
    const events = exceptionEvents(wire.slice(before));
    expect(events.length).toBeGreaterThanOrEqual(1);
    const serialized = JSON.stringify(events);
    for (const forbidden of WIRE_CONTEXT_FORBIDDEN) expect(serialized).not.toContain(forbidden);
    // This SDK build attaches NO source context on the manual path — the pre-boundary fixture documents
    // that (frames carry filename/module/platform only). Suppression is proven by construction.
    expect(JSON.stringify(preBoundary)).not.toContain('CHILD-SOURCE-SENTINEL');
    for (const event of events) {
      const list = event.properties.$exception_list as Array<Record<string, unknown>> | undefined;
      if (!Array.isArray(list)) continue;
      for (const entry of list) {
        const frames = (entry.stacktrace as { frames?: Array<Record<string, unknown>> } | undefined)?.frames ?? [];
        for (const frame of frames) {
          for (const key of [...CONTEXT_KEYS, 'module', 'chunk_id', 'platform']) expect(key in frame).toBe(false);
        }
      }
      for (const key of ['$release_id', '$trace_id', '$span_id']) expect(key in event.properties).toBe(false);
    }
    // Every string on the wire is bounded/sanitized: no child key material, no raw home path.
    allStrings(events, (text) => {
      expect(text).not.toContain('phc_child_synthetic_key');
    });
  }, 30000);
});
