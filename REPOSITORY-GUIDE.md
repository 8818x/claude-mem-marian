# Marian repository guide

Written for the Marian fork. Upstream claude-mem attribution, Apache-2.0 license and notices remain in place.

Marian captures Claude Code/Codex activity, turns observations into persistent memory, and exposes search, context injection and a web interface. Agent hosts are separate from model providers: Claude, Codex, OpenRouter and OpenAI-compatible provider code belongs to the memory pipeline.

Read `README.md` for usage, `MARIAN.md` for fork changes, and `CLAUDE.md` before editing. The working/default branch is `main`.

The [file catalog](docs/repository-files.md) lists every version-controlled file and every containing directory in this snapshot. Directory descriptions explain ownership; exported symbol names and document titles identify individual files. Generated files are explicitly distinguished from source. The catalog is an inventory, not a claim that every historical integration or deployment target is maintained by this fork.

| Directory | Responsibility |
| --- | --- |
| `src/` | Editable application source: capture, workers, providers, persistence, context, HTTP APIs and UI. |
| `tests/` | Unit, integration, browser and infrastructure checks; `helpers/` supports the test harness. |
| `plugin/` | Distributed plugin: manifests, hooks, skills, modes, SQLite assets and generated scripts/UI. Edit source and rebuild generated assets. |
| `scripts/` | Build, packaging, installation/sync, test lanes, maintenance, diagnostics and release tools. |
| `docs/` | Public MDX documentation, translations, internal design records, images and retained upstream notices. |
| `cowork/` | Claude Cowork plugin, hook, skills and its tests; retained as part of the Claude family. |
| `docker/` | Worker/PostgreSQL container definitions and end-to-end container fixtures. |
| `services/sync-api/` | Separate hosted sync API package, deployment configuration and tests. |
| `workers/sync-hub/` | Inherited Cloudflare sync-hub package and tests; its presence does not authorize deployment. See `CLAUDE.md` hosting policy. |
| `install/` | Static installation entry page and Vercel configuration. |
| `ragtime/` | Email investigation batch processor: each corpus file runs in a fresh Claude session, using memory injection for continuity; has its own README and license. |
| `evals/` | Evaluation inputs and fixture code for read-gate and related behavior, rather than production application modules. |
| `fixtures/` | Reusable sample inputs and captured fixtures. |
| `plans/`, `.plan/` | Historical implementation proposals and design notes; not runtime configuration. Some describe retired integrations. |
| `.agents/`, `.claude-plugin/`, `.codex-plugin/` | Agent marketplace/plugin discovery manifests. |
| `.claude/` | Repository development commands, plans and reports for Claude. |
| `.github/` | GitHub Actions, issue templates, funding and contributor/agent guidance. |
| `.agent-jobs/`, `.maestro/` | Historical automation jobs, issue triage, playbooks and results. |

Local directories such as `.git/`, `node_modules/`, `dist/` and `.scratch/` are not part of the tracked file catalog. `.git/` holds history and refs, `node_modules/` installed dependencies, `dist/` generated CLI/library output, and `.scratch/` local scratch work. Nested packages can have their own dependencies and build caches.

| Source directory | Responsibility |
| --- | --- |
| `src/cli/`, `src/npx-cli/` | Command-line commands and the npm installation/management entrypoint. |
| `src/launcher/`, `src/supervisor/` | Process launch, worker ownership, supervision and lifecycle. |
| `src/build/`, `src/hooks/`, `src/integrations/` | Hook shell generation, hook responses and shared agent/worker integration. |
| `src/core/schemas/`, `src/types/` | Shared contracts and domain types. |
| `src/sdk/` | Agent SDK options, prompt construction, response parsing and classification. |
| `src/services/` | Application services, memory processing, context construction and worker HTTP behavior. |
| `src/services/worker/` | Worker runtime, model/provider agents, session processing, search and HTTP routes. |
| `src/services/sqlite/`, `src/storage/` | Persistent memory queries, schema/migration helpers and SQLite/PostgreSQL storage. |
| `src/services/context/` | Selection and formatting of memory injected into agent sessions. |
| `src/services/infrastructure/`, `src/services/backup/` | Filesystem/process/environment support and backup operations. |
| `src/server/`, `src/services/server/` | Server-facing runtime and supporting services. |
| `src/servers/` | MCP server entrypoints and tool dispatch. |
| `src/shared/`, `src/utils/` | Shared settings, identity, contracts and utility functions used across services. |
| `src/ui/my-work/` | Main React/Vite application: My Work, My Rules and setup, with its own package and lockfile. |
| `src/ui/viewer/` | Classic React viewer: feeds, sessions, settings, logs, components and hooks. |
| `src/ui/viewer/themes.ts` | Shared flavor names and preference migration, persistence and DOM application for both React apps. |
| `src/ui/catppuccin.css` | Shared official palette values and semantic color mappings for both React apps. |
| `src/ui/viewer-template.html` | Classic viewer shell and component layout CSS. The build embeds the shared stylesheet. |
| `src/ui/tv.html` | Separate standalone observation TV page. |

| Root file | Responsibility |
| --- | --- |
| `README.md` | Fork overview, installation, build and provider configuration. |
| `MARIAN.md` | Marian patch history and verification limits. |
| `CHANGELOG.md` | Upstream version history; maintained by upstream automation. |
| `AGENTS.md` | Codex entrypoint referring to shared repository instructions. |
| `CLAUDE.md` | Shared agent rules, build locations, fork scope, licensing and hosting requirements. |
| `REPOSITORY-GUIDE.md` | This overview and links to the complete file catalog. |
| `LICENSE`, `NOTICE` | Apache-2.0 license and retained attribution notices. |
| `package.json` | Root package metadata, runtime/build dependencies, scripts and publication file list. |
| `tsconfig.json` | Backend TypeScript configuration. Viewer and My Work have separate DOM-aware configurations. |
| `bunfig.toml` | Bun test-runner configuration. |
| `.npmrc`, `.npmignore` | npm behavior and packaging exclusions. |
| `.gitignore`, `.gitattributes` | Git exclusions and file/text handling. |
| `.dockerignore` | Container build-context exclusions. |
| `.markdownlint.json` | Markdown lint configuration. |
| `.translation-cache.json` | Cached documentation translation metadata. |
| `docker-compose.yml` | Local container service composition. |
| `docker-compose.e2e.yml` | Container composition for end-to-end verification. |
| `Dockerfile.test-installer` | Installer test image definition. |
| `transcript-watch.example.json` | Example transcript watcher configuration, not the active user settings file. |
| `RECEIPT-JOIN.md` | Receipt/event join design and investigation notes. |
| `posthog-self-driving-report.md` | Historical automation report. |

The typical runtime flow is agent hook → local worker → observation/provider processing → memory storage → search/context injection and UI. The source checkout and the installed worker are separate: building this repository does not replace the worker currently serving port 37777.

The React apps offer exactly four Catppuccin choices: Latte, Frappé, Macchiato and Mocha. Both use `claude-mem-theme` in same-origin local storage. Old `light` and `dark` values map to Latte and Mocha. With no saved flavor, the initial choice is Mocha regardless of system color scheme. A legacy saved system preference still follows the system. `?theme=<flavor>` previews a flavor; choosing from the selector persists that choice and removes only the preview query parameter. Once a flavor is chosen, it stays fixed until changed. Palette attribution is retained in `docs/upstream-notices/catppuccin-LICENSE.txt`.

Use `npm run build` to generate distribution artifacts. `npm run build-and-sync` also writes to the installed marketplace and restarts its worker; that is deployment and requires a separate owner instruction.
