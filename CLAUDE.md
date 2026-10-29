# Claude-Mem: AI Development Instructions

> Modified by the claude-mem-marian fork: shared Claude/Codex guidance and Apache-2.0 requirements. Upstream attribution is retained.

Claude-mem is a Claude Code plugin providing persistent memory across sessions. It captures tool usage, compresses observations using the Claude Agent SDK, and injects relevant context into future sessions.

## Build

```bash
npm run build-and-sync        # Build, sync to marketplace, restart worker
```

## File Locations

- **Source**: `<project-root>/src/`
- **Built Plugin**: `<project-root>/plugin/`
- **Installed Plugin**: `~/.claude/plugins/marketplaces/thedotmack/`
- **Database**: `~/.claude-mem/claude-mem.db`
- **Chroma**: `~/.claude-mem/chroma/`

## Requirements

- **Bun** (all platforms - auto-installed if missing)
- **uv** (all platforms - auto-installed if missing, provides Python for Chroma)
- Node.js

## Documentation

**Public Docs**: https://docs.claude-mem.ai (Mintlify)
**Source**: `docs/public/` - MDX files, edit `docs.json` for navigation
**Deploy**: Auto-deploys from GitHub on push to main

## Important

Upstream `CHANGELOG.md` is generated automatically. Maintain fork patch history in `MARIAN.md`.

## Hosting

No metered Cloudflare compute. New server-side work goes on Fly or Vercel. Cloudflare Workers, Durable Objects, Queues, Workflows, crons or Workers AI need an owner-approved cost comparison first. Free Cloudflare services (DNS, R2, Email Routing) are fine.

## Marian scope

This fork is maintained for Claude Code and Codex. Start with `src/`, `tests/`, `plugin/` and `MARIAN.md`; read other host integrations only when the task requires them. Agent hosts and LLM providers are separate: preserve OpenRouter and the shared memory pipeline.

Apache-2.0 compliance:
- Preserve all upstream copyright, license, and NOTICE information.
- Any modified upstream file must contain a prominent notice stating that it has been modified.
- Never remove or replace upstream attribution.
- Do not claim authorship of unchanged upstream code.
