> [!NOTE]
> Read [MARIAN.md](MARIAN.md) for this fork's patch history. The first patch is **Maria-1**.
> Modified by the claude-mem-marian fork. Upstream attribution is retained.

Read the [repository guide](REPOSITORY-GUIDE.md) for folder responsibilities and the [complete file catalog](docs/repository-files.md). My Work and Classic Viewer include the four [Catppuccin](https://github.com/catppuccin/catppuccin) themes: Latte, Frappé, Macchiato and Mocha.

<p align="center">
  <img src="docs/public/marian-edition-logo.png" width="900" alt="claude-mem — Maria(n)-edition">
</p>

# Marian

**Persistent agent memory with fewer OpenRouter requests and more reliable work tracking.**

Marian is a fork of [claude-mem](https://github.com/thedotmack/claude-mem), based on upstream **v15.5.0**. It retains the existing memory format while improving observation batching, session-based agent identity, rejected-rule Undo, and automatic refresh.

## What Marian changes

- **Batch observations:** up to eight pending tool observations share one OpenRouter generation request by default. Each input keeps its own result, ordering and provenance.
- **Keep memories independent:** queue items are acknowledged after persistence. Malformed output and retries preserve unresolved work without duplicating saved observations.
- **Record the right agent:** requests load agent identity from their associated sessions, including historical sessions, without increasing the observation limit or guessing from task names.
- **Restore rejected rules:** rejected suggestions remain available for the existing Undo action.
- **Complete refreshes:** Claude returns structured story output, Windows npm shims resolve to the official native executable, and failed final stages remain eligible for retry.

## Supported agents

The maintained installation targets are **Claude Code** and **Codex CLI**. Standalone packages, builders and dedicated setup tests for retired clients are no longer shipped. Shared memory code, historical record readers and LLM providers remain available.

Original license, NOTICE and provenance files from retired integrations are retained in [docs/upstream-notices](docs/upstream-notices).

## Install this fork

You need Git, Node.js **20.19.x or later in the 20.x line, or 22.12+**, and Bun **1.1.31+**. For Claude Code, use **2.1.139+** so hooks receive their arguments. See [package.json](package.json) for build dependencies.

### 1. Clone and build Marian

```sh
git clone --branch main https://github.com/8818x/claude-mem-marian.git marian
cd marian
npm install
npm run build
```

### 2. Register it with Claude Code

From the built `marian` directory, run:

```sh
claude plugin marketplace add .
claude plugin install claude-mem@thedotmack
```

The marketplace keeps its upstream identifier, `thedotmack`; registering the **local directory** makes Claude load your built Marian fork. This also changes an existing upstream marketplace registration to the local source. Keep the checkout at that path.

> [!IMPORTANT]
> Build before installing. `npx claude-mem install` downloads the upstream npm package and is not the installation command for this fork. GitHub marketplace installation alone can load old generated files from this source repository.

### 3. Apply changes to an existing installation

Back up `~/.claude/plugins/marketplaces/thedotmack/`, the installed `claude-mem` cache, and `~/.claude-mem/` before replacing an existing install. The database and provider settings live separately in `~/.claude-mem/`.

```sh
npm run build-and-sync
```

This builds, mirrors the checkout into the existing marketplace/cache and restarts the worker. Mirroring replaces matching files and removes stale distribution files. Review the backup first. `claude plugin update` can skip local changes when the version number is unchanged; use build-and-sync for this source workflow.

In an existing Claude Code conversation, run `/reload-plugins`, or start a new session. Open [My Work](http://127.0.0.1:37777/) or [Classic Viewer](http://127.0.0.1:37777/viewer.html). The default port is **37777**; use your configured worker port if different.

Verify the installation:

```sh
claude plugin list
claude plugin marketplace list
curl http://127.0.0.1:37777/api/health
```

The plugin should be enabled, the marketplace should point at your local Marian checkout, and health should report `status: "ok"`. Both web apps offer **Latte, Frappé, Macchiato and Mocha**, with **Mocha as the default**. An explicit saved theme is preserved.

### Codex CLI host

After the same clone/build step, register the local marketplace with a Codex CLI version that supports plugins:

```sh
codex plugin marketplace add .
codex plugin add claude-mem@claude-mem-local
```

Start a new Codex session to load it. The Codex marketplace name is `claude-mem-local`; Claude Code uses `thedotmack`. Agent integration and the model provider are separate choices. See the [Codex provider guide](docs/codex-provider.md) and [development guide](docs/public/development.mdx) for further configuration.

## Configure batching

Agent installations and LLM providers are independent. To use OpenRouter through the **OpenAI-compatible** provider, configure the OpenAI-compatible settings rather than the dedicated OpenRouter provider's settings:

```json
{
  "CLAUDE_MEM_PROVIDER": "openai-compatible",
  "CLAUDE_MEM_OPENAI_COMPAT_PRESET": "custom",
  "CLAUDE_MEM_OPENAI_COMPAT_BASE_URL": "https://openrouter.ai/api/v1",
  "CLAUDE_MEM_OPENAI_COMPAT_MODEL": "cohere/north-mini-code:free",
  "CLAUDE_MEM_OPENAI_COMPAT_OBSERVATION_BATCH_SIZE": "8"
}
```

Enter your OpenRouter key in the local OpenAI-compatible settings. Keep credentials out of Git.

| Route | Batch setting | Default | Valid values |
| --- | --- | --- | --- |
| OpenAI-compatible, including an OpenRouter base URL | `CLAUDE_MEM_OPENAI_COMPAT_OBSERVATION_BATCH_SIZE` | `1` | Integers `1–32` |
| Dedicated OpenRouter provider | `CLAUDE_MEM_OPENROUTER_OBSERVATION_BATCH_SIZE` | `8` | Integers `1–32` |

Size `8` permits 14 ordinary pending observations to use **two requests: 8 + 6**. Size `1` preserves one event per request. Context budgets, compression and session boundaries can produce smaller batches. OpenAI-compatible uses upstream's batching; the dedicated OpenRouter route uses Marian's independently mapped result envelope.

See the [OpenAI-compatible guide](docs/public/usage/openai-compatible-provider.mdx), [OpenRouter guide](docs/public/usage/openrouter-provider.mdx) and [configuration reference](docs/public/configuration.mdx) for details.

## Verification

Maria-1 passed **667 relevant tests across 47 files**, **92 My Work UI tests**, root/viewer typechecks, both repository lint checks and the full build. See [the patch record](MARIAN.md#maria-1--2026-10-29) for scope and verification limits.

## Compatibility

Marian preserves existing databases and settings files. Anthropic/Claude, Codex, Gemini and other providers keep their upstream observation behavior.

> [!IMPORTANT]
> On affected native Windows installations, Codex cannot start this refresh task's split read profile: unelevated rejects split reads, elevated requires root read access, and MXC may be unavailable. Marian keeps the restrictions and reports the limitation; use a logged-in Claude Code agent for Refresh on those hosts. This does not change the configured observation provider.

For setup problems, consult [troubleshooting](docs/public/troubleshooting.mdx). Upstream authorship, Apache-2.0 terms and notices remain in [LICENSE](LICENSE) and [NOTICE](NOTICE).
