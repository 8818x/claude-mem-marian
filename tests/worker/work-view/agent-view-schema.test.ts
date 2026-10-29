import { describe, expect, it } from 'bun:test';
import { SessionStore } from '../../../src/services/sqlite/SessionStore.js';
import { readAgentRecords, buildAgentView } from '../../../src/services/work-view/agent-view.mjs';
import { reduceWorkState } from '../../../src/services/work-view/data-source.mjs';

describe('Work View observation agent attribution with the production schema', () => {
  it('shows Codex and Claude sessions without requiring content_session_id on observations', () => {
    const store = new SessionStore(':memory:');
    try {
      const columns = store.db.query('PRAGMA table_info(observations)').all() as Array<{ name: string }>;
      expect(columns.some(column => column.name === 'content_session_id')).toBe(false);
      for (const platform of ['codex', 'claude']) {
        const id = store.createSDKSession(`${platform}-session`, 'attribution-test', `Inspect ${platform} work`);
        store.db.query('UPDATE sdk_sessions SET platform_source = ? WHERE id = ?').run(platform, id);
        store.updateMemorySessionId(id, `${platform}-memory`);
        store.storeObservations(`${platform}-memory`, 'attribution-test', [{
          type: 'discovery', title: `${platform} recorded finding`, subtitle: null,
          facts: ['Tool evidence was captured'], narrative: 'Independent recorded work',
          concepts: [], files_read: [], files_modified: [],
        }], null, 1, 0);
      }
      const records = readAgentRecords(store.db);
      expect(records.observations).toHaveLength(2);
      expect(records.sessions).toHaveLength(2);
      const view = buildAgentView(reduceWorkState([], {
        currentProject: 'attribution-test', currentProjectScope: ['attribution-test'],
      }), records);
      expect(view.coverage.observations).toBe(2);
      expect(view.agents.map(agent => agent.platformSource).sort()).toEqual(['claude', 'codex']);
      const codex = view.agents.find(agent => agent.platformSource === 'codex')!;
      expect(codex.label).toBe('Codex');
      expect(codex.agentType).toBeNull();
      expect(codex.agentId).toBeNull();
      expect(codex.work).toHaveLength(1);
      expect(codex.activity[0].title).toBe('codex recorded finding');
      expect(view.agents.find(agent => agent.platformSource === 'claude')?.label).toBe('Claude Code');
    } finally { store.close(); }
  });
});
