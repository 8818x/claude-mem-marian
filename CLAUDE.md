# Claude-Mem: AI Development Instructions

> Modified by the claude-mem-marian fork: shared Claude/Codex guidance and Apache-2.0 requirements. Upstream attribution is retained.

Claude-mem is a Claude Code plugin providing persistent memory across sessions. It captures tool usage, compresses observations using the Claude Agent SDK, and injects relevant context into future sessions.

## Build

Use `npm run build` for checkout-local build verification. `npm run dev` runs the same build and does not start a watcher. Build dependency caches stay under `.scratch/build-cache/`.

Run `npm test` and `npm run typecheck` for the test suite and TypeScript checks.

Treat `npm run build-and-sync` as an explicit local integration operation. It builds the plugin, then previews the installed marketplace and cache sync, dependency installs, stale-file removal, and worker restart plan. Add `-- --apply` only when you intend to perform all listed operations. The command builds locally before its sync preview; the build does not touch installed state.

For installed-state operations, `npm run sync-marketplace` previews sync and dependency-install targets. Use `npm run sync-marketplace -- --apply` to apply it. `npm run sync-marketplace:force` previews with the beta-branch guard bypassed; add `-- --apply` to apply. `--force` does not enable writes.

`node scripts/restart-marketplace-worker.cjs` and `npm run worker:restart` preview the validated installed worker target. Add `--apply` to the direct script or `-- --apply` to npm to restart it. The sync command restarts only when both `--restart` and `--apply` are present. These commands are not ordinary build/test verification.

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
