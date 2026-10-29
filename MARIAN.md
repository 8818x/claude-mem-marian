# Marian

Marian is the reliability patch set in the `claude-mem-reliable` fork of
[claude-mem](https://github.com/thedotmack/claude-mem), based on upstream
`v15.3.0` (`ae65368ae13b02effd68a77228c0f2e3497e05fe`). Upstream attribution,
Apache-2.0 licensing and notices are retained.

## Changes

- **OpenRouter observation batching:** claim pending observations through the
  existing session buffer and Codex batching metadata helpers. Send one
  generation request for a batch, share context once, and map each structured
  result to its original queue item. Preserve independent memories and retry
  unresolved work without duplicating persisted observations.
- **Recorded agent attribution:** read observations using the actual database
  schema and load identities from the sessions associated with each request.
  Historical requests retain their recorded agent without increasing the
  observation limit or inferring identity from task titles.
- **Rejected rules:** keep persisted rejected suggestions available in the
  decision queue so Undo can use the existing restore action.
- **Reliable refresh:** request structured story output from Claude, use the
  official native executable behind Windows npm shims, and retry a failed
  final stage even after earlier stages have cleared the ordinary due counters.

## OpenRouter configuration

| Setting | Default | Valid range |
| --- | --- | --- |
| `CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE` | `8` | Integers `1–32` |

The setting supports the normal settings-file and environment loading paths.
At size `8`, 14 ordinary pending observations use two generation requests:
`8 + 6`. Size `1` retains one-observation-per-request behavior. Context budgets,
compression, summaries and session boundaries can require smaller batches.

Malformed batch output preserves queue items for retry. Persistence precedes
acknowledgement, and retry resumes with the unresolved items. Other providers
retain their existing observation behavior.

## Verification

Verified together on Windows with Bun 1.4.3:

- 667 relevant tests passed across 47 files, including batching request counts,
  ordering and attribution, malformed output, transport/storage failures,
  duplicate prevention, settings, other providers, session identity and refresh.
- 92 My Work UI state tests passed.
- `npm run typecheck`, `npm run lint:hook-io`, `npm run lint:spawn-env`,
  `npm run build` and `git diff --check` passed.
- The refresh and identity/rules fixes were also verified in the local running
  worker. A real story completed through the existing validator and persistence
  path; no refresh status was manually changed to success.

## Boundaries

This branch publishes source changes and tests, rather than a prebuilt release.
Generated distribution files are built by the upstream build workflow.

The Codex refresh read profile remains restricted. When a Windows sandbox cannot
enforce it, execution stays blocked with an explicit diagnostic; this patch does
not broaden filesystem permissions or introduce a sandbox bypass. Claude was
the successful backend for the live refresh verification. OpenRouter batching
was verified with mocked generation requests and real SQLite persistence, not
a paid OpenRouter request.
