import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MESSAGE_MAX_CHARS, STACK_MAX_CHARS, STACK_MAX_FRAMES, EXCEPTION_TYPE_MAX_CHARS } from '../../src/services/telemetry/error-scrub.js';
import { STACKTRACE_BUDGET_CHARS, FRAMES_MAX_PER_EVENT, EXCEPTION_LIST_MAX } from '../../src/services/telemetry/exception-boundary.js';

/**
 * Decision 14 disclosure contract: the CLI enable/help copy and the public telemetry doc must match the
 * implemented behavior — corrected guarantees, removed emitterless events, rollups vs buffer inputs, and
 * the actual limits. Text assertions alone do not establish the privacy guarantees; the runtime suites in
 * this directory do. This file pins the words to the code.
 */

const CLI_PATH = join(import.meta.dir, '..', '..', 'src', 'npx-cli', 'commands', 'telemetry.ts');
const DOC_PATH = join(import.meta.dir, '..', '..', 'docs', 'public', 'telemetry.mdx');

describe('Decision 14: disclosure matches runtime behavior', () => {
  it('CLI event inventory: rollups present, buffer inputs and emitterless events absent', () => {
    const source = readFileSync(CLI_PATH, 'utf8');
    for (const required of ['observer_turn_rollup', 'context_injected_rollup', 'work_state_usage_rollup', 'usage_limit_hit', 'worker_stopped', 'skill_invoked']) {
      expect(source).toContain(`'${required}'`);
    }
    for (const forbidden of ['error_occurred', 'pro_offer_viewed', 'trial_email_submitted', 'trial_link_sent', 'trial_poll_timeout']) {
      expect(source).not.toContain(`'${forbidden}'`);
    }
    // session_compressed / context_injected appear only inside the buffer-input explanation, never as inventory entries.
    const inventory = source.slice(source.indexOf('const EVENT_NAMES'), source.indexOf('];', source.indexOf('const EVENT_NAMES')));
    expect(inventory).not.toContain(`'session_compressed'`);
    expect(inventory).not.toContain(`'context_injected'`);
    expect(source).toContain('buffer');
  });

  it('CLI enable copy discloses bounded redacted errors and the kill-switch; never claims error messages are never collected', () => {
    const source = readFileSync(CLI_PATH, 'utf8');
    expect(source).toContain('ERROR TRACKING');
    expect(source).toContain('CLAUDE_MEM_TELEMETRY_ERRORS=0');
    expect(source).toContain('redacted');
    expect(source).toContain('source-context lines');
    const neverList = source.slice(source.indexOf('NEVER collected'), source.indexOf('ERROR TRACKING'));
    expect(neverList).not.toContain('error messages');
  });

  it('docs: no nonexistent instrument.ts, no emitterless events, rollups distinguished from buffer inputs', () => {
    const doc = readFileSync(DOC_PATH, 'utf8');
    expect(doc).not.toContain('instrument.ts');
    for (const forbidden of ['`pro_offer_viewed`', '`trial_email_submitted`', '`trial_link_sent`', '`trial_poll_timeout`', '`error_occurred`']) {
      expect(doc).not.toContain(forbidden);
    }
    expect(doc).toContain('`observer_turn_rollup`');
    expect(doc).toContain('no longer any code path that emits raw `session_compressed` or `context_injected` events directly');
  });

  it('docs: implemented redaction order, honest path and env guarantees, testable source-code guarantee, identifier removal', () => {
    const doc = readFileSync(DOC_PATH, 'utf8');
    // Implemented order: home substitution → URL credentials/query → absolute-path substitution.
    const order = doc.slice(doc.indexOf('in the implemented order'), doc.indexOf('6. Secret-shaped substrings'));
    expect(order.indexOf('Home directory')).toBeGreaterThan(-1);
    expect(order.indexOf('URL / connection-string credentials')).toBeGreaterThan(order.indexOf('Home directory'));
    expect(order.indexOf('Absolute filesystem paths')).toBeGreaterThan(order.indexOf('URL / connection-string credentials'));
    expect(doc).toContain('basenames and directory trees below `~` (and already-relative paths) intentionally survive');
    expect(doc).toContain('removed from **both** capture paths');
    expect(doc).toContain('No broader guarantee is claimed for arbitrary free-form error text');
    expect(doc).toContain('$release_id` / `$trace_id` / `$span_id`');
    expect(doc).toContain('no intentional collection of arbitrary environment values');
  });

  it('docs: consent refresh, queue boundaries, and instrumentation restart are stated; Windows shutdown limitation retained', () => {
    const doc = readFileSync(DOC_PATH, 'utf8');
    expect(doc).toContain('cached for at most 30 seconds');
    expect(doc).toContain('already accepted** into the SDK');
    expect(doc).toContain('autocapture instrumentation exists only in a client constructed with it');
    expect(doc).toContain('not directly probed');
  });

  it('docs and code agree on every published limit', () => {
    const doc = readFileSync(DOC_PATH, 'utf8');
    expect(doc).toContain(`capped to ${EXCEPTION_TYPE_MAX_CHARS} chars`);
    expect(doc).toContain(`capped to ${MESSAGE_MAX_CHARS} chars`);
    expect(doc).toContain(`top ${STACK_MAX_FRAMES} frames per event`);
    expect(doc).toContain(`${STACKTRACE_BUDGET_CHARS.toLocaleString('en-US')}-character serialized-stacktrace budget`);
    expect(doc).toContain('first 10 entries');
    expect(STACK_MAX_CHARS).toBe(2048);
    expect(FRAMES_MAX_PER_EVENT).toBe(10);
    expect(EXCEPTION_LIST_MAX).toBe(10);
  });
});
