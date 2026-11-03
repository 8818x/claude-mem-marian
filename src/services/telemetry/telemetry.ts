import { PostHog, type EventMessage } from 'posthog-node';
import {
  resolveTelemetryConsent,
  loadTelemetryConfig,
  getOrCreateInstallId,
  isErrorTelemetryEnabled,
} from './consent.js';
import { scrubProperties } from './scrub.js';
import {
  scrubError,
  messageTemplate,
} from './error-scrub.js';
import { getTelemetryApiKey, getTelemetryHost, buildBaseProperties, buildPersonSet } from './common.js';
import { telemetryBuffer } from './buffer.js';
import {
  rebuildExceptionProperties,
  stripConditionalIdentifiers,
  RATE_LIMITED_SENTINEL,
} from './exception-boundary.js';
// logger.warn ONLY in this module — logger.error routes through the error sink
// back into captureException (logger.ts setErrorSink), which would recurse.
import { logger } from '../../utils/logger.js';

let client: PostHog | null = null;
let isShutdown = false;

/**
 * Consent is re-resolved at most once per TTL window so the capture path does
 * not touch the filesystem per event (telemetry.json read). A consent change
 * via the CLI is picked up by a running worker within the TTL.
 */
const CONSENT_CACHE_TTL_MS = 30_000;
let consentCache: { value: boolean; expiresAt: number } | null = null;

function hasConsent(): boolean {
  const now = Date.now();
  if (consentCache && now < consentCache.expiresAt) {
    return consentCache.value;
  }
  const value = resolveTelemetryConsent(process.env, loadTelemetryConfig());
  consentCache = { value, expiresAt: now + CONSENT_CACHE_TTL_MS };
  return value;
}

/** Worker-side collectors share the transport's bounded consent cache. */
export function hasTelemetryConsent(): boolean { return hasConsent(); }

/**
 * Whether THIS process is the long-lived worker. Only the worker enables
 * uncaught-exception autocapture (enableExceptionAutocapture) — short-lived CLI
 * contexts (cli-telemetry.ts uses its own direct-POST transport, not this
 * client) must never turn it on. The worker flips this on at startup via
 * enableExceptionAutocaptureForWorker() BEFORE the first capture constructs the
 * client. Default off so any non-worker importer of this module (tests, CLI)
 * gets a plain client.
 */
let autocaptureEnabled = false;

/**
 * Called once by the worker at startup to opt into uncaught-exception
 * autocapture. Must run before getClient() first constructs the client (the
 * SDK option is read at construction time). Idempotent / never throws.
 */
export function enableExceptionAutocaptureForWorker(): void {
  autocaptureEnabled = true;
}

function getClient(): PostHog {
  if (!client) {
    // Autocapture is gated by BOTH consent (caller already passed hasConsent())
    // AND the error kill-switch. Even when enabled, every autocaptured
    // $exception is funneled through before_send → applyErrorRateLimit, so the
    // SDK's autocapture can never storm ingest: a fingerprint already sent in
    // the current window returns null (dropped before ingest = not billed).
    const enableAutocapture =
      autocaptureEnabled &&
      isErrorTelemetryEnabled(process.env) &&
      hasConsent();

    client = new PostHog(getTelemetryApiKey(), {
      host: getTelemetryHost(),
      flushAt: 20,
      flushInterval: 10000,
      // posthog-node assumes server deployments and stamps $geoip_disable: true
      // on every event by default, which suppresses ingest-side geolocation.
      // claude-mem's worker runs on the user's own machine, so the ingestion
      // request already originates from their IP — letting PostHog derive
      // coarse location (country/region/city) at ingest. The raw IP is still
      // never attached to events and is discarded on ingest (project setting);
      // see docs/public/telemetry.mdx. This matches the CLI transport
      // (cli-telemetry.ts), whose direct POST never suppressed geolocation.
      disableGeoip: false,
      // posthog-node 5.x: enableExceptionAutocapture installs process
      // uncaughtException/unhandledRejection hooks that emit $exception.
      // (node_modules/posthog-node/dist/types.d.ts:121).
      enableExceptionAutocapture: enableAutocapture,
      // before_send runs for EVERY event just before ingest. Returning null
      // drops the event (types.d.ts:150-155). We use it ONLY to rate-limit
      // $exception events — both the ones our captureException() queues and any
      // the SDK's autocapture produces out-of-band — so the rate-limiter is
      // unconditionally in front of autocapture. Non-exception events pass
      // through untouched. (BeforeSendFn = (event|null) => event|null,
      // types.d.ts:116).
      before_send: errorBeforeSend,
    });
  }
  return client;
}

// ---------------------------------------------------------------------------
// Exception capture: redacted $exception with a MANDATORY in-memory
// rate-limiter / deduper. posthog-node has NO built-in exception rate limit, so
// without this an error loop would bill one ingested event per occurrence.
// ---------------------------------------------------------------------------

/** Send at most one $exception per fingerprint per this window. */
const ERROR_RATELIMIT_WINDOW_MS = 60_000;
/**
 * Hard cap on the dedupe map size so a pathological stream of UNIQUE
 * fingerprints can't grow it without bound. When exceeded, the least-recently
 * ACTIVE entry (by max(lastSentTs, firstTs)) is evicted (LRU) so a hot,
 * still-firing error isn't evicted ahead of a genuinely stale one. Bounds
 * worst-case memory to O(MAX) small records.
 */
const ERROR_FINGERPRINT_MAX = 500;

type ErrorRateState = {
  /** Total occurrences seen this window (including dropped ones). */
  count: number;
  /** First time this fingerprint was seen (used for eviction ordering). */
  firstTs: number;
  /** Last time we actually SENT this fingerprint (0 = never sent yet). */
  lastSentTs: number;
};

const errorRateMap = new Map<string, ErrorRateState>();

/**
 * Stable fingerprint for an error: type + normalized message TEMPLATE + top
 * stack frame. messageTemplate() collapses varying numbers/ids/quoted values so
 * "User 12 not found" and "User 9999 not found" share one fingerprint. Pure /
 * never throws.
 */
function fingerprintError(type: string, message: string, stack: string): string {
  let topFrame = '';
  try {
    const lines = (stack || '').split('\n').map(l => l.trim()).filter(Boolean);
    // First line is usually the "Type: message" header; the first real frame
    // begins with "at ". Prefer that; fall back to the second line.
    topFrame = lines.find(l => l.startsWith('at ')) ?? lines[1] ?? '';
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.warn('SYSTEM', 'Telemetry: stack parse failed while fingerprinting; using empty top frame', undefined, err);
    topFrame = '';
  }
  return `${type}::${messageTemplate(message)}::${topFrame}`.slice(0, 400);
}

/**
 * Rate-limit / dedupe decision for a fingerprint. Returns whether to SEND and
 * the occurrence count to attach. Bounds the map size by evicting the oldest
 * entries. Pure side effect on errorRateMap; never throws.
 */
function applyErrorRateLimit(
  fingerprint: string,
  now: number
): { send: boolean; count: number } {
  try {
    return applyErrorRateLimitInner(fingerprint, now);
  } catch (error) {
    // On any failure, fail CLOSED (do not send) — never risk a storm.
    const err = error instanceof Error ? error : new Error(String(error));
    logger.warn('SYSTEM', 'Telemetry: error rate-limit bookkeeping failed; failing closed (event dropped)', undefined, err);
    return { send: false, count: 0 };
  }
}

/**
 * Rate-limit bookkeeping proper (map lookup, LRU eviction, window reset).
 * Only ever called from applyErrorRateLimit's try, which fails closed.
 */
function applyErrorRateLimitInner(
  fingerprint: string,
  now: number
): { send: boolean; count: number } {
  let state = errorRateMap.get(fingerprint);
  if (!state) {
    // Bound the map BEFORE inserting a new key. Evict the least-recently
    // ACTIVE entry (LRU): order by the most recent of lastSentTs / firstTs so
    // a hot, still-firing fingerprint outlives a genuinely stale one.
    if (errorRateMap.size >= ERROR_FINGERPRINT_MAX) {
      let oldestKey: string | null = null;
      let oldestTs = Infinity;
      for (const [k, v] of errorRateMap) {
        const activity = Math.max(v.lastSentTs, v.firstTs);
        if (activity < oldestTs) {
          oldestTs = activity;
          oldestKey = k;
        }
      }
      if (oldestKey !== null) errorRateMap.delete(oldestKey);
    }
    state = { count: 1, firstTs: now, lastSentTs: now };
    errorRateMap.set(fingerprint, state);
    return { send: true, count: 1 };
  }
  state.count += 1;
  if (now - state.lastSentTs >= ERROR_RATELIMIT_WINDOW_MS) {
    state.lastSentTs = now;
    const count = state.count;
    // Reset the occurrence counter for the next window so each sent event
    // carries the count accumulated since the last send.
    state.count = 0;
    return { send: true, count };
  }
  return { send: false, count: state.count };
}

/**
 * Decision 14: the manual path's rate-limit sentinel is imported from the final
 * boundary (exception-boundary.ts). It may bypass DUPLICATE RATE ACCOUNTING only:
 * the manual $exception still passes the same rebuild (sanitization/bounds) and
 * consent re-check as SDK autocapture before it can ship.
 */

/**
 * True when a $exception describes an OS working-directory permission fault
 * (`EPERM`/`EACCES` raised by a `chdir`). Reads the message/type strings both
 * capture paths stamp onto properties (and the SDK's $exception_list). Narrow
 * by design — it requires the `chdir` syscall AND a permission signal — so
 * genuine claude-mem failures never match. Never throws.
 */
function isEnvironmentChdirError(props: Record<string, unknown>): boolean {
  try {
    const parts: string[] = [];
    const push = (value: unknown): void => {
      if (typeof value === 'string') parts.push(value);
    };
    push(props.$exception_message);
    push(props.$exception_type);
    push(props.error_message);
    push(props.error_type);
    const list = props.$exception_list;
    if (Array.isArray(list)) {
      for (const entry of list) {
        if (entry && typeof entry === 'object') {
          push((entry as Record<string, unknown>).value);
          push((entry as Record<string, unknown>).type);
        }
      }
    }
    const haystack = parts.join(' ');
    if (!/chdir/i.test(haystack)) return false;
    return /\b(?:EPERM|EACCES)\b|operation not permitted|permission denied/i.test(haystack);
  } catch {
    return false;
  }
}

/**
 * Test-only: the properties a $exception event carried BEFORE the final rebuild
 * (post SDK enrichment). The real-SDK loopback test reads it to PROVE the SDK
 * actually attached source context / conditional identifiers (trigger
 * activation), so removal is not proven against an absent trigger. Never used
 * by production logic; overwritten on every $exception.
 */
let preBoundaryExceptionProps: Record<string, unknown> | null = null;
/** Test-only accessor for the pre-boundary capture (see above). */
export function __preBoundaryExceptionForTests(): Record<string, unknown> | null {
  return preBoundaryExceptionProps;
}

/**
 * Decision 14 final exception boundary, installed as the client's before_send.
 * posthog-node runs it for BOTH our manual captureException() events AND the
 * SDK's uncaught-exception autocapture, after enrichment and before
 * serialization. The same contract applies to both paths:
 *
 *  - F7: conditional SDK identifiers ($release_id/$trace_id/$span_id) are
 *    stripped from EVERY event (including non-exception events) after SDK
 *    attachment; frame chunk_id is never copied (rebuilt away).
 *  - F2: consent AND the error kill-switch are re-checked here for every
 *    $exception. Denial drops the event before ingest — this is the SDK-
 *    internal autocapture path's acceptance gate (the SDK's own queue cannot
 *    be intercepted earlier), while our manual captureExceptionInner already
 *    refuses new events before queue acceptance.
 *  - F5/F1/F3/F6/F7: the exception list/frames are REBUILT from an explicit
 *    allowlist (rebuildExceptionProperties), so source context can never exist
 *    on the output, every type/message mirror is sanitized/bounded, and the
 *    manual rate-limit sentinel bypasses DUPLICATE RATE ACCOUNTING only — it
 *    never bypasses consent, sanitization, or bounds.
 *
 * NEVER throws. On ANY error we return null (DROP) rather than risk shipping an
 * unredacted event — failing closed is the safe one-way-door default here.
 */
function errorBeforeSend(event: EventMessage | null): EventMessage | null {
  try {
    if (!event || typeof event !== 'object') return event;
    const ev = event;
    // F7: conditional identifiers go from every event, exceptions included.
    stripConditionalIdentifiers(ev);
    if (ev.event !== '$exception') return event;

    const props = (ev.properties ?? {}) as Record<string, unknown>;
    // Test hook: keep the pre-boundary fixture for the real-SDK removal proof.
    preBoundaryExceptionProps = props;

    // Drop OS working-directory permission faults (EPERM/EACCES on chdir).
    // These are environment errors — e.g. a Windows worker whose inherited cwd
    // is an ACL-locked Microsoft Store directory, which makes cross-spawn's
    // post-spawn cwd restore throw — not claude-mem defects, so they only add
    // noise to error tracking. Runs ahead of everything else, both paths.
    if (isEnvironmentChdirError(props)) return null;

    // F2: consent + kill-switch re-checked at the final boundary for BOTH paths.
    if (!hasConsent() || !isErrorTelemetryEnabled(process.env)) return null;

    const manual = props[RATE_LIMITED_SENTINEL] === true;
    // F5/F1/F3/F6/F7: rebuild from the allowlist — identical treatment for both
    // paths; the sentinel (dropped inside the rebuild) skips only the limiter.
    const rebuilt = rebuildExceptionProperties(props);
    props.$process_person_profile = false;
    rebuilt.$process_person_profile = false;

    if (manual) {
      // Manual path: already counted by captureExceptionInner. occurrence_count
      // survives the rebuild; no second rate-accounting pass.
      ev.properties = rebuilt;
      return event;
    }

    // Autocapture: fingerprint from the REBUILT (sanitized) data, then decide.
    let type = 'Error';
    let message = '';
    let stack = '';
    try {
      const list = rebuilt.$exception_list;
      if (Array.isArray(list) && list[0] && typeof list[0] === 'object') {
        const first = list[0] as Record<string, unknown>;
        if (typeof first.type === 'string') type = first.type;
        if (typeof first.value === 'string') message = first.value;
        const trace = (first.stacktrace as { frames?: unknown[] } | undefined)?.frames;
        if (Array.isArray(trace) && trace.length > 0) {
          stack = 'at ' + JSON.stringify(trace[trace.length - 1]).slice(0, 200);
        }
      }
    } catch {
      /* fall through to prop-based fingerprint */
    }
    if (typeof rebuilt.$exception_type === 'string') type = rebuilt.$exception_type;
    if (typeof rebuilt.$exception_message === 'string') message = rebuilt.$exception_message;

    // fingerprintError already applies messageTemplate internally — pass the
    // sanitized message, do not pre-template it (S1).
    const fingerprint = fingerprintError(type, message, stack);
    const decision = applyErrorRateLimit(fingerprint, Date.now());
    if (!decision.send) return null; // dropped before ingest — not billed
    rebuilt.occurrence_count = decision.count;
    ev.properties = rebuilt;
    return event;
  } catch {
    // Fail CLOSED: dropping is strictly safer than risking an unredacted leak.
    return null;
  }
}

/**
 * Capture a REAL exception to PostHog Error Tracking ($exception) with the
 * error message + trimmed stack REDACTED by error-scrub.ts. Fire-and-forget,
 * synchronous, never throws, never blocks. Ordering mirrors captureEvent:
 *
 *   1. Consent gate (same hasConsent() as analytics) AND the error kill-switch
 *      (CLAUDE_MEM_TELEMETRY_ERRORS) — either off ⇒ nothing happens.
 *   2. Shutdown latch — late errors are dropped, not queued into a dead client.
 *   3. Redact the error (error-scrub: allow-then-redact, NOT the property
 *      whitelist — that would drop free-form text).
 *   4. Rate-limit / dedupe by fingerprint — at most one send per fingerprint
 *      per window; occurrence count attached. Mandatory: no unbounded stream.
 *   5. Optional structured context goes through scrubProperties (the same
 *      deny-by-default whitelist as everything else). Error text/stack are the
 *      ONLY values that take the error-scrub path.
 *   6. Debug mode prints to stderr and sends nothing.
 *   7. client.captureException(error, distinctId, additionalProperties):
 *      $process_person_profile:false (no person profile for $exception) plus the
 *      redacted fields + whitelisted context.
 *
 * SDK signature (verified node_modules/posthog-node/dist/client.d.ts:1031):
 *   captureException(error: unknown, distinctId?: string,
 *     additionalProperties?: Record<string|number, any>, ...): void
 * distinctId is the 2nd positional arg; directives like
 * $process_person_profile go in additionalProperties (3rd arg).
 */
export function captureException(
  err: unknown,
  ctx?: Record<string, unknown>
): void {
  try {
    captureExceptionInner(err, ctx);
  } catch (error) {
    // Exception capture must NEVER propagate to its caller (esp. the logger).
    // logger.warn is safe here: only logger.error re-enters this module via
    // the error sink.
    const failure = error instanceof Error ? error : new Error(String(error));
    logger.warn('SYSTEM', 'Telemetry: captureException failed; $exception dropped', undefined, failure);
  }
}

/**
 * Scrub → rate-limit → send pipeline for captureException. Only ever called
 * from captureException's try, which swallows anything this raises.
 */
function captureExceptionInner(
  err: unknown,
  ctx?: Record<string, unknown>
): void {
  if (isShutdown || !hasConsent() || !isErrorTelemetryEnabled(process.env)) {
    return;
  }

  const scrubbed = scrubError(err);
  const fingerprint = fingerprintError(scrubbed.type, scrubbed.message, scrubbed.stack);
  const decision = applyErrorRateLimit(fingerprint, Date.now());
  if (!decision.send) {
    return;
  }

  // Structured context (NOT the message/stack) goes through the whitelist.
  const whitelistedContext = scrubProperties({
    ...buildBaseProperties(),
    ...(ctx ?? {}),
  });

  const additionalProperties: Record<string, unknown> = {
    ...whitelistedContext,
    // No person profile for exceptions (anti-pattern guard) — same directive
    // as high-volume operational events in captureEvent.
    $process_person_profile: false,
    // Redacted free-form error fields. These are NOT user-identifying and
    // bypass the property whitelist by design (error-scrub already redacted
    // home dir, paths, URLs, emails, keys, tokens).
    $exception_message: scrubbed.message,
    $exception_type: scrubbed.type,
    error_message: scrubbed.message,
    error_type: scrubbed.type,
    error_stack: scrubbed.stack,
    occurrence_count: decision.count,
    // Private sentinel: tells errorBeforeSend this $exception is ALREADY
    // redacted + rate-limited here, so before_send must NOT re-run the limiter
    // (which would double-count occurrence_count and split the keyspace).
    // before_send deletes it so it never ships to PostHog. (B1 fix.)
    [RATE_LIMITED_SENTINEL]: true,
  };

  if (process.env.CLAUDE_MEM_TELEMETRY_DEBUG === '1') {
    // Decision 14: the final boundary covers debug output too — the printed
    // payload passes the same rebuild, so debug can never show source context,
    // conditional identifiers, or the internal sentinel.
    process.stderr.write(
      '[telemetry] ' + JSON.stringify({ event: '$exception', additionalProperties: rebuildExceptionProperties(additionalProperties) }) + '\n'
    );
    return;
  }

  // Pass a redacted Error (not the raw one) so the SDK never re-derives an
  // un-redacted stack/message: the SDK reads .message/.stack/.name off the
  // object we hand it.
  const safeError = new Error(scrubbed.message);
  safeError.name = scrubbed.type;
  safeError.stack = scrubbed.stack || `${scrubbed.type}: ${scrubbed.message}`;

  getClient().captureException(safeError, getOrCreateInstallId(), additionalProperties);
}

/**
 * Capture a telemetry event. Fire-and-forget, synchronous, never throws,
 * never blocks. Ordering is deliberate:
 *
 *   1. Consent gate (DO_NOT_TRACK > env > telemetry.json > default ON) —
 *      without consent NOTHING happens, including debug printing.
 *   2. Whitelist scrub — only allowed primitive properties survive.
 *   3. Debug mode (CLAUDE_MEM_TELEMETRY_DEBUG=1) — print payload to stderr,
 *      send nothing.
 *   4. posthog.capture() — SDK queues in memory and batches in background.
 *
 * Two event classes (opts.person):
 *   - Lifecycle events (worker_started, install_*) pass person: true. They are
 *     low-volume and build an anonymous person profile keyed to the random
 *     install UUID, which is what makes PostHog's retention / stickiness /
 *     lifecycle / cohort insights work. Person properties are restricted to
 *     PERSON_PROPERTY_KEYS — the same whitelisted enums as event properties.
 *   - Everything else (high-volume operational events) stays profile-less.
 */
export function captureEvent(
  event: string,
  props?: Record<string, unknown>,
  opts?: { person?: boolean }
): void {
  try {
    captureEventInner(event, props, opts);
  } catch (error) {
    // Telemetry must never break the worker. Log and swallow everything.
    const err = error instanceof Error ? error : new Error(String(error));
    logger.warn('SYSTEM', 'Telemetry: captureEvent failed; event dropped', { event }, err);
  }
}

/**
 * Scrub → directive-stamp → send pipeline for captureEvent. Only ever called
 * from captureEvent's try, which swallows anything this raises.
 */
function captureEventInner(
  event: string,
  props?: Record<string, unknown>,
  opts?: { person?: boolean }
): void {
  // Once shutdown has flushed the client, late events (e.g. a request that
  // raced graceful stop) are dropped rather than queued in a new client
  // that would never be flushed.
  if (isShutdown || !hasConsent()) {
    return;
  }

  const properties: Record<string, unknown> = scrubProperties({
    ...buildBaseProperties(),
    ...(props ?? {}),
  });
  // $-prefixed PostHog directives are not user data and bypass the whitelist;
  // they are added AFTER scrubbing.
  if (opts?.person) {
    properties.$set = buildPersonSet(properties);
  } else {
    properties.$process_person_profile = false;
  }

  if (process.env.CLAUDE_MEM_TELEMETRY_DEBUG === '1') {
    // Direct stderr write (not console.*): debug mode is a human running the
    // worker in the foreground; repo logger standards forbid console.* in
    // background services (tests/logger-usage-standards.test.ts).
    process.stderr.write('[telemetry] ' + JSON.stringify({ event, properties }) + '\n');
    return;
  }

  getClient().capture({
    distinctId: getOrCreateInstallId(),
    event,
    properties,
  });
}

/**
 * Test-only. The module state (singleton client, 30s consent TTL cache,
 * shutdown latch) is process-wide, and the whole bun test suite shares one
 * process — without a reset, a test asserting client construction inherits
 * whatever earlier test files did. Never called by production code.
 */
export function __resetTelemetryForTests(): void {
  client = null;
  consentCache = null;
  isShutdown = false;
  autocaptureEnabled = false;
  errorRateMap.clear();
}

/**
 * Test-only accessor for the before_send rate-limit hook, so tests can simulate
 * the SDK's autocapture path (which calls before_send out-of-band) without a
 * real client. Never used by production code.
 */
export function __errorBeforeSendForTests(event: EventMessage | null): EventMessage | null {
  return errorBeforeSend(event);
}

/**
 * Flush + tear down a captured client, racing a 3s timeout so a
 * slow/unreachable ingestion host can never hang worker stop. The timer is
 * always cleared, even when the SDK shutdown wins the race.
 */
async function flushClientWithTimeout(current: PostHog): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      current.shutdown(),
      new Promise<void>(resolve => {
        timer = setTimeout(resolve, 3000);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Flush queued events on graceful shutdown. Races the SDK shutdown against a
 * 3s timeout so a slow/unreachable ingestion host can never hang worker stop.
 * Never rejects.
 */
export async function shutdownTelemetry(): Promise<void> {
  try {
    telemetryBuffer.stop();
    // Drain ALL active per-session accumulators FIRST, while telemetry is
    // still fully LIVE (isShutdown is NOT yet set and `client` is NOT yet
    // nulled) — captureEvent's `if (isShutdown || !hasConsent()) return`
    // gate must still pass so every in-flight session emits its single
    // observer_turn_rollup (rollup_reason: 'worker_shutdown') into the live
    // client's queue (constructing the client lazily via getClient() if no
    // event was ever emitted before shutdown). This is the single safe drain
    // point: the SessionManager teardown path (deleteSession → flushSession)
    // runs in performGracefulShutdown, AFTER beforeGracefulShutdown has
    // already called shutdownTelemetry — too late.
    telemetryBuffer.drainAllSessions('worker_shutdown');
    // Then drain the time-window context_injected bucket — still live.
    telemetryBuffer.flush();
    // Capture whatever client the drains queued into (or that earlier events
    // constructed), THEN latch shutdown and detach the singleton. Reading
    // `client` here — after the drains — is what guarantees we tear down the
    // exact instance the rollups landed in, rather than an empty pre-drain
    // snapshot. Any event that races past this point is dropped (isShutdown)
    // rather than queued into a fresh client that would never be flushed.
    const current = client;
    isShutdown = true;
    client = null;
    if (!current) return;
    await flushClientWithTimeout(current);
  } catch (error) {
    // Never let telemetry flushing fail a shutdown. Ensure the latch is set
    // even if a drain failed before we reached it above.
    const err = error instanceof Error ? error : new Error(String(error));
    logger.warn('SHUTDOWN', 'Telemetry shutdown flush failed; latching shutdown anyway', undefined, err);
    isShutdown = true;
    client = null;
  }
}
