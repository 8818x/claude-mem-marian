/**
 * Regression tests for issue #2248: Cursor IDE sessions are never summarized.
 *
 * Validates the three fixes that make Cursor sessions actually get summarized
 * end-to-end (previously they were silently skipped):
 *   B. `extractLastMessageFromJsonl` accepts both `{type:"assistant"}` (Claude
 *      Code) and `{role:"assistant"}` (Cursor) per-line role markers.
 *   C. `extractLastMessageFromJsonl` keeps scanning back through assistant
 *      turns when the most recent one is a pure tool_use (no text content),
 *      instead of returning an empty string and causing the summary to be
 *      skipped.
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir, homedir } from 'os';
import { extractLastMessage, extractLastMessageFromJsonl } from '../../src/shared/transcript-parser.js';

const FIXTURE_PATH = join(__dirname, '..', 'fixtures', 'cursor-session.jsonl');

// ---------------------------------------------------------------------------
// Bug B + C: extractLastMessageFromJsonl on the cursor-session.jsonl fixture
// ---------------------------------------------------------------------------

describe('cursor-extraction: extractLastMessageFromJsonl on fixture', () => {
  const fixtureContent = readFileSync(FIXTURE_PATH, 'utf-8').trim();

  it('returns the last user text from the fixture', () => {
    expect(extractLastMessageFromJsonl(fixtureContent, 'user', false)).toBe(
      'thanks, also tell me what you found'
    );
  });

  it('returns the final assistant text (skipping tool_use-only turn)', () => {
    expect(extractLastMessageFromJsonl(fixtureContent, 'assistant', false)).toBe(
      'Here are the files: adapters, handlers, types.'
    );
  });
});

// ---------------------------------------------------------------------------
// Bug B + C: extractLastMessage with extra inline cases
// ---------------------------------------------------------------------------

describe('cursor-extraction: extractLastMessage Cursor JSONL compatibility', () => {
  const tmpDir = join(tmpdir(), `cursor-extraction-test-${Date.now()}`);
  const transcriptPath = join(tmpDir, 'transcript.jsonl');

  beforeEach(() => {
    mkdirSync(tmpDir, { recursive: true });
  });
  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('reads Cursor JSONL using {"role":"assistant"} (Bug B regression)', () => {
    const lines = [
      { role: 'user', message: { content: [{ type: 'text', text: 'hello' }] } },
      { role: 'assistant', message: { content: [{ type: 'text', text: 'hi from cursor' }] } },
    ];
    writeFileSync(transcriptPath, lines.map((l) => JSON.stringify(l)).join('\n'));

    expect(extractLastMessage(transcriptPath, 'assistant')).toBe('hi from cursor');
  });

  it('skips a tool-only last assistant turn and returns the previous text-bearing one (Bug C regression)', () => {
    const lines = [
      { role: 'user', message: { content: [{ type: 'text', text: 'q1' }] } },
      { role: 'assistant', message: { content: [{ type: 'text', text: 'real answer' }] } },
      { role: 'user', message: { content: [{ type: 'text', text: 'q2' }] } },
      { role: 'assistant', message: { content: [{ type: 'tool_use', name: 'Shell', input: { command: 'ls' } }] } },
    ];
    writeFileSync(transcriptPath, lines.map((l) => JSON.stringify(l)).join('\n'));

    expect(extractLastMessage(transcriptPath, 'assistant')).toBe('real answer');
  });

  it('still returns "" when no assistant turn exists at all', () => {
    const lines = [{ role: 'user', message: { content: [{ type: 'text', text: 'lonely' }] } }];
    writeFileSync(transcriptPath, lines.map((l) => JSON.stringify(l)).join('\n'));

    expect(extractLastMessage(transcriptPath, 'assistant')).toBe('');
  });

  it('still works for Claude Code format using {"type":"assistant"}', () => {
    const lines = [
      { type: 'user', message: { content: [{ type: 'text', text: 'q' }] } },
      { type: 'assistant', message: { content: [{ type: 'text', text: 'claude code answer' }] } },
    ];
    writeFileSync(transcriptPath, lines.map((l) => JSON.stringify(l)).join('\n'));

    expect(extractLastMessage(transcriptPath, 'assistant')).toBe('claude code answer');
  });
});

// ---------------------------------------------------------------------------
// Greptile P1 (PR #2282): malformed JSONL lines must not crash the pipeline
// ---------------------------------------------------------------------------

describe('cursor-extraction: malformed JSONL tolerance', () => {
  it('skips truncated/malformed lines and returns the last valid match', () => {
    const validLine = JSON.stringify({
      role: 'assistant',
      message: { content: [{ type: 'text', text: 'recovered text' }] },
    });
    const malformed = '{"role":"assistant","message":{"content":[{"type":"tex'; // truncated mid-write
    const content = [validLine, malformed].join('\n');

    expect(() => extractLastMessageFromJsonl(content, 'assistant', false)).not.toThrow();
    expect(extractLastMessageFromJsonl(content, 'assistant', false)).toBe('recovered text');
  });

  it('returns empty string when ALL lines are malformed', () => {
    const content = ['{partial', 'not even close to json', '}{'].join('\n');
    expect(extractLastMessageFromJsonl(content, 'assistant', false)).toBe('');
  });

  // CodeRabbit Major + Greptile P1 (PR #2282 follow-up): a valid JSON line
  // whose `message.content` is an unexpected type (null, number, plain
  // object) used to throw. It must now be skipped — same tolerance class as
  // truncated lines.
  it('skips a line whose message.content is null and falls back to a valid earlier line', () => {
    const valid = JSON.stringify({
      role: 'assistant',
      message: { content: [{ type: 'text', text: 'kept' }] },
    });
    const nullContent = JSON.stringify({
      role: 'assistant',
      message: { content: null },
    });
    const content = [valid, nullContent].join('\n');

    expect(() => extractLastMessageFromJsonl(content, 'assistant', false)).not.toThrow();
    expect(extractLastMessageFromJsonl(content, 'assistant', false)).toBe('kept');
  });

  it('skips a line whose message.content is a number without throwing', () => {
    const valid = JSON.stringify({
      role: 'assistant',
      message: { content: [{ type: 'text', text: 'kept too' }] },
    });
    const numericContent = JSON.stringify({
      role: 'assistant',
      message: { content: 42 },
    });
    const content = [valid, numericContent].join('\n');

    expect(() => extractLastMessageFromJsonl(content, 'assistant', false)).not.toThrow();
    expect(extractLastMessageFromJsonl(content, 'assistant', false)).toBe('kept too');
  });

  it('skips a line whose message.content is a plain object without throwing', () => {
    const valid = JSON.stringify({
      role: 'assistant',
      message: { content: [{ type: 'text', text: 'survivor' }] },
    });
    const objectContent = JSON.stringify({
      role: 'assistant',
      message: { content: { unexpected: 'shape' } },
    });
    const content = [valid, objectContent].join('\n');

    expect(() => extractLastMessageFromJsonl(content, 'assistant', false)).not.toThrow();
    expect(extractLastMessageFromJsonl(content, 'assistant', false)).toBe('survivor');
  });
});
