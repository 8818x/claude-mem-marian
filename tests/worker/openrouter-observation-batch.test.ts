import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { OpenRouterProvider } from '../../src/services/worker/OpenRouterProvider.js';
import { SessionManager } from '../../src/services/worker/SessionManager.js';
import { SettingsDefaultsManager } from '../../src/shared/SettingsDefaultsManager.js';
import { SettingsRoutes } from '../../src/services/worker/http/routes/SettingsRoutes.js';
import { parseOpenRouterObservationBatch } from '../../src/services/worker/openrouter-observation-batch.js';
import { SessionStore } from '../../src/services/sqlite/SessionStore.js';
import type { PendingMessage } from '../../src/services/worker-types.js';
import { ModeManager } from '../../src/services/domain/ModeManager.js';
import codeMode from '../../plugin/modes/code.json';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

afterEach(() => mock.restore());

const xml = (id: number) => `<observation><type>discovery</type><title>Finding ${id}</title><facts><fact>Independent finding ${id}</fact></facts><narrative>Evidence for ${id}</narrative><files_read><file>file-${id}</file></files_read></observation>`;

function harness(size = '8') {
  spyOn(ModeManager, 'getInstance').mockReturnValue({ getActiveMode: () => codeMode } as never);
  spyOn(SettingsDefaultsManager, 'loadFromFile').mockImplementation(() => ({
    ...SettingsDefaultsManager.getAllDefaults(), CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE: size,
  }));
  const manager = new SessionManager(null as never);
  const session: any = { sessionDbId: 1, contentSessionId: 'test', memorySessionId: 'test', project: 'batch-test',
    abortController: new AbortController(), claimedMessageIds: [], earliestPendingTimestamp: null,
    conversationHistory: [{ role: 'user', content: 'shared context once', framing: true }], lastPromptNumber: 1,
    cumulativeInputTokens: 0, cumulativeOutputTokens: 0, lastGeneratorSource: 'ingest' };
  (manager as any).sessions.set(1, session);
  const buffer = manager.getMessageBuffer();
  const stored: any[] = [];
  const store = mock((...args: any[]) => {
    stored.push({ args, claims: manager.getClaimedMessages(1) });
    return { observationIds: [], summaryId: null, createdAtEpoch: 1 };
  });
  const db = { getSessionStore: () => ({ storeObservations: store,
    ensureMemorySessionIdRegistered: () => 'test' }), getChromaSync: () => null, getCloudSync: () => null };
  const provider: any = new OpenRouterProvider(db as never, manager);
  provider.conversationMaxChars = () => 1_000_000;
  const config = { model: 'test', apiKey: 'test', apiKeys: ['test'], fallbackModels: [], apiUrl: 'https://example.test/v1/chat/completions' };
  const requests: any[] = [];
  const send = provider.query.bind(provider);
  let reply: ((ids: number[]) => string) | undefined;
  provider.query = mock(async (history: any[]) => {
    const ids = [...session.claimedMessageIds];
    requests.push({ ids, history: [...history], prompt: history.at(-1).content });
    const content = reply ? reply(ids) : ids.length === 1 ? xml(ids[0])
      : JSON.stringify({ results: ids.map(id => ({ id, xml: xml(id) })).reverse() });
    return { content, tokensUsed: 80 };
  });
  const enqueue = (overrides: Partial<PendingMessage> = {}) => buffer.enqueue(1, {
    type: 'observation', tool_name: 'Read', tool_input: { file_path: `file-${buffer.getPendingCount(1) + 1}` },
    tool_response: 'contents', prompt_number: 1, ...overrides,
  }, 1000 + buffer.getPendingCount(1));
  const step = async (worker?: any) => {
    const first = manager.claimNextObservation(1, () => true)!;
    await provider.processObservationMessage(session, first, worker, config, first._originalTimestamp, first.cwd);
  };
  const drain = async () => {
    while (buffer.getPendingCount(1) && !session.abortController.signal.aborted) await step();
  };
  const resume = async () => {
    await manager.resetProcessingToPending(1);
    session.abortController = new AbortController(); session.abortReason = null;
    session.conversationHistory = [];
  };
  return { manager, session, buffer, provider, config, enqueue, step, drain, resume, requests, store, stored, send,
    setReply: (value?: (ids: number[]) => string) => { reply = value; } };
}

describe('OpenRouter observation batching', () => {
  it('sends 14 queued observations through two actual HTTP generation requests', async () => {
    const h = harness(); for (let i = 0; i < 14; i++) h.enqueue();
    h.provider.query = h.send;
    const bodies: any[] = [];
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation((async (_url, init) => {
      bodies.push(JSON.parse(String(init?.body)));
      return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
        results: h.session.claimedMessageIds.map((id: number) => ({ id, xml: xml(id) })),
      }) }, finish_reason: 'stop' }] }), { headers: { 'Content-Type': 'application/json' } });
    }) as typeof fetch);
    await h.drain();
    expect(fetchSpy).toHaveBeenCalledTimes(2); expect(h.stored).toHaveLength(14);
    expect(bodies.every(body => body.messages.length > 0)).toBe(true);
  });

  for (const [count, size, calls] of [[1, 8, 1], [8, 8, 1], [14, 8, 2], [14, 1, 14]]) {
    it(`${count} observations with batch size ${size} make ${calls} generation calls`, async () => {
      const h = harness(String(size));
      for (let i = 0; i < count; i++) h.enqueue();
      await h.drain();
      expect(h.requests).toHaveLength(calls);
      expect(h.stored).toHaveLength(count);
      expect(h.buffer.getPendingCount(1)).toBe(0);
      expect(h.requests.map(request => request.ids.length)).toEqual(count === 14 && size === 8 ? [8, 6] : Array(calls).fill(size === 1 ? 1 : count));
    });
  }

  it('maps reordered replies to each input, file, agent, prompt, timestamp and tool call', async () => {
    const h = harness();
    for (let i = 1; i <= 8; i++) h.enqueue({ agentId: `agent-${i}`, agentType: `type-${i}`,
      prompt_number: i, cwd: `cwd-${i}`, toolUseId: `tool-${i}` });
    await h.drain();
    expect(h.stored.map(record => record.args[2][0].title)).toEqual(Array.from({ length: 8 }, (_, i) => `Finding ${i + 1}`));
    for (let i = 1; i <= 8; i++) {
      const { args, claims } = h.stored[i - 1];
      expect(args[2][0].agent_id).toBe(`agent-${i}`);
      expect(args[2][0].agent_type).toBe(`type-${i}`);
      expect(args[2][0].files_read).toEqual([`file-${i}`]);
      expect(args[4]).toBe(i); expect(args[6]).toBe(999 + i);
      expect(claims.map((claim: any) => claim.toolUseId)).toEqual([`tool-${i}`]);
    }
    expect(h.requests[0].history.filter((turn: any) => turn.content === 'shared context once')).toHaveLength(1);
    expect(h.requests[0].prompt.match(/Return either one or more/g)).toHaveLength(1);
    expect(h.session.conversationHistory.filter((turn: any) => turn.role === 'assistant')).toHaveLength(1);
  });

  for (const malformed of [
    () => 'not JSON',
    (ids: number[]) => JSON.stringify({ results: ids.slice(1).map(id => ({ id, xml: xml(id) })) }),
    (ids: number[]) => JSON.stringify({ results: ids.map(id => ({ id: ids[0], xml: xml(id) })) }),
    (ids: number[]) => JSON.stringify({ results: ids.map(id => ({ id: id + 100, xml: xml(id) })) }),
    (ids: number[]) => JSON.stringify({ results: ids.map((id, i) => ({ id, xml: i ? xml(id) : xml(id) + '<observation>truncated' })) }),
  ]) {
    it('retains the entire malformed batch without partial persistence, then retries once successfully', async () => {
      const h = harness(); for (let i = 0; i < 8; i++) h.enqueue();
      h.setReply(malformed); await h.step();
      expect(h.store).not.toHaveBeenCalled(); expect(h.buffer.getPendingCount(1)).toBe(8);
      expect(h.session.abortReason).toBe('output_retry:openrouter_batch');
      await h.resume(); h.setReply(); await h.drain();
      expect(h.stored).toHaveLength(8); expect(h.buffer.getPendingCount(1)).toBe(0);
    });
  }

  it('does not acknowledge a rejected request', async () => {
    const h = harness(); for (let i = 0; i < 8; i++) h.enqueue();
    h.provider.query = mock(async () => { throw new Error('request failed'); });
    await expect(h.step()).rejects.toThrow('request failed');
    expect(h.store).not.toHaveBeenCalled(); expect(h.buffer.getPendingCount(1)).toBe(8);
    expect(h.session.claimedMessageIds).toHaveLength(8);
    const error = new Error('storage or HTTP failure');
    expect(() => h.provider.handleSessionError(error, h.session)).toThrow(error);
    expect(h.session.abortReason).toBe('transport:transient');
    expect(h.session.abortController.signal.aborted).toBe(true);
  });

  it('retries only unpersisted items after a storage failure without duplicate memories', async () => {
    const h = harness(); for (let i = 0; i < 8; i++) h.enqueue();
    const realStore = new SessionStore(':memory:');
    const sessionId = realStore.createSDKSession('test', 'batch-test', 'request');
    realStore.updateMemorySessionId(sessionId, 'test');
    const originalStore = h.store.getMockImplementation()!;
    let fail = true;
    h.store.mockImplementation((...args: any[]) => {
      if (fail && args[2][0].title === 'Finding 4') throw new Error('storage failed');
      realStore.storeObservations(...args as Parameters<SessionStore['storeObservations']>);
      return originalStore(...args);
    });
    try {
      await expect(h.step()).rejects.toThrow('storage failed');
      expect(h.buffer.getPendingCount(1)).toBe(5);
      expect(h.session.claimedMessageIds).toEqual([4, 5, 6, 7, 8]);
      fail = false; await h.resume(); await h.drain();
      const rows = realStore.db.query('SELECT title FROM observations ORDER BY id').all();
      expect(rows).toEqual(Array.from({ length: 8 }, (_, i) => ({ title: `Finding ${i + 1}` })));
      expect(h.requests.map(request => request.ids)).toEqual([[1, 2, 3, 4, 5, 6, 7, 8], [4, 5, 6, 7, 8]]);
    } finally { realStore.close(); }
  });

  it('supports an explicit skip independently of neighboring memories', async () => {
    const h = harness(); h.enqueue(); h.enqueue();
    h.setReply(ids => JSON.stringify({ results: [{ id: ids[0], xml: '<skip_summary reason="noise" />' }, { id: ids[1], xml: xml(ids[1]) }] }));
    await h.drain();
    expect(h.stored.flatMap(record => record.args[2]).map(observation => observation.title)).toEqual(['Finding 2']);
    expect(h.buffer.getPendingCount(1)).toBe(0);
  });

  it('keeps stored items acknowledged when a post-storage side effect throws', async () => {
    const h = harness(); for (let i = 0; i < 8; i++) h.enqueue();
    let broadcasts = 0;
    await expect(h.step({ broadcastProcessingStatus: () => {
      if (++broadcasts === 3) throw new Error('broadcast failed after storage');
    } })).rejects.toThrow('broadcast failed after storage');
    expect(h.session.claimedMessageIds).toEqual([4, 5, 6, 7, 8]);
    await h.resume(); await h.drain();
    expect(h.stored.map(record => record.args[2][0].title)).toEqual(Array.from({ length: 8 }, (_, i) => `Finding ${i + 1}`));
  });

  it('accepts the maximum size of 32', async () => {
    const h = harness('32'); for (let i = 0; i < 33; i++) h.enqueue();
    await h.drain(); expect(h.requests.map(request => request.ids.length)).toEqual([32, 1]);
    expect((new SettingsRoutes({} as never) as any).validateSettings({ CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE: '32' }).valid).toBe(true);
  });

  it('does not claim across a queued summary or into another session', async () => {
    const h = harness(); const id = h.enqueue();
    h.buffer.enqueue(1, { type: 'summarize' }); h.enqueue(); h.buffer.enqueue(2, { type: 'observation' });
    await h.step();
    expect(h.requests[0].ids).toEqual([id]); expect(h.buffer.getPendingCount(1)).toBe(2);
    expect(h.buffer.getPendingCount(2)).toBe(1);
  });

  for (const size of ['0', '-1', '33', '1.5', 'garbage', '']) {
    it(`invalid batch size ${JSON.stringify(size)} falls back to 8 and API saves reject it`, async () => {
      const h = harness(size); for (let i = 0; i < 14; i++) h.enqueue(); await h.drain();
      expect(h.requests.map(request => request.ids.length)).toEqual([8, 6]);
      const routes: any = new SettingsRoutes({} as never);
      expect(routes.validateSettings({ CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE: size }).valid).toBe(false);
    });
  }

  it('validates complete per-item XML without accepting a hidden skip or missing title', () => {
    for (const invalid of [xml(1) + '<skip_summary />', '<observation><type>discovery</type></observation>']) {
      expect(parseOpenRouterObservationBatch(JSON.stringify({ results: [{ id: 1, xml: invalid }] }), [1])).toBeNull();
    }
  });

  it('loads the setting from existing flat/wrapped files with environment precedence', () => {
    const directory = mkdtempSync(join(tmpdir(), 'openrouter-batch-settings-'));
    const path = join(directory, 'settings.json');
    const key = 'CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE';
    const previous = process.env[key];
    try {
      delete process.env[key];
      for (const document of [{ [key]: '4' }, { env: { [key]: '4' }, other: 'preserved' }]) {
        writeFileSync(path, JSON.stringify(document));
        expect(SettingsDefaultsManager.loadFromFile(path, { readOnly: true })[key]).toBe('4');
        process.env[key] = '32';
        expect(SettingsDefaultsManager.loadFromFile(path, { readOnly: true })[key]).toBe('32');
        delete process.env[key];
      }
      writeFileSync(path, '{}');
      expect(SettingsDefaultsManager.loadFromFile(path, { readOnly: true })[key]).toBe('8');
    } finally {
      if (previous === undefined) delete process.env[key]; else process.env[key] = previous;
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
