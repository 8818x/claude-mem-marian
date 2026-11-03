# Hosted setup authorization (Decision 15)

Hosted setup extraction (the setup scan's upload to claude-mem's hosted service) runs only after an explicit,
informed authorization action taken in the setup UI under the Decision 15 disclosure. Absent, false, malformed,
or legacy requests never authorize an upload. This page is the behavior/disclosure reference for the Decision 15
remediation (Task 44, Decision 15).

## What the choice covers

The authorization covers exactly one setup attempt: the scan attempt the action was taken on (or, when no scan
is running, the next attempt the action itself starts). It covers only the disclosed destination (claude-mem's
hosted service at cmem.ai), the disclosed content (last-30-day typed prompt text, including eligible locally
stored prompts), the disclosed metadata (session identifiers, timestamps, project folder, timezone offset), and
the disclosed credential context (CMEM account when signed in, this installation's hosted setup credentials
otherwise). It is never persisted, never installation-wide, and never inferred from page opening, scan start,
sign-in, Pro status, existing credentials, telemetry consent, sync settings, or the product-improvement
preference.

A concurrent scan start cannot grant authorization to the attempt already running. A grant is consumed at the
extract handoff and never replayed; a past attempt cannot inherit it. An identity or destination change
requires a new explicit action under current disclosure.

## Where the gate is enforced

- Route: `POST /api/setup/scan` accepts authorization only as `hostedUpload: { authorized: true }`; the strict
  schema rejects malformed values (400). `POST /api/setup/scan/hosted-authorization { authorized: true }` is the
  explicit action endpoint (mid-attempt grant, or starts the next attempt authorized).
- Scan/extractor handoff: `SetupScan` consumes the attempt grant at the extract decision point; without it the
  scan finishes local-only (hostedSkipped=true when eligible prompts existed) — no upload, no credential
  issuance, no fabricated hosted rows.
- Final boundary: `HostedIntent.run` rechecks `isHostedUploadAuthorized` after the preserved bypasses (empty
  scan, completed result, pending-save replay), before credential reads or minting and before prompt
  transmission. Missing/false/malformed authorization throws before anything leaves the machine; no transport
  retry exists.
- Local automatic scanning (read/import/usage summary) is unchanged and requires no authorization.

## Credential paths

Signed-in installs upload with their existing account headers (Authorization/X-User-Id) plus the optional
install binding; signed-out installs use this installation's intent-install credentials, which are NOT minted or
refreshed before authorization. Cached credentials confer no authorization. Denial does not fall back to another
identity or provider. A completed-result reuse and a pending-save replay remain local operations that need no
authorization.
