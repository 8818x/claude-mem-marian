import { randomUUID } from 'node:crypto';

const PLATFORM_SOURCE = 'dsh';
const DEFAULT_WORKER_URL = 'http://127.0.0.1:37777';
const TIMEOUT_MS = 2000;

export function textFromContent(content) {
  if (!Array.isArray(content)) return '';
  return content
    .filter((block) => block?.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('');
}

export function localWorkerBase(value) {
  let url;
  try {
    url = new URL(typeof value === 'string' && value.trim() ? value.trim() : DEFAULT_WORKER_URL);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (url.protocol !== 'http:' || !['localhost', '127.0.0.1', '::1'].includes(host)) return null;
  return url.origin;
}

async function request(base, path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(new URL(path, base), {
      method,
      redirect: 'error',
      signal: controller.signal,
      headers: body === undefined ? undefined : { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`worker returned HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function messageText(message) {
  return textFromContent(message?.content);
}

export function apply(ctx, config = {}) {
  const workerUrl = localWorkerBase(config.workerUrl);
  const sessions = new Map();
  let warned = false;

  const warn = () => {
    if (warned) return;
    warned = true;
    ctx.logger?.warn?.('[claude-mem-marian] Local worker is unavailable; memory bridge skipped.');
  };

  const enqueue = (state, task) => {
    state.pending = state.pending.then(task).catch(warn);
  };

  const finish = (state) => {
    if (state.finished) return;
    state.finished = true;
    enqueue(state, async () => {
      if (!workerUrl || !state.initialized) return;
      await request(workerUrl, '/api/sessions/summarize', {
        method: 'POST',
        body: {
          contentSessionId: state.sessionId,
          last_assistant_message: state.lastAssistant,
          platformSource: PLATFORM_SOURCE,
          cwd: state.cwd,
        },
      });
    });
  };

  const onCreated = async ({ agent, source }) => {
    const session = agent.ctx.sessions?.get(agent.id);
    if (!session) return;

    const state = {
      sessionId: agent.id,
      cwd: typeof session.header?.cwd === 'string' ? session.header.cwd : '',
      turn: { user: [], assistant: '' },
      lastAssistant: '',
      memoryMessageId: undefined,
      initialized: false,
      finished: false,
      pending: Promise.resolve(),
      dispose: undefined,
    };
    sessions.set(agent.id, state);

    state.dispose = agent.ctx.on('session/event', (_session, event) => {
      const data = event?.data;
      if (event?.type === 'user/message') {
        if (state.memoryMessageId && data?.id === state.memoryMessageId) {
          state.memoryMessageId = undefined;
          return;
        }
        const text = messageText(data);
        if (text.trim()) state.turn.user.push(text);
        return;
      }
      if (event?.type === 'assistant/message') {
        const text = messageText(data?.message);
        if (text.trim()) state.turn.assistant = text;
        return;
      }
      if (event?.type !== 'turn/end') return;

      const turn = state.turn;
      state.turn = { user: [], assistant: '' };
      const prompt = turn.user.join('\n\n').trim();
      const assistant = turn.assistant.trim();
      if (!prompt) return;

      state.lastAssistant = assistant;
      enqueue(state, async () => {
        if (!workerUrl || !state.cwd) return;
        const contentSessionId = state.sessionId;
        await request(workerUrl, '/api/sessions/init', {
          method: 'POST',
          body: {
            contentSessionId,
            prompt,
            nativePromptId: `dsh-${randomUUID()}`,
            cwd: state.cwd,
            platformSource: PLATFORM_SOURCE,
          },
        });
        state.initialized = true;
        if (!assistant) return;
        await request(workerUrl, '/api/sessions/observations', {
          method: 'POST',
          body: {
            contentSessionId,
            tool_name: 'DSH conversation',
            tool_input: { userMessage: prompt },
            tool_response: { assistantMessage: assistant },
            cwd: state.cwd,
            platformSource: PLATFORM_SOURCE,
          },
        });
      });
    });

    if (!workerUrl || !state.cwd || !['startup', 'clear'].includes(source)) return;
    try {
      const url = new URL('/api/context/inject', workerUrl);
      url.searchParams.set('cwd', state.cwd);
      url.searchParams.set('sessionId', state.sessionId);
      url.searchParams.set('platformSource', PLATFORM_SOURCE);
      const memory = (await request(workerUrl, `${url.pathname}${url.search}`)).trim();
      if (memory) {
        state.memoryMessageId = randomUUID();
        agent.inject({
          id: state.memoryMessageId,
          role: 'user',
          content: [{ type: 'text', text: memory }],
          source: { kind: 'user' },
        });
      }
    } catch {
      warn();
    }
  };

  const onDisposed = ({ agent }) => {
    const state = sessions.get(agent.id);
    if (!state) return;
    finish(state);
    state.dispose?.();
    sessions.delete(agent.id);
  };

  const stopCreated = ctx.on('agent/created', onCreated);
  const stopDisposed = ctx.on('agent/disposed', onDisposed);

  return () => {
    stopCreated?.();
    stopDisposed?.();
    for (const state of sessions.values()) {
      finish(state);
      state.dispose?.();
    }
    sessions.clear();
  };
}
