import test from 'node:test';
import assert from 'node:assert/strict';
import { apply, localWorkerBase, textFromContent } from '../index.js';

test('captures only text blocks', () => {
  assert.equal(textFromContent([
    { type: 'text', text: 'hello' },
    { type: 'reasoning', text: 'private thought' },
    { type: 'tool-call', name: 'Bash' },
    { type: 'text', text: ' world' },
  ]), 'hello world');
});

test('ignores missing or malformed content', () => {
  assert.equal(textFromContent(undefined), '');
  assert.equal(textFromContent([{ type: 'text', text: 2 }]), '');
});

test('allows loopback worker URLs only', () => {
  assert.equal(localWorkerBase('http://127.0.0.1:37777'), 'http://127.0.0.1:37777');
  assert.equal(localWorkerBase('http://localhost:37777/path'), 'http://localhost:37777');
  assert.equal(localWorkerBase('http://[::1]:37777'), 'http://[::1]:37777');
  assert.equal(localWorkerBase('https://127.0.0.1:37777'), null);
  assert.equal(localWorkerBase('http://example.com:37777'), null);
  assert.equal(localWorkerBase('not a url'), null);
});

test('does not inject duplicate context on resume or compact', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => assert.fail('resume must not request context');

  try {
    for (const source of ['resume', 'compact']) {
      const hostListeners = new Map();
      const session = { header: { cwd: 'C:\\project' } };
      const injected = [];
      const agent = {
        id: `session-${source}`,
        ctx: {
          sessions: { get: () => session },
          on: () => () => {},
        },
        inject: (message) => injected.push(message),
      };
      const ctx = { on: (name, listener) => { hostListeners.set(name, listener); return () => {}; } };
      const dispose = apply(ctx, { workerUrl: 'http://127.0.0.1:37777' });
      await hostListeners.get('agent/created')({ agent, source });
      assert.deepEqual(injected, []);
      dispose();
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('injects memory and captures committed text only', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  let resolveSummary;
  const summaryDone = new Promise((resolve) => { resolveSummary = resolve; });
  globalThis.fetch = async (url, options = {}) => {
    assert.equal(options.redirect, 'error');
    const parsed = new URL(url);
    if (parsed.pathname === '/api/context/inject') {
      return { ok: true, status: 200, text: async () => 'saved memory' };
    }
    const body = options.body ? JSON.parse(options.body) : undefined;
    calls.push({ path: parsed.pathname, body });
    if (parsed.pathname === '/api/sessions/summarize') resolveSummary();
    return { ok: true, status: 200, text: async () => '' };
  };

  try {
    const hostListeners = new Map();
    const sessionListeners = new Map();
    const injected = [];
    const session = { header: { cwd: 'C:\\project' } };
    const agent = {
      id: 'session-id',
      ctx: {
        sessions: { get: () => session },
        on: (name, listener) => {
          sessionListeners.set(name, listener);
          return () => sessionListeners.delete(name);
        },
      },
      inject: (message) => injected.push(message),
    };
    const ctx = {
      logger: { warn: () => assert.fail('unexpected worker warning') },
      on: (name, listener) => {
        hostListeners.set(name, listener);
        return () => hostListeners.delete(name);
      },
    };
    const dispose = apply(ctx, { workerUrl: 'http://127.0.0.1:37777' });
    await hostListeners.get('agent/created')({ agent, source: 'startup' });
    assert.equal(injected[0].content[0].text, 'saved memory');
    assert.deepEqual(injected[0].source, { kind: 'user' });

    const publish = (type, data) => sessionListeners.get('session/event')(session, { type, data });
    publish('user/message', { id: injected[0].id, content: [{ type: 'text', text: 'saved memory' }] });
    publish('user/message', { content: [{ type: 'text', text: '[claude-mem-marian recalled memory] real prompt' }] });
    publish('assistant/message', {
      message: { content: [{ type: 'text', text: 'real answer' }, { type: 'reasoning', text: 'private thought' }] },
    });
    publish('turn/end', { turn: 1, reason: { kind: 'completed' } });
    hostListeners.get('agent/disposed')({ agent });
    await summaryDone;

    assert.equal(calls.length, 3);
    assert.equal(calls[0].path, '/api/sessions/init');
    assert.equal(calls[0].body.prompt, '[claude-mem-marian recalled memory] real prompt');
    assert.equal(calls[0].body.platformSource, 'dsh');
    assert.equal(calls[1].path, '/api/sessions/observations');
    assert.equal(calls[1].body.tool_response.assistantMessage, 'real answer');
    assert.equal('agentId' in calls[1].body, false);
    assert.equal('agentType' in calls[1].body, false);
    assert.equal(JSON.stringify(calls).includes('private thought'), false);
    assert.equal(calls[2].path, '/api/sessions/summarize');
    assert.equal('agentId' in calls[2].body, false);
    dispose();
  } finally {
    globalThis.fetch = originalFetch;
  }
});
