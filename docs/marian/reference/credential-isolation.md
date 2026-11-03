# Credential isolation reference

Scope: what claude-mem forwards into child processes, what it redacts from local
logs, and how corrupt-settings quarantine copies are retained. This page is the
Decision 16 policy and platform disclosure. It makes no security claim beyond
what the evidence below states.

## Child process environments

Child environments are built from explicit name allowlists. The parent
environment is never copied wholesale; an arbitrary parent secret (a GitHub
token, a database URL, an unrelated provider key) does not reach any child.

Common runtime set (all children): `APPDATA`, `HOME`, `HOMEDRIVE`, `HOMEPATH`,
`LANG`, `LOCALAPPDATA`, `NODE_EXTRA_CA_CERTS`, `PATH`, `PATHEXT`, `SHELL`,
`SSL_CERT_DIR`, `SSL_CERT_FILE`, `SystemRoot`, `TEMP`, `TMP`, `TMPDIR`, `USER`,
`USERPROFILE`, `USERNAME`, `WINDIR`, `XDG_CACHE_HOME`, `XDG_CONFIG_HOME`,
`XDG_DATA_HOME`, plus `LC_*` locale entries. On Windows, names are matched
case-insensitively and written in the allowlist's canonical spelling (no
conflicting case aliases).

Claude and agent-runner children additionally retain the exact existing proxy
names (`HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY`, `NO_PROXY`, lowercase forms,
`npm_config_proxy`, `npm_config_https_proxy`, `npm_config_noproxy`). Proxy
credentials are intentional transport credentials; they are redacted in
diagnostics by the log scrubber. This is environment minimization, not a
filesystem or network sandbox.

Per child:

| Child | Credentials/environment it receives | Denied |
|---|---|---|
| Claude SDK child | Anthropic family from `~/.claude-mem/.env` (`ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`) through the existing resolver; fresh Claude Code OAuth resolved at each spawn; named Claude runtime controls (`CLAUDE_CODE_GIT_BASH_PATH`, `CLAUDE_CODE_TMPDIR`, `CLAUDE_CODE_PATH`, `CLAUDE_CODE_USE_BEDROCK`/`USE_VERTEX`/`USE_FOUNDRY`, `CLAUDE_CODE_SKIP_*_AUTH`); intentional Bedrock/Vertex fields and cloud profile/ADC selectors (`ANTHROPIC_BEDROCK_BASE_URL`, `AWS_REGION`, `AWS_PROFILE`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_DEFAULT_REGION`, `AWS_CONFIG_FILE`, `AWS_SHARED_CREDENTIALS_FILE`, `ANTHROPIC_VERTEX_PROJECT_ID`, `CLOUD_ML_REGION`, `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_CLOUD_PROJECT`, `GCLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`) | Gemini, OpenRouter, OpenAI-compatible keys and rotation pools; raw fallback-key name; stale parent Anthropic/OAuth values; unrelated parent secrets |
| Agent-runner Claude | Same Claude authentication rules with fresh resolution on every step | Other providers' credentials/pools; unrelated parent secrets |
| Agent-runner Codex-exec | Runtime + proxy names and resolved `CODEX_HOME` (file-backed login) | Claude OAuth and Anthropic credentials; Gemini/OpenRouter/OpenAI-compatible pools; AWS/GCP secrets; no new environment API-key route |
| Agent-runner Gemini | Runtime + proxy names; its selected `GEMINI_API_KEY` when configured; `GEMINI_CLI_SYSTEM_SETTINGS_PATH`; Gemini's Vertex/ADC exception (`GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_CLOUD_PROJECT`, `GCLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `CLOUD_ML_REGION`, `GOOGLE_GENAI_USE_VERTEXAI`); existing login/config under the user's selected home | Claude OAuth/Anthropic credentials; OpenRouter/OpenAI-compatible keys; AWS secrets; rotation pools |
| Codex app-server | The pre-existing 24-name runtime allowlist plus `LC_*` and the scoped `CODEX_HOME` override (unchanged by this policy) | All credential environment names and pools (unchanged) |

`includeCredentials=false` suppresses every credential exception, cloud names
included. Rotation pools (`GEMINI_API_KEYS`, `OPENROUTER_API_KEYS`,
`OPENAI_COMPAT_API_KEYS`) stay worker-side; a CLI never receives a full pool.

Integrations that relied on accidental inheritance of unrelated parent
variables must use an explicitly reviewed child policy; there is no blanket
escape hatch.

## Log redaction

A mandatory, always-on credential scrub runs at the logger's final
serialization boundary, before the log-file append, the stderr fallback, and
logger-failure diagnostics. It covers the assembled line: message, context
fields, and serialized data (including DEBUG serialization). It is independent
of the optional content-redaction settings and does not mutate original error
objects. Sync and Gemini error construction additionally omit remote response
bodies (status and operation are kept), and the sync token, realtime grants,
and selected Gemini pool keys are supplied as exact values to a bounded
in-memory scrub registry, so an echoed secret is removed even where pattern
matching cannot recognize it. Remote error text keeps control characters out of
log records. Old log files are not rewritten.

## Quarantine retention

When the installer quarantines an unreadable settings.json, the copy is kept at
`settings.json.corrupt-<epoch-ms>[-n]` with its original bytes so recovery
stays possible. After a successful settings replacement, opportunistic pruning
retains at most the three newest such files in the same directory and deletes
entries older than seven days (using the encoded timestamp). Symlinks,
junctions, directories, malformed names, and other directories are never
touched. Deletion failures preserve the file and report only the name. Without
another successful installer write, quarantined files can remain longer than
seven days — there is no background cleanup timer. Recovery copies remain
sensitive until removed. Uninstall continues to preserve the data directory.

## Storage permissions (platform disclosure)

- POSIX: credential files are written with mode `0600` inside a `0700` data
  directory; the mode is asserted by tests on POSIX only.
- Windows: the `0600`/`0700` values are creation intent only. Observed `stat`
  modes on Windows report `0666`; mode bits on Windows establish neither
  effective protection nor exposure. Protection is the profile ACL. Read-only
  `icacls` inspection of fixture `.env`, settings, and data-directory files
  (recorded in the verification evidence for this change) shows the current
  user with full control, `NT AUTHORITY\SYSTEM` and `BUILTIN\Administrators`
  with full control (inherited), and no broad Users/Everyone principal on a
  default single-user profile — an observation about one machine class, not a
  guarantee. Storage on Windows is not claimed "secure".

No credential migration, rotation, or deletion of user data is performed by any
of the above. Removing credentials remains a user action (deleting the data
directory or editing `~/.claude-mem/.env`).
