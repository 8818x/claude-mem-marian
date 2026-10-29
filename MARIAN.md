# Marian patch history

This file records changes maintained by the **claude-mem-marian** fork. Fork patches use their own names and tags; upstream version numbers describe the source baseline, not a Marian patch release.

## Unreleased

- Maintain only Claude Code and Codex installation choices and distribution targets; retire other standalone client packages, their builders and dedicated setup assets/tests.
- Retain original third-party license, NOTICE and provenance files in `docs/upstream-notices`, with upstream authorship preserved.
- Document OpenRouter through the OpenAI-compatible route and its separate `CLAUDE_MEM_OPENAI_COMPAT_OBSERVATION_BATCH_SIZE` setting. LLM providers and shared memory/history handling are retained.
- Add shared Claude/Codex instructions in `CLAUDE.md`, referenced by `AGENTS.md`, including the owner's Apache-2.0 compliance requirements.
- Remove the fork's `SECURITY.md` at the owner's request.
- Merge upstream `main` at `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b` (v15.5.0), preserving the Marian batching, session identity, rejected-rule Undo and structured-refresh fixes.
- Combine upstream's new focus/routing behavior with Marian's historical-session identities and structured story schema.
- Rename the fork changelog to `MARIAN.md` and update the README links.
- Add the edited claude-mem banner with the exact subtitle `Maria(n)-edition` to the README header.
- Verification after client retirement: **961 tests passed across 67 files**, **121 UI tests passed**, root/viewer typechecks, both lint checks and the full build passed. A real npm packaging dry run contains no retired client files; Claude/Codex assets and retained notices are included. Seven original license/NOTICE/provenance files are preserved byte-for-byte, and root LICENSE/NOTICE are unchanged.

## Maria-1 — 2026-10-29

First Marian patch set, based on upstream [claude-mem v15.3.0](https://github.com/thedotmack/claude-mem/tree/v15.3.0), commit `ae65368ae13b02effd68a77228c0f2e3497e05fe`.

### Added

- OpenRouter observation batching through the existing session buffer and batching metadata helpers.
- `CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE`: default **8**, valid integer range **1–32**, with normal settings-file and environment loading. Size **1** retains the previous one-observation-per-request behavior.
- Stable queue IDs for independently parsed batch results. Shared context appears once per request; input ordering and per-item session/tool provenance are preserved.

### Fixed

- Observation reads now use the actual database schema, so recorded Codex and Claude work is available to My Work.
- Historical requests load identities from their associated sessions without increasing the observation limit or inferring an agent from the request title.
- Persisted rejected suggestions stay in the rules decision queue, where Undo uses the existing restore action.
- Claude refresh requests honor the answer schema and consume structured output rather than parsing free-form story prose.
- Official Windows npm Claude shims resolve to their adjacent native executable so JSON schema arguments reach Claude correctly.
- Scheduled and manual refresh checks retry a failed final stage even when earlier stages have already cleared the ordinary due-work counters.
- Codex reports an explicit Windows sandbox compatibility error when the restricted refresh read profile cannot be enforced.

### Memory and retry behavior

- A batch of 14 ordinary pending observations at size 8 uses two generation requests, **8 + 6**.
- Every observation remains independent. Summaries and session boundaries are not mixed into observation batches; existing context budgets and compression can require smaller batches.
- Persistence precedes queue acknowledgement. Malformed batch output preserves work for retry; retries resume with unresolved items rather than duplicating persisted memories.
- Existing memory formats, databases and settings remain compatible. Other providers retain their observation behavior.

### Verification

Verified together on Windows with Bun 1.4.3:

- **667 passed, 0 failed** across **47 files**, including request counts, ordering, attribution, malformed output, request/storage failures, duplicate prevention, settings, other providers, session identity and refresh.
- **92 My Work UI state tests passed**.
- `npm run typecheck` passed for root and viewer.
- `npm run lint:hook-io`, `npm run lint:spawn-env`, `npm run build` and `git diff --check` passed.
- The refresh and identity/rules fixes were also verified in the local running worker. A real story completed the existing validation and persistence path with `state=ok`, `result="story updated."` and no error.

### Verification limits

- OpenRouter batching was tested with mocked generation requests and real SQLite persistence, rather than a paid OpenRouter request.
- Codex refresh remains blocked when the available Windows sandbox cannot enforce the job's restricted read profile. No broader filesystem access or sandbox bypass was introduced; Claude completed the live refresh.
- This fork publishes source changes and tests, rather than a prebuilt release. Generated distribution files come from the repository's build workflow.

Upstream attribution, Apache-2.0 licensing and notices are retained.
