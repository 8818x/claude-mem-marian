/**
 * Decision 14 final exception boundary (post-SDK-enrichment, pre-serialization).
 *
 * Everything here runs on the event AFTER posthog-node has enriched it (manual captureException and
 * SDK autocapture alike) and BEFORE the SDK serializes it for ingest. Contract:
 *
 *  - F7: `$release_id` / `$trace_id` / `$span_id` are removed from EVERY worker event's properties after
 *    SDK attachment (no replacement identifiers are introduced); frame `chunk_id` is never copied.
 *  - F5: source context (`pre_context` / `context_line` / `post_context`) can never exist on a retained
 *    frame: frames are rebuilt from an explicit allowlist, so the keys are absent by construction.
 *  - F1: exception type/value and every mirror pass the full free-text redaction pipeline; mirrors all
 *    derive from one sanitized value per entry.
 *  - F3/F6: one bounded stack contract on both paths: message ≤500 chars, list ≤10 entries, ≤10 retained
 *    frames per event, filename/function ≤200 chars after full redaction, `module` omitted,
 *    lineno/colno only finite positive safe integers, invalid optional values omitted. The serialized
 *    JSON length of all retained stacktrace objects in one event is capped at 2,048: trailing frames are
 *    removed first, then empty stacktrace objects. JavaScript string lengths, not bytes.
 *  - Structural fields use fixed enums or booleans; unknown mechanism fields and unapproved exception/
 *    frame fields are dropped; internal sentinels never ship.
 */

import { scrubMessage, scrubStack, sanitizeErrorType, redactText, MESSAGE_MAX_CHARS } from './error-scrub.js';

/** Max $exception_list entries per event. */
export const EXCEPTION_LIST_MAX = 10;
/** Max retained frames per EVENT (across all entries, list/frame order). */
export const FRAMES_MAX_PER_EVENT = 10;
/** Max chars for each retained frame's filename/function after the full redaction pipeline. */
export const FRAME_FIELD_MAX_CHARS = 200;
/** Max serialized-JSON chars for all retained stacktrace objects in one event. */
export const STACKTRACE_BUDGET_CHARS = 2048;

/** Exception levels PostHog accepts; anything else is dropped to the fixed 'error'. */
const EXCEPTION_LEVELS = new Set(['error', 'warning', 'info', 'debug', 'log', 'critical', 'exception']);

/** Private manual-path marker handled (and dropped) by the boundary; never ships. */
export const RATE_LIMITED_SENTINEL = '__cm_rate_limited';

/** Conditional SDK identifiers removed from every event (F7). Never replaced with anything. */
const CONDITIONAL_IDENTIFIER_KEYS = ['$release_id', '$trace_id', '$span_id'] as const;

/** Removes $release_id/$trace_id/$span_id from an event's properties. Applies to EVERY event. */
export function stripConditionalIdentifiers(event: { properties?: Record<string, unknown> } | null | undefined): void {
  try {
    const props = event?.properties;
    if (!props || typeof props !== 'object') return;
    for (const key of CONDITIONAL_IDENTIFIER_KEYS) delete props[key];
  } catch {
    /* best-effort strip; the rebuild still runs for exceptions */
  }
}

/** A finite positive safe integer (lineno/colno/ids). */
function isSafePosition(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

/** Bounded, redacted string field (filename/function/mechanism strings). */
function boundedText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  if (value.length === 0) return undefined;
  try {
    const redacted = redactText(value);
    const capped = redacted.slice(0, FRAME_FIELD_MAX_CHARS).trim();
    return capped.length > 0 ? capped : undefined;
  } catch {
    return undefined;
  }
}

/** Rebuilds one SDK frame from the allowlist; source-context keys cannot exist in the output. */
function rebuildFrame(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const frame = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  const filename = boundedText(frame.filename);
  if (filename !== undefined) out.filename = filename;
  const functionName = boundedText(frame.function);
  if (functionName !== undefined) out.function = functionName;
  if (isSafePosition(frame.lineno)) out.lineno = frame.lineno;
  if (isSafePosition(frame.colno)) out.colno = frame.colno;
  if (typeof frame.in_app === 'boolean') out.in_app = frame.in_app;
  return out;
}

/** Fixed-enum exception mechanism: redacted type string, known boolean flags, validated ids. */
function rebuildMechanism(raw: unknown): Record<string, unknown> | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const mechanism = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  const type = boundedText(mechanism.type);
  if (type !== undefined) out.type = type;
  if (typeof mechanism.handled === 'boolean') out.handled = mechanism.handled;
  const data = mechanism.data as Record<string, unknown> | undefined;
  if (data && typeof data === 'object' && isSafePosition(data.parent_id)) out.data = { parent_id: data.parent_id };
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Rebuilds one $exception_list entry from the allowlist. */
function rebuildExceptionEntry(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const entry = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  // F1: the type derives from the sanitized value; all mirrors must agree with it.
  out.type = sanitizeErrorType(entry.type);
  // F1/F3: the free-text value/message is scrubbed and bounded (500 chars).
  out.value = scrubMessage(entry.value ?? entry.message);
  const level = typeof entry.level === 'string' && EXCEPTION_LEVELS.has(entry.level) ? entry.level : 'error';
  out.level = level;
  const mechanism = rebuildMechanism(entry.mechanism);
  if (mechanism) out.mechanism = mechanism;
  const rawTrace = entry.stacktrace;
  if (rawTrace && typeof rawTrace === 'object') {
    const frames = Array.isArray((rawTrace as Record<string, unknown>).frames)
      ? (rawTrace as { frames: unknown[] }).frames.map(rebuildFrame).filter(Boolean) as Array<Record<string, unknown>>
      : [];
    if (frames.length > 0) out.stacktrace = { type: 'raw', frames };
  }
  return out;
}

/** F3: caps retained frames at 10 per EVENT, in list/frame order; drops emptied stacktrace objects. */
export function applyFramesMaxPerEvent(list: Array<Record<string, unknown>>): void {
  let remaining = FRAMES_MAX_PER_EVENT;
  for (const entry of list) {
    const trace = entry.stacktrace as { frames?: unknown[] } | undefined;
    if (!trace || !Array.isArray(trace.frames)) continue;
    if (remaining <= 0) { delete entry.stacktrace; continue; }
    if (trace.frames.length > remaining) trace.frames = trace.frames.slice(0, remaining);
    remaining -= trace.frames.length;
    if (trace.frames.length === 0) delete entry.stacktrace;
  }
}

/**
 * Rebuilds the exception-related properties of a $exception event from the explicit allowlist.
 * Returns a NEW properties object; the input is never mutated. The manual sentinel is dropped.
 */
export function rebuildExceptionProperties(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === RATE_LIMITED_SENTINEL) continue; // internal sentinel never ships
    if ((CONDITIONAL_IDENTIFIER_KEYS as readonly string[]).includes(key)) continue; // F7 defense in depth
    if (key === '$exception_list' || key === '$exception_type' || key === '$exception_message'
      || key === 'error_type' || key === 'error_message' || key === 'error_stack' || key === 'occurrence_count') continue;
    // Fixed SDK metadata ($lib, $lib_version, $geoip_disable, $process_person_profile, …) and the
    // application-whitelisted analytics properties ride along unchanged.
    out[key] = value;
  }
  const rawList = Array.isArray(props.$exception_list) ? props.$exception_list : null;
  const manualType = sanitizeErrorType(props.$exception_type ?? props.error_type);
  const manualMessage = scrubMessage(props.$exception_message ?? props.error_message);
  const manualStack = scrubStack(props.error_stack);
  let list: Array<Record<string, unknown>>;
  if (rawList) {
    // Autocapture (or any SDK-shaped list): rebuild every entry from the allowlist.
    list = rawList.slice(0, EXCEPTION_LIST_MAX).map(rebuildExceptionEntry).filter(Boolean) as Array<Record<string, unknown>>;
  } else {
    // Manual path: the SDK derives its $exception_list from the safeError we hand it; mirror it here so
    // the boundary is identical for both paths and mirrors all agree.
    list = [];
    if (manualType !== 'Error' || manualMessage.length > 0 || manualStack.length > 0) {
      list.push({
        type: manualType,
        value: manualMessage,
        level: 'error',
        ...(manualStack.length > 0 ? { stacktrace: { type: 'synthetic', frames: [{ function: manualStack.slice(0, FRAME_FIELD_MAX_CHARS) }] } } : {}),
      }
      );
    }
 list = list.slice(0, EXCEPTION_LIST_MAX);
  }
  // F1: the top-level mirrors derive from the FIRST sanitized entry so they always agree.
  const first = list[0];
  out.$exception_list = list;
  out.$exception_type = first ? first.type as string : manualType;
  out.$exception_message = first ? first.value as string : manualMessage;
  out.error_type = out.$exception_type;
  out.error_message = out.$exception_message;
  if (manualStack.length > 0) out.error_stack = manualStack;
  const occurrence = props.occurrence_count;
  if (isSafePosition(occurrence)) out.occurrence_count = occurrence;
  else delete out.occurrence_count;
  applyFramesMaxPerEvent(list);
  applyStacktraceBudget(list);
  return out;
}

/**
 * F3/F6 serialized-stacktrace budget: while the sum of JSON.stringify(stacktrace).length over all entries
 * exceeds 2,048, remove trailing frames; once no frames remain, remove empty stacktrace objects.
 */
export function applyStacktraceBudget(list: Array<Record<string, unknown>>): void {
  const total = () => list.reduce((sum, entry) => {
    const trace = entry.stacktrace;
    return sum + (trace ? JSON.stringify(trace).length : 0);
  }, 0);
  // Remove trailing frames (last entry's last frame first) until the budget holds.
  while (total() > STACKTRACE_BUDGET_CHARS) {
    let removed = false;
    for (let index = list.length - 1; index >= 0; index--) {
      const frames = (list[index].stacktrace as { frames?: unknown[] } | undefined)?.frames;
      if (Array.isArray(frames) && frames.length > 0) {
        frames.pop();
        removed = true;
        break;
      }
      if (Array.isArray(frames) && frames.length === 0) {
        delete list[index].stacktrace; // empty stacktrace objects go once frames are exhausted
        removed = true;
        break;
      }
      if (!frames) continue;
    }
    if (!removed) return; // nothing removable (no stacktrace objects at all) — budget not applicable
  }
  // Sweep: no empty stacktrace objects may survive.
  for (const entry of list) {
    const frames = (entry.stacktrace as { frames?: unknown[] } | undefined)?.frames;
    if (Array.isArray(frames) && frames.length === 0) delete entry.stacktrace;
  }
}
