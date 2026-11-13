import assert from 'node:assert/strict'
import test from 'node:test'

import { createBridge, localWorkerBase, messageRole, messageText, newTurns } from '../claude-mem.js'

function fakeContext(directory = 'C:/work/project') {
  const hooks = {}
  const ctx = {
    location: { directory },
    session: { hook: async (name, callback) => { hooks[name] = callback; return { dispose() {} } } },
    event: { subscribe: () => ({ async *[Symbol.asyncIterator]() {} }) },
  }
  return { ctx, hooks }
}

function captureFetch() {
  const calls = []
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method ?? 'GET', body: options.body ? JSON.parse(options.body) : undefined })
    return { ok: true, status: 200, text: async () => 'REMEMBERED: the worker listens on 37777' }
  }
  return calls
}

test('only loopback http worker URLs are accepted', () => {
  assert.equal(localWorkerBase('http://127.0.0.1:37777'), 'http://127.0.0.1:37777')
  assert.equal(localWorkerBase('http://localhost:37777/ignored'), 'http://localhost:37777')
  assert.equal(localWorkerBase('http://[::1]:37777'), 'http://[::1]:37777')
  assert.equal(localWorkerBase('https://127.0.0.1:37777'), null)
  assert.equal(localWorkerBase('http://example.com:37777'), null)
  assert.equal(localWorkerBase(''), 'http://127.0.0.1:37777')
})

test('message text reads parts, content, or a plain text field', () => {
  assert.equal(messageText({ parts: [{ type: 'text', text: 'a' }, { type: 'tool', text: 'skip' }] }), 'a')
  assert.equal(messageText({ content: [{ type: 'text', text: 'b' }] }), 'b')
  assert.equal(messageText({ text: 'c' }), 'c')
  assert.equal(messageText({ info: { role: 'assistant' } }), '')
  assert.equal(messageText(null), '')
  assert.equal(messageRole({ info: { role: 'assistant' } }), 'assistant')
  assert.equal(messageRole({ role: 'user' }), 'user')
})

test('new turns pair every user message with the reply before it', () => {
  const messages = [
    { role: 'user', text: 'first' },
    { role: 'assistant', text: 'answer one' },
    { role: 'user', text: 'second' },
  ]
  assert.deepEqual(newTurns(messages, 0), [
    { prompt: 'first', reply: '' },
    { prompt: 'second', reply: 'answer one' },
  ])
  assert.deepEqual(newTurns(messages, 1), [{ prompt: 'second', reply: 'answer one' }])
  assert.deepEqual(newTurns(messages, 2), [])
  assert.deepEqual(newTurns(undefined, 0), [])
})

test('the context hook injects memory once and posts each turn once', async () => {
  const calls = captureFetch()
  const { ctx, hooks } = fakeContext()
  const bridge = createBridge(ctx, { workerUrl: 'http://127.0.0.1:37777' })
  const stop = await bridge.start()

  const system = []
  const messages = [
    { role: 'user', text: 'first' },
    { role: 'assistant', text: 'answer one' },
    { role: 'user', text: 'second' },
  ]
  await hooks.context({ sessionID: 'ses_1', system, messages })
  await new Promise((resolve) => setTimeout(resolve, 20))
  await hooks.context({ sessionID: 'ses_1', system, messages })
  await new Promise((resolve) => setTimeout(resolve, 20))

  const inject = calls.filter((call) => call.url.includes('/api/context/inject'))
  const init = calls.filter((call) => call.url.endsWith('/api/sessions/init'))
  const observations = calls.filter((call) => call.url.endsWith('/api/sessions/observations'))

  assert.equal(inject.length, 1, 'memory is read once per session')
  assert.equal(system.length, 1)
  assert.match(system[0].text, /REMEMBERED/)
  assert.equal(init.length, 2, 'two user turns, each posted once')
  assert.equal(observations.length, 1, 'only the turn with a reply is an observation')
  assert.equal(init[0].body.contentSessionId, 'ses_1')
  assert.equal(init[0].body.cwd, 'C:/work/project')
  assert.equal(init[0].body.platformSource, 'opencode')
  assert.equal(observations[0].body.tool_response.assistantMessage, 'answer one')
  assert.equal(observations[0].body.tool_input.userMessage, 'second')

  await stop()
})

test('an offline worker never throws or blocks the hook', async () => {
  globalThis.fetch = async () => {
    throw new Error('ECONNREFUSED')
  }
  const { ctx, hooks } = fakeContext()
  const bridge = createBridge(ctx, { workerUrl: 'http://127.0.0.1:37777' })
  const stop = await bridge.start()
  await hooks.context({ sessionID: 'ses_2', system: [], messages: [{ role: 'user', text: 'hi' }] })
  await new Promise((resolve) => setTimeout(resolve, 20))
  await stop()
})

test('a non-loopback worker URL disables the bridge instead of sending turns', async () => {
  const calls = captureFetch()
  const { ctx, hooks } = fakeContext()
  const bridge = createBridge(ctx, { workerUrl: 'http://memory.example.com:37777' })
  const stop = await bridge.start()
  await hooks.context({ sessionID: 'ses_3', system: [], messages: [{ role: 'user', text: 'hi' }] })
  await new Promise((resolve) => setTimeout(resolve, 20))
  assert.equal(calls.length, 0)
  await stop()
})
