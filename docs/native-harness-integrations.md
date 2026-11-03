# Native harness integrations

> **Modified by the claude-mem-marian fork:** The Pi and DeepSeek Harness sections are retained as legacy upstream references. Marian rejects new Pi/DSH install targets before installation writes; existing cleanup compatibility remains separate.

Memory provider selection and account sign-in follow the existing installer flow.

## Legacy reference: Pi

```sh
# Upstream command; rejected by Marian before writes:
npx claude-mem install --ide pi
```

In upstream releases, the installer placed a self-contained extension at `~/.pi/agent/extensions/claude-mem/index.js`, with an ESM manifest and readable license notices. `PI_CODING_AGENT_DIR` overrides the agent directory. Existing `pi status` and `pi uninstall` remain for legacy integrations; they do not check the Pi version or verify automatic memory capture.

Pi 0.79.6 provides manual recall only. Automatic capture compatibility is source-reviewed for Pi 1.0.2 and 1.0.4; other or unknown versions need a compatibility check. Check your Pi version and update Pi yourself if needed using the [Pi capture compatibility and update guidance](./pi-native-capture.md#install-and-check-capture-compatibility). A compatible Pi host and Claude-Mem worker use Pi's genuine session ID, capture the prompt before tool results, and summarize once per turn. Worker failures leave Pi usable; excluded projects remain excluded.

Pi provides Smart search by default through `mem_search`, `mem_timeline`, and `mem_get_observations`. Search for IDs, inspect a timeline, and fetch only the useful records. Context injection uses the worker's checkout resolver. Observations are labeled `pi`.

```sh
npx claude-mem pi status
npx claude-mem pi uninstall
```

The installed extension keeps the contributor's MIT text in `LICENSE.txt`, the complete project Apache license and notice in `CLAUDE-MEM-LICENSE.txt` and `CLAUDE-MEM-NOTICE.txt`, and TypeBox's MIT license and version provenance in `TYPEBOX-LICENSE.txt` and `TYPEBOX-PROVENANCE.json`. Marian does not offer Pi installation; it retains direct `pi status` and `pi uninstall`, and cleanup removes only the seven owned files. Uninstall preserves unrelated files.

The recall design and text extraction build on [husniadil/pi-mem](https://github.com/husniadil/pi-mem), by Husni Adil Makmur, under MIT. The original [Pi adapter PR #2532](https://github.com/thedotmack/claude-mem/pull/2532) was closed by its author because native Pi uses HTTP. This integration follows that HTTP design.

## Legacy reference: DeepSeek Harness

The following upstream command is not supported by Marian and is rejected before writes:

```sh
# Upstream command; rejected by Marian before writes:
npx claude-mem install --ide dsh --dsh-profile web
```

Marian does not offer DSH installation. Legacy cleanup reads the managed-profile marker at `<data-dir>/integrations/dsh.json`, runs `dsh plugin --profile <name> remove --workspace-root @claude-mem/dsh` for each recorded profile, removes only the managed watch named `dsh` with `managedBy: claude-mem`, and deletes the marker on full success. A failing profile removal preserves the marker and the watch so cleanup can retry. An upstream-era profile still starts with `dsh web` (the DSH 0.2 default) or another profile. A plugin installed during the upstream era awaits DSH's `agent/created` event to inject checkout context before the first turn. Smart search follows `mem_search` → `mem_timeline` → selected `mem_get_observations`, which offers `mem_search`, `mem_timeline`, `mem_get_observations`, `mem_save`, and `mem_context`.

Automatic capture belongs to the worker's DSH transcript watch under `~/.dsh/sessions` (`DSH_HOME` overrides the directory), using the configured `CLAUDE_MEM_TRANSCRIPTS_CONFIG_PATH`. Current and legacy tool results use the real session-header ID, which survives a watcher restart, and `turn/end` summarizes once per turn. Existing user-managed DSH watches remain authoritative and are preserved during uninstall; the DSH schema entry stays in the shared configuration because user watches may use it.

The plugin uses the worker's configured address and timeout. `DSH_MEM_BASE_URL` or the plugin's `baseUrl` configuration can point recall at another worker; a remote address does not auto-start a local worker. Remote recall does not change the local transcript watch.

This integration adapts [Bleed00/dsh-claude-mem](https://github.com/Bleed00/dsh-claude-mem), by Bleed00, under Apache-2.0. Its complete project Apache license, Bleed00 attribution, project notice, and all eight bundled dependency licenses ship with the local package passed to DSH.

## Diagnostics and limits

Use `npx claude-mem doctor` if the worker is unavailable. Pi and DSH honor persisted worker settings and environment overrides. A missing native bundle or failed DSH package-manager command was reported as an install failure by the upstream installer. Marian does not offer the new-install retry path. Explicitly disabled transcript capture is preserved and reported.

In the upstream integration, Pi and DSH required `--runtime worker`; the installer rejected their combination with server runtime before copying files. Full `npx claude-mem uninstall` remains available for legacy cleanup, removing the managed extension, DSH plugin from recorded profiles, and managed watch while retaining unrelated host settings.

Source changes require `npm run build` before packing or installing from a checkout. Native bundles are produced by the release build and included in the npm package. The build preflights attribution before output writes, checks the exact supported TypeBox 1.1.24 package and full license, and bundles that same resolved entry. Update the dependency pin and full notice together for a later TypeBox version. Marketplace copies include the current root `LICENSE` and `NOTICE` pair.
