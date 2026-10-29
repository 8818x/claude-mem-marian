import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAgentView } from '../../../src/services/work-view/agent-view.mjs';
import { reduceWorkState } from '../../../src/services/work-view/data-source.mjs';

const state = () => reduceWorkState([], { currentProject: 'repo', currentProjectScope: ['repo'] });
const session = (id, platform) => ({ id, platform_source: platform, content_session_id: `${platform}-${id}`,
  memory_session_id: `memory-${id}`, project: 'repo', user_prompt: `Inspect recorded request ${id}`,
  started_at_epoch: 1000, status: 'completed' });
const key = session => JSON.stringify(['conversation', session.platform_source, session.content_session_id]);
const observation = { id: 1, memory_session_id: 'memory-1', project: 'repo', title: 'Recent evidence',
  agent_id: null, agent_type: null, prompt_number: 1, created_at_epoch: 2000 };

test('an old request identifies its recorded session without inventing activity or live presence', () => {
  const view = buildAgentView(state(), { sessions: [session(1, 'codex'), session(2, 'claude')], observations: [observation] });
  assert.equal(view.humanRequests.length, 2);
  for (const request of view.humanRequests) assert.equal(request.agentIds.length, 1);
  const old = view.agents.find(agent => agent.sessionId === 2);
  assert.equal(old.label, 'Claude Code');
  assert.equal(old.identityEvidence, 'captured-session');
  assert.equal(old.presence.status, 'unknown');
  assert.equal(old.presence.isLive, null);
  assert.deepEqual(old.work, []);
  assert.deepEqual(old.activity, []);
  assert.equal(view.coverage.observations, 1);
  assert.equal(view.coverage.observationLimit, 300);
});

test('a grouped request links every recorded main session, including one outside recent activity', () => {
  const codex = session(1, 'codex'), claude = session(2, 'claude');
  const ledger = { groups: { conversations: { [key(codex)]: 'g_test', [key(claude)]: 'g_test' },
    groups: { g_test: { anchor: key(codex), projectRoot: 'repo', title: 'Shared request' } }, ignored: {} } };
  const view = buildAgentView(state(), { sessions: [codex, claude], observations: [observation] }, { ledger });
  assert.equal(view.humanRequests.length, 1);
  const agents = view.humanRequests[0].agentIds.map(id => view.agents.find(agent => agent.id === id));
  assert.deepEqual(agents.map(agent => agent.platformSource).sort(), ['claude', 'codex']);
  assert.equal(view.recentActivity.length, 1);
});

test('a loaded session without a human request or activity does not add an empty agent group', () => {
  const ignored = { ...session(2, 'claude'), user_prompt: '<environment_context>runtime setup</environment_context>' };
  const view = buildAgentView(state(), { sessions: [session(1, 'codex'), ignored] });
  assert.equal(view.agents.length, 1);
  assert.equal(view.agents[0].label, 'Codex');
  assert.equal(view.humanRequests.length, 1);
});
