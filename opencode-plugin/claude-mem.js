// OpenCode plugin that connects an OpenCode session to the local claude-mem worker.
// It mirrors the DSH bridge (dsh-plugin/index.js): read memory once per session, then
// send each finished turn as an observation. Every request stays on loopback, times
// out after two seconds, and fails open when the worker is offline.
import { randomUUID } from 'node:crypto'

const PLATFORM_SOURCE = 'opencode'
const DEFAULT_WORKER_URL = 'http://127.0.0.1:37777'
const TIMEOUT_MS = 2000
/**
 * How long a session must stay quiet before it is summarized. OpenCode 2.2.5
 * reports `session.execution.*` per turn and has no session-end event, so the
 * trailing quiet window is what separates one turn from a finished session.
 */
const SUMMARY_QUIET_MS = 60_000

/** Only loopback HTTP hosts are accepted, so a misconfigured URL cannot leak turns. */
export function localWorkerBase(value) {
  let url
  try {
    url = new URL(typeof value === 'string' && value.trim() ? value.trim() : DEFAULT_WORKER_URL)
  } catch {
    return null
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (url.protocol !== 'http:' || !['localhost', '127.0.0.1', '::1'].includes(host)) return null
  return url.origin
}

async function request(base, path, { method = 'GET', body } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(new URL(path, base), {
      method,
      redirect: 'error',
      signal: controller.signal,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!response.ok) throw new Error(`worker returned HTTP ${response.status}`)
    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

/** Text of one message, whatever the part field is called in this OpenCode release. */
export function messageText(message) {
  if (!message || typeof message !== 'object') return ''
  if (typeof message.text === 'string') return message.text
  const parts = Array.isArray(message.parts) ? message.parts : Array.isArray(message.content) ? message.content : []
  return parts
    .filter((part) => part && part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('')
}

export function messageRole(message) {
  return message?.role ?? message?.info?.role ?? ''
}

/**
 * The turns this call has not sent yet: every user message, paired with the
 * assistant message just before it. OpenCode hands the whole transcript to each
 * model call, so `sent` counts the user messages already posted.
 */
export function newTurns(messages, sent) {
  const list = Array.isArray(messages) ? messages : []
  const turns = []
  let seen = 0
  for (let index = 0; index < list.length; index += 1) {
    if (messageRole(list[index]) !== 'user') continue
    if (seen < sent) {
      seen += 1
      continue
    }
    const prompt = messageText(list[index]).trim()
    let reply = ''
    for (let back = index - 1; back >= 0; back -= 1) {
      if (messageRole(list[back]) === 'assistant') {
        reply = messageText(list[back]).trim()
        break
      }
    }
    if (prompt) turns.push({ prompt, reply })
    seen += 1
  }
  return turns
}

export function createBridge(ctx, config = {}) {
  const workerUrl = localWorkerBase(config.workerUrl ?? process.env.CLAUDE_MEM_WORKER_URL)
  const directory = ctx?.location?.directory ?? process.cwd()
  const sessions = new Map()
  let warned = false

  const warn = () => {
    if (warned) return
    warned = true
    console.warn('[claude-mem] Local worker is unavailable; memory bridge skipped.')
  }

  const stateFor = (sessionId) => {
    let state = sessions.get(sessionId)
    if (!state) {
      state = { sent: 0, injected: false, pending: Promise.resolve(), lastReply: '', summaryTimer: undefined }
      sessions.set(sessionId, state)
    }
    return state
  }

  const enqueue = (state, task) => {
    state.pending = state.pending.then(task).catch(warn)
  }

  const sendTurn = (state, sessionId, turn) => {
    enqueue(state, async () => {
      if (!workerUrl || !directory) return
      await request(workerUrl, '/api/sessions/init', {
        method: 'POST',
        body: {
          contentSessionId: sessionId,
          prompt: turn.prompt,
          nativePromptId: `opencode-${randomUUID()}`,
          cwd: directory,
          platformSource: PLATFORM_SOURCE,
        },
      })
      if (!turn.reply) return
      await request(workerUrl, '/api/sessions/observations', {
        method: 'POST',
        body: {
          contentSessionId: sessionId,
          tool_name: 'OpenCode conversation',
          tool_input: { userMessage: turn.prompt },
          tool_response: { assistantMessage: turn.reply },
          cwd: directory,
          platformSource: PLATFORM_SOURCE,
        },
      })
    })
  }

  const injectMemory = async (state, sessionId, system) => {
    if (state.injected || !workerUrl || !directory) return
    state.injected = true
    try {
      const url = new URL('/api/context/inject', workerUrl)
      url.searchParams.set('cwd', directory)
      url.searchParams.set('sessionId', sessionId)
      url.searchParams.set('platformSource', PLATFORM_SOURCE)
      const memory = (await request(workerUrl, `${url.pathname}${url.search}`)).trim()
      if (memory && Array.isArray(system)) system.push({ type: 'text', text: memory })
    } catch {
      warn()
    }
  }

  const summarize = (state, sessionId, lastAssistant) => {
    enqueue(state, async () => {
      if (!workerUrl || !directory) return
      await request(workerUrl, '/api/sessions/summarize', {
        method: 'POST',
        body: {
          contentSessionId: sessionId,
          last_assistant_message: lastAssistant ?? '',
          platformSource: PLATFORM_SOURCE,
          cwd: directory,
        },
      })
    })
  }

  return {
    /** Register every hook this bridge needs and return one disposer. */
    async start() {
      const registrations = []

      registrations.push(
        await ctx.session.hook('context', async (event) => {
          const sessionId = event?.sessionID
          if (!sessionId) return
          const state = stateFor(sessionId)
          await injectMemory(state, sessionId, event.system)
          const turns = newTurns(event.messages, state.sent)
          for (const turn of turns) {
            sendTurn(state, sessionId, turn)
            if (turn.reply) state.lastReply = turn.reply
          }
          state.sent += turns.length
        }),
      )

      // OpenCode 2.2.5 reports `session.execution.started` / `.succeeded` /
      // `.failed` per turn and has no session-end event, so a trailing quiet
      // window after an execution ends is what marks the session as done.
      const controller = new AbortController()
      if (ctx?.event?.subscribe) {
        void (async () => {
          try {
            for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
              const type = String(event?.type ?? '')
              if (!type.startsWith('session.execution.')) continue
              const sessionId = event?.properties?.sessionID ?? event?.sessionID ?? event?.properties?.info?.sessionID
              if (!sessionId) continue
              const state = sessions.get(sessionId)
              if (!state) continue
              if (state.summaryTimer) {
                clearTimeout(state.summaryTimer)
                state.summaryTimer = undefined
              }
              if (type === 'session.execution.started') continue
              state.summaryTimer = setTimeout(() => {
                state.summaryTimer = undefined
                summarize(state, sessionId, state.lastReply)
                sessions.delete(sessionId)
              }, SUMMARY_QUIET_MS)
            }
          } catch {
            // The stream ends when OpenCode shuts down; nothing to report.
          }
        })()
      }

      return async () => {
        controller.abort()
        for (const registration of registrations) {
          try {
            await registration?.dispose?.()
          } catch {
            // A disposed session hook is already gone.
          }
        }
        for (const state of sessions.values()) {
          if (state.summaryTimer) clearTimeout(state.summaryTimer)
        }
        sessions.clear()
      }
    },
  }
}

// OpenCode v2 loads this default export from a plugin file or directory.
export default {
  id: 'claude-mem',
  async setup(ctx) {
    const bridge = createBridge(ctx)
    const stop = await bridge.start()
    return stop
  },
}
