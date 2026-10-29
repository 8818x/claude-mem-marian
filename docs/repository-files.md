# Marian file catalog

Created for the Marian fork on 2026-10-29. Upstream attribution and licensing are unchanged.

Snapshot: 2666 version-controlled or newly added task files, 385 containing directories. Installed dependencies, Git internals, ignored local files and generated untracked build output are excluded. See [the repository guide](../REPOSITORY-GUIDE.md) for the runtime flow and maintained scope. File roles below are inventory summaries based on file format, document title and exported declarations; inherited historical material is not a supported feature promise.

## Directory inventory

| Directory | Role |
| --- | --- |
| `.agent-jobs/` | Historical automated issue and pull-request job reports; . |
| `.agent-jobs/pr-results/` | Historical automated issue and pull-request job reports; pr results. |
| `.agents/` | Agent marketplace discovery; . |
| `.agents/plugins/` | Agent marketplace discovery; plugins. |
| `.claude/` | Repository Claude development commands and records; . |
| `.claude-plugin/` | Claude marketplace/plugin manifests; . |
| `.claude/commands/` | Repository Claude development commands and records; commands. |
| `.claude/plans/` | Repository Claude development commands and records; plans. |
| `.claude/reports/` | Repository Claude development commands and records; reports. |
| `.codex-plugin/` | Codex plugin manifest; . |
| `.github/` | GitHub automation and issue intake; . |
| `.github/ISSUE_TEMPLATE/` | GitHub automation and issue intake; ISSUE TEMPLATE. |
| `.github/workflows/` | GitHub automation and issue intake; workflows. |
| `.maestro/` | Historical triage and investigation playbooks; . |
| `.maestro/playbooks/` | Historical triage and investigation playbooks; playbooks. |
| `.maestro/playbooks/2026-02-23-Issue-Triage/` | Historical triage and investigation playbooks; 2026 02 23 Issue Triage. |
| `.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/` | Historical triage and investigation playbooks; 2026 02 23 Root Cause Fixes. |
| `.maestro/playbooks/2026-02-25-CM-Issues-PRs/` | Historical triage and investigation playbooks; 2026 02 25 CM Issues PRs. |
| `.maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/` | Historical triage and investigation playbooks; 2026 02 25 Branch Memory. |
| `.maestro/playbooks/2026-03-12-CM-Issues-PRs/` | Historical triage and investigation playbooks; 2026 03 12 CM Issues PRs. |
| `.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/` | Historical triage and investigation playbooks; 2026 03 12 Issues PRs Triage. |
| `.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/Working/` | Historical triage and investigation playbooks; Working. |
| `.maestro/playbooks/2026-03-15-Branch-Memory/` | Historical triage and investigation playbooks; 2026 03 15 Branch Memory. |
| `.maestro/playbooks/2026-03-15-Branch-Memory/2026-03-15-Branch-Parity/` | Historical triage and investigation playbooks; 2026 03 15 Branch Parity. |
| `.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/` | Historical triage and investigation playbooks; 2026 03 29 Issues Triage 3 29 2026. |
| `.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Working/` | Historical triage and investigation playbooks; Working. |
| `.maestro/playbooks/Wizard-2026-02-22/` | Historical triage and investigation playbooks; Wizard 2026 02 22. |
| `.maestro/playbooks/Wizard-2026-02-22-2/` | Historical triage and investigation playbooks; Wizard 2026 02 22 2. |
| `.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/` | Historical triage and investigation playbooks; 2026 02 22 Lo Co Mo Eval. |
| `.plan/` | Implementation planning records; . |
| `cowork/` | Claude Cowork plugin and its bundled tools; cowork. |
| `cowork/.claude-plugin/` | Claude Cowork plugin and its bundled tools; . |
| `cowork/hooks/` | Claude Cowork plugin and its bundled tools; hooks. |
| `cowork/scripts/` | Claude Cowork plugin and its bundled tools; scripts. |
| `cowork/skills/` | Claude Cowork plugin and its bundled tools; skills. |
| `cowork/skills/agent-cost-report/` | Claude Cowork plugin and its bundled tools; agent cost report. |
| `cowork/skills/agent-cost-report/scripts/` | Claude Cowork plugin and its bundled tools; scripts. |
| `cowork/skills/agent-cost-report/scripts/acr/` | Claude Cowork plugin and its bundled tools; acr. |
| `cowork/skills/agent-cost-report/scripts/tests/` | Claude Cowork plugin and its bundled tools; tests. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/` | Claude Cowork plugin and its bundled tools; fixtures. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/` | Claude Cowork plugin and its bundled tools; codex. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/` | Claude Cowork plugin and its bundled tools; sessions. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/` | Claude Cowork plugin and its bundled tools; 2026. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/` | Claude Cowork plugin and its bundled tools; 09. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/18/` | Claude Cowork plugin and its bundled tools; 18. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/` | Claude Cowork plugin and its bundled tools; projects. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-a/` | Claude Cowork plugin and its bundled tools;  workspace proj a. |
| `cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-b/` | Claude Cowork plugin and its bundled tools;  workspace proj b. |
| `cowork/skills/mem-search/` | Claude Cowork plugin and its bundled tools; mem search. |
| `cowork/skills/mem-setup/` | Claude Cowork plugin and its bundled tools; mem setup. |
| `cowork/test/` | Claude Cowork plugin and its bundled tools; test. |
| `docker/` | Container deployment and end-to-end test assets; docker. |
| `docker/claude-mem/` | Container deployment and end-to-end test assets; claude mem. |
| `docker/e2e/` | Container deployment and end-to-end test assets; e2e. |
| `docker/postgres/` | Container deployment and end-to-end test assets; postgres. |
| `docs/` | Documentation and reference assets; docs. |
| `docs/adr/` | Documentation and reference assets; adr. |
| `docs/assets/` | Documentation and reference assets; assets. |
| `docs/assets/merge-clinic/` | Documentation and reference assets; merge clinic. |
| `docs/bug-fixes/` | Documentation and reference assets; bug fixes. |
| `docs/context/` | Documentation and reference assets; context. |
| `docs/expense-pricing/` | Documentation and reference assets; expense pricing. |
| `docs/i18n/` | Documentation and reference assets; i18n. |
| `docs/public/` | Documentation and reference assets; public. |
| `docs/public/antigravity-cli/` | Documentation and reference assets; antigravity cli. |
| `docs/public/architecture/` | Documentation and reference assets; architecture. |
| `docs/public/configuration/` | Documentation and reference assets; configuration. |
| `docs/public/cursor/` | Documentation and reference assets; cursor. |
| `docs/public/grok-bot/` | Documentation and reference assets; grok bot. |
| `docs/public/usage/` | Documentation and reference assets; usage. |
| `docs/upstream-notices/` | Preserved third-party licenses and provenance; upstream notices. |
| `docs/upstream-notices/dsh/` | Preserved third-party licenses and provenance; dsh. |
| `docs/upstream-notices/pi/` | Preserved third-party licenses and provenance; pi. |
| `docs/upstream-notices/src/` | Preserved third-party licenses and provenance; src. |
| `docs/upstream-notices/src/integrations/` | Preserved third-party licenses and provenance; integrations. |
| `docs/upstream-notices/src/integrations/dsh-plugin/` | Preserved third-party licenses and provenance; dsh plugin. |
| `docs/upstream-notices/src/integrations/dsh-plugin/vendor/` | Preserved third-party licenses and provenance; vendor. |
| `evals/` | Evaluation harnesses and artificial application fixtures; evals. |
| `evals/read-gate/` | Evaluation harnesses and artificial application fixtures; read gate. |
| `evals/read-gate/fixture/` | Evaluation harnesses and artificial application fixtures; fixture. |
| `evals/read-gate/fixture-large/` | Evaluation harnesses and artificial application fixtures; fixture large. |
| `evals/read-gate/fixture-large/src/` | Evaluation harnesses and artificial application fixtures; src. |
| `evals/read-gate/fixture-large/src/shipping/` | Evaluation harnesses and artificial application fixtures; shipping. |
| `evals/read-gate/fixture/src/` | Evaluation harnesses and artificial application fixtures; src. |
| `evals/read-gate/fixture/src/shipping/` | Evaluation harnesses and artificial application fixtures; shipping. |
| `evals/read-gate/gate-off-large-file/` | Evaluation harnesses and artificial application fixtures; gate off large file. |
| `evals/read-gate/gate-off-large-file/graders/` | Evaluation harnesses and artificial application fixtures; graders. |
| `evals/read-gate/gate-off-small-file/` | Evaluation harnesses and artificial application fixtures; gate off small file. |
| `evals/read-gate/gate-off-small-file/graders/` | Evaluation harnesses and artificial application fixtures; graders. |
| `evals/read-gate/gate-on-edits-file/` | Evaluation harnesses and artificial application fixtures; gate on edits file. |
| `evals/read-gate/gate-on-edits-file/graders/` | Evaluation harnesses and artificial application fixtures; graders. |
| `evals/read-gate/gate-on-large-file/` | Evaluation harnesses and artificial application fixtures; gate on large file. |
| `evals/read-gate/gate-on-large-file/graders/` | Evaluation harnesses and artificial application fixtures; graders. |
| `evals/read-gate/gate-on-small-file/` | Evaluation harnesses and artificial application fixtures; gate on small file. |
| `evals/read-gate/gate-on-small-file/graders/` | Evaluation harnesses and artificial application fixtures; graders. |
| `fixtures/` | Reusable test/sample inputs; fixtures. |
| `fixtures/hosts/` | Reusable test/sample inputs; hosts. |
| `install/` | Static installation site; install. |
| `install/public/` | Static installation site; public. |
| `plans/` | Historical design and implementation proposals; plans. |
| `plans/hackathon/` | Historical design and implementation proposals; hackathon. |
| `plans/inbox/` | Historical design and implementation proposals; inbox. |
| `plugin/` | Distributed plugin resources; plugin. |
| `plugin/.claude-plugin/` | Distributed plugin resources; . |
| `plugin/.codex-plugin/` | Distributed plugin resources; . |
| `plugin/hooks/` | Agent lifecycle hook registration; hooks. |
| `plugin/modes/` | Memory observation/context mode definitions; modes. |
| `plugin/scripts/` | Generated executable runtime bundles and maps; scripts. |
| `plugin/skills/` | Distributed agent skill instructions and helpers; skills. |
| `plugin/skills/agent-cost-report/` | Distributed agent skill instructions and helpers; agent cost report. |
| `plugin/skills/agent-cost-report/scripts/` | Distributed agent skill instructions and helpers; scripts. |
| `plugin/skills/agent-cost-report/scripts/acr/` | Distributed agent skill instructions and helpers; acr. |
| `plugin/skills/agent-cost-report/scripts/tests/` | Distributed agent skill instructions and helpers; tests. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/` | Distributed agent skill instructions and helpers; fixtures. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/` | Distributed agent skill instructions and helpers; codex. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/` | Distributed agent skill instructions and helpers; sessions. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/` | Distributed agent skill instructions and helpers; 2026. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/` | Distributed agent skill instructions and helpers; 09. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/18/` | Distributed agent skill instructions and helpers; 18. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/` | Distributed agent skill instructions and helpers; projects. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-a/` | Distributed agent skill instructions and helpers;  workspace proj a. |
| `plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-b/` | Distributed agent skill instructions and helpers;  workspace proj b. |
| `plugin/skills/agent-cost-report/verification/` | Distributed agent skill instructions and helpers; verification. |
| `plugin/skills/babysit/` | Distributed agent skill instructions and helpers; babysit. |
| `plugin/skills/backup-setup/` | Distributed agent skill instructions and helpers; backup setup. |
| `plugin/skills/build/` | Distributed agent skill instructions and helpers; build. |
| `plugin/skills/build-and-release/` | Distributed agent skill instructions and helpers; build and release. |
| `plugin/skills/ccs-align/` | Distributed agent skill instructions and helpers; ccs align. |
| `plugin/skills/childhood/` | Distributed agent skill instructions and helpers; childhood. |
| `plugin/skills/cloud-sync/` | Distributed agent skill instructions and helpers; cloud sync. |
| `plugin/skills/design-is/` | Distributed agent skill instructions and helpers; design is. |
| `plugin/skills/do/` | Distributed agent skill instructions and helpers; do. |
| `plugin/skills/handoff/` | Distributed agent skill instructions and helpers; handoff. |
| `plugin/skills/how-it-works/` | Distributed agent skill instructions and helpers; how it works. |
| `plugin/skills/knowledge-agent/` | Distributed agent skill instructions and helpers; knowledge agent. |
| `plugin/skills/learn-codebase/` | Distributed agent skill instructions and helpers; learn codebase. |
| `plugin/skills/make-plan/` | Distributed agent skill instructions and helpers; make plan. |
| `plugin/skills/mem-search/` | Distributed agent skill instructions and helpers; mem search. |
| `plugin/skills/mode-creator/` | Distributed agent skill instructions and helpers; mode creator. |
| `plugin/skills/mode-creator/evals/` | Distributed agent skill instructions and helpers; evals. |
| `plugin/skills/mode-creator/references/` | Distributed agent skill instructions and helpers; references. |
| `plugin/skills/mode-creator/scripts/` | Distributed agent skill instructions and helpers; scripts. |
| `plugin/skills/oh-my-issues/` | Distributed agent skill instructions and helpers; oh my issues. |
| `plugin/skills/owner-goals/` | Distributed agent skill instructions and helpers; owner goals. |
| `plugin/skills/owner-goals/scripts/` | Distributed agent skill instructions and helpers; scripts. |
| `plugin/skills/pathfinder/` | Distributed agent skill instructions and helpers; pathfinder. |
| `plugin/skills/release/` | Distributed agent skill instructions and helpers; release. |
| `plugin/skills/request-progress/` | Distributed agent skill instructions and helpers; request progress. |
| `plugin/skills/request-progress/scripts/` | Distributed agent skill instructions and helpers; scripts. |
| `plugin/skills/screenpipe/` | Distributed agent skill instructions and helpers; screenpipe. |
| `plugin/skills/smart-explore/` | Distributed agent skill instructions and helpers; smart explore. |
| `plugin/skills/standup/` | Distributed agent skill instructions and helpers; standup. |
| `plugin/skills/timeline-report/` | Distributed agent skill instructions and helpers; timeline report. |
| `plugin/skills/version-bump/` | Distributed agent skill instructions and helpers; version bump. |
| `plugin/skills/version-bump/scripts/` | Distributed agent skill instructions and helpers; scripts. |
| `plugin/skills/weekly-digests/` | Distributed agent skill instructions and helpers; weekly digests. |
| `plugin/skills/what-the/` | Distributed agent skill instructions and helpers; what the. |
| `plugin/skills/wowerpoint/` | Distributed agent skill instructions and helpers; wowerpoint. |
| `plugin/sqlite/` | Generated distributed SQLite modules; sqlite. |
| `plugin/sqlite/observations/` | Generated distributed SQLite modules; observations. |
| `plugin/ui/` | Generated UI artifacts and static UI assets; ui. |
| `plugin/ui/assets/` | Generated UI artifacts and static UI assets; assets. |
| `plugin/ui/assets/fonts/` | Generated UI artifacts and static UI assets; fonts. |
| `plugin/ui/work-view/` | Generated UI artifacts and static UI assets; work view. |
| `plugin/ui/work-view/assets/` | Generated UI artifacts and static UI assets; assets. |
| `ragtime/` | Email investigation corpus batch processor; ragtime. |
| `scripts/` | Build, test, install, maintenance and release tooling; scripts. |
| `scripts/anti-pattern-test/` | Build, test, install, maintenance and release tooling; anti pattern test. |
| `scripts/bug-report/` | Build, test, install, maintenance and release tooling; bug report. |
| `scripts/openrouter-price-history/` | Build, test, install, maintenance and release tooling; openrouter price history. |
| `scripts/openrouter-price-history/sources/` | Build, test, install, maintenance and release tooling; sources. |
| `scripts/translate-readme/` | Build, test, install, maintenance and release tooling; translate readme. |
| `services/` | Separately packaged hosted services; services. |
| `services/sync-api/` | Hosted sync API runtime and tests; sync api. |
| `services/sync-api/src/` | Hosted sync API runtime and tests; src. |
| `services/sync-api/test/` | Hosted sync API runtime and tests; test. |
| `src/` | Application source; src. |
| `src/build/` | Application source; build. |
| `src/cli/` | Application source; cli. |
| `src/cli/adapters/` | Application source; adapters. |
| `src/cli/handlers/` | Application source; handlers. |
| `src/core/` | Application source; core. |
| `src/core/schemas/` | Application source; schemas. |
| `src/hooks/` | Application source; hooks. |
| `src/integrations/` | Application source; integrations. |
| `src/launcher/` | Application source; launcher. |
| `src/npx-cli/` | npm installation/management command-line interface; npx cli. |
| `src/npx-cli/commands/` | npm installation/management command-line interface; commands. |
| `src/npx-cli/install/` | npm installation/management command-line interface; install. |
| `src/npx-cli/utils/` | npm installation/management command-line interface; utils. |
| `src/sdk/` | Application source; sdk. |
| `src/server/` | Application source; server. |
| `src/server/auth/` | Application source; auth. |
| `src/server/compat/` | Application source; compat. |
| `src/server/generation/` | Application source; generation. |
| `src/server/generation/providers/` | Application source; providers. |
| `src/server/generation/providers/shared/` | Application source; shared. |
| `src/server/jobs/` | Application source; jobs. |
| `src/server/mcp/` | Application source; mcp. |
| `src/server/middleware/` | Application source; middleware. |
| `src/server/queue/` | Application source; queue. |
| `src/server/routes/` | Application source; routes. |
| `src/server/routes/v1/` | Application source; v1. |
| `src/server/runtime/` | Application source; runtime. |
| `src/server/services/` | Application source; services. |
| `src/servers/` | MCP server entrypoints and tools; servers. |
| `src/services/` | Application source; services. |
| `src/services/agent-runner/` | Application source; agent runner. |
| `src/services/backup/` | Application source; backup. |
| `src/services/context/` | Injected-memory selection and rendering; context. |
| `src/services/context/formatters/` | Injected-memory selection and rendering; formatters. |
| `src/services/context/sections/` | Injected-memory selection and rendering; sections. |
| `src/services/dedup/` | Application source; dedup. |
| `src/services/domain/` | Application source; domain. |
| `src/services/hooks/` | Application source; hooks. |
| `src/services/infrastructure/` | Application source; infrastructure. |
| `src/services/install/` | Application source; install. |
| `src/services/integrations/` | Application source; integrations. |
| `src/services/memory/` | Application source; memory. |
| `src/services/prompt-import/` | Application source; prompt import. |
| `src/services/reinforcement/` | Application source; reinforcement. |
| `src/services/server/` | Application source; server. |
| `src/services/setup/` | Application source; setup. |
| `src/services/smart-file-read/` | Application source; smart file read. |
| `src/services/sqlite/` | SQLite session and memory persistence; sqlite. |
| `src/services/sqlite/observations/` | SQLite session and memory persistence; observations. |
| `src/services/sqlite/prompts/` | SQLite session and memory persistence; prompts. |
| `src/services/sync/` | Application source; sync. |
| `src/services/telemetry/` | Application source; telemetry. |
| `src/services/transcripts/` | Application source; transcripts. |
| `src/services/vector/` | Application source; vector. |
| `src/services/work-view/` | Application source; work view. |
| `src/services/worker/` | Application source; worker. |
| `src/services/worker/agents/` | Model/provider observation agents; agents. |
| `src/services/worker/events/` | Application source; events. |
| `src/services/worker/http/` | Application source; http. |
| `src/services/worker/http/middleware/` | Application source; middleware. |
| `src/services/worker/http/routes/` | Local worker HTTP endpoint handlers; routes. |
| `src/services/worker/knowledge/` | Application source; knowledge. |
| `src/services/worker/search/` | Application source; search. |
| `src/services/worker/search/strategies/` | Application source; strategies. |
| `src/services/worker/session/` | Application source; session. |
| `src/services/worker/validation/` | Application source; validation. |
| `src/shared/` | Shared contracts, settings and identity utilities; shared. |
| `src/storage/` | Application source; storage. |
| `src/storage/postgres/` | PostgreSQL storage implementation; postgres. |
| `src/storage/sqlite/` | SQLite storage implementation; sqlite. |
| `src/supervisor/` | Application source; supervisor. |
| `src/types/` | Application source; types. |
| `src/ui/` | Application source; ui. |
| `src/ui/my-work/` | Main My Work/My Rules React application and setup flow; my work. |
| `src/ui/my-work/public/` | Main My Work/My Rules React application and setup flow; public. |
| `src/ui/my-work/scripts/` | Main My Work/My Rules React application and setup flow; scripts. |
| `src/ui/my-work/src/` | Main My Work/My Rules React application and setup flow; src. |
| `src/ui/my-work/src/assets/` | Main My Work/My Rules React application and setup flow; assets. |
| `src/ui/my-work/src/components/` | Main My Work/My Rules React application and setup flow; components. |
| `src/ui/my-work/src/components/aceternity/` | Main My Work/My Rules React application and setup flow; aceternity. |
| `src/ui/my-work/src/components/ai-elements/` | Main My Work/My Rules React application and setup flow; ai elements. |
| `src/ui/my-work/src/components/ui/` | Main My Work/My Rules React application and setup flow; ui. |
| `src/ui/my-work/src/lib/` | Main My Work/My Rules React application and setup flow; lib. |
| `src/ui/my-work/src/live/` | Main My Work/My Rules React application and setup flow; live. |
| `src/ui/my-work/src/pages/` | Main My Work/My Rules React application and setup flow; pages. |
| `src/ui/my-work/src/setup/` | Main My Work/My Rules React application and setup flow; setup. |
| `src/ui/my-work/src/setup/assets/` | Main My Work/My Rules React application and setup flow; assets. |
| `src/ui/my-work/src/setup/assets/agents/` | Main My Work/My Rules React application and setup flow; agents. |
| `src/ui/my-work/src/setup/screens/` | Main My Work/My Rules React application and setup flow; screens. |
| `src/ui/my-work/src/spec/` | Main My Work/My Rules React application and setup flow; spec. |
| `src/ui/my-work/test-fixtures/` | Main My Work/My Rules React application and setup flow; test fixtures. |
| `src/ui/viewer/` | Classic memory viewer React application; viewer. |
| `src/ui/viewer/assets/` | Classic memory viewer React application; assets. |
| `src/ui/viewer/assets/fonts/` | Classic memory viewer React application; fonts. |
| `src/ui/viewer/components/` | Classic viewer UI components; components. |
| `src/ui/viewer/constants/` | Classic memory viewer React application; constants. |
| `src/ui/viewer/hooks/` | Classic viewer React state and effects; hooks. |
| `src/ui/viewer/utils/` | Classic memory viewer React application; utils. |
| `src/utils/` | Application source; utils. |
| `tests/` | Automated behavior and infrastructure checks; tests. |
| `tests/backup/` | Automated behavior and infrastructure checks; backup. |
| `tests/cli/` | Automated behavior and infrastructure checks; cli. |
| `tests/cli/adapters/` | Automated behavior and infrastructure checks; adapters. |
| `tests/cli/handlers/` | Automated behavior and infrastructure checks; handlers. |
| `tests/compat/` | Automated behavior and infrastructure checks; compat. |
| `tests/context/` | Automated behavior and infrastructure checks; context. |
| `tests/context/formatters/` | Automated behavior and infrastructure checks; formatters. |
| `tests/context/sections/` | Automated behavior and infrastructure checks; sections. |
| `tests/core/` | Automated behavior and infrastructure checks; core. |
| `tests/core/schemas/` | Automated behavior and infrastructure checks; schemas. |
| `tests/dedup/` | Automated behavior and infrastructure checks; dedup. |
| `tests/dedup/fixtures/` | Automated behavior and infrastructure checks; fixtures. |
| `tests/evals/` | Automated behavior and infrastructure checks; evals. |
| `tests/fixtures/` | Automated behavior and infrastructure checks; fixtures. |
| `tests/fixtures/codex/` | Automated behavior and infrastructure checks; codex. |
| `tests/fixtures/custom-providers/` | Automated behavior and infrastructure checks; custom providers. |
| `tests/fixtures/gemini/` | Automated behavior and infrastructure checks; gemini. |
| `tests/fixtures/hosts/` | Automated behavior and infrastructure checks; hosts. |
| `tests/fixtures/kimi/` | Automated behavior and infrastructure checks; kimi. |
| `tests/fixtures/owner-goals/` | Automated behavior and infrastructure checks; owner goals. |
| `tests/fixtures/prompt-import/` | Automated behavior and infrastructure checks; prompt import. |
| `tests/fixtures/prompt-import/home/` | Automated behavior and infrastructure checks; home. |
| `tests/fixtures/prompt-import/home/.claude/` | Automated behavior and infrastructure checks; . |
| `tests/fixtures/prompt-import/home/.claude/projects/` | Automated behavior and infrastructure checks; projects. |
| `tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/` | Automated behavior and infrastructure checks;  work alpha. |
| `tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/11111111-aaaa-bbbb-cccc-000000000001/` | Automated behavior and infrastructure checks; 11111111 aaaa bbbb cccc 000000000001. |
| `tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/11111111-aaaa-bbbb-cccc-000000000001/subagents/` | Automated behavior and infrastructure checks; subagents. |
| `tests/fixtures/prompt-import/home/.codex/` | Automated behavior and infrastructure checks; . |
| `tests/fixtures/prompt-import/home/.codex/sessions/` | Automated behavior and infrastructure checks; sessions. |
| `tests/fixtures/prompt-import/home/.codex/sessions/2026/` | Automated behavior and infrastructure checks; 2026. |
| `tests/fixtures/prompt-import/home/.codex/sessions/2026/10/` | Automated behavior and infrastructure checks; 10. |
| `tests/fixtures/prompt-import/home/.codex/sessions/2026/10/02/` | Automated behavior and infrastructure checks; 02. |
| `tests/fixtures/prompt-import/home/.gemini/` | Automated behavior and infrastructure checks; . |
| `tests/fixtures/prompt-import/home/.gemini/antigravity-cli/` | Automated behavior and infrastructure checks; antigravity cli. |
| `tests/fixtures/prompt-import/home/.gemini/tmp/` | Automated behavior and infrastructure checks; tmp. |
| `tests/fixtures/prompt-import/home/.gemini/tmp/gamma/` | Automated behavior and infrastructure checks; gamma. |
| `tests/fixtures/prompt-import/home/.gemini/tmp/gamma/chats/` | Automated behavior and infrastructure checks; chats. |
| `tests/fixtures/prompt-import/home/.local/` | Automated behavior and infrastructure checks; . |
| `tests/fixtures/prompt-import/home/.local/share/` | Automated behavior and infrastructure checks; share. |
| `tests/fixtures/prompt-import/home/.local/share/opencode/` | Automated behavior and infrastructure checks; opencode. |
| `tests/fixtures/windsurf/` | Automated behavior and infrastructure checks; windsurf. |
| `tests/fixtures/worker/` | Automated behavior and infrastructure checks; worker. |
| `tests/helpers/` | Automated behavior and infrastructure checks; helpers. |
| `tests/hooks/` | Automated behavior and infrastructure checks; hooks. |
| `tests/infrastructure/` | Automated behavior and infrastructure checks; infrastructure. |
| `tests/integration/` | Automated behavior and infrastructure checks; integration. |
| `tests/integration/fixtures/` | Automated behavior and infrastructure checks; fixtures. |
| `tests/integration/helpers/` | Automated behavior and infrastructure checks; helpers. |
| `tests/integrations/` | Automated behavior and infrastructure checks; integrations. |
| `tests/launcher/` | Automated behavior and infrastructure checks; launcher. |
| `tests/memory/` | Automated behavior and infrastructure checks; memory. |
| `tests/npx-cli/` | Automated behavior and infrastructure checks; npx cli. |
| `tests/scripts/` | Automated behavior and infrastructure checks; scripts. |
| `tests/sdk/` | Automated behavior and infrastructure checks; sdk. |
| `tests/security/` | Automated behavior and infrastructure checks; security. |
| `tests/server/` | Automated behavior and infrastructure checks; server. |
| `tests/server/generation/` | Automated behavior and infrastructure checks; generation. |
| `tests/server/jobs/` | Automated behavior and infrastructure checks; jobs. |
| `tests/server/mcp/` | Automated behavior and infrastructure checks; mcp. |
| `tests/server/middleware/` | Automated behavior and infrastructure checks; middleware. |
| `tests/server/runtime/` | Automated behavior and infrastructure checks; runtime. |
| `tests/servers/` | Automated behavior and infrastructure checks; servers. |
| `tests/services/` | Automated behavior and infrastructure checks; services. |
| `tests/services/agent-runner/` | Automated behavior and infrastructure checks; agent runner. |
| `tests/services/hooks/` | Automated behavior and infrastructure checks; hooks. |
| `tests/services/infrastructure/` | Automated behavior and infrastructure checks; infrastructure. |
| `tests/services/integrations/` | Automated behavior and infrastructure checks; integrations. |
| `tests/services/prompt-import/` | Automated behavior and infrastructure checks; prompt import. |
| `tests/services/queue/` | Automated behavior and infrastructure checks; queue. |
| `tests/services/setup/` | Automated behavior and infrastructure checks; setup. |
| `tests/services/smart-file-read/` | Automated behavior and infrastructure checks; smart file read. |
| `tests/services/sqlite/` | Automated behavior and infrastructure checks; sqlite. |
| `tests/services/sync/` | Automated behavior and infrastructure checks; sync. |
| `tests/services/sync/fixtures/` | Automated behavior and infrastructure checks; fixtures. |
| `tests/services/transcripts/` | Automated behavior and infrastructure checks; transcripts. |
| `tests/services/vector/` | Automated behavior and infrastructure checks; vector. |
| `tests/services/worker/` | Automated behavior and infrastructure checks; worker. |
| `tests/services/worker/session/` | Automated behavior and infrastructure checks; session. |
| `tests/shared/` | Automated behavior and infrastructure checks; shared. |
| `tests/sqlite/` | Automated behavior and infrastructure checks; sqlite. |
| `tests/storage/` | Automated behavior and infrastructure checks; storage. |
| `tests/storage/postgres/` | Automated behavior and infrastructure checks; postgres. |
| `tests/storage/sqlite/` | Automated behavior and infrastructure checks; sqlite. |
| `tests/supervisor/` | Automated behavior and infrastructure checks; supervisor. |
| `tests/telemetry/` | Automated behavior and infrastructure checks; telemetry. |
| `tests/transcripts/` | Automated behavior and infrastructure checks; transcripts. |
| `tests/ui/` | UI component and native-browser behavior checks; ui. |
| `tests/ui/my-work/` | UI component and native-browser behavior checks; my work. |
| `tests/ui/viewer/` | UI component and native-browser behavior checks; viewer. |
| `tests/utils/` | Automated behavior and infrastructure checks; utils. |
| `tests/viewer/` | Automated behavior and infrastructure checks; viewer. |
| `tests/work-view/` | Automated behavior and infrastructure checks; work view. |
| `tests/worker/` | Automated behavior and infrastructure checks; worker. |
| `tests/worker/agents/` | Automated behavior and infrastructure checks; agents. |
| `tests/worker/http/` | Automated behavior and infrastructure checks; http. |
| `tests/worker/http/routes/` | Automated behavior and infrastructure checks; routes. |
| `tests/worker/knowledge/` | Automated behavior and infrastructure checks; knowledge. |
| `tests/worker/middleware/` | Automated behavior and infrastructure checks; middleware. |
| `tests/worker/search/` | Automated behavior and infrastructure checks; search. |
| `tests/worker/search/strategies/` | Automated behavior and infrastructure checks; strategies. |
| `tests/worker/sync/` | Automated behavior and infrastructure checks; sync. |
| `tests/worker/work-view/` | Automated behavior and infrastructure checks; work view. |
| `workers/` | Inherited hosted sync worker package; workers. |
| `workers/sync-hub/` | Cloudflare sync-hub runtime and tests; sync hub. |
| `workers/sync-hub/canary/` | Cloudflare sync-hub runtime and tests; canary. |
| `workers/sync-hub/src/` | Cloudflare sync-hub runtime and tests; src. |
| `workers/sync-hub/src/do/` | Cloudflare sync-hub runtime and tests; do. |
| `workers/sync-hub/test/` | Cloudflare sync-hub runtime and tests; test. |

## Repository root

Root-level configuration and project documentation..

| File | Responsibility |
| --- | --- |
| [.dockerignore](../.dockerignore) | Supporting file: . |
| [.gitattributes](../.gitattributes) | Supporting file: . |
| [.gitignore](../.gitignore) | Supporting file: . |
| [.markdownlint.json](../.markdownlint.json) | Configuration or structured data: .markdownlint. |
| [.npmignore](../.npmignore) | Supporting file: . |
| [.npmrc](../.npmrc) | Supporting file: . |
| [.translation-cache.json](../.translation-cache.json) | Configuration or structured data: .translation cache. |
| [AGENTS.md](../AGENTS.md) | Documentation: Agent instructions. |
| [CHANGELOG.md](../CHANGELOG.md) | Documentation: Changelog. |
| [CLAUDE.md](../CLAUDE.md) | Documentation: Claude-Mem: AI Development Instructions. |
| [Dockerfile.test-installer](../Dockerfile.test-installer) | Container image build definition. |
| [LICENSE](../LICENSE) | License, copyright or retained attribution notice. |
| [MARIAN.md](../MARIAN.md) | Documentation: Marian patch history. |
| [NOTICE](../NOTICE) | License, copyright or retained attribution notice. |
| [README.md](../README.md) | Documentation: Marian. |
| [RECEIPT-JOIN.md](../RECEIPT-JOIN.md) | Documentation: RECEIPT-JOIN — tool_uses ↔ expense tallies. |
| [REPOSITORY-GUIDE.md](../REPOSITORY-GUIDE.md) | Documentation: Marian repository guide. |
| [bunfig.toml](../bunfig.toml) | Configuration or structured data: bunfig. |
| [docker-compose.e2e.yml](../docker-compose.e2e.yml) | Configuration or structured data: docker compose.e2e. |
| [docker-compose.yml](../docker-compose.yml) | Configuration or structured data: docker compose. |
| [package.json](../package.json) | Package metadata, dependencies and scripts for claude-mem. |
| [posthog-self-driving-report.md](../posthog-self-driving-report.md) | Documentation: PostHog Self-driving Setup Report. |
| [transcript-watch.example.json](../transcript-watch.example.json) | Configuration or structured data: transcript watch.example. |
| [tsconfig.json](../tsconfig.json) | Configuration or structured data: tsconfig. |

## .agent-jobs/

Historical automated issue and pull-request job reports.

| File | Responsibility |
| --- | --- |
| [.gitignore](../.agent-jobs/.gitignore) | Supporting file: . |
| [cluster-map.md](../.agent-jobs/cluster-map.md) | Documentation: claude-mem plan masters (route every open PR to exactly one). |
| [merge-singles.prompt.txt](../.agent-jobs/merge-singles.prompt.txt) | Supporting file: merge singles.prompt. |
| [oh-my-issues.report.md](../.agent-jobs/oh-my-issues.report.md) | Documentation: oh-my-issues run — thedotmack/claude-mem, 2026-09-12. |

## .agent-jobs/pr-results/

Historical automated issue and pull-request job reports.

| File | Responsibility |
| --- | --- |
| [batch-00.md](../.agent-jobs/pr-results/batch-00.md) | Documentation: Batch 00 — 29 PRs routed, 1 closed. |
| [batch-01.md](../.agent-jobs/pr-results/batch-01.md) | Documentation: Batch 01 — 29 PRs routed, 2 closed. |
| [batch-02.md](../.agent-jobs/pr-results/batch-02.md) | Documentation: Batch 02 — 29 PRs routed, 0 closed. |
| [batch-03.md](../.agent-jobs/pr-results/batch-03.md) | Documentation: Batch 03 — 29 PRs routed, 3 closed. |
| [batch-04.md](../.agent-jobs/pr-results/batch-04.md) | Documentation: Batch 04 — 29 PRs routed, 2 closed. |
| [batch-05.md](../.agent-jobs/pr-results/batch-05.md) | Documentation: Batch 05 — 27 PRs routed, 3 closed. |

## .agents/plugins/

Agent marketplace discovery.

| File | Responsibility |
| --- | --- |
| [marketplace.json](../.agents/plugins/marketplace.json) | Configuration or structured data: marketplace. |

## .claude/

Repository Claude development commands and records.

| File | Responsibility |
| --- | --- |
| [settings.json](../.claude/settings.json) | Configuration or structured data: settings. |

## .claude-plugin/

Claude marketplace/plugin manifests.

| File | Responsibility |
| --- | --- |
| [marketplace.json](../.claude-plugin/marketplace.json) | Configuration or structured data: marketplace. |
| [plugin.json](../.claude-plugin/plugin.json) | Configuration or structured data: plugin. |

## .claude/commands/

Repository Claude development commands and records.

| File | Responsibility |
| --- | --- |
| [anti-pattern-czar.md](../.claude/commands/anti-pattern-czar.md) | Documentation: Anti-Pattern Czar. |

## .claude/plans/

Repository Claude development commands and records.

| File | Responsibility |
| --- | --- |
| [animated-installer.md](../.claude/plans/animated-installer.md) | Documentation: Comprehensive Claude-Mem Installer with @clack/prompts. |

## .claude/reports/

Repository Claude development commands and records.

| File | Responsibility |
| --- | --- |
| [test-audit-2026-01-05.md](../.claude/reports/test-audit-2026-01-05.md) | Documentation: Test Quality Audit Report. |

## .codex-plugin/

Codex plugin manifest.

| File | Responsibility |
| --- | --- |
| [plugin.json](../.codex-plugin/plugin.json) | Configuration or structured data: plugin. |

## .github/

GitHub automation and issue intake.

| File | Responsibility |
| --- | --- |
| [FUNDING.yml](../.github/FUNDING.yml) | Configuration or structured data: FUNDING. |
| [copilot-instructions.md](../.github/copilot-instructions.md) | Documentation: claude-mem: Cross-Session Memory. |

## .github/ISSUE_TEMPLATE/

GitHub automation and issue intake.

| File | Responsibility |
| --- | --- |
| [bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md) | Documentation: Before submitting. |
| [feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md) | Documentation: Before submitting. |

## .github/workflows/

GitHub automation and issue intake.

| File | Responsibility |
| --- | --- |
| [ci.yml](../.github/workflows/ci.yml) | Configuration or structured data: ci. |
| [claude.yml](../.github/workflows/claude.yml) | Configuration or structured data: claude. |
| [close-tracked-issues.yml](../.github/workflows/close-tracked-issues.yml) | Configuration or structured data: close tracked issues. |
| [convert-feature-requests.yml](../.github/workflows/convert-feature-requests.yml) | Configuration or structured data: convert feature requests. |
| [deploy-install-scripts.yml](../.github/workflows/deploy-install-scripts.yml) | Configuration or structured data: deploy install scripts. |
| [npm-publish.yml](../.github/workflows/npm-publish.yml) | Configuration or structured data: npm publish. |
| [summary.yml](../.github/workflows/summary.yml) | Configuration or structured data: summary. |
| [windows.yml](../.github/workflows/windows.yml) | Configuration or structured data: windows. |

## .maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [DUPLICATE-CLOSURE-COMMENTS.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/DUPLICATE-CLOSURE-COMMENTS.md) | Documentation: Duplicate Issue Closure Comments. |
| [TRIAGE-01-ChromaDB-Core-Fixes.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-01-ChromaDB-Core-Fixes.md) | Documentation: Phase 01: ChromaDB Core Fixes — The #1 Issue Cluster (~25 issues). |
| [TRIAGE-02-MCP-Type-Coercion.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-02-MCP-Type-Coercion.md) | Documentation: Phase 02: MCP Type Coercion — Fix get_observations and Search Serialization. |
| [TRIAGE-03-Data-Integrity-Deduplication.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-03-Data-Integrity-Deduplication.md) | Documentation: Phase 03: Data Integrity — Deduplication and Project Name Collision. |
| [TRIAGE-04-Hook-Lifecycle-Fixes.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-04-Hook-Lifecycle-Fixes.md) | Documentation: Phase 04: Hook Lifecycle — Stop Hook Loop and Output Isolation. |
| [TRIAGE-05-Worker-Lifecycle-Simplified.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-05-Worker-Lifecycle-Simplified.md) | Documentation: Phase 05: Worker Lifecycle — Fix Restart Loops and Subprocess Cleanup. |
| [TRIAGE-06-Windows-Platform-Support.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-06-Windows-Platform-Support.md) | Documentation: Phase 06: Windows Platform Support — Fixing Core Platform Bugs. |
| [TRIAGE-07-Installation-Distribution.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-07-Installation-Distribution.md) | Documentation: Phase 07: Installation & Distribution — Fixing the Getting-Started Experience. |
| [TRIAGE-08-Third-Party-Compatibility.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-08-Third-Party-Compatibility.md) | Documentation: Phase 08: Third-Party Compatibility & UX — Ecosystem Support. |
| [TRIAGE-09-Minor-Fixes-And-Cleanup.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-09-Minor-Fixes-And-Cleanup.md) | Documentation: Phase 09: Minor Fixes — Localhost Security, Plugin State, and Remaining Items. |
| [TRIAGE-10-Issue-Housekeeping.md](../.maestro/playbooks/2026-02-23-Issue-Triage/2026-02-23-Root-Cause-Fixes/TRIAGE-10-Issue-Housekeeping.md) | Documentation: Phase 10: Issue Housekeeping — Close Duplicates and Verify. |

## .maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [BRANCH-MEMORY-01.md](../.maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/BRANCH-MEMORY-01.md) | Documentation: Phase 01: Schema, Types, Branch Detection, and Write Path. |
| [BRANCH-MEMORY-02.md](../.maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/BRANCH-MEMORY-02.md) | Documentation: Phase 02: Ancestor Resolution — Git Merge-Base Utility. |
| [BRANCH-MEMORY-03.md](../.maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/BRANCH-MEMORY-03.md) | Documentation: Phase 03: SessionStart Context Filtering. |
| [BRANCH-MEMORY-04.md](../.maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/BRANCH-MEMORY-04.md) | Documentation: Phase 04: MCP Search Branch Filtering. |
| [BRANCH-MEMORY-05.md](../.maestro/playbooks/2026-02-25-CM-Issues-PRs/2026-02-25-Branch-Memory/BRANCH-MEMORY-05.md) | Documentation: Phase 05: Edge Cases, Performance, and Integration Tests. |

## .maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [TRIAGE-01-PR-Review-And-Merge.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-01-PR-Review-And-Merge.md) | Documentation: Phase 01: PR Review, Merge & Duplicate Closure. |
| [TRIAGE-02-Process-Resource-Stability.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-02-Process-Resource-Stability.md) | Documentation: Phase 02: Critical — Process & Resource Stability. |
| [TRIAGE-02-Spinning-Logo-Fix.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-02-Spinning-Logo-Fix.md) | Documentation: TRIAGE-02: Spinning Logo Root Cause & Fix Plan. |
| [TRIAGE-03-Stop-Hook-Session-Lifecycle.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-03-Stop-Hook-Session-Lifecycle.md) | Documentation: Phase 03: Critical — Stop Hook & Session Lifecycle. |
| [TRIAGE-04-Worker-Service-Reliability.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-04-Worker-Service-Reliability.md) | Documentation: Phase 04: High — Worker Service Reliability. |
| [TRIAGE-05-Security-Fixes.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-05-Security-Fixes.md) | Documentation: Phase 05: High — Security Fixes. |
| [TRIAGE-06-Cross-Platform-Fixes.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-06-Cross-Platform-Fixes.md) | Documentation: Phase 06: Medium — Cross-Platform Fixes (Windows & macOS). |
| [TRIAGE-07-Search-Chroma-Stability.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-07-Search-Chroma-Stability.md) | Documentation: Phase 07: Medium — Search & Chroma Stability. |
| [TRIAGE-08-UI-UX-DX.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-08-UI-UX-DX.md) | Documentation: Phase 08: Medium — UI/UX & Developer Experience. |
| [TRIAGE-09-Quality-Maintenance.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-09-Quality-Maintenance.md) | Documentation: Phase 09: Low — Quality & Maintenance. |
| [TRIAGE-10-Feature-Backlog.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/TRIAGE-10-Feature-Backlog.md) | Documentation: Phase 10: Features — Backlog Prioritization & Triage. |

## .maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/Working/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [phase-01-triage-report.md](../.maestro/playbooks/2026-03-12-CM-Issues-PRs/2026-03-12-Issues-PRs-Triage/Working/phase-01-triage-report.md) | Documentation: Phase 01: PR Triage Report. |

## .maestro/playbooks/2026-03-15-Branch-Memory/2026-03-15-Branch-Parity/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [BRANCH-PARITY-01-Chroma-Branch-Sync.md](../.maestro/playbooks/2026-03-15-Branch-Memory/2026-03-15-Branch-Parity/BRANCH-PARITY-01-Chroma-Branch-Sync.md) | Documentation: Phase 01: Merge Main and Implement Chroma Branch-Aware Vector Sync. |
| [BRANCH-PARITY-02-Viewer-Branch-Display.md](../.maestro/playbooks/2026-03-15-Branch-Memory/2026-03-15-Branch-Parity/BRANCH-PARITY-02-Viewer-Branch-Display.md) | Documentation: Phase 02: Viewer UI Branch Metadata Display. |
| [BRANCH-PARITY-03-MCP-Output-And-Verification.md](../.maestro/playbooks/2026-03-15-Branch-Memory/2026-03-15-Branch-Parity/BRANCH-PARITY-03-MCP-Output-And-Verification.md) | Documentation: Phase 03: MCP Search Output Metadata and End-to-End Verification. |

## .maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [Phase-01-Close-Duplicates-And-Stale-Issues.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-01-Close-Duplicates-And-Stale-Issues.md) | Documentation: Phase 01: Close Duplicates & Stale Issues. |
| [Phase-02-Fix-Dirname-And-Worker-Startup.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-02-Fix-Dirname-And-Worker-Startup.md) | Documentation: Phase 02: Fix __dirname & Worker Startup Reliability. |
| [Phase-03-Windows-Platform-Hardening.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-03-Windows-Platform-Hardening.md) | Documentation: Phase 03: Windows Platform Hardening. |
| [Phase-04-ChromaDB-Subprocess-Lifecycle.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-04-ChromaDB-Subprocess-Lifecycle.md) | Documentation: Phase 04: ChromaDB Subprocess Lifecycle. |
| [Phase-05-Project-Scoping-And-Session-Integrity.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-05-Project-Scoping-And-Session-Integrity.md) | Documentation: Phase 05: Project Scoping & Session Integrity. |
| [Phase-06-Security-Fixes.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-06-Security-Fixes.md) | Documentation: Phase 06: Security Fixes. |
| [Phase-07-Installer-MCP-And-Remaining-Fixes.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Phase-07-Installer-MCP-And-Remaining-Fixes.md) | Documentation: Phase 07: Installer, MCP Schema & Remaining Fixes. |

## .maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Working/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [triage-report.md](../.maestro/playbooks/2026-03-29-Issues-Triage-3-29-2026/Working/triage-report.md) | Documentation: Issues Triage Report — 2026-03-29. |

## .maestro/playbooks/Wizard-2026-02-22-2/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [Phase-01-Toast-Notification-Service.md](../.maestro/playbooks/Wizard-2026-02-22-2/Phase-01-Toast-Notification-Service.md) | Documentation: Phase 01: Toast Notification Service — Foundation + Working Feature. |
| [Phase-02-Toast-Notification-Tests.md](../.maestro/playbooks/Wizard-2026-02-22-2/Phase-02-Toast-Notification-Tests.md) | Documentation: Phase 02: Toast Notification Tests. |

## .maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/

Historical triage and investigation playbooks.

| File | Responsibility |
| --- | --- |
| [LOCOMO-EVAL-01.md](../.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/LOCOMO-EVAL-01.md) | Documentation: Phase 01: Foundation & Ingestion Prototype. |
| [LOCOMO-EVAL-02.md](../.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/LOCOMO-EVAL-02.md) | Documentation: Phase 02: Full Dataset Ingestion. |
| [LOCOMO-EVAL-03.md](../.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/LOCOMO-EVAL-03.md) | Documentation: Phase 03: QA Answer Pipeline. |
| [LOCOMO-EVAL-04.md](../.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/LOCOMO-EVAL-04.md) | Documentation: Phase 04: Dual Scoring Engine (F1 + LLM-as-a-Judge). |
| [LOCOMO-EVAL-05.md](../.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/LOCOMO-EVAL-05.md) | Documentation: Phase 05: Full Eval Runner. |
| [LOCOMO-EVAL-06.md](../.maestro/playbooks/Wizard-2026-02-22/2026-02-22-LoCoMo-Eval/LOCOMO-EVAL-06.md) | Documentation: Phase 06: Results Analysis & Publication. |

## .plan/

Implementation planning records.

| File | Responsibility |
| --- | --- |
| [issue-2341-reliability-slice.md](../.plan/issue-2341-reliability-slice.md) | Documentation: Issue 2341 Reliability Slice Plan. |
| [npx-distribution.md](../.plan/npx-distribution.md) | Documentation: Plan: NPX Distribution + Universal IDE/CLI Coverage for claude-mem. |
| [subagent-summary-disable-and-labeling.md](../.plan/subagent-summary-disable-and-labeling.md) | Documentation: Plan: Disable Summaries for Subagents + Label Subagent Observations. |
| [worktree-adoption.md](../.plan/worktree-adoption.md) | Documentation: Merged-Worktree Adoption. |

## cowork/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [PRO-ENDPOINT-SPEC.md](../cowork/PRO-ENDPOINT-SPEC.md) | Documentation: claude-mem-pro: Cowork hook endpoints — drop-in spec. |
| [README.md](../cowork/README.md) | Documentation: claude-mem-cowork. |
| [config.json](../cowork/config.json) | Configuration or structured data: config. |

## cowork/.claude-plugin/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [plugin.json](../cowork/.claude-plugin/plugin.json) | Configuration or structured data: plugin. |

## cowork/hooks/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [hooks.json](../cowork/hooks/hooks.json) | Configuration or structured data: hooks. |

## cowork/scripts/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [cmem-hook.mjs](../cowork/scripts/cmem-hook.mjs) | Code module: cmem hook. |

## cowork/skills/agent-cost-report/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [.gitignore](../cowork/skills/agent-cost-report/.gitignore) | Supporting file: . |
| [CHECKSUMS.txt](../cowork/skills/agent-cost-report/CHECKSUMS.txt) | Supporting file: CHECKSUMS. |
| [SKILL.md](../cowork/skills/agent-cost-report/SKILL.md) | Agent skill procedure: agent-cost-report. |

## cowork/skills/agent-cost-report/scripts/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [acr.py](../cowork/skills/agent-cost-report/scripts/acr.py) | Python helper: acr. |

## cowork/skills/agent-cost-report/scripts/acr/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [__init__.py](../cowork/skills/agent-cost-report/scripts/acr/__init__.py) | Python helper:   init  . |
| [behavior.py](../cowork/skills/agent-cost-report/scripts/acr/behavior.py) | Python helper: behavior. |
| [classify.py](../cowork/skills/agent-cost-report/scripts/acr/classify.py) | Python helper: classify. |
| [costs.py](../cowork/skills/agent-cost-report/scripts/acr/costs.py) | Python helper: costs. |
| [devices.py](../cowork/skills/agent-cost-report/scripts/acr/devices.py) | Python helper: devices. |
| [evidence.py](../cowork/skills/agent-cost-report/scripts/acr/evidence.py) | Python helper: evidence. |
| [labels.py](../cowork/skills/agent-cost-report/scripts/acr/labels.py) | Python helper: labels. |
| [measure.py](../cowork/skills/agent-cost-report/scripts/acr/measure.py) | Python helper: measure. |
| [mistakes.py](../cowork/skills/agent-cost-report/scripts/acr/mistakes.py) | Python helper: mistakes. |
| [patterns.py](../cowork/skills/agent-cost-report/scripts/acr/patterns.py) | Python helper: patterns. |
| [period.py](../cowork/skills/agent-cost-report/scripts/acr/period.py) | Python helper: period. |
| [prices.py](../cowork/skills/agent-cost-report/scripts/acr/prices.py) | Python helper: prices. |
| [render.py](../cowork/skills/agent-cost-report/scripts/acr/render.py) | Python helper: render. |
| [rollup.py](../cowork/skills/agent-cost-report/scripts/acr/rollup.py) | Python helper: rollup. |
| [rules.json](../cowork/skills/agent-cost-report/scripts/acr/rules.json) | Configuration or structured data: rules. |
| [rules.py](../cowork/skills/agent-cost-report/scripts/acr/rules.py) | Python helper: rules. |
| [sample.py](../cowork/skills/agent-cost-report/scripts/acr/sample.py) | Python helper: sample. |
| [snapshot.py](../cowork/skills/agent-cost-report/scripts/acr/snapshot.py) | Python helper: snapshot. |
| [sync.py](../cowork/skills/agent-cost-report/scripts/acr/sync.py) | Python helper: sync. |
| [transcripts.py](../cowork/skills/agent-cost-report/scripts/acr/transcripts.py) | Python helper: transcripts. |
| [wins.py](../cowork/skills/agent-cost-report/scripts/acr/wins.py) | Python helper: wins. |

## cowork/skills/agent-cost-report/scripts/tests/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [_db.py](../cowork/skills/agent-cost-report/scripts/tests/_db.py) | Python helper:  db. |
| [_paths.py](../cowork/skills/agent-cost-report/scripts/tests/_paths.py) | Python helper:  paths. |
| [test_behavior.py](../cowork/skills/agent-cost-report/scripts/tests/test_behavior.py) | Behavior checks for test behavior. |
| [test_devices.py](../cowork/skills/agent-cost-report/scripts/tests/test_devices.py) | Behavior checks for test devices. |
| [test_labels.py](../cowork/skills/agent-cost-report/scripts/tests/test_labels.py) | Behavior checks for test labels. |
| [test_measure.py](../cowork/skills/agent-cost-report/scripts/tests/test_measure.py) | Behavior checks for test measure. |
| [test_pdf_windows.py](../cowork/skills/agent-cost-report/scripts/tests/test_pdf_windows.py) | Behavior checks for test pdf windows. |
| [test_period.py](../cowork/skills/agent-cost-report/scripts/tests/test_period.py) | Behavior checks for test period. |
| [test_prices.py](../cowork/skills/agent-cost-report/scripts/tests/test_prices.py) | Behavior checks for test prices. |
| [test_render.py](../cowork/skills/agent-cost-report/scripts/tests/test_render.py) | Behavior checks for test render. |
| [test_render_encoding.py](../cowork/skills/agent-cost-report/scripts/tests/test_render_encoding.py) | Behavior checks for test render encoding. |
| [test_rollup.py](../cowork/skills/agent-cost-report/scripts/tests/test_rollup.py) | Behavior checks for test rollup. |
| [test_snapshot.py](../cowork/skills/agent-cost-report/scripts/tests/test_snapshot.py) | Behavior checks for test snapshot. |
| [test_sync.py](../cowork/skills/agent-cost-report/scripts/tests/test_sync.py) | Behavior checks for test sync. |
| [test_transcript_encoding.py](../cowork/skills/agent-cost-report/scripts/tests/test_transcript_encoding.py) | Behavior checks for test transcript encoding. |
| [test_transcripts.py](../cowork/skills/agent-cost-report/scripts/tests/test_transcripts.py) | Behavior checks for test transcripts. |
| [test_wins.py](../cowork/skills/agent-cost-report/scripts/tests/test_wins.py) | Behavior checks for test wins. |

## cowork/skills/agent-cost-report/scripts/tests/fixtures/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [make_report_fixtures.py](../cowork/skills/agent-cost-report/scripts/tests/fixtures/make_report_fixtures.py) | Python helper: make report fixtures. |
| [prices_sample.json](../cowork/skills/agent-cost-report/scripts/tests/fixtures/prices_sample.json) | Configuration or structured data: prices sample. |
| [report-1day.json](../cowork/skills/agent-cost-report/scripts/tests/fixtures/report-1day.json) | Configuration or structured data: report 1day. |
| [report-30day.json](../cowork/skills/agent-cost-report/scripts/tests/fixtures/report-30day.json) | Configuration or structured data: report 30day. |
| [report-7day.json](../cowork/skills/agent-cost-report/scripts/tests/fixtures/report-7day.json) | Configuration or structured data: report 7day. |
| [report-empty.json](../cowork/skills/agent-cost-report/scripts/tests/fixtures/report-empty.json) | Configuration or structured data: report empty. |
| [report-session.json](../cowork/skills/agent-cost-report/scripts/tests/fixtures/report-session.json) | Configuration or structured data: report session. |

## cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/18/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [rollout-codex-1.jsonl](../cowork/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/18/rollout-codex-1.jsonl) | Supporting file: rollout codex 1. |

## cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-a/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [sess-aaaa.jsonl](../cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-a/sess-aaaa.jsonl) | Supporting file: sess aaaa. |

## cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-b/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [sess-bbbb.jsonl](../cowork/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-b/sess-bbbb.jsonl) | Supporting file: sess bbbb. |

## cowork/skills/mem-search/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../cowork/skills/mem-search/SKILL.md) | Agent skill procedure: mem-search. |

## cowork/skills/mem-setup/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../cowork/skills/mem-setup/SKILL.md) | Agent skill procedure: mem-setup. |

## cowork/test/

Claude Cowork plugin and its bundled tools.

| File | Responsibility |
| --- | --- |
| [local-injector.test.mjs](../cowork/test/local-injector.test.mjs) | Behavior checks for local injector test mjs. |
| [run-tests.mjs](../cowork/test/run-tests.mjs) | Code module: run tests. |

## docker/claude-mem/

Container deployment and end-to-end test assets.

| File | Responsibility |
| --- | --- |
| [Dockerfile](../docker/claude-mem/Dockerfile) | Container image build definition. |
| [README.md](../docker/claude-mem/README.md) | Documentation: claude-mem Docker harness. |
| [build.sh](../docker/claude-mem/build.sh) | Shell automation: build. |
| [entrypoint.sh](../docker/claude-mem/entrypoint.sh) | Shell automation: entrypoint. |
| [run.sh](../docker/claude-mem/run.sh) | Shell automation: run. |

## docker/e2e/

Container deployment and end-to-end test assets.

| File | Responsibility |
| --- | --- |
| [server-e2e.mjs](../docker/e2e/server-e2e.mjs) | Code module: server e2e. |

## docker/postgres/

Container deployment and end-to-end test assets.

| File | Responsibility |
| --- | --- |
| [Dockerfile](../docker/postgres/Dockerfile) | Container image build definition. |
| [reindex-collation.sh](../docker/postgres/reindex-collation.sh) | Shell automation: reindex collation. |

## docs/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [SESSION_ID_ARCHITECTURE.md](../docs/SESSION_ID_ARCHITECTURE.md) | Documentation: Session ID Architecture. |
| [adapters.md](../docs/adapters.md) | Documentation: Adapters. |
| [anti-pattern-cleanup-plan.md](../docs/anti-pattern-cleanup-plan.md) | Documentation: Error Handling Anti-Pattern Cleanup Plan. |
| [api.md](../docs/api.md) | Documentation: Server API. |
| [architecture-overview.md](../docs/architecture-overview.md) | Documentation: claude-mem Architecture Overview. |
| [codex-provider.md](../docs/codex-provider.md) | Documentation: Codex Subscription Provider. |
| [docker.md](../docs/docker.md) | Documentation: Docker. |
| [ip-boundary.md](../docs/ip-boundary.md) | Documentation: IP Boundary. |
| [license.md](../docs/license.md) | Documentation: License. |
| [merge-rubric.md](../docs/merge-rubric.md) | Documentation: The Merge Rubric. |
| [migration-worker-to-server.md](../docs/migration-worker-to-server.md) | Documentation: Worker To Server Migration. |
| [native-harness-integrations.md](../docs/native-harness-integrations.md) | Documentation: Native harness integrations. |
| [native-memory-bridge.md](../docs/native-memory-bridge.md) | Documentation: Native memory lookup and note bridge. |
| [native-prompt-identity.md](../docs/native-prompt-identity.md) | Documentation: Native prompt identity at worker init. |
| [pi-native-capture.md](../docs/pi-native-capture.md) | Documentation: Pi native prompt capture. |
| [production-guide.md](../docs/production-guide.md) | Documentation: claude-mem Production Guide. |
| [remote-worker-capture.md](../docs/remote-worker-capture.md) | Documentation: Remote worker capture. |
| [repository-files.md](../docs/repository-files.md) | This complete file-and-directory inventory. |
| [security.md](../docs/security.md) | Documentation: Security. |
| [server-architecture-and-team-vision.md](../docs/server-architecture-and-team-vision.md) | Documentation: Server-Beta: Architecture, Team Vision, and the "It Just Works" Future. |
| [server-parity-map.md](../docs/server-parity-map.md) | Documentation: Server Beta Parity Map. |
| [server-release-readiness.md](../docs/server-release-readiness.md) | Documentation: Server Beta — Release Readiness Report. |
| [server-storage-boundary.md](../docs/server-storage-boundary.md) | Documentation: Server Storage Boundary. |
| [server.md](../docs/server.md) | Documentation: Claude-Mem Server (Beta). |

## docs/adr/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [2026-10-12-api-key-list-string-admission.md](../docs/adr/2026-10-12-api-key-list-string-admission.md) | Documentation: Admit only strings in API key arrays. |
| [2026-10-12-billing-bom-json.md](../docs/adr/2026-10-12-billing-bom-json.md) | Documentation: Read BOM-prefixed observed billing JSON. |
| [2026-10-12-connection-refused-nested-text.md](../docs/adr/2026-10-12-connection-refused-nested-text.md) | Documentation: Recognize nested message-only refused connections. |
| [2026-10-12-gemini-answer-part-shape.md](../docs/adr/2026-10-12-gemini-answer-part-shape.md) | Documentation: Isolate malformed Gemini answer parts. |
| [2026-10-12-gemini-duration-finite.md](../docs/adr/2026-10-12-gemini-duration-finite.md) | Documentation: Reject unrepresentable Gemini retry durations. |
| [2026-10-12-integration-own-aliases.md](../docs/adr/2026-10-12-integration-own-aliases.md) | Documentation: Resolve only declared integration aliases. |
| [2026-10-12-postgres-canonical-property-identity.md](../docs/adr/2026-10-12-postgres-canonical-property-identity.md) | Documentation: Preserve every JSON property in Postgres deterministic keys. |
| [2026-10-12-postgres-integer-settings.md](../docs/adr/2026-10-12-postgres-integer-settings.md) | Documentation: Admit whole safe Postgres integer settings. |
| [2026-10-12-tool-hook-early-environment-optout.md](../docs/adr/2026-10-12-tool-hook-early-environment-optout.md) | Documentation: Honor tool-hook environment opt-outs before loading the runtime. |

## docs/assets/merge-clinic/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [slide-01.jpg](../docs/assets/merge-clinic/slide-01.jpg) | Image/icon asset: slide 01. |
| [slide-02.jpg](../docs/assets/merge-clinic/slide-02.jpg) | Image/icon asset: slide 02. |
| [slide-03.jpg](../docs/assets/merge-clinic/slide-03.jpg) | Image/icon asset: slide 03. |
| [slide-04.jpg](../docs/assets/merge-clinic/slide-04.jpg) | Image/icon asset: slide 04. |
| [slide-05.jpg](../docs/assets/merge-clinic/slide-05.jpg) | Image/icon asset: slide 05. |
| [slide-06.jpg](../docs/assets/merge-clinic/slide-06.jpg) | Image/icon asset: slide 06. |
| [slide-07.jpg](../docs/assets/merge-clinic/slide-07.jpg) | Image/icon asset: slide 07. |
| [slide-08.jpg](../docs/assets/merge-clinic/slide-08.jpg) | Image/icon asset: slide 08. |
| [slide-09.jpg](../docs/assets/merge-clinic/slide-09.jpg) | Image/icon asset: slide 09. |
| [slide-10.jpg](../docs/assets/merge-clinic/slide-10.jpg) | Image/icon asset: slide 10. |
| [slide-11.jpg](../docs/assets/merge-clinic/slide-11.jpg) | Image/icon asset: slide 11. |
| [slide-12.jpg](../docs/assets/merge-clinic/slide-12.jpg) | Image/icon asset: slide 12. |
| [slide-13.jpg](../docs/assets/merge-clinic/slide-13.jpg) | Image/icon asset: slide 13. |
| [slide-14.jpg](../docs/assets/merge-clinic/slide-14.jpg) | Image/icon asset: slide 14. |
| [slide-15.jpg](../docs/assets/merge-clinic/slide-15.jpg) | Image/icon asset: slide 15. |

## docs/bug-fixes/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [windows-spaces-issue.md](../docs/bug-fixes/windows-spaces-issue.md) | Documentation: Bug Report. |

## docs/context/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [agent-sdk-v2-examples.ts](../docs/context/agent-sdk-v2-examples.ts) | Code module: agent sdk v2 examples. |
| [agent-sdk-v2-preview.md](../docs/context/agent-sdk-v2-preview.md) | Documentation: TypeScript SDK V2 interface (preview). |
| [cursor-hooks-reference.md](../docs/context/cursor-hooks-reference.md) | Documentation: Hooks. |

## docs/expense-pricing/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [README.md](../docs/expense-pricing/README.md) | Documentation: OpenRouter list-price history (CMEM expense join). |
| [openrouter-list-prices-daily.csv](../docs/expense-pricing/openrouter-list-prices-daily.csv) | Supporting file: openrouter list prices daily. |
| [openrouter-list-prices-daily.full.csv](../docs/expense-pricing/openrouter-list-prices-daily.full.csv) | Supporting file: openrouter list prices daily.full. |
| [openrouter-list-prices-daily.json](../docs/expense-pricing/openrouter-list-prices-daily.json) | Configuration or structured data: openrouter list prices daily. |
| [popular-models-by-work-day.csv](../docs/expense-pricing/popular-models-by-work-day.csv) | Supporting file: popular models by work day. |
| [popular-models-by-work-day.json](../docs/expense-pricing/popular-models-by-work-day.json) | Configuration or structured data: popular models by work day. |
| [sample-5-popular-models.csv](../docs/expense-pricing/sample-5-popular-models.csv) | Supporting file: sample 5 popular models. |

## docs/i18n/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [.translation-cache.json](../docs/i18n/.translation-cache.json) | Configuration or structured data: .translation cache. |
| [README.ar.md](../docs/i18n/README.ar.md) | Documentation: بداية سريعة. |
| [README.bn.md](../docs/i18n/README.bn.md) | Documentation: Quick Start. |
| [README.cs.md](../docs/i18n/README.cs.md) | Documentation: Rychlý start. |
| [README.da.md](../docs/i18n/README.da.md) | Documentation: Hurtig Start. |
| [README.de.md](../docs/i18n/README.de.md) | Documentation: Schnellstart. |
| [README.el.md](../docs/i18n/README.el.md) | Documentation: Γρήγορη Εκκίνηση. |
| [README.es.md](../docs/i18n/README.es.md) | Documentation: Inicio Rápido. |
| [README.fi.md](../docs/i18n/README.fi.md) | Documentation: Pikaopas. |
| [README.fr.md](../docs/i18n/README.fr.md) | Documentation: Démarrage rapide. |
| [README.he.md](../docs/i18n/README.he.md) | Documentation: התחלה מהירה. |
| [README.hi.md](../docs/i18n/README.hi.md) | Documentation: त्वरित शुरुआत. |
| [README.hu.md](../docs/i18n/README.hu.md) | Documentation: Gyors kezdés. |
| [README.id.md](../docs/i18n/README.id.md) | Documentation: Mulai Cepat. |
| [README.it.md](../docs/i18n/README.it.md) | Documentation: Avvio Rapido. |
| [README.ja.md](../docs/i18n/README.ja.md) | Documentation: クイックスタート. |
| [README.ko.md](../docs/i18n/README.ko.md) | Documentation: 빠른 시작. |
| [README.nl.md](../docs/i18n/README.nl.md) | Documentation: Snel Starten. |
| [README.no.md](../docs/i18n/README.no.md) | Documentation: Hurtigstart. |
| [README.pl.md](../docs/i18n/README.pl.md) | Documentation: Szybki Start. |
| [README.pt-br.md](../docs/i18n/README.pt-br.md) | Documentation: Início Rápido. |
| [README.pt.md](../docs/i18n/README.pt.md) | Documentation: Início Rápido. |
| [README.ro.md](../docs/i18n/README.ro.md) | Documentation: Start Rapid. |
| [README.ru.md](../docs/i18n/README.ru.md) | Documentation: Быстрый старт. |
| [README.sv.md](../docs/i18n/README.sv.md) | Documentation: Snabbstart. |
| [README.th.md](../docs/i18n/README.th.md) | Documentation: เริ่มต้นอย่างรวดเร็ว. |
| [README.tl.md](../docs/i18n/README.tl.md) | Documentation: Mabilis na Pagsisimula. |
| [README.tr.md](../docs/i18n/README.tr.md) | Documentation: Quick Start. |
| [README.uk.md](../docs/i18n/README.uk.md) | Documentation: Швидкий старт. |
| [README.ur.md](../docs/i18n/README.ur.md) | Documentation: تیز رفتار شروعات. |
| [README.vi.md](../docs/i18n/README.vi.md) | Documentation: Bắt Đầu Nhanh. |
| [README.zh-tw.md](../docs/i18n/README.zh-tw.md) | Documentation: 快速開始. |
| [README.zh.md](../docs/i18n/README.zh.md) | Documentation: 快速开始. |

## docs/public/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [architecture-evolution.mdx](../docs/public/architecture-evolution.mdx) | Documentation: Architecture Evolution. |
| [claude-mem-logo-for-dark-mode.webp](../docs/public/claude-mem-logo-for-dark-mode.webp) | Image/icon asset: claude mem logo for dark mode. |
| [claude-mem-logo-for-light-mode.webp](../docs/public/claude-mem-logo-for-light-mode.webp) | Image/icon asset: claude mem logo for light mode. |
| [claude-mem-logomark.webp](../docs/public/claude-mem-logomark.webp) | Image/icon asset: claude mem logomark. |
| [cloud-sync.mdx](../docs/public/cloud-sync.mdx) | Documentation: Cloud Sync (cmem.ai Pro). |
| [cm-preview.gif](../docs/public/cm-preview.gif) | Image/icon asset: cm preview. |
| [cmem-pro-headless.mdx](../docs/public/cmem-pro-headless.mdx) | Documentation: CMEM Pro (manual / headless). |
| [configuration.mdx](../docs/public/configuration.mdx) | Documentation: Configuration. |
| [context-engineering.mdx](../docs/public/context-engineering.mdx) | Documentation: Context Engineering for AI Agents. |
| [development.mdx](../docs/public/development.mdx) | Documentation: Development Guide. |
| [docs.json](../docs/public/docs.json) | Configuration or structured data: docs. |
| [file-read-gate.mdx](../docs/public/file-read-gate.mdx) | Documentation: File Read Gate. |
| [greptile-wordmark-green.svg](../docs/public/greptile-wordmark-green.svg) | Image/icon asset: greptile wordmark green. |
| [hermes-integration.mdx](../docs/public/hermes-integration.mdx) | Documentation: Overview. |
| [hooks-architecture.mdx](../docs/public/hooks-architecture.mdx) | Documentation: How Claude-Mem Uses Hooks: A Lifecycle-Driven Architecture. |
| [hosted-server.mdx](../docs/public/hosted-server.mdx) | Documentation: Hosted Server (Beta). |
| [installation.mdx](../docs/public/installation.mdx) | Documentation: Installation Guide. |
| [introduction.mdx](../docs/public/introduction.mdx) | Documentation: Claude-Mem. |
| [kimi-integration.mdx](../docs/public/kimi-integration.mdx) | Documentation: Overview. |
| [marian-edition-logo.png](../docs/public/marian-edition-logo.png) | Image/icon asset: marian edition logo. |
| [modes.mdx](../docs/public/modes.mdx) | Documentation: Modes & Languages. |
| [notion-export.mdx](../docs/public/notion-export.mdx) | Documentation: Setup. |
| [openclaw-integration.mdx](../docs/public/openclaw-integration.mdx) | Documentation: Overview. |
| [platform-integration.mdx](../docs/public/platform-integration.mdx) | Documentation: Quick Reference. |
| [progressive-disclosure.mdx](../docs/public/progressive-disclosure.mdx) | Documentation: Progressive Disclosure: Claude-Mem's Context Priming Philosophy. |
| [qoder-integration.mdx](../docs/public/qoder-integration.mdx) | Documentation: Install in Qoder CLI. |
| [screenpipe-integration.mdx](../docs/public/screenpipe-integration.mdx) | Documentation: Setup. |
| [serpapi-logo-with-wordmark-gradient.svg](../docs/public/serpapi-logo-with-wordmark-gradient.svg) | Image/icon asset: serpapi logo with wordmark gradient. |
| [smart-explore-benchmark.mdx](../docs/public/smart-explore-benchmark.mdx) | Documentation: Smart Explore Benchmark. |
| [t3code-integration.mdx](../docs/public/t3code-integration.mdx) | Documentation: Install. |
| [telemetry.mdx](../docs/public/telemetry.mdx) | Documentation: Telemetry. |
| [trendshift-badge-dark.svg](../docs/public/trendshift-badge-dark.svg) | Image/icon asset: trendshift badge dark. |
| [trendshift-badge.svg](../docs/public/trendshift-badge.svg) | Image/icon asset: trendshift badge. |
| [troubleshooting.mdx](../docs/public/troubleshooting.mdx) | Documentation: Troubleshooting Guide. |

## docs/public/antigravity-cli/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [setup.mdx](../docs/public/antigravity-cli/setup.mdx) | Documentation: Antigravity CLI Setup. |

## docs/public/architecture/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [database.mdx](../docs/public/architecture/database.mdx) | Documentation: Database Architecture. |
| [hooks.mdx](../docs/public/architecture/hooks.mdx) | Documentation: Hook Lifecycle. |
| [overview.mdx](../docs/public/architecture/overview.mdx) | Documentation: Architecture Overview. |
| [pm2-to-bun-migration.mdx](../docs/public/architecture/pm2-to-bun-migration.mdx) | Documentation: PM2 to Bun Migration: Complete Technical Documentation. |
| [search-architecture.mdx](../docs/public/architecture/search-architecture.mdx) | Documentation: Search Architecture. |
| [worker-service.mdx](../docs/public/architecture/worker-service.mdx) | Documentation: Worker Service. |

## docs/public/configuration/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [custom-anthropic-backends.mdx](../docs/public/configuration/custom-anthropic-backends.mdx) | Documentation: Custom Anthropic-Compatible Backends. |
| [litellm-gateway.mdx](../docs/public/configuration/litellm-gateway.mdx) | Documentation: LiteLLM Gateway. |

## docs/public/cursor/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [gemini-setup.mdx](../docs/public/cursor/gemini-setup.mdx) | Documentation: Cursor + Gemini Setup. |
| [index.mdx](../docs/public/cursor/index.mdx) | Documentation: Cursor Integration. |
| [openrouter-setup.mdx](../docs/public/cursor/openrouter-setup.mdx) | Documentation: Cursor + OpenRouter Setup. |

## docs/public/grok-bot/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [index.mdx](../docs/public/grok-bot/index.mdx) | Documentation: Grok Bot Integration. |

## docs/public/usage/

Documentation and reference assets.

| File | Responsibility |
| --- | --- |
| [auto-redaction.mdx](../docs/public/usage/auto-redaction.mdx) | Documentation: Auto-Redaction. |
| [backups.mdx](../docs/public/usage/backups.mdx) | Documentation: Backups. |
| [claude-desktop.mdx](../docs/public/usage/claude-desktop.mdx) | Documentation: Overview. |
| [export-import.mdx](../docs/public/usage/export-import.mdx) | Documentation: Memory Export/Import Scripts. |
| [folder-context.mdx](../docs/public/usage/folder-context.mdx) | Documentation: Overview. |
| [gemini-provider.mdx](../docs/public/usage/gemini-provider.mdx) | Documentation: Gemini Provider. |
| [getting-started.mdx](../docs/public/usage/getting-started.mdx) | Documentation: Getting Started with Claude-Mem. |
| [knowledge-agents.mdx](../docs/public/usage/knowledge-agents.mdx) | Documentation: Knowledge Agents. |
| [manual-recovery.mdx](../docs/public/usage/manual-recovery.mdx) | Documentation: Manual Recovery Guide. |
| [memory-ingest.mdx](../docs/public/usage/memory-ingest.mdx) | Documentation: Memory Ingest. |
| [multi-key-rotation.mdx](../docs/public/usage/multi-key-rotation.mdx) | Documentation: Multi-Key Rotation. |
| [my-work.mdx](../docs/public/usage/my-work.mdx) | Documentation: Working, ready and checked. |
| [openai-compatible-provider.mdx](../docs/public/usage/openai-compatible-provider.mdx) | Documentation: OpenAI-Compatible Provider. |
| [openrouter-provider.mdx](../docs/public/usage/openrouter-provider.mdx) | Documentation: OpenRouter Provider. |
| [private-tags.mdx](../docs/public/usage/private-tags.mdx) | Documentation: Private Tags. |
| [quota-fallback.mdx](../docs/public/usage/quota-fallback.mdx) | Documentation: Quota Fallback. |
| [search-tools.mdx](../docs/public/usage/search-tools.mdx) | Documentation: Smart Search (Default). |
| [teambrain.mdx](../docs/public/usage/teambrain.mdx) | Documentation: Set up or join a team. |

## docs/upstream-notices/

Preserved third-party licenses and provenance.

| File | Responsibility |
| --- | --- |
| [README.md](../docs/upstream-notices/README.md) | Documentation: Retained upstream notices. |
| [catppuccin-LICENSE.txt](../docs/upstream-notices/catppuccin-LICENSE.txt) | License, copyright or retained attribution notice. |
| [retired-attribution.json](../docs/upstream-notices/retired-attribution.json) | Configuration or structured data: retired attribution. |

## docs/upstream-notices/dsh/

Preserved third-party licenses and provenance.

| File | Responsibility |
| --- | --- |
| [LICENSE](../docs/upstream-notices/dsh/LICENSE) | License, copyright or retained attribution notice. |
| [NOTICE](../docs/upstream-notices/dsh/NOTICE) | License, copyright or retained attribution notice. |
| [THIRD-PARTY-LICENSES.txt](../docs/upstream-notices/dsh/THIRD-PARTY-LICENSES.txt) | Supporting file: THIRD PARTY LICENSES. |

## docs/upstream-notices/pi/

Preserved third-party licenses and provenance.

| File | Responsibility |
| --- | --- |
| [THIRD-PARTY-LICENSE.txt](../docs/upstream-notices/pi/THIRD-PARTY-LICENSE.txt) | License, copyright or retained attribution notice. |
| [TYPEBOX-LICENSE.txt](../docs/upstream-notices/pi/TYPEBOX-LICENSE.txt) | License, copyright or retained attribution notice. |
| [TYPEBOX-PROVENANCE.json](../docs/upstream-notices/pi/TYPEBOX-PROVENANCE.json) | Configuration or structured data: TYPEBOX PROVENANCE. |

## docs/upstream-notices/src/integrations/dsh-plugin/vendor/

Preserved third-party licenses and provenance.

| File | Responsibility |
| --- | --- |
| [provenance.json](../docs/upstream-notices/src/integrations/dsh-plugin/vendor/provenance.json) | Configuration or structured data: provenance. |

## evals/read-gate/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [README.md](../evals/read-gate/README.md) | Documentation: File Read Gate eval. |
| [scaffold-gate-off.sh](../evals/read-gate/scaffold-gate-off.sh) | Shell automation: scaffold gate off. |
| [scaffold-gate-on.sh](../evals/read-gate/scaffold-gate-on.sh) | Shell automation: scaffold gate on. |
| [scaffold-large-gate-off.sh](../evals/read-gate/scaffold-large-gate-off.sh) | Shell automation: scaffold large gate off. |
| [scaffold-large-gate-on.sh](../evals/read-gate/scaffold-large-gate-on.sh) | Shell automation: scaffold large gate on. |
| [scaffold-workspace.sh](../evals/read-gate/scaffold-workspace.sh) | Shell automation: scaffold workspace. |
| [seed-observations.json](../evals/read-gate/seed-observations.json) | Configuration or structured data: seed observations. |

## evals/read-gate/fixture-large/src/shipping/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [carrier-tariffs.ts](../evals/read-gate/fixture-large/src/shipping/carrier-tariffs.ts) | Evaluation/test fixture code: carrier tariffs. |

## evals/read-gate/fixture/src/shipping/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [rate-calculator.ts](../evals/read-gate/fixture/src/shipping/rate-calculator.ts) | Evaluation/test fixture code: rate calculator. |

## evals/read-gate/gate-off-large-file/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [case.yaml](../evals/read-gate/gate-off-large-file/case.yaml) | Configuration or structured data: case. |
| [prompt.md](../evals/read-gate/gate-off-large-file/prompt.md) | Documentation: prompt. |
| [scaffold-large-gate-off.sh](../evals/read-gate/gate-off-large-file/scaffold-large-gate-off.sh) | Shell automation: scaffold large gate off. |

## evals/read-gate/gate-off-large-file/graders/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [answer-minimum.md](../evals/read-gate/gate-off-large-file/graders/answer-minimum.md) | Documentation: answer minimum. |
| [answer-rate.md](../evals/read-gate/gate-off-large-file/graders/answer-rate.md) | Documentation: answer rate. |
| [not-blocked.md](../evals/read-gate/gate-off-large-file/graders/not-blocked.md) | Documentation: not blocked. |
| [read-used.md](../evals/read-gate/gate-off-large-file/graders/read-used.md) | Documentation: read used. |

## evals/read-gate/gate-off-small-file/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [case.yaml](../evals/read-gate/gate-off-small-file/case.yaml) | Configuration or structured data: case. |
| [prompt.md](../evals/read-gate/gate-off-small-file/prompt.md) | Documentation: prompt. |
| [scaffold-gate-off.sh](../evals/read-gate/gate-off-small-file/scaffold-gate-off.sh) | Shell automation: scaffold gate off. |

## evals/read-gate/gate-off-small-file/graders/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [answer-minimum.md](../evals/read-gate/gate-off-small-file/graders/answer-minimum.md) | Documentation: answer minimum. |
| [answer-rate.md](../evals/read-gate/gate-off-small-file/graders/answer-rate.md) | Documentation: answer rate. |
| [not-blocked.md](../evals/read-gate/gate-off-small-file/graders/not-blocked.md) | Documentation: not blocked. |
| [read-used.md](../evals/read-gate/gate-off-small-file/graders/read-used.md) | Documentation: read used. |

## evals/read-gate/gate-on-edits-file/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [case.yaml](../evals/read-gate/gate-on-edits-file/case.yaml) | Configuration or structured data: case. |
| [prompt.md](../evals/read-gate/gate-on-edits-file/prompt.md) | Documentation: prompt. |
| [scaffold-large-gate-on.sh](../evals/read-gate/gate-on-edits-file/scaffold-large-gate-on.sh) | Shell automation: scaffold large gate on. |

## evals/read-gate/gate-on-edits-file/graders/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [edited.md](../evals/read-gate/gate-on-edits-file/graders/edited.md) | Documentation: edited. |
| [old-value-gone.md](../evals/read-gate/gate-on-edits-file/graders/old-value-gone.md) | Documentation: old value gone. |
| [read-blocked.md](../evals/read-gate/gate-on-edits-file/graders/read-blocked.md) | Documentation: read blocked. |

## evals/read-gate/gate-on-large-file/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [case.yaml](../evals/read-gate/gate-on-large-file/case.yaml) | Configuration or structured data: case. |
| [prompt.md](../evals/read-gate/gate-on-large-file/prompt.md) | Documentation: prompt. |
| [scaffold-large-gate-on.sh](../evals/read-gate/gate-on-large-file/scaffold-large-gate-on.sh) | Shell automation: scaffold large gate on. |

## evals/read-gate/gate-on-large-file/graders/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [answer-minimum.md](../evals/read-gate/gate-on-large-file/graders/answer-minimum.md) | Documentation: answer minimum. |
| [answer-rate.md](../evals/read-gate/gate-on-large-file/graders/answer-rate.md) | Documentation: answer rate. |
| [read-blocked.md](../evals/read-gate/gate-on-large-file/graders/read-blocked.md) | Documentation: read blocked. |

## evals/read-gate/gate-on-small-file/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [case.yaml](../evals/read-gate/gate-on-small-file/case.yaml) | Configuration or structured data: case. |
| [prompt.md](../evals/read-gate/gate-on-small-file/prompt.md) | Documentation: prompt. |
| [scaffold-gate-on.sh](../evals/read-gate/gate-on-small-file/scaffold-gate-on.sh) | Shell automation: scaffold gate on. |

## evals/read-gate/gate-on-small-file/graders/

Evaluation harnesses and artificial application fixtures.

| File | Responsibility |
| --- | --- |
| [answer-minimum.md](../evals/read-gate/gate-on-small-file/graders/answer-minimum.md) | Documentation: answer minimum. |
| [answer-rate.md](../evals/read-gate/gate-on-small-file/graders/answer-rate.md) | Documentation: answer rate. |
| [not-blocked.md](../evals/read-gate/gate-on-small-file/graders/not-blocked.md) | Documentation: not blocked. |
| [read-used.md](../evals/read-gate/gate-on-small-file/graders/read-used.md) | Documentation: read used. |

## fixtures/

Reusable test/sample inputs.

| File | Responsibility |
| --- | --- |
| [tpuf-content-v2.json](../fixtures/tpuf-content-v2.json) | Configuration or structured data: tpuf content v2. |

## fixtures/hosts/

Reusable test/sample inputs.

| File | Responsibility |
| --- | --- |
| [opencode-mcp.json](../fixtures/hosts/opencode-mcp.json) | Configuration or structured data: opencode mcp. |

## install/

Static installation site.

| File | Responsibility |
| --- | --- |
| [.gitignore](../install/.gitignore) | Supporting file: . |
| [vercel.json](../install/vercel.json) | Configuration or structured data: vercel. |

## install/public/

Static installation site.

| File | Responsibility |
| --- | --- |
| [install.sh](../install/public/install.sh) | Shell automation: install. |
| [installer.js](../install/public/installer.js) | Code module: installer. |

## plans/

Historical design and implementation proposals.

| File | Responsibility |
| --- | --- |
| [02-spawn-contract-templating.md](../plans/02-spawn-contract-templating.md) | Documentation: Spawn-Contract Templating Ambiguity — Phased Fix Plan. |
| [04-installer-transparency.md](../plans/04-installer-transparency.md) | Documentation: Installer Failure Transparency — Cross-IDE Matrix. |
| [08-opencode-integration.md](../plans/08-opencode-integration.md) | Documentation: [plan-08] OpenCode Integration Event-Contract Correctness — make the OpenCode plugin actually capture. |
| [12-provider-and-extensibility-roadmap.md](../plans/12-provider-and-extensibility-roadmap.md) | Documentation: [plan-12] Provider & Extensibility Roadmap — net-new capabilities, not defects. |
| [14-child-process-ownership.md](../plans/14-child-process-ownership.md) | Documentation: [plan-14] Child Process Ownership — every process the worker spawns dies with the worker. |
| [15-worker-port-and-liveness-authority.md](../plans/15-worker-port-and-liveness-authority.md) | Documentation: [plan-15] Worker Port & Liveness Authority — one verified answer to "is a worker serving this port?". |
| [16-canonical-install-identity-and-bundle-integrity.md](../plans/16-canonical-install-identity-and-bundle-integrity.md) | Documentation: [plan-16] Canonical Install Identity & Bundle Integrity — one resolvable, dependency-complete plugin root, and recycles that cannot kill a working worker. |
| [17-hook-wrapper-contract.md](../plans/17-hook-wrapper-contract.md) | Documentation: [plan-17] Hook Wrapper Contract — thin, cheap, and fail-open on every host. |
| [18-observer-response-pipeline.md](../plans/18-observer-response-pipeline.md) | Documentation: [plan-18] Observer Response Pipeline — classify every output, never confirm a batch on failure, bound every history. |
| [19-observer-subprocess-isolation.md](../plans/19-observer-subprocess-isolation.md) | Documentation: [plan-19] Observer Subprocess Isolation — an explicit env, cwd, config, tool set and auth source for the headless generator, with loud degradation. |
| [20-project-identity-and-injection-scope.md](../plans/20-project-identity-and-injection-scope.md) | Documentation: [plan-20] Project Identity & Injection Scope — one resolver shared by capture, sync and retrieval, and injection config that reaches the query. |
| [2026-05-07-server-beta-independent-bullmq-observation-runtime.md](../plans/2026-05-07-server-beta-independent-bullmq-observation-runtime.md) | Documentation: Claude-Mem 13 Server Beta: Independent BullMQ Observation Runtime. |
| [2026-05-25-cmem-sdk-and-server-rename.md](../plans/2026-05-25-cmem-sdk-and-server-rename.md) | Documentation: cmem-sdk: Embeddable claude-mem I/O on the Server (Postgres) Runtime + server-beta → server Rename. |
| [2026-06-10-worker-restart-single-source-of-truth.md](../plans/2026-06-10-worker-restart-single-source-of-truth.md) | Documentation: Worker Restart: Single Source of Truth. |
| [2026-07-03-antigravity-cli-migration.md](../plans/2026-07-03-antigravity-cli-migration.md) | Documentation: Remove Gemini CLI, Add Antigravity CLI (full parity). |
| [2026-07-05-three-release-branches.md](../plans/2026-07-05-three-release-branches.md) | Documentation: Plan: Three Long-Lived Release Branches (stable / core-dev / community-edge). |
| [2026-07-16-endless-mode-message-in-a-bottle-slides.pdf](../plans/2026-07-16-endless-mode-message-in-a-bottle-slides.pdf) | Reference or fixture artifact: 2026 07 16 endless mode message in a bottle slides. |
| [2026-07-16-endless-mode-message-in-a-bottle.md](../plans/2026-07-16-endless-mode-message-in-a-bottle.md) | Documentation: Endless Mode — Message in a Bottle. |
| [2026-07-17-endless-mode-v1-handoff.md](../plans/2026-07-17-endless-mode-v1-handoff.md) | Documentation: Handoff: Implement Endless Mode v1 in a new claude-mem worktree. |
| [2026-07-17-endless-mode-v1-slides.pdf](../plans/2026-07-17-endless-mode-v1-slides.pdf) | Reference or fixture artifact: 2026 07 17 endless mode v1 slides. |
| [2026-07-17-endless-mode-v1.md](../plans/2026-07-17-endless-mode-v1.md) | Documentation: Endless Mode v1. |
| [2026-07-17-phase5-two-lane-sync.md](../plans/2026-07-17-phase5-two-lane-sync.md) | Documentation: Phase 5: Two-Lane Multi-Device Sync (per-user Durable Object log). |
| [2026-07-22-cmem-launch.md](../plans/2026-07-22-cmem-launch.md) | Documentation: cmem.ai Launch Plan — Finish Line. |
| [2026-07-23-overnight-fixes-single-round.md](../plans/2026-07-23-overnight-fixes-single-round.md) | Documentation: Overnight Fixes — Single Round (v13.12.4). |
| [2026-08-16-observer-error-path.md](../plans/2026-08-16-observer-error-path.md) | Documentation: Observer Error Path — classify once, carry the message, tell the user what to do. |
| [2026-08-18-chroma-windows.md](../plans/2026-08-18-chroma-windows.md) | Documentation: Chroma on Windows — Process-Tree Ownership. |
| [2026-09-01-posthog-observed-model.md](../plans/2026-09-01-posthog-observed-model.md) | Documentation: PostHog: report the observed model, source, and billing type. |
| [2026-09-05-observation-tv-readonly-broadcast.md](../plans/2026-09-05-observation-tv-readonly-broadcast.md) | Documentation: Observation TV — read-only broadcast + shared-secret token. |
| [2026-09-09-ccs-align.md](../plans/2026-09-09-ccs-align.md) | Documentation: CCS Align — standing-seat plan of record. |
| [2026-09-16-grok-bot-live-index.md](../plans/2026-09-16-grok-bot-live-index.md) | Documentation: Grok Bot live timeline INDEX. |
| [2026-09-25-agent-cost-report-weekly.md](../plans/2026-09-25-agent-cost-report-weekly.md) | Documentation: Agent Cost Report — weekly rebuild (transcript-measured, Timing-style, dollars). |
| [2026-09-25-npx-signup-capture.md](../plans/2026-09-25-npx-signup-capture.md) | Documentation: npx installer signup capture (non-TTY default, deferred pairing, poll budget, taxonomy, telemetry). |
| [2026-10-02-claude-mem-on-path-hooks.SPIKE.md](../plans/2026-10-02-claude-mem-on-path-hooks.SPIKE.md) | Documentation: SPIKE: Hooks call claude-mem directly (Phase 1 evidence). |
| [2026-10-02-claude-mem-on-path-hooks.md](../plans/2026-10-02-claude-mem-on-path-hooks.md) | Documentation: Plan: Hooks call claude-mem directly, with no bash string. |
| [2026-10-03-liveness-over-deadlines-HANDOFF.md](../plans/2026-10-03-liveness-over-deadlines-HANDOFF.md) | Documentation: Handoff — liveness over deadlines + Supabase cloud sync. |
| [2026-10-03-liveness-over-deadlines.md](../plans/2026-10-03-liveness-over-deadlines.md) | Documentation: Liveness over deadlines. |
| [2026-10-05-file-read-gate-restore.md](../plans/2026-10-05-file-read-gate-restore.md) | Documentation: File Read Gate — restore the full-file Read block (default ON) with evals. |
| [21-sqlite-schema-evolution-and-queue-state.md](../plans/21-sqlite-schema-evolution-and-queue-state.md) | Documentation: [plan-21] SQLite Schema Evolution & Queue State Integrity — one DDL path guarded by introspection, immutable session keys, and queue/session states that can actually transition. |
| [22-chroma-sidecar-contract.md](../plans/22-chroma-sidecar-contract.md) | Documentation: [plan-22] Chroma Sidecar Contract — host-safe spawn with pinned deps and a clean env, single-writer upsert sync, honest fallback (or retire the sidecar). |
| [23-host-integration-contracts.md](../plans/23-host-integration-contracts.md) | Documentation: [plan-23] Host Integration Contracts — every non-Claude-Code adapter and the MCP/HTTP tool surface validated by contract tests against the host's actual schema. |
| [24-server-runtime-generation-and-sync-contract.md](../plans/24-server-runtime-generation-and-sync-contract.md) | Documentation: [plan-24] Server Runtime & Cloud Sync Contract — one generation pipeline shared by worker and server, session linkage on every write path, bounded sync. |
| [25-search-read-path-fts-cjk.md](../plans/25-search-read-path-fts-cjk.md) | Documentation: Defect. |
| [26-telegram-session-wrapups.md](../plans/26-telegram-session-wrapups.md) | Documentation: [plan-26] Telegram session wrap-ups — one message per session, from the Stop-hook summary, routed per project, never repeated. |
| [README.md](../plans/README.md) | Documentation: Plan masters. |
| [local-human-work-browser-checks.md](../plans/local-human-work-browser-checks.md) | Documentation: Local My Work browser verification. |
| [local-human-work-viewer.md](../plans/local-human-work-viewer.md) | Documentation: Local human work viewer. |
| [root-cause-holistic-execution.md](../plans/root-cause-holistic-execution.md) | Documentation: Root Cause Holistic Fixes Execution Notes. |
| [windows-testers-post.md](../plans/windows-testers-post.md) | Documentation: 🪟 Windows folks — we think we fixed the big one. Help us test?. |

## plans/hackathon/

Historical design and implementation proposals.

| File | Responsibility |
| --- | --- |
| [01-what-is-claude-mem-field-guide-slides-picturebook.pdf](../plans/hackathon/01-what-is-claude-mem-field-guide-slides-picturebook.pdf) | Reference or fixture artifact: 01 what is claude mem field guide slides picturebook. |
| [01-what-is-claude-mem-field-guide-slides-story.pdf](../plans/hackathon/01-what-is-claude-mem-field-guide-slides-story.pdf) | Reference or fixture artifact: 01 what is claude mem field guide slides story. |
| [01-what-is-claude-mem-field-guide.md](../plans/hackathon/01-what-is-claude-mem-field-guide.md) | Documentation: Claude-Mem: The Hacker's Field Guide. |
| [02-claude-mem-cheatsheet-slides.pdf](../plans/hackathon/02-claude-mem-cheatsheet-slides.pdf) | Reference or fixture artifact: 02 claude mem cheatsheet slides. |
| [02-claude-mem-cheatsheet.md](../plans/hackathon/02-claude-mem-cheatsheet.md) | Documentation: Claude-Mem Cheat Sheet. |
| [03-claude-mem-tutorial-slides.pdf](../plans/hackathon/03-claude-mem-tutorial-slides.pdf) | Reference or fixture artifact: 03 claude mem tutorial slides. |
| [03-claude-mem-tutorial.md](../plans/hackathon/03-claude-mem-tutorial.md) | Documentation: Claude-Mem Tutorial: From Zero to "It Remembers" in One Sitting. |
| [04-the-memory-prize-slides.pdf](../plans/hackathon/04-the-memory-prize-slides.pdf) | Reference or fixture artifact: 04 the memory prize slides. |
| [04-the-memory-prize.md](../plans/hackathon/04-the-memory-prize.md) | Documentation: The $1,000 Memory Prize — sponsored by Claude-Mem. |
| [05-memory-prize-scorecard-slides.pdf](../plans/hackathon/05-memory-prize-scorecard-slides.pdf) | Reference or fixture artifact: 05 memory prize scorecard slides. |
| [05-memory-prize-scorecard.md](../plans/hackathon/05-memory-prize-scorecard.md) | Documentation: The Memory Prize Scorecard: 17 Hackathon Projects, Judged on How They Actually Use Claude-Mem. |
| [README.md](../plans/hackathon/README.md) | Documentation: Claude-Mem Hackathon Kit — Sunday Aug 23, 2026. |
| [claude-mem-cheatsheet.html](../plans/hackathon/claude-mem-cheatsheet.html) | HTML page/template: claude mem cheatsheet. |

## plans/inbox/

Historical design and implementation proposals.

| File | Responsibility |
| --- | --- |
| [2026-07-09-cloud-sync-native.md](../plans/inbox/2026-07-09-cloud-sync-native.md) | Documentation: Worker-Native Cloud Sync — the database is the queue. |

## plugin/

Distributed plugin resources.

| File | Responsibility |
| --- | --- |
| [.mcp.json](../plugin/.mcp.json) | Configuration or structured data: .mcp. |
| [bun.lock](../plugin/bun.lock) | Pinned dependency resolution for this package. |
| [package.json](../plugin/package.json) | Package metadata, dependencies and scripts for claude-mem-plugin. |

## plugin/.claude-plugin/

Distributed plugin resources.

| File | Responsibility |
| --- | --- |
| [plugin.json](../plugin/.claude-plugin/plugin.json) | Configuration or structured data: plugin. |

## plugin/.codex-plugin/

Distributed plugin resources.

| File | Responsibility |
| --- | --- |
| [plugin.json](../plugin/.codex-plugin/plugin.json) | Configuration or structured data: plugin. |

## plugin/hooks/

Agent lifecycle hook registration.

| File | Responsibility |
| --- | --- |
| [bugfixes-2026-01-10.md](../plugin/hooks/bugfixes-2026-01-10.md) | Documentation: Bugfix Sprint: 2026-01-10. |
| [codex-hooks.json](../plugin/hooks/codex-hooks.json) | Configuration or structured data: codex hooks. |
| [hooks.json](../plugin/hooks/hooks.json) | Configuration or structured data: hooks. |

## plugin/modes/

Memory observation/context mode definitions.

| File | Responsibility |
| --- | --- |
| [code--ar.json](../plugin/modes/code--ar.json) | Configuration or structured data: code  ar. |
| [code--bn.json](../plugin/modes/code--bn.json) | Configuration or structured data: code  bn. |
| [code--chill.json](../plugin/modes/code--chill.json) | Configuration or structured data: code  chill. |
| [code--cs.json](../plugin/modes/code--cs.json) | Configuration or structured data: code  cs. |
| [code--da.json](../plugin/modes/code--da.json) | Configuration or structured data: code  da. |
| [code--de.json](../plugin/modes/code--de.json) | Configuration or structured data: code  de. |
| [code--el.json](../plugin/modes/code--el.json) | Configuration or structured data: code  el. |
| [code--es.json](../plugin/modes/code--es.json) | Configuration or structured data: code  es. |
| [code--fi.json](../plugin/modes/code--fi.json) | Configuration or structured data: code  fi. |
| [code--fr.json](../plugin/modes/code--fr.json) | Configuration or structured data: code  fr. |
| [code--he.json](../plugin/modes/code--he.json) | Configuration or structured data: code  he. |
| [code--hi.json](../plugin/modes/code--hi.json) | Configuration or structured data: code  hi. |
| [code--hu.json](../plugin/modes/code--hu.json) | Configuration or structured data: code  hu. |
| [code--id.json](../plugin/modes/code--id.json) | Configuration or structured data: code  id. |
| [code--it.json](../plugin/modes/code--it.json) | Configuration or structured data: code  it. |
| [code--ja.json](../plugin/modes/code--ja.json) | Configuration or structured data: code  ja. |
| [code--ko.json](../plugin/modes/code--ko.json) | Configuration or structured data: code  ko. |
| [code--nl.json](../plugin/modes/code--nl.json) | Configuration or structured data: code  nl. |
| [code--no.json](../plugin/modes/code--no.json) | Configuration or structured data: code  no. |
| [code--pl.json](../plugin/modes/code--pl.json) | Configuration or structured data: code  pl. |
| [code--pt-br.json](../plugin/modes/code--pt-br.json) | Configuration or structured data: code  pt br. |
| [code--ro.json](../plugin/modes/code--ro.json) | Configuration or structured data: code  ro. |
| [code--ru.json](../plugin/modes/code--ru.json) | Configuration or structured data: code  ru. |
| [code--sv.json](../plugin/modes/code--sv.json) | Configuration or structured data: code  sv. |
| [code--th.json](../plugin/modes/code--th.json) | Configuration or structured data: code  th. |
| [code--tr.json](../plugin/modes/code--tr.json) | Configuration or structured data: code  tr. |
| [code--uk.json](../plugin/modes/code--uk.json) | Configuration or structured data: code  uk. |
| [code--ur.json](../plugin/modes/code--ur.json) | Configuration or structured data: code  ur. |
| [code--vi.json](../plugin/modes/code--vi.json) | Configuration or structured data: code  vi. |
| [code--zh.json](../plugin/modes/code--zh.json) | Configuration or structured data: code  zh. |
| [code.json](../plugin/modes/code.json) | Configuration or structured data: code. |
| [email-investigation.json](../plugin/modes/email-investigation.json) | Configuration or structured data: email investigation. |
| [law-study--chill.json](../plugin/modes/law-study--chill.json) | Configuration or structured data: law study  chill. |
| [law-study-CLAUDE.md](../plugin/modes/law-study-CLAUDE.md) | Documentation: Legal Study Assistant. |
| [law-study.json](../plugin/modes/law-study.json) | Configuration or structured data: law study. |
| [meme-tokens.json](../plugin/modes/meme-tokens.json) | Configuration or structured data: meme tokens. |

## plugin/scripts/

Generated executable runtime bundles and maps.

| File | Responsibility |
| --- | --- |
| [bun-runner.js](../plugin/scripts/bun-runner.js) | Generated distribution artifact; rebuild from source. bun runner. |
| [claude-mem-launcher.cjs](../plugin/scripts/claude-mem-launcher.cjs) | Generated distribution artifact; rebuild from source. claude mem launcher. |
| [claude-mem-launcher.cjs.map](../plugin/scripts/claude-mem-launcher.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [context-generator.cjs](../plugin/scripts/context-generator.cjs) | Generated distribution artifact; rebuild from source. context generator. |
| [context-generator.cjs.map](../plugin/scripts/context-generator.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [context-read-worker.cjs](../plugin/scripts/context-read-worker.cjs) | Generated distribution artifact; rebuild from source. context read worker. |
| [context-read-worker.cjs.map](../plugin/scripts/context-read-worker.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [ensure-launcher.cjs](../plugin/scripts/ensure-launcher.cjs) | Generated distribution artifact; rebuild from source. ensure launcher. |
| [ensure-launcher.cjs.map](../plugin/scripts/ensure-launcher.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [mcp-server.cjs](../plugin/scripts/mcp-server.cjs) | Generated distribution artifact; rebuild from source. mcp server. |
| [mcp-server.cjs.map](../plugin/scripts/mcp-server.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [server-service.cjs](../plugin/scripts/server-service.cjs) | Generated distribution artifact; rebuild from source. server service. |
| [server-service.cjs.map](../plugin/scripts/server-service.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [statusline-counts.js](../plugin/scripts/statusline-counts.js) | Generated distribution artifact; rebuild from source. statusline counts. |
| [transcript-watcher.cjs](../plugin/scripts/transcript-watcher.cjs) | Generated distribution artifact; rebuild from source. transcript watcher. |
| [transcript-watcher.cjs.map](../plugin/scripts/transcript-watcher.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [version-check.js](../plugin/scripts/version-check.js) | Generated distribution artifact; rebuild from source. version check. |
| [worker-service.cjs](../plugin/scripts/worker-service.cjs) | Generated distribution artifact; rebuild from source. worker service. |
| [worker-service.cjs.map](../plugin/scripts/worker-service.cjs.map) | Generated source map for the adjacent runtime bundle. |
| [worker-wrapper.cjs](../plugin/scripts/worker-wrapper.cjs) | Generated distribution artifact; rebuild from source. worker wrapper. |

## plugin/skills/agent-cost-report/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [.gitignore](../plugin/skills/agent-cost-report/.gitignore) | Supporting file: . |
| [CHECKSUMS.txt](../plugin/skills/agent-cost-report/CHECKSUMS.txt) | Supporting file: CHECKSUMS. |
| [SKILL.md](../plugin/skills/agent-cost-report/SKILL.md) | Agent skill procedure: agent-cost-report. |
| [VERIFICATION.md](../plugin/skills/agent-cost-report/VERIFICATION.md) | Documentation: Verification — agent-cost-report rebuild (Phase 8, 2026-09-26 PT). |

## plugin/skills/agent-cost-report/scripts/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [acr.py](../plugin/skills/agent-cost-report/scripts/acr.py) | Python helper: acr. |

## plugin/skills/agent-cost-report/scripts/acr/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [__init__.py](../plugin/skills/agent-cost-report/scripts/acr/__init__.py) | Python helper:   init  . |
| [behavior.py](../plugin/skills/agent-cost-report/scripts/acr/behavior.py) | Python helper: behavior. |
| [classify.py](../plugin/skills/agent-cost-report/scripts/acr/classify.py) | Python helper: classify. |
| [costs.py](../plugin/skills/agent-cost-report/scripts/acr/costs.py) | Python helper: costs. |
| [devices.py](../plugin/skills/agent-cost-report/scripts/acr/devices.py) | Python helper: devices. |
| [evidence.py](../plugin/skills/agent-cost-report/scripts/acr/evidence.py) | Python helper: evidence. |
| [labels.py](../plugin/skills/agent-cost-report/scripts/acr/labels.py) | Python helper: labels. |
| [measure.py](../plugin/skills/agent-cost-report/scripts/acr/measure.py) | Python helper: measure. |
| [mistakes.py](../plugin/skills/agent-cost-report/scripts/acr/mistakes.py) | Python helper: mistakes. |
| [patterns.py](../plugin/skills/agent-cost-report/scripts/acr/patterns.py) | Python helper: patterns. |
| [period.py](../plugin/skills/agent-cost-report/scripts/acr/period.py) | Python helper: period. |
| [prices.py](../plugin/skills/agent-cost-report/scripts/acr/prices.py) | Python helper: prices. |
| [render.py](../plugin/skills/agent-cost-report/scripts/acr/render.py) | Python helper: render. |
| [rollup.py](../plugin/skills/agent-cost-report/scripts/acr/rollup.py) | Python helper: rollup. |
| [rules.json](../plugin/skills/agent-cost-report/scripts/acr/rules.json) | Configuration or structured data: rules. |
| [rules.py](../plugin/skills/agent-cost-report/scripts/acr/rules.py) | Python helper: rules. |
| [sample.py](../plugin/skills/agent-cost-report/scripts/acr/sample.py) | Python helper: sample. |
| [snapshot.py](../plugin/skills/agent-cost-report/scripts/acr/snapshot.py) | Python helper: snapshot. |
| [sync.py](../plugin/skills/agent-cost-report/scripts/acr/sync.py) | Python helper: sync. |
| [transcripts.py](../plugin/skills/agent-cost-report/scripts/acr/transcripts.py) | Python helper: transcripts. |
| [wins.py](../plugin/skills/agent-cost-report/scripts/acr/wins.py) | Python helper: wins. |

## plugin/skills/agent-cost-report/scripts/tests/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [_db.py](../plugin/skills/agent-cost-report/scripts/tests/_db.py) | Python helper:  db. |
| [_paths.py](../plugin/skills/agent-cost-report/scripts/tests/_paths.py) | Python helper:  paths. |
| [test_behavior.py](../plugin/skills/agent-cost-report/scripts/tests/test_behavior.py) | Behavior checks for test behavior. |
| [test_devices.py](../plugin/skills/agent-cost-report/scripts/tests/test_devices.py) | Behavior checks for test devices. |
| [test_labels.py](../plugin/skills/agent-cost-report/scripts/tests/test_labels.py) | Behavior checks for test labels. |
| [test_measure.py](../plugin/skills/agent-cost-report/scripts/tests/test_measure.py) | Behavior checks for test measure. |
| [test_pdf_windows.py](../plugin/skills/agent-cost-report/scripts/tests/test_pdf_windows.py) | Behavior checks for test pdf windows. |
| [test_period.py](../plugin/skills/agent-cost-report/scripts/tests/test_period.py) | Behavior checks for test period. |
| [test_prices.py](../plugin/skills/agent-cost-report/scripts/tests/test_prices.py) | Behavior checks for test prices. |
| [test_render.py](../plugin/skills/agent-cost-report/scripts/tests/test_render.py) | Behavior checks for test render. |
| [test_render_encoding.py](../plugin/skills/agent-cost-report/scripts/tests/test_render_encoding.py) | Behavior checks for test render encoding. |
| [test_rollup.py](../plugin/skills/agent-cost-report/scripts/tests/test_rollup.py) | Behavior checks for test rollup. |
| [test_snapshot.py](../plugin/skills/agent-cost-report/scripts/tests/test_snapshot.py) | Behavior checks for test snapshot. |
| [test_sync.py](../plugin/skills/agent-cost-report/scripts/tests/test_sync.py) | Behavior checks for test sync. |
| [test_transcript_encoding.py](../plugin/skills/agent-cost-report/scripts/tests/test_transcript_encoding.py) | Behavior checks for test transcript encoding. |
| [test_transcripts.py](../plugin/skills/agent-cost-report/scripts/tests/test_transcripts.py) | Behavior checks for test transcripts. |
| [test_wins.py](../plugin/skills/agent-cost-report/scripts/tests/test_wins.py) | Behavior checks for test wins. |

## plugin/skills/agent-cost-report/scripts/tests/fixtures/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [make_report_fixtures.py](../plugin/skills/agent-cost-report/scripts/tests/fixtures/make_report_fixtures.py) | Python helper: make report fixtures. |
| [prices_sample.json](../plugin/skills/agent-cost-report/scripts/tests/fixtures/prices_sample.json) | Configuration or structured data: prices sample. |
| [report-1day.json](../plugin/skills/agent-cost-report/scripts/tests/fixtures/report-1day.json) | Configuration or structured data: report 1day. |
| [report-30day.json](../plugin/skills/agent-cost-report/scripts/tests/fixtures/report-30day.json) | Configuration or structured data: report 30day. |
| [report-7day.json](../plugin/skills/agent-cost-report/scripts/tests/fixtures/report-7day.json) | Configuration or structured data: report 7day. |
| [report-empty.json](../plugin/skills/agent-cost-report/scripts/tests/fixtures/report-empty.json) | Configuration or structured data: report empty. |
| [report-session.json](../plugin/skills/agent-cost-report/scripts/tests/fixtures/report-session.json) | Configuration or structured data: report session. |

## plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/18/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [rollout-codex-1.jsonl](../plugin/skills/agent-cost-report/scripts/tests/fixtures/codex/sessions/2026/09/18/rollout-codex-1.jsonl) | Supporting file: rollout codex 1. |

## plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-a/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [sess-aaaa.jsonl](../plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-a/sess-aaaa.jsonl) | Supporting file: sess aaaa. |

## plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-b/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [sess-bbbb.jsonl](../plugin/skills/agent-cost-report/scripts/tests/fixtures/projects/-workspace-proj-b/sess-bbbb.jsonl) | Supporting file: sess bbbb. |

## plugin/skills/agent-cost-report/verification/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [precision-2026-09-26.json](../plugin/skills/agent-cost-report/verification/precision-2026-09-26.json) | Configuration or structured data: precision 2026 09 26. |

## plugin/skills/babysit/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/babysit/SKILL.md) | Agent skill procedure: babysit. |

## plugin/skills/backup-setup/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/backup-setup/SKILL.md) | Agent skill procedure: backup-setup. |

## plugin/skills/build/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/build/SKILL.md) | Agent skill procedure: build. |

## plugin/skills/build-and-release/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/build-and-release/SKILL.md) | Agent skill procedure: build-and-release. |

## plugin/skills/ccs-align/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/ccs-align/SKILL.md) | Agent skill procedure: ccs-align. |

## plugin/skills/childhood/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/childhood/SKILL.md) | Agent skill procedure: childhood. |

## plugin/skills/cloud-sync/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/cloud-sync/SKILL.md) | Agent skill procedure: cloud-sync. |

## plugin/skills/design-is/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/design-is/SKILL.md) | Agent skill procedure: design-is. |

## plugin/skills/do/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/do/SKILL.md) | Agent skill procedure: do. |

## plugin/skills/handoff/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/handoff/SKILL.md) | Agent skill procedure: handoff. |

## plugin/skills/how-it-works/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/how-it-works/SKILL.md) | Agent skill procedure: how-it-works. |
| [onboarding-explainer.md](../plugin/skills/how-it-works/onboarding-explainer.md) | Documentation: How claude-mem works. |

## plugin/skills/knowledge-agent/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/knowledge-agent/SKILL.md) | Agent skill procedure: knowledge-agent. |

## plugin/skills/learn-codebase/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/learn-codebase/SKILL.md) | Agent skill procedure: learn-codebase. |

## plugin/skills/make-plan/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/make-plan/SKILL.md) | Agent skill procedure: make-plan. |

## plugin/skills/mem-search/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/mem-search/SKILL.md) | Agent skill procedure: mem-search. |

## plugin/skills/mode-creator/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/mode-creator/SKILL.md) | Agent skill procedure: mode-creator. |

## plugin/skills/mode-creator/evals/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [evals.json](../plugin/skills/mode-creator/evals/evals.json) | Configuration or structured data: evals. |

## plugin/skills/mode-creator/references/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [mode-authoring.md](../plugin/skills/mode-creator/references/mode-authoring.md) | Documentation: Authoring a custom claude-mem mode. |
| [telegram.md](../plugin/skills/mode-creator/references/telegram.md) | Documentation: Telegram notifications for a custom mode. |

## plugin/skills/mode-creator/scripts/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [configure-telegram.mjs](../plugin/skills/mode-creator/scripts/configure-telegram.mjs) | Code module: configure telegram. |
| [install-mode.mjs](../plugin/skills/mode-creator/scripts/install-mode.mjs) | Code module: install mode. |

## plugin/skills/oh-my-issues/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/oh-my-issues/SKILL.md) | Agent skill procedure: oh-my-issues. |

## plugin/skills/owner-goals/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/owner-goals/SKILL.md) | Agent skill procedure: owner-goals. |

## plugin/skills/owner-goals/scripts/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [export_owner_prompts.py](../plugin/skills/owner-goals/scripts/export_owner_prompts.py) | Python helper: export owner prompts. |
| [save_goals.py](../plugin/skills/owner-goals/scripts/save_goals.py) | Python helper: save goals. |

## plugin/skills/pathfinder/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/pathfinder/SKILL.md) | Agent skill procedure: pathfinder. |

## plugin/skills/release/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/release/SKILL.md) | Agent skill procedure: release. |

## plugin/skills/request-progress/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/request-progress/SKILL.md) | Agent skill procedure: request-progress. |

## plugin/skills/request-progress/scripts/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [request-groups.mjs](../plugin/skills/request-progress/scripts/request-groups.mjs) | Code module: request groups. |

## plugin/skills/screenpipe/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/screenpipe/SKILL.md) | Agent skill procedure: screenpipe. |
| [screenpipe.mjs](../plugin/skills/screenpipe/screenpipe.mjs) | Code module: screenpipe; exports defaultWorkerUrl, run. |

## plugin/skills/smart-explore/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/smart-explore/SKILL.md) | Agent skill procedure: smart-explore. |

## plugin/skills/standup/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/standup/SKILL.md) | Agent skill procedure: standup. |
| [agent-brief.md](../plugin/skills/standup/agent-brief.md) | Documentation: You're in a standup — a group chat with the other branches. |
| [standup.mjs](../plugin/skills/standup/standup.mjs) | Code module: standup. |

## plugin/skills/timeline-report/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/timeline-report/SKILL.md) | Agent skill procedure: timeline-report. |

## plugin/skills/version-bump/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/version-bump/SKILL.md) | Agent skill procedure: version-bump. |

## plugin/skills/version-bump/scripts/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [generate_changelog.js](../plugin/skills/version-bump/scripts/generate_changelog.js) | Code module: generate changelog. |

## plugin/skills/weekly-digests/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/weekly-digests/SKILL.md) | Agent skill procedure: weekly-digests. |

## plugin/skills/what-the/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/what-the/SKILL.md) | Agent skill procedure: what-the. |

## plugin/skills/wowerpoint/

Distributed agent skill instructions and helpers.

| File | Responsibility |
| --- | --- |
| [SKILL.md](../plugin/skills/wowerpoint/SKILL.md) | Agent skill procedure: wowerpoint. |

## plugin/sqlite/

Generated distributed SQLite modules.

| File | Responsibility |
| --- | --- |
| [SessionStore.js](../plugin/sqlite/SessionStore.js) | Generated distribution artifact; rebuild from source. Session Store. |
| [SessionStore.js.map](../plugin/sqlite/SessionStore.js.map) | Generated source map for the adjacent runtime bundle. |

## plugin/sqlite/observations/

Generated distributed SQLite modules.

| File | Responsibility |
| --- | --- |
| [files.js](../plugin/sqlite/observations/files.js) | Generated distribution artifact; rebuild from source. files. |
| [files.js.map](../plugin/sqlite/observations/files.js.map) | Generated source map for the adjacent runtime bundle. |

## plugin/ui/

Generated UI artifacts and static UI assets.

| File | Responsibility |
| --- | --- |
| [claude-mem-logo-for-dark-mode.webp](../plugin/ui/claude-mem-logo-for-dark-mode.webp) | Image/icon asset: claude mem logo for dark mode. |
| [claude-mem-logo-stylized.png](../plugin/ui/claude-mem-logo-stylized.png) | Image/icon asset: claude mem logo stylized. |
| [claude-mem-logomark.webp](../plugin/ui/claude-mem-logomark.webp) | Image/icon asset: claude mem logomark. |
| [icon-thick-completed.svg](../plugin/ui/icon-thick-completed.svg) | Image/icon asset: icon thick completed. |
| [icon-thick-investigated.svg](../plugin/ui/icon-thick-investigated.svg) | Image/icon asset: icon thick investigated. |
| [icon-thick-learned.svg](../plugin/ui/icon-thick-learned.svg) | Image/icon asset: icon thick learned. |
| [icon-thick-next-steps.svg](../plugin/ui/icon-thick-next-steps.svg) | Image/icon asset: icon thick next steps. |
| [icon-thick-notes.svg](../plugin/ui/icon-thick-notes.svg) | Image/icon asset: icon thick notes. |
| [tv.html](../plugin/ui/tv.html) | HTML page/template: tv. |
| [viewer-bundle.js](../plugin/ui/viewer-bundle.js) | Generated distribution artifact; rebuild from source. viewer bundle. |
| [viewer.html](../plugin/ui/viewer.html) | Generated distribution artifact; rebuild from source. viewer. |

## plugin/ui/assets/fonts/

Generated UI artifacts and static UI assets.

| File | Responsibility |
| --- | --- |
| [monaspace-radon-var.woff](../plugin/ui/assets/fonts/monaspace-radon-var.woff) | Locally bundled font asset: monaspace radon var. |
| [monaspace-radon-var.woff2](../plugin/ui/assets/fonts/monaspace-radon-var.woff2) | Locally bundled font asset: monaspace radon var. |

## plugin/ui/work-view/

Generated UI artifacts and static UI assets.

| File | Responsibility |
| --- | --- |
| [favicon.svg](../plugin/ui/work-view/favicon.svg) | Generated distribution artifact; rebuild from source. favicon. |
| [icons.svg](../plugin/ui/work-view/icons.svg) | Generated distribution artifact; rebuild from source. icons. |
| [index.html](../plugin/ui/work-view/index.html) | Generated distribution artifact; rebuild from source. index. |

## plugin/ui/work-view/assets/

Generated UI artifacts and static UI assets.

| File | Responsibility |
| --- | --- |
| [HankenGrotesk-wght-2z-3qhAN.ttf](../plugin/ui/work-view/assets/HankenGrotesk-wght-2z-3qhAN.ttf) | Generated distribution artifact; rebuild from source. Hanken Grotesk wght 2z 3qh AN. |
| [at-home-modern-computer-JH_MTm9z.webp](../plugin/ui/work-view/assets/at-home-modern-computer-JH_MTm9z.webp) | Generated distribution artifact; rebuild from source. at home modern computer JH MTm9z. |
| [claude-DqipVtpa.webp](../plugin/ui/work-view/assets/claude-DqipVtpa.webp) | Generated distribution artifact; rebuild from source. claude Dqip Vtpa. |
| [geist-cyrillic-ext-wght-normal-DjL33-gN.woff2](../plugin/ui/work-view/assets/geist-cyrillic-ext-wght-normal-DjL33-gN.woff2) | Generated distribution artifact; rebuild from source. geist cyrillic ext wght normal Dj L33 g N. |
| [geist-cyrillic-wght-normal-BEAKL7Jp.woff2](../plugin/ui/work-view/assets/geist-cyrillic-wght-normal-BEAKL7Jp.woff2) | Generated distribution artifact; rebuild from source. geist cyrillic wght normal BEAKL7Jp. |
| [geist-latin-ext-wght-normal-DC-KSUi6.woff2](../plugin/ui/work-view/assets/geist-latin-ext-wght-normal-DC-KSUi6.woff2) | Generated distribution artifact; rebuild from source. geist latin ext wght normal DC KSUi6. |
| [geist-latin-wght-normal-BgDaEnEv.woff2](../plugin/ui/work-view/assets/geist-latin-wght-normal-BgDaEnEv.woff2) | Generated distribution artifact; rebuild from source. geist latin wght normal Bg Da En Ev. |
| [geist-vietnamese-wght-normal-6IgcOCM7.woff2](../plugin/ui/work-view/assets/geist-vietnamese-wght-normal-6IgcOCM7.woff2) | Generated distribution artifact; rebuild from source. geist vietnamese wght normal 6Igc OCM7. |
| [index-CpKMegdC.js](../plugin/ui/work-view/assets/index-CpKMegdC.js) | Generated distribution artifact; rebuild from source. index Cp KMegd C. |
| [index-Ddyc58ua.css](../plugin/ui/work-view/assets/index-Ddyc58ua.css) | Generated distribution artifact; rebuild from source. index Ddyc58ua. |
| [on-the-go-iphone-feed-BOm9aG2q.webp](../plugin/ui/work-view/assets/on-the-go-iphone-feed-BOm9aG2q.webp) | Generated distribution artifact; rebuild from source. on the go iphone feed BOm9a G2q. |
| [setup-page-CpAsRFja.css](../plugin/ui/work-view/assets/setup-page-CpAsRFja.css) | Generated distribution artifact; rebuild from source. setup page Cp As RFja. |
| [setup-page-julZevIR.js](../plugin/ui/work-view/assets/setup-page-julZevIR.js) | Generated distribution artifact; rebuild from source. setup page jul Zev IR. |
| [setup-sample-CziYgQNA.js](../plugin/ui/work-view/assets/setup-sample-CziYgQNA.js) | Generated distribution artifact; rebuild from source. setup sample Czi Yg QNA. |

## ragtime/

Email investigation corpus batch processor.

| File | Responsibility |
| --- | --- |
| [LICENSE](../ragtime/LICENSE) | License, copyright or retained attribution notice. |
| [README.md](../ragtime/README.md) | Documentation: Ragtime. |
| [ragtime.ts](../ragtime/ragtime.ts) | Code module: ragtime. |

## scripts/

Build, test, install, maintenance and release tooling.

| File | Responsibility |
| --- | --- |
| [activate-progressive-memory-local.mjs](../scripts/activate-progressive-memory-local.mjs) | Code module: activate progressive memory local. |
| [build-hooks.js](../scripts/build-hooks.js) | Code module: build hooks; exports shellTemplateManifest, verifyClaudeCodeRuntimeHooksAreExecForm. |
| [build-viewer.js](../scripts/build-viewer.js) | Code module: build viewer. |
| [build-worker-binary.js](../scripts/build-worker-binary.js) | Code module: build worker binary. |
| [calibrate-focus-routing.mjs](../scripts/calibrate-focus-routing.mjs) | Code module: calibrate focus routing; exports labeledPairs, scoreCutoff. |
| [check-hook-io-discipline.cjs](../scripts/check-hook-io-discipline.cjs) | Code module: check hook io discipline. |
| [check-pending-queue.ts](../scripts/check-pending-queue.ts) | Code module: check pending queue. |
| [check-postinstall-allowlist.js](../scripts/check-postinstall-allowlist.js) | Code module: check postinstall allowlist. |
| [check-spawn-env-discipline.cjs](../scripts/check-spawn-env-discipline.cjs) | Code module: check spawn env discipline. |
| [claude-mem-sync](../scripts/claude-mem-sync) | Supporting file: claude mem sync. |
| [clear-pending-queue.ts](../scripts/clear-pending-queue.ts) | Code module: clear pending queue. |
| [discord-release-notify.js](../scripts/discord-release-notify.js) | Code module: discord release notify. |
| [e2e-server-docker.sh](../scripts/e2e-server-docker.sh) | Shell automation: e2e server docker. |
| [eval-read-gate.ts](../scripts/eval-read-gate.ts) | Code module: eval read gate; exports FIXTURE_RELATIVE_PATH, LARGE_FIXTURE_RELATIVE_PATH, READ_GATE_DENY_MARKER, SMART_OUTLINE_TOOL, SMART_UNFOLD_TOOL and 30 more. |
| [export-memories.ts](../scripts/export-memories.ts) | Code module: export memories; exports exportMemories. |
| [gen-plugin-lockfile.cjs](../scripts/gen-plugin-lockfile.cjs) | Code module: gen plugin lockfile. |
| [generate-changelog.js](../scripts/generate-changelog.js) | Code module: generate changelog. |
| [grok-bot-session-inject.mjs](../scripts/grok-bot-session-inject.mjs) | Code module: grok bot session inject; exports OBSERVATION_ROW_RE, SUMMARY_ROW_RE, resolveIndexWindow, loadConfig, projectsForAgent and 18 more. |
| [import-memories.ts](../scripts/import-memories.ts) | Code module: import memories. |
| [mirror-dir.cjs](../scripts/mirror-dir.cjs) | Code module: mirror dir. |
| [postinstall-allowlist.js](../scripts/postinstall-allowlist.js) | Code module: postinstall allowlist; exports POSTINSTALL_ALLOWLIST, allowScriptsMap. |
| [pr-babysit-status.ts](../scripts/pr-babysit-status.ts) | Code module: pr babysit status; exports groupChecks, extractActionableHints, summarizeProtection, main. |
| [regenerate-claude-md.ts](../scripts/regenerate-claude-md.ts) | Code module: regenerate claude md. |
| [resolve-data-dir.cjs](../scripts/resolve-data-dir.cjs) | Code module: resolve data dir. |
| [restart-marketplace-worker.cjs](../scripts/restart-marketplace-worker.cjs) | Code module: restart marketplace worker. |
| [seed-focus-areas.mjs](../scripts/seed-focus-areas.mjs) | Code module: seed focus areas; exports UNSURE_P, loadClassification, placementEvidence, mapRoutedToAnchors, buildSeed. |
| [smoke-clean-room.cjs](../scripts/smoke-clean-room.cjs) | Code module: smoke clean room. |
| [strip-comments.ts](../scripts/strip-comments.ts) | Code module: strip comments. |
| [sync-marketplace.cjs](../scripts/sync-marketplace.cjs) | Code module: sync marketplace. |
| [sync-matrix-e2e-supabase.ts](../scripts/sync-matrix-e2e-supabase.ts) | Code module: sync matrix e2e supabase. |
| [sync-matrix-e2e.ts](../scripts/sync-matrix-e2e.ts) | Code module: sync matrix e2e. |
| [sync-plugin-manifests.js](../scripts/sync-plugin-manifests.js) | Code module: sync plugin manifests. |
| [test-lanes.ts](../scripts/test-lanes.ts) | Code module: test lanes; exports filesForLane, WINDOWS_COMMAND_LINE_CHARACTER_LIMIT, commandLineLength, splitTestFilesIntoCommandLineBatches, runTestFilesInBatches. |
| [worker-logs.cjs](../scripts/worker-logs.cjs) | Code module: worker logs. |

## scripts/anti-pattern-test/

Build, test, install, maintenance and release tooling.

| File | Responsibility |
| --- | --- |
| [detect-error-handling-antipatterns.ts](../scripts/anti-pattern-test/detect-error-handling-antipatterns.ts) | Code module: detect error handling antipatterns. |

## scripts/bug-report/

Build, test, install, maintenance and release tooling.

| File | Responsibility |
| --- | --- |
| [cli.ts](../scripts/bug-report/cli.ts) | Code module: cli. |
| [collector.ts](../scripts/bug-report/collector.ts) | Code module: collector; exports SystemDiagnostics, collectDiagnostics, formatDiagnostics. |
| [index.ts](../scripts/bug-report/index.ts) | Code module: index; exports BugReportInput, BugReportResult, generateBugReport. |

## scripts/openrouter-price-history/

Build, test, install, maintenance and release tooling.

| File | Responsibility |
| --- | --- |
| [README.md](../scripts/openrouter-price-history/README.md) | Documentation: openrouter-price-history. |
| [build-dataset.py](../scripts/openrouter-price-history/build-dataset.py) | Python helper: build dataset. |

## scripts/openrouter-price-history/sources/

Build, test, install, maintenance and release tooling.

| File | Responsibility |
| --- | --- |
| [aliases.json](../scripts/openrouter-price-history/sources/aliases.json) | Configuration or structured data: aliases. |
| [popularity-eras.json](../scripts/openrouter-price-history/sources/popularity-eras.json) | Configuration or structured data: popularity eras. |
| [price-ledger-excerpt.json](../scripts/openrouter-price-history/sources/price-ledger-excerpt.json) | Configuration or structured data: price ledger excerpt. |
| [work-days.json](../scripts/openrouter-price-history/sources/work-days.json) | Configuration or structured data: work days. |

## scripts/translate-readme/

Build, test, install, maintenance and release tooling.

| File | Responsibility |
| --- | --- |
| [README.md](../scripts/translate-readme/README.md) | Documentation: README Translator. |
| [cli.ts](../scripts/translate-readme/cli.ts) | Code module: cli. |
| [index.ts](../scripts/translate-readme/index.ts) | Code module: index; exports TranslationOptions, TranslationResult, TranslationJobResult, translateReadme, SUPPORTED_LANGUAGES. |

## services/sync-api/

Hosted sync API runtime and tests.

| File | Responsibility |
| --- | --- |
| [.env.example](../services/sync-api/.env.example) | Supporting file: .env. |
| [.gitignore](../services/sync-api/.gitignore) | Supporting file: . |
| [Dockerfile](../services/sync-api/Dockerfile) | Container image build definition. |
| [bun.lock](../services/sync-api/bun.lock) | Pinned dependency resolution for this package. |
| [fly.toml](../services/sync-api/fly.toml) | Configuration or structured data: fly. |
| [package.json](../services/sync-api/package.json) | Package metadata, dependencies and scripts for cmem-sync-api. |
| [tsconfig.json](../services/sync-api/tsconfig.json) | Configuration or structured data: tsconfig. |

## services/sync-api/src/

Hosted sync API runtime and tests.

| File | Responsibility |
| --- | --- |
| [auth.ts](../services/sync-api/src/auth.ts) | Code module: auth; exports json, errorResponse, AuthDependencies, __resetAuthVerdictMemoryForTests, defaultAuthDependencies and 4 more. |
| [canonical-content.ts](../services/sync-api/src/canonical-content.ts) | Code module: canonical content; exports CONTENT_BODY_SCHEMA_VERSION, CONTENT_PAYLOAD_SCHEMA_VERSION, CONTENT_BODY_MAX_BYTES, ContentKind, CanonicalKind and 15 more. |
| [env.ts](../services/sync-api/src/env.ts) | Code module: env; exports SyncApiEnv, AUTH_CACHE_TTL_MIN_SECONDS, AUTH_CACHE_TTL_MAX_SECONDS, AUTH_CACHE_TTL_DEFAULT_SECONDS, formatHostForUrl and 2 more. |
| [forward.ts](../services/sync-api/src/forward.ts) | Code module: forward; exports buildForwardUrl, handleForwardRequest, ForwardProxyApp, startForwardProxy. |
| [index.ts](../services/sync-api/src/index.ts) | Code module: index; exports SyncApiTimeouts, DEFAULT_SYNC_API_TIMEOUTS, SyncApiApp, startSyncApi. |
| [projection-protocol.ts](../services/sync-api/src/projection-protocol.ts) | Code module: projection protocol; exports PROJECTION_PROTOCOL_VERSION, PROJECTION_PAGE_MAX_OPS, PROJECTION_PAGE_MAX_BYTES, PROJECTION_FETCH_TIMEOUT_MS, ProjectionWireOp and 4 more. |
| [projection.ts](../services/sync-api/src/projection.ts) | Code module: projection; exports POLL_PUSH_DRAIN_MAX_PAGES, REPAIR_DRAIN_MAX_PAGES, DrainResult, ProjectionFetchResult, ProjectionFetch and 4 more. |
| [schema.ts](../services/sync-api/src/schema.ts) | Code module: schema; exports SCHEMA_SQL, applyMigrations. |
| [sockets.ts](../services/sync-api/src/sockets.ts) | Code module: sockets; exports RegisteredSocket, SocketRegistry. |
| [store.ts](../services/sync-api/src/store.ts) | Code module: store; exports MAX_DEVICES_PER_USER, DEVICE_LIMIT_ERROR, PROJECTION_LEASE_MS, DEFAULT_USER_TURN_MAX_WAIT_MS, PushOp and 17 more. |
| [user-queue.ts](../services/sync-api/src/user-queue.ts) | Code module: user queue; exports SYNC_HUB_BUSY_ERROR, CLIENT_CLOSED_REQUEST_ERROR, UserTurnOptions, UserQueue. |

## services/sync-api/test/

Hosted sync API runtime and tests.

| File | Responsibility |
| --- | --- |
| [auth.test.ts](../services/sync-api/test/auth.test.ts) | Behavior checks for auth test ts. |
| [forward.test.ts](../services/sync-api/test/forward.test.ts) | Behavior checks for forward test ts. |
| [health.test.ts](../services/sync-api/test/health.test.ts) | Behavior checks for health test ts. |
| [helpers.ts](../services/sync-api/test/helpers.ts) | Code module: helpers; exports PROJECTOR_SECRET, DEFAULT_DATABASE_URL, ProjectionRequest, SidecarState, startSidecar and 7 more. |
| [ipv6-host-url.test.ts](../services/sync-api/test/ipv6-host-url.test.ts) | Behavior checks for ipv6 host url test ts. |
| [lock-hold.test.ts](../services/sync-api/test/lock-hold.test.ts) | Behavior checks for lock hold test ts. |
| [protocol.test.ts](../services/sync-api/test/protocol.test.ts) | Behavior checks for protocol test ts. |
| [query-plan.test.ts](../services/sync-api/test/query-plan.test.ts) | Behavior checks for query plan test ts. |
| [ws.test.ts](../services/sync-api/test/ws.test.ts) | Behavior checks for ws test ts. |

## src/build/

Application source.

| File | Responsibility |
| --- | --- |
| [hook-shell-template.ts](../src/build/hook-shell-template.ts) | Code module: hook shell template; exports ShellTemplateHost, ShellTemplateOptions, buildCodexWindowsCommand, buildShellCommand, ExecHookCommand and 3 more. |

## src/cli/

Application source.

| File | Responsibility |
| --- | --- |
| [claude-md-commands.ts](../src/cli/claude-md-commands.ts) | Code module: claude md commands; exports makeFolderChildMatcher, generateClaudeMd, cleanClaudeMd. |
| [deliverables-capture.ts](../src/cli/deliverables-capture.ts) | Code module: deliverables capture; exports DELIVERABLES_PER_STOP, isDeliverablesCaptureEnabled, deliverableKind, deliverableRoots, resolveCandidatePath and 8 more. |
| [hook-command.ts](../src/cli/hook-command.ts) | Code module: hook command; exports HookCommandOptions, buildNoOpResult, isNonBlockingHookInputError, hookCommand. |
| [hook-original-cwd.ts](../src/cli/hook-original-cwd.ts) | Code module: hook original cwd; exports HOOK_ORIGINAL_CWD_ENV, restoreHookOriginalCwd. |
| [spool-hook-event.ts](../src/cli/spool-hook-event.ts) | Code module: spool hook event; exports SPOOL_NUDGE_TIMEOUT_MS, uploadRemoteHookSpool, nudgeWorkerToDrainHookSpool, settleHookSpoolNudges, spoolHookEvent. |
| [stdin-reader.ts](../src/cli/stdin-reader.ts) | Code module: stdin reader; exports SAFETY_TIMEOUT_MS, ReadJsonFromStdinOptions, readJsonFromStdin. |
| [types.ts](../src/cli/types.ts) | Code module: types; exports NormalizedHookInput, HookResult, PlatformAdapter, EventHandler. |
| [work-state-telemetry.ts](../src/cli/work-state-telemetry.ts) | Code module: work state telemetry; exports workStateModelText, spoolWorkStateInstruction, spoolWorkStateMcpResult. |

## src/cli/adapters/

Application source.

| File | Responsibility |
| --- | --- |
| [antigravity-cli.ts](../src/cli/adapters/antigravity-cli.ts) | Code module: antigravity cli; exports AntigravityTurnState, inspectAntigravityTurn, resolveAntigravityPreInvocation, antigravityCliAdapter. |
| [claude-code.ts](../src/cli/adapters/claude-code.ts) | Code module: claude code; exports normalizeSubmittedPrompt, claudeCodeAdapter. |
| [codex-file-context.ts](../src/cli/adapters/codex-file-context.ts) | Code module: codex file context; exports expandHomeDirectory, extractFilePaths. |
| [codex.ts](../src/cli/adapters/codex.ts) | Code module: codex; exports codexAdapter. |
| [cursor.ts](../src/cli/adapters/cursor.ts) | Code module: cursor; exports deriveCursorTranscriptPath, cursorAdapter. |
| [errors.ts](../src/cli/adapters/errors.ts) | Code module: errors; exports AdapterRejectedInput, isValidCwd. |
| [index.ts](../src/cli/adapters/index.ts) | Code module: index; exports getPlatformAdapter. |
| [kimi.ts](../src/cli/adapters/kimi.ts) | Code module: kimi; exports deriveKimiTranscriptPath, kimiAdapter. |
| [raw.ts](../src/cli/adapters/raw.ts) | Code module: raw; exports rawAdapter. |
| [windsurf.ts](../src/cli/adapters/windsurf.ts) | Code module: windsurf; exports windsurfAdapter. |

## src/cli/handlers/

Application source.

| File | Responsibility |
| --- | --- |
| [context.ts](../src/cli/handlers/context.ts) | Code module: context; exports TEAM_BRIEF_TIMEOUT_MS, teamBriefSection, sessionStartBannerFooter, composeSessionStartSystemMessage, fitTeamBriefSection and 2 more. |
| [file-context-dedupe.ts](../src/cli/handlers/file-context-dedupe.ts) | Code module: file context dedupe; exports claimFileContextInjection. |
| [file-context.ts](../src/cli/handlers/file-context.ts) | Code module: file context; exports FILE_READ_GATE_DENY_MIN_BYTES, FILE_CONTEXT_WORKER_BUDGET_MS, LINE_COUNT_CHUNK_BYTES, fileHasMoreLinesThan, shouldDenyFullFileRead and 2 more. |
| [file-edit.ts](../src/cli/handlers/file-edit.ts) | Code module: file edit; exports fileEditHandler. |
| [index.ts](../src/cli/handlers/index.ts) | Code module: index; exports EventType, sessionInitContextHandler, observationWithPendingTimelineHandler, runAntigravityPreInvocation, sessionInitWithAntigravityTurnsHandler and 1 more. |
| [memory-search.ts](../src/cli/handlers/memory-search.ts) | Code module: memory search; exports boundMemoryQuery, memorySearchLookup, memorySearchQuery, memorySearchHandler. |
| [observation.ts](../src/cli/handlers/observation.ts) | Code module: observation; exports observationHandler. |
| [post-compact.ts](../src/cli/handlers/post-compact.ts) | Code module: post compact; exports postCompactHandler. |
| [session-end.ts](../src/cli/handlers/session-end.ts) | Code module: session end; exports sessionEndHandler. |
| [session-init.ts](../src/cli/handlers/session-init.ts) | Code module: session init; exports setSessionInitDependenciesForTesting, SessionPromptNotRecordedError, sessionInitHandler, recordSessionPrompt, isQwenTranscriptPath and 1 more. |
| [subagent-context.ts](../src/cli/handlers/subagent-context.ts) | Code module: subagent context; exports subagentContextHandler. |
| [subagent-stop.ts](../src/cli/handlers/subagent-stop.ts) | Code module: subagent stop; exports subagentStopHandler. |
| [summarize.ts](../src/cli/handlers/summarize.ts) | Code module: summarize; exports summarizeHandler. |
| [user-message.ts](../src/cli/handlers/user-message.ts) | Code module: user message; exports userMessageHandler. |

## src/core/schemas/

Application source.

| File | Responsibility |
| --- | --- |
| [agent-event.ts](../src/core/schemas/agent-event.ts) | Code module: agent event; exports AgentEventSourceTypeSchema, AgentEventSchema, CreateAgentEventSchema, AgentEventSourceType, AgentEvent and 1 more. |
| [auth.ts](../src/core/schemas/auth.ts) | Code module: auth; exports ApiKeyStatusSchema, AuditActorTypeSchema, ApiKeySchema, CreateApiKeySchema, AuditLogSchema and 7 more. |
| [memory-item.ts](../src/core/schemas/memory-item.ts) | Code module: memory item; exports MemoryItemKindSchema, MemorySourceTypeSchema, MemoryItemSchema, CreateMemoryItemSchema, UpdateMemoryItemSchema and 8 more. |
| [project.ts](../src/core/schemas/project.ts) | Code module: project; exports ProjectSchema, CreateProjectSchema, Project, CreateProject. |
| [session.ts](../src/core/schemas/session.ts) | Code module: session; exports ServerSessionStatusSchema, ServerSessionSchema, CreateServerSessionSchema, ServerSessionStatus, ServerSession and 1 more. |
| [team.ts](../src/core/schemas/team.ts) | Code module: team; exports TeamRoleSchema, TeamSchema, CreateTeamSchema, TeamMemberSchema, CreateTeamMemberSchema and 5 more. |

## src/hooks/

Application source.

| File | Responsibility |
| --- | --- |
| [hook-response.ts](../src/hooks/hook-response.ts) | Code module: hook response; exports STANDARD_HOOK_RESPONSE. |

## src/integrations/

Application source.

| File | Responsibility |
| --- | --- |
| [harness-worker.ts](../src/integrations/harness-worker.ts) | Code module: harness worker; exports resolveHarnessWorkerUrl, resolveHarnessContextTimeoutMs, startHarnessWorker, createHarnessWorkerClient. |

## src/launcher/

Application source.

| File | Responsibility |
| --- | --- |
| [bun-be-bun-support.ts](../src/launcher/bun-be-bun-support.ts) | Code module: bun be bun support; exports MINIMUM_BUN_VERSION_FOR_BUN_BE_BUN, bunVersionHonoursBunBeBun. |
| [bun-runtime.ts](../src/launcher/bun-runtime.ts) | Code module: bun runtime; exports BUN_PATH_LOOKUP_TIMEOUT_MS, findBun. |
| [claude-mem-launcher.ts](../src/launcher/claude-mem-launcher.ts) | Code module: claude mem launcher. |
| [ensure-launcher.ts](../src/launcher/ensure-launcher.ts) | Code module: ensure launcher. |
| [install-launcher.ts](../src/launcher/install-launcher.ts) | Code module: install launcher; exports LauncherHostEnvironment, currentLauncherHostEnvironment, LauncherInstallLogger, resolveLauncherBinDirectory, launcherBinaryFileName and 26 more. |
| [launcher-protocol.ts](../src/launcher/launcher-protocol.ts) | Code module: launcher protocol; exports LAUNCHER_PROTOCOL. |

## src/npx-cli/

npm installation/management command-line interface.

| File | Responsibility |
| --- | --- |
| [banner-frames.ts](../src/npx-cli/banner-frames.ts) | Code module: banner frames; exports BannerData, BANNER. |
| [banner.ts](../src/npx-cli/banner.ts) | Code module: banner; exports FrameCell, parseFrameCells, downsampleFrameCells, FrameRenderOptions, renderFrameCells and 3 more. |
| [cmem-memory-credentials.ts](../src/npx-cli/cmem-memory-credentials.ts) | Code module: cmem memory credentials; exports HOST_OBSERVER_DEFAULT_PORT, HOST_OBSERVER_DUMMY_API_KEY, HostObserverPortStatus, HostObserverPortProbe, HostObserverUnavailableError and 12 more. |
| [cmem-pro-costs.ts](../src/npx-cli/cmem-pro-costs.ts) | Code module: cmem pro costs; exports PROVIDER_PROMPT_MESSAGE, ProviderLabels, buildProviderLabels, CMEM_INSTALLER_OAUTH_START_URL, CMEM_INSTALLER_OAUTH_POLL_URL and 2 more. |
| [index.ts](../src/npx-cli/index.ts) | Code module: index. |
| [installer-provider-choice.ts](../src/npx-cli/installer-provider-choice.ts) | Code module: installer provider choice; exports resolveInstallerProviderChoice. |

## src/npx-cli/commands/

npm installation/management command-line interface.

| File | Responsibility |
| --- | --- |
| [backup.ts](../src/npx-cli/commands/backup.ts) | Code module: backup; exports fetchWorkerBackupApi, runBackupCommand. |
| [doctor.ts](../src/npx-cli/commands/doctor.ts) | Code module: doctor; exports CheckResult, probeChromaDiagnostics, pluginRootCheck, treeSitterCliCheck, marketplaceManifestCheck and 4 more. |
| [ide-detection.ts](../src/npx-cli/commands/ide-detection.ts) | Code module: ide detection; exports IDEInfo, initialIDESelection, detectInstalledIDEs. |
| [install.ts](../src/npx-cli/commands/install.ts) | Code module: install; exports log, disableClaudeAutoMemory, makeIDETask, claudeCodeInstallCommand, writeTrimmedMarketplaceManifest and 37 more. |
| [prune.ts](../src/npx-cli/commands/prune.ts) | Code module: prune; exports runPruneCommand. |
| [restore.ts](../src/npx-cli/commands/restore.ts) | Code module: restore; exports runRestoreCommand. |
| [runtime.ts](../src/npx-cli/commands/runtime.ts) | Code module: runtime; exports serverVectorSearchAllowed, runServerStartCommand, runServerStopCommand, runServerRestartCommand, runServerStatusCommand and 14 more. |
| [server-jobs.ts](../src/npx-cli/commands/server-jobs.ts) | Code module: server jobs; exports runServerJobsCommand, ServerJobsTestSeams, __setServerJobsTestSeams, __clearServerJobsTestSeams. |
| [server-runtime-setup.ts](../src/npx-cli/commands/server-runtime-setup.ts) | Code module: server runtime setup; exports InstallRuntimeId, normalizeRuntimeFlag, SERVER_RUNTIME_SETTINGS_KEYS. |
| [server.ts](../src/npx-cli/commands/server.ts) | Code module: server; exports runServerCommand, runWorkerAliasCommand. |
| [teambrain.ts](../src/npx-cli/commands/teambrain.ts) | Code module: teambrain; exports InviteParse, parseTeamBrainInvite, ShareChoice, parseShareFlags, membershipForChoice and 5 more. |
| [telemetry.ts](../src/npx-cli/commands/telemetry.ts) | Code module: telemetry; exports runTelemetryCommand. |
| [uninstall.ts](../src/npx-cli/commands/uninstall.ts) | Code module: uninstall; exports clearServerRuntimeSettings, removeFromClaudeSettings, removeStrayClaudeMemPaths, uninstallShutdownNotice, runUninstallCommand. |

## src/npx-cli/install/

npm installation/management command-line interface.

| File | Responsibility |
| --- | --- |
| [browser-setup.ts](../src/npx-cli/install/browser-setup.ts) | Code module: browser setup; exports BrowserCheckout, shouldUseBrowserSetup, BrowserSetupDeps, BrowserSetupOutcome, setupPageUrl and 4 more. |
| [claude-code-version.ts](../src/npx-cli/install/claude-code-version.ts) | Code module: claude code version; exports MINIMUM_CLAUDE_CODE_VERSION_FOR_EXEC_FORM_HOOKS, detectClaudeCodeVersion, claudeCodeVersionTooOldWarning. |
| [error-reporter.ts](../src/npx-cli/install/error-reporter.ts) | Code module: error reporter; exports InstallAbortError, ErrorContext, InstallWarning, InstallSummary, createInstallSummary and 3 more. |
| [error-taxonomy.ts](../src/npx-cli/install/error-taxonomy.ts) | Code module: error taxonomy; exports ErrorSeverity, RemediationContext, MatchContext, ErrorCategory, ERROR_CATEGORIES and 1 more. |
| [npm-install-helper.ts](../src/npx-cli/install/npm-install-helper.ts) | Code module: npm install helper; exports NpmResult, resolveInstallTimeoutMs, isEresolve, extractEresolveBlock, npmErrorCode and 2 more. |
| [setup-runtime.ts](../src/npx-cli/install/setup-runtime.ts) | Code module: setup runtime; exports platformBunRemediation, platformUvRemediation, uvCommonPaths, getBunPath, getBunVersion and 11 more. |
| [tool-path.ts](../src/npx-cli/install/tool-path.ts) | Code module: tool path; exports bunCommonPaths, spawnVersionProbe, getToolPath, findBunExecutablePath. |
| [usage-summary.ts](../src/npx-cli/install/usage-summary.ts) | Code module: usage summary; exports USAGE_WINDOW_DAYS, UsageDay, UsageSummary, usageWindowStartMs, buildUsageSummary and 5 more. |

## src/npx-cli/utils/

npm installation/management command-line interface.

| File | Responsibility |
| --- | --- |
| [paths.ts](../src/npx-cli/utils/paths.ts) | Code module: paths; exports IS_WINDOWS, claudeConfigDirectory, marketplaceDirectory, pluginsDirectory, knownMarketplacesPath and 8 more. |
| [prune-cache.ts](../src/npx-cli/utils/prune-cache.ts) | Code module: prune cache; exports DEFAULT_CACHE_RETENTION, CachePrunePlan, PlanCachePruneOptions, planCachePrune, readCacheVersionDirectories and 12 more. |
| [settings.ts](../src/npx-cli/utils/settings.ts) | Code module: settings; exports readFlatSettings. |
| [windows-git-bash-preflight.ts](../src/npx-cli/utils/windows-git-bash-preflight.ts) | Code module: windows git bash preflight; exports STANDARD_GIT_BASH_PATHS, GIT_BASH_REMEDIATION, GitBashProbe, GitBashPreflightResult, checkWindowsGitBash. |

## src/sdk/

Application source.

| File | Responsibility |
| --- | --- |
| [hardened-options.ts](../src/sdk/hardened-options.ts) | Code module: hardened options; exports OBSERVER_DISALLOWED_TOOLS, ObserverThinkingOption, DEFAULT_OBSERVER_THINKING_BUDGET_TOKENS, resolveObserverThinkingOption, HardenedSdkOptionsInput and 1 more. |
| [output-classifier.ts](../src/sdk/output-classifier.ts) | Code module: output classifier; exports ObserverOutputClass, previewOutput, ObserverOutputShape, ObserverOutputShapeReport, describeObserverOutputShape and 7 more. |
| [parser.ts](../src/sdk/parser.ts) | Code module: parser; exports ParsedObservation, ParsedSummary, ParseResult, parseAgentXml. |
| [prompts.ts](../src/sdk/prompts.ts) | Code module: prompts; exports SUMMARY_MODE_MARKER, Observation, SDKSession, buildInitPrompt, wrapPriorContext and 10 more. |

## src/server/auth/

Application source.

| File | Responsibility |
| --- | --- |
| [BetterAuthRoutes.ts](../src/server/auth/BetterAuthRoutes.ts) | Code module: Better Auth Routes; exports BetterAuthRoutes. |
| [auth.ts](../src/server/auth/auth.ts) | Code module: auth; exports createAuth. |
| [sqlite-api-key-service.ts](../src/server/auth/sqlite-api-key-service.ts) | Code module: sqlite api key service; exports CreatedServerApiKey, VerifiedServerApiKey, CreateServerApiKeyInput, DEFAULT_LOCAL_API_KEY_SCOPES, hashServerApiKey and 9 more. |

## src/server/compat/

Application source.

| File | Responsibility |
| --- | --- |
| [SessionsObservationsAdapter.ts](../src/server/compat/SessionsObservationsAdapter.ts) | Code module: Sessions Observations Adapter; exports SessionsObservationsAdapterOptions, SessionsObservationsAdapter, resolveServerSession. |
| [SessionsSummarizeAdapter.ts](../src/server/compat/SessionsSummarizeAdapter.ts) | Code module: Sessions Summarize Adapter; exports SessionsSummarizeAdapterOptions, SessionsSummarizeAdapter. |

## src/server/generation/

Application source.

| File | Responsibility |
| --- | --- |
| [ProviderObservationGenerator.ts](../src/server/generation/ProviderObservationGenerator.ts) | Code module: Provider Observation Generator; exports ServerGenerationScopeViolationError, ServerGenerationTerminalOutcomeError, ProviderObservationGeneratorOptions, DEFAULT_PROVIDER_GENERATE_TIMEOUT_M |
| [processGeneratedResponse.ts](../src/server/generation/processGeneratedResponse.ts) | Code module: process Generated Response; exports ProcessGeneratedResponseOutcome, ProcessGeneratedResponseInput, processGeneratedResponse, MarkGenerationFailedInput, markGenerationFailed and 1 more. |
| [reclaimStaleProcessingJobs.ts](../src/server/generation/reclaimStaleProcessingJobs.ts) | Code module: reclaim Stale Processing Jobs; exports ReclaimQueue, ReclaimStaleProcessingJobsOptions, ReclaimResult, reclaimStaleProcessingJobs. |

## src/server/generation/providers/

Application source.

| File | Responsibility |
| --- | --- |
| [ClaudeObservationProvider.ts](../src/server/generation/providers/ClaudeObservationProvider.ts) | Code module: Claude Observation Provider; exports DEFAULT_SERVER_CLAUDE_MODEL, ClaudeObservationProviderOptions, resolveAnthropicMessagesUrl, ClaudeObservationProvider, classifyClaudeServerError. |
| [GeminiObservationProvider.ts](../src/server/generation/providers/GeminiObservationProvider.ts) | Code module: Gemini Observation Provider; exports GEMINI_API_URL, GeminiObservationProviderOptions, GeminiBadRequestCategory, categorizeGeminiBadRequest, classifyGeminiServerError and 1 more. |
| [OpenRouterObservationProvider.ts](../src/server/generation/providers/OpenRouterObservationProvider.ts) | Code module: Open Router Observation Provider; exports OpenRouterObservationProviderOptions, OpenRouterObservationProvider. |

## src/server/generation/providers/shared/

Application source.

| File | Responsibility |
| --- | --- |
| [error-classification.ts](../src/server/generation/providers/shared/error-classification.ts) | Code module: error classification; exports ServerProviderErrorClass, ServerPaidSendOutcome, SERVER_MAX_PAID_SENDS_PER_JOB, ServerClassifiedProviderError, serverPaidSendOutcomeOf and 2 more. |
| [prompt-builder.ts](../src/server/generation/providers/shared/prompt-builder.ts) | Code module: prompt builder; exports BuildServerPromptResult, buildServerGenerationPrompt, eventBlockBytes. |
| [types.ts](../src/server/generation/providers/shared/types.ts) | Code module: types; exports ServerGenerationContext, ServerGenerationResult, ServerGenerationProvider. |

## src/server/jobs/

Application source.

| File | Responsibility |
| --- | --- |
| [ServerJobQueue.ts](../src/server/jobs/ServerJobQueue.ts) | Code module: Server Job Queue; exports ServerJobCounts, ServerJobLifecycleCounters, ServerJobObservedListener, ServerJobQueueOptions, ServerJobQueue. |
| [job-id.ts](../src/server/jobs/job-id.ts) | Code module: job id; exports ServerJobIdParts, buildServerJobId. |
| [types.ts](../src/server/jobs/types.ts) | Code module: types; exports ServerGenerationJobKind, ServerGenerationJobStatus, ServerGenerationJob, GenerateObservationsForEventJob, GenerateSessionSummaryJob and 8 more. |

## src/server/mcp/

Application source.

| File | Responsibility |
| --- | --- |
| [recall-mcp-server.ts](../src/server/mcp/recall-mcp-server.ts) | Code module: recall mcp server; exports RecallBackend, createRecallMcpServer, RECALL_MCP_TOOLS. |

## src/server/middleware/

Application source.

| File | Responsibility |
| --- | --- |
| [auth.ts](../src/server/middleware/auth.ts) | Code module: auth; exports AuthContext, RequireAuthOptions, requireServerAuth. |
| [postgres-auth.ts](../src/server/middleware/postgres-auth.ts) | Code module: postgres auth; exports PostgresRequireAuthOptions, requirePostgresServerAuth, verifyPostgresApiKey. |
| [rate-limit.ts](../src/server/middleware/rate-limit.ts) | Code module: rate limit; exports requireRateLimit, requireMonthlyQuota. |
| [request-auth-helpers.ts](../src/server/middleware/request-auth-helpers.ts) | Code module: request auth helpers; exports parseBearerToken, isLocalhost, hasLoopbackHostHeader, parseHostWithoutPort, hasForwardedClientHeaders. |
| [request-id.ts](../src/server/middleware/request-id.ts) | Code module: request id; exports requestIdMiddleware, isAcceptableRequestId. |
| [usage-metering.ts](../src/server/middleware/usage-metering.ts) | Code module: usage metering; exports meterRequests. |

## src/server/queue/

Application source.

| File | Responsibility |
| --- | --- |
| [queue-health-types.ts](../src/server/queue/queue-health-types.ts) | Code module: queue health types; exports ObservationQueueHealthLaneSnapshot, ObservationQueueHealth. |
| [redis-config.ts](../src/server/queue/redis-config.ts) | Code module: redis config; exports ObservationQueueEngineName, RedisMode, RedisQueueConfig, getObservationQueueEngineName, getRedisQueueConfig. |

## src/server/routes/v1/

Application source.

| File | Responsibility |
| --- | --- |
| [ServerV1PostgresRoutes.ts](../src/server/routes/v1/ServerV1PostgresRoutes.ts) | Code module: Server V1Postgres Routes; exports ServerV1PostgresRoutesOptions, ServerV1PostgresRoutes. |
| [ServerV1Routes.ts](../src/server/routes/v1/ServerV1Routes.ts) | Code module: Server V1Routes; exports ServerV1RoutesOptions, ServerV1Routes. |

## src/server/runtime/

Application source.

| File | Responsibility |
| --- | --- |
| [ActiveServerGenerationWorkerManager.ts](../src/server/runtime/ActiveServerGenerationWorkerManager.ts) | Code module: Active Server Generation Worker Manager; exports ActiveServerGenerationWorkerManagerOptions, ActiveServerGenerationWorkerManager. |
| [ActiveServerQueueManager.ts](../src/server/runtime/ActiveServerQueueManager.ts) | Code module: Active Server Queue Manager; exports MAX_SERVER_GENERATION_CONCURRENCY_PER_LANE, resolveServerGenerationConcurrency, ActiveServerQueueManager. |
| [ServerService.ts](../src/server/runtime/ServerService.ts) | Code module: Server Service; exports ServerServiceOptions, ServerRuntimeState, ServerService, startCommandWantsDaemon, runServerServiceCli and 5 more. |
| [ServerViewerRoutes.ts](../src/server/runtime/ServerViewerRoutes.ts) | Code module: Server Viewer Routes; exports ServerViewerRoutes. |
| [SessionGenerationPolicy.ts](../src/server/runtime/SessionGenerationPolicy.ts) | Code module: Session Generation Policy; exports BuildSummaryJobInput, buildSummaryJobId, buildSummaryJobPayload. |
| [create-server-service.ts](../src/server/runtime/create-server-service.ts) | Code module: create server service; exports CreateServerServiceOptions, ServerEnvValidationOptions, ServerEnvValidationResult, detectDockerEnvironment, validateServerEnv and 8 more. |
| [types.ts](../src/server/runtime/types.ts) | Code module: types; exports ServerRuntimeName, ServerAuthMode, DisabledBoundaryStatus, ServerBoundaryStatus, ServerBootstrapStatus and 7 more. |

## src/server/services/

Application source.

| File | Responsibility |
| --- | --- |
| [EndSessionService.ts](../src/server/services/EndSessionService.ts) | Code module: End Session Service; exports EndSessionServiceOptions, EndSessionResult, EndSessionInput, EndSessionService. |
| [IngestEventsService.ts](../src/server/services/IngestEventsService.ts) | Code module: Ingest Events Service; exports EnqueueOutcome, IngestEventsServiceOptions, EventQueueLike, IngestEventResult, IngestEventOptions and 1 more. |
| [ObservationEmbeddingService.ts](../src/server/services/ObservationEmbeddingService.ts) | Code module: Observation Embedding Service; exports getSharedEmbedder, capEmbedderThreadsForBackfill, vectorSearchMode, VectorSearchStatus, getVectorSearchStatus and 6 more. |

## src/servers/

MCP server entrypoints and tools.

| File | Responsibility |
| --- | --- |
| [checkout-search-scope.ts](../src/servers/checkout-search-scope.ts) | Code module: checkout search scope; exports withCheckoutProjects. |
| [corpus-worker-stream.ts](../src/servers/corpus-worker-stream.ts) | Code module: corpus worker stream; exports CORPUS_STREAM_IDLE_TIMEOUT_MS, CORPUS_STREAM_ABSOLUTE_CAP_MS, CorpusStreamTiming, postCorpusRequestOverSse. |
| [mcp-http.ts](../src/servers/mcp-http.ts) | Code module: mcp http; exports CWD_HEADER, MCP_HTTP_PATH, DEFAULT_HTTP_HOST, DEFAULT_HTTP_PORT, MAX_SESSIONS and 8 more. |
| [mcp-project-cwd.ts](../src/servers/mcp-project-cwd.ts) | Code module: mcp project cwd; exports MCP_ROOTS_TIMEOUT_MS, MAX_MCP_ROOTS_ATTEMPTS, McpCwdSource, McpCwdResolution, normalizeCwd and 4 more. |
| [mcp-server.ts](../src/servers/mcp-server.ts) | Code module: mcp server. |
| [mcp-text-format.ts](../src/servers/mcp-text-format.ts) | Code module: mcp text format; exports McpTextPurpose, McpTextResult, mcpTextResult, formatMcpPayload, formatWorkerMcpResponse and 2 more. |
| [mcp-tool-visibility.ts](../src/servers/mcp-tool-visibility.ts) | Code module: mcp tool visibility; exports SERVER_BETA_ONLY_TOOL_NAMES, getAdvertisedMcpToolsForRuntime, WORK_STATE_TOOL_NAMES, withoutDisabledWorkStateTools, TEAMBRAIN_TOOL_NAMES and 1 more. |
| [request-context.ts](../src/servers/request-context.ts) | Code module: request context; exports runWithCwd, getRequestCwd. |
| [worker-restart.ts](../src/servers/worker-restart.ts) | Code module: worker restart; exports withWorkerRestartOnRefusedConnection. |

## src/services/

Application source.

| File | Responsibility |
| --- | --- |
| [context-generator.ts](../src/services/context-generator.ts) | Code module: context generator. |
| [restart-verify.ts](../src/services/restart-verify.ts) | Code module: restart verify; exports RestartVerifyOptions, RestartVerifyResult, getCurrentWorkerPid, verifyRestartedWorker. |
| [worker-service.ts](../src/services/worker-service.ts) | Code module: worker service; exports WORKER_BOOT_FAILED_EXIT_CODE, COMMANDS_THAT_ACT_ON_CALLER_PROJECT, StatusOutput, CodexSessionStartOutput, buildStatusOutput and 7 more. |
| [worker-shutdown.ts](../src/services/worker-shutdown.ts) | Code module: worker shutdown; exports WorkerShutdownReason, WORKER_GRACEFUL_SHUTDOWN_DEADLINE_BASE_MS, RestartHandoffDeps, ShutdownSequenceOptions, runShutdownSequence. |
| [worker-spawner.ts](../src/services/worker-spawner.ts) | Code module: worker spawner; exports WorkerStartResult, getLastWorkerBootFailure, ensureWorkerStarted. |
| [worker-types.ts](../src/services/worker-types.ts) | Code module: worker types; exports ConversationMessage, ActiveSession, PendingMessage, PendingMessageWithId, ObservationData and 8 more. |

## src/services/agent-runner/

Application source.

| File | Responsibility |
| --- | --- |
| [detect.ts](../src/services/agent-runner/detect.ts) | Code module: detect; exports UsableAgentId, UsableAgent, CommandResult, CommandOptions, runCommand and 5 more. |
| [run.ts](../src/services/agent-runner/run.ts) | Code module: run; exports StepModel, StepModels, AnswerSchema, AskAgent, ClaudeCodeTaskOptions and 7 more. |
| [runtime-read-roots.ts](../src/services/agent-runner/runtime-read-roots.ts) | Code module: runtime read roots; exports runtimeReadRoots. |

## src/services/backup/

Application source.

| File | Responsibility |
| --- | --- |
| [BackupManager.ts](../src/services/backup/BackupManager.ts) | Code module: Backup Manager; exports BackupSettingKeys, BackupManagerOptions, BackupSnapshotResult, BackupStatus, BackupManager. |
| [restore-swap.ts](../src/services/backup/restore-swap.ts) | Code module: restore swap; exports SwapResult, SwapOptions, swapDatabaseFromSnapshot, applyPendingRestore. |
| [snapshot-files.ts](../src/services/backup/snapshot-files.ts) | Code module: snapshot files; exports SNAPSHOT_FILE_PATTERN, resolveSnapshotInside, PendingRestore, LastRestoreResult, stagePendingRestore and 4 more. |
| [sqlite-file-job.ts](../src/services/backup/sqlite-file-job.ts) | Code module: sqlite file job; exports SqliteFileJob, SqliteFileJobResult, runSqliteFileJob. |

## src/services/context/

Injected-memory selection and rendering.

| File | Responsibility |
| --- | --- |
| [ContextBudget.ts](../src/services/context/ContextBudget.ts) | Code module: Context Budget; exports CONTEXT_OUTPUT_LIMIT, TERMINAL_BANNER_RESERVE_CHARS, ContextBudgetResult, fitContextToBudget. |
| [ContextBuilder.ts](../src/services/context/ContextBuilder.ts) | Code module: Context Builder; exports ContextInjectStats, withObserverHealthWarning, observerHealthWarning, healthWarningForContext, fitContextForDelivery and 5 more. |
| [ContextConfigLoader.ts](../src/services/context/ContextConfigLoader.ts) | Code module: Context Config Loader; exports loadContextConfig. |
| [ContextReadProtocol.ts](../src/services/context/ContextReadProtocol.ts) | Code module: Context Read Protocol; exports ContextReadOptions, ContextReadResult, ContextRenderRequest, ContextReadExecutor, ContextReadMethods and 2 more. |
| [ContextReadWorkerClient.ts](../src/services/context/ContextReadWorkerClient.ts) | Code module: Context Read Worker Client; exports ContextReadWorkerClient, getContextReadWorker, closeContextReadWorker. |
| [ObservationCompiler.ts](../src/services/context/ObservationCompiler.ts) | Code module: Observation Compiler; exports queryObservationsMulti, queryObservationsNewest, countObservationsByProjects, querySummariesMulti, cwdToDashed and 5 more. |
| [ServerContextRows.ts](../src/services/context/ServerContextRows.ts) | Code module: Server Context Rows; exports ServerContextRows, fetchServerContextRows, toLocalObservationShape, toLocalSummaryShape. |
| [TokenCalculator.ts](../src/services/context/TokenCalculator.ts) | Code module: Token Calculator; exports ObservationTokenFields, calculateObservationTokens, calculateTokenEconomics, combineTokenEconomics, getWorkEmoji and 2 more. |
| [context-read-worker.ts](../src/services/context/context-read-worker.ts) | Code module: context read worker. |
| [types.ts](../src/services/context/types.ts) | Code module: types; exports ContextInput, ContextConfig, Observation, SessionSummary, LocalObservation and 8 more. |

## src/services/context/formatters/

Injected-memory selection and rendering.

| File | Responsibility |
| --- | --- |
| [AgentFormatter.ts](../src/services/context/formatters/AgentFormatter.ts) | Code module: Agent Formatter; exports renderAgentHeader, renderAgentLegend, renderAgentContextEconomics, renderAgentDayHeader, renderAgentTableRow and 6 more. |
| [HumanFormatter.ts](../src/services/context/formatters/HumanFormatter.ts) | Code module: Human Formatter; exports renderHumanHeader, renderHumanLegend, renderHumanColumnKey, renderHumanContextIndex, renderHumanContextEconomics and 9 more. |
| [id-display.ts](../src/services/context/formatters/id-display.ts) | Code module: id display; exports formatContextReferenceId. |

## src/services/context/sections/

Injected-memory selection and rendering.

| File | Responsibility |
| --- | --- |
| [FooterRenderer.ts](../src/services/context/sections/FooterRenderer.ts) | Code module: Footer Renderer; exports renderPreviouslySection, renderFooter. |
| [HeaderRenderer.ts](../src/services/context/sections/HeaderRenderer.ts) | Code module: Header Renderer; exports renderHeader. |
| [SummaryRenderer.ts](../src/services/context/sections/SummaryRenderer.ts) | Code module: Summary Renderer; exports shouldShowSummary, renderSummaryFields. |
| [TimelineRenderer.ts](../src/services/context/sections/TimelineRenderer.ts) | Code module: Timeline Renderer; exports groupTimelineByDay, renderAgentTimeline, HumanTimelineEntry, buildHumanTimelineEntries, renderHumanTimelineEntries. |
| [WorkStateRenderer.ts](../src/services/context/sections/WorkStateRenderer.ts) | Code module: Work State Renderer; exports WorkStateClock, WORK_STATE_SECTION_CHARACTER_LIMIT, WORK_STATE_RULE, FoldedWorkStateList, foldWorkStateList and 4 more. |

## src/services/dedup/

Application source.

| File | Responsibility |
| --- | --- |
| [idf.ts](../src/services/dedup/idf.ts) | Code module: idf; exports idf, buildIdfFn. |
| [idfVeto.ts](../src/services/dedup/idfVeto.ts) | Code module: idf Veto; exports vetoFires. |
| [nearDuplicate.ts](../src/services/dedup/nearDuplicate.ts) | Code module: near Duplicate; exports DedupTier, DedupMethod, ClassifyThresholds, PairClassification, FuzzyDedupConfig and 1 more. |
| [normalize.ts](../src/services/dedup/normalize.ts) | Code module: normalize; exports normalizeTitle, tokenizeWs. |
| [tfidfCosine.ts](../src/services/dedup/tfidfCosine.ts) | Code module: tfidf Cosine; exports tfidfCosine. |

## src/services/domain/

Application source.

| File | Responsibility |
| --- | --- |
| [ModeManager.ts](../src/services/domain/ModeManager.ts) | Code module: Mode Manager; exports ModeManager. |
| [mode-validation.ts](../src/services/domain/mode-validation.ts) | Code module: mode validation; exports REQUIRED_PROMPT_KEYS, RequiredPromptKey, validateMode. |
| [types.ts](../src/services/domain/types.ts) | Code module: types; exports ObservationType, ObservationConcept, ModePrompts, ModeConfig. |

## src/services/hooks/

Application source.

| File | Responsibility |
| --- | --- |
| [runtime-selector.ts](../src/services/hooks/runtime-selector.ts) | Code module: runtime selector; exports SelectedRuntime, ServerRuntimeContext, WorkerRuntimeContext, RuntimeContext, selectRuntime and 3 more. |
| [server-bootstrap.ts](../src/services/hooks/server-bootstrap.ts) | Code module: server bootstrap; exports HOOK_API_KEY_SCOPES, BootstrapResult, BootstrapDependencies, bootstrapServerApiKey, revokeServerApiKey and 7 more. |
| [server-client.ts](../src/services/hooks/server-client.ts) | Code module: server client; exports ServerClientErrorKind, ServerClientError, ServerClientConfig, ServerRequestOptions, ServerStartSessionRequest and 18 more. |

## src/services/infrastructure/

Application source.

| File | Responsibility |
| --- | --- |
| [CleanupV12_4_3.ts](../src/services/infrastructure/CleanupV12_4_3.ts) | Code module: Cleanup V12 4 3; exports runOneTimeV12_4_3Cleanup. |
| [FtsMaintenance.ts](../src/services/infrastructure/FtsMaintenance.ts) | Code module: Fts Maintenance; exports FtsBloatReclaimOptions, FtsTableReclaimResult, reclaimFtsBloatInBoundedSteps, scheduleOneTimeFtsBloatReclaim. |
| [GracefulShutdown.ts](../src/services/infrastructure/GracefulShutdown.ts) | Code module: Graceful Shutdown; exports ShutdownableService, CloseableClient, CloseableDatabase, StoppableService, GracefulShutdownConfig and 1 more. |
| [HealthMonitor.ts](../src/services/infrastructure/HealthMonitor.ts) | Code module: Health Monitor; exports isPortInUse, PortOccupancy, PortBindProbe, classifyPortOccupancy, probePortBind and 7 more. |
| [ProcessManager.ts](../src/services/infrastructure/ProcessManager.ts) | Code module: Process Manager; exports WINDOWS_HIDDEN_DAEMON_SPAWN_TIMEOUT_MS, windowsDaemonLaunchTimeoutMs, resolveWorkerRuntimePath, writePidFile, readPidFile and 18 more. |
| [ProjectMerge.ts](../src/services/infrastructure/ProjectMerge.ts) | Code module: Project Merge; exports ProjectMergeResult, mergeProjectInto, runProjectMergeCommand. |
| [WorktreeAdoption.ts](../src/services/infrastructure/WorktreeAdoption.ts) | Code module: Worktree Adoption; exports AdoptionResult, formatAdoptionErrors, hasProvenAncestry, adoptMergedWorktrees, adoptMergedWorktreesForAllKnownRepos. |
| [index.ts](../src/services/infrastructure/index.ts) | Code module: index. |

## src/services/install/

Application source.

| File | Responsibility |
| --- | --- |
| [shutdown-helper.ts](../src/services/install/shutdown-helper.ts) | Code module: shutdown helper; exports ShutdownBlocker, ShutdownResult, PortProbeResult, ShutdownProbes, probeLoopbackPort and 2 more. |

## src/services/integrations/

Application source.

| File | Responsibility |
| --- | --- |
| [AntigravityCliHooksInstaller.ts](../src/services/integrations/AntigravityCliHooksInstaller.ts) | Code module: Antigravity Cli Hooks Installer; exports toSpaceFreePath, buildAntigravityHooksConfig, stripLegacyEventHooks, mergeHooksIntoConfig, installAntigravityCliHooks and 5 more. |
| [CcsAlignMiddleCache.ts](../src/services/integrations/CcsAlignMiddleCache.ts) | Code module: Ccs Align Middle Cache; exports CcsAlignObservationInput, CcsAlignMiddleRecord, CcsAlignCursor, ExcludeMarkReason, ExcludeMark and 26 more. |
| [CcsAlignRulesWalker.ts](../src/services/integrations/CcsAlignRulesWalker.ts) | Code module: Ccs Align Rules Walker; exports ConflictCode, RulesConflict, LayerEntry, RulesWalkResult, RulesWalkerConfig and 14 more. |
| [CodexCliInstaller.ts](../src/services/integrations/CodexCliInstaller.ts) | Code module: Codex Cli Installer; exports isExecutableFile, isUsableCodexBundle, lookupCodexOnMacOS, resolveCodexCommand, resolveCodexSpawnInvocation and 14 more. |
| [CursorHooksInstaller.ts](../src/services/integrations/CursorHooksInstaller.ts) | Code module: Cursor Hooks Installer; exports readCursorRegistry, registerCursorProject, unregisterCursorProject, updateCursorContextForProject, getTargetDir and 5 more. |
| [DeepSeekHarnessInstaller.ts](../src/services/integrations/DeepSeekHarnessInstaller.ts) | Code module: Deep Seek Harness Installer; exports dshWatchConfigPath, findDshPackage, installDshTranscriptWatch, uninstallDshTranscriptWatch, installDeepSeekHarness and 1 more. |
| [GrokBotAwarenessPusher.ts](../src/services/integrations/GrokBotAwarenessPusher.ts) | Code module: Grok Bot Awareness Pusher; exports GROK_BOT_AWARENESS_PILOT_AGENT_IDS, GrokBotAwarenessNotifyInput, GrokBotAwarenessPushConfig, loadGrokBotAwarenessConfig, observationMatchesAwarenessNeed |
| [GrokBotBrainbeat.ts](../src/services/integrations/GrokBotBrainbeat.ts) | Code module: Grok Bot Brainbeat; exports BRAINBEAT_TIMEOUT_MS, GrokBotBrainbeatInput, webhookOrigin, brainbeatFailureReason, notifyGrokBotBrainbeat. |
| [GrokBotIndexWriter.ts](../src/services/integrations/GrokBotIndexWriter.ts) | Code module: Grok Bot Index Writer; exports GrokBotIndexConfig, GrokBotIndexSeat, GrokBotIndexRefreshResult, GrokBotIndexQueryFns, loadGrokBotIndexConfig and 12 more. |
| [GrokBotInstaller.ts](../src/services/integrations/GrokBotInstaller.ts) | Code module: Grok Bot Installer; exports GROK_BOT_SCHEMA, resolveGrokBotProject, wellKnownGrokBotAgentDataDirs, discoverGrokBotAgentDataRoot, buildGrokBotWatch and 1 more. |
| [HermesInstaller.ts](../src/services/integrations/HermesInstaller.ts) | Code module: Hermes Installer; exports HERMES_PLUGIN_NAME, hermesHome, hermesPluginDirectory, findHermesPluginSource, installHermesIntegration and 1 more. |
| [KimiHooksInstaller.ts](../src/services/integrations/KimiHooksInstaller.ts) | Code module: Kimi Hooks Installer; exports KIMI_MARKER_BEGIN, KIMI_MARKER_END, buildKimiHooksBlock, upsertManagedBlock, removeManagedBlock and 5 more. |
| [McpIntegrations.ts](../src/services/integrations/McpIntegrations.ts) | Code module: Mcp Integrations; exports PLACEHOLDER_CONTEXT, buildMcpServerEntry, writeMcpJsonConfig, installGooseMcpIntegration, uninstallGooseMcpIntegration and 2 more. |
| [NotionExporter.ts](../src/services/integrations/NotionExporter.ts) | Code module: Notion Exporter; exports NOTION_API_BASE, NOTION_API_VERSION, NOTION_MIN_REQUEST_INTERVAL_MS, NOTION_REQUEST_TIMEOUT_MS, NOTION_MAX_RETRIES and 20 more. |
| [OmpHooksInstaller.ts](../src/services/integrations/OmpHooksInstaller.ts) | Code module: Omp Hooks Installer; exports findOmpHookSourcePath, installOmpHooks, uninstallOmpHooks, checkOmpStatus. |
| [OpenClawInstaller.ts](../src/services/integrations/OpenClawInstaller.ts) | Code module: Open Claw Installer; exports getOpenClawConfigDirectory, getOpenClawExtensionsDirectory, getOpenClawClaudeMemExtensionDirectory, getOpenClawConfigFilePath, findPreBuiltPluginDirectory and |
| [OpenCodeInstaller.ts](../src/services/integrations/OpenCodeInstaller.ts) | Code module: Open Code Installer; exports OPENCODE_MCP_REGISTRATION_INCOMPLETE, OPENCODE_OLD_CONTEXT_BLOCK_LEFT, OpenCodePluginApi, parseOpenCodeVersion, detectOpenCodeVersion and 17 more. |
| [PiInstaller.ts](../src/services/integrations/PiInstaller.ts) | Code module: Pi Installer; exports piExtensionDirectory, piExtensionPath, findPiExtensionSource, installPiExtension, uninstallPiExtension and 1 more. |
| [T3CodeInstaller.ts](../src/services/integrations/T3CodeInstaller.ts) | Code module: T3Code Installer; exports T3CodeProvider, T3CodeOptions, t3CodeSettingsPath, discoverT3CodeProviders, assertT3CodePluginLoading and 3 more. |
| [TelegramNotifier.ts](../src/services/integrations/TelegramNotifier.ts) | Code module: Telegram Notifier; exports TelegramNotifyInput, notifyTelegram. |
| [TelegramWrapupNotifier.ts](../src/services/integrations/TelegramWrapupNotifier.ts) | Code module: Telegram Wrapup Notifier; exports TELEGRAM_WRAPUP_PROMPT, TelegramWrapupRoute, TelegramWrapupConfig, ResolvedTelegramWrapupRoute, TelegramWrapupFormatterInput and 8 more. |
| [WindsurfHooksInstaller.ts](../src/services/integrations/WindsurfHooksInstaller.ts) | Code module: Windsurf Hooks Installer; exports readWindsurfRegistry, writeWindsurfRegistry, registerWindsurfProject, unregisterWindsurfProject, writeWindsurfContextFile and 3 more. |
| [grok-bot-index-format.ts](../src/services/integrations/grok-bot-index-format.ts) | Code module: grok bot index format; exports INJECT_LOG_BASENAME, INJECT_TAG, INJECT_PROVENANCE_NOTE, HOST_MAX_FACT_CHARS, DEFAULT_INDEX_WINDOW and 22 more. |
| [grok-bot-untrusted-text.d.mts](../src/services/integrations/grok-bot-untrusted-text.d.mts) | Code module: grok bot untrusted text.d; exports stripUnsafeChars, sanitizeUntrustedText, truncateCodePoints, fencedLine, RecalledObservation and 1 more. |
| [grok-bot-untrusted-text.mjs](../src/services/integrations/grok-bot-untrusted-text.mjs) | Code module: grok bot untrusted text; exports stripUnsafeChars, sanitizeUntrustedText, truncateCodePoints, fencedLine, formatRecalledObservationLine. |
| [hermes-config-yaml.ts](../src/services/integrations/hermes-config-yaml.ts) | Code module: hermes config yaml; exports HermesConfigShapeError, ProviderReceipt, readMemoryProvider, selectMemoryProvider, restoreMemoryProvider and 6 more. |
| [install-paths.ts](../src/services/integrations/install-paths.ts) | Code module: install paths; exports getPluginRootAbsolutePath, getMcpServerAbsolutePath, getWorkerServiceAbsolutePath, getBunAbsolutePath, getNodeAbsolutePath. |
| [telegram-transport.ts](../src/services/integrations/telegram-transport.ts) | Code module: telegram transport; exports escapeMarkdownV2, postTelegramMessage. |
| [types.ts](../src/services/integrations/types.ts) | Code module: types; exports CursorInstallTarget, CursorHooksJson. |

## src/services/memory/

Application source.

| File | Responsibility |
| --- | --- |
| [cli.ts](../src/services/memory/cli.ts) | Code module: cli; exports runMemoryCommand. |
| [config.ts](../src/services/memory/config.ts) | Code module: config; exports MemoryWatchRoot, expandMemoryPath, parseMemoryWatchRoots, isWithinMemoryRoot. |
| [file-watcher.ts](../src/services/memory/file-watcher.ts) | Code module: file watcher; exports MemoryFileWatcher. |
| [ingest.ts](../src/services/memory/ingest.ts) | Code module: ingest; exports MAX_MEMORY_FILE_BYTES, claudeProjectsDir, memoryDirForCwd, MemorySourceError, MemoryFrontmatter and 17 more. |
| [save-memory.ts](../src/services/memory/save-memory.ts) | Code module: save memory; exports SaveMemoryInput, saveMemory. |

## src/services/prompt-import/

Application source.

| File | Responsibility |
| --- | --- |
| [cli.ts](../src/services/prompt-import/cli.ts) | Code module: cli. |
| [index.ts](../src/services/prompt-import/index.ts) | Code module: index; exports PROMPT_SCAN_WINDOW_DAYS, OwnerPrompt, MemoryPrompt, AgentScanSummary, PromptScanProgress and 5 more. |
| [owner-prompt-filter.ts](../src/services/prompt-import/owner-prompt-filter.ts) | Code module: owner prompt filter; exports MINIMUM_CHECKABLE_LENGTH, FINGERPRINT_LENGTH, normalize, provenanceFingerprint, opensWithRoleAssignment and 2 more. |
| [owner-prompts-file.ts](../src/services/prompt-import/owner-prompts-file.ts) | Code module: owner prompts file; exports promptMinute, OwnerPromptsFile, writeOwnerPromptsFile. |
| [readers.ts](../src/services/prompt-import/readers.ts) | Code module: readers; exports PromptAgentId, TypedPrompt, TranscriptSource, ReaderSink, AgentPromptReader and 10 more. |
| [setup-scan.ts](../src/services/prompt-import/setup-scan.ts) | Code module: setup scan; exports HOOK_MATCH_WINDOW_MS, SetupScanPhase, SetupScanAgent, SetupScanState, SetupRecentPrompt and 3 more. |
| [token-usage.ts](../src/services/prompt-import/token-usage.ts) | Code module: token usage; exports UsageCoverage, UsagePersona, USAGE_PERSONA_THRESHOLDS, personaFor, AgentTokenUsage and 5 more. |

## src/services/reinforcement/

Application source.

| File | Responsibility |
| --- | --- |
| [persist.ts](../src/services/reinforcement/persist.ts) | Code module: persist; exports seedReinforcement, reinforceObservation. |
| [rank.ts](../src/services/reinforcement/rank.ts) | Code module: rank; exports Rankable, poolSize, blendedScore, recencyHeadSize, rankByStrength. |
| [strength.ts](../src/services/reinforcement/strength.ts) | Code module: strength; exports ACT_R_DECAY, MAX_REINFORCEMENT_HISTORY, ageDays, parseReinforcementDates, isoDay and 1 more. |

## src/services/server/

Application source.

| File | Responsibility |
| --- | --- |
| [ErrorHandler.ts](../src/services/server/ErrorHandler.ts) | Code module: Error Handler; exports ErrorResponse, AppError, createErrorResponse, errorHandler, notFoundHandler. |
| [Server.ts](../src/services/server/Server.ts) | Code module: Server; exports RouteHandler, AiStatus, ServerOptions, applySecurityHeaders, Server. |
| [allowed-constants.ts](../src/services/server/allowed-constants.ts) | Code module: allowed constants; exports ALLOWED_OPERATIONS, ALLOWED_TOPICS. |
| [flushResponseThen.ts](../src/services/server/flushResponseThen.ts) | Code module: flush Response Then; exports flushResponseThen. |
| [init-phase.ts](../src/services/server/init-phase.ts) | Code module: init phase; exports InitPhase, TERMINAL_INIT_PHASES, InitPhaseState, InitPhaseListener, InitPhaseSource and 1 more. |

## src/services/setup/

Application source.

| File | Responsibility |
| --- | --- |
| [history-import.ts](../src/services/setup/history-import.ts) | Code module: history import; exports HISTORY_IMPORT_BATCH, SetupHistoryCounts, HistoryImportState, readHistoryCounts, HistoryImportOptions and 1 more. |

## src/services/smart-file-read/

Application source.

| File | Responsibility |
| --- | --- |
| [language-map.ts](../src/services/smart-file-read/language-map.ts) | Code module: language map; exports LANG_MAP, detectLanguage. |
| [parser.ts](../src/services/smart-file-read/parser.ts) | Code module: parser; exports CodeSymbol, FoldedFile, _resetGrammarLibOptOut, parseFile, parseFilesBatch and 6 more. |
| [search.ts](../src/services/smart-file-read/search.ts) | Code module: search; exports SearchResult, FileMatch, SymbolMatch, searchCodebase, formatSearchResults. |
| [tree-sitter-bin-name.ts](../src/services/smart-file-read/tree-sitter-bin-name.ts) | Code module: tree sitter bin name; exports treeSitterBinaryName. |
| [tree-sitter-bin-path.ts](../src/services/smart-file-read/tree-sitter-bin-path.ts) | Code module: tree sitter bin path; exports resolveTreeSitterBinPath, resolveTreeSitterBinPathFor, pickTreeSitterBinPath, isTreeSitterCliAvailable, TREE_SITTER_CLI_PATH_WORKAROUND and 4 more. |
| [tree-sitter-cli-checksums.ts](../src/services/smart-file-read/tree-sitter-cli-checksums.ts) | Code module: tree sitter cli checksums; exports TREE_SITTER_EXECUTABLE_SHA256, pinnedTreeSitterExecutableSha256, GlibcCompatibleTreeSitterBuild, GLIBC_COMPATIBLE_TREE_SITTER_BUILDS, glibcCompatibleTre |
| [tree-sitter-cli-conda.ts](../src/services/smart-file-read/tree-sitter-cli-conda.ts) | Code module: tree sitter cli conda; exports condaPackageUnsupportedReason, treeSitterExecutableFromCondaPackage. |
| [tree-sitter-cli-provision.ts](../src/services/smart-file-read/tree-sitter-cli-provision.ts) | Code module: tree sitter cli provision; exports TREE_SITTER_CLI_CANNOT_RUN, treeSitterCliBinaryPath, TreeSitterCliVersionProbe, TreeSitterProbeExec, answersTreeSitterVersion and 4 more. |
| [workspace-path.ts](../src/services/smart-file-read/workspace-path.ts) | Code module: workspace path; exports resolveWithinWorkspace. |

## src/services/sqlite/

SQLite session and memory persistence.

| File | Responsibility |
| --- | --- |
| [SessionSearch.ts](../src/services/sqlite/SessionSearch.ts) | Code module: Session Search; exports OBSERVATIONS_FTS_TRIGGER_NAMES, SESSION_SUMMARIES_FTS_TRIGGER_NAMES, OBSERVATIONS_FTS_TRIGGERS_SQL, SESSION_SUMMARIES_FTS_TRIGGERS_SQL, SessionSearch. |
| [SessionStore.ts](../src/services/sqlite/SessionStore.ts) | Code module: Session Store; exports TELEGRAM_WRAPUP_CLAIM_STALE_AFTER_MS, rollupObservationFileLists, SessionStoreOptions, SessionCatalogRow, SessionStore. |
| [connection.ts](../src/services/sqlite/connection.ts) | Code module: connection; exports SQLITE_BUSY_TIMEOUT_MS, SQLITE_JOURNAL_SIZE_LIMIT_BYTES, LATEST_SCHEMA_VERSION, readSchemaWriterStamp, SchemaNewerThanBinaryError and 7 more. |
| [dedup-store.ts](../src/services/sqlite/dedup-store.ts) | Code module: dedup store; exports DEDUP_CANDIDATE_STATUSES, DedupCandidateStatus, DEDUP_CANDIDATE_VERDICTS, DedupCandidateVerdict, DedupRuntimeConfig and 10 more. |
| [deliverables.ts](../src/services/sqlite/deliverables.ts) | Code module: deliverables; exports DeliverableRow, RecordDeliverableInput, createDeliverablesSchema, recordDeliverable, getDeliverable and 1 more. |
| [project-read-keys.ts](../src/services/sqlite/project-read-keys.ts) | Code module: project read keys; exports scopedProjects, projectScopeSql, projectReadKeys. |
| [prompt-storage.ts](../src/services/sqlite/prompt-storage.ts) | Code module: prompt storage; exports MAX_STORED_PROMPT_CHARS, MEDIA_PROMPT_PLACEHOLDER, normalizeStoredPromptText. |
| [stream-rows.ts](../src/services/sqlite/stream-rows.ts) | Code module: stream rows; exports streamRows, pageMatchingRows. |
| [tool-uses.ts](../src/services/sqlite/tool-uses.ts) | Code module: tool uses; exports MAX_TOOL_PAYLOAD_BYTES, ToolUseRow, UpsertToolUseInput, ToolUseQueryFilters, truncatePayload and 10 more. |
| [types.ts](../src/services/sqlite/types.ts) | Code module: types; exports ObservationRow, SessionSummaryRow, UserPromptRow, DateRange, SearchFilters and 4 more. |
| [work-state.ts](../src/services/sqlite/work-state.ts) | Code module: work state; exports WorkStateValue, WorkStateFields, WorkStateEntry, scopeWorkStateEntries, createWorkStateSchema and 2 more. |

## src/services/sqlite/observations/

SQLite session and memory persistence.

| File | Responsibility |
| --- | --- |
| [files.ts](../src/services/sqlite/observations/files.ts) | Code module: files; exports parseFileList, parseIndexedFilePaths, replaceObservationFileIndex. |
| [get.ts](../src/services/sqlite/observations/get.ts) | Code module: get; exports getObservationsByFilePath. |
| [recent.ts](../src/services/sqlite/observations/recent.ts) | Code module: recent; exports getFirstObservationCreatedAt. |
| [store.ts](../src/services/sqlite/observations/store.ts) | Code module: store; exports hasStorableTitle, computeObservationContentHash. |

## src/services/sqlite/prompts/

SQLite session and memory persistence.

| File | Responsibility |
| --- | --- |
| [get.ts](../src/services/sqlite/prompts/get.ts) | Code module: get; exports findRecentDuplicateUserPrompt. |

## src/services/sync/

Application source.

| File | Responsibility |
| --- | --- |
| [CanonicalContent.ts](../src/services/sync/CanonicalContent.ts) | Code module: Canonical Content; exports CONTENT_BODY_SCHEMA_VERSION, CONTENT_PAYLOAD_SCHEMA_VERSION, CONTENT_BODY_MAX_BYTES, MUTATION_FIELD_MAX_BYTES, ContentKind and 17 more. |
| [ChromaMcpManager.ts](../src/services/sync/ChromaMcpManager.ts) | Code module: Chroma Mcp Manager; exports ChromaCrashState, ChromaMcpManager. |
| [ChromaSync.ts](../src/services/sync/ChromaSync.ts) | Code module: Chroma Sync; exports ChromaDocument, BackfillAbortReason, BackfillOutcome, BackfillKindResult, MergedIntoProjectTarget and 7 more. |
| [ChromaSyncState.ts](../src/services/sync/ChromaSyncState.ts) | Code module: Chroma Sync State; exports DocKind, ProjectWatermarks, ChromaSyncState. |
| [CloudSync.ts](../src/services/sync/CloudSync.ts) | Code module: Cloud Sync; exports DEFAULT_CONTENT_BATCH_SIZE, DEFAULT_REQUEST_TIMEOUT_MS, DEFAULT_STATUS_TIMEOUT_MS, CONTENT_BATCH_SIZE_MIN, CONTENT_BATCH_SIZE_MAX and 14 more. |
| [SyncApply.ts](../src/services/sync/SyncApply.ts) | Code module: Sync Apply; exports UndecodableOp, SyncOp, ChromaSyncLike, SyncApplyOptions, ApplyOpsOptions and 3 more. |
| [SyncClient.ts](../src/services/sync/SyncClient.ts) | Code module: Sync Client; exports REALTIME_JOIN_REPLY_TIMEOUT_MS, decodeChanges, SyncSocketLike, SyncWebSocketConstructor, SyncClientOptions and 1 more. |
| [outbox-purge.ts](../src/services/sync/outbox-purge.ts) | Code module: outbox purge; exports purgeUndrainableSyncOutbox. |
| [prompt-text-clamp.ts](../src/services/sync/prompt-text-clamp.ts) | Code module: prompt text clamp; exports PROMPT_TEXT_MAX_BYTES, PROMPT_TRUNCATION_MARKER, PROMPT_TEXT_COLUMNS_SQL, clampPromptTextForSync. |
| [remap-outbox.ts](../src/services/sync/remap-outbox.ts) | Code module: remap outbox; exports RemapWhere, RemapFields, RemapResult, hasSyncLane, emitRemapProject. |
| [string-list-field.ts](../src/services/sync/string-list-field.ts) | Code module: string list field; exports parseStringListField. |

## src/services/telemetry/

Application source.

| File | Responsibility |
| --- | --- |
| [backfill.ts](../src/services/telemetry/backfill.ts) | Code module: backfill; exports PROJECT_EPOCH_FLOOR, BACKFILL_VERSION, utcDayString, DailyRollup, BackfillEvent and 5 more. |
| [buffer.ts](../src/services/telemetry/buffer.ts) | Code module: buffer; exports RollupReason, telemetryBuffer. |
| [cli-telemetry.ts](../src/services/telemetry/cli-telemetry.ts) | Code module: cli telemetry; exports captureCliEvent. |
| [common.ts](../src/services/telemetry/common.ts) | Code module: common; exports TELEMETRY_PUBLIC_KEY, DEFAULT_TELEMETRY_HOST, getTelemetryApiKey, getTelemetryHost, asMs and 3 more. |
| [consent.ts](../src/services/telemetry/consent.ts) | Code module: consent; exports TelemetryConfig, TelemetryConsentSource, TelemetryConsentExplanation, explainTelemetryConsent, resolveTelemetryConsent and 5 more. |
| [error-scrub.ts](../src/services/telemetry/error-scrub.ts) | Code module: error scrub; exports MESSAGE_MAX_CHARS, STACK_MAX_CHARS, STACK_MAX_FRAMES, MAX_RAW_INPUT_CHARS, REDACTED and 15 more. |
| [install-stats.ts](../src/services/telemetry/install-stats.ts) | Code module: install stats; exports collectInstallStats. |
| [scrub.ts](../src/services/telemetry/scrub.ts) | Code module: scrub; exports ALLOWED_PROPERTY_KEYS, scrubProperties. |
| [skill-id.ts](../src/services/telemetry/skill-id.ts) | Code module: skill id; exports FIRST_PARTY_SKILL_IDS, FirstPartySkillId, SkillId, SkillSource, SkillTrigger and 4 more. |
| [telemetry.ts](../src/services/telemetry/telemetry.ts) | Code module: telemetry; exports hasTelemetryConsent, enableExceptionAutocaptureForWorker, captureException, captureEvent, __resetTelemetryForTests and 2 more. |
| [work-state.ts](../src/services/telemetry/work-state.ts) | Code module: work state; exports WORK_STATE_REPLAY_WINDOW_MS, recordWorkStatePrivacy, isPublicWorkStateTurn, recordWorkStateInstruction, recordWorkStatePrompt and 2 more. |

## src/services/transcripts/

Application source.

| File | Responsibility |
| --- | --- |
| [cli.ts](../src/services/transcripts/cli.ts) | Code module: cli; exports runTranscriptCommand. |
| [config.ts](../src/services/transcripts/config.ts) | Code module: config; exports DEFAULT_CONFIG_PATH, DEFAULT_STATE_PATH, SAMPLE_CONFIG, isNativeHookBackedCodexWatch, shouldSuppressNativeCodexAgentsContext and 6 more. |
| [field-utils.ts](../src/services/transcripts/field-utils.ts) | Code module: field utils; exports getValueByPath, resolveFieldSpec, resolveFields, matchesRule. |
| [processor.ts](../src/services/transcripts/processor.ts) | Code module: processor; exports resolveWatchAgentId, TranscriptAnchorError, TranscriptObservationError, TranscriptSpoolError, TranscriptObservationTransport and 2 more. |
| [state.ts](../src/services/transcripts/state.ts) | Code module: state; exports TranscriptWatchState, loadWatchState, saveWatchState. |
| [transcript-watcher-entry.ts](../src/services/transcripts/transcript-watcher-entry.ts) | Code module: transcript watcher entry. |
| [types.ts](../src/services/transcripts/types.ts) | Code module: types; exports FieldSpec, MatchRule, EventAction, SchemaEvent, TranscriptSchema and 4 more. |
| [watcher.ts](../src/services/transcripts/watcher.ts) | Code module: watcher; exports TranscriptWatcher. |
| [zstd-frames.ts](../src/services/transcripts/zstd-frames.ts) | Code module: zstd frames; exports isZstdSupported, ZstdFrameRange, ZstdScanResult, scanZstdFramesInFile, decompressZstdFrameBytes and 1 more. |

## src/services/vector/

Application source.

| File | Responsibility |
| --- | --- |
| [LocalEmbedder.ts](../src/services/vector/LocalEmbedder.ts) | Code module: Local Embedder; exports LOAD_RETRY_MS, LocalEmbedder. |
| [models.ts](../src/services/vector/models.ts) | Code module: models; exports EmbeddingModel, EMBEDDING_MODELS, DEFAULT_EMBEDDING_MODEL, resolveEmbeddingModel. |
| [types.ts](../src/services/vector/types.ts) | Code module: types; exports Embedder. |

## src/services/work-view/

Application source.

| File | Responsibility |
| --- | --- |
| [agent-lifecycle.d.mts](../src/services/work-view/agent-lifecycle.d.mts) | Code module: agent lifecycle.d; exports AGENT_LIFECYCLE_LIST, isAgentLifecycleList, AgentStopSource, STOP_SOURCES, agentStopFields and 3 more. |
| [agent-lifecycle.mjs](../src/services/work-view/agent-lifecycle.mjs) | Code module: agent lifecycle; exports AGENT_LIFECYCLE_LIST, isAgentLifecycleList, STOP_SOURCES, agentStopFields, readAgentStops and 1 more. |
| [agent-view.mjs](../src/services/work-view/agent-view.mjs) | Code module: agent view; exports compactText, readableRequest, activitySignature, REQUEST_WINDOW_MS, readAgentRecords and 5 more. |
| [auto-refresh-worker.d.mts](../src/services/work-view/auto-refresh-worker.d.mts) | Code module: auto refresh worker.d; exports RefreshState, RefreshStepTiming, RefreshJobOutcome, RefreshStatus, AutoRefreshWorker. |
| [auto-refresh-worker.mjs](../src/services/work-view/auto-refresh-worker.mjs) | Code module: auto refresh worker; exports AutoRefreshWorker. |
| [data-source.d.mts](../src/services/work-view/data-source.d.mts) | Code module: data source.d; exports WorkViewRequest, WorkViewSnapshot, WorkStateSource, reduceWorkState. |
| [data-source.mjs](../src/services/work-view/data-source.mjs) | Code module: data source; exports resolveReadScope, WorkStateSource. |
| [focus-judge.d.mts](../src/services/work-view/focus-judge.d.mts) | Code module: focus judge.d; exports FOCUS_AUTO_PLACE_THRESHOLD, MIN_OWNER_LABELED_PAIRS, FocusPick, FocusJudgement, FocusJudge and 6 more. |
| [focus-judge.mjs](../src/services/work-view/focus-judge.mjs) | Code module: focus judge; exports FOCUS_AUTO_PLACE_THRESHOLD, MIN_OWNER_LABELED_PAIRS, askFocusArea, jevFocusJudge, configuredFocusJudge and 3 more. |
| [hosted-intent.ts](../src/services/work-view/hosted-intent.ts) | Code module: hosted intent; exports INTENT_MAX_UPLOAD_BYTES, HostedIntentResult, HostedIntentState, HostedIntentOptions, HostedIntent. |
| [human-copy-worker.d.mts](../src/services/work-view/human-copy-worker.d.mts) | Code module: human copy worker.d; exports chatCompletionsHumanCopyProvider, fitGeneratedCopy, HumanCopyWorker. |
| [human-copy-worker.mjs](../src/services/work-view/human-copy-worker.mjs) | Code module: human copy worker; exports fitGeneratedCopy, chatCompletionsHumanCopyProvider, HumanCopyWorker. |
| [human-copy.mjs](../src/services/work-view/human-copy.mjs) | Code module: human copy; exports HUMAN_COPY_MAX_CHARS, HUMAN_COPY_INSTRUCTIONS, createHumanCopyInput, humanCopyFingerprint, validateHumanCopy and 1 more. |
| [my-focus.d.mts](../src/services/work-view/my-focus.d.mts) | Code module: my focus.d; exports MY_FOCUS_LIST, OTHER_FOCUS_AREA_ID, FocusAreaStatus, FocusAreaSource, FocusAreaDecidedBy and 27 more. |
| [my-focus.mjs](../src/services/work-view/my-focus.mjs) | Code module: my focus; exports MY_FOCUS_LIST, OTHER_FOCUS_AREA_ID, PROPOSAL_SOURCES, PROPOSAL_KINDS, isMyFocusList and 18 more. |
| [my-rules.d.mts](../src/services/work-view/my-rules.d.mts) | Code module: my rules.d; exports MY_RULES_LIST, isMyRulesList, ruleIdForPreference, SavedRule, ruleRowFields and 1 more. |
| [my-rules.mjs](../src/services/work-view/my-rules.mjs) | Code module: my rules; exports MY_RULES_LIST, RULE_TASK_PREFIX, RULE_SCOPE_TIERS, RULE_SET_BY, SAVED_RULE_STATUSES and 8 more. |
| [nav-words.d.mts](../src/services/work-view/nav-words.d.mts) | Code module: nav words.d; exports NAV_LABELS, navWordIn. |
| [nav-words.mjs](../src/services/work-view/nav-words.mjs) | Code module: nav words; exports NAV_LABELS, navWordIn. |
| [owner-goals.d.mts](../src/services/work-view/owner-goals.d.mts) | Code module: owner goals.d; exports OWNER_GOALS_LIST, GoalKind, GOAL_KINDS, isOwnerGoalsList, goalKindOf. |
| [owner-goals.mjs](../src/services/work-view/owner-goals.mjs) | Code module: owner goals; exports OWNER_GOALS_LIST, GOAL_KINDS, isOwnerGoalsList, goalKindOf. |
| [python.ts](../src/services/work-view/python.ts) | Code module: python; exports resolvePythonCommand. |
| [refresh-task.ts](../src/services/work-view/refresh-task.ts) | Code module: refresh task; exports MEMORY_TOOLS, reviewConcurrency, STEP_MODELS, GROUPING_ANSWER_SCHEMA, STORY_ANSWER_SCHEMA and 5 more. |
| [request-groups-cli.mjs](../src/services/work-view/request-groups-cli.mjs) | Code module: request groups cli. |
| [request-groups.d.mts](../src/services/work-view/request-groups.d.mts) | Code module: request groups.d; exports LEDGER_DIR, PREFERENCE_KINDS, GOALS_STALE_MS, AGENT_WRITTEN_PROMPTS_FILE, RefreshNeeds and 27 more. |
| [request-groups.mjs](../src/services/work-view/request-groups.mjs) | Code module: request groups; exports LEDGER_DIR, AGENT_WRITTEN_PROMPTS_FILE, GOALS_STALE_MS, PROGRESS_STATES, PREFERENCE_KINDS and 34 more. |
| [request-judge.d.mts](../src/services/work-view/request-judge.d.mts) | Code module: request judge.d; exports JOIN_THRESHOLD, SUGGEST_THRESHOLD, MAX_CANDIDATE_REQUESTS, MAX_DECISION_BODY_BYTES, JEV_MODEL and 23 more. |
| [request-judge.mjs](../src/services/work-view/request-judge.mjs) | Code module: request judge; exports JOIN_THRESHOLD, SUGGEST_THRESHOLD, MAX_CANDIDATE_REQUESTS, MAX_DECISION_BODY_BYTES, JEV_MODEL and 12 more. |
| [request-projection.mjs](../src/services/work-view/request-projection.mjs) | Code module: request projection; exports requestText, isHumanActionRequest, humanRequestTitle, isConversationKey, conversationKey and 2 more. |
| [review-store.ts](../src/services/work-view/review-store.ts) | Code module: review store; exports LocalReview, contentFingerprint, LocalReviewStore. |
| [session-project.d.mts](../src/services/work-view/session-project.d.mts) | Code module: session project.d; exports projectRoot. |
| [session-project.mjs](../src/services/work-view/session-project.mjs) | Code module: session project; exports NO_PROJECT, projectRoot, upgradedGroupRoot, isAgentScratchFolder, repoRootOf and 5 more. |
| [work-product.d.mts](../src/services/work-view/work-product.d.mts) | Code module: work product.d; exports FILE_CONTENT_TYPES, fileKind, isWorkProductField, isLocalPath, productsFromDeliverable. |
| [work-product.mjs](../src/services/work-view/work-product.mjs) | Code module: work product; exports FILE_CONTENT_TYPES, safeWebUrl, isLocalPath, fileKind, githubRepo and 13 more. |
| [work-state-limits.d.mts](../src/services/work-view/work-state-limits.d.mts) | Code module: work state limits.d; exports MAX_WORK_STATE_FIELDS_JSON_CHARS. |
| [work-state-limits.mjs](../src/services/work-view/work-state-limits.mjs) | Code module: work state limits; exports MAX_WORK_STATE_FIELDS_JSON_CHARS. |
| [work-state-reduce.mjs](../src/services/work-view/work-state-reduce.mjs) | Code module: work state reduce; exports reduceWorkState. |

## src/services/worker/

Application source.

| File | Responsibility |
| --- | --- |
| [ClaudeProvider.ts](../src/services/worker/ClaudeProvider.ts) | Code module: Claude Provider; exports __resetEffortHintLatchForTesting, isThinkingRejectFeedback, describeErrorFeedbackText, classifyClaudeError, computeFullContextTokens and 2 more. |
| [CodexAppServerClient.ts](../src/services/worker/CodexAppServerClient.ts) | Code module: Codex App Server Client; exports CodexAppServerClientOptions, CodexAppServerTurnOptions, CodexAppServerTurnResult, buildCodexAppServerArgs, buildCodexAppServerLaunch and 9 more. |
| [CodexAppServerPool.ts](../src/services/worker/CodexAppServerPool.ts) | Code module: Codex App Server Pool; exports boundedInteger, CodexAppServerPool. |
| [CodexProvider.ts](../src/services/worker/CodexProvider.ts) | Code module: Codex Provider; exports CODEX_REASONING_EFFORTS, isCodexReasoningEffort, classifyCodexError, CodexProvider, isCodexSelected. |
| [ContextCacheService.ts](../src/services/worker/ContextCacheService.ts) | Code module: Context Cache Service; exports CONTEXT_CACHE_RENDER_DEBOUNCE_MS, CONTEXT_CACHE_MAX_VARIANTS, ContextVariantRender, ContextCacheServiceOptions, ContextCacheService. |
| [DatabaseManager.ts](../src/services/worker/DatabaseManager.ts) | Code module: Database Manager; exports DatabaseManager. |
| [FormattingService.ts](../src/services/worker/FormattingService.ts) | Code module: Formatting Service; exports FormattingService. |
| [GeminiProvider.ts](../src/services/worker/GeminiProvider.ts) | Code module: Gemini Provider; exports classifyGeminiError, GeminiModel, GEMINI_RPM_LIMITS, GeminiBadRequestCategory, categorizeGeminiBadRequest and 3 more. |
| [OpenAICompatProvider.ts](../src/services/worker/OpenAICompatProvider.ts) | Code module: Open AICompat Provider; exports OpenAICompatConfig, isLocalEndpointUrl, classifyOpenAICompatError, stripLeadingThinkBlock, resolveOpenAICompatConfig and 3 more. |
| [OpenAICompatibleProvider.ts](../src/services/worker/OpenAICompatibleProvider.ts) | Code module: Open AICompatible Provider; exports ProviderQueryResult, ObserverRequestLabel, anonymousSessionId, OpenAIChatMessage, OpenAICompatibleProvider. |
| [OpenRouterProvider.ts](../src/services/worker/OpenRouterProvider.ts) | Code module: Open Router Provider; exports isContextOverflowBody, classifyOpenRouterError, OpenRouterConfig, OPENROUTER_REASONING_EFFORTS, OpenRouterReasoningEffort and 8 more. |
| [PaginationHelper.ts](../src/services/worker/PaginationHelper.ts) | Code module: Pagination Helper; exports PaginationHelper. |
| [ProgressiveMemorySearch.ts](../src/services/worker/ProgressiveMemorySearch.ts) | Code module: Progressive Memory Search; exports ProgressiveMemorySearch. |
| [README.md](../src/services/worker/README.md) | Documentation: Worker Service. |
| [RateLimitStore.ts](../src/services/worker/RateLimitStore.ts) | Code module: Rate Limit Store; exports RateLimitWindow, RateLimitInfo, UnifiedWindowSnapshot, RateLimitEntry, RateLimitHealthEntry and 12 more. |
| [SSEBroadcaster.ts](../src/services/worker/SSEBroadcaster.ts) | Code module: SSEBroadcaster; exports SSEBroadcaster. |
| [SearchManager.ts](../src/services/worker/SearchManager.ts) | Code module: Search Manager; exports SearchTelemetryEnvelope, SearchManager. |
| [SessionManager.ts](../src/services/worker/SessionManager.ts) | Code module: Session Manager; exports SESSION_END_WRAPUP_GRACE_MS, TransportResumeClock, MAX_TRANSPORT_RESUME_BASE_DELAY_MS, transportResumeDelayMs, SessionManager. |
| [SessionMessageBuffer.ts](../src/services/worker/SessionMessageBuffer.ts) | Code module: Session Message Buffer; exports IDLE_TIMEOUT_MS, DrainOptions, SessionMessageBuffer. |
| [SettingsManager.ts](../src/services/worker/SettingsManager.ts) | Code module: Settings Manager; exports SettingsManager. |
| [TimelineService.ts](../src/services/worker/TimelineService.ts) | Code module: Timeline Service; exports TimelineItem, TimelineService. |
| [codex-observation-batch.ts](../src/services/worker/codex-observation-batch.ts) | Code module: codex observation batch; exports observationMetadata, queuedObservationPrompt, boundObservationPrompt, sameObservationContext. |
| [context-window.ts](../src/services/worker/context-window.ts) | Code module: context window; exports FALLBACK_CONTEXT_WINDOW_TOKENS, MIN_CONTEXT_WINDOW_TOKENS, ContextWindowProvider, __resetContextWindowCacheForTests, resolveContextWindowTokens and 6 more. |
| [dependency-preflight.ts](../src/services/worker/dependency-preflight.ts) | Code module: dependency preflight; exports WorkerDependencyPreflightOptions, runWorkerDependencyPreflight. |
| [field-optimizer.ts](../src/services/worker/field-optimizer.ts) | Code module: field optimizer; exports CompressedField, FieldCompressor, FIELD_OPTIMIZE_TIMEOUT_MS, FIELD_OPTIMIZE_OUTPUT_SAFETY, fieldCompressionBudget and 3 more. |
| [history-pruning.ts](../src/services/worker/history-pruning.ts) | Code module: history pruning; exports KEEP_RECENT_MESSAGES, MIN_PRUNABLE_CHARS, pruneProcessedObservationPayloads. |
| [hook-spool-drain.ts](../src/services/worker/hook-spool-drain.ts) | Code module: hook spool drain; exports hookSpoolConsumedMarkers, drainHookSpool, HookSpoolDrainer. |
| [idle-exit-monitor.ts](../src/services/worker/idle-exit-monitor.ts) | Code module: idle exit monitor; exports MIN_IDLE_EXIT_MS, IdleExitMonitorDeps, IdleExitMonitor, parseIdleExitMs. |
| [model-aliases.ts](../src/services/worker/model-aliases.ts) | Code module: model aliases; exports resolveTierAlias, resolveSummaryTierModel. |
| [observer-auth-method.ts](../src/services/worker/observer-auth-method.ts) | Code module: observer auth method; exports describeObserverAuthMethod. |
| [observer-usage.ts](../src/services/worker/observer-usage.ts) | Code module: observer usage; exports ObserverUsageSample, ClaudeUsageSample, accumulateObserverUsage, accumulateClaudeUsage, observerUsageLogFields. |
| [onboarding-explainer.md](../src/services/worker/onboarding-explainer.md) | Documentation: How claude-mem works. |
| [openrouter-observation-batch.ts](../src/services/worker/openrouter-observation-batch.ts) | Code module: openrouter observation batch; exports parseOpenRouterObservationBatch. |
| [paid-send-budget.ts](../src/services/worker/paid-send-budget.ts) | Code module: paid send budget; exports DEFAULT_MAX_PAID_SENDS_PER_BATCH, PaidSendBudget, paidSendBudgetForClaimedBatch. |
| [provider-dispatch.ts](../src/services/worker/provider-dispatch.ts) | Code module: provider dispatch; exports SelectableProvider, CMEM_FALLBACK_RETRY_MS, shouldUseCmemFallback, ProviderSelection, QUOTA_FALLBACK_PROVIDERS and 11 more. |
| [provider-errors.ts](../src/services/worker/provider-errors.ts) | Code module: provider errors; exports ProviderErrorClass, DEADLINE_EXCEEDED_CODE, CODEX_COOLDOWN_REFUSAL_CODE, PaidSendOutcome, PAID_SEND_BUDGET_EXHAUSTED_CODE and 6 more. |
| [reasoning-budget.ts](../src/services/worker/reasoning-budget.ts) | Code module: reasoning budget; exports REASONING_DISABLED, OBSERVER_REASONING_BUDGET_TOKENS_BY_EFFORT, parseOpenAICompatReasoning, resolveOpenAICompatReasoning, isLengthTruncatedEmptyReply and 16 more |
| [retry.ts](../src/services/worker/retry.ts) | Code module: retry; exports parseRetryAfterMs, RetryOptions, MAX_RETRY_AFTER_MS, MAX_LLM_TIMEOUT_MS, parseTimeoutMs and 5 more. |
| [stale-spawn-recovery.ts](../src/services/worker/stale-spawn-recovery.ts) | Code module: stale spawn recovery; exports SELF_HEAL_WINDOW_MS, SELF_HEAL_MAX_ATTEMPTS, claudeCliSelfHealAttemptsInWindow, canAttemptClaudeCliSelfHeal, recordClaudeCliSelfHealAttempt and 1 more. |
| [streamed-chat-completion.ts](../src/services/worker/streamed-chat-completion.ts) | Code module: streamed chat completion; exports DEFAULT_LLM_STREAM_IDLE_TIMEOUT_MS, resolveStreamIdleTimeoutMs, STREAM_INTERRUPTED_CODE, STREAMED_REQUEST_FIELDS, isStreamingFieldRefusal and 10 more. |
| [tree-sitter-cli-provisioning.ts](../src/services/worker/tree-sitter-cli-provisioning.ts) | Code module: tree sitter cli provisioning; exports TreeSitterCliProvisioningOutcome, provisionTreeSitterCliForPluginRoot. |

## src/services/worker/agents/

Model/provider observation agents.

| File | Responsibility |
| --- | --- |
| [FallbackErrorHandler.ts](../src/services/worker/agents/FallbackErrorHandler.ts) | Code module: Fallback Error Handler; exports isAbortError. |
| [ObservationBroadcaster.ts](../src/services/worker/agents/ObservationBroadcaster.ts) | Code module: Observation Broadcaster; exports broadcastObservation, broadcastSummary. |
| [ResponseProcessor.ts](../src/services/worker/agents/ResponseProcessor.ts) | Code module: Response Processor; exports ObservationFileEvidence, extractObservationFileEvidence, ResponseContext, snapshotResponseContext, takeObserverSchemaReminder and 4 more. |
| [index.ts](../src/services/worker/agents/index.ts) | Code module: index. |
| [types.ts](../src/services/worker/agents/types.ts) | Code module: types; exports WorkerRef, ObservationSSEPayload, SummarySSEPayload, SSEEventPayload, StorageResult. |

## src/services/worker/events/

Application source.

| File | Responsibility |
| --- | --- |
| [SessionEventBroadcaster.ts](../src/services/worker/events/SessionEventBroadcaster.ts) | Code module: Session Event Broadcaster; exports SessionEventBroadcaster. |

## src/services/worker/http/

Application source.

| File | Responsibility |
| --- | --- |
| [BaseRouteHandler.ts](../src/services/worker/http/BaseRouteHandler.ts) | Code module: Base Route Handler; exports BaseRouteHandler. |
| [middleware.ts](../src/services/worker/http/middleware.ts) | Code module: middleware; exports refuseFramingExceptObservationTv, createMiddleware, createForeignPageDeleteGuard, trustedWorkerHostnames, isTrustedWorkerHost and 9 more. |
| [origin-policy.ts](../src/services/worker/http/origin-policy.ts) | Code module: origin policy; exports WorkerOriginPolicy, parseAllowedOriginsSetting, buildWorkerOriginPolicy, isLocalhostOrigin, isSameHostOrigin and 1 more. |
| [shared.ts](../src/services/worker/http/shared.ts) | Code module: shared; exports IngestContext, setIngestContext, attachIngestGeneratorStarter, requireIngestContext, transcriptCheckpointGate and 16 more. |

## src/services/worker/http/middleware/

Application source.

| File | Responsibility |
| --- | --- |
| [validateBody.ts](../src/services/worker/http/middleware/validateBody.ts) | Code module: validate Body; exports validateBody. |

## src/services/worker/http/routes/

Local worker HTTP endpoint handlers.

| File | Responsibility |
| --- | --- |
| [AdvisorRoutes.ts](../src/services/worker/http/routes/AdvisorRoutes.ts) | Code module: Advisor Routes; exports AdvisorRoutes. |
| [BackupRoutes.ts](../src/services/worker/http/routes/BackupRoutes.ts) | Code module: Backup Routes; exports BackupRoutesOptions, BackupRoutes. |
| [ChromaRoutes.ts](../src/services/worker/http/routes/ChromaRoutes.ts) | Code module: Chroma Routes; exports ChromaRoutes. |
| [CloudSyncRoutes.ts](../src/services/worker/http/routes/CloudSyncRoutes.ts) | Code module: Cloud Sync Routes; exports CloudSyncRoutes. |
| [CorpusRoutes.ts](../src/services/worker/http/routes/CorpusRoutes.ts) | Code module: Corpus Routes; exports CorpusRoutesOptions, CorpusRoutes. |
| [DataRoutes.ts](../src/services/worker/http/routes/DataRoutes.ts) | Code module: Data Routes; exports DataRoutes. |
| [DedupRoutes.ts](../src/services/worker/http/routes/DedupRoutes.ts) | Code module: Dedup Routes; exports DedupRoutes. |
| [HookSpoolRoutes.ts](../src/services/worker/http/routes/HookSpoolRoutes.ts) | Code module: Hook Spool Routes; exports HookSpoolRoutes. |
| [LogsRoutes.ts](../src/services/worker/http/routes/LogsRoutes.ts) | Code module: Logs Routes; exports readLastLines, LogsRoutes. |
| [MemoryIngestRoutes.ts](../src/services/worker/http/routes/MemoryIngestRoutes.ts) | Code module: Memory Ingest Routes; exports MemoryIngestRoutes. |
| [MemoryRoutes.ts](../src/services/worker/http/routes/MemoryRoutes.ts) | Code module: Memory Routes; exports MemoryRoutes. |
| [SearchRoutes.ts](../src/services/worker/http/routes/SearchRoutes.ts) | Code module: Search Routes; exports SearchRoutes. |
| [SessionRoutes.ts](../src/services/worker/http/routes/SessionRoutes.ts) | Code module: Session Routes; exports SessionRoutes. |
| [SettingsRoutes.ts](../src/services/worker/http/routes/SettingsRoutes.ts) | Code module: Settings Routes; exports isForeignLoopbackBrowserWrite, SettingsRoutes. |
| [TeamBrainRoutes.ts](../src/services/worker/http/routes/TeamBrainRoutes.ts) | Code module: Team Brain Routes; exports TEAMBRAIN_PROXY_TIMEOUT_MS, TeamBrainRoutes. |
| [ViewerRoutes.ts](../src/services/worker/http/routes/ViewerRoutes.ts) | Code module: Viewer Routes; exports lazyUiHtml, sendUiMissingPage, ViewerRoutes. |
| [WorkStateRoutes.ts](../src/services/worker/http/routes/WorkStateRoutes.ts) | Code module: Work State Routes; exports ownerGoalsRowRefusal, WorkStateRoutes. |
| [WorkViewRoutes.ts](../src/services/worker/http/routes/WorkViewRoutes.ts) | Code module: Work View Routes; exports isReportedReadyForCheck, workViewLoopbackOnly, requireWorkViewOrigin, myRulesImportLine, SetupWorkItem and 3 more. |

## src/services/worker/knowledge/

Application source.

| File | Responsibility |
| --- | --- |
| [CorpusBuilder.ts](../src/services/worker/knowledge/CorpusBuilder.ts) | Code module: Corpus Builder; exports CorpusBuilder. |
| [CorpusRenderer.ts](../src/services/worker/knowledge/CorpusRenderer.ts) | Code module: Corpus Renderer; exports CorpusRenderer. |
| [CorpusStore.ts](../src/services/worker/knowledge/CorpusStore.ts) | Code module: Corpus Store; exports CORPUS_NAME_PATTERN, CORPUS_NAME_ERROR, CorpusStore. |
| [KnowledgeAgent.ts](../src/services/worker/knowledge/KnowledgeAgent.ts) | Code module: Knowledge Agent; exports isSessionResumeError, KnowledgeAgentCallOptions, KnowledgeAgent. |
| [types.ts](../src/services/worker/knowledge/types.ts) | Code module: types; exports CorpusFilter, CorpusStats, CorpusObservation, CorpusFile, QueryResult. |

## src/services/worker/search/

Application source.

| File | Responsibility |
| --- | --- |
| [ResultFormatter.ts](../src/services/worker/search/ResultFormatter.ts) | Code module: Result Formatter; exports ResultFormatter. |
| [SearchOrchestrator.ts](../src/services/worker/search/SearchOrchestrator.ts) | Code module: Search Orchestrator; exports assertSearchHasQueryOrFilter, SearchOrchestrator. |
| [errors.ts](../src/services/worker/search/errors.ts) | Code module: errors; exports ChromaUnavailableError, ChromaCorruptCollectionError, logChromaWriteFailure. |
| [index.ts](../src/services/worker/search/index.ts) | Code module: index. |
| [project-where-filter.ts](../src/services/worker/search/project-where-filter.ts) | Code module: project where filter; exports projectReadKeysFor, buildProjectWhereFilter. |
| [types.ts](../src/services/worker/search/types.ts) | Code module: types; exports SEARCH_CONSTANTS, parseSearchRecencyWindowMs, ChromaDocType, SEARCH_CATEGORIES, SearchCategory and 11 more. |

## src/services/worker/search/strategies/

Application source.

| File | Responsibility |
| --- | --- |
| [ChromaSearchStrategy.ts](../src/services/worker/search/strategies/ChromaSearchStrategy.ts) | Code module: Chroma Search Strategy; exports ChromaSearchStrategy. |
| [HybridSearchStrategy.ts](../src/services/worker/search/strategies/HybridSearchStrategy.ts) | Code module: Hybrid Search Strategy; exports HybridSearchStrategy. |
| [SQLiteSearchStrategy.ts](../src/services/worker/search/strategies/SQLiteSearchStrategy.ts) | Code module: SQLite Search Strategy; exports SQLiteSearchStrategy. |

## src/services/worker/session/

Application source.

| File | Responsibility |
| --- | --- |
| [GeneratorExitHandler.ts](../src/services/worker/session/GeneratorExitHandler.ts) | Code module: Generator Exit Handler; exports GeneratorExitDependencies, handleGeneratorExit. |
| [GeneratorRunner.ts](../src/services/worker/session/GeneratorRunner.ts) | Code module: Generator Runner; exports GeneratorRunnerDependencies, OBSERVER_TEXT_QUOTA_MESSAGE, quotaPauseForExit, startGeneratorWithProvider. |
| [OutputRecovery.ts](../src/services/worker/session/OutputRecovery.ts) | Code module: Output Recovery; exports RejectedOutputDisposition, recordRejectedOutput, clearRejectedOutput. |
| [SessionCompletionHandler.ts](../src/services/worker/session/SessionCompletionHandler.ts) | Code module: Session Completion Handler; exports SessionCompletionHandler. |
| [abort-reason.ts](../src/services/worker/session/abort-reason.ts) | Code module: abort reason; exports NormalizedAbortReason, PROVIDER_SWITCH_BOUNDARY_ABORT_REASON, abortCategoryOf, PRESERVED_ABORT_CATEGORIES, normalizeAbortReason. |
| [recycle-conversation.ts](../src/services/worker/session/recycle-conversation.ts) | Code module: recycle conversation; exports loadSessionStartContext, openObserverGeneration, observesBarePrompts, MAX_CONSECUTIVE_RECYCLES, OVERFLOW_EXHAUSTED_COOLDOWN_MS and 2 more. |
| [response-pacer.ts](../src/services/worker/session/response-pacer.ts) | Code module: response pacer; exports PacerWaitOutcome, RESPONSE_STALL_RESUME_DELAY_MS, MAX_CONSECUTIVE_STALL_RESUMES, MAX_CONSECUTIVE_SDK_STREAM_EXITS, MAX_CONSECUTIVE_RATE_LIMIT_RESUMES and 6 more. |
| [tier-routing.ts](../src/services/worker/session/tier-routing.ts) | Code module: tier routing; exports SIMPLE_TIER_TOOLS, isSimpleTierMessage, namesSameClaudeModel. |

## src/services/worker/validation/

Application source.

| File | Responsibility |
| --- | --- |
| [PrivacyCheckValidator.ts](../src/services/worker/validation/PrivacyCheckValidator.ts) | Code module: Privacy Check Validator; exports PromptPrivacyDecision, PrivacyCheckValidator. |

## src/shared/

Shared contracts, settings and identity utilities.

| File | Responsibility |
| --- | --- |
| [EnvManager.ts](../src/shared/EnvManager.ts) | Code module: Env Manager; exports credentialProfileKey, resolveConfigDirProfileKey, envFilePath, ClaudeMemEnv, loadClaudeMemEnv and 7 more. |
| [SettingsDefaultsManager.ts](../src/shared/SettingsDefaultsManager.ts) | Code module: Settings Defaults Manager; exports DEFAULT_LLM_TIMEOUT_MS, SettingsDefaults, SettingsDefaultsManager. |
| [advisor-transcript.ts](../src/shared/advisor-transcript.ts) | Code module: advisor transcript; exports ADVISOR_SCAN_TAIL_BYTES, TranscriptAdvisorCall, ExtractAdvisorCallsOptions, readTranscriptTail, extractAdvisorCalls and 1 more. |
| [api-key-pool.ts](../src/shared/api-key-pool.ts) | Code module: api key pool; exports KeyPoolId, API_KEY_COOLDOWN_FILENAME, MAX_POOL_KEYS, KEY_COOLDOWN_MS, KEY_ROTATE_KINDS and 13 more. |
| [assistant-text.ts](../src/shared/assistant-text.ts) | Code module: assistant text; exports assistantText. |
| [atomic-json.ts](../src/shared/atomic-json.ts) | Code module: atomic json; exports IS_WINDOWS_PLATFORM, stripUtf8Bom, parseJsonWithBom, readJsonFileWithBom, ensureDirectoryExists and 5 more. |
| [capped-error-body.ts](../src/shared/capped-error-body.ts) | Code module: capped error body; exports MAX_ERROR_BODY_BYTES, readCappedErrorBody. |
| [claude-fallback-readiness-override.ts](../src/shared/claude-fallback-readiness-override.ts) | Code module: claude fallback readiness override; exports getClaudeFallbackReadinessOverride, setClaudeFallbackReadinessForTesting. |
| [claude-fallback-readiness.ts](../src/shared/claude-fallback-readiness.ts) | Code module: claude fallback readiness; exports hasClaudeCredentials, hasClaudeSubscriptionLogin, claudeQuotaStandIn, claudeStandInStillServes, canClaudeServeAsFallback. |
| [cmem-gateway.ts](../src/shared/cmem-gateway.ts) | Code module: cmem gateway; exports cmemProOrigin, isCmemGatewayUrl, CmemGatewayRole, cmemGatewayRole, canCmemGatewayServe and 12 more. |
| [codex-compaction-gate.ts](../src/shared/codex-compaction-gate.ts) | Code module: codex compaction gate; exports markTimelinePending, clearTimelinePending, takeTimelinePending. |
| [connection-errors.ts](../src/shared/connection-errors.ts) | Code module: connection errors; exports isConnectionRefusedError, isUnbindablePortError, UNBINDABLE_PORT_REMEDIATION. |
| [context-cache.ts](../src/shared/context-cache.ts) | Code module: context cache; exports CONTEXT_CACHE_MAX_AGE_MS, CONTEXT_PLACEHOLDER_NONCE, CONTEXT_HEADER_TIME_PLACEHOLDER, HEADER_TIME_MAX_FILLED_CHARS, HEADER_TIME_EXPANSION_RESERVE_CHARS and 13 more. |
| [context-count.ts](../src/shared/context-count.ts) | Code module: context count; exports parseContextCountValue. |
| [context-invalidation.ts](../src/shared/context-invalidation.ts) | Code module: context invalidation; exports ContextInvalidationScope, ContextInvalidationKind, ContextInvalidation, onContextInvalidation, emitContextInvalidation and 2 more. |
| [date-bounds.ts](../src/shared/date-bounds.ts) | Code module: date bounds; exports resolveDateBound. |
| [deliverables-transcript.ts](../src/shared/deliverables-transcript.ts) | Code module: deliverables transcript; exports DELIVERABLE_SCAN_TAIL_BYTES, TranscriptFileWrite, TranscriptWorkStateWrite, TranscriptFileActivity, ExtractFileActivityOptions and 3 more. |
| [deliverables.ts](../src/shared/deliverables.ts) | Code module: deliverables; exports DELIVERABLES_DIRNAME, resolveDeliverablesDir, deliverableBucketFolderName, resolveDeliverableBucketDir, isInsideDeliverablesDir and 5 more. |
| [dependency-health.ts](../src/shared/dependency-health.ts) | Code module: dependency health; exports DependencyStatusKind, DependencyName, DependencyStatus, CLAUDE_CLI_SETUP_RECHECK_COOLDOWN_MS, CLAUDE_CLI_SETUP_REMEDIATION and 19 more. |
| [executable-fingerprint.ts](../src/shared/executable-fingerprint.ts) | Code module: executable fingerprint; exports executableFingerprint. |
| [expand-home.ts](../src/shared/expand-home.ts) | Code module: expand home; exports expandHome. |
| [find-claude-executable.ts](../src/shared/find-claude-executable.ts) | Code module: find claude executable; exports CAPABILITY_PROBE_ARGS, resetClaudeExecutableCache, _internals, ClaudeExecutableUnspawnableError, isClaudeExecutableUnspawnable and 1 more. |
| [gemini-answer-text.ts](../src/shared/gemini-answer-text.ts) | Code module: gemini answer text; exports GeminiPart, readGeminiAnswerText. |
| [gemini-error-details.ts](../src/shared/gemini-error-details.ts) | Code module: gemini error details; exports GeminiErrorDetails, parseRetryDelayMs, parseGeminiErrorDetails, GEMINI_REGION_REFUSAL_CODE, GEMINI_REGION_REFUSAL_ACTION and 2 more. |
| [hook-constants.ts](../src/shared/hook-constants.ts) | Code module: hook constants; exports HOOK_TIMEOUTS, WEDGED_WORKER_UPTIME_DEFAULT_S, WEDGED_WORKER_UPTIME_BOUNDS_S, readWedgedWorkerUptimeSeconds, HOOK_EXIT_CODES and 8 more. |
| [hook-io.ts](../src/shared/hook-io.ts) | Code module: hook io; exports HookStderrBuffer, installHookStderrBuffer, emitDiagnostic, HookStdoutError, emitModelContext and 4 more. |
| [hook-settings.ts](../src/shared/hook-settings.ts) | Code module: hook settings; exports loadFromFileOnce. |
| [hook-spool-remote.ts](../src/shared/hook-spool-remote.ts) | Code module: hook spool remote; exports REMOTE_SPOOL_PROTOCOL_VERSION, REMOTE_SPOOL_TIMEOUT_MS, REMOTE_SPOOL_REQUEST_TIMEOUT_MS, REMOTE_SPOOL_MAX_ENTRIES, remoteSpoolEnvelopeSchema and 3 more. |
| [hook-spool.ts](../src/shared/hook-spool.ts) | Code module: hook spool; exports HOOK_SPOOL_KINDS, HookSpoolKind, SpooledObservationPayload, SpooledSummarizePayload, SpooledSessionEndPayload and 21 more. |
| [host-hook-limits.ts](../src/shared/host-hook-limits.ts) | Code module: host hook limits; exports ANTIGRAVITY_HOOK_TIMEOUT_MS, SESSION_START_HOOK_LIMIT_MS, serverSessionStartBudgetMs. |
| [integration-id.ts](../src/shared/integration-id.ts) | Code module: integration id; exports canonicalIntegrationId. |
| [intent-credentials.ts](../src/shared/intent-credentials.ts) | Code module: intent credentials; exports IntentCredentials, readIntentCredentials, getOrCreateIntentCredentials, intentCredentialHeaders. |
| [is-tool-skipped.ts](../src/shared/is-tool-skipped.ts) | Code module: is tool skipped; exports isToolSkipped. |
| [kill-process-tree.ts](../src/shared/kill-process-tree.ts) | Code module: kill process tree; exports ProcessTreeKillError, KillProcessTreeOptions, killProcessTree, DescendantIdentity, collectDescendantIdentities and 1 more. |
| [kimi-context-gate.ts](../src/shared/kimi-context-gate.ts) | Code module: kimi context gate; exports hasInjected, markInjected, clearInjected. |
| [kimi-paths.ts](../src/shared/kimi-paths.ts) | Code module: kimi paths; exports kimiCodeHome, kimiConfigPath, kimiMcpJsonPath. |
| [known-marketplace-location.ts](../src/shared/known-marketplace-location.ts) | Code module: known marketplace location; exports knownMarketplaceInstallLocation, marketplaceDirectoryCandidates. |
| [memory-instructions.ts](../src/shared/memory-instructions.ts) | Code module: memory instructions; exports MEMORY_PLUGIN_INSTRUCTIONS, memoryInstructionsForRuntime. |
| [memory-retrieval-tools.ts](../src/shared/memory-retrieval-tools.ts) | Code module: memory retrieval tools; exports isRecursiveMemoryTool, isExplicitMemoryWrite. |
| [network-failure.ts](../src/shared/network-failure.ts) | Code module: network failure; exports NetworkFailureDetail, describeNetworkFailure, isConnectionRefused, networkFailureSuffix. |
| [oauth-token.ts](../src/shared/oauth-token.ts) | Code module: oauth token; exports sanitizeMacOsKeychainAccount, resolveEffectiveClaudeConfigDir, ClaudeCredentialProfile, resolveClaudeCredentialProfile, deriveMacKeychainServiceName and 11 more. |
| [observed-billing.ts](../src/shared/observed-billing.ts) | Code module: observed billing; exports ObservedBilling, claudeJsonPath, detectObservedBilling. |
| [observer-health.ts](../src/shared/observer-health.ts) | Code module: observer health; exports ObserverHealthState, ObserverQuotaCooldown, ObserverFailureDetail, OBSERVER_HEALTH_FILENAME, OBSERVER_UNHEALTHY_FAILURE_THRESHOLD and 21 more. |
| [observer-recycle.ts](../src/shared/observer-recycle.ts) | Code module: observer recycle; exports OBSERVER_CONVERSATION_MAX_CHARS, windowAwareConversationMaxChars, conversationChars, generationUsageChars, describeGenerationUsage and 2 more. |
| [openai-compat-presets.ts](../src/shared/openai-compat-presets.ts) | Code module: openai compat presets; exports OpenAICompatPreset, OPENAI_COMPAT_PRESETS, DEFAULT_OPENAI_COMPAT_PRESET_ID, resolveOpenAICompatPreset. |
| [openrouter-attribution.ts](../src/shared/openrouter-attribution.ts) | Code module: openrouter attribution; exports OPENROUTER_APP_URL, OPENROUTER_APP_TITLE, OPENROUTER_APP_CATEGORIES, openRouterAttributionHeaders. |
| [openrouter-base-url.ts](../src/shared/openrouter-base-url.ts) | Code module: openrouter base url; exports DEFAULT_OPENROUTER_API_URL, isHttpUrl, resolveOpenRouterChatCompletionsUrl, isOpenRouterApiUrl. |
| [openrouter-extra-body.ts](../src/shared/openrouter-extra-body.ts) | Code module: openrouter extra body; exports PROTECTED_EXTRA_BODY_KEYS, ParsedExtraBody, parseOpenRouterExtraBody, withOpenRouterExtraBody. |
| [openrouter-token-compatibility.ts](../src/shared/openrouter-token-compatibility.ts) | Code module: openrouter token compatibility; exports isMaxCompletionTokensCompatibilityError, fetchWithOpenRouterTokenCompatibility. |
| [owned-file-install.ts](../src/shared/owned-file-install.ts) | Code module: owned file install; exports OwnedFile, readProjectAttribution, replaceOwnedFiles. |
| [path-utils.ts](../src/shared/path-utils.ts) | Code module: path utils; exports normalizePath, isDirectChild. |
| [paths.ts](../src/shared/paths.ts) | Code module: paths; exports resolveDataDir, DATA_DIR, DEFAULT_CLAUDE_CONFIG_DIR, CLAUDE_CONFIG_DIR, MARKETPLACE_ROOT and 13 more. |
| [period-rate-limit.ts](../src/shared/period-rate-limit.ts) | Code module: period rate limit; exports namesPeriodRateLimit. |
| [platform-source.ts](../src/shared/platform-source.ts) | Code module: platform source; exports DEFAULT_PLATFORM_SOURCE, normalizePlatformSource, normalizePlatformSourceOrNull, sortPlatformSources. |
| [plugin-dependency-closure.ts](../src/shared/plugin-dependency-closure.ts) | Code module: plugin dependency closure; exports findMissingPluginDependencies. |
| [plugin-state.ts](../src/shared/plugin-state.ts) | Code module: plugin state; exports isPluginDisabledInClaudeSettings. |
| [port-reclaim.ts](../src/shared/port-reclaim.ts) | Code module: port reclaim; exports isChromaSidecarName, WindowsProcessRow, chromaCmdlineMatchesDataDir, parseLinuxProcStat, parseMacProcessTable and 20 more. |
| [pro-promo.ts](../src/shared/pro-promo.ts) | Code module: pro promo; exports PRO_TRIAL_URL, ProPromoSource, PRO_TRIAL_MAX_DAYS, PRO_TRIAL_LABEL, proTrialUrl and 3 more. |
| [process-identity.ts](../src/shared/process-identity.ts) | Code module: process identity; exports __identityProbeCountForTesting, startTokenFromSpawnResult, captureProcessStartToken, captureProcessName, normalizeProcessName and 3 more. |
| [progressive-search.ts](../src/shared/progressive-search.ts) | Code module: progressive search; exports MemoryIndexRow, MemoryDetail, ProgressiveSearchInput, ProgressiveBackend, SearchTrace and 9 more. |
| [quota-cooldown.ts](../src/shared/quota-cooldown.ts) | Code module: quota cooldown; exports QuotaProvider, ClaudeCredential, QUOTA_COOLDOWN_FILENAME, setClaudeProfileResolverForTesting, cooldownAppliesToCurrentAccount and 22 more. |
| [relayed-text.ts](../src/shared/relayed-text.ts) | Code module: relayed text; exports RELAYED_TEXT_MAX_CHARS, relayedLine, relayedBlock, clipUtf16, relayedLink. |
| [semantic-context.ts](../src/shared/semantic-context.ts) | Code module: semantic context; exports SEMANTIC_CONTEXT_MIN_QUERY_CHARS, SEMANTIC_CONTEXT_MAX_LIMIT, SemanticContextItem, renderSemanticContext. |
| [server-context-limits.ts](../src/shared/server-context-limits.ts) | Code module: server context limits; exports SERVER_CONTEXT_MAX_LIMIT, SERVER_CONTEXT_RECENT_DEFAULT_LIMIT, SERVER_CONTEXT_QUERY_DEFAULT_LIMIT. |
| [session-marker-files.ts](../src/shared/session-marker-files.ts) | Code module: session marker files; exports SessionMarkerFiles, sessionMarkerFiles. |
| [settings-document.ts](../src/shared/settings-document.ts) | Code module: settings document; exports SettingsDocument, SettingsDocumentResult, classifySettingsDocument, settingsTarget, withoutStaleRootCopies and 2 more. |
| [setup-state.ts](../src/shared/setup-state.ts) | Code module: setup state; exports SetupBranch, SetupMemoryBilling, SetupInstallerStage, SetupChoice, SetupInstallerReport and 13 more. |
| [should-skip-agent-observation.ts](../src/shared/should-skip-agent-observation.ts) | Code module: should skip agent observation; exports AgentSkipReason, AgentSkipSettings, AgentSkipDecision, parseSkipAgentTypes, shouldSkipAgentObservation. |
| [should-track-project.ts](../src/shared/should-track-project.ts) | Code module: should track project; exports shouldTrackProject, shouldEmitProjectRow. |
| [spawn.ts](../src/shared/spawn.ts) | Code module: spawn; exports SpawnHiddenOptions, spawnHidden, WINDOWS_CMD_EXTENSIONS, WINDOWS_NATIVE_EXTENSIONS, WINDOWS_COMMAND_EXTENSIONS and 11 more. |
| [sse-reader.ts](../src/shared/sse-reader.ts) | Code module: sse reader; exports SseEvent, ReadSseEventsOptions, SseEventTooLargeError, StreamEndedEarlyError, iterateByteStream and 1 more. |
| [subagent-predicate.ts](../src/shared/subagent-predicate.ts) | Code module: subagent predicate; exports isSubagentEvent, mainAgentRowSql. |
| [sync-health.ts](../src/shared/sync-health.ts) | Code module: sync health; exports SYNC_HEALTH_FILENAME, SYNC_FAILING_WARN_AFTER_MS, SYNC_FAILING_WARN_AFTER_FAILURES, SyncAuthCode, SyncAuthFailure and 11 more. |
| [teambrain.ts](../src/shared/teambrain.ts) | Code module: teambrain; exports TEAM_BRIEF_MAX_CHARS, TEAM_SEARCH_MAX_CHARS, TEAM_BRIEF_RESERVE_CHARS, TeamBrainSettings, TeamBrainConnection and 31 more. |
| [text-truncation.ts](../src/shared/text-truncation.ts) | Code module: text truncation; exports retainTextHeadTail. |
| [timeline-formatting.ts](../src/shared/timeline-formatting.ts) | Code module: timeline formatting; exports parseJsonArray, formatDateTime, formatTime, formatDate, formatSystemLocaleDateTime and 6 more. |
| [transcript-parser.ts](../src/shared/transcript-parser.ts) | Code module: transcript parser; exports TRANSCRIPT_TAIL_INITIAL_BYTES, TRANSCRIPT_TAIL_MAX_CHUNK_BYTES, TRANSCRIPT_MODEL_SEARCH_BUDGET_BYTES, TranscriptTailOptions, findLastJsonlEntryBackward and 7 mo |
| [uptime.ts](../src/shared/uptime.ts) | Code module: uptime; exports getUptimeSeconds. |
| [user-prompts.ts](../src/shared/user-prompts.ts) | Code module: user prompts; exports USER_PROMPT_DEDUPE_WINDOW_MS. |
| [uvx-bin-dirs.ts](../src/shared/uvx-bin-dirs.ts) | Code module: uvx bin dirs; exports UvxBinDirOptions, getUvxBinDirs. |
| [uvx-env.ts](../src/shared/uvx-env.ts) | Code module: uvx env; exports FOREIGN_PYTHON_ENV_VARS, stripForeignPythonEnv. |
| [viewer-url.ts](../src/shared/viewer-url.ts) | Code module: viewer url; exports viewerBaseUrl. |
| [windows-listen-socket.ts](../src/shared/windows-listen-socket.ts) | Code module: windows listen socket; exports clearWindowsListenSocketInherit. |
| [work-state-setting.ts](../src/shared/work-state-setting.ts) | Code module: work state setting; exports isWorkStateEnabled. |
| [work-state-telemetry.ts](../src/shared/work-state-telemetry.ts) | Code module: work state telemetry; exports WorkStateTool, WorkStateOutcome, InstructionState, AgentRole, WorkStateAttribution and 3 more. |
| [worker-autostart.ts](../src/shared/worker-autostart.ts) | Code module: worker autostart; exports isWorkerAutostartDisabled. |
| [worker-request-timeout-error.ts](../src/shared/worker-request-timeout-error.ts) | Code module: worker request timeout error; exports WorkerRequestTimeoutError. |
| [worker-spawn-gate.ts](../src/shared/worker-spawn-gate.ts) | Code module: worker spawn gate; exports SPAWN_LOCK_STALE_MS, acquireSpawnLock, releaseSpawnLock, holdSpawnLock. |
| [worker-url.ts](../src/shared/worker-url.ts) | Code module: worker url; exports formatHostForUrl. |
| [worker-utils.ts](../src/shared/worker-utils.ts) | Code module: worker utils; exports isWorkerFetchVerboseEnabled, fetchWithTimeout, IdleTimeoutOptions, IdleFetchResponseMeta, IdleFetchTextResult and 36 more. |

## src/storage/postgres/

PostgreSQL storage implementation.

| File | Responsibility |
| --- | --- |
| [agent-events.ts](../src/storage/postgres/agent-events.ts) | Code module: agent events; exports PostgresAgentEvent, CreatePostgresAgentEventInput, PostgresAgentEventsRepository, buildAgentEventIdempotencyKey. |
| [auth.ts](../src/storage/postgres/auth.ts) | Code module: auth; exports PostgresApiKey, PostgresAuditLog, PostgresAuthRepository. |
| [config.ts](../src/storage/postgres/config.ts) | Code module: config; exports PostgresConfig, ParsePostgresConfigOptions, getPostgresDatabaseUrl, parsePostgresConfig. |
| [data-deletion.ts](../src/storage/postgres/data-deletion.ts) | Code module: data deletion; exports PurgeCounts, PostgresDataDeletionRepository. |
| [generation-jobs.ts](../src/storage/postgres/generation-jobs.ts) | Code module: generation jobs; exports ObservationGenerationJobSourceType, ObservationGenerationJobStatus, ObservationGenerationJobEventType, PostgresObservationGenerationJob, PostgresObservationGenera |
| [index.ts](../src/storage/postgres/index.ts) | Code module: index; exports PostgresStorageRepositories, createPostgresStorageRepositories. |
| [observation-embeddings.ts](../src/storage/postgres/observation-embeddings.ts) | Code module: observation embeddings; exports ObservationEmbeddingPart, MAX_FACT_PARTS, observationEmbeddingParts, toVectorLiteral, vectorSearchAvailable and 2 more. |
| [observations.ts](../src/storage/postgres/observations.ts) | Code module: observations; exports ObservationSourceType, PostgresObservation, PostgresObservationSource, usesWebsearchSyntax, PostgresObservationRepository and 2 more. |
| [pool.ts](../src/storage/postgres/pool.ts) | Code module: pool; exports PostgresPool, PostgresPoolClient, createPostgresPool, getSharedPostgresPool, withPostgresTransaction and 1 more. |
| [projects.ts](../src/storage/postgres/projects.ts) | Code module: projects; exports PostgresProject, PostgresProjectsRepository. |
| [rate-limit.ts](../src/storage/postgres/rate-limit.ts) | Code module: rate limit; exports RateLimitResult, PostgresRateLimitRepository. |
| [schema.ts](../src/storage/postgres/schema.ts) | Code module: schema; exports SERVER_POSTGRES_SCHEMA_VERSION, SERVER_POSTGRES_TABLES, VectorSchemaMode, bootstrapServerPostgresSchema, bm25Order and 1 more. |
| [server-sessions.ts](../src/storage/postgres/server-sessions.ts) | Code module: server sessions; exports PostgresServerSession, PostgresServerSessionsRepository, buildServerSessionIdempotencyKey. |
| [teams.ts](../src/storage/postgres/teams.ts) | Code module: teams; exports PostgresTeamRole, PostgresTeam, PostgresTeamMember, PostgresTeamsRepository. |
| [usage.ts](../src/storage/postgres/usage.ts) | Code module: usage; exports UsageKind, PostgresUsageRepository. |
| [utils.ts](../src/storage/postgres/utils.ts) | Code module: utils; exports JsonObject, JsonValue, PostgresQueryable, newId, toJsonObject and 8 more. |

## src/storage/sqlite/

SQLite storage implementation.

| File | Responsibility |
| --- | --- |
| [agent-events.ts](../src/storage/sqlite/agent-events.ts) | Code module: agent events; exports AgentEventsRepository. |
| [auth.ts](../src/storage/sqlite/auth.ts) | Code module: auth; exports AuthRepository. |
| [index.ts](../src/storage/sqlite/index.ts) | Code module: index. |
| [memory-items.ts](../src/storage/sqlite/memory-items.ts) | Code module: memory items; exports MAX_MEMORY_SEARCH_TERMS, isMemorySearchQueryWithinLimit, MemoryItemsRepository. |
| [projects.ts](../src/storage/sqlite/projects.ts) | Code module: projects; exports ProjectsRepository. |
| [schema.ts](../src/storage/sqlite/schema.ts) | Code module: schema; exports SERVER_STORAGE_SCHEMA_VERSION, SERVER_OWNED_TABLES, ensureServerStorageSchema. |
| [serde.ts](../src/storage/sqlite/serde.ts) | Code module: serde; exports stringifyJson, parseJsonObject, parseJsonArray. |
| [server-sessions.ts](../src/storage/sqlite/server-sessions.ts) | Code module: server sessions; exports ServerSessionsRepository. |

## src/supervisor/

Application source.

| File | Responsibility |
| --- | --- |
| [env-sanitizer.ts](../src/supervisor/env-sanitizer.ts) | Code module: env sanitizer; exports ENV_PREFIXES, ENV_EXACT_MATCHES, ENV_PROXY_VARS, ENV_PRESERVE, sanitizeEnv. |
| [health-checker.ts](../src/supervisor/health-checker.ts) | Code module: health checker; exports startHealthChecker, stopHealthChecker. |
| [index.ts](../src/supervisor/index.ts) | Code module: index; exports ValidateWorkerPidStatus, startSupervisor, getSupervisor, configureSupervisorSignalHandlers, validateWorkerPidFile. |
| [orphan-chroma-sweep.ts](../src/supervisor/orphan-chroma-sweep.ts) | Code module: orphan chroma sweep; exports ProcessRow, CHROMA_LAUNCH_SIGNATURE, SweepDeps, SweepResult, parseProcessTable and 3 more. |
| [process-registry.ts](../src/supervisor/process-registry.ts) | Code module: process registry; exports ManagedProcessInfo, ManagedProcessRecord, RegistryDegradedReporter, setRegistryDegradedReporter, isPidAlive and 23 more. |
| [shutdown.ts](../src/supervisor/shutdown.ts) | Code module: shutdown; exports ShutdownCascadeOptions, runShutdownCascade, removeOwnedPidFile. |

## src/types/

Application source.

| File | Responsibility |
| --- | --- |
| [database.ts](../src/types/database.ts) | Code module: database; exports TableColumnInfo, IndexInfo, TableNameRow, SchemaVersion, ObservationRecord and 4 more. |
| [shell-quote.d.ts](../src/types/shell-quote.d.ts) | Type declarations: shell quote.d. |

## src/ui/

Application source.

| File | Responsibility |
| --- | --- |
| [catppuccin.css](../src/ui/catppuccin.css) | Styles and design tokens: catppuccin. |
| [claude-mem-logo-stylized.png](../src/ui/claude-mem-logo-stylized.png) | Image/icon asset: claude mem logo stylized. |
| [claude-mem-logomark.webp](../src/ui/claude-mem-logomark.webp) | Image/icon asset: claude mem logomark. |
| [icon-thick-completed.svg](../src/ui/icon-thick-completed.svg) | Image/icon asset: icon thick completed. |
| [icon-thick-investigated.svg](../src/ui/icon-thick-investigated.svg) | Image/icon asset: icon thick investigated. |
| [icon-thick-learned.svg](../src/ui/icon-thick-learned.svg) | Image/icon asset: icon thick learned. |
| [icon-thick-next-steps.svg](../src/ui/icon-thick-next-steps.svg) | Image/icon asset: icon thick next steps. |
| [icon-thick-notes.svg](../src/ui/icon-thick-notes.svg) | Image/icon asset: icon thick notes. |
| [tv.html](../src/ui/tv.html) | HTML page/template: tv. |
| [viewer-template.html](../src/ui/viewer-template.html) | HTML page/template: viewer template. |

## src/ui/my-work/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [.gitignore](../src/ui/my-work/.gitignore) | Supporting file: . |
| [.oxlintrc.json](../src/ui/my-work/.oxlintrc.json) | Configuration or structured data: .oxlintrc. |
| [COVERAGE.md](../src/ui/my-work/COVERAGE.md) | Documentation: Spec coverage. |
| [README.md](../src/ui/my-work/README.md) | Documentation: My Work wireframe. |
| [components.json](../src/ui/my-work/components.json) | Configuration or structured data: components. |
| [index.html](../src/ui/my-work/index.html) | HTML page/template: index. |
| [package-lock.json](../src/ui/my-work/package-lock.json) | Pinned dependency resolution for this package. |
| [package.json](../src/ui/my-work/package.json) | Package metadata, dependencies and scripts for my-work-wireframe. |
| [tsconfig.app.json](../src/ui/my-work/tsconfig.app.json) | Configuration or structured data: tsconfig.app. |
| [tsconfig.json](../src/ui/my-work/tsconfig.json) | Configuration or structured data: tsconfig. |
| [tsconfig.node.json](../src/ui/my-work/tsconfig.node.json) | Configuration or structured data: tsconfig.node. |
| [vite.config.ts](../src/ui/my-work/vite.config.ts) | Code module: vite.config. |

## src/ui/my-work/public/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [favicon.svg](../src/ui/my-work/public/favicon.svg) | Image/icon asset: favicon. |
| [icons.svg](../src/ui/my-work/public/icons.svg) | Image/icon asset: icons. |

## src/ui/my-work/scripts/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [coverage.mjs](../src/ui/my-work/scripts/coverage.mjs) | Code module: coverage. |

## src/ui/my-work/src/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [App.tsx](../src/ui/my-work/src/App.tsx) | UI module: App; exports App. |
| [data-goals.ts](../src/ui/my-work/src/data-goals.ts) | Code module: data goals; exports SAMPLE_FOCUS_AREAS, SAMPLE_OTHER_ASKS, SAMPLE_CURRENT_PERIOD, SAMPLE_PAST_PERIODS. |
| [data-rules.ts](../src/ui/my-work/src/data-rules.ts) | Code module: data rules; exports RuleTier, RuleScope, RULE_TIERS, SAMPLE_RULE_SCOPES, RuleQuote and 9 more. |
| [data.ts](../src/ui/my-work/src/data.ts) | Code module: data; exports Device, AgentTool, Agent, Stage, LiveState and 42 more. |
| [index.css](../src/ui/my-work/src/index.css) | Styles and design tokens: index. |
| [main.tsx](../src/ui/my-work/src/main.tsx) | UI module: main. |

## src/ui/my-work/src/assets/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [hero.png](../src/ui/my-work/src/assets/hero.png) | Image/icon asset: hero. |
| [react.svg](../src/ui/my-work/src/assets/react.svg) | Image/icon asset: react. |
| [vite.svg](../src/ui/my-work/src/assets/vite.svg) | Image/icon asset: vite. |

## src/ui/my-work/src/components/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [bits.tsx](../src/ui/my-work/src/components/bits.tsx) | UI module: bits; exports ActivePill, Workspace, WorkspaceContext, useWorkspace, AgentIcon and 15 more. |
| [brand.tsx](../src/ui/my-work/src/components/brand.tsx) | UI module: brand; exports CmemMark, AgentMark. |
| [focus-changes.tsx](../src/ui/my-work/src/components/focus-changes.tsx) | UI module: focus changes; exports FocusChanges, useFocusChanges, FocusChangeBar, AreaEdit, AreaEditDialog. |
| [focus-header.tsx](../src/ui/my-work/src/components/focus-header.tsx) | UI module: focus header; exports Quotes, FocusHeader, OtherHeader. |
| [focus-nav.tsx](../src/ui/my-work/src/components/focus-nav.tsx) | UI module: focus nav; exports SIDE_NAV_PILL, FocusSelection, FocusRail, PastFocusLink, FocusChipRow. |
| [request-card.tsx](../src/ui/my-work/src/components/request-card.tsx) | UI module: request card; exports OpenFollowUps, Deliverables, RequestCard. |
| [request-detail.tsx](../src/ui/my-work/src/components/request-detail.tsx) | UI module: request detail; exports RequestDetail. |
| [save-button.tsx](../src/ui/my-work/src/components/save-button.tsx) | UI module: save button; exports SaveButton. |
| [split-flap.tsx](../src/ui/my-work/src/components/split-flap.tsx) | UI module: split flap; exports SplitFlapText. |

## src/ui/my-work/src/components/aceternity/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [card-hover-effect.tsx](../src/ui/my-work/src/components/aceternity/card-hover-effect.tsx) | UI module: card hover effect; exports HoverEffect, Card, CardTitle, CardDescription. |
| [card-spotlight.tsx](../src/ui/my-work/src/components/aceternity/card-spotlight.tsx) | UI module: card spotlight; exports CardSpotlight. |
| [dotted-glow-background.tsx](../src/ui/my-work/src/components/aceternity/dotted-glow-background.tsx) | UI module: dotted glow background; exports DottedGlowBackground. |
| [draggable-card.tsx](../src/ui/my-work/src/components/aceternity/draggable-card.tsx) | UI module: draggable card; exports DraggableCardBody, DraggableCardContainer. |
| [encrypted-text.tsx](../src/ui/my-work/src/components/aceternity/encrypted-text.tsx) | UI module: encrypted text; exports EncryptedText. |
| [glare-card.tsx](../src/ui/my-work/src/components/aceternity/glare-card.tsx) | UI module: glare card; exports GlareCard. |
| [glowing-effect.tsx](../src/ui/my-work/src/components/aceternity/glowing-effect.tsx) | UI module: glowing effect. |
| [notch.tsx](../src/ui/my-work/src/components/aceternity/notch.tsx) | UI module: notch; exports NotchOption, NotchItem, NotchProps, Notch. |
| [placeholders-and-vanish-input.tsx](../src/ui/my-work/src/components/aceternity/placeholders-and-vanish-input.tsx) | UI module: placeholders and vanish input; exports PlaceholdersAndVanishInput. |
| [pointer-highlight.tsx](../src/ui/my-work/src/components/aceternity/pointer-highlight.tsx) | UI module: pointer highlight; exports PointerHighlight. |
| [resizable-navbar.tsx](../src/ui/my-work/src/components/aceternity/resizable-navbar.tsx) | UI module: resizable navbar; exports Navbar, NavBody, NavItems, MobileNav, MobileNavHeader and 4 more. |
| [sparkles.tsx](../src/ui/my-work/src/components/aceternity/sparkles.tsx) | UI module: sparkles; exports SparklesCore. |
| [stateful-button.tsx](../src/ui/my-work/src/components/aceternity/stateful-button.tsx) | UI module: stateful button; exports StatefulButton. |
| [sticky-banner.tsx](../src/ui/my-work/src/components/aceternity/sticky-banner.tsx) | UI module: sticky banner; exports StickyBanner. |
| [tabs.tsx](../src/ui/my-work/src/components/aceternity/tabs.tsx) | UI module: tabs; exports Tabs, FadeInDiv. |
| [timeline.tsx](../src/ui/my-work/src/components/aceternity/timeline.tsx) | UI module: timeline; exports Timeline. |
| [tracing-beam.tsx](../src/ui/my-work/src/components/aceternity/tracing-beam.tsx) | UI module: tracing beam; exports TracingBeam. |

## src/ui/my-work/src/components/ai-elements/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [agent.tsx](../src/ui/my-work/src/components/ai-elements/agent.tsx) | UI module: agent; exports AgentProps, Agent, AgentHeaderProps, AgentHeader, AgentContentProps and 9 more. |
| [artifact.tsx](../src/ui/my-work/src/components/ai-elements/artifact.tsx) | UI module: artifact; exports ArtifactProps, Artifact, ArtifactHeaderProps, ArtifactHeader, ArtifactCloseProps and 11 more. |
| [chain-of-thought.tsx](../src/ui/my-work/src/components/ai-elements/chain-of-thought.tsx) | UI module: chain of thought; exports ChainOfThoughtProps, ChainOfThought, ChainOfThoughtHeaderProps, ChainOfThoughtHeader, ChainOfThoughtStepProps and 9 more. |
| [confirmation.tsx](../src/ui/my-work/src/components/ai-elements/confirmation.tsx) | UI module: confirmation; exports ConfirmationProps, Confirmation, ConfirmationTitleProps, ConfirmationTitle, ConfirmationRequestProps and 9 more. |
| [inline-citation.tsx](../src/ui/my-work/src/components/ai-elements/inline-citation.tsx) | UI module: inline citation; exports InlineCitationProps, InlineCitation, InlineCitationTextProps, InlineCitationText, InlineCitationCardProps and 23 more. |
| [queue.tsx](../src/ui/my-work/src/components/ai-elements/queue.tsx) | UI module: queue; exports QueueMessagePart, QueueMessage, QueueTodo, QueueItemProps, QueueItem and 28 more. |
| [shimmer.tsx](../src/ui/my-work/src/components/ai-elements/shimmer.tsx) | UI module: shimmer; exports TextShimmerProps, Shimmer. |
| [task.tsx](../src/ui/my-work/src/components/ai-elements/task.tsx) | UI module: task; exports TaskItemFileProps, TaskItemFile, TaskItemProps, TaskItem, TaskProps and 5 more. |
| [terminal.tsx](../src/ui/my-work/src/components/ai-elements/terminal.tsx) | UI module: terminal; exports TerminalHeaderProps, TerminalHeader, TerminalTitleProps, TerminalTitle, TerminalStatusProps and 11 more. |

## src/ui/my-work/src/components/ui/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [accordion.tsx](../src/ui/my-work/src/components/ui/accordion.tsx) | UI module: accordion. |
| [alert.tsx](../src/ui/my-work/src/components/ui/alert.tsx) | UI module: alert. |
| [avatar.tsx](../src/ui/my-work/src/components/ui/avatar.tsx) | UI module: avatar. |
| [badge.tsx](../src/ui/my-work/src/components/ui/badge.tsx) | UI module: badge. |
| [button.tsx](../src/ui/my-work/src/components/ui/button.tsx) | UI module: button. |
| [card.tsx](../src/ui/my-work/src/components/ui/card.tsx) | UI module: card. |
| [carousel.tsx](../src/ui/my-work/src/components/ui/carousel.tsx) | UI module: carousel. |
| [collapsible.tsx](../src/ui/my-work/src/components/ui/collapsible.tsx) | UI module: collapsible. |
| [dialog.tsx](../src/ui/my-work/src/components/ui/dialog.tsx) | UI module: dialog. |
| [dropdown-menu.tsx](../src/ui/my-work/src/components/ui/dropdown-menu.tsx) | UI module: dropdown menu. |
| [empty.tsx](../src/ui/my-work/src/components/ui/empty.tsx) | UI module: empty. |
| [hover-card.tsx](../src/ui/my-work/src/components/ui/hover-card.tsx) | UI module: hover card. |
| [input.tsx](../src/ui/my-work/src/components/ui/input.tsx) | UI module: input. |
| [item.tsx](../src/ui/my-work/src/components/ui/item.tsx) | UI module: item. |
| [label.tsx](../src/ui/my-work/src/components/ui/label.tsx) | UI module: label. |
| [progress.tsx](../src/ui/my-work/src/components/ui/progress.tsx) | UI module: progress. |
| [scroll-area.tsx](../src/ui/my-work/src/components/ui/scroll-area.tsx) | UI module: scroll area. |
| [select.tsx](../src/ui/my-work/src/components/ui/select.tsx) | UI module: select. |
| [separator.tsx](../src/ui/my-work/src/components/ui/separator.tsx) | UI module: separator. |
| [sheet.tsx](../src/ui/my-work/src/components/ui/sheet.tsx) | UI module: sheet. |
| [spinner.tsx](../src/ui/my-work/src/components/ui/spinner.tsx) | UI module: spinner. |
| [switch.tsx](../src/ui/my-work/src/components/ui/switch.tsx) | UI module: switch. |
| [table.tsx](../src/ui/my-work/src/components/ui/table.tsx) | UI module: table. |
| [tabs.tsx](../src/ui/my-work/src/components/ui/tabs.tsx) | UI module: tabs. |
| [textarea.tsx](../src/ui/my-work/src/components/ui/textarea.tsx) | UI module: textarea. |
| [toggle-group.tsx](../src/ui/my-work/src/components/ui/toggle-group.tsx) | UI module: toggle group. |
| [toggle.tsx](../src/ui/my-work/src/components/ui/toggle.tsx) | UI module: toggle. |
| [tooltip.tsx](../src/ui/my-work/src/components/ui/tooltip.tsx) | UI module: tooltip. |

## src/ui/my-work/src/lib/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [deliverables.ts](../src/ui/my-work/src/lib/deliverables.ts) | Code module: deliverables; exports isCardDeliverable. |
| [product-icons.ts](../src/ui/my-work/src/lib/product-icons.ts) | Code module: product icons; exports PRODUCT_ICON. |
| [prompt-time.ts](../src/ui/my-work/src/lib/prompt-time.ts) | Code module: prompt time; exports formatPromptTime, formatPromptDay, promptDayKey, shipDayKey. |
| [swipe-to-decide.ts](../src/ui/my-work/src/lib/swipe-to-decide.ts) | Code module: swipe to decide; exports useIsPhone, swipeToDecide. |
| [use-media.ts](../src/ui/my-work/src/lib/use-media.ts) | Code module: use media; exports useMatchesMedia. |
| [utils.ts](../src/ui/my-work/src/lib/utils.ts) | Code module: utils. |
| [words.ts](../src/ui/my-work/src/lib/words.ts) | Code module: words; exports plural, timesLabel. |

## src/ui/my-work/src/live/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [connection-status.test.ts](../src/ui/my-work/src/live/connection-status.test.ts) | Behavior checks for connection status test ts. |
| [connection-status.ts](../src/ui/my-work/src/live/connection-status.ts) | Code module: connection status; exports LOCAL_FEED_STALE_AFTER_MS, ConnectionState, ConnectionTone, ConnectionStatusInput, ConnectionStatus and 1 more. |
| [local-source.ts](../src/ui/my-work/src/live/local-source.ts) | Code module: local source; exports localSource. |
| [measured-estimate.test.ts](../src/ui/my-work/src/live/measured-estimate.test.ts) | Behavior checks for measured estimate test ts. |
| [measured-estimate.ts](../src/ui/my-work/src/live/measured-estimate.ts) | Code module: measured estimate; exports ProgressReading, measuredEstimate. |
| [review-response.test.ts](../src/ui/my-work/src/live/review-response.test.ts) | Behavior checks for review response test ts. |
| [review-response.ts](../src/ui/my-work/src/live/review-response.ts) | Code module: review response; exports ReviewResponse, ReviewResult, CHANGED_WHILE_READING_MESSAGE, CHECKED_LOCALLY_MESSAGE, CHECK_UNDONE_MESSAGE and 2 more. |
| [sample-source.test.ts](../src/ui/my-work/src/live/sample-source.test.ts) | Behavior checks for sample source test ts. |
| [sample-source.ts](../src/ui/my-work/src/live/sample-source.ts) | Code module: sample source; exports sampleSource. |
| [status-normalization.test.ts](../src/ui/my-work/src/live/status-normalization.test.ts) | Behavior checks for status normalization test ts. |
| [status-normalization.ts](../src/ui/my-work/src/live/status-normalization.ts) | Code module: status normalization; exports STALE_AFTER_MS, NormalizedStatus, normalizeRecordedStatus, statusFor, STATUS and 4 more. |
| [to-focus-model.test.ts](../src/ui/my-work/src/live/to-focus-model.test.ts) | Behavior checks for to focus model test ts. |
| [to-focus-model.ts](../src/ui/my-work/src/live/to-focus-model.ts) | Code module: to focus model; exports MinedGoalItem, byFocusPriority, isPlaceableFocusArea, resolveFocusAreaId, suggestionEditDecision and 2 more. |
| [to-goals-model.test.ts](../src/ui/my-work/src/live/to-goals-model.test.ts) | Behavior checks for to goals model test ts. |
| [to-rules-model.test.ts](../src/ui/my-work/src/live/to-rules-model.test.ts) | Behavior checks for to rules model test ts. |
| [to-work-model.test.ts](../src/ui/my-work/src/live/to-work-model.test.ts) | Behavior checks for to work model test ts. |
| [to-work-model.ts](../src/ui/my-work/src/live/to-work-model.ts) | Code module: to work model; exports THIS_COMPUTER, toAgent, toWorkModel. |
| [update-queue.test.ts](../src/ui/my-work/src/live/update-queue.test.ts) | Behavior checks for update queue test ts. |
| [update-queue.ts](../src/ui/my-work/src/live/update-queue.ts) | Code module: update queue; exports freshlyUpdatedRequestIds. |
| [usage.test.ts](../src/ui/my-work/src/live/usage.test.ts) | Behavior checks for usage test ts. |
| [usage.ts](../src/ui/my-work/src/live/usage.ts) | Code module: usage; exports UsageView, UsageReport, usageReport, sendUsageReport. |
| [work-data-source.ts](../src/ui/my-work/src/live/work-data-source.ts) | Code module: work data source; exports SourceKind, RequestReadError, WorkModel, AutoRefresh, BuildStory and 2 more. |
| [work-view-api-types.ts](../src/ui/my-work/src/live/work-view-api-types.ts) | Code module: work view api types; exports EvidenceKind, WorkViewSourceRef, WorkViewTextField, WorkViewItem, WorkViewActivity and 22 more. |

## src/ui/my-work/src/pages/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [my-rules.tsx](../src/ui/my-work/src/pages/my-rules.tsx) | UI module: my rules; exports MyRules. |
| [my-work.tsx](../src/ui/my-work/src/pages/my-work.tsx) | UI module: my work; exports MyWork. |
| [past-focus.tsx](../src/ui/my-work/src/pages/past-focus.tsx) | UI module: past focus; exports PastFocus. |
| [suggested-areas.tsx](../src/ui/my-work/src/pages/suggested-areas.tsx) | UI module: suggested areas; exports SuggestedAreas. |

## src/ui/my-work/src/setup/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [format.ts](../src/ui/my-work/src/setup/format.ts) | Code module: format; exports money, joinNames, prefersReducedMotion. |
| [setup-data.ts](../src/ui/my-work/src/setup/setup-data.ts) | Code module: setup data; exports SetupScanAgent, SetupScanPhase, SetupScanView, SetupRecentPrompt, SetupCheckoutView and 15 more. |
| [setup-flow.test.ts](../src/ui/my-work/src/setup/setup-flow.test.ts) | Behavior checks for setup flow test ts. |
| [setup-flow.ts](../src/ui/my-work/src/setup/setup-flow.ts) | Code module: setup flow; exports SETUP_STEPS, SetupStep, MemoryBranch, MemoryBilling, HistoryImportStatus and 7 more. |
| [setup-page.tsx](../src/ui/my-work/src/setup/setup-page.tsx) | UI module: setup page; exports SetupPage. |
| [setup-reveal.test.ts](../src/ui/my-work/src/setup/setup-reveal.test.ts) | Behavior checks for setup reveal test ts. |
| [setup-reveal.ts](../src/ui/my-work/src/setup/setup-reveal.ts) | Code module: setup reveal; exports RevealWork, RevealGoal, RevealRule, RevealSets, WorkerExtraction and 4 more. |
| [setup-sample.ts](../src/ui/my-work/src/setup/setup-sample.ts) | Code module: setup sample; exports SampleUsage, createSampleSetupSource. |
| [setup-scan-status.test.ts](../src/ui/my-work/src/setup/setup-scan-status.test.ts) | Behavior checks for setup scan status test ts. |
| [setup-scan-status.ts](../src/ui/my-work/src/setup/setup-scan-status.ts) | Code module: setup scan status; exports scanAgentStatus. |
| [setup-search.test.ts](../src/ui/my-work/src/setup/setup-search.test.ts) | Behavior checks for setup search test ts. |
| [setup-search.ts](../src/ui/my-work/src/setup/setup-search.ts) | Code module: setup search; exports MemoryResult, WorkerSearchResult, SEARCH_LIMIT, toMemoryResults, searchUrl and 1 more. |
| [setup-usage.test.ts](../src/ui/my-work/src/setup/setup-usage.test.ts) | Behavior checks for setup usage test ts. |
| [setup-usage.ts](../src/ui/my-work/src/setup/setup-usage.ts) | Code module: setup usage; exports Persona, UsageCoverage, SetupScanUsage, SetupUsage, toSetupUsage. |
| [setup.css](../src/ui/my-work/src/setup/setup.css) | Styles and design tokens: setup. |

## src/ui/my-work/src/setup/assets/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [HankenGrotesk-OFL.txt](../src/ui/my-work/src/setup/assets/HankenGrotesk-OFL.txt) | Supporting file: Hanken Grotesk OFL. |
| [HankenGrotesk-wght.ttf](../src/ui/my-work/src/setup/assets/HankenGrotesk-wght.ttf) | Locally bundled font asset: Hanken Grotesk wght. |
| [at-home-modern-computer.webp](../src/ui/my-work/src/setup/assets/at-home-modern-computer.webp) | Image/icon asset: at home modern computer. |
| [on-the-go-iphone-feed.webp](../src/ui/my-work/src/setup/assets/on-the-go-iphone-feed.webp) | Image/icon asset: on the go iphone feed. |

## src/ui/my-work/src/setup/assets/agents/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [chatgpt.webp](../src/ui/my-work/src/setup/assets/agents/chatgpt.webp) | Image/icon asset: chatgpt. |
| [claude.webp](../src/ui/my-work/src/setup/assets/agents/claude.webp) | Image/icon asset: claude. |
| [dot.webp](../src/ui/my-work/src/setup/assets/agents/dot.webp) | Image/icon asset: dot. |
| [gemini.webp](../src/ui/my-work/src/setup/assets/agents/gemini.webp) | Image/icon asset: gemini. |
| [grok-bot.webp](../src/ui/my-work/src/setup/assets/agents/grok-bot.webp) | Image/icon asset: grok bot. |
| [hermes.webp](../src/ui/my-work/src/setup/assets/agents/hermes.webp) | Image/icon asset: hermes. |
| [muse-meta.webp](../src/ui/my-work/src/setup/assets/agents/muse-meta.webp) | Image/icon asset: muse meta. |
| [openclaw.webp](../src/ui/my-work/src/setup/assets/agents/openclaw.webp) | Image/icon asset: openclaw. |

## src/ui/my-work/src/setup/screens/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [checkout-screen.tsx](../src/ui/my-work/src/setup/screens/checkout-screen.tsx) | UI module: checkout screen; exports CheckoutScreen. |
| [choice-screen.tsx](../src/ui/my-work/src/setup/screens/choice-screen.tsx) | UI module: choice screen; exports ChoiceScreen. |
| [finish-setup-screen.tsx](../src/ui/my-work/src/setup/screens/finish-setup-screen.tsx) | UI module: finish setup screen; exports FinishSetupScreen. |
| [import-screen.tsx](../src/ui/my-work/src/setup/screens/import-screen.tsx) | UI module: import screen; exports ImportScreen. |
| [launch-screen.tsx](../src/ui/my-work/src/setup/screens/launch-screen.tsx) | UI module: launch screen; exports LaunchScreen. |
| [reveal-screen.tsx](../src/ui/my-work/src/setup/screens/reveal-screen.tsx) | UI module: reveal screen; exports RevealScreen. |
| [savings-screen.tsx](../src/ui/my-work/src/setup/screens/savings-screen.tsx) | UI module: savings screen; exports SavingsScreen. |
| [scan-screen.tsx](../src/ui/my-work/src/setup/screens/scan-screen.tsx) | UI module: scan screen; exports ScanScreen. |
| [shared.tsx](../src/ui/my-work/src/setup/screens/shared.tsx) | UI module: shared; exports PageHeading, ToolMark. |
| [workspace-screen.tsx](../src/ui/my-work/src/setup/screens/workspace-screen.tsx) | UI module: workspace screen; exports WorkspaceScreen. |

## src/ui/my-work/src/spec/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [req.tsx](../src/ui/my-work/src/spec/req.tsx) | UI module: req; exports SpecOverlayContext, Req. |
| [requirements.ts](../src/ui/my-work/src/spec/requirements.ts) | Code module: requirements; exports RequirementKind, Requirement, REQUIREMENTS, REQUIREMENTS_BY_ID. |

## src/ui/my-work/test-fixtures/

Main My Work/My Rules React application and setup flow.

| File | Responsibility |
| --- | --- |
| [work-view-goals.scrubbed.json](../src/ui/my-work/test-fixtures/work-view-goals.scrubbed.json) | Configuration or structured data: work view goals.scrubbed. |
| [work-view-snapshot.trimmed.json](../src/ui/my-work/test-fixtures/work-view-snapshot.trimmed.json) | Configuration or structured data: work view snapshot.trimmed. |

## src/ui/viewer/

Classic memory viewer React application.

| File | Responsibility |
| --- | --- |
| [App.tsx](../src/ui/viewer/App.tsx) | UI module: App; exports App. |
| [index.tsx](../src/ui/viewer/index.tsx) | UI module: index. |
| [themes.ts](../src/ui/viewer/themes.ts) | Code module: themes; exports THEMES, Theme, parseTheme, readTheme, applyTheme and 1 more. |
| [tsconfig.json](../src/ui/viewer/tsconfig.json) | Configuration or structured data: tsconfig. |
| [types.ts](../src/ui/viewer/types.ts) | Code module: types; exports Observation, Summary, UserPrompt, SessionCatalogEntry, FeedItem and 4 more. |

## src/ui/viewer/assets/fonts/

Classic memory viewer React application.

| File | Responsibility |
| --- | --- |
| [monaspace-radon-var.woff](../src/ui/viewer/assets/fonts/monaspace-radon-var.woff) | Locally bundled font asset: monaspace radon var. |
| [monaspace-radon-var.woff2](../src/ui/viewer/assets/fonts/monaspace-radon-var.woff2) | Locally bundled font asset: monaspace radon var. |

## src/ui/viewer/components/

Classic viewer UI components.

| File | Responsibility |
| --- | --- |
| [CategoryFilter.tsx](../src/ui/viewer/components/CategoryFilter.tsx) | UI module: Category Filter; exports CategoryFilter. |
| [ContextSettingsModal.tsx](../src/ui/viewer/components/ContextSettingsModal.tsx) | UI module: Context Settings Modal; exports saveStatusClass, ContextSettingsModal. |
| [DeleteButton.tsx](../src/ui/viewer/components/DeleteButton.tsx) | UI module: Delete Button; exports DeleteButton. |
| [ErrorBoundary.tsx](../src/ui/viewer/components/ErrorBoundary.tsx) | UI module: Error Boundary; exports ErrorBoundary. |
| [Feed.tsx](../src/ui/viewer/components/Feed.tsx) | UI module: Feed; exports Feed. |
| [GitHubStarsButton.tsx](../src/ui/viewer/components/GitHubStarsButton.tsx) | UI module: Git Hub Stars Button; exports GitHubStarsButton. |
| [Header.tsx](../src/ui/viewer/components/Header.tsx) | UI module: Header; exports Header. |
| [LogsModal.tsx](../src/ui/viewer/components/LogsModal.tsx) | UI module: Logs Modal; exports LogsDrawer. |
| [ObservationCard.tsx](../src/ui/viewer/components/ObservationCard.tsx) | UI module: Observation Card; exports ObservationCard. |
| [PromptCard.tsx](../src/ui/viewer/components/PromptCard.tsx) | UI module: Prompt Card; exports PromptCard. |
| [ScrollToTop.tsx](../src/ui/viewer/components/ScrollToTop.tsx) | UI module: Scroll To Top; exports ScrollToTop. |
| [SessionCard.tsx](../src/ui/viewer/components/SessionCard.tsx) | UI module: Session Card; exports SessionCard. |
| [SessionCardMenu.tsx](../src/ui/viewer/components/SessionCardMenu.tsx) | UI module: Session Card Menu; exports SessionCardMenu. |
| [SessionDetailPage.tsx](../src/ui/viewer/components/SessionDetailPage.tsx) | UI module: Session Detail Page; exports SessionDetailPage. |
| [SessionList.tsx](../src/ui/viewer/components/SessionList.tsx) | UI module: Session List; exports SessionList. |
| [SummaryCard.tsx](../src/ui/viewer/components/SummaryCard.tsx) | UI module: Summary Card; exports SummaryCard. |
| [TerminalPreview.tsx](../src/ui/viewer/components/TerminalPreview.tsx) | UI module: Terminal Preview; exports TerminalPreview. |
| [ThemeToggle.tsx](../src/ui/viewer/components/ThemeToggle.tsx) | UI module: Theme Toggle; exports ThemeToggle. |
| [ViewTabs.tsx](../src/ui/viewer/components/ViewTabs.tsx) | UI module: View Tabs; exports ViewTab, ViewTabs. |
| [WelcomeCard.tsx](../src/ui/viewer/components/WelcomeCard.tsx) | UI module: Welcome Card; exports getStoredWelcomeDismissed, setStoredWelcomeDismissed, WelcomeCard. |

## src/ui/viewer/constants/

Classic memory viewer React application.

| File | Responsibility |
| --- | --- |
| [api.ts](../src/ui/viewer/constants/api.ts) | Code module: api; exports API_ENDPOINTS. |
| [openai-compat-presets.ts](../src/ui/viewer/constants/openai-compat-presets.ts) | Code module: openai compat presets; exports OpenAICompatPresetOption, OPENAI_COMPAT_PRESET_OPTIONS, openAICompatPresetOption. |
| [promo.ts](../src/ui/viewer/constants/promo.ts) | Code module: promo; exports PRO_TRIAL_MAX_DAYS, PRO_TRIAL_LABEL, PRO_TRIAL_URL, PLAN_USAGE_GAIN_PERCENT, PRO_TRIAL_PITCH and 3 more. |
| [settings.ts](../src/ui/viewer/constants/settings.ts) | Code module: settings; exports DEFAULT_SETTINGS. |
| [timing.ts](../src/ui/viewer/constants/timing.ts) | Code module: timing; exports TIMING. |
| [ui.ts](../src/ui/viewer/constants/ui.ts) | Code module: ui; exports UI. |

## src/ui/viewer/hooks/

Classic viewer React state and effects.

| File | Responsibility |
| --- | --- |
| [useBackupStatus.ts](../src/ui/viewer/hooks/useBackupStatus.ts) | Code module: use Backup Status; exports BackupStatusResponse, useBackupStatus. |
| [useContextPreview.ts](../src/ui/viewer/hooks/useContextPreview.ts) | Code module: use Context Preview; exports useContextPreview. |
| [useDialogFocus.ts](../src/ui/viewer/hooks/useDialogFocus.ts) | Code module: use Dialog Focus; exports useDialogFocus. |
| [usePagination.ts](../src/ui/viewer/hooks/usePagination.ts) | Code module: use Pagination; exports usePagination. |
| [useSSE.ts](../src/ui/viewer/hooks/useSSE.ts) | Code module: use SSE; exports LiveSessionItem, StreamHandlers, useSSE. |
| [useSessionCatalog.ts](../src/ui/viewer/hooks/useSessionCatalog.ts) | Code module: use Session Catalog; exports SESSION_CATALOG_PAGE_SIZE, useSessionCatalog. |
| [useSettings.ts](../src/ui/viewer/hooks/useSettings.ts) | Code module: use Settings; exports SubmitSettingsDependencies, submitSettings, saveSettings, useSettings. |
| [useSpinningFavicon.ts](../src/ui/viewer/hooks/useSpinningFavicon.ts) | Code module: use Spinning Favicon; exports useSpinningFavicon. |
| [useTheme.ts](../src/ui/viewer/hooks/useTheme.ts) | Code module: use Theme; exports ThemePreference, ResolvedTheme, useTheme. |

## src/ui/viewer/utils/

Classic memory viewer React application.

| File | Responsibility |
| --- | --- |
| [category.ts](../src/ui/viewer/utils/category.ts) | Code module: category; exports KNOWN_OBSERVATION_TYPES, CATEGORY_ORDER, categoryOf, countByCategory, labelForCategory. |
| [claude-auth-method.ts](../src/ui/viewer/utils/claude-auth-method.ts) | Code module: claude auth method; exports CLAUDE_AUTH_METHODS, ClaudeAuthMethod, DEFAULT_CLAUDE_AUTH_METHOD, claudeProviderOptionLabel. |
| [data.ts](../src/ui/viewer/utils/data.ts) | Code module: data; exports mergeAndDeduplicateByProject, buildFeedItems. |
| [feed-deletion.ts](../src/ui/viewer/utils/feed-deletion.ts) | Code module: feed deletion; exports DeletableItemType, describeDeleteFailure, deleteFeedItem, itemDeletedTarget, removeLoadedRow. |
| [formatters.ts](../src/ui/viewer/utils/formatters.ts) | Code module: formatters; exports formatDate. |
| [observer-endpoint.ts](../src/ui/viewer/utils/observer-endpoint.ts) | Code module: observer endpoint; exports isClaudeMemObserverBaseUrl. |
| [save-error.ts](../src/ui/viewer/utils/save-error.ts) | Code module: save error; exports SAVE_ERROR_MAX_CHARS, SaveErrorResponse, describeSaveFailure. |
| [sessions.ts](../src/ui/viewer/utils/sessions.ts) | Code module: sessions; exports SessionRef, sessionKey, sameSession, catalogEntryRef, SessionScopedRow and 13 more. |
| [stored-string-list.ts](../src/ui/viewer/utils/stored-string-list.ts) | Code module: stored string list; exports parseStoredStringList. |

## src/utils/

Application source.

| File | Responsibility |
| --- | --- |
| [agents-md-utils.ts](../src/utils/agents-md-utils.ts) | Code module: agents md utils; exports writeAgentsMd. |
| [bmp-safe.ts](../src/utils/bmp-safe.ts) | Code module: bmp safe; exports toBmpSafe. |
| [claude-md-utils.ts](../src/utils/claude-md-utils.ts) | Code module: claude md utils; exports getTargetFilename, replaceTaggedContent, writeClaudeMdToFolder, formatTimelineForClaudeMd, updateFolderClaudeMdFiles. |
| [context-injection.ts](../src/utils/context-injection.ts) | Code module: context injection; exports CONTEXT_TAG_OPEN, CONTEXT_TAG_CLOSE, findContextBlockRange, injectContextIntoMarkdownFile. |
| [cursor-utils.ts](../src/utils/cursor-utils.ts) | Code module: cursor utils; exports CursorProjectRegistry, CursorMcpConfig, readCursorRegistry, writeCursorRegistry, registerCursorProject and 3 more. |
| [json-utils.ts](../src/utils/json-utils.ts) | Code module: json utils; exports readJsonSafe. |
| [logger.ts](../src/utils/logger.ts) | Code module: logger; exports LogLevel, Component, ErrorSink, logger. |
| [observer-audit.ts](../src/utils/observer-audit.ts) | Code module: observer audit; exports ObserverToolAttempt, getObserverAuditLogPath, recordObserverToolAttempt. |
| [project-environments.ts](../src/utils/project-environments.ts) | Code module: project environments; exports ProjectEnvironment, parseProjectEnvironments, matchProjectEnvironment. |
| [project-filter.ts](../src/utils/project-filter.ts) | Code module: project filter; exports matchesAnyGlob, isProjectExcluded. |
| [project-name.ts](../src/utils/project-name.ts) | Code module: project name; exports resolveHookProjectPath, useGitRemoteProjectNames, loadProjectEnvironments, parseOriginUrlToSlug, getProjectName and 6 more. |
| [redaction.ts](../src/utils/redaction.ts) | Code module: redaction; exports RedactionPattern, RedactionConfig, RedactionResult, BUILTIN_REDACTION_PATTERNS, GENERIC_REDACTION_PATTERNS and 9 more. |
| [tag-stripping.ts](../src/utils/tag-stripping.ts) | Code module: tag stripping; exports stripSystemReminderBlocks, stripTags, stripMemoryTags, stripMemoryTagsFromJsonStrings, isInternalProtocolPayload and 2 more. |
| [worktree.ts](../src/utils/worktree.ts) | Code module: worktree; exports WorktreeInfo, detectWorktree, bareRepositoryProjectName. |

## tests/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [antigravity-cli-compat.test.ts](../tests/antigravity-cli-compat.test.ts) | Behavior checks for antigravity cli compat test ts. |
| [bmp-safe.test.ts](../tests/bmp-safe.test.ts) | Behavior checks for bmp safe test ts. |
| [bun-runner.test.ts](../tests/bun-runner.test.ts) | Behavior checks for bun runner test ts. |
| [ccs-align-atomic-rebuild.test.ts](../tests/ccs-align-atomic-rebuild.test.ts) | Behavior checks for ccs align atomic rebuild test ts. |
| [claude-md-git-paths.test.ts](../tests/claude-md-git-paths.test.ts) | Behavior checks for claude md git paths test ts. |
| [claude-provider-error-classifier.test.ts](../tests/claude-provider-error-classifier.test.ts) | Behavior checks for claude provider error classifier test ts. |
| [claude-provider-resume.test.ts](../tests/claude-provider-resume.test.ts) | Behavior checks for claude provider resume test ts. |
| [claude-provider-thinking-reject.test.ts](../tests/claude-provider-thinking-reject.test.ts) | Behavior checks for claude provider thinking reject test ts. |
| [codex-queue-admission.test.ts](../tests/codex-queue-admission.test.ts) | Behavior checks for codex queue admission test ts. |
| [codex-transcript-watcher-windows.test.ts](../tests/codex-transcript-watcher-windows.test.ts) | Behavior checks for codex transcript watcher windows test ts. |
| [context-injection.test.ts](../tests/context-injection.test.ts) | Behavior checks for context injection test ts. |
| [cursor-bom-json.test.ts](../tests/cursor-bom-json.test.ts) | Behavior checks for cursor bom json test ts. |
| [cursor-context-update.test.ts](../tests/cursor-context-update.test.ts) | Behavior checks for cursor context update test ts. |
| [cursor-mcp-config.test.ts](../tests/cursor-mcp-config.test.ts) | Behavior checks for cursor mcp config test ts. |
| [cursor-registry.test.ts](../tests/cursor-registry.test.ts) | Behavior checks for cursor registry test ts. |
| [env-isolation.test.ts](../tests/env-isolation.test.ts) | Behavior checks for env isolation test ts. |
| [fake-stdin.ts](../tests/fake-stdin.ts) | Code module: fake stdin; exports installFakeStdin, installOpenFakeStdin, restoreStdin. |
| [fk-constraint-fix.test.ts](../tests/fk-constraint-fix.test.ts) | Behavior checks for fk constraint fix test ts. |
| [gemini_provider.test.ts](../tests/gemini_provider.test.ts) | Behavior checks for gemini provider test ts. |
| [grok-bot-session-inject.test.ts](../tests/grok-bot-session-inject.test.ts) | Behavior checks for grok bot session inject test ts. |
| [grok-bot-uuid-selection.test.ts](../tests/grok-bot-uuid-selection.test.ts) | Behavior checks for grok bot uuid selection test ts. |
| [hermes-config-yaml-bom.test.ts](../tests/hermes-config-yaml-bom.test.ts) | Behavior checks for hermes config yaml bom test ts. |
| [history-pruning.test.ts](../tests/history-pruning.test.ts) | Behavior checks for history pruning test ts. |
| [hook-command.test.ts](../tests/hook-command.test.ts) | Behavior checks for hook command test ts. |
| [hook-constants.test.ts](../tests/hook-constants.test.ts) | Behavior checks for hook constants test ts. |
| [hook-lifecycle.test.ts](../tests/hook-lifecycle.test.ts) | Behavior checks for hook lifecycle test ts. |
| [install-disable-auto-memory.test.ts](../tests/install-disable-auto-memory.test.ts) | Behavior checks for install disable auto memory test ts. |
| [install-error-matrix.test.ts](../tests/install-error-matrix.test.ts) | Behavior checks for install error matrix test ts. |
| [install-merge-settings.test.ts](../tests/install-merge-settings.test.ts) | Behavior checks for install merge settings test ts. |
| [install-non-tty.test.ts](../tests/install-non-tty.test.ts) | Behavior checks for install non tty test ts. |
| [install-server-bootstrap.test.ts](../tests/install-server-bootstrap.test.ts) | Behavior checks for install server bootstrap test ts. |
| [install-shutdown-helper.test.ts](../tests/install-shutdown-helper.test.ts) | Behavior checks for install shutdown helper test ts. |
| [install-uninstall-server-settings.test.ts](../tests/install-uninstall-server-settings.test.ts) | Behavior checks for install uninstall server settings test ts. |
| [json-utils.test.ts](../tests/json-utils.test.ts) | Behavior checks for json utils test ts. |
| [logger-usage-standards.test.ts](../tests/logger-usage-standards.test.ts) | Behavior checks for logger usage standards test ts. |
| [marketplace-package-trim.test.ts](../tests/marketplace-package-trim.test.ts) | Behavior checks for marketplace package trim test ts. |
| [mcp-integrations.test.ts](../tests/mcp-integrations.test.ts) | Behavior checks for mcp integrations test ts. |
| [npm-install-timeout.test.ts](../tests/npm-install-timeout.test.ts) | Behavior checks for npm install timeout test ts. |
| [npm-install-windows-hide.test.ts](../tests/npm-install-windows-hide.test.ts) | Behavior checks for npm install windows hide test ts. |
| [npm-install-windows-timeout.test.ts](../tests/npm-install-windows-timeout.test.ts) | Behavior checks for npm install windows timeout test ts. |
| [observer-health.test.ts](../tests/observer-health.test.ts) | Behavior checks for observer health test ts. |
| [plugin-scripts-line-endings.test.ts](../tests/plugin-scripts-line-endings.test.ts) | Behavior checks for plugin scripts line endings test ts. |
| [plugin-version-check-ensure-deps.test.ts](../tests/plugin-version-check-ensure-deps.test.ts) | Behavior checks for plugin version check ensure deps test ts. |
| [plugin-version-check.test.ts](../tests/plugin-version-check.test.ts) | Behavior checks for plugin version check test ts. |
| [preload.ts](../tests/preload.ts) | Code module: preload; exports PostHogConstructorCall, postHogConstructorCalls, postHogCaptureCalls, PostHogExceptionCall, postHogExceptionCalls and 1 more. |
| [reinforcement-migration.test.ts](../tests/reinforcement-migration.test.ts) | Behavior checks for reinforcement migration test ts. |
| [reinforcement-rank.test.ts](../tests/reinforcement-rank.test.ts) | Behavior checks for reinforcement rank test ts. |
| [reinforcement-strength.test.ts](../tests/reinforcement-strength.test.ts) | Behavior checks for reinforcement strength test ts. |
| [reinforcement-write-path.test.ts](../tests/reinforcement-write-path.test.ts) | Behavior checks for reinforcement write path test ts. |
| [screenpipe-integration.test.ts](../tests/screenpipe-integration.test.ts) | Behavior checks for screenpipe integration test ts. |
| [screenpipe-memory-roundtrip.test.ts](../tests/screenpipe-memory-roundtrip.test.ts) | Behavior checks for screenpipe memory roundtrip test ts. |
| [session_id_usage_validation.test.ts](../tests/session_id_usage_validation.test.ts) | Behavior checks for session id usage validation test ts. |
| [session_store.test.ts](../tests/session_store.test.ts) | Behavior checks for session store test ts. |
| [settings-routes-settings-document.test.ts](../tests/settings-routes-settings-document.test.ts) | Behavior checks for settings routes settings document test ts. |
| [setup-runtime.test.ts](../tests/setup-runtime.test.ts) | Behavior checks for setup runtime test ts. |
| [uninstall-clear-auto-memory.test.ts](../tests/uninstall-clear-auto-memory.test.ts) | Behavior checks for uninstall clear auto memory test ts. |
| [windsurf-hooks-bom.test.ts](../tests/windsurf-hooks-bom.test.ts) | Behavior checks for windsurf hooks bom test ts. |
| [worker-script-resolution.test.ts](../tests/worker-script-resolution.test.ts) | Behavior checks for worker script resolution test ts. |
| [worker-spawn.test.ts](../tests/worker-spawn.test.ts) | Behavior checks for worker spawn test ts. |
| [worker-wrapper-windows-hide.test.ts](../tests/worker-wrapper-windows-hide.test.ts) | Behavior checks for worker wrapper windows hide test ts. |
| [write-json-file-atomic.test.ts](../tests/write-json-file-atomic.test.ts) | Behavior checks for write json file atomic test ts. |

## tests/backup/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [backup-manager.test.ts](../tests/backup/backup-manager.test.ts) | Behavior checks for backup manager test ts. |
| [pending-restore.test.ts](../tests/backup/pending-restore.test.ts) | Behavior checks for pending restore test ts. |
| [restore-swap.test.ts](../tests/backup/restore-swap.test.ts) | Behavior checks for restore swap test ts. |

## tests/cli/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [antigravity-turns.test.ts](../tests/cli/antigravity-turns.test.ts) | Behavior checks for antigravity turns test ts. |
| [claude-md-folder-matcher.test.ts](../tests/cli/claude-md-folder-matcher.test.ts) | Behavior checks for claude md folder matcher test ts. |
| [claude-md-folder-pagination.test.ts](../tests/cli/claude-md-folder-pagination.test.ts) | Behavior checks for claude md folder pagination test ts. |
| [claude-md-generate-bmp-safe.test.ts](../tests/cli/claude-md-generate-bmp-safe.test.ts) | Behavior checks for claude md generate bmp safe test ts. |
| [claude-md-generate-tag-pairing.test.ts](../tests/cli/claude-md-generate-tag-pairing.test.ts) | Behavior checks for claude md generate tag pairing test ts. |
| [deliverables-capture.test.ts](../tests/cli/deliverables-capture.test.ts) | Behavior checks for deliverables capture test ts. |
| [hook-io-discipline.test.ts](../tests/cli/hook-io-discipline.test.ts) | Behavior checks for hook io discipline test ts. |
| [hook-io.test.ts](../tests/cli/hook-io.test.ts) | Behavior checks for hook io test ts. |
| [hook-original-cwd.test.ts](../tests/cli/hook-original-cwd.test.ts) | Behavior checks for hook original cwd test ts. |
| [hook-stdout-flush.test.ts](../tests/cli/hook-stdout-flush.test.ts) | Behavior checks for hook stdout flush test ts. |
| [hook-stream-discipline.test.ts](../tests/cli/hook-stream-discipline.test.ts) | Behavior checks for hook stream discipline test ts. |
| [remote-spool-scheduling.test.ts](../tests/cli/remote-spool-scheduling.test.ts) | Behavior checks for remote spool scheduling test ts. |
| [remote-spool-transport.test.ts](../tests/cli/remote-spool-transport.test.ts) | Behavior checks for remote spool transport test ts. |
| [server-jobs.test.ts](../tests/cli/server-jobs.test.ts) | Behavior checks for server jobs test ts. |
| [stdin-reader-utf8.test.ts](../tests/cli/stdin-reader-utf8.test.ts) | Behavior checks for stdin reader utf8 test ts. |
| [stdin-reader.test.ts](../tests/cli/stdin-reader.test.ts) | Behavior checks for stdin reader test ts. |
| [verify-critical-modules.test.ts](../tests/cli/verify-critical-modules.test.ts) | Behavior checks for verify critical modules test ts. |
| [worker-failure-latch.test.ts](../tests/cli/worker-failure-latch.test.ts) | Behavior checks for worker failure latch test ts. |
| [worker-outage.test.ts](../tests/cli/worker-outage.test.ts) | Behavior checks for worker outage test ts. |
| [worker-service-original-cwd.test.ts](../tests/cli/worker-service-original-cwd.test.ts) | Behavior checks for worker service original cwd test ts. |

## tests/cli/adapters/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [antigravity-mcp-calls.test.ts](../tests/cli/adapters/antigravity-mcp-calls.test.ts) | Behavior checks for antigravity mcp calls test ts. |
| [claude-code-session-start.test.ts](../tests/cli/adapters/claude-code-session-start.test.ts) | Behavior checks for claude code session start test ts. |
| [claude-code-stop-hook-active.test.ts](../tests/cli/adapters/claude-code-stop-hook-active.test.ts) | Behavior checks for claude code stop hook active test ts. |
| [claude-code-subagent.test.ts](../tests/cli/adapters/claude-code-subagent.test.ts) | Behavior checks for claude code subagent test ts. |
| [claude-code-tool-failure.test.ts](../tests/cli/adapters/claude-code-tool-failure.test.ts) | Behavior checks for claude code tool failure test ts. |
| [codex-attribution.test.ts](../tests/cli/adapters/codex-attribution.test.ts) | Behavior checks for codex attribution test ts. |
| [codex-file-context.test.ts](../tests/cli/adapters/codex-file-context.test.ts) | Behavior checks for codex file context test ts. |
| [codex-read-argv-boundaries.test.ts](../tests/cli/adapters/codex-read-argv-boundaries.test.ts) | Behavior checks for codex read argv boundaries test ts. |
| [kimi.test.ts](../tests/cli/adapters/kimi.test.ts) | Behavior checks for kimi test ts. |
| [raw.test.ts](../tests/cli/adapters/raw.test.ts) | Behavior checks for raw test ts. |

## tests/cli/handlers/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [codex-compaction-reinjection.test.ts](../tests/cli/handlers/codex-compaction-reinjection.test.ts) | Behavior checks for codex compaction reinjection test ts. |
| [codex-subagent-start.test.ts](../tests/cli/handlers/codex-subagent-start.test.ts) | Behavior checks for codex subagent start test ts. |
| [context-server-mode.test.ts](../tests/cli/handlers/context-server-mode.test.ts) | Behavior checks for context server mode test ts. |
| [context-session-start.test.ts](../tests/cli/handlers/context-session-start.test.ts) | Behavior checks for context session start test ts. |
| [context-teambrain-brief.test.ts](../tests/cli/handlers/context-teambrain-brief.test.ts) | Behavior checks for context teambrain brief test ts. |
| [file-edit-observer-session-skip.test.ts](../tests/cli/handlers/file-edit-observer-session-skip.test.ts) | Behavior checks for file edit observer session skip test ts. |
| [file-edit-server-runtime.test.ts](../tests/cli/handlers/file-edit-server-runtime.test.ts) | Behavior checks for file edit server runtime test ts. |
| [observation-spool-timing.test.ts](../tests/cli/handlers/observation-spool-timing.test.ts) | Behavior checks for observation spool timing test ts. |
| [observation-subagent-skip.test.ts](../tests/cli/handlers/observation-subagent-skip.test.ts) | Behavior checks for observation subagent skip test ts. |
| [session-end-handler.test.ts](../tests/cli/handlers/session-end-handler.test.ts) | Behavior checks for session end handler test ts. |
| [session-init-checkout.test.ts](../tests/cli/handlers/session-init-checkout.test.ts) | Behavior checks for session init checkout test ts. |
| [session-init-codex-internal-prompt.test.ts](../tests/cli/handlers/session-init-codex-internal-prompt.test.ts) | Behavior checks for session init codex internal prompt test ts. |
| [session-init-context.test.ts](../tests/cli/handlers/session-init-context.test.ts) | Behavior checks for session init context test ts. |
| [session-init-plugin-cache-skip.test.ts](../tests/cli/handlers/session-init-plugin-cache-skip.test.ts) | Behavior checks for session init plugin cache skip test ts. |
| [session-init-qwen-absent-submitted-prompt.test.ts](../tests/cli/handlers/session-init-qwen-absent-submitted-prompt.test.ts) | Behavior checks for session init qwen absent submitted prompt test ts. |
| [session-init-record-prompt.test.ts](../tests/cli/handlers/session-init-record-prompt.test.ts) | Behavior checks for session init record prompt test ts. |
| [session-init-semantic-platform-source.test.ts](../tests/cli/handlers/session-init-semantic-platform-source.test.ts) | Behavior checks for session init semantic platform source test ts. |
| [session-init-semantic-projects.test.ts](../tests/cli/handlers/session-init-semantic-projects.test.ts) | Behavior checks for session init semantic projects test ts. |
| [session-init-server-beta-context.test.ts](../tests/cli/handlers/session-init-server-beta-context.test.ts) | Behavior checks for session init server beta context test ts. |
| [session-init-submitted-prompt.test.ts](../tests/cli/handlers/session-init-submitted-prompt.test.ts) | Behavior checks for session init submitted prompt test ts. |
| [session-init-timeout.test.ts](../tests/cli/handlers/session-init-timeout.test.ts) | Behavior checks for session init timeout test ts. |
| [session-init-worker-outage.test.ts](../tests/cli/handlers/session-init-worker-outage.test.ts) | Behavior checks for session init worker outage test ts. |
| [subagent-stop-handler.test.ts](../tests/cli/handlers/subagent-stop-handler.test.ts) | Behavior checks for subagent stop handler test ts. |
| [summarize-advisor-capture.test.ts](../tests/cli/handlers/summarize-advisor-capture.test.ts) | Behavior checks for summarize advisor capture test ts. |
| [summarize-deliverables.test.ts](../tests/cli/handlers/summarize-deliverables.test.ts) | Behavior checks for summarize deliverables test ts. |
| [summarize-disable-summary.test.ts](../tests/cli/handlers/summarize-disable-summary.test.ts) | Behavior checks for summarize disable summary test ts. |
| [summarize-kimi-gate.test.ts](../tests/cli/handlers/summarize-kimi-gate.test.ts) | Behavior checks for summarize kimi gate test ts. |
| [summarize-observed-fields.test.ts](../tests/cli/handlers/summarize-observed-fields.test.ts) | Behavior checks for summarize observed fields test ts. |
| [summarize-subagent-skip.test.ts](../tests/cli/handlers/summarize-subagent-skip.test.ts) | Behavior checks for summarize subagent skip test ts. |
| [summarize-tag-stripping.test.ts](../tests/cli/handlers/summarize-tag-stripping.test.ts) | Behavior checks for summarize tag stripping test ts. |
| [user-message-excluded.test.ts](../tests/cli/handlers/user-message-excluded.test.ts) | Behavior checks for user message excluded test ts. |

## tests/compat/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [sessions-observations-adapter.test.ts](../tests/compat/sessions-observations-adapter.test.ts) | Behavior checks for sessions observations adapter test ts. |

## tests/context/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [context-budget-3802.test.ts](../tests/context/context-budget-3802.test.ts) | Behavior checks for context budget 3802 test ts. |
| [context-builder-readonly.test.ts](../tests/context/context-builder-readonly.test.ts) | Behavior checks for context builder readonly test ts. |
| [context-builder-shared-store.test.ts](../tests/context/context-builder-shared-store.test.ts) | Behavior checks for context builder shared store test ts. |
| [context-cache-lifecycle.test.ts](../tests/context/context-cache-lifecycle.test.ts) | Behavior checks for context cache lifecycle test ts. |
| [context-cache-render-order.test.ts](../tests/context/context-cache-render-order.test.ts) | Behavior checks for context cache render order test ts. |
| [context-cache.test.ts](../tests/context/context-cache.test.ts) | Behavior checks for context cache test ts. |
| [context-config-loader.test.ts](../tests/context/context-config-loader.test.ts) | Behavior checks for context config loader test ts. |
| [context-config-observation-filters.test.ts](../tests/context/context-config-observation-filters.test.ts) | Behavior checks for context config observation filters test ts. |
| [context-count-bounds.test.ts](../tests/context/context-count-bounds.test.ts) | Behavior checks for context count bounds test ts. |
| [context-query-lifecycle.test.ts](../tests/context/context-query-lifecycle.test.ts) | Behavior checks for context query lifecycle test ts. |
| [context-read-responsiveness.test.ts](../tests/context/context-read-responsiveness.test.ts) | Behavior checks for context read responsiveness test ts. |
| [context-read-results.test.ts](../tests/context/context-read-results.test.ts) | Behavior checks for context read results test ts. |
| [context-read-routes.test.ts](../tests/context/context-read-routes.test.ts) | Behavior checks for context read routes test ts. |
| [context-read-welcome-hint-race.test.ts](../tests/context/context-read-welcome-hint-race.test.ts) | Behavior checks for context read welcome hint race test ts. |
| [context-read-worker-lifecycle.test.ts](../tests/context/context-read-worker-lifecycle.test.ts) | Behavior checks for context read worker lifecycle test ts. |
| [context-scope-named-projects.test.ts](../tests/context/context-scope-named-projects.test.ts) | Behavior checks for context scope named projects test ts. |
| [context-work-state-order.test.ts](../tests/context/context-work-state-order.test.ts) | Behavior checks for context work state order test ts. |
| [include-last-message-dot-path.test.ts](../tests/context/include-last-message-dot-path.test.ts) | Behavior checks for include last message dot path test ts. |
| [include-last-message-underscore-path.test.ts](../tests/context/include-last-message-underscore-path.test.ts) | Behavior checks for include last message underscore path test ts. |
| [merged-project-hop.test.ts](../tests/context/merged-project-hop.test.ts) | Behavior checks for merged project hop test ts. |
| [newest-per-project-key.test.ts](../tests/context/newest-per-project-key.test.ts) | Behavior checks for newest per project key test ts. |
| [notes-only-summary-context.test.ts](../tests/context/notes-only-summary-context.test.ts) | Behavior checks for notes only summary context test ts. |
| [observation-compiler.test.ts](../tests/context/observation-compiler.test.ts) | Behavior checks for observation compiler test ts. |
| [observer-briefing-health-warning.test.ts](../tests/context/observer-briefing-health-warning.test.ts) | Behavior checks for observer briefing health warning test ts. |
| [prior-host-transcript-routes.test.ts](../tests/context/prior-host-transcript-routes.test.ts) | Behavior checks for prior host transcript routes test ts. |
| [prior-host-transcript.test.ts](../tests/context/prior-host-transcript.test.ts) | Behavior checks for prior host transcript test ts. |
| [prior-json-whitespace.test.ts](../tests/context/prior-json-whitespace.test.ts) | Behavior checks for prior json whitespace test ts. |
| [prior-session-path-traversal.test.ts](../tests/context/prior-session-path-traversal.test.ts) | Behavior checks for prior session path traversal test ts. |
| [reinforcement-history-window.test.ts](../tests/context/reinforcement-history-window.test.ts) | Behavior checks for reinforcement history window test ts. |
| [reinforcement-selection.test.ts](../tests/context/reinforcement-selection.test.ts) | Behavior checks for reinforcement selection test ts. |
| [session-start-footer-5079.test.ts](../tests/context/session-start-footer-5079.test.ts) | Behavior checks for session start footer 5079 test ts. |
| [terminal-preview-4252.test.ts](../tests/context/terminal-preview-4252.test.ts) | Behavior checks for terminal preview 4252 test ts. |
| [token-calculator.test.ts](../tests/context/token-calculator.test.ts) | Behavior checks for token calculator test ts. |
| [transcript-cache-lifecycle.test.ts](../tests/context/transcript-cache-lifecycle.test.ts) | Behavior checks for transcript cache lifecycle test ts. |
| [transcript-cache-outage.test.ts](../tests/context/transcript-cache-outage.test.ts) | Behavior checks for transcript cache outage test ts. |

## tests/context/formatters/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [agent-formatter.test.ts](../tests/context/formatters/agent-formatter.test.ts) | Behavior checks for agent formatter test ts. |

## tests/context/sections/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [header-renderer-environment.test.ts](../tests/context/sections/header-renderer-environment.test.ts) | Behavior checks for header renderer environment test ts. |
| [summary-renderer.test.ts](../tests/context/sections/summary-renderer.test.ts) | Behavior checks for summary renderer test ts. |
| [work-state-own-keys.test.ts](../tests/context/sections/work-state-own-keys.test.ts) | Behavior checks for work state own keys test ts. |
| [work-state-renderer.test.ts](../tests/context/sections/work-state-renderer.test.ts) | Behavior checks for work state renderer test ts. |

## tests/core/schemas/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [server-storage-schemas.test.ts](../tests/core/schemas/server-storage-schemas.test.ts) | Behavior checks for server storage schemas test ts. |

## tests/dedup/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [config.test.ts](../tests/dedup/config.test.ts) | Behavior checks for config test ts. |
| [idf-veto.test.ts](../tests/dedup/idf-veto.test.ts) | Behavior checks for idf veto test ts. |
| [idf.test.ts](../tests/dedup/idf.test.ts) | Behavior checks for idf test ts. |
| [near-duplicate.test.ts](../tests/dedup/near-duplicate.test.ts) | Behavior checks for near duplicate test ts. |
| [normalize.test.ts](../tests/dedup/normalize.test.ts) | Behavior checks for normalize test ts. |
| [tfidf-cosine.test.ts](../tests/dedup/tfidf-cosine.test.ts) | Behavior checks for tfidf cosine test ts. |
| [unicode-title-identity.test.ts](../tests/dedup/unicode-title-identity.test.ts) | Behavior checks for unicode title identity test ts. |

## tests/dedup/fixtures/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [golden.json](../tests/dedup/fixtures/golden.json) | Configuration or structured data: golden. |

## tests/evals/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [read-gate-trace-analysis.test.ts](../tests/evals/read-gate-trace-analysis.test.ts) | Behavior checks for read gate trace analysis test ts. |

## tests/fixtures/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [browser-setup-watcher-failure.ts](../tests/fixtures/browser-setup-watcher-failure.ts) | Evaluation/test fixture code: browser setup watcher failure. |
| [claude-mem-issue-3712.md](../tests/fixtures/claude-mem-issue-3712.md) | Documentation: claude mem issue 3712. |
| [context-read-http-server.ts](../tests/fixtures/context-read-http-server.ts) | Evaluation/test fixture code: context read http server. |
| [cursor-session.jsonl](../tests/fixtures/cursor-session.jsonl) | Supporting file: cursor session. |
| [grok-bot-session.jsonl](../tests/fixtures/grok-bot-session.jsonl) | Supporting file: grok bot session. |
| [kimi-wire.sample.jsonl](../tests/fixtures/kimi-wire.sample.jsonl) | Supporting file: kimi wire.sample. |
| [npm-timeout-windows-native.mjs](../tests/fixtures/npm-timeout-windows-native.mjs) | Evaluation/test fixture code: npm timeout windows native. |
| [settings-save-error-repro.json](../tests/fixtures/settings-save-error-repro.json) | Configuration or structured data: settings save error repro. |
| [work-view-demo.ts](../tests/fixtures/work-view-demo.ts) | Evaluation/test fixture code: work view demo. |

## tests/fixtures/codex/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [grouping-answer-malformed.txt](../tests/fixtures/codex/grouping-answer-malformed.txt) | Supporting file: grouping answer malformed. |
| [grouping-answer-schema.txt](../tests/fixtures/codex/grouping-answer-schema.txt) | Supporting file: grouping answer schema. |
| [post-tool-use-apply-patch.json](../tests/fixtures/codex/post-tool-use-apply-patch.json) | Configuration or structured data: post tool use apply patch. |

## tests/fixtures/custom-providers/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [default-function-export.mjs](../tests/fixtures/custom-providers/default-function-export.mjs) | Evaluation/test fixture code: default function export. |
| [default-object-export.mjs](../tests/fixtures/custom-providers/default-object-export.mjs) | Evaluation/test fixture code: default object export. |
| [named-export.mjs](../tests/fixtures/custom-providers/named-export.mjs) | Evaluation/test fixture code: named export. |
| [no-factory.mjs](../tests/fixtures/custom-providers/no-factory.mjs) | Evaluation/test fixture code: no factory. |

## tests/fixtures/gemini/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [concurrent-pacing.ts](../tests/fixtures/gemini/concurrent-pacing.ts) | Evaluation/test fixture code: concurrent pacing. |
| [empty-usage.ts](../tests/fixtures/gemini/empty-usage.ts) | Evaluation/test fixture code: empty usage. |
| [invalid-key-pool.ts](../tests/fixtures/gemini/invalid-key-pool.ts) | Evaluation/test fixture code: invalid key pool. |
| [pacing-compression.ts](../tests/fixtures/gemini/pacing-compression.ts) | Evaluation/test fixture code: pacing compression. |

## tests/fixtures/hosts/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [antigravity-cli-1.4.9-post-tool-use.json](../tests/fixtures/hosts/antigravity-cli-1.4.9-post-tool-use.json) | Configuration or structured data: antigravity cli 1.4.9 post tool use. |
| [kimi-code-hooks.json](../tests/fixtures/hosts/kimi-code-hooks.json) | Configuration or structured data: kimi code hooks. |
| [omp-hookapi.json](../tests/fixtures/hosts/omp-hookapi.json) | Configuration or structured data: omp hookapi. |

## tests/fixtures/kimi/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [read-file-path.ts](../tests/fixtures/kimi/read-file-path.ts) | Evaluation/test fixture code: read file path. |

## tests/fixtures/owner-goals/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [live-2026-10-26.json](../tests/fixtures/owner-goals/live-2026-10-26.json) | Configuration or structured data: live 2026 10 26. |

## tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [11111111-aaaa-bbbb-cccc-000000000001.jsonl](../tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/11111111-aaaa-bbbb-cccc-000000000001.jsonl) | Supporting file: 11111111 aaaa bbbb cccc 000000000001. |

## tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/11111111-aaaa-bbbb-cccc-000000000001/subagents/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [agent-1.jsonl](../tests/fixtures/prompt-import/home/.claude/projects/-work-alpha/11111111-aaaa-bbbb-cccc-000000000001/subagents/agent-1.jsonl) | Supporting file: agent 1. |

## tests/fixtures/prompt-import/home/.codex/sessions/2026/10/02/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [rollout-2026-10-02T10-00-00-interactive.jsonl](../tests/fixtures/prompt-import/home/.codex/sessions/2026/10/02/rollout-2026-10-02T10-00-00-interactive.jsonl) | Supporting file: rollout 2026 10 02T10 00 00 interactive. |
| [rollout-2026-10-02T11-00-00-exec.jsonl](../tests/fixtures/prompt-import/home/.codex/sessions/2026/10/02/rollout-2026-10-02T11-00-00-exec.jsonl) | Supporting file: rollout 2026 10 02T11 00 00 exec. |
| [rollout-2026-10-02T11-30-00-subagent.jsonl](../tests/fixtures/prompt-import/home/.codex/sessions/2026/10/02/rollout-2026-10-02T11-30-00-subagent.jsonl) | Supporting file: rollout 2026 10 02T11 30 00 subagent. |

## tests/fixtures/prompt-import/home/.gemini/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [projects.json](../tests/fixtures/prompt-import/home/.gemini/projects.json) | Configuration or structured data: projects. |

## tests/fixtures/prompt-import/home/.gemini/antigravity-cli/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [history.jsonl](../tests/fixtures/prompt-import/home/.gemini/antigravity-cli/history.jsonl) | Supporting file: history. |

## tests/fixtures/prompt-import/home/.gemini/tmp/gamma/chats/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [session-2026-10-03T10-00-g1.jsonl](../tests/fixtures/prompt-import/home/.gemini/tmp/gamma/chats/session-2026-10-03T10-00-g1.jsonl) | Supporting file: session 2026 10 03T10 00 g1. |
| [session-2026-10-04T10-00-g2.json](../tests/fixtures/prompt-import/home/.gemini/tmp/gamma/chats/session-2026-10-04T10-00-g2.json) | Configuration or structured data: session 2026 10 04T10 00 g2. |

## tests/fixtures/prompt-import/home/.local/share/opencode/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [opencode.db](../tests/fixtures/prompt-import/home/.local/share/opencode/opencode.db) | Reference or fixture artifact: opencode. |

## tests/fixtures/windsurf/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [workspace-cwd.ts](../tests/fixtures/windsurf/workspace-cwd.ts) | Evaluation/test fixture code: workspace cwd. |

## tests/fixtures/worker/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [claude-served-model-cli.cjs](../tests/fixtures/worker/claude-served-model-cli.cjs) | Evaluation/test fixture code: claude served model cli. |
| [claude-served-model.ts](../tests/fixtures/worker/claude-served-model.ts) | Evaluation/test fixture code: claude served model. |
| [hook-spool-timestamps.ts](../tests/fixtures/worker/hook-spool-timestamps.ts) | Evaluation/test fixture code: hook spool timestamps. |
| [manual-memory-source-scoping.ts](../tests/fixtures/worker/manual-memory-source-scoping.ts) | Evaluation/test fixture code: manual memory source scoping. |
| [native-memory-revisions.ts](../tests/fixtures/worker/native-memory-revisions.ts) | Evaluation/test fixture code: native memory revisions. |
| [observation-context-compression.ts](../tests/fixtures/worker/observation-context-compression.ts) | Evaluation/test fixture code: observation context compression. |
| [queued-summary-origin-cli.cjs](../tests/fixtures/worker/queued-summary-origin-cli.cjs) | Evaluation/test fixture code: queued summary origin cli. |
| [queued-summary-origin.ts](../tests/fixtures/worker/queued-summary-origin.ts) | Evaluation/test fixture code: queued summary origin. |

## tests/helpers/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [chrome-devtools.browser.test.ts](../tests/helpers/chrome-devtools.browser.test.ts) | Behavior checks for chrome devtools. |
| [chrome-devtools.ts](../tests/helpers/chrome-devtools.ts) | Code module: chrome devtools; exports chromeExecutablePath, REPOSITORY_ROOT, failOnCiWithoutChrome, UNTHROTTLED_TIMER_FLAGS, compileBrowserFixture and 10 more. |
| [context-read-http-probe.ts](../tests/helpers/context-read-http-probe.ts) | Code module: context read http probe; exports assertContextReadResponsive. |
| [ephemeral-port.ts](../tests/helpers/ephemeral-port.ts) | Code module: ephemeral port; exports listenOnEphemeralPort. |
| [fake-conda-package.ts](../tests/helpers/fake-conda-package.ts) | Code module: fake conda package; exports tarOf, zipOf, fakeCondaPackage. |
| [fake-focus-writer.ts](../tests/helpers/fake-focus-writer.ts) | Code module: fake focus writer; exports focusWriter, focusInputFrom, everyRequestInOther, isOtherPass. |
| [fake-owner-goals-worker.ts](../tests/helpers/fake-owner-goals-worker.ts) | Code module: fake owner goals worker; exports fakeOwnerGoalsWorker. |
| [fake-spawn.ts](../tests/helpers/fake-spawn.ts) | Code module: fake spawn; exports setFakeSpawn. |
| [scratch-dir.ts](../tests/helpers/scratch-dir.ts) | Code module: scratch dir; exports scratchDir. |
| [slow-fs.test.ts](../tests/helpers/slow-fs.test.ts) | Behavior checks for slow fs test ts. |
| [slow-fs.ts](../tests/helpers/slow-fs.ts) | Code module: slow fs; exports SlowFsRun, SlowFsOptions, runWithSlowFs. |
| [stream-fetch-mock.ts](../tests/helpers/stream-fetch-mock.ts) | Code module: stream fetch mock; exports StreamBodyStep, StreamFetchScript, StreamFetchMock, createStreamFetchMock, LiveTimerTracker and 1 more. |
| [teambrain-mock-server.ts](../tests/helpers/teambrain-mock-server.ts) | Code module: teambrain mock server; exports MOCK_PAIRING_ID, MOCK_PAIRING_SECRET, MOCK_USER_CODE, MOCK_INVITE_TOKEN, MOCK_SEAT_USER_ID and 9 more. |
| [temp-hook-spool.ts](../tests/helpers/temp-hook-spool.ts) | Code module: temp hook spool; exports useTempHookSpoolDataDir, spooledEntries. |

## tests/hooks/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [file-context.test.ts](../tests/hooks/file-context.test.ts) | Behavior checks for file context test ts. |
| [runtime-selector.test.ts](../tests/hooks/runtime-selector.test.ts) | Behavior checks for runtime selector test ts. |
| [server-client-response-body.test.ts](../tests/hooks/server-client-response-body.test.ts) | Behavior checks for server client response body test ts. |
| [server-client.test.ts](../tests/hooks/server-client.test.ts) | Behavior checks for server client test ts. |

## tests/infrastructure/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [cleanup-v12_4_3.test.ts](../tests/infrastructure/cleanup-v12_4_3.test.ts) | Behavior checks for cleanup v12 4 3 test ts. |
| [committed-plugin-bundles.test.ts](../tests/infrastructure/committed-plugin-bundles.test.ts) | Behavior checks for committed plugin bundles test ts. |
| [context-reader-packaging.test.ts](../tests/infrastructure/context-reader-packaging.test.ts) | Behavior checks for context reader packaging test ts. |
| [graceful-shutdown.test.ts](../tests/infrastructure/graceful-shutdown.test.ts) | Behavior checks for graceful shutdown test ts. |
| [health-monitor-version-timeout.test.ts](../tests/infrastructure/health-monitor-version-timeout.test.ts) | Behavior checks for health monitor version timeout test ts. |
| [health-monitor.test.ts](../tests/infrastructure/health-monitor.test.ts) | Behavior checks for health monitor test ts. |
| [hook-early-env-optout.test.ts](../tests/infrastructure/hook-early-env-optout.test.ts) | Behavior checks for hook early env optout test ts. |
| [hook-shell-env-quoting.test.ts](../tests/infrastructure/hook-shell-env-quoting.test.ts) | Behavior checks for hook shell env quoting test ts. |
| [hook-shell.test.ts](../tests/infrastructure/hook-shell.test.ts) | Behavior checks for hook shell test ts. |
| [hooks-no-shell.test.ts](../tests/infrastructure/hooks-no-shell.test.ts) | Behavior checks for hooks no shell test ts. |
| [plugin-disabled-check.test.ts](../tests/infrastructure/plugin-disabled-check.test.ts) | Behavior checks for plugin disabled check test ts. |
| [plugin-distribution.test.ts](../tests/infrastructure/plugin-distribution.test.ts) | Behavior checks for plugin distribution test ts. |
| [plugin-root-resolution.test.ts](../tests/infrastructure/plugin-root-resolution.test.ts) | Behavior checks for plugin root resolution test ts. |
| [process-manager.test.ts](../tests/infrastructure/process-manager.test.ts) | Behavior checks for process manager test ts. |
| [qoder-plugin-launchers.test.ts](../tests/infrastructure/qoder-plugin-launchers.test.ts) | Behavior checks for qoder plugin launchers test ts. |
| [shutdown-cleanup-errors.test.ts](../tests/infrastructure/shutdown-cleanup-errors.test.ts) | Behavior checks for shutdown cleanup errors test ts. |
| [sync-matrix-e2e-safety.test.ts](../tests/infrastructure/sync-matrix-e2e-safety.test.ts) | Behavior checks for sync matrix e2e safety test ts. |
| [tsconfig-module-resolution.test.ts](../tests/infrastructure/tsconfig-module-resolution.test.ts) | Behavior checks for tsconfig module resolution test ts. |
| [version-consistency.test.ts](../tests/infrastructure/version-consistency.test.ts) | Behavior checks for version consistency test ts. |
| [windows-hide-regressions.test.ts](../tests/infrastructure/windows-hide-regressions.test.ts) | Behavior checks for windows hide regressions test ts. |
| [wmic-parsing.test.ts](../tests/infrastructure/wmic-parsing.test.ts) | Behavior checks for wmic parsing test ts. |
| [worker-bundle-self-contained.test.ts](../tests/infrastructure/worker-bundle-self-contained.test.ts) | Behavior checks for worker bundle self contained test ts. |
| [worker-json-status.test.ts](../tests/infrastructure/worker-json-status.test.ts) | Behavior checks for worker json status test ts. |

## tests/integration/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [chroma-windows-lifecycle.test.ts](../tests/integration/chroma-windows-lifecycle.test.ts) | Behavior checks for chroma windows lifecycle test ts. |
| [codex-cli-installer.test.ts](../tests/integration/codex-cli-installer.test.ts) | Behavior checks for codex cli installer test ts. |
| [codex-install-verification.test.ts](../tests/integration/codex-install-verification.test.ts) | Behavior checks for codex install verification test ts. |
| [codex-toml-header-comments.test.ts](../tests/integration/codex-toml-header-comments.test.ts) | Behavior checks for codex toml header comments test ts. |
| [hermes-worker-e2e.test.ts](../tests/integration/hermes-worker-e2e.test.ts) | Behavior checks for hermes worker e2e test ts. |
| [hook-execution-e2e.test.ts](../tests/integration/hook-execution-e2e.test.ts) | Behavior checks for hook execution e2e test ts. |
| [kimi-hooks-installer.test.ts](../tests/integration/kimi-hooks-installer.test.ts) | Behavior checks for kimi hooks installer test ts. |
| [opencode-cli-partial-install.test.ts](../tests/integration/opencode-cli-partial-install.test.ts) | Behavior checks for opencode cli partial install test ts. |
| [opencode-installer-missing-script.test.ts](../tests/integration/opencode-installer-missing-script.test.ts) | Behavior checks for opencode installer missing script test ts. |
| [opencode-installer.test.ts](../tests/integration/opencode-installer.test.ts) | Behavior checks for opencode installer test ts. |
| [redaction-wired.test.ts](../tests/integration/redaction-wired.test.ts) | Behavior checks for redaction wired test ts. |
| [t3code-installer.test.ts](../tests/integration/t3code-installer.test.ts) | Behavior checks for t3code installer test ts. |
| [worker-api-endpoints.test.ts](../tests/integration/worker-api-endpoints.test.ts) | Behavior checks for worker api endpoints test ts. |
| [worker-ghost-port-recovery.test.ts](../tests/integration/worker-ghost-port-recovery.test.ts) | Behavior checks for worker ghost port recovery test ts. |
| [worker-recycle-orphans.test.ts](../tests/integration/worker-recycle-orphans.test.ts) | Behavior checks for worker recycle orphans test ts. |

## tests/integration/fixtures/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [ghost-worker-host.ts](../tests/integration/fixtures/ghost-worker-host.ts) | Evaluation/test fixture code: ghost worker host. |
| [stale-worker-host.ts](../tests/integration/fixtures/stale-worker-host.ts) | Evaluation/test fixture code: stale worker host. |

## tests/integration/helpers/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [ghost-state.test.ts](../tests/integration/helpers/ghost-state.test.ts) | Behavior checks for ghost state test ts. |
| [ghost-state.ts](../tests/integration/helpers/ghost-state.ts) | Code module: ghost state; exports PostKillState, PostKillObservation, classifyPostKillState. |
| [process-tree-cleanup.test.ts](../tests/integration/helpers/process-tree-cleanup.test.ts) | Behavior checks for process tree cleanup test ts. |
| [process-tree.ts](../tests/integration/helpers/process-tree.ts) | Code module: process tree; exports ProcessIdentity, ProcessRow, snapshotDescendants, survivingProcesses, describeProcesses and 3 more. |

## tests/integrations/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [ccs-align-middle-cache.test.ts](../tests/integrations/ccs-align-middle-cache.test.ts) | Behavior checks for ccs align middle cache test ts. |
| [ccs-align-rules-walker.test.ts](../tests/integrations/ccs-align-rules-walker.test.ts) | Behavior checks for ccs align rules walker test ts. |
| [cursor-hooks-preserve-user-hooks.test.ts](../tests/integrations/cursor-hooks-preserve-user-hooks.test.ts) | Behavior checks for cursor hooks preserve user hooks test ts. |
| [goose-mcp-config.test.ts](../tests/integrations/goose-mcp-config.test.ts) | Behavior checks for goose mcp config test ts. |
| [grok-bot-awareness-pusher.test.ts](../tests/integrations/grok-bot-awareness-pusher.test.ts) | Behavior checks for grok bot awareness pusher test ts. |
| [grok-bot-brainbeat.test.ts](../tests/integrations/grok-bot-brainbeat.test.ts) | Behavior checks for grok bot brainbeat test ts. |
| [grok-bot-index-writer.test.ts](../tests/integrations/grok-bot-index-writer.test.ts) | Behavior checks for grok bot index writer test ts. |
| [harness-worker-settings.test.ts](../tests/integrations/harness-worker-settings.test.ts) | Behavior checks for harness worker settings test ts. |
| [install-relative-plugin-root.test.ts](../tests/integrations/install-relative-plugin-root.test.ts) | Behavior checks for install relative plugin root test ts. |
| [notion-exporter.test.ts](../tests/integrations/notion-exporter.test.ts) | Behavior checks for notion exporter test ts. |
| [telegram-observation-alerts.test.ts](../tests/integrations/telegram-observation-alerts.test.ts) | Behavior checks for telegram observation alerts test ts. |
| [telegram-wrapup-notifier.test.ts](../tests/integrations/telegram-wrapup-notifier.test.ts) | Behavior checks for telegram wrapup notifier test ts. |
| [warp-mcp-config.test.ts](../tests/integrations/warp-mcp-config.test.ts) | Behavior checks for warp mcp config test ts. |

## tests/launcher/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [bun-be-bun-support.test.ts](../tests/launcher/bun-be-bun-support.test.ts) | Behavior checks for bun be bun support test ts. |
| [bun-runtime.test.ts](../tests/launcher/bun-runtime.test.ts) | Behavior checks for bun runtime test ts. |
| [claude-mem-launcher.test.ts](../tests/launcher/claude-mem-launcher.test.ts) | Behavior checks for claude mem launcher test ts. |
| [install-launcher.test.ts](../tests/launcher/install-launcher.test.ts) | Behavior checks for install launcher test ts. |

## tests/memory/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [bash-memory-search-pattern.test.ts](../tests/memory/bash-memory-search-pattern.test.ts) | Behavior checks for bash memory search pattern test ts. |
| [file-watcher-race.test.ts](../tests/memory/file-watcher-race.test.ts) | Behavior checks for file watcher race test ts. |
| [local-activation.test.ts](../tests/memory/local-activation.test.ts) | Behavior checks for local activation test ts. |
| [memory-cli.test.ts](../tests/memory/memory-cli.test.ts) | Behavior checks for memory cli test ts. |
| [memory-hook-transport.test.ts](../tests/memory/memory-hook-transport.test.ts) | Behavior checks for memory hook transport test ts. |
| [memory-ingest.test.ts](../tests/memory/memory-ingest.test.ts) | Behavior checks for memory ingest test ts. |
| [native-memory-bridge.test.ts](../tests/memory/native-memory-bridge.test.ts) | Behavior checks for native memory bridge test ts. |

## tests/npx-cli/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [agent-selection.test.ts](../tests/npx-cli/agent-selection.test.ts) | Behavior checks for agent selection test ts. |
| [banner-scaling.test.ts](../tests/npx-cli/banner-scaling.test.ts) | Behavior checks for banner scaling test ts. |
| [browser-setup-checkout.test.ts](../tests/npx-cli/browser-setup-checkout.test.ts) | Behavior checks for browser setup checkout test ts. |
| [browser-setup-install.test.ts](../tests/npx-cli/browser-setup-install.test.ts) | Behavior checks for browser setup install test ts. |
| [browser-setup.test.ts](../tests/npx-cli/browser-setup.test.ts) | Behavior checks for browser setup test ts. |
| [claude-code-version.test.ts](../tests/npx-cli/claude-code-version.test.ts) | Behavior checks for claude code version test ts. |
| [cli-worker-port-settings.test.ts](../tests/npx-cli/cli-worker-port-settings.test.ts) | Behavior checks for cli worker port settings test ts. |
| [cmem-memory-credentials.test.ts](../tests/npx-cli/cmem-memory-credentials.test.ts) | Behavior checks for cmem memory credentials test ts. |
| [codex-install-funnel.test.ts](../tests/npx-cli/codex-install-funnel.test.ts) | Behavior checks for codex install funnel test ts. |
| [combined-installer-boundaries.test.ts](../tests/npx-cli/combined-installer-boundaries.test.ts) | Behavior checks for combined installer boundaries test ts. |
| [combined-installer-non-tty-boundaries.test.ts](../tests/npx-cli/combined-installer-non-tty-boundaries.test.ts) | Behavior checks for combined installer non tty boundaries test ts. |
| [doctor.test.ts](../tests/npx-cli/doctor.test.ts) | Behavior checks for doctor test ts. |
| [host-observer-port.test.ts](../tests/npx-cli/host-observer-port.test.ts) | Behavior checks for host observer port test ts. |
| [install-trial-contract.test.ts](../tests/npx-cli/install-trial-contract.test.ts) | Behavior checks for install trial contract test ts. |
| [install-update-keeps-provider.test.ts](../tests/npx-cli/install-update-keeps-provider.test.ts) | Behavior checks for install update keeps provider test ts. |
| [memory-ingest-cwd.test.ts](../tests/npx-cli/memory-ingest-cwd.test.ts) | Behavior checks for memory ingest cwd test ts. |
| [provider-account-gate.test.ts](../tests/npx-cli/provider-account-gate.test.ts) | Behavior checks for provider account gate test ts. |
| [prune-cache.test.ts](../tests/npx-cli/prune-cache.test.ts) | Behavior checks for prune cache test ts. |
| [search-ipv6.test.ts](../tests/npx-cli/search-ipv6.test.ts) | Behavior checks for search ipv6 test ts. |
| [search-output.test.ts](../tests/npx-cli/search-output.test.ts) | Behavior checks for search output test ts. |
| [server-embedder-install-gate.test.ts](../tests/npx-cli/server-embedder-install-gate.test.ts) | Behavior checks for server embedder install gate test ts. |
| [server-runtime-setup.test.ts](../tests/npx-cli/server-runtime-setup.test.ts) | Behavior checks for server runtime setup test ts. |
| [subcommand-help.test.ts](../tests/npx-cli/subcommand-help.test.ts) | Behavior checks for subcommand help test ts. |
| [teambrain-command.test.ts](../tests/npx-cli/teambrain-command.test.ts) | Behavior checks for teambrain command test ts. |
| [telemetry-scrub-installer-keys.test.ts](../tests/npx-cli/telemetry-scrub-installer-keys.test.ts) | Behavior checks for telemetry scrub installer keys test ts. |
| [uninstall-plugin-data-dir.test.ts](../tests/npx-cli/uninstall-plugin-data-dir.test.ts) | Behavior checks for uninstall plugin data dir test ts. |
| [usage-summary.test.ts](../tests/npx-cli/usage-summary.test.ts) | Behavior checks for usage summary test ts. |
| [windows-git-bash-preflight.test.ts](../tests/npx-cli/windows-git-bash-preflight.test.ts) | Behavior checks for windows git bash preflight test ts. |

## tests/scripts/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [calibrate-focus-routing.test.ts](../tests/scripts/calibrate-focus-routing.test.ts) | Behavior checks for calibrate focus routing test ts. |
| [export-atomic-output.test.ts](../tests/scripts/export-atomic-output.test.ts) | Behavior checks for export atomic output test ts. |
| [export-memories.test.ts](../tests/scripts/export-memories.test.ts) | Behavior checks for export memories test ts. |
| [export-prompt-parents.test.ts](../tests/scripts/export-prompt-parents.test.ts) | Behavior checks for export prompt parents test ts. |
| [mirror-dir.test.ts](../tests/scripts/mirror-dir.test.ts) | Behavior checks for mirror dir test ts. |
| [pr-babysit-status.test.ts](../tests/scripts/pr-babysit-status.test.ts) | Behavior checks for pr babysit status test ts. |
| [resolve-data-dir-parity.test.ts](../tests/scripts/resolve-data-dir-parity.test.ts) | Behavior checks for resolve data dir parity test ts. |
| [sync-plugin-manifests.test.ts](../tests/scripts/sync-plugin-manifests.test.ts) | Behavior checks for sync plugin manifests test ts. |
| [test-lanes.test.ts](../tests/scripts/test-lanes.test.ts) | Behavior checks for test lanes test ts. |
| [worker-logs-follow-chunks.test.ts](../tests/scripts/worker-logs-follow-chunks.test.ts) | Behavior checks for worker logs follow chunks test ts. |
| [worker-logs-producer.test.ts](../tests/scripts/worker-logs-producer.test.ts) | Behavior checks for worker logs producer test ts. |
| [worker-logs.test.ts](../tests/scripts/worker-logs.test.ts) | Behavior checks for worker logs test ts. |

## tests/sdk/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [hardened-options-thinking.test.ts](../tests/sdk/hardened-options-thinking.test.ts) | Behavior checks for hardened options thinking test ts. |
| [mode-skip-contract.test.ts](../tests/sdk/mode-skip-contract.test.ts) | Behavior checks for mode skip contract test ts. |
| [observer-thinking-option.test.ts](../tests/sdk/observer-thinking-option.test.ts) | Behavior checks for observer thinking option test ts. |
| [output-classifier.test.ts](../tests/sdk/output-classifier.test.ts) | Behavior checks for output classifier test ts. |
| [parse-schema-drift.test.ts](../tests/sdk/parse-schema-drift.test.ts) | Behavior checks for parse schema drift test ts. |
| [parse-summary.test.ts](../tests/sdk/parse-summary.test.ts) | Behavior checks for parse summary test ts. |
| [parser-character-references.test.ts](../tests/sdk/parser-character-references.test.ts) | Behavior checks for parser character references test ts. |
| [parser.test.ts](../tests/sdk/parser.test.ts) | Behavior checks for parser test ts. |
| [pg-isolation.ts](../tests/sdk/pg-isolation.ts) | Code module: pg isolation; exports quoteIdentifier, newApiKey, pgvectorAvailable, createIsolatedSchema, poolForSchema and 1 more. |
| [prompt-unicode-truncation.test.ts](../tests/sdk/prompt-unicode-truncation.test.ts) | Behavior checks for prompt unicode truncation test ts. |
| [prompts.test.ts](../tests/sdk/prompts.test.ts) | Behavior checks for prompts test ts. |

## tests/security/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [observer-tool-enforcement.test.ts](../tests/security/observer-tool-enforcement.test.ts) | Behavior checks for observer tool enforcement test ts. |

## tests/server/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [agent-event-platform-source.test.ts](../tests/server/agent-event-platform-source.test.ts) | Behavior checks for agent event platform source test ts. |
| [auth-api-key.test.ts](../tests/server/auth-api-key.test.ts) | Behavior checks for auth api key test ts. |
| [connect-keys.test.ts](../tests/server/connect-keys.test.ts) | Behavior checks for connect keys test ts. |
| [context-recency-mode.test.ts](../tests/server/context-recency-mode.test.ts) | Behavior checks for context recency mode test ts. |
| [data-deletion.test.ts](../tests/server/data-deletion.test.ts) | Behavior checks for data deletion test ts. |
| [embedding-parts-contract.test.ts](../tests/server/embedding-parts-contract.test.ts) | Behavior checks for embedding parts contract test ts. |
| [error-handler.test.ts](../tests/server/error-handler.test.ts) | Behavior checks for error handler test ts. |
| [paid-readiness.test.ts](../tests/server/paid-readiness.test.ts) | Behavior checks for paid readiness test ts. |
| [ready-stream.test.ts](../tests/server/ready-stream.test.ts) | Behavior checks for ready stream test ts. |
| [semantic-context-route.test.ts](../tests/server/semantic-context-route.test.ts) | Behavior checks for semantic context route test ts. |
| [server-boot.test.ts](../tests/server/server-boot.test.ts) | Behavior checks for server boot test ts. |
| [server-cli.test.ts](../tests/server/server-cli.test.ts) | Behavior checks for server cli test ts. |
| [server-last-response.test.ts](../tests/server/server-last-response.test.ts) | Behavior checks for server last response test ts. |
| [server-runtime-guard.test.ts](../tests/server/server-runtime-guard.test.ts) | Behavior checks for server runtime guard test ts. |
| [server-runtime-smoke.test.ts](../tests/server/server-runtime-smoke.test.ts) | Behavior checks for server runtime smoke test ts. |
| [server-security-headers.test.ts](../tests/server/server-security-headers.test.ts) | Behavior checks for server security headers test ts. |
| [server-service.test.ts](../tests/server/server-service.test.ts) | Behavior checks for server service test ts. |
| [server-viewer-routes.test.ts](../tests/server/server-viewer-routes.test.ts) | Behavior checks for server viewer routes test ts. |
| [server.test.ts](../tests/server/server.test.ts) | Behavior checks for server test ts. |
| [session-start-context-from-store.test.ts](../tests/server/session-start-context-from-store.test.ts) | Behavior checks for session start context from store test ts. |
| [tv-remote-guard.test.ts](../tests/server/tv-remote-guard.test.ts) | Behavior checks for tv remote guard test ts. |
| [v1-routes.test.ts](../tests/server/v1-routes.test.ts) | Behavior checks for v1 routes test ts. |

## tests/server/generation/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [empty-response-guard.test.ts](../tests/server/generation/empty-response-guard.test.ts) | Behavior checks for empty response guard test ts. |
| [generation-attempt-fencing.test.ts](../tests/server/generation/generation-attempt-fencing.test.ts) | Behavior checks for generation attempt fencing test ts. |
| [process-generated-response-vectors.test.ts](../tests/server/generation/process-generated-response-vectors.test.ts) | Behavior checks for process generated response vectors test ts. |
| [process-generated-response.test.ts](../tests/server/generation/process-generated-response.test.ts) | Behavior checks for process generated response test ts. |
| [provider-observation-generator.test.ts](../tests/server/generation/provider-observation-generator.test.ts) | Behavior checks for provider observation generator test ts. |
| [providers.test.ts](../tests/server/generation/providers.test.ts) | Behavior checks for providers test ts. |
| [reclaim-stale-processing-jobs.test.ts](../tests/server/generation/reclaim-stale-processing-jobs.test.ts) | Behavior checks for reclaim stale processing jobs test ts. |
| [scope-enforcement.test.ts](../tests/server/generation/scope-enforcement.test.ts) | Behavior checks for scope enforcement test ts. |
| [summary-input-budget.test.ts](../tests/server/generation/summary-input-budget.test.ts) | Behavior checks for summary input budget test ts. |
| [summary-starved-input.test.ts](../tests/server/generation/summary-starved-input.test.ts) | Behavior checks for summary starved input test ts. |

## tests/server/jobs/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [job-id.test.ts](../tests/server/jobs/job-id.test.ts) | Behavior checks for job id test ts. |
| [payload-schema.test.ts](../tests/server/jobs/payload-schema.test.ts) | Behavior checks for payload schema test ts. |
| [server-job-queue.test.ts](../tests/server/jobs/server-job-queue.test.ts) | Behavior checks for server job queue test ts. |

## tests/server/mcp/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [recall-mcp-server.test.ts](../tests/server/mcp/recall-mcp-server.test.ts) | Behavior checks for recall mcp server test ts. |

## tests/server/middleware/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [request-id.test.ts](../tests/server/middleware/request-id.test.ts) | Behavior checks for request id test ts. |

## tests/server/runtime/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [active-queue-manager.test.ts](../tests/server/runtime/active-queue-manager.test.ts) | Behavior checks for active queue manager test ts. |
| [create-server-service-custom-provider.test.ts](../tests/server/runtime/create-server-service-custom-provider.test.ts) | Behavior checks for create server service custom provider test ts. |
| [generation-concurrency.test.ts](../tests/server/runtime/generation-concurrency.test.ts) | Behavior checks for generation concurrency test ts. |
| [jobs-list-and-operator-routes.test.ts](../tests/server/runtime/jobs-list-and-operator-routes.test.ts) | Behavior checks for jobs list and operator routes test ts. |
| [memories-generation-key.test.ts](../tests/server/runtime/memories-generation-key.test.ts) | Behavior checks for memories generation key test ts. |
| [memories-vector-write.test.ts](../tests/server/runtime/memories-vector-write.test.ts) | Behavior checks for memories vector write test ts. |
| [server-claude-provider-env.test.ts](../tests/server/runtime/server-claude-provider-env.test.ts) | Behavior checks for server claude provider env test ts. |
| [server-max-output-tokens.test.ts](../tests/server/runtime/server-max-output-tokens.test.ts) | Behavior checks for server max output tokens test ts. |
| [server-mcp-http-routes.test.ts](../tests/server/runtime/server-mcp-http-routes.test.ts) | Behavior checks for server mcp http routes test ts. |
| [server-mcp-routes.test.ts](../tests/server/runtime/server-mcp-routes.test.ts) | Behavior checks for server mcp routes test ts. |
| [server-provider-cmem-key-lock.test.ts](../tests/server/runtime/server-provider-cmem-key-lock.test.ts) | Behavior checks for server provider cmem key lock test ts. |
| [server-session-linkage.test.ts](../tests/server/runtime/server-session-linkage.test.ts) | Behavior checks for server session linkage test ts. |
| [server-session-routes.test.ts](../tests/server/runtime/server-session-routes.test.ts) | Behavior checks for server session routes test ts. |
| [server-session-runtime.test.ts](../tests/server/runtime/server-session-runtime.test.ts) | Behavior checks for server session runtime test ts. |
| [team-project-jobs-routes.test.ts](../tests/server/runtime/team-project-jobs-routes.test.ts) | Behavior checks for team project jobs routes test ts. |

## tests/servers/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [checkout-search-scope.test.ts](../tests/servers/checkout-search-scope.test.ts) | Behavior checks for checkout search scope test ts. |
| [corpus-worker-stream.test.ts](../tests/servers/corpus-worker-stream.test.ts) | Behavior checks for corpus worker stream test ts. |
| [mcp-http-server.test.ts](../tests/servers/mcp-http-server.test.ts) | Behavior checks for mcp http server test ts. |
| [mcp-http.test.ts](../tests/servers/mcp-http.test.ts) | Behavior checks for mcp http test ts. |
| [mcp-project-cwd.test.ts](../tests/servers/mcp-project-cwd.test.ts) | Behavior checks for mcp project cwd test ts. |
| [mcp-runtime-tool-visibility.test.ts](../tests/servers/mcp-runtime-tool-visibility.test.ts) | Behavior checks for mcp runtime tool visibility test ts. |
| [mcp-server-name-safety.test.ts](../tests/servers/mcp-server-name-safety.test.ts) | Behavior checks for mcp server name safety test ts. |
| [mcp-stdio-cwd-resolver.test.ts](../tests/servers/mcp-stdio-cwd-resolver.test.ts) | Behavior checks for mcp stdio cwd resolver test ts. |
| [mcp-text-format.test.ts](../tests/servers/mcp-text-format.test.ts) | Behavior checks for mcp text format test ts. |
| [mcp-tool-annotations.test.ts](../tests/servers/mcp-tool-annotations.test.ts) | Behavior checks for mcp tool annotations test ts. |
| [mcp-tool-schemas.test.ts](../tests/servers/mcp-tool-schemas.test.ts) | Behavior checks for mcp tool schemas test ts. |
| [progressive-memory-stdio.test.ts](../tests/servers/progressive-memory-stdio.test.ts) | Behavior checks for progressive memory stdio test ts. |
| [teambrain-tools-stdio.test.ts](../tests/servers/teambrain-tools-stdio.test.ts) | Behavior checks for teambrain tools stdio test ts. |
| [work-state-switch-stdio.test.ts](../tests/servers/work-state-switch-stdio.test.ts) | Behavior checks for work state switch stdio test ts. |
| [worker-restart.test.ts](../tests/servers/worker-restart.test.ts) | Behavior checks for worker restart test ts. |

## tests/services/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [logs-routes-tail-read.test.ts](../tests/services/logs-routes-tail-read.test.ts) | Behavior checks for logs routes tail read test ts. |
| [mode-manager-custom.test.ts](../tests/services/mode-manager-custom.test.ts) | Behavior checks for mode manager custom test ts. |
| [stale-abort-controller-guard.test.ts](../tests/services/stale-abort-controller-guard.test.ts) | Behavior checks for stale abort controller guard test ts. |
| [worker-daemon-port-race.test.ts](../tests/services/worker-daemon-port-race.test.ts) | Behavior checks for worker daemon port race test ts. |
| [worker-daemon-unbindable-port.test.ts](../tests/services/worker-daemon-unbindable-port.test.ts) | Behavior checks for worker daemon unbindable port test ts. |
| [worker-idle-exit-monitor.test.ts](../tests/services/worker-idle-exit-monitor.test.ts) | Behavior checks for worker idle exit monitor test ts. |
| [worker-idle-exit-wiring.test.ts](../tests/services/worker-idle-exit-wiring.test.ts) | Behavior checks for worker idle exit wiring test ts. |
| [worker-invalid-transcript-config.test.ts](../tests/services/worker-invalid-transcript-config.test.ts) | Behavior checks for worker invalid transcript config test ts. |
| [worker-pending-session-resume.test.ts](../tests/services/worker-pending-session-resume.test.ts) | Behavior checks for worker pending session resume test ts. |
| [worker-processing-status-broadcast.test.ts](../tests/services/worker-processing-status-broadcast.test.ts) | Behavior checks for worker processing status broadcast test ts. |
| [worker-restart-verify.test.ts](../tests/services/worker-restart-verify.test.ts) | Behavior checks for worker restart verify test ts. |
| [worker-shutdown-sequence.test.ts](../tests/services/worker-shutdown-sequence.test.ts) | Behavior checks for worker shutdown sequence test ts. |
| [worker-spawner-pidns.test.ts](../tests/services/worker-spawner-pidns.test.ts) | Behavior checks for worker spawner pidns test ts. |
| [worker-spawner.test.ts](../tests/services/worker-spawner.test.ts) | Behavior checks for worker spawner test ts. |

## tests/services/agent-runner/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [detect.test.ts](../tests/services/agent-runner/detect.test.ts) | Behavior checks for detect test ts. |
| [extraction-input.test.ts](../tests/services/agent-runner/extraction-input.test.ts) | Behavior checks for extraction input test ts. |
| [run.test.ts](../tests/services/agent-runner/run.test.ts) | Behavior checks for run test ts. |
| [runtime-read-roots.test.ts](../tests/services/agent-runner/runtime-read-roots.test.ts) | Behavior checks for runtime read roots test ts. |

## tests/services/hooks/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [server-client-semantic.test.ts](../tests/services/hooks/server-client-semantic.test.ts) | Behavior checks for server client semantic test ts. |

## tests/services/infrastructure/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [fts-maintenance.test.ts](../tests/services/infrastructure/fts-maintenance.test.ts) | Behavior checks for fts maintenance test ts. |
| [merged-project-chroma-settings.test.ts](../tests/services/infrastructure/merged-project-chroma-settings.test.ts) | Behavior checks for merged project chroma settings test ts. |
| [project-merge-command.test.ts](../tests/services/infrastructure/project-merge-command.test.ts) | Behavior checks for project merge command test ts. |
| [project-merge.test.ts](../tests/services/infrastructure/project-merge.test.ts) | Behavior checks for project merge test ts. |
| [worktree-adoption-bare-repo.test.ts](../tests/services/infrastructure/worktree-adoption-bare-repo.test.ts) | Behavior checks for worktree adoption bare repo test ts. |
| [worktree-adoption-chroma.test.ts](../tests/services/infrastructure/worktree-adoption-chroma.test.ts) | Behavior checks for worktree adoption chroma test ts. |
| [worktree-adoption-errors.test.ts](../tests/services/infrastructure/worktree-adoption-errors.test.ts) | Behavior checks for worktree adoption errors test ts. |
| [worktree-adoption-event-loop.test.ts](../tests/services/infrastructure/worktree-adoption-event-loop.test.ts) | Behavior checks for worktree adoption event loop test ts. |
| [worktree-adoption-orphans.test.ts](../tests/services/infrastructure/worktree-adoption-orphans.test.ts) | Behavior checks for worktree adoption orphans test ts. |
| [worktree-adoption-spawn-throw.test.ts](../tests/services/infrastructure/worktree-adoption-spawn-throw.test.ts) | Behavior checks for worktree adoption spawn throw test ts. |
| [worktree-adoption-submodule.test.ts](../tests/services/infrastructure/worktree-adoption-submodule.test.ts) | Behavior checks for worktree adoption submodule test ts. |
| [worktree-adoption-sweep.test.ts](../tests/services/infrastructure/worktree-adoption-sweep.test.ts) | Behavior checks for worktree adoption sweep test ts. |

## tests/services/integrations/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [spawn-contract-windows.test.ts](../tests/services/integrations/spawn-contract-windows.test.ts) | Behavior checks for spawn contract windows test ts. |

## tests/services/prompt-import/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [readers.test.ts](../tests/services/prompt-import/readers.test.ts) | Behavior checks for readers test ts. |
| [setup-scan.test.ts](../tests/services/prompt-import/setup-scan.test.ts) | Behavior checks for setup scan test ts. |
| [token-usage.test.ts](../tests/services/prompt-import/token-usage.test.ts) | Behavior checks for token usage test ts. |

## tests/services/queue/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [redis-config.test.ts](../tests/services/queue/redis-config.test.ts) | Behavior checks for redis config test ts. |
| [redis-integer-settings.test.ts](../tests/services/queue/redis-integer-settings.test.ts) | Behavior checks for redis integer settings test ts. |
| [redis-ipv6-url-host.test.ts](../tests/services/queue/redis-ipv6-url-host.test.ts) | Behavior checks for redis ipv6 url host test ts. |

## tests/services/setup/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [history-import.test.ts](../tests/services/setup/history-import.test.ts) | Behavior checks for history import test ts. |

## tests/services/smart-file-read/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [block-comment-doc.test.ts](../tests/services/smart-file-read/block-comment-doc.test.ts) | Behavior checks for block comment doc test ts. |
| [bounded-symbol-hints.test.ts](../tests/services/smart-file-read/bounded-symbol-hints.test.ts) | Behavior checks for bounded symbol hints test ts. |
| [c-cpp-outlines.test.ts](../tests/services/smart-file-read/c-cpp-outlines.test.ts) | Behavior checks for c cpp outlines test ts. |
| [case-insensitive-extensions.test.ts](../tests/services/smart-file-read/case-insensitive-extensions.test.ts) | Behavior checks for case insensitive extensions test ts. |
| [class-field-functions.test.ts](../tests/services/smart-file-read/class-field-functions.test.ts) | Behavior checks for class field functions test ts. |
| [column-zero-ends.test.ts](../tests/services/smart-file-read/column-zero-ends.test.ts) | Behavior checks for column zero ends test ts. |
| [cpp-namespace-count.test.ts](../tests/services/smart-file-read/cpp-namespace-count.test.ts) | Behavior checks for cpp namespace count test ts. |
| [cpp-namespace-owners.test.ts](../tests/services/smart-file-read/cpp-namespace-owners.test.ts) | Behavior checks for cpp namespace owners test ts. |
| [doc-comment-lines.test.ts](../tests/services/smart-file-read/doc-comment-lines.test.ts) | Behavior checks for doc comment lines test ts. |
| [doc-comment-summaries.test.ts](../tests/services/smart-file-read/doc-comment-summaries.test.ts) | Behavior checks for doc comment summaries test ts. |
| [generator-functions.test.ts](../tests/services/smart-file-read/generator-functions.test.ts) | Behavior checks for generator functions test ts. |
| [go-grouped-types.test.ts](../tests/services/smart-file-read/go-grouped-types.test.ts) | Behavior checks for go grouped types test ts. |
| [go-receiver-methods.test.ts](../tests/services/smart-file-read/go-receiver-methods.test.ts) | Behavior checks for go receiver methods test ts. |
| [go-receiver-search.test.ts](../tests/services/smart-file-read/go-receiver-search.test.ts) | Behavior checks for go receiver search test ts. |
| [go-type-aliases.test.ts](../tests/services/smart-file-read/go-type-aliases.test.ts) | Behavior checks for go type aliases test ts. |
| [grammar-lib-reuse.test.ts](../tests/services/smart-file-read/grammar-lib-reuse.test.ts) | Behavior checks for grammar lib reuse test ts. |
| [haskell-class-signatures.test.ts](../tests/services/smart-file-read/haskell-class-signatures.test.ts) | Behavior checks for haskell class signatures test ts. |
| [import-ranges.test.ts](../tests/services/smart-file-read/import-ranges.test.ts) | Behavior checks for import ranges test ts. |
| [interface-method-owners.test.ts](../tests/services/smart-file-read/interface-method-owners.test.ts) | Behavior checks for interface method owners test ts. |
| [java-constructors.test.ts](../tests/services/smart-file-read/java-constructors.test.ts) | Behavior checks for java constructors test ts. |
| [java-records.test.ts](../tests/services/smart-file-read/java-records.test.ts) | Behavior checks for java records test ts. |
| [js-method-names.test.ts](../tests/services/smart-file-read/js-method-names.test.ts) | Behavior checks for js method names test ts. |
| [kotlin-constructors.test.ts](../tests/services/smart-file-read/kotlin-constructors.test.ts) | Behavior checks for kotlin constructors test ts. |
| [language-map.test.ts](../tests/services/smart-file-read/language-map.test.ts) | Behavior checks for language map test ts. |
| [large-query-batch.test.ts](../tests/services/smart-file-read/large-query-batch.test.ts) | Behavior checks for large query batch test ts. |
| [lua-function-values.test.ts](../tests/services/smart-file-read/lua-function-values.test.ts) | Behavior checks for lua function values test ts. |
| [multiline-symbol-names.test.ts](../tests/services/smart-file-read/multiline-symbol-names.test.ts) | Behavior checks for multiline symbol names test ts. |
| [native-prerequisite.ts](../tests/services/smart-file-read/native-prerequisite.ts) | Code module: native prerequisite; exports nativeTest. |
| [path-search.test.ts](../tests/services/smart-file-read/path-search.test.ts) | Behavior checks for path search test ts. |
| [php-enums.test.ts](../tests/services/smart-file-read/php-enums.test.ts) | Behavior checks for php enums test ts. |
| [python-decorator-ranges.test.ts](../tests/services/smart-file-read/python-decorator-ranges.test.ts) | Behavior checks for python decorator ranges test ts. |
| [python-docstrings.test.ts](../tests/services/smart-file-read/python-docstrings.test.ts) | Behavior checks for python docstrings test ts. |
| [qualified-unfold.test.ts](../tests/services/smart-file-read/qualified-unfold.test.ts) | Behavior checks for qualified unfold test ts. |
| [recursive-symbol-count.test.ts](../tests/services/smart-file-read/recursive-symbol-count.test.ts) | Behavior checks for recursive symbol count test ts. |
| [ruby-qualified-containers.test.ts](../tests/services/smart-file-read/ruby-qualified-containers.test.ts) | Behavior checks for ruby qualified containers test ts. |
| [ruby-singleton-methods.test.ts](../tests/services/smart-file-read/ruby-singleton-methods.test.ts) | Behavior checks for ruby singleton methods test ts. |
| [rust-generic-impl.test.ts](../tests/services/smart-file-read/rust-generic-impl.test.ts) | Behavior checks for rust generic impl test ts. |
| [rust-modules.test.ts](../tests/services/smart-file-read/rust-modules.test.ts) | Behavior checks for rust modules test ts. |
| [setext-headings.test.ts](../tests/services/smart-file-read/setext-headings.test.ts) | Behavior checks for setext headings test ts. |
| [smart-search-relevance.test.ts](../tests/services/smart-file-read/smart-search-relevance.test.ts) | Behavior checks for smart search relevance test ts. |
| [swift-extensions.test.ts](../tests/services/smart-file-read/swift-extensions.test.ts) | Behavior checks for swift extensions test ts. |
| [swift-initializers.test.ts](../tests/services/smart-file-read/swift-initializers.test.ts) | Behavior checks for swift initializers test ts. |
| [symbol-nesting.test.ts](../tests/services/smart-file-read/symbol-nesting.test.ts) | Behavior checks for symbol nesting test ts. |
| [symbol-signature-columns.test.ts](../tests/services/smart-file-read/symbol-signature-columns.test.ts) | Behavior checks for symbol signature columns test ts. |
| [toml-quoted-tables.test.ts](../tests/services/smart-file-read/toml-quoted-tables.test.ts) | Behavior checks for toml quoted tables test ts. |
| [tree-sitter-bin-path.test.ts](../tests/services/smart-file-read/tree-sitter-bin-path.test.ts) | Behavior checks for tree sitter bin path test ts. |
| [tree-sitter-bin-windows.test.ts](../tests/services/smart-file-read/tree-sitter-bin-windows.test.ts) | Behavior checks for tree sitter bin windows test ts. |
| [tree-sitter-cli-checksums.test.ts](../tests/services/smart-file-read/tree-sitter-cli-checksums.test.ts) | Behavior checks for tree sitter cli checksums test ts. |
| [tree-sitter-cli-conda.test.ts](../tests/services/smart-file-read/tree-sitter-cli-conda.test.ts) | Behavior checks for tree sitter cli conda test ts. |
| [tree-sitter-cli-load-check.test.ts](../tests/services/smart-file-read/tree-sitter-cli-load-check.test.ts) | Behavior checks for tree sitter cli load check test ts. |
| [tree-sitter-probe-output.test.ts](../tests/services/smart-file-read/tree-sitter-probe-output.test.ts) | Behavior checks for tree sitter probe output test ts. |
| [typescript-abstract-classes.test.ts](../tests/services/smart-file-read/typescript-abstract-classes.test.ts) | Behavior checks for typescript abstract classes test ts. |
| [typescript-module-extensions.test.ts](../tests/services/smart-file-read/typescript-module-extensions.test.ts) | Behavior checks for typescript module extensions test ts. |
| [typescript-namespaces.test.ts](../tests/services/smart-file-read/typescript-namespaces.test.ts) | Behavior checks for typescript namespaces test ts. |
| [unbraced-signatures.test.ts](../tests/services/smart-file-read/unbraced-signatures.test.ts) | Behavior checks for unbraced signatures test ts. |
| [var-function-values.test.ts](../tests/services/smart-file-read/var-function-values.test.ts) | Behavior checks for var function values test ts. |
| [workspace-path-whitespace.test.ts](../tests/services/smart-file-read/workspace-path-whitespace.test.ts) | Behavior checks for workspace path whitespace test ts. |
| [workspace-path.test.ts](../tests/services/smart-file-read/workspace-path.test.ts) | Behavior checks for workspace path test ts. |
| [zig-test-names.test.ts](../tests/services/smart-file-read/zig-test-names.test.ts) | Behavior checks for zig test names test ts. |

## tests/services/sqlite/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [by-ids-limit-validation.test.ts](../tests/services/sqlite/by-ids-limit-validation.test.ts) | Behavior checks for by ids limit validation test ts. |
| [concept-search-legacy-text.test.ts](../tests/services/sqlite/concept-search-legacy-text.test.ts) | Behavior checks for concept search legacy text test ts. |
| [folder-search-pagination.test.ts](../tests/services/sqlite/folder-search-pagination.test.ts) | Behavior checks for folder search pagination test ts. |
| [fts-update-triggers.test.ts](../tests/services/sqlite/fts-update-triggers.test.ts) | Behavior checks for fts update triggers test ts. |
| [get-observations-by-ids-relevance.test.ts](../tests/services/sqlite/get-observations-by-ids-relevance.test.ts) | Behavior checks for get observations by ids relevance test ts. |
| [merged-project-id-hydration.test.ts](../tests/services/sqlite/merged-project-id-hydration.test.ts) | Behavior checks for merged project id hydration test ts. |
| [observations-by-file-merged-project.test.ts](../tests/services/sqlite/observations-by-file-merged-project.test.ts) | Behavior checks for observations by file merged project test ts. |
| [observations-by-file-path-candidates.test.ts](../tests/services/sqlite/observations-by-file-path-candidates.test.ts) | Behavior checks for observations by file path candidates test ts. |
| [parse-file-list.test.ts](../tests/services/sqlite/parse-file-list.test.ts) | Behavior checks for parse file list test ts. |
| [relative-folder-absolute-files.test.ts](../tests/services/sqlite/relative-folder-absolute-files.test.ts) | Behavior checks for relative folder absolute files test ts. |
| [search-cjk-fallback.test.ts](../tests/services/sqlite/search-cjk-fallback.test.ts) | Behavior checks for search cjk fallback test ts. |
| [search-empty-input.test.ts](../tests/services/sqlite/search-empty-input.test.ts) | Behavior checks for search empty input test ts. |
| [search-file-json-admission.test.ts](../tests/services/sqlite/search-file-json-admission.test.ts) | Behavior checks for search file json admission test ts. |
| [search-file-like-literals.test.ts](../tests/services/sqlite/search-file-like-literals.test.ts) | Behavior checks for search file like literals test ts. |
| [search-file-order.test.ts](../tests/services/sqlite/search-file-order.test.ts) | Behavior checks for search file order test ts. |
| [search-fts-any-term-bounded.test.ts](../tests/services/sqlite/search-fts-any-term-bounded.test.ts) | Behavior checks for search fts any term bounded test ts. |
| [search-fts-any-term-evidence.test.ts](../tests/services/sqlite/search-fts-any-term-evidence.test.ts) | Behavior checks for search fts any term evidence test ts. |
| [search-fts-any-term.test.ts](../tests/services/sqlite/search-fts-any-term.test.ts) | Behavior checks for search fts any term test ts. |
| [search-fts-partial-setup.test.ts](../tests/services/sqlite/search-fts-partial-setup.test.ts) | Behavior checks for search fts partial setup test ts. |
| [search-fts-probe-scope.test.ts](../tests/services/sqlite/search-fts-probe-scope.test.ts) | Behavior checks for search fts probe scope test ts. |
| [search-fts-query-semantics.test.ts](../tests/services/sqlite/search-fts-query-semantics.test.ts) | Behavior checks for search fts query semantics test ts. |
| [search-merged-project-fts.test.ts](../tests/services/sqlite/search-merged-project-fts.test.ts) | Behavior checks for search merged project fts test ts. |
| [search-platform-source-scoping.test.ts](../tests/services/sqlite/search-platform-source-scoping.test.ts) | Behavior checks for search platform source scoping test ts. |
| [search-project-aliases.test.ts](../tests/services/sqlite/search-project-aliases.test.ts) | Behavior checks for search project aliases test ts. |
| [session-search-find-by-folder.test.ts](../tests/services/sqlite/session-search-find-by-folder.test.ts) | Behavior checks for session search find by folder test ts. |
| [session-search-path-matching.test.ts](../tests/services/sqlite/session-search-path-matching.test.ts) | Behavior checks for session search path matching test ts. |
| [session-store-mark-completed.test.ts](../tests/services/sqlite/session-store-mark-completed.test.ts) | Behavior checks for session store mark completed test ts. |
| [session-store-reopen-completed.test.ts](../tests/services/sqlite/session-store-reopen-completed.test.ts) | Behavior checks for session store reopen completed test ts. |
| [stream-rows.test.ts](../tests/services/sqlite/stream-rows.test.ts) | Behavior checks for stream rows test ts. |
| [summary-file-filter-columns.test.ts](../tests/services/sqlite/summary-file-filter-columns.test.ts) | Behavior checks for summary file filter columns test ts. |
| [timeline-anchor-tie-boundary.test.ts](../tests/services/sqlite/timeline-anchor-tie-boundary.test.ts) | Behavior checks for timeline anchor tie boundary test ts. |
| [timeline-id-import-order.test.ts](../tests/services/sqlite/timeline-id-import-order.test.ts) | Behavior checks for timeline id import order test ts. |

## tests/services/sync/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [chroma-bootstrap-fragments.test.ts](../tests/services/sync/chroma-bootstrap-fragments.test.ts) | Behavior checks for chroma bootstrap fragments test ts. |
| [chroma-delete-row-documents.test.ts](../tests/services/sync/chroma-delete-row-documents.test.ts) | Behavior checks for chroma delete row documents test ts. |
| [chroma-mcp-manager-cwd.test.ts](../tests/services/sync/chroma-mcp-manager-cwd.test.ts) | Behavior checks for chroma mcp manager cwd test ts. |
| [chroma-mcp-manager-path.test.ts](../tests/services/sync/chroma-mcp-manager-path.test.ts) | Behavior checks for chroma mcp manager path test ts. |
| [chroma-mcp-manager-singleton.test.ts](../tests/services/sync/chroma-mcp-manager-singleton.test.ts) | Behavior checks for chroma mcp manager singleton test ts. |
| [chroma-mcp-manager-ssl.test.ts](../tests/services/sync/chroma-mcp-manager-ssl.test.ts) | Behavior checks for chroma mcp manager ssl test ts. |
| [chroma-merged-project-typed-lookup.test.ts](../tests/services/sync/chroma-merged-project-typed-lookup.test.ts) | Behavior checks for chroma merged project typed lookup test ts. |
| [chroma-query-postfilter.test.ts](../tests/services/sync/chroma-query-postfilter.test.ts) | Behavior checks for chroma query postfilter test ts. |
| [chroma-sqlite-id-lookup.test.ts](../tests/services/sync/chroma-sqlite-id-lookup.test.ts) | Behavior checks for chroma sqlite id lookup test ts. |
| [chroma-sync-concurrent-revisions.test.ts](../tests/services/sync/chroma-sync-concurrent-revisions.test.ts) | Behavior checks for chroma sync concurrent revisions test ts. |
| [chroma-sync-corrupt-collection.test.ts](../tests/services/sync/chroma-sync-corrupt-collection.test.ts) | Behavior checks for chroma sync corrupt collection test ts. |
| [chroma-sync-embedding-function.test.ts](../tests/services/sync/chroma-sync-embedding-function.test.ts) | Behavior checks for chroma sync embedding function test ts. |
| [chroma-sync-reconcile.test.ts](../tests/services/sync/chroma-sync-reconcile.test.ts) | Behavior checks for chroma sync reconcile test ts. |
| [chroma-sync-state-atomic.test.ts](../tests/services/sync/chroma-sync-state-atomic.test.ts) | Behavior checks for chroma sync state atomic test ts. |
| [chroma-sync-state-shape.test.ts](../tests/services/sync/chroma-sync-state-shape.test.ts) | Behavior checks for chroma sync state shape test ts. |
| [chroma-sync-unavailable.test.ts](../tests/services/sync/chroma-sync-unavailable.test.ts) | Behavior checks for chroma sync unavailable test ts. |
| [chroma-sync-watermarks.test.ts](../tests/services/sync/chroma-sync-watermarks.test.ts) | Behavior checks for chroma sync watermarks test ts. |

## tests/services/sync/fixtures/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [concurrent-revision.ts](../tests/services/sync/fixtures/concurrent-revision.ts) | Evaluation/test fixture code: concurrent revision. |

## tests/services/transcripts/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [state.test.ts](../tests/services/transcripts/state.test.ts) | Behavior checks for state test ts. |

## tests/services/vector/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [local-embedder-chunks.test.ts](../tests/services/vector/local-embedder-chunks.test.ts) | Behavior checks for local embedder chunks test ts. |
| [local-embedder-encode.test.ts](../tests/services/vector/local-embedder-encode.test.ts) | Behavior checks for local embedder encode test ts. |
| [local-embedder-load.test.ts](../tests/services/vector/local-embedder-load.test.ts) | Behavior checks for local embedder load test ts. |
| [models.test.ts](../tests/services/vector/models.test.ts) | Behavior checks for models test ts. |

## tests/services/worker/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [ingest-session-cwd.test.ts](../tests/services/worker/ingest-session-cwd.test.ts) | Behavior checks for ingest session cwd test ts. |
| [session-message-buffer.test.ts](../tests/services/worker/session-message-buffer.test.ts) | Behavior checks for session message buffer test ts. |
| [stale-spawn-recovery.test.ts](../tests/services/worker/stale-spawn-recovery.test.ts) | Behavior checks for stale spawn recovery test ts. |

## tests/services/worker/session/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [generator-exit-handler.test.ts](../tests/services/worker/session/generator-exit-handler.test.ts) | Behavior checks for generator exit handler test ts. |
| [output-recovery.test.ts](../tests/services/worker/session/output-recovery.test.ts) | Behavior checks for output recovery test ts. |

## tests/shared/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [advisor-tail-boundary.test.ts](../tests/shared/advisor-tail-boundary.test.ts) | Behavior checks for advisor tail boundary test ts. |
| [advisor-transcript.test.ts](../tests/shared/advisor-transcript.test.ts) | Behavior checks for advisor transcript test ts. |
| [api-key-list-shape.test.ts](../tests/shared/api-key-list-shape.test.ts) | Behavior checks for api key list shape test ts. |
| [api-key-pool.test.ts](../tests/shared/api-key-pool.test.ts) | Behavior checks for api key pool test ts. |
| [billing-bom-json.test.ts](../tests/shared/billing-bom-json.test.ts) | Behavior checks for billing bom json test ts. |
| [cmem-gateway.test.ts](../tests/shared/cmem-gateway.test.ts) | Behavior checks for cmem gateway test ts. |
| [cmem-key-lock-pools.test.ts](../tests/shared/cmem-key-lock-pools.test.ts) | Behavior checks for cmem key lock pools test ts. |
| [codex-compaction-gate.test.ts](../tests/shared/codex-compaction-gate.test.ts) | Behavior checks for codex compaction gate test ts. |
| [connection-refused-nested-text.test.ts](../tests/shared/connection-refused-nested-text.test.ts) | Behavior checks for connection refused nested text test ts. |
| [date-bounds.test.ts](../tests/shared/date-bounds.test.ts) | Behavior checks for date bounds test ts. |
| [deliverables-transcript.test.ts](../tests/shared/deliverables-transcript.test.ts) | Behavior checks for deliverables transcript test ts. |
| [deliverables.test.ts](../tests/shared/deliverables.test.ts) | Behavior checks for deliverables test ts. |
| [fetch-idle-timeout.test.ts](../tests/shared/fetch-idle-timeout.test.ts) | Behavior checks for fetch idle timeout test ts. |
| [file-read-gate-default.test.ts](../tests/shared/file-read-gate-default.test.ts) | Behavior checks for file read gate default test ts. |
| [find-claude-executable.test.ts](../tests/shared/find-claude-executable.test.ts) | Behavior checks for find claude executable test ts. |
| [gemini-answer-part-shape.test.ts](../tests/shared/gemini-answer-part-shape.test.ts) | Behavior checks for gemini answer part shape test ts. |
| [gemini-duration-finite.test.ts](../tests/shared/gemini-duration-finite.test.ts) | Behavior checks for gemini duration finite test ts. |
| [gemini-error-details.test.ts](../tests/shared/gemini-error-details.test.ts) | Behavior checks for gemini error details test ts. |
| [hook-spool.test.ts](../tests/shared/hook-spool.test.ts) | Behavior checks for hook spool test ts. |
| [host-hook-limits.test.ts](../tests/shared/host-hook-limits.test.ts) | Behavior checks for host hook limits test ts. |
| [integration-id.test.ts](../tests/shared/integration-id.test.ts) | Behavior checks for integration id test ts. |
| [integration-own-aliases.test.ts](../tests/shared/integration-own-aliases.test.ts) | Behavior checks for integration own aliases test ts. |
| [intent-credentials.test.ts](../tests/shared/intent-credentials.test.ts) | Behavior checks for intent credentials test ts. |
| [is-tool-skipped.test.ts](../tests/shared/is-tool-skipped.test.ts) | Behavior checks for is tool skipped test ts. |
| [kill-process-tree-cross-platform.test.ts](../tests/shared/kill-process-tree-cross-platform.test.ts) | Behavior checks for kill process tree cross platform test ts. |
| [kill-process-tree-identity.test.ts](../tests/shared/kill-process-tree-identity.test.ts) | Behavior checks for kill process tree identity test ts. |
| [kill-process-tree-modes.test.ts](../tests/shared/kill-process-tree-modes.test.ts) | Behavior checks for kill process tree modes test ts. |
| [kill-process-tree-pid-reuse.test.ts](../tests/shared/kill-process-tree-pid-reuse.test.ts) | Behavior checks for kill process tree pid reuse test ts. |
| [kimi-context-gate.test.ts](../tests/shared/kimi-context-gate.test.ts) | Behavior checks for kimi context gate test ts. |
| [known-marketplace-location.test.ts](../tests/shared/known-marketplace-location.test.ts) | Behavior checks for known marketplace location test ts. |
| [linux-proc-reads-5098.test.ts](../tests/shared/linux-proc-reads-5098.test.ts) | Behavior checks for linux proc reads 5098 test ts. |
| [memory-instructions.test.ts](../tests/shared/memory-instructions.test.ts) | Behavior checks for memory instructions test ts. |
| [memory-retrieval-tools.test.ts](../tests/shared/memory-retrieval-tools.test.ts) | Behavior checks for memory retrieval tools test ts. |
| [oauth-token.test.ts](../tests/shared/oauth-token.test.ts) | Behavior checks for oauth token test ts. |
| [observed-billing.test.ts](../tests/shared/observed-billing.test.ts) | Behavior checks for observed billing test ts. |
| [observer-recycle.test.ts](../tests/shared/observer-recycle.test.ts) | Behavior checks for observer recycle test ts. |
| [observer-transcript-dir.test.ts](../tests/shared/observer-transcript-dir.test.ts) | Behavior checks for observer transcript dir test ts. |
| [openrouter-attribution.test.ts](../tests/shared/openrouter-attribution.test.ts) | Behavior checks for openrouter attribution test ts. |
| [openrouter-base-url.test.ts](../tests/shared/openrouter-base-url.test.ts) | Behavior checks for openrouter base url test ts. |
| [openrouter-settings-surface.test.ts](../tests/shared/openrouter-settings-surface.test.ts) | Behavior checks for openrouter settings surface test ts. |
| [openrouter-token-compatibility.test.ts](../tests/shared/openrouter-token-compatibility.test.ts) | Behavior checks for openrouter token compatibility test ts. |
| [paths.test.ts](../tests/shared/paths.test.ts) | Behavior checks for paths test ts. |
| [port-reclaim-orphan-sweep.test.ts](../tests/shared/port-reclaim-orphan-sweep.test.ts) | Behavior checks for port reclaim orphan sweep test ts. |
| [port-reclaim.test.ts](../tests/shared/port-reclaim.test.ts) | Behavior checks for port reclaim test ts. |
| [pro-promo.test.ts](../tests/shared/pro-promo.test.ts) | Behavior checks for pro promo test ts. |
| [process-identity-spawn-result.test.ts](../tests/shared/process-identity-spawn-result.test.ts) | Behavior checks for process identity spawn result test ts. |
| [quota-cooldown-singleton-guard.ts](../tests/shared/quota-cooldown-singleton-guard.ts) | Code module: quota cooldown singleton guard; exports guardSharedQuotaCooldownSingleton. |
| [semantic-context.test.ts](../tests/shared/semantic-context.test.ts) | Behavior checks for semantic context test ts. |
| [settings-defaults-manager.test.ts](../tests/shared/settings-defaults-manager.test.ts) | Behavior checks for settings defaults manager test ts. |
| [settings-document-readers.test.ts](../tests/shared/settings-document-readers.test.ts) | Behavior checks for settings document readers test ts. |
| [settings-document.test.ts](../tests/shared/settings-document.test.ts) | Behavior checks for settings document test ts. |
| [should-skip-agent-observation.test.ts](../tests/shared/should-skip-agent-observation.test.ts) | Behavior checks for should skip agent observation test ts. |
| [should-track-project.test.ts](../tests/shared/should-track-project.test.ts) | Behavior checks for should track project test ts. |
| [spawn-candidate.test.ts](../tests/shared/spawn-candidate.test.ts) | Behavior checks for spawn candidate test ts. |
| [spawn-cmd-verbatim.test.ts](../tests/shared/spawn-cmd-verbatim.test.ts) | Behavior checks for spawn cmd verbatim test ts. |
| [sse-chunk-prefix.test.ts](../tests/shared/sse-chunk-prefix.test.ts) | Behavior checks for sse chunk prefix test ts. |
| [sse-dispatch.test.ts](../tests/shared/sse-dispatch.test.ts) | Behavior checks for sse dispatch test ts. |
| [sse-reader.test.ts](../tests/shared/sse-reader.test.ts) | Behavior checks for sse reader test ts. |
| [subagent-predicate.test.ts](../tests/shared/subagent-predicate.test.ts) | Behavior checks for subagent predicate test ts. |
| [sync-auth-html-comment-prefix.test.ts](../tests/shared/sync-auth-html-comment-prefix.test.ts) | Behavior checks for sync auth html comment prefix test ts. |
| [teambrain-client.test.ts](../tests/shared/teambrain-client.test.ts) | Behavior checks for teambrain client test ts. |
| [timeline-file-shapes.test.ts](../tests/shared/timeline-file-shapes.test.ts) | Behavior checks for timeline file shapes test ts. |
| [timeline-formatting.test.ts](../tests/shared/timeline-formatting.test.ts) | Behavior checks for timeline formatting test ts. |
| [token-compat-response-url.test.ts](../tests/shared/token-compat-response-url.test.ts) | Behavior checks for token compat response url test ts. |
| [transcript-parser-tail-read.test.ts](../tests/shared/transcript-parser-tail-read.test.ts) | Behavior checks for transcript parser tail read test ts. |
| [transcript-parser-tool-only-session.test.ts](../tests/shared/transcript-parser-tool-only-session.test.ts) | Behavior checks for transcript parser tool only session test ts. |
| [uvx-bin-dirs.test.ts](../tests/shared/uvx-bin-dirs.test.ts) | Behavior checks for uvx bin dirs test ts. |
| [uvx-env-sanitization.test.ts](../tests/shared/uvx-env-sanitization.test.ts) | Behavior checks for uvx env sanitization test ts. |
| [viewer-url.test.ts](../tests/shared/viewer-url.test.ts) | Behavior checks for viewer url test ts. |
| [welcome-hint-default.test.ts](../tests/shared/welcome-hint-default.test.ts) | Behavior checks for welcome hint default test ts. |
| [windows-credential-shim.test.ts](../tests/shared/windows-credential-shim.test.ts) | Behavior checks for windows credential shim test ts. |
| [windows-hidden-daemon-spawn.test.ts](../tests/shared/windows-hidden-daemon-spawn.test.ts) | Behavior checks for windows hidden daemon spawn test ts. |
| [windows-listen-socket.test.ts](../tests/shared/windows-listen-socket.test.ts) | Behavior checks for windows listen socket test ts. |
| [work-state-setting.test.ts](../tests/shared/work-state-setting.test.ts) | Behavior checks for work state setting test ts. |
| [worker-autostart-flag.test.ts](../tests/shared/worker-autostart-flag.test.ts) | Behavior checks for worker autostart flag test ts. |
| [worker-heartbeat.test.ts](../tests/shared/worker-heartbeat.test.ts) | Behavior checks for worker heartbeat test ts. |
| [worker-spawn-gate.test.ts](../tests/shared/worker-spawn-gate.test.ts) | Behavior checks for worker spawn gate test ts. |
| [worker-url-host-format.test.ts](../tests/shared/worker-url-host-format.test.ts) | Behavior checks for worker url host format test ts. |
| [worker-url.test.ts](../tests/shared/worker-url.test.ts) | Behavior checks for worker url test ts. |
| [worker-utils-body-read.test.ts](../tests/shared/worker-utils-body-read.test.ts) | Behavior checks for worker utils body read test ts. |
| [worker-utils-fail-loud.test.ts](../tests/shared/worker-utils-fail-loud.test.ts) | Behavior checks for worker utils fail loud test ts. |
| [worker-utils-fetch-verbose.test.ts](../tests/shared/worker-utils-fetch-verbose.test.ts) | Behavior checks for worker utils fetch verbose test ts. |
| [worker-utils-pidns.test.ts](../tests/shared/worker-utils-pidns.test.ts) | Behavior checks for worker utils pidns test ts. |
| [worker-utils-ready-stream.test.ts](../tests/shared/worker-utils-ready-stream.test.ts) | Behavior checks for worker utils ready stream test ts. |
| [worker-utils-timeout.test.ts](../tests/shared/worker-utils-timeout.test.ts) | Behavior checks for worker utils timeout test ts. |
| [worker-utils-unhealthy-port.test.ts](../tests/shared/worker-utils-unhealthy-port.test.ts) | Behavior checks for worker utils unhealthy port test ts. |
| [worker-utils-version-recycle.test.ts](../tests/shared/worker-utils-version-recycle.test.ts) | Behavior checks for worker utils version recycle test ts. |
| [worker-utils-viewer-url.test.ts](../tests/shared/worker-utils-viewer-url.test.ts) | Behavior checks for worker utils viewer url test ts. |
| [worker-utils-windows-port-wedge.test.ts](../tests/shared/worker-utils-windows-port-wedge.test.ts) | Behavior checks for worker utils windows port wedge test ts. |
| [worker-utils-zombie-port.test.ts](../tests/shared/worker-utils-zombie-port.test.ts) | Behavior checks for worker utils zombie port test ts. |

## tests/sqlite/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [dedup-idf-veto-boundary.test.ts](../tests/sqlite/dedup-idf-veto-boundary.test.ts) | Behavior checks for dedup idf veto boundary test ts. |
| [dedup-scan.test.ts](../tests/sqlite/dedup-scan.test.ts) | Behavior checks for dedup scan test ts. |
| [dedup-store.test.ts](../tests/sqlite/dedup-store.test.ts) | Behavior checks for dedup store test ts. |
| [distributed-manual-session-platform.test.ts](../tests/sqlite/distributed-manual-session-platform.test.ts) | Behavior checks for distributed manual session platform test ts. |
| [file-context-json.test.ts](../tests/sqlite/file-context-json.test.ts) | Behavior checks for file context json test ts. |
| [import-row-identities.test.ts](../tests/sqlite/import-row-identities.test.ts) | Behavior checks for import row identities test ts. |
| [import-session-titles.test.ts](../tests/sqlite/import-session-titles.test.ts) | Behavior checks for import session titles test ts. |
| [manual-session-platform.test.ts](../tests/sqlite/manual-session-platform.test.ts) | Behavior checks for manual session platform test ts. |
| [native-prompt-identity.test.ts](../tests/sqlite/native-prompt-identity.test.ts) | Behavior checks for native prompt identity test ts. |
| [observation-file-index.test.ts](../tests/sqlite/observation-file-index.test.ts) | Behavior checks for observation file index test ts. |
| [project-key-case.test.ts](../tests/sqlite/project-key-case.test.ts) | Behavior checks for project key case test ts. |
| [project-read-keys-covering.test.ts](../tests/sqlite/project-read-keys-covering.test.ts) | Behavior checks for project read keys covering test ts. |
| [project-read-keys.test.ts](../tests/sqlite/project-read-keys.test.ts) | Behavior checks for project read keys test ts. |
| [prompt-number-sparse-history.test.ts](../tests/sqlite/prompt-number-sparse-history.test.ts) | Behavior checks for prompt number sparse history test ts. |
| [search-readonly-fallback.test.ts](../tests/sqlite/search-readonly-fallback.test.ts) | Behavior checks for search readonly fallback test ts. |
| [session-store-advisor-calls.test.ts](../tests/sqlite/session-store-advisor-calls.test.ts) | Behavior checks for session store advisor calls test ts. |
| [session-store-cwd-migration.test.ts](../tests/sqlite/session-store-cwd-migration.test.ts) | Behavior checks for session store cwd migration test ts. |
| [session-store-dedup-integration.test.ts](../tests/sqlite/session-store-dedup-integration.test.ts) | Behavior checks for session store dedup integration test ts. |
| [session-store-dedup-migration.test.ts](../tests/sqlite/session-store-dedup-migration.test.ts) | Behavior checks for session store dedup migration test ts. |
| [session-store-dedup.test.ts](../tests/sqlite/session-store-dedup.test.ts) | Behavior checks for session store dedup test ts. |
| [session-store-deliverables.test.ts](../tests/sqlite/session-store-deliverables.test.ts) | Behavior checks for session store deliverables test ts. |
| [session-store-empty-title.test.ts](../tests/sqlite/session-store-empty-title.test.ts) | Behavior checks for session store empty title test ts. |
| [session-store-fts-triggers.test.ts](../tests/sqlite/session-store-fts-triggers.test.ts) | Behavior checks for session store fts triggers test ts. |
| [session-store-migrations.test.ts](../tests/sqlite/session-store-migrations.test.ts) | Behavior checks for session store migrations test ts. |
| [session-store-observations.test.ts](../tests/sqlite/session-store-observations.test.ts) | Behavior checks for session store observations test ts. |
| [session-store-observed-metadata.test.ts](../tests/sqlite/session-store-observed-metadata.test.ts) | Behavior checks for session store observed metadata test ts. |
| [session-store-orphan-fk-repair.test.ts](../tests/sqlite/session-store-orphan-fk-repair.test.ts) | Behavior checks for session store orphan fk repair test ts. |
| [session-store-project-key-source-migration.test.ts](../tests/sqlite/session-store-project-key-source-migration.test.ts) | Behavior checks for session store project key source migration test ts. |
| [session-store-prompts.test.ts](../tests/sqlite/session-store-prompts.test.ts) | Behavior checks for session store prompts test ts. |
| [session-store-sessions.test.ts](../tests/sqlite/session-store-sessions.test.ts) | Behavior checks for session store sessions test ts. |
| [session-store-summaries.test.ts](../tests/sqlite/session-store-summaries.test.ts) | Behavior checks for session store summaries test ts. |
| [session-store-synced-at.test.ts](../tests/sqlite/session-store-synced-at.test.ts) | Behavior checks for session store synced at test ts. |
| [session-store-telegram-wrapups.test.ts](../tests/sqlite/session-store-telegram-wrapups.test.ts) | Behavior checks for session store telegram wrapups test ts. |
| [session-store-tool-uses.test.ts](../tests/sqlite/session-store-tool-uses.test.ts) | Behavior checks for session store tool uses test ts. |
| [session-store-transactions.test.ts](../tests/sqlite/session-store-transactions.test.ts) | Behavior checks for session store transactions test ts. |
| [session-store-v7-rebuild-keeps-cascade.test.ts](../tests/sqlite/session-store-v7-rebuild-keeps-cascade.test.ts) | Behavior checks for session store v7 rebuild keeps cascade test ts. |
| [session-store-v7-rebuild-keeps-columns.test.ts](../tests/sqlite/session-store-v7-rebuild-keeps-columns.test.ts) | Behavior checks for session store v7 rebuild keeps columns test ts. |
| [session-store-work-state.test.ts](../tests/sqlite/session-store-work-state.test.ts) | Behavior checks for session store work state test ts. |
| [session-store-writer-version.test.ts](../tests/sqlite/session-store-writer-version.test.ts) | Behavior checks for session store writer version test ts. |
| [session-summary-files.test.ts](../tests/sqlite/session-summary-files.test.ts) | Behavior checks for session summary files test ts. |
| [tool-link-owner.test.ts](../tests/sqlite/tool-link-owner.test.ts) | Behavior checks for tool link owner test ts. |
| [tool-use-identity-rekey.test.ts](../tests/sqlite/tool-use-identity-rekey.test.ts) | Behavior checks for tool use identity rekey test ts. |
| [tool-uses-retention.test.ts](../tests/sqlite/tool-uses-retention.test.ts) | Behavior checks for tool uses retention test ts. |
| [unicode-title-key-upgrade.test.ts](../tests/sqlite/unicode-title-key-upgrade.test.ts) | Behavior checks for unicode title key upgrade test ts. |
| [writer-check-busy-timeout.test.ts](../tests/sqlite/writer-check-busy-timeout.test.ts) | Behavior checks for writer check busy timeout test ts. |

## tests/storage/postgres/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [canonical-json-keys.test.ts](../tests/storage/postgres/canonical-json-keys.test.ts) | Behavior checks for canonical json keys test ts. |
| [integer-settings.test.ts](../tests/storage/postgres/integer-settings.test.ts) | Behavior checks for integer settings test ts. |
| [observation-embeddings.test.ts](../tests/storage/postgres/observation-embeddings.test.ts) | Behavior checks for observation embeddings test ts. |
| [platform-source-scoping.test.ts](../tests/storage/postgres/platform-source-scoping.test.ts) | Behavior checks for platform source scoping test ts. |
| [postgres-storage.test.ts](../tests/storage/postgres/postgres-storage.test.ts) | Behavior checks for postgres storage test ts. |

## tests/storage/sqlite/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [memory-item-null-updates.test.ts](../tests/storage/sqlite/memory-item-null-updates.test.ts) | Behavior checks for memory item null updates test ts. |
| [memory-unsegmented-search.test.ts](../tests/storage/sqlite/memory-unsegmented-search.test.ts) | Behavior checks for memory unsegmented search test ts. |
| [server-storage.test.ts](../tests/storage/sqlite/server-storage.test.ts) | Behavior checks for server storage test ts. |

## tests/supervisor/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [env-sanitizer.test.ts](../tests/supervisor/env-sanitizer.test.ts) | Behavior checks for env sanitizer test ts. |
| [health-checker.test.ts](../tests/supervisor/health-checker.test.ts) | Behavior checks for health checker test ts. |
| [index.test.ts](../tests/supervisor/index.test.ts) | Behavior checks for index test ts. |
| [orphan-chroma-sweep.test.ts](../tests/supervisor/orphan-chroma-sweep.test.ts) | Behavior checks for orphan chroma sweep test ts. |
| [process-registry-singleton-guard.ts](../tests/supervisor/process-registry-singleton-guard.ts) | Code module: process registry singleton guard; exports guardSharedProcessRegistrySingleton. |
| [process-registry-superseded-entry.test.ts](../tests/supervisor/process-registry-superseded-entry.test.ts) | Behavior checks for process registry superseded entry test ts. |
| [process-registry.test.ts](../tests/supervisor/process-registry.test.ts) | Behavior checks for process registry test ts. |
| [shutdown.test.ts](../tests/supervisor/shutdown.test.ts) | Behavior checks for shutdown test ts. |
| [wait-for-slot.test.ts](../tests/supervisor/wait-for-slot.test.ts) | Behavior checks for wait for slot test ts. |
| [worker-pid-ownership.test.ts](../tests/supervisor/worker-pid-ownership.test.ts) | Behavior checks for worker pid ownership test ts. |

## tests/telemetry/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [backfill.test.ts](../tests/telemetry/backfill.test.ts) | Behavior checks for backfill test ts. |
| [buffer.test.ts](../tests/telemetry/buffer.test.ts) | Behavior checks for buffer test ts. |
| [consent.test.ts](../tests/telemetry/consent.test.ts) | Behavior checks for consent test ts. |
| [error-capture.test.ts](../tests/telemetry/error-capture.test.ts) | Behavior checks for error capture test ts. |
| [error-scrub.test.ts](../tests/telemetry/error-scrub.test.ts) | Behavior checks for error scrub test ts. |
| [install-stats.test.ts](../tests/telemetry/install-stats.test.ts) | Behavior checks for install stats test ts. |
| [scrub.test.ts](../tests/telemetry/scrub.test.ts) | Behavior checks for scrub test ts. |
| [shutdown.test.ts](../tests/telemetry/shutdown.test.ts) | Behavior checks for shutdown test ts. |
| [skill-id.test.ts](../tests/telemetry/skill-id.test.ts) | Behavior checks for skill id test ts. |
| [telemetry-client.test.ts](../tests/telemetry/telemetry-client.test.ts) | Behavior checks for telemetry client test ts. |
| [work-state-hook.test.ts](../tests/telemetry/work-state-hook.test.ts) | Behavior checks for work state hook test ts. |
| [work-state-ingest.test.ts](../tests/telemetry/work-state-ingest.test.ts) | Behavior checks for work state ingest test ts. |
| [work-state.test.ts](../tests/telemetry/work-state.test.ts) | Behavior checks for work state test ts. |

## tests/transcripts/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [checkpoint-shapes.test.ts](../tests/transcripts/checkpoint-shapes.test.ts) | Behavior checks for checkpoint shapes test ts. |
| [checkpoint-zstd-consistency.test.ts](../tests/transcripts/checkpoint-zstd-consistency.test.ts) | Behavior checks for checkpoint zstd consistency test ts. |
| [cli-dispatch.test.ts](../tests/transcripts/cli-dispatch.test.ts) | Behavior checks for cli dispatch test ts. |
| [codex-schema-prompt-delivery.test.ts](../tests/transcripts/codex-schema-prompt-delivery.test.ts) | Behavior checks for codex schema prompt delivery test ts. |
| [config-regex-validation.test.ts](../tests/transcripts/config-regex-validation.test.ts) | Behavior checks for config regex validation test ts. |
| [config-shape-validation.test.ts](../tests/transcripts/config-shape-validation.test.ts) | Behavior checks for config shape validation test ts. |
| [config.test.ts](../tests/transcripts/config.test.ts) | Behavior checks for config test ts. |
| [cursor-extraction.test.ts](../tests/transcripts/cursor-extraction.test.ts) | Behavior checks for cursor extraction test ts. |
| [dsh-watcher.test.ts](../tests/transcripts/dsh-watcher.test.ts) | Behavior checks for dsh watcher test ts. |
| [grok-bot-config.test.ts](../tests/transcripts/grok-bot-config.test.ts) | Behavior checks for grok bot config test ts. |
| [json-bom.test.ts](../tests/transcripts/json-bom.test.ts) | Behavior checks for json bom test ts. |
| [kimi-wire-extraction.test.ts](../tests/transcripts/kimi-wire-extraction.test.ts) | Behavior checks for kimi wire extraction test ts. |
| [match-rule-multi-field.test.ts](../tests/transcripts/match-rule-multi-field.test.ts) | Behavior checks for match rule multi field test ts. |
| [match-rule-negation.test.ts](../tests/transcripts/match-rule-negation.test.ts) | Behavior checks for match rule negation test ts. |
| [observed-model-extraction.test.ts](../tests/transcripts/observed-model-extraction.test.ts) | Behavior checks for observed model extraction test ts. |
| [processor-agent-id.test.ts](../tests/transcripts/processor-agent-id.test.ts) | Behavior checks for processor agent id test ts. |
| [processor-codex-context.test.ts](../tests/transcripts/processor-codex-context.test.ts) | Behavior checks for processor codex context test ts. |
| [processor-observation-retry.test.ts](../tests/transcripts/processor-observation-retry.test.ts) | Behavior checks for processor observation retry test ts. |
| [processor-session-cwd.test.ts](../tests/transcripts/processor-session-cwd.test.ts) | Behavior checks for processor session cwd test ts. |
| [processor-subagent-gate.test.ts](../tests/transcripts/processor-subagent-gate.test.ts) | Behavior checks for processor subagent gate test ts. |
| [processor-user-message-anchor.test.ts](../tests/transcripts/processor-user-message-anchor.test.ts) | Behavior checks for processor user message anchor test ts. |
| [standalone-observation-spool.test.ts](../tests/transcripts/standalone-observation-spool.test.ts) | Behavior checks for standalone observation spool test ts. |
| [standalone-spool-retry-order.test.ts](../tests/transcripts/standalone-spool-retry-order.test.ts) | Behavior checks for standalone spool retry order test ts. |
| [state-permissions.test.ts](../tests/transcripts/state-permissions.test.ts) | Behavior checks for state permissions test ts. |
| [watcher-anchor-retry.test.ts](../tests/transcripts/watcher-anchor-retry.test.ts) | Behavior checks for watcher anchor retry test ts. |
| [watcher-backfill-yield.test.ts](../tests/transcripts/watcher-backfill-yield.test.ts) | Behavior checks for watcher backfill yield test ts. |
| [watcher-file-replacement.test.ts](../tests/transcripts/watcher-file-replacement.test.ts) | Behavior checks for watcher file replacement test ts. |
| [watcher-held-checkpoints.test.ts](../tests/transcripts/watcher-held-checkpoints.test.ts) | Behavior checks for watcher held checkpoints test ts. |
| [watcher-missing-file.test.ts](../tests/transcripts/watcher-missing-file.test.ts) | Behavior checks for watcher missing file test ts. |
| [watcher-observation-restart.test.ts](../tests/transcripts/watcher-observation-restart.test.ts) | Behavior checks for watcher observation restart test ts. |
| [watcher-start-at-end.test.ts](../tests/transcripts/watcher-start-at-end.test.ts) | Behavior checks for watcher start at end test ts. |
| [watcher-stop-drain.test.ts](../tests/transcripts/watcher-stop-drain.test.ts) | Behavior checks for watcher stop drain test ts. |
| [watcher-subagent-resume.test.ts](../tests/transcripts/watcher-subagent-resume.test.ts) | Behavior checks for watcher subagent resume test ts. |
| [zstd-unused-descriptor-bit.test.ts](../tests/transcripts/zstd-unused-descriptor-bit.test.ts) | Behavior checks for zstd unused descriptor bit test ts. |
| [zstd-utf8-frame-seams.test.ts](../tests/transcripts/zstd-utf8-frame-seams.test.ts) | Behavior checks for zstd utf8 frame seams test ts. |

## tests/ui/my-work/

UI component and native-browser behavior checks.

| File | Responsibility |
| --- | --- |
| [hosted-setup.test.ts](../tests/ui/my-work/hosted-setup.test.ts) | Behavior checks for hosted setup test ts. |

## tests/ui/viewer/

UI component and native-browser behavior checks.

| File | Responsibility |
| --- | --- |
| [catalog-live-counts.browser.test.ts](../tests/ui/viewer/catalog-live-counts.browser.test.ts) | Behavior checks for catalog live counts. |
| [catalog-live-project.browser.test.ts](../tests/ui/viewer/catalog-live-project.browser.test.ts) | Behavior checks for catalog live project. |
| [context-preview-populated-source.browser.test.ts](../tests/ui/viewer/context-preview-populated-source.browser.test.ts) | Behavior checks for context preview populated source. |
| [context-preview-selection.browser.test.ts](../tests/ui/viewer/context-preview-selection.browser.test.ts) | Behavior checks for context preview selection. |
| [deletion-lifecycle.browser.test.ts](../tests/ui/viewer/deletion-lifecycle.browser.test.ts) | Behavior checks for deletion lifecycle. |
| [empty-filter-pagination.browser.test.ts](../tests/ui/viewer/empty-filter-pagination.browser.test.ts) | Behavior checks for empty filter pagination. |
| [header-teambrain-link.test.tsx](../tests/ui/viewer/header-teambrain-link.test.tsx) | Behavior checks for header teambrain link test tsx. |
| [log-clear-race.browser.test.ts](../tests/ui/viewer/log-clear-race.browser.test.ts) | Behavior checks for log clear race. |
| [log-multiline-filter.browser.test.ts](../tests/ui/viewer/log-multiline-filter.browser.test.ts) | Behavior checks for log multiline filter. |
| [logs-all-components.browser.test.ts](../tests/ui/viewer/logs-all-components.browser.test.ts) | Behavior checks for logs all components. |
| [logs-select-all.browser.test.ts](../tests/ui/viewer/logs-select-all.browser.test.ts) | Behavior checks for logs select all. |
| [notes-summary-card.test.ts](../tests/ui/viewer/notes-summary-card.test.ts) | Behavior checks for notes summary card test ts. |
| [observation-metadata-retention.browser.test.ts](../tests/ui/viewer/observation-metadata-retention.browser.test.ts) | Behavior checks for observation metadata retention. |
| [observation-metadata-shapes.test.tsx](../tests/ui/viewer/observation-metadata-shapes.test.tsx) | Behavior checks for observation metadata shapes test tsx. |
| [pagination-commit.browser.test.ts](../tests/ui/viewer/pagination-commit.browser.test.ts) | Behavior checks for pagination commit. |
| [pagination-loading-error.test.ts](../tests/ui/viewer/pagination-loading-error.test.ts) | Behavior checks for pagination loading error test ts. |
| [pagination-recovery.browser.test.ts](../tests/ui/viewer/pagination-recovery.browser.test.ts) | Behavior checks for pagination recovery. |
| [pagination-stale-failure.browser.test.ts](../tests/ui/viewer/pagination-stale-failure.browser.test.ts) | Behavior checks for pagination stale failure. |
| [pagination-visit.browser.test.ts](../tests/ui/viewer/pagination-visit.browser.test.ts) | Behavior checks for pagination visit. |
| [session-keyboard-actions.browser.test.ts](../tests/ui/viewer/session-keyboard-actions.browser.test.ts) | Behavior checks for session keyboard actions. |
| [session-list-retry.browser.test.ts](../tests/ui/viewer/session-list-retry.browser.test.ts) | Behavior checks for session list retry. |
| [settings-claude-auth-method.browser.test.ts](../tests/ui/viewer/settings-claude-auth-method.browser.test.ts) | Behavior checks for settings claude auth method. |
| [settings-claude-auth-method.test.ts](../tests/ui/viewer/settings-claude-auth-method.test.ts) | Behavior checks for settings claude auth method test ts. |
| [settings-count-clear.browser.test.ts](../tests/ui/viewer/settings-count-clear.browser.test.ts) | Behavior checks for settings count clear. |
| [settings-load-gate.browser.test.ts](../tests/ui/viewer/settings-load-gate.browser.test.ts) | Behavior checks for settings load gate. |
| [settings-save-draft.browser.test.ts](../tests/ui/viewer/settings-save-draft.browser.test.ts) | Behavior checks for settings save draft. |

## tests/utils/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [claude-md-utils.test.ts](../tests/utils/claude-md-utils.test.ts) | Behavior checks for claude md utils test ts. |
| [logger-format-context.test.ts](../tests/utils/logger-format-context.test.ts) | Behavior checks for logger format context test ts. |
| [logger-format-tool.test.ts](../tests/utils/logger-format-tool.test.ts) | Behavior checks for logger format tool test ts. |
| [logger-initialization-recovery.test.ts](../tests/utils/logger-initialization-recovery.test.ts) | Behavior checks for logger initialization recovery test ts. |
| [logger-null-observation.test.ts](../tests/utils/logger-null-observation.test.ts) | Behavior checks for logger null observation test ts. |
| [logger-slow-fs.test.ts](../tests/utils/logger-slow-fs.test.ts) | Behavior checks for logger slow fs test ts. |
| [md-symlink-write.test.ts](../tests/utils/md-symlink-write.test.ts) | Behavior checks for md symlink write test ts. |
| [mode-creator-skill.test.ts](../tests/utils/mode-creator-skill.test.ts) | Behavior checks for mode creator skill test ts. |
| [project-environments.test.ts](../tests/utils/project-environments.test.ts) | Behavior checks for project environments test ts. |
| [project-filter.test.ts](../tests/utils/project-filter.test.ts) | Behavior checks for project filter test ts. |
| [project-name-environments.test.ts](../tests/utils/project-name-environments.test.ts) | Behavior checks for project name environments test ts. |
| [project-name-isolation.test.ts](../tests/utils/project-name-isolation.test.ts) | Behavior checks for project name isolation test ts. |
| [project-name-submodule.test.ts](../tests/utils/project-name-submodule.test.ts) | Behavior checks for project name submodule test ts. |
| [project-name.test.ts](../tests/utils/project-name.test.ts) | Behavior checks for project name test ts. |
| [redaction-coverage.test.ts](../tests/utils/redaction-coverage.test.ts) | Behavior checks for redaction coverage test ts. |
| [redaction.test.ts](../tests/utils/redaction.test.ts) | Behavior checks for redaction test ts. |
| [skill-docs-placement.test.ts](../tests/utils/skill-docs-placement.test.ts) | Behavior checks for skill docs placement test ts. |
| [tag-stripping-quadratic.test.ts](../tests/utils/tag-stripping-quadratic.test.ts) | Behavior checks for tag stripping quadratic test ts. |
| [tag-stripping.test.ts](../tests/utils/tag-stripping.test.ts) | Behavior checks for tag stripping test ts. |
| [worktree-bare-repo.test.ts](../tests/utils/worktree-bare-repo.test.ts) | Behavior checks for worktree bare repo test ts. |

## tests/viewer/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [category.test.ts](../tests/viewer/category.test.ts) | Behavior checks for category test ts. |
| [data.test.ts](../tests/viewer/data.test.ts) | Behavior checks for data test ts. |
| [feed-deletion.test.ts](../tests/viewer/feed-deletion.test.ts) | Behavior checks for feed deletion test ts. |
| [feed-project-scope.test.ts](../tests/viewer/feed-project-scope.test.ts) | Behavior checks for feed project scope test ts. |
| [prompt-card-clamp.test.ts](../tests/viewer/prompt-card-clamp.test.ts) | Behavior checks for prompt card clamp test ts. |
| [sessions.test.ts](../tests/viewer/sessions.test.ts) | Behavior checks for sessions test ts. |
| [settings-save-error.test.ts](../tests/viewer/settings-save-error.test.ts) | Behavior checks for settings save error test ts. |
| [summary-section-icon.test.ts](../tests/viewer/summary-section-icon.test.ts) | Behavior checks for summary section icon test ts. |
| [theme-preference.test.ts](../tests/viewer/theme-preference.test.ts) | Behavior checks for theme preference test ts. |
| [theme-tokens.test.ts](../tests/viewer/theme-tokens.test.ts) | Behavior checks for theme tokens test ts. |
| [welcome-card-storage.test.ts](../tests/viewer/welcome-card-storage.test.ts) | Behavior checks for welcome card storage test ts. |

## tests/work-view/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [auto-refresh.test.ts](../tests/work-view/auto-refresh.test.ts) | Behavior checks for auto refresh test ts. |
| [deliverables-records.test.ts](../tests/work-view/deliverables-records.test.ts) | Behavior checks for deliverables records test ts. |
| [focus-judge.test.ts](../tests/work-view/focus-judge.test.ts) | Behavior checks for focus judge test ts. |
| [hosted-goals-view.test.ts](../tests/work-view/hosted-goals-view.test.ts) | Behavior checks for hosted goals view test ts. |
| [hosted-intent.test.ts](../tests/work-view/hosted-intent.test.ts) | Behavior checks for hosted intent test ts. |
| [my-focus.test.ts](../tests/work-view/my-focus.test.ts) | Behavior checks for my focus test ts. |
| [owner-goals-replay.test.ts](../tests/work-view/owner-goals-replay.test.ts) | Behavior checks for owner goals replay test ts. |
| [python.test.ts](../tests/work-view/python.test.ts) | Behavior checks for python test ts. |
| [request-first.test.ts](../tests/work-view/request-first.test.ts) | Behavior checks for request first test ts. |
| [request-groups.test.ts](../tests/work-view/request-groups.test.ts) | Behavior checks for request groups test ts. |
| [request-judge.test.ts](../tests/work-view/request-judge.test.ts) | Behavior checks for request judge test ts. |
| [seed-focus-areas.test.ts](../tests/work-view/seed-focus-areas.test.ts) | Behavior checks for seed focus areas test ts. |
| [skill-scripts-python.test.ts](../tests/work-view/skill-scripts-python.test.ts) | Behavior checks for skill scripts python test ts. |

## tests/worker/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [SearchManager.timeline-anchor.test.ts](../tests/worker/SearchManager.timeline-anchor.test.ts) | Behavior checks for Search Manager. |
| [abort-reason.test.ts](../tests/worker/abort-reason.test.ts) | Behavior checks for abort reason test ts. |
| [claude-credential-fallback.test.ts](../tests/worker/claude-credential-fallback.test.ts) | Behavior checks for claude credential fallback test ts. |
| [claude-observation-batch.test.ts](../tests/worker/claude-observation-batch.test.ts) | Behavior checks for claude observation batch test ts. |
| [claude-provider-assistant-frames.test.ts](../tests/worker/claude-provider-assistant-frames.test.ts) | Behavior checks for claude provider assistant frames test ts. |
| [claude-provider-discovery-backfill.test.ts](../tests/worker/claude-provider-discovery-backfill.test.ts) | Behavior checks for claude provider discovery backfill test ts. |
| [claude-provider-response-pacing.test.ts](../tests/worker/claude-provider-response-pacing.test.ts) | Behavior checks for claude provider response pacing test ts. |
| [claude-provider-spawn-error.test.ts](../tests/worker/claude-provider-spawn-error.test.ts) | Behavior checks for claude provider spawn error test ts. |
| [claude-provider-thinking-reject-flow.test.ts](../tests/worker/claude-provider-thinking-reject-flow.test.ts) | Behavior checks for claude provider thinking reject flow test ts. |
| [claude-provider-work-preservation.test.ts](../tests/worker/claude-provider-work-preservation.test.ts) | Behavior checks for claude provider work preservation test ts. |
| [claude-queued-summary-origin.test.ts](../tests/worker/claude-queued-summary-origin.test.ts) | Behavior checks for claude queued summary origin test ts. |
| [claude-served-model.test.ts](../tests/worker/claude-served-model.test.ts) | Behavior checks for claude served model test ts. |
| [claude-setup-gate.test.ts](../tests/worker/claude-setup-gate.test.ts) | Behavior checks for claude setup gate test ts. |
| [codex-app-server-client.test.ts](../tests/worker/codex-app-server-client.test.ts) | Behavior checks for codex app server client test ts. |
| [codex-app-server-launch.test.ts](../tests/worker/codex-app-server-launch.test.ts) | Behavior checks for codex app server launch test ts. |
| [codex-app-server-pool.test.ts](../tests/worker/codex-app-server-pool.test.ts) | Behavior checks for codex app server pool test ts. |
| [codex-batch-retry-key.test.ts](../tests/worker/codex-batch-retry-key.test.ts) | Behavior checks for codex batch retry key test ts. |
| [codex-deterministic-failures.test.ts](../tests/worker/codex-deterministic-failures.test.ts) | Behavior checks for codex deterministic failures test ts. |
| [codex-failure-booking.test.ts](../tests/worker/codex-failure-booking.test.ts) | Behavior checks for codex failure booking test ts. |
| [codex-gateway-key-lock.test.ts](../tests/worker/codex-gateway-key-lock.test.ts) | Behavior checks for codex gateway key lock test ts. |
| [codex-observation-batch.test.ts](../tests/worker/codex-observation-batch.test.ts) | Behavior checks for codex observation batch test ts. |
| [codex-patch-file-evidence.test.ts](../tests/worker/codex-patch-file-evidence.test.ts) | Behavior checks for codex patch file evidence test ts. |
| [codex-provider.test.ts](../tests/worker/codex-provider.test.ts) | Behavior checks for codex provider test ts. |
| [context-window.test.ts](../tests/worker/context-window.test.ts) | Behavior checks for context window test ts. |
| [database-manager-settings-shape.test.ts](../tests/worker/database-manager-settings-shape.test.ts) | Behavior checks for database manager settings shape test ts. |
| [default-claude-plan-fallback.test.ts](../tests/worker/default-claude-plan-fallback.test.ts) | Behavior checks for default claude plan fallback test ts. |
| [dependency-preflight.test.ts](../tests/worker/dependency-preflight.test.ts) | Behavior checks for dependency preflight test ts. |
| [edit-observer-view.test.ts](../tests/worker/edit-observer-view.test.ts) | Behavior checks for edit observer view test ts. |
| [field-deadline-wire.test.ts](../tests/worker/field-deadline-wire.test.ts) | Behavior checks for field deadline wire test ts. |
| [field-optimizer.test.ts](../tests/worker/field-optimizer.test.ts) | Behavior checks for field optimizer test ts. |
| [gemini-concurrent-pacing.test.ts](../tests/worker/gemini-concurrent-pacing.test.ts) | Behavior checks for gemini concurrent pacing test ts. |
| [gemini-empty-usage.test.ts](../tests/worker/gemini-empty-usage.test.ts) | Behavior checks for gemini empty usage test ts. |
| [gemini-invalid-key-pool.test.ts](../tests/worker/gemini-invalid-key-pool.test.ts) | Behavior checks for gemini invalid key pool test ts. |
| [gemini-location-unsupported.test.ts](../tests/worker/gemini-location-unsupported.test.ts) | Behavior checks for gemini location unsupported test ts. |
| [gemini-pacing-compression.test.ts](../tests/worker/gemini-pacing-compression.test.ts) | Behavior checks for gemini pacing compression test ts. |
| [gemini-served-model.test.ts](../tests/worker/gemini-served-model.test.ts) | Behavior checks for gemini served model test ts. |
| [generator-exit-preserves-work.test.ts](../tests/worker/generator-exit-preserves-work.test.ts) | Behavior checks for generator exit preserves work test ts. |
| [hook-spool-drain.test.ts](../tests/worker/hook-spool-drain.test.ts) | Behavior checks for hook spool drain test ts. |
| [hook-spool-timestamps.test.ts](../tests/worker/hook-spool-timestamps.test.ts) | Behavior checks for hook spool timestamps test ts. |
| [ingest-missing-cwd-project.test.ts](../tests/worker/ingest-missing-cwd-project.test.ts) | Behavior checks for ingest missing cwd project test ts. |
| [ingest-tool-uses-dual-write.test.ts](../tests/worker/ingest-tool-uses-dual-write.test.ts) | Behavior checks for ingest tool uses dual write test ts. |
| [key-pool-next-key-rate-limit.test.ts](../tests/worker/key-pool-next-key-rate-limit.test.ts) | Behavior checks for key pool next key rate limit test ts. |
| [kimi-bookkeeping-skip.test.ts](../tests/worker/kimi-bookkeeping-skip.test.ts) | Behavior checks for kimi bookkeeping skip test ts. |
| [kimi-read-file-path.test.ts](../tests/worker/kimi-read-file-path.test.ts) | Behavior checks for kimi read file path test ts. |
| [llm-timeout.test.ts](../tests/worker/llm-timeout.test.ts) | Behavior checks for llm timeout test ts. |
| [manual-memory-source-scoping.test.ts](../tests/worker/manual-memory-source-scoping.test.ts) | Behavior checks for manual memory source scoping test ts. |
| [model-aliases.test.ts](../tests/worker/model-aliases.test.ts) | Behavior checks for model aliases test ts. |
| [native-memory-revisions.test.ts](../tests/worker/native-memory-revisions.test.ts) | Behavior checks for native memory revisions test ts. |
| [network-failure-diagnostics.test.ts](../tests/worker/network-failure-diagnostics.test.ts) | Behavior checks for network failure diagnostics test ts. |
| [observation-context-compression.test.ts](../tests/worker/observation-context-compression.test.ts) | Behavior checks for observation context compression test ts. |
| [observation-semantic-filters.test.ts](../tests/worker/observation-semantic-filters.test.ts) | Behavior checks for observation semantic filters test ts. |
| [observer-bare-prompt.test.ts](../tests/worker/observer-bare-prompt.test.ts) | Behavior checks for observer bare prompt test ts. |
| [observer-context-overflow.test.ts](../tests/worker/observer-context-overflow.test.ts) | Behavior checks for observer context overflow test ts. |
| [observer-generation-boundary.test.ts](../tests/worker/observer-generation-boundary.test.ts) | Behavior checks for observer generation boundary test ts. |
| [observer-image-strip-live-path.test.ts](../tests/worker/observer-image-strip-live-path.test.ts) | Behavior checks for observer image strip live path test ts. |
| [observer-measured-context.test.ts](../tests/worker/observer-measured-context.test.ts) | Behavior checks for observer measured context test ts. |
| [observer-system-anchor.test.ts](../tests/worker/observer-system-anchor.test.ts) | Behavior checks for observer system anchor test ts. |
| [observer-usage-visibility.test.ts](../tests/worker/observer-usage-visibility.test.ts) | Behavior checks for observer usage visibility test ts. |
| [openai-compat-observation-batch.test.ts](../tests/worker/openai-compat-observation-batch.test.ts) | Behavior checks for openai compat observation batch test ts. |
| [openai-compat-preset-api-route.test.ts](../tests/worker/openai-compat-preset-api-route.test.ts) | Behavior checks for openai compat preset api route test ts. |
| [openai-compat-preset-atlascloud.test.ts](../tests/worker/openai-compat-preset-atlascloud.test.ts) | Behavior checks for openai compat preset atlascloud test ts. |
| [openai-compat-preset-iflytek.test.ts](../tests/worker/openai-compat-preset-iflytek.test.ts) | Behavior checks for openai compat preset iflytek test ts. |
| [openai-compat-preset-minimax.test.ts](../tests/worker/openai-compat-preset-minimax.test.ts) | Behavior checks for openai compat preset minimax test ts. |
| [openai-compat-preset-opencode.test.ts](../tests/worker/openai-compat-preset-opencode.test.ts) | Behavior checks for openai compat preset opencode test ts. |
| [openai-compat-preset-opper.test.ts](../tests/worker/openai-compat-preset-opper.test.ts) | Behavior checks for openai compat preset opper test ts. |
| [openai-compat-preset-orcarouter.test.ts](../tests/worker/openai-compat-preset-orcarouter.test.ts) | Behavior checks for openai compat preset orcarouter test ts. |
| [openai-compat-preset-runcrate.test.ts](../tests/worker/openai-compat-preset-runcrate.test.ts) | Behavior checks for openai compat preset runcrate test ts. |
| [openai-compat-provider.test.ts](../tests/worker/openai-compat-provider.test.ts) | Behavior checks for openai compat provider test ts. |
| [openai-compatible-history-append.test.ts](../tests/worker/openai-compatible-history-append.test.ts) | Behavior checks for openai compatible history append test ts. |
| [openai-compatible-init-response.test.ts](../tests/worker/openai-compatible-init-response.test.ts) | Behavior checks for openai compatible init response test ts. |
| [openai-compatible-summary-tier.test.ts](../tests/worker/openai-compatible-summary-tier.test.ts) | Behavior checks for openai compatible summary tier test ts. |
| [openrouter-config-source.test.ts](../tests/worker/openrouter-config-source.test.ts) | Behavior checks for openrouter config source test ts. |
| [openrouter-empty-content.test.ts](../tests/worker/openrouter-empty-content.test.ts) | Behavior checks for openrouter empty content test ts. |
| [openrouter-extra-body.test.ts](../tests/worker/openrouter-extra-body.test.ts) | Behavior checks for openrouter extra body test ts. |
| [openrouter-messages.test.ts](../tests/worker/openrouter-messages.test.ts) | Behavior checks for openrouter messages test ts. |
| [openrouter-model-fallbacks.test.ts](../tests/worker/openrouter-model-fallbacks.test.ts) | Behavior checks for openrouter model fallbacks test ts. |
| [openrouter-model-unavailable.test.ts](../tests/worker/openrouter-model-unavailable.test.ts) | Behavior checks for openrouter model unavailable test ts. |
| [openrouter-observation-batch.test.ts](../tests/worker/openrouter-observation-batch.test.ts) | Behavior checks for openrouter observation batch test ts. |
| [openrouter-provider.test.ts](../tests/worker/openrouter-provider.test.ts) | Behavior checks for openrouter provider test ts. |
| [openrouter-reasoning-effort.test.ts](../tests/worker/openrouter-reasoning-effort.test.ts) | Behavior checks for openrouter reasoning effort test ts. |
| [openrouter-session-trace.test.ts](../tests/worker/openrouter-session-trace.test.ts) | Behavior checks for openrouter session trace test ts. |
| [openrouter-stream-request.test.ts](../tests/worker/openrouter-stream-request.test.ts) | Behavior checks for openrouter stream request test ts. |
| [openrouter-truncation-warning.test.ts](../tests/worker/openrouter-truncation-warning.test.ts) | Behavior checks for openrouter truncation warning test ts. |
| [overflow-recycle-resume.test.ts](../tests/worker/overflow-recycle-resume.test.ts) | Behavior checks for overflow recycle resume test ts. |
| [pagination-helper-content-session-id.test.ts](../tests/worker/pagination-helper-content-session-id.test.ts) | Behavior checks for pagination helper content session id test ts. |
| [poison-respawn.test.ts](../tests/worker/poison-respawn.test.ts) | Behavior checks for poison respawn test ts. |
| [privacy-check-validator.test.ts](../tests/worker/privacy-check-validator.test.ts) | Behavior checks for privacy check validator test ts. |
| [progressive-memory-search.test.ts](../tests/worker/progressive-memory-search.test.ts) | Behavior checks for progressive memory search test ts. |
| [progressive-search-adversarial.test.ts](../tests/worker/progressive-search-adversarial.test.ts) | Behavior checks for progressive search adversarial test ts. |
| [progressive-search-cases.ts](../tests/worker/progressive-search-cases.ts) | Code module: progressive search cases; exports runProgressiveSearchCases. |
| [provider-classifier-parity.test.ts](../tests/worker/provider-classifier-parity.test.ts) | Behavior checks for provider classifier parity test ts. |
| [provider-classifiers.test.ts](../tests/worker/provider-classifiers.test.ts) | Behavior checks for provider classifiers test ts. |
| [provider-dispatch.test.ts](../tests/worker/provider-dispatch.test.ts) | Behavior checks for provider dispatch test ts. |
| [provider-errors.test.ts](../tests/worker/provider-errors.test.ts) | Behavior checks for provider errors test ts. |
| [provider-key-pool-wiring.test.ts](../tests/worker/provider-key-pool-wiring.test.ts) | Behavior checks for provider key pool wiring test ts. |
| [provider-switch-boundary.test.ts](../tests/worker/provider-switch-boundary.test.ts) | Behavior checks for provider switch boundary test ts. |
| [queued-summary-origin.test.ts](../tests/worker/queued-summary-origin.test.ts) | Behavior checks for queued summary origin test ts. |
| [quota-cooldown-profile.test.ts](../tests/worker/quota-cooldown-profile.test.ts) | Behavior checks for quota cooldown profile test ts. |
| [quota-cooldown.test.ts](../tests/worker/quota-cooldown.test.ts) | Behavior checks for quota cooldown test ts. |
| [quota-fallback-session-routes.test.ts](../tests/worker/quota-fallback-session-routes.test.ts) | Behavior checks for quota fallback session routes test ts. |
| [rate-limit-store.test.ts](../tests/worker/rate-limit-store.test.ts) | Behavior checks for rate limit store test ts. |
| [reactive-quota-abort-reason.test.ts](../tests/worker/reactive-quota-abort-reason.test.ts) | Behavior checks for reactive quota abort reason test ts. |
| [reasoning-budget-exhaustion.test.ts](../tests/worker/reasoning-budget-exhaustion.test.ts) | Behavior checks for reasoning budget exhaustion test ts. |
| [remote-hook-spool.test.ts](../tests/worker/remote-hook-spool.test.ts) | Behavior checks for remote hook spool test ts. |
| [remote-spool-body-limit.test.ts](../tests/worker/remote-spool-body-limit.test.ts) | Behavior checks for remote spool body limit test ts. |
| [retry-after-finite.test.ts](../tests/worker/retry-after-finite.test.ts) | Behavior checks for retry after finite test ts. |
| [retry-never-pay-twice.test.ts](../tests/worker/retry-never-pay-twice.test.ts) | Behavior checks for retry never pay twice test ts. |
| [retry-policy.test.ts](../tests/worker/retry-policy.test.ts) | Behavior checks for retry policy test ts. |
| [search-category-arrays.test.ts](../tests/worker/search-category-arrays.test.ts) | Behavior checks for search category arrays test ts. |
| [search-chroma-summary-prompt-order.test.ts](../tests/worker/search-chroma-summary-prompt-order.test.ts) | Behavior checks for search chroma summary prompt order test ts. |
| [search-manager-date-bounds.test.ts](../tests/worker/search-manager-date-bounds.test.ts) | Behavior checks for search manager date bounds test ts. |
| [search-manager.test.ts](../tests/worker/search-manager.test.ts) | Behavior checks for search manager test ts. |
| [search-read-worker.test.ts](../tests/worker/search-read-worker.test.ts) | Behavior checks for search read worker test ts. |
| [search-type-all.test.ts](../tests/worker/search-type-all.test.ts) | Behavior checks for search type all test ts. |
| [session-buffer-disposal-warnings.test.ts](../tests/worker/session-buffer-disposal-warnings.test.ts) | Behavior checks for session buffer disposal warnings test ts. |
| [session-manager-null-prompt.test.ts](../tests/worker/session-manager-null-prompt.test.ts) | Behavior checks for session manager null prompt test ts. |
| [session-manager-project.test.ts](../tests/worker/session-manager-project.test.ts) | Behavior checks for session manager project test ts. |
| [session-manager-wrapup.test.ts](../tests/worker/session-manager-wrapup.test.ts) | Behavior checks for session manager wrapup test ts. |
| [settings-routes-validation.test.ts](../tests/worker/settings-routes-validation.test.ts) | Behavior checks for settings routes validation test ts. |
| [skill-invoked-telemetry.test.ts](../tests/worker/skill-invoked-telemetry.test.ts) | Behavior checks for skill invoked telemetry test ts. |
| [skip-tools-case-insensitive.test.ts](../tests/worker/skip-tools-case-insensitive.test.ts) | Behavior checks for skip tools case insensitive test ts. |
| [streamed-provider.test.ts](../tests/worker/streamed-provider.test.ts) | Behavior checks for streamed provider test ts. |
| [summarize-teardown-race.test.ts](../tests/worker/summarize-teardown-race.test.ts) | Behavior checks for summarize teardown race test ts. |
| [telegram-wrapup-provider.test.ts](../tests/worker/telegram-wrapup-provider.test.ts) | Behavior checks for telegram wrapup provider test ts. |
| [tier-routing-boundary.test.ts](../tests/worker/tier-routing-boundary.test.ts) | Behavior checks for tier routing boundary test ts. |
| [timeline-input-validation.test.ts](../tests/worker/timeline-input-validation.test.ts) | Behavior checks for timeline input validation test ts. |
| [timeline-project-scope.test.ts](../tests/worker/timeline-project-scope.test.ts) | Behavior checks for timeline project scope test ts. |
| [tree-sitter-cli-provisioning.test.ts](../tests/worker/tree-sitter-cli-provisioning.test.ts) | Behavior checks for tree sitter cli provisioning test ts. |
| [windsurf-workspace-cwd.test.ts](../tests/worker/windsurf-workspace-cwd.test.ts) | Behavior checks for windsurf workspace cwd test ts. |

## tests/worker/agents/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [fallback-error-handler.test.ts](../tests/worker/agents/fallback-error-handler.test.ts) | Behavior checks for fallback error handler test ts. |
| [response-processor-file-evidence-spaces.test.ts](../tests/worker/agents/response-processor-file-evidence-spaces.test.ts) | Behavior checks for response processor file evidence spaces test ts. |
| [response-processor-notes-summary.test.ts](../tests/worker/agents/response-processor-notes-summary.test.ts) | Behavior checks for response processor notes summary test ts. |
| [response-processor-registered-identity.test.ts](../tests/worker/agents/response-processor-registered-identity.test.ts) | Behavior checks for response processor registered identity test ts. |
| [response-processor-wrapup.test.ts](../tests/worker/agents/response-processor-wrapup.test.ts) | Behavior checks for response processor wrapup test ts. |
| [response-processor.test.ts](../tests/worker/agents/response-processor.test.ts) | Behavior checks for response processor test ts. |

## tests/worker/http/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [ingest-skip-bash-patterns.test.ts](../tests/worker/http/ingest-skip-bash-patterns.test.ts) | Behavior checks for ingest skip bash patterns test ts. |
| [session-end-route.test.ts](../tests/worker/http/session-end-route.test.ts) | Behavior checks for session end route test ts. |

## tests/worker/http/routes/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [advisor-routes.test.ts](../tests/worker/http/routes/advisor-routes.test.ts) | Behavior checks for advisor routes test ts. |
| [backup-routes.test.ts](../tests/worker/http/routes/backup-routes.test.ts) | Behavior checks for backup routes test ts. |
| [cloud-sync-routes.test.ts](../tests/worker/http/routes/cloud-sync-routes.test.ts) | Behavior checks for cloud sync routes test ts. |
| [corpus-rebuild-guard.test.ts](../tests/worker/http/routes/corpus-rebuild-guard.test.ts) | Behavior checks for corpus rebuild guard test ts. |
| [corpus-routes-coercion.test.ts](../tests/worker/http/routes/corpus-routes-coercion.test.ts) | Behavior checks for corpus routes coercion test ts. |
| [corpus-routes-sse.test.ts](../tests/worker/http/routes/corpus-routes-sse.test.ts) | Behavior checks for corpus routes sse test ts. |
| [data-import-origin-guard.test.ts](../tests/worker/http/routes/data-import-origin-guard.test.ts) | Behavior checks for data import origin guard test ts. |
| [data-native-prompt-import.test.ts](../tests/worker/http/routes/data-native-prompt-import.test.ts) | Behavior checks for data native prompt import test ts. |
| [data-native-prompts.test.ts](../tests/worker/http/routes/data-native-prompts.test.ts) | Behavior checks for data native prompts test ts. |
| [data-pagination-bounds.test.ts](../tests/worker/http/routes/data-pagination-bounds.test.ts) | Behavior checks for data pagination bounds test ts. |
| [data-routes-coercion.test.ts](../tests/worker/http/routes/data-routes-coercion.test.ts) | Behavior checks for data routes coercion test ts. |
| [data-routes-delete-sync.test.ts](../tests/worker/http/routes/data-routes-delete-sync.test.ts) | Behavior checks for data routes delete sync test ts. |
| [data-routes-import-array-fields.test.ts](../tests/worker/http/routes/data-routes-import-array-fields.test.ts) | Behavior checks for data routes import array fields test ts. |
| [data-routes-import-platform.test.ts](../tests/worker/http/routes/data-routes-import-platform.test.ts) | Behavior checks for data routes import platform test ts. |
| [data-routes-import-session-identity.test.ts](../tests/worker/http/routes/data-routes-import-session-identity.test.ts) | Behavior checks for data routes import session identity test ts. |
| [data-routes-platform-scoping.test.ts](../tests/worker/http/routes/data-routes-platform-scoping.test.ts) | Behavior checks for data routes platform scoping test ts. |
| [data-routes-processing-status.test.ts](../tests/worker/http/routes/data-routes-processing-status.test.ts) | Behavior checks for data routes processing status test ts. |
| [data-routes-project-merge.test.ts](../tests/worker/http/routes/data-routes-project-merge.test.ts) | Behavior checks for data routes project merge test ts. |
| [data-routes-session-delete.test.ts](../tests/worker/http/routes/data-routes-session-delete.test.ts) | Behavior checks for data routes session delete test ts. |
| [data-routes-sessions-catalog.test.ts](../tests/worker/http/routes/data-routes-sessions-catalog.test.ts) | Behavior checks for data routes sessions catalog test ts. |
| [data-routes-tool-uses.test.ts](../tests/worker/http/routes/data-routes-tool-uses.test.ts) | Behavior checks for data routes tool uses test ts. |
| [data-session-catalog-case.test.ts](../tests/worker/http/routes/data-session-catalog-case.test.ts) | Behavior checks for data session catalog case test ts. |
| [data-tied-feed-order.test.ts](../tests/worker/http/routes/data-tied-feed-order.test.ts) | Behavior checks for data tied feed order test ts. |
| [dedup-resolve-route.test.ts](../tests/worker/http/routes/dedup-resolve-route.test.ts) | Behavior checks for dedup resolve route test ts. |
| [hermes-cwd.test.ts](../tests/worker/http/routes/hermes-cwd.test.ts) | Behavior checks for hermes cwd test ts. |
| [log-tail-read-cap.test.ts](../tests/worker/http/routes/log-tail-read-cap.test.ts) | Behavior checks for log tail read cap test ts. |
| [logs-clear-origin-guard.test.ts](../tests/worker/http/routes/logs-clear-origin-guard.test.ts) | Behavior checks for logs clear origin guard test ts. |
| [logs-effective-data-dir.test.ts](../tests/worker/http/routes/logs-effective-data-dir.test.ts) | Behavior checks for logs effective data dir test ts. |
| [logs-lines-validation.test.ts](../tests/worker/http/routes/logs-lines-validation.test.ts) | Behavior checks for logs lines validation test ts. |
| [mcp-toggle-origin-guard.test.ts](../tests/worker/http/routes/mcp-toggle-origin-guard.test.ts) | Behavior checks for mcp toggle origin guard test ts. |
| [mcp-toggle-plugin-root.test.ts](../tests/worker/http/routes/mcp-toggle-plugin-root.test.ts) | Behavior checks for mcp toggle plugin root test ts. |
| [memory-ingest-routes.test.ts](../tests/worker/http/routes/memory-ingest-routes.test.ts) | Behavior checks for memory ingest routes test ts. |
| [memory-routes.test.ts](../tests/worker/http/routes/memory-routes.test.ts) | Behavior checks for memory routes test ts. |
| [memory-save-origin-guard.test.ts](../tests/worker/http/routes/memory-save-origin-guard.test.ts) | Behavior checks for memory save origin guard test ts. |
| [native-prompt-init.test.ts](../tests/worker/http/routes/native-prompt-init.test.ts) | Behavior checks for native prompt init test ts. |
| [restart-page-timeout.browser.test.ts](../tests/worker/http/routes/restart-page-timeout.browser.test.ts) | Behavior checks for restart page timeout. |
| [route-id-validation.test.ts](../tests/worker/http/routes/route-id-validation.test.ts) | Behavior checks for route id validation test ts. |
| [search-by-file-projects.test.ts](../tests/worker/http/routes/search-by-file-projects.test.ts) | Behavior checks for search by file projects test ts. |
| [search-date-bound-validation.test.ts](../tests/worker/http/routes/search-date-bound-validation.test.ts) | Behavior checks for search date bound validation test ts. |
| [search-evidence-growth.test.ts](../tests/worker/http/routes/search-evidence-growth.test.ts) | Behavior checks for search evidence growth test ts. |
| [search-literal-comma-file.test.ts](../tests/worker/http/routes/search-literal-comma-file.test.ts) | Behavior checks for search literal comma file test ts. |
| [search-pagination-validation.test.ts](../tests/worker/http/routes/search-pagination-validation.test.ts) | Behavior checks for search pagination validation test ts. |
| [search-routes-context-preview.test.ts](../tests/worker/http/routes/search-routes-context-preview.test.ts) | Behavior checks for search routes context preview test ts. |
| [search-routes-platform-header.test.ts](../tests/worker/http/routes/search-routes-platform-header.test.ts) | Behavior checks for search routes platform header test ts. |
| [search-routes-semantic-format.test.ts](../tests/worker/http/routes/search-routes-semantic-format.test.ts) | Behavior checks for search routes semantic format test ts. |
| [search-routes-semantic-platform.test.ts](../tests/worker/http/routes/search-routes-semantic-platform.test.ts) | Behavior checks for search routes semantic platform test ts. |
| [search-routes-session-start-sync-pull.test.ts](../tests/worker/http/routes/search-routes-session-start-sync-pull.test.ts) | Behavior checks for search routes session start sync pull test ts. |
| [search-routes-welcome-hint.test.ts](../tests/worker/http/routes/search-routes-welcome-hint.test.ts) | Behavior checks for search routes welcome hint test ts. |
| [session-routes-account-switch.test.ts](../tests/worker/http/routes/session-routes-account-switch.test.ts) | Behavior checks for session routes account switch test ts. |
| [session-routes-cmem-gateway-fallback.test.ts](../tests/worker/http/routes/session-routes-cmem-gateway-fallback.test.ts) | Behavior checks for session routes cmem gateway fallback test ts. |
| [session-routes-deadline-resume.test.ts](../tests/worker/http/routes/session-routes-deadline-resume.test.ts) | Behavior checks for session routes deadline resume test ts. |
| [session-routes-empty-queue-gate.test.ts](../tests/worker/http/routes/session-routes-empty-queue-gate.test.ts) | Behavior checks for session routes empty queue gate test ts. |
| [session-routes-init-checkout.test.ts](../tests/worker/http/routes/session-routes-init-checkout.test.ts) | Behavior checks for session routes init checkout test ts. |
| [session-routes-network-hint.test.ts](../tests/worker/http/routes/session-routes-network-hint.test.ts) | Behavior checks for session routes network hint test ts. |
| [session-routes-provider-switch.test.ts](../tests/worker/http/routes/session-routes-provider-switch.test.ts) | Behavior checks for session routes provider switch test ts. |
| [session-routes-reopen-completed.test.ts](../tests/worker/http/routes/session-routes-reopen-completed.test.ts) | Behavior checks for session routes reopen completed test ts. |
| [session-routes-resume.test.ts](../tests/worker/http/routes/session-routes-resume.test.ts) | Behavior checks for session routes resume test ts. |
| [session-routes-summarize-scope.test.ts](../tests/worker/http/routes/session-routes-summarize-scope.test.ts) | Behavior checks for session routes summarize scope test ts. |
| [settings-routes-body-guard.test.ts](../tests/worker/http/routes/settings-routes-body-guard.test.ts) | Behavior checks for settings routes body guard test ts. |
| [settings-routes-claude-code-path.test.ts](../tests/worker/http/routes/settings-routes-claude-code-path.test.ts) | Behavior checks for settings routes claude code path test ts. |
| [settings-routes-cmem-key-lock.test.ts](../tests/worker/http/routes/settings-routes-cmem-key-lock.test.ts) | Behavior checks for settings routes cmem key lock test ts. |
| [settings-routes-codex-path.test.ts](../tests/worker/http/routes/settings-routes-codex-path.test.ts) | Behavior checks for settings routes codex path test ts. |
| [settings-routes-config-dir.test.ts](../tests/worker/http/routes/settings-routes-config-dir.test.ts) | Behavior checks for settings routes config dir test ts. |
| [settings-routes-file-read-gate.test.ts](../tests/worker/http/routes/settings-routes-file-read-gate.test.ts) | Behavior checks for settings routes file read gate test ts. |
| [settings-routes-quota-fallback.test.ts](../tests/worker/http/routes/settings-routes-quota-fallback.test.ts) | Behavior checks for settings routes quota fallback test ts. |
| [settings-routes-secret-masking.test.ts](../tests/worker/http/routes/settings-routes-secret-masking.test.ts) | Behavior checks for settings routes secret masking test ts. |
| [settings-routes-secrets.test.ts](../tests/worker/http/routes/settings-routes-secrets.test.ts) | Behavior checks for settings routes secrets test ts. |
| [settings-routes-session-start-sources.test.ts](../tests/worker/http/routes/settings-routes-session-start-sources.test.ts) | Behavior checks for settings routes session start sources test ts. |
| [settings-routes-unchanged-values.test.ts](../tests/worker/http/routes/settings-routes-unchanged-values.test.ts) | Behavior checks for settings routes unchanged values test ts. |
| [settings-routes-uvx-path.test.ts](../tests/worker/http/routes/settings-routes-uvx-path.test.ts) | Behavior checks for settings routes uvx path test ts. |
| [settings-routes-work-view-copy.test.ts](../tests/worker/http/routes/settings-routes-work-view-copy.test.ts) | Behavior checks for settings routes work view copy test ts. |
| [settings-save-refreshes-context-settings.test.ts](../tests/worker/http/routes/settings-save-refreshes-context-settings.test.ts) | Behavior checks for settings save refreshes context settings test ts. |
| [setup-extraction-routes.test.ts](../tests/worker/http/routes/setup-extraction-routes.test.ts) | Behavior checks for setup extraction routes test ts. |
| [setup-scan-routes.test.ts](../tests/worker/http/routes/setup-scan-routes.test.ts) | Behavior checks for setup scan routes test ts. |
| [setup-state-routes.test.ts](../tests/worker/http/routes/setup-state-routes.test.ts) | Behavior checks for setup state routes test ts. |
| [sse-bun-client-close.test.ts](../tests/worker/http/routes/sse-bun-client-close.test.ts) | Behavior checks for sse bun client close test ts. |
| [sse-write-isolation.test.ts](../tests/worker/http/routes/sse-write-isolation.test.ts) | Behavior checks for sse write isolation test ts. |
| [teambrain-routes.test.ts](../tests/worker/http/routes/teambrain-routes.test.ts) | Behavior checks for teambrain routes test ts. |
| [tool-use-project-case.test.ts](../tests/worker/http/routes/tool-use-project-case.test.ts) | Behavior checks for tool use project case test ts. |
| [viewer-routes-framing.test.ts](../tests/worker/http/routes/viewer-routes-framing.test.ts) | Behavior checks for viewer routes framing test ts. |
| [viewer-routes-missing-ui.test.ts](../tests/worker/http/routes/viewer-routes-missing-ui.test.ts) | Behavior checks for viewer routes missing ui test ts. |
| [viewer-routes-restart-page.test.ts](../tests/worker/http/routes/viewer-routes-restart-page.test.ts) | Behavior checks for viewer routes restart page test ts. |
| [work-state-routes.test.ts](../tests/worker/http/routes/work-state-routes.test.ts) | Behavior checks for work state routes test ts. |
| [work-view-agent-finished-routes.test.ts](../tests/worker/http/routes/work-view-agent-finished-routes.test.ts) | Behavior checks for work view agent finished routes test ts. |
| [work-view-focus-routes.test.ts](../tests/worker/http/routes/work-view-focus-routes.test.ts) | Behavior checks for work view focus routes test ts. |
| [work-view-routes.test.ts](../tests/worker/http/routes/work-view-routes.test.ts) | Behavior checks for work view routes test ts. |
| [work-view-rules-routes.test.ts](../tests/worker/http/routes/work-view-rules-routes.test.ts) | Behavior checks for work view rules routes test ts. |
| [work-view-suggestions-routes.test.ts](../tests/worker/http/routes/work-view-suggestions-routes.test.ts) | Behavior checks for work view suggestions routes test ts. |
| [work-view-usage-routes.test.ts](../tests/worker/http/routes/work-view-usage-routes.test.ts) | Behavior checks for work view usage routes test ts. |

## tests/worker/knowledge/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [corpus-budget-http.test.ts](../tests/worker/knowledge/corpus-budget-http.test.ts) | Behavior checks for corpus budget http test ts. |
| [corpus-builder.test.ts](../tests/worker/knowledge/corpus-builder.test.ts) | Behavior checks for corpus builder test ts. |
| [corpus-literal-filters.test.ts](../tests/worker/knowledge/corpus-literal-filters.test.ts) | Behavior checks for corpus literal filters test ts. |
| [corpus-observation-scope.test.ts](../tests/worker/knowledge/corpus-observation-scope.test.ts) | Behavior checks for corpus observation scope test ts. |
| [corpus-store-name-validation.test.ts](../tests/worker/knowledge/corpus-store-name-validation.test.ts) | Behavior checks for corpus store name validation test ts. |
| [knowledge-agent-resume-error.test.ts](../tests/worker/knowledge/knowledge-agent-resume-error.test.ts) | Behavior checks for knowledge agent resume error test ts. |
| [knowledge-sdk-outcomes.test.ts](../tests/worker/knowledge/knowledge-sdk-outcomes.test.ts) | Behavior checks for knowledge sdk outcomes test ts. |

## tests/worker/middleware/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [cors-restriction.test.ts](../tests/worker/middleware/cors-restriction.test.ts) | Behavior checks for cors restriction test ts. |
| [origin-policy.test.ts](../tests/worker/middleware/origin-policy.test.ts) | Behavior checks for origin policy test ts. |

## tests/worker/search/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [chroma-category-identity.test.ts](../tests/worker/search/chroma-category-identity.test.ts) | Behavior checks for chroma category identity test ts. |
| [file-date-order.test.ts](../tests/worker/search/file-date-order.test.ts) | Behavior checks for file date order test ts. |
| [search-orchestrator.test.ts](../tests/worker/search/search-orchestrator.test.ts) | Behavior checks for search orchestrator test ts. |
| [search-request-boundary.test.ts](../tests/worker/search/search-request-boundary.test.ts) | Behavior checks for search request boundary test ts. |
| [semantic-empty-filters-http.test.ts](../tests/worker/search/semantic-empty-filters-http.test.ts) | Behavior checks for semantic empty filters http test ts. |
| [semantic-filtered-candidates.test.ts](../tests/worker/search/semantic-filtered-candidates.test.ts) | Behavior checks for semantic filtered candidates test ts. |
| [semantic-pagination.test.ts](../tests/worker/search/semantic-pagination.test.ts) | Behavior checks for semantic pagination test ts. |
| [semantic-persisted-json.test.ts](../tests/worker/search/semantic-persisted-json.test.ts) | Behavior checks for semantic persisted json test ts. |

## tests/worker/search/strategies/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [chroma-search-strategy.test.ts](../tests/worker/search/strategies/chroma-search-strategy.test.ts) | Behavior checks for chroma search strategy test ts. |
| [hybrid-search-strategy.test.ts](../tests/worker/search/strategies/hybrid-search-strategy.test.ts) | Behavior checks for hybrid search strategy test ts. |
| [sqlite-search-strategy.test.ts](../tests/worker/search/strategies/sqlite-search-strategy.test.ts) | Behavior checks for sqlite search strategy test ts. |

## tests/worker/sync/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [canonical-content.test.ts](../tests/worker/sync/canonical-content.test.ts) | Behavior checks for canonical content test ts. |
| [cloud-sync-health.test.ts](../tests/worker/sync/cloud-sync-health.test.ts) | Behavior checks for cloud sync health test ts. |
| [cloud-sync.test.ts](../tests/worker/sync/cloud-sync.test.ts) | Behavior checks for cloud sync test ts. |
| [content-v2-helpers.ts](../tests/worker/sync/content-v2-helpers.ts) | Code module: content v2 helpers; exports TestHubChange, observationChange. |
| [mutation-sites.test.ts](../tests/worker/sync/mutation-sites.test.ts) | Behavior checks for mutation sites test ts. |
| [outbox-growth.test.ts](../tests/worker/sync/outbox-growth.test.ts) | Behavior checks for outbox growth test ts. |
| [prompt-text-clamp.test.ts](../tests/worker/sync/prompt-text-clamp.test.ts) | Behavior checks for prompt text clamp test ts. |
| [session-identity-is-stable.test.ts](../tests/worker/sync/session-identity-is-stable.test.ts) | Behavior checks for session identity is stable test ts. |
| [sync-apply.test.ts](../tests/worker/sync/sync-apply.test.ts) | Behavior checks for sync apply test ts. |
| [sync-client-realtime.test.ts](../tests/worker/sync/sync-client-realtime.test.ts) | Behavior checks for sync client realtime test ts. |
| [sync-client.test.ts](../tests/worker/sync/sync-client.test.ts) | Behavior checks for sync client test ts. |
| [sync-revision-chroma.test.ts](../tests/worker/sync/sync-revision-chroma.test.ts) | Behavior checks for sync revision chroma test ts. |
| [sync-revision-lookup-response.test.ts](../tests/worker/sync/sync-revision-lookup-response.test.ts) | Behavior checks for sync revision lookup response test ts. |
| [sync-revision-reconcile.test.ts](../tests/worker/sync/sync-revision-reconcile.test.ts) | Behavior checks for sync revision reconcile test ts. |
| [work-state-sync.test.ts](../tests/worker/sync/work-state-sync.test.ts) | Behavior checks for work state sync test ts. |

## tests/worker/work-view/

Automated behavior and infrastructure checks.

| File | Responsibility |
| --- | --- |
| [agent-view-attribution.test.mjs](../tests/worker/work-view/agent-view-attribution.test.mjs) | Behavior checks for agent view attribution test mjs. |
| [agent-view-request-identity.test.mjs](../tests/worker/work-view/agent-view-request-identity.test.mjs) | Behavior checks for agent view request identity test mjs. |
| [agent-view-review.test.mjs](../tests/worker/work-view/agent-view-review.test.mjs) | Behavior checks for agent view review test mjs. |
| [agent-view-schema.test.ts](../tests/worker/work-view/agent-view-schema.test.ts) | Behavior checks for agent view schema test ts. |
| [agent-view-subagent.test.mjs](../tests/worker/work-view/agent-view-subagent.test.mjs) | Behavior checks for agent view subagent test mjs. |
| [human-copy-provider.test.mjs](../tests/worker/work-view/human-copy-provider.test.mjs) | Behavior checks for human copy provider test mjs. |
| [human-copy-worker.test.mjs](../tests/worker/work-view/human-copy-worker.test.mjs) | Behavior checks for human copy worker test mjs. |
| [human-copy.test.mjs](../tests/worker/work-view/human-copy.test.mjs) | Behavior checks for human copy test mjs. |
| [request-projection.test.mjs](../tests/worker/work-view/request-projection.test.mjs) | Behavior checks for request projection test mjs. |
| [work-product-git.test.mjs](../tests/worker/work-view/work-product-git.test.mjs) | Behavior checks for work product git test mjs. |
| [work-product.test.mjs](../tests/worker/work-view/work-product.test.mjs) | Behavior checks for work product test mjs. |

## workers/sync-hub/

Cloudflare sync-hub runtime and tests.

| File | Responsibility |
| --- | --- |
| [.dev.vars.example](../workers/sync-hub/.dev.vars.example) | Supporting file: .dev.vars. |
| [.editorconfig](../workers/sync-hub/.editorconfig) | Supporting file: . |
| [.gitignore](../workers/sync-hub/.gitignore) | Supporting file: . |
| [.prettierrc](../workers/sync-hub/.prettierrc) | Supporting file: . |
| [DEPLOY.md](../workers/sync-hub/DEPLOY.md) | Documentation: sync-hub — Deploy Runbook. |
| [METADATA-CONTRACT.md](../workers/sync-hub/METADATA-CONTRACT.md) | Documentation: SyncHub internal metadata contract. |
| [PLAN.md](../workers/sync-hub/PLAN.md) | Documentation: Sync Hub poll-mode projection — ship plan. |
| [bun.lock](../workers/sync-hub/bun.lock) | Pinned dependency resolution for this package. |
| [eslint.config.mjs](../workers/sync-hub/eslint.config.mjs) | Code module: eslint.config. |
| [package.json](../workers/sync-hub/package.json) | Package metadata, dependencies and scripts for sync-hub. |
| [tsconfig.json](../workers/sync-hub/tsconfig.json) | Configuration or structured data: tsconfig. |
| [vitest.config.ts](../workers/sync-hub/vitest.config.ts) | Code module: vitest.config. |
| [worker-configuration.d.ts](../workers/sync-hub/worker-configuration.d.ts) | Type declarations: worker configuration.d. |
| [wrangler.jsonc](../workers/sync-hub/wrangler.jsonc) | Configuration or structured data: wrangler. |

## workers/sync-hub/canary/

Cloudflare sync-hub runtime and tests.

| File | Responsibility |
| --- | --- |
| [canary.ts](../workers/sync-hub/canary/canary.ts) | Code module: canary. |

## workers/sync-hub/src/

Cloudflare sync-hub runtime and tests.

| File | Responsibility |
| --- | --- |
| [canonical-content.ts](../workers/sync-hub/src/canonical-content.ts) | Code module: canonical content; exports CONTENT_BODY_SCHEMA_VERSION, CONTENT_PAYLOAD_SCHEMA_VERSION, CONTENT_BODY_MAX_BYTES, ContentKind, CanonicalKind and 15 more. |
| [control-plane-probe.ts](../workers/sync-hub/src/control-plane-probe.ts) | Code module: control plane probe; exports CONTROL_PLANE_PROBE_CRON, PROBE_STATE_KEY, PROBE_TOKEN, PROBE_USER_ID, PROBE_TIMEOUT_MS and 4 more. |
| [discord.ts](../workers/sync-hub/src/discord.ts) | Code module: discord; exports DiscordEmbedField, DiscordEmbed, postDiscordEmbed. |
| [index.ts](../workers/sync-hub/src/index.ts) | Code module: index; exports AUTH_CACHE_TTL_MIN_SECONDS, AUTH_CACHE_TTL_MAX_SECONDS, AUTH_CACHE_TTL_DEFAULT_SECONDS, POLL_PUSH_DRAIN_MAX_PAGES, resolveForwardOrigin and 11 more. |
| [kill-switch.ts](../workers/sync-hub/src/kill-switch.ts) | Code module: kill switch; exports KILL_SWITCH_KEY, SYNC_MODE_HEADER, SYNC_MODE_POLL, KillSwitchState, __resetKillSwitchCacheForTests and 3 more. |
| [projection-protocol.ts](../workers/sync-hub/src/projection-protocol.ts) | Code module: projection protocol; exports PROJECTION_PROTOCOL_VERSION, PROJECTION_PAGE_MAX_OPS, PROJECTION_PAGE_MAX_BYTES, PROJECTION_FETCH_TIMEOUT_MS, ProjectionWireOp and 3 more. |
| [secrets.d.ts](../workers/sync-hub/src/secrets.d.ts) | Type declarations: secrets.d. |
| [watchdog.ts](../workers/sync-hub/src/watchdog.ts) | Code module: watchdog; exports GRAPHQL_ENDPOINT, WATCHDOG_REQUESTS_ALERT, WATCHDOG_REQUESTS_KILL, WATCHDOG_DURATION_ALERT_GBS, WATCHDOG_DURATION_KILL_GBS and 9 more. |

## workers/sync-hub/src/do/

Cloudflare sync-hub runtime and tests.

| File | Responsibility |
| --- | --- |
| [SyncHub.ts](../workers/sync-hub/src/do/SyncHub.ts) | Code module: Sync Hub; exports MAX_DEVICES_PER_USER, DEVICE_LIMIT_ERROR, PROJECTION_LEASE_MS, PushOp, AckedOp and 17 more. |

## workers/sync-hub/test/

Cloudflare sync-hub runtime and tests.

| File | Responsibility |
| --- | --- |
| [auth.test.ts](../workers/sync-hub/test/auth.test.ts) | Behavior checks for auth test ts. |
| [content-v2-helpers.ts](../workers/sync-hub/test/content-v2-helpers.ts) | Code module: content v2 helpers; exports OperationVector, contractFixture, fixtureOp, observationOp, tombstoneOp. |
| [control-plane-probe.test.ts](../workers/sync-hub/test/control-plane-probe.test.ts) | Behavior checks for control plane probe test ts. |
| [env.d.ts](../workers/sync-hub/test/env.d.ts) | Type declarations: env.d. |
| [forward-origin.test.ts](../workers/sync-hub/test/forward-origin.test.ts) | Behavior checks for forward origin test ts. |
| [kill-switch.test.ts](../workers/sync-hub/test/kill-switch.test.ts) | Behavior checks for kill switch test ts. |
| [miniflare-pro-e2e-node.mjs](../workers/sync-hub/test/miniflare-pro-e2e-node.mjs) | Code module: miniflare pro e2e node; exports createSyncHubMiniflare. |
| [miniflare-pro-e2e-node.ts](../workers/sync-hub/test/miniflare-pro-e2e-node.ts) | Code module: miniflare pro e2e node; exports SyncHubMiniflareHarnessInput, createSyncHubMiniflare. |
| [miniflare-pro-e2e.test.ts](../workers/sync-hub/test/miniflare-pro-e2e.test.ts) | Behavior checks for miniflare pro e2e test ts. |
| [miniflare-pro-e2e.ts](../workers/sync-hub/test/miniflare-pro-e2e.ts) | Code module: miniflare pro e2e; exports SyncHubMiniflareE2EInput, createSyncHubMiniflareE2EOptions. |
| [run-miniflare-pro-e2e.mjs](../workers/sync-hub/test/run-miniflare-pro-e2e.mjs) | Code module: run miniflare pro e2e. |
| [sync-hub.test.ts](../workers/sync-hub/test/sync-hub.test.ts) | Behavior checks for sync hub test ts. |
| [watchdog.test.ts](../workers/sync-hub/test/watchdog.test.ts) | Behavior checks for watchdog test ts. |
| [ws.test.ts](../workers/sync-hub/test/ws.test.ts) | Behavior checks for ws test ts. |
