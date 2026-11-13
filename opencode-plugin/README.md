# claude-mem OpenCode plugin

Connects an OpenCode session to the local claude-mem worker: project memory is read once per session, and every finished turn is sent back as an observation.

## Install

Copy `claude-mem.js` into OpenCode's global plugin directory:

```powershell
Copy-Item opencode-plugin\claude-mem.js "$env:USERPROFILE\.config\opencode\plugins\claude-mem.js"
```

OpenCode discovers `.js` files in that directory on its own; no `opencode.json` entry is needed. The worker must listen on `http://127.0.0.1:37777` (override with `CLAUDE_MEM_WORKER_URL`, loopback only). Restart OpenCode after changing the file.

## What it does

- `session.hook("context")` reads `GET /api/context/inject` on a session's first model call and appends the returned memory to that request's system text. Only that one call is affected; history is not rewritten.
- Each user message, paired with the assistant reply just before it, is posted to `POST /api/sessions/init` and then `POST /api/sessions/observations`.
- After a turn ends and the session stays quiet for 60 seconds, `POST /api/sessions/summarize` records the session summary.
- Requests are loopback-only, time out after two seconds, reject redirects, and never block a turn when the worker is offline.

## Limits

- OpenCode 2.2.5 has no session-end event, only `session.execution.*` per turn, so the summary waits for a 60-second quiet window. A one-shot `opencode run` exits before that timer fires and therefore records observations but no summary.
- Reasoning and tool parts are not captured; only message text is sent.
- `~/.config/opencode/plugins/claude-mem.js` is a copy. Change the file here and copy it again.

## Check

```powershell
npm test
```

Live check: run `opencode run --standalone --format json "Reply with exactly: bridge-ok"` in any project, then confirm the worker logged `handleSessionInitByClaudeId` with `platformSource=opencode`.
