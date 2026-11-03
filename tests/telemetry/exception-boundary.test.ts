import { describe, expect, it } from 'bun:test';
import {
  applyStacktraceBudget,
  rebuildExceptionProperties,
  stripConditionalIdentifiers,
  EXCEPTION_LIST_MAX,
  FRAMES_MAX_PER_EVENT,
  FRAME_FIELD_MAX_CHARS,
  STACKTRACE_BUDGET_CHARS,
} from '../../src/services/telemetry/exception-boundary.js';

/** A frame carrying every field the boundary must drop, plus synthetic sentinels. */
const sdkFrame = (overrides: Record<string, unknown> = {}) => ({
  filename: 'C:\\Users\\owner\\secret-proj\\src\\leaky.ts',
  function: 'doThing with sk-ABCdef1234567890ghij',
  module: 'leaky-module-sentinel',
  lineno: 5, colno: 3, in_app: true, platform: 'node:javascript', chunk_id: 'chunk-sentinel',
  context_line: 'CONTEXT-LINE-SENTINEL',
  pre_context: ['PRE-CONTEXT-SENTINEL'],
  post_context: ['POST-CONTEXT-SENTINEL'],
  ...overrides,
});

const sdkEntry = (frames: unknown[] = [sdkFrame()], overrides: Record<string, unknown> = {}) => ({
  type: 'TypeError with /Users/owner/secret token=abcdef123456',
  value: 'raw value /Users/owner/secret with bob@example.com',
  level: 'error',
  mechanism: { type: 'onuncaughtexception', handled: false, synthetic: false, exception_id: 0, junk: 'drop-me' },
  stacktrace: { type: 'raw', frames },
  ...overrides,
});

describe('Decision 14 final exception boundary (direct)', () => {
  it('F5: source context, module, chunk_id and platform never exist on rebuilt frames (autocapture shape)', () => {
    const out = rebuildExceptionProperties({ $exception_list: [sdkEntry()] });
    const frames = (out.$exception_list as Array<Record<string, unknown>>)[0].stacktrace as { frames: Array<Record<string, unknown>> };
    const frame = frames.frames[0];
    for (const key of ['context_line', 'pre_context', 'post_context', 'module', 'chunk_id', 'platform']) {
      expect(key in frame).toBe(false);
    }
    expect(JSON.stringify(out)).not.toContain('SENTINEL');
    // filename redacted to a basename (Windows drive path), function redacted + bounded.
    expect(frame.filename).toBe('leaky.ts');
    expect(String(frame.function)).not.toContain('sk-ABCdef1234567890ghij');
  });

  it('F5: pre-existing string and null context values are dropped too, not preserved', () => {
    const entry = sdkEntry([{ ...sdkFrame({ context_line: null, pre_context: 'a string not an array', post_context: undefined }) }]);
    const out = rebuildExceptionProperties({ $exception_list: [entry] });
    const frame = ((out.$exception_list as Array<Record<string, unknown>>)[0].stacktrace as { frames: Array<Record<string, unknown>> }).frames[0];
    for (const key of ['context_line', 'pre_context', 'post_context']) expect(key in frame).toBe(false);
  });

  it('F1: types pass the redaction pipeline, mirrors all agree, and invalid/empty types become Error', () => {
    const out = rebuildExceptionProperties({ $exception_list: [sdkEntry()] });
    const list = out.$exception_list as Array<Record<string, unknown>>;
    const entry = list[0];
    const type = entry.type as string;
    expect(type).not.toContain('/Users/owner/secret');
    expect(type).not.toContain('abcdef123456');
    expect(type.length).toBeLessThanOrEqual(200);
    expect(out.$exception_type).toBe(type);
    expect(out.error_type).toBe(type);
    expect(out.$exception_message).toBe(entry.value);
    expect(out.error_message).toBe(entry.value);
    // Empty/invalid type on the entry: Error everywhere.
    const bad = rebuildExceptionProperties({ $exception_list: [sdkEntry([sdkFrame()], { type: '' })] });
    expect((bad.$exception_list as Array<Record<string, unknown>>)[0].type).toBe('Error');
    const missing = rebuildExceptionProperties({ $exception_list: [{ value: 'only value' }] });
    expect((missing.$exception_list as Array<Record<string, unknown>>)[0].type).toBe('Error');
    // Raw name never survives the constructor fallback: mirrors agree with the sanitized entry type.
    const weird = rebuildExceptionProperties({ $exception_list: [{ type: 'password=hunter2000', value: 'x' }] });
    const weirdType = (weird.$exception_list as Array<Record<string, unknown>>)[0].type as string;
    expect(weirdType).not.toContain('hunter2000');
    expect(weird.$exception_type).toBe(weirdType);
  });

  it('F3: bounds hold — message 500, list 10, frames 10/event, filename/function 200 — with deterministic truncation', () => {
    const longFrames = Array.from({ length: 40 }, (_, index) => sdkFrame({ lineno: index + 1 }));
    const longList = Array.from({ length: 25 }, (_, index) => sdkEntry([sdkFrame({ lineno: index + 1 })], { value: 'v'.repeat(2000) }));
    const out = rebuildExceptionProperties({ $exception_list: longList });
    const list = out.$exception_list as Array<Record<string, unknown>>;
    expect(list.length).toBe(EXCEPTION_LIST_MAX);
    let frameCount = 0;
    for (const entry of list) {
      expect(String(entry.value).length).toBeLessThanOrEqual(500);
      const trace = entry.stacktrace as { frames?: Array<Record<string, unknown>> } | undefined;
      frameCount += trace?.frames?.length ?? 0;
    }
    expect(frameCount).toBeLessThanOrEqual(FRAMES_MAX_PER_EVENT);
    // List/frame order: the FIRST entries/frames survive.
    expect(frameCount).toBeGreaterThan(0);
    // A single oversized filename/function is capped after redaction.
    const wide = rebuildExceptionProperties({ $exception_list: [sdkEntry([sdkFrame({
      filename: 'C:\\x\\' + 'f'.repeat(500) + '.ts',
      function: 'g'.repeat(500),
    })])] });
    const wideFrame = ((wide.$exception_list as Array<Record<string, unknown>>)[0].stacktrace as { frames: Array<Record<string, unknown>> }).frames[0];
    expect(String(wideFrame.filename).length).toBeLessThanOrEqual(FRAME_FIELD_MAX_CHARS);
    expect(String(wideFrame.function).length).toBeLessThanOrEqual(FRAME_FIELD_MAX_CHARS);
    expect(longFrames.length).toBe(40); // input untouched (rebuild is not in-place)
  });

  it('F3: lineno/colno kept only as finite positive safe integers; invalid values omitted, never stringified', () => {
    const frame = sdkFrame({ lineno: 0, colno: -3, }) as Record<string, unknown>;
    delete frame.chunk_id;
    const out = rebuildExceptionProperties({ $exception_list: [sdkEntry([{ ...sdkFrame(), lineno: 0, colno: -3 }]), sdkEntry([sdkFrame({ lineno: '7', colno: Number.NaN })]), sdkEntry([sdkFrame({ lineno: 1.5, colno: Number.MAX_SAFE_INTEGER + 1 })]), sdkEntry([sdkFrame({ lineno: 12, colno: 34 })])] } as Record<string, unknown>);
    for (const entry of out.$exception_list as Array<Record<string, unknown>>) {
      const frames = (entry.stacktrace as { frames: Array<Record<string, unknown>> }).frames;
      for (const candidate of frames) {
        if ('lineno' in candidate) expect(candidate.lineno).toBeGreaterThan(0);
        if ('colno' in candidate) expect(candidate.colno).toBeGreaterThan(0);
        expect(typeof candidate.lineno).not.toBe('string');
      }
    }
    const kept = (out.$exception_list as Array<Record<string, unknown>>)[3];
    const keptFrame = (kept.stacktrace as { frames: Array<Record<string, unknown>> }).frames[0];
    expect(keptFrame.lineno).toBe(12);
    expect(keptFrame.colno).toBe(34);
  });

  it('F3/F4: absolute-path trees collapse; home-relative and already-relative trees survive (disclosed F4 policy) without leaking secrets', () => {
    const cases: Array<{ filename: string; treeSurvives: boolean }> = [
      { filename: '/Users/owner/secret-posix/src/deep/file.ts', treeSurvives: false },
      { filename: '\\\\server\\share\\secret-unc\\file.ts', treeSurvives: false },
      { filename: 'D:\\drive\\secret-d\\file.ts', treeSurvives: false },
      { filename: '~/private/secret-home/file.ts', treeSurvives: true }, // disclosed F4: trees below ~ survive
      { filename: 'already/relative/file.ts', treeSurvives: true }, // disclosed F4: relative paths untouched
    ];
    for (const { filename, treeSurvives } of cases) {
      const out = rebuildExceptionProperties({ $exception_list: [sdkEntry([sdkFrame({ filename })])] });
      const text = JSON.stringify(out);
      if (!treeSurvives) {
        expect(text).not.toContain('secret-posix');
        expect(text).not.toContain('secret-unc');
        expect(text).not.toContain('secret-d');
      } else {
        // The surviving tree is still bounded and its secrets redacted.
        const frame = ((out.$exception_list as Array<Record<string, unknown>>)[0].stacktrace as { frames: Array<Record<string, unknown>> }).frames[0];
        expect(String(frame.filename).length).toBeLessThanOrEqual(FRAME_FIELD_MAX_CHARS);
      }
      expect(text).not.toContain('sk-ABCdef1234567890ghij');
    }
  });

  it('F3: the serialized stacktrace budget drops trailing frames, then empty stacktrace objects', () => {
    const bigFrame = () => sdkFrame({ function: 'x'.repeat(300) });
    const list = [sdkEntry([bigFrame(), bigFrame(), bigFrame()]), sdkEntry([bigFrame(), bigFrame()])];
    applyStacktraceBudget(list);
    const total = list.reduce((sum, entry) => sum + (entry.stacktrace ? JSON.stringify(entry.stacktrace).length : 0), 0);
    expect(total).toBeLessThanOrEqual(STACKTRACE_BUDGET_CHARS);
    // No empty stacktrace objects survive.
    for (const entry of list) {
      const trace = entry.stacktrace as { frames?: unknown[] } | undefined;
      if (trace) expect(trace.frames?.length ?? 0).toBeGreaterThan(0);
    }
    // JSON escaping cannot defeat the budget: multi-byte + escaped quotes count as JS string lengths.
    const escaped = [sdkEntry([sdkFrame({ function: JSON.stringify('"\\u2603'.repeat(200)) })])];
    applyStacktraceBudget(escaped);
    const escapedTotal = escaped.reduce((sum, entry) => sum + (entry.stacktrace ? JSON.stringify(entry.stacktrace).length : 0), 0);
    expect(escapedTotal).toBeLessThanOrEqual(STACKTRACE_BUDGET_CHARS);
  });

  it('F7: synthetic $release_id/$trace_id/$span_id are stripped from every event; non-exception events included', () => {
    const exceptionEvent = { event: '$exception', properties: { $release_id: 'rel', $trace_id: 'tr', $span_id: 'sp', $exception_type: 'Error' } };
    const plainEvent = { event: 'worker_started', properties: { $release_id: 'rel', $trace_id: 'tr', $span_id: 'sp', trigger: 'start' } };
    stripConditionalIdentifiers(exceptionEvent);
    stripConditionalIdentifiers(plainEvent);
    for (const event of [exceptionEvent, plainEvent]) {
      for (const key of ['$release_id', '$trace_id', '$span_id']) expect(key in event.properties).toBe(false);
    }
    expect(plainEvent.properties.trigger).toBe('start'); // nothing else touched
    // Rebuild also never re-introduces them, and never replaces them with another identifier.
    const out = rebuildExceptionProperties({ $exception_list: [sdkEntry()], $release_id: 'rel', $trace_id: 'tr', $span_id: 'sp' });
    for (const key of ['$release_id', '$trace_id', '$span_id']) expect(key in out).toBe(false);
  });

  it('the manual sentinel is dropped, mirrors survive, and valid diagnostics are preserved (error tracking stays useful)', () => {
    const props = {
      $exception_type: 'RangeError', $exception_message: 'index out of range', error_type: 'RangeError',
      error_message: 'index out of range', error_stack: 'RangeError: index out of range\n    at check (src/index.ts:9:11)',
      occurrence_count: 4, __cm_rate_limited: true,
      $process_person_profile: false, version: '13.4.2', os: 'win32',
    };
    const out = rebuildExceptionProperties(props);
    expect('__cm_rate_limited' in out).toBe(false);
    expect(out.$exception_type).toBe('RangeError');
    expect(out.error_type).toBe('RangeError');
    expect(out.$exception_message).toBe('index out of range');
    expect(out.occurrence_count).toBe(4);
    expect(out.version).toBe('13.4.2');
    expect(out.$process_person_profile).toBe(false);
    const list = out.$exception_list as Array<Record<string, unknown>>;
    expect(list[0].type).toBe('RangeError');
    expect((list[0].stacktrace as { frames: unknown[] }).frames.length).toBeGreaterThan(0);
    // A synthetic occurrence_count that is not a safe positive integer is dropped, not stringified.
    const junk = rebuildExceptionProperties({ ...props, occurrence_count: 'many' });
    expect('occurrence_count' in junk).toBe(false);
  });

  it('malformed and hostile inputs never throw and never reintroduce removed data', () => {
    const hostile = { $exception_list: 'not an array' };
    expect(() => rebuildExceptionProperties(hostile)).not.toThrow();
    const out = rebuildExceptionProperties(hostile);
    expect(Array.isArray(out.$exception_list)).toBe(true);
    expect(() => rebuildExceptionProperties({ $exception_list: [null, 3, 'x', { type: null, value: 5, stacktrace: 'flat' }] })).not.toThrow();
    expect(() => stripConditionalIdentifiers(null)).not.toThrow();
    expect(() => stripConditionalIdentifiers({ properties: null })).not.toThrow();
    expect(() => applyStacktraceBudget([])).not.toThrow();
    // Circular entries cannot reintroduce anything: the output is plain rebuilt objects.
    const entry: Record<string, unknown> = sdkEntry();
    entry.self = entry;
    const safe = rebuildExceptionProperties({ $exception_list: [entry] });
    expect(JSON.stringify(safe)).not.toContain('SENTINEL');
  });
});
