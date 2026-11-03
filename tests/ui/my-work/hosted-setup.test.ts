import { afterEach, describe, expect, it } from 'bun:test';
import { buildSync } from 'esbuild';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

// Compile the real component and source together: no DOM package or paid service is needed.
const compiled = buildSync({
  stdin: {
    resolveDir: resolve(import.meta.dir, '../../../src/ui/my-work'), loader: 'tsx', contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { ScanScreen } from './src/setup/screens/scan-screen';
      export { localSetupSource, EMPTY_SETUP_DATA } from './src/setup/setup-data';
      export { createSampleSetupSource } from './src/setup/setup-sample';
      let grantCalls = 0;
      export const grantCallCount = () => grantCalls;
      export const renderScan = (scan, preferenceError = null, retrying = false, retryError = null) => renderToStaticMarkup(
        <ScanScreen scan={scan} onImproveProductChange={() => {}} onGrantHostedUpload={() => { grantCalls++; }} hostedError={null} preferenceError={preferenceError} onRetry={() => {}} retrying={retrying} retryError={retryError} />
      );
    `,
  },
  tsconfig: resolve(import.meta.dir, '../../../src/ui/my-work/tsconfig.app.json'),
  bundle: true, write: false, format: 'cjs', platform: 'node',
  loader: { '.webp': 'dataurl' }, define: { 'process.env.NODE_ENV': '"production"' },
}).outputFiles[0].text;

function fixture() {
  const module = { exports: {} as any };
  new Function('module', 'exports', 'require', compiled)(module, module.exports, createRequire(import.meta.url));
  return module.exports;
}

const originalFetch = globalThis.fetch;
const originalEventSource = globalThis.EventSource;
afterEach(() => { globalThis.fetch = originalFetch; globalThis.EventSource = originalEventSource; });

class Stream extends EventTarget {
  static latest: Stream;
  closed = false;
  constructor() { super(); Stream.latest = this; }
  close() { this.closed = true; }
  send(name: string, data: unknown) { this.dispatchEvent(new MessageEvent(name, { data: JSON.stringify(data) })); }
}
const scan = (changes = {}) => ({ agents: [], percent: 0, phase: 'idle', done: false, error: null, improveProduct: true, hostedUploadAuthorized: false, hostedSkipped: false, ...changes });
const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
async function settle() { await new Promise<void>((resolve) => setImmediate(resolve)); }
async function until(check: () => boolean) {
  // Bound fixture waits so a missing source callback fails the test instead of hanging the suite.
  const deadline = Date.now() + 2000;
  while (!check()) {
    if (Date.now() > deadline) throw new Error('Expected setup source update was not received.');
    await settle();
  }
}
function useNetwork(handle: (url: string, init: RequestInit) => Promise<Response> | Response) {
  globalThis.EventSource = Stream as unknown as typeof EventSource;
  globalThis.fetch = ((url, init = {}) => handle(String(url), init)) as typeof fetch;
}

describe('hosted setup scan control', () => {
  it('renders the improvement preference under the progress meter, and locks it only for upload', () => {
    const app = fixture();
    const initial = app.renderScan(app.EMPTY_SETUP_DATA.scan);
    const checkbox = initial.match(/<input[^>]+type="checkbox"[^>]*>/)?.[0] ?? '';
    expect(checkbox).toContain('checked=""');
    expect(checkbox).not.toContain('disabled');
    expect(initial.indexOf('<progress')).toBeLessThan(initial.indexOf(checkbox));
    expect(app.renderScan(scan({ phase: 'reading', improveProduct: false }))).not.toContain('checked=""');
    expect(app.renderScan(scan({ phase: 'saving' }))).not.toContain('disabled=""');
    // Uploading is a settled, authorized run: the whole choice block (checkbox included) is absent.
    const uploading = app.renderScan(scan({ phase: 'uploading' }));
    expect(uploading).not.toContain('type="checkbox"');
    expect(uploading).not.toContain('Send prompts for hosted extraction');
  });

  it('Decision 15 disclosure: names prompt content, window, destination, metadata, credentials, and non-anonymity before any hosted action', () => {
    const app = fixture();
    const html = app.renderScan(app.EMPTY_SETUP_DATA.scan);
    // Prompt content + window.
    expect(html).toContain('typed to your AI coding tools in the last 30 days');
    expect(html).toContain('prompts found stored on this computer');
    // Destination + metadata + timezone offset.
    expect(html).toContain('cmem.ai');
    expect(html).toContain('session identifier');
    expect(html).toContain('timestamp');
    expect(html).toContain('project');
    expect(html).toContain('timezone offset');
    // Credential association (account when signed in, install otherwise).
    expect(html).toContain('CMEM account when you are signed in');
    expect(html).toContain('installation&#x27;s own hosted setup credentials');
    // Never called anonymous; the old anonymized-upload implication is absent.
    expect(html).toContain('not anonymous');
    expect(html).not.toContain('anonymized setup results');
    // Distinct hosted and local-only actions, and an independent improvement preference.
    expect(html).toContain('Send prompts for hosted extraction');
    expect(html).toContain('Continue without uploading');
    expect(html).toContain('let this hosted run also be used for product improvement');
    expect(html).toContain('Turning this off does not stop an authorized upload of your prompts');
  });

  it('Decision 15: a local-only outcome reports the skip (not an error) and keeps the hosted option available', () => {
    const app = fixture();
    const skipped = app.renderScan(scan({ phase: 'done', done: true, hostedSkipped: true }));
    expect(skipped).toContain('Hosted extraction was skipped');
    expect(skipped).toContain('role="status"');
    expect(skipped).not.toContain('role="alert">Hosted extraction was skipped');
    expect(skipped).toContain('Send prompts for hosted extraction');
    // A hosted outcome (done without a skip) settles: no repeated authorization prompt.
    const done = app.renderScan(scan({ phase: 'done', done: true, hostedSkipped: false }));
    expect(done).not.toContain('Send prompts for hosted extraction');
    expect(done).not.toContain('role="alert"');
  });

  it('renders hosted failures and preference failures in the existing alert style', () => {
    const app = fixture();
    const html = app.renderScan(scan({ phase: 'failed', error: 'Hosted extraction exceeded the upload limit.' }), 'Could not save this choice: Network unavailable.');
    expect(html).toContain('class="scan-error" role="alert">Hosted extraction exceeded the upload limit.');
    expect(html).toContain('class="scan-error" role="alert">Could not save this choice: Network unavailable.');
  });

  it('shows the server message from a failed anonymous upload on the scan screen', async () => {
    const app = fixture();
    useNetwork(url => url === '/api/setup/state'
      ? Response.json({ status: 'pending', alreadyPro: false })
      : Response.json(scan({ phase: 'uploading', percent: 99 })));
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    await until(() => latest.scan.phase === 'uploading');
    const message = 'Hosted setup failed (HTTP 503): The anonymous daily budget has been reached.';
    Stream.latest.send('setup-scan', scan({ phase: 'failed', error: message }));
    expect(app.renderScan(latest.scan)).toContain(`class="scan-error" role="alert">${message}`);
    stop();
  });

  it('offers an explicit retry after a failed extraction and keeps a retry refusal visible', () => {
    const app = fixture();
    const failed = scan({ phase: 'failed', done: true, error: 'The anonymous daily budget has been reached.' });
    const html = app.renderScan(failed);
    expect(html).toContain('Try again');
    expect(html).toContain('The anonymous daily budget has been reached.');
    expect(app.renderScan(scan({ phase: 'uploading' }))).not.toContain('Try again');
    expect(app.renderScan(failed, null, true)).toContain('disabled=""');
    expect(app.renderScan(failed, null, false, 'The setup service is unavailable.')).toContain('role="alert">The setup service is unavailable.');
  });

  it('does not repeat a failed extraction until requested, then applies retry progress and results', async () => {
    const app = fixture();
    const posts: unknown[] = [];
    useNetwork((url, init) => {
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (init.method) {
        posts.push(JSON.parse(String(init.body)));
        return Response.json(scan({ phase: 'reading', improveProduct: false }));
      }
      return Response.json(scan({ phase: 'failed', done: true, improveProduct: false, error: 'Please try again.' }));
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    await until(() => latest.scan.phase === 'failed');
    await settle();
    expect(posts).toEqual([]);
    await app.localSetupSource.retryScan();
    expect(posts).toEqual([{}]);
    expect(latest.scan).toMatchObject({ phase: 'reading', done: false, error: null, improveProduct: false });
    Stream.latest.send('setup-scan', scan({ phase: 'done', done: true, percent: 100, improveProduct: false }));
    expect(latest.scan.phase).toBe('done');
    stop();
  });

  it('preserves newer streamed progress if it arrives before the retry response and returns server refusals', async () => {
    const app = fixture();
    let refused = false;
    useNetwork((url, init) => {
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (!init.method) return Response.json(scan({ phase: 'failed', done: true, error: 'Please try again.' }));
      if (refused) return Response.json({ error: 'The setup service is unavailable.' }, { status: 503 });
      Stream.latest.send('setup-scan', scan({ phase: 'uploading', percent: 99 }));
      return Response.json(scan({ phase: 'reading' }));
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    await until(() => latest.scan.phase === 'failed');
    await app.localSetupSource.retryScan();
    expect(latest.scan.phase).toBe('uploading');
    refused = true;
    Stream.latest.send('setup-scan', scan({ phase: 'failed', done: true, error: 'Please try again.' }));
    await expect(app.localSetupSource.retryScan()).rejects.toThrow('The setup service is unavailable.');
    stop();
  });

  it('buffers early unchecking without delaying the scan, sends false, and still receives upload/results', async () => {
    const app = fixture();
    const initial = deferred<Response>();
    const calls: Array<{ url: string; body: any }> = [];
    useNetwork((url, init) => {
      calls.push({ url, body: init.body ? JSON.parse(String(init.body)) : null });
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (url === '/api/setup/scan' && !init.method) return initial.promise;
      if (url === '/api/setup/scan/preferences') return Response.json({ error: 'The setup upload has already started.' }, { status: 409 });
      if (url === '/api/setup/scan') {
        // A newer event can beat the older start response; it must keep upload locked.
        Stream.latest.send('setup-scan', scan({ phase: 'uploading', percent: 99, improveProduct: false }));
        return Response.json(scan({ phase: 'reading', improveProduct: false }));
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    const changed = app.localSetupSource.setImproveProduct(false);
    await settle();
    expect(calls.some((call) => call.url.endsWith('/preferences'))).toBe(false);
    initial.resolve(Response.json(scan()));
    await changed;
    expect(calls.find((call) => call.url === '/api/setup/scan' && call.body)?.body).toEqual({ improveProduct: false });
    expect(calls.some((call) => call.url.endsWith('/preferences'))).toBe(false);
    expect(latest.scan.phase).toBe('uploading');
    expect(latest.scan.improveProduct).toBe(false);
    Stream.latest.send('work-view', {
      goals: null, rules: [], story: null,
      setup: { extraction: { state: 'ok', step: null }, work: [{ groupId: 'g1', title: 'Ship the upload', platform: 'codex', lastActiveAt: null, progressPercent: null }] },
    });
    Stream.latest.send('setup-scan', scan({ phase: 'done', done: true, percent: 100, improveProduct: false }));
    expect(latest.scan.done).toBe(true);
    expect(latest.reveal.work[0].title).toBe('Ship the upload');
    expect(latest.scan.phase).toBe('done');
    stop();
  });

  it('keeps the latest early toggle in the scan body and never sends an older queued choice', async () => {
    const app = fixture();
    const initial = deferred<Response>();
    const bodies: any[] = [];
    useNetwork((url, init) => {
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (!init.method) return initial.promise;
      bodies.push(JSON.parse(String(init.body)));
      return Response.json(scan({ phase: 'reading', improveProduct: true }));
    });
    const stop = app.localSetupSource.subscribe(() => {});
    const first = app.localSetupSource.setImproveProduct(false);
    const last = app.localSetupSource.setImproveProduct(true);
    await settle();
    expect(bodies).toEqual([]);
    initial.resolve(Response.json(scan()));
    await Promise.all([first, last]);
    expect(bodies).toEqual([{ improveProduct: true }]);
    stop();
  });

  it('sends an unchecked preference for an active scan without waiting for it before upload/results', async () => {
    const app = fixture();
    const preference = deferred<Response>();
    const bodies: any[] = [];
    useNetwork((url, init) => {
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (url.endsWith('/preferences')) {
        bodies.push(JSON.parse(String(init.body)));
        return preference.promise;
      }
      return Response.json(scan({ phase: 'reading' }));
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    await until(() => latest.scan.phase === 'reading');
    const changed = app.localSetupSource.setImproveProduct(false);
    await until(() => bodies.length > 0);
    expect(bodies).toEqual([{ improveProduct: false }]);
    Stream.latest.send('setup-scan', scan({ phase: 'uploading', percent: 99, improveProduct: false }));
    Stream.latest.send('work-view', { goals: null, rules: [], story: null, setup: { extraction: { state: 'ok', step: null }, work: [] } });
    Stream.latest.send('setup-scan', scan({ phase: 'done', percent: 100, done: true, improveProduct: false }));
    expect(latest.scan.done).toBe(true);
    expect(latest.scan.improveProduct).toBe(false);
    expect(latest.extraction.state).toBe('ok');
    preference.resolve(Response.json(scan({ phase: 'reading', improveProduct: false })));
    await changed;
    expect(latest.scan.phase).toBe('done');
    stop();
  });

  it('ignores a stale initial GET after a newer scan event', async () => {
    const app = fixture();
    const initial = deferred<Response>();
    const posts: string[] = [];
    useNetwork((url, init) => {
      if (init.method) posts.push(url);
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      return initial.promise;
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    Stream.latest.send('setup-scan', scan({ phase: 'uploading', percent: 99, improveProduct: false }));
    initial.resolve(Response.json(scan()));
    await settle();
    expect(latest.scan.phase).toBe('uploading');
    expect(latest.scan.improveProduct).toBe(false);
    expect(posts).toEqual([]);
    stop();
  });

  it('does not start a scan after unsubscribe or overwrite streamed progress with a late request failure', async () => {
    for (const unsubscribe of [true, false]) {
      const app = fixture();
      const initial = deferred<Response>();
      const posts: string[] = [];
      useNetwork((url, init) => {
        if (init.method) posts.push(url);
        if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
        return initial.promise;
      });
      let latest: any;
      const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
      if (unsubscribe) { stop(); initial.resolve(Response.json(scan())); }
      else {
        Stream.latest.send('setup-scan', scan({ phase: 'uploading', percent: 99 }));
        initial.reject(new Error('Old GET failed'));
      }
      await settle();
      expect(posts).toEqual([]);
      expect(latest.scan.phase).toBe(unsubscribe ? 'idle' : 'uploading');
      stop();
    }
  });

  it('reports a failed preference save while leaving scan and results free to complete', async () => {
    const app = fixture();
    useNetwork((url) => {
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (url.endsWith('/preferences')) return Response.json({ error: 'The setup upload has already started.' }, { status: 409 });
      return Response.json(scan({ phase: 'reading' }));
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    await until(() => latest.scan.phase === 'reading');
    await expect(app.localSetupSource.setImproveProduct(false)).rejects.toThrow('The setup upload has already started.');
    expect(latest.scan.phase).toBe('reading');
    expect(latest.scan.error).toBe(null);
    Stream.latest.send('setup-scan', scan({ phase: 'done', done: true, percent: 100 }));
    expect(latest.scan.done).toBe(true);
    stop();
  });

  it('retains unchecked state in the sample source across scan progress', async () => {
    const app = fixture();
    const source = app.createSampleSetupSource(false, 1);
    let latest: any;
    const stop = source.subscribe((data: any) => { latest = data; });
    await source.setImproveProduct(false);
    await until(() => latest.scan.percent === 1);
    expect(latest.scan.improveProduct).toBe(false);
    stop();
  });

  it('Decision 15: the hosted choice is its own explicit POST, and the sample source flips only its own state', async () => {
    const app = fixture();
    const posts: Array<{ url: string; body: any }> = [];
    useNetwork((url, init) => {
      if (url === '/api/setup/state') return Response.json({ status: 'pending', alreadyPro: false });
      if (init.method) posts.push({ url, body: init.body ? JSON.parse(String(init.body)) : null });
      if (url.endsWith('/hosted-authorization')) return Response.json(scan({ phase: 'reading', hostedUploadAuthorized: true }));
      return Response.json(scan({ phase: 'reading' }));
    });
    let latest: any;
    const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    await until(() => latest.scan.phase === 'reading');
    await app.localSetupSource.grantHostedUpload();
    const grant = posts.find((post) => post.url.endsWith('/hosted-authorization'));
    expect(grant?.body).toEqual({ authorized: true });
    // The grant rides no other request: the scan start stays authorization-free.
    expect(posts.filter((post) => post.url === '/api/setup/scan').every((post) => post.body?.hostedUpload === undefined)).toBe(true);
    stop();
    // Sample: the hosted action flips only the sample's own state (nothing is uploaded anywhere).
    const sample = app.createSampleSetupSource(false, null);
    let sampleLatest: any;
    const stopSample = sample.subscribe((data: any) => { sampleLatest = data; });
    await sample.grantHostedUpload();
    expect(sampleLatest.scan.hostedUploadAuthorized).toBe(true);
    stopSample();
  });
});
