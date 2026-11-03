---
name: version-bump
description: Verify and keep every Marian fork version field aligned to the canonical source package.json. Plain X.Y.Z semver only; Maria-N fork patch tags; this is an alignment workflow, never a release or publish workflow.
---

# Version alignment (Marian fork)

> **Modified by the claude-mem-marian fork:** rewritten from the upstream release/publish workflow to the fork's version-alignment contract (Decision 13). Upstream attribution is retained.

Keep the fork's version fields aligned to the canonical source. This is an alignment
workflow. It does not release, publish, or tag. Governing decision:
`tasks/decisions/decision-13-fork-version-and-plugin-identity-contract.md`.

## Contract

- Canonical version: root `package.json#version` (currently `15.5.0`, upstream baseline v15.5.0).
  Plain semver `X.Y.Z` only. No prerelease or build-metadata suffixes.
- Synchronization is one-way at build step 1. `npm run build` runs
  `scripts/sync-plugin-manifests.js`, which propagates name, version, description,
  homepage, repository, license, keywords, and author from `package.json` into the four
  Claude/Codex manifests and the `claude-mem` entry of `.claude-plugin/marketplace.json`.
  The `bugs` field is not propagated and the sync script must not be extended.
- Version-bearing shipped manifests: the five `plugin.json`/`package.json` manifests in
  the npm `files` list plus the maintained marketplace entry. The consistency test
  `tests/infrastructure/version-consistency.test.ts` enforces `/^\d+\.\d+\.\d+$/` and
  manifest equality, including `plugin/package.json`.
- Never hand-edit a generated manifest. The next build overwrites it. Change
  `package.json` first, then run the build.

## Alignment procedure

1. Read `package.json#version`.
2. Check every version-bearing field matches it:
   ```bash
   V=$(node -p "require('./package.json').version")
   git grep -n "\"version\": \"$V\"" -- package.json plugin/package.json \
     .claude-plugin/plugin.json .codex-plugin/plugin.json \
     plugin/.claude-plugin/plugin.json plugin/.codex-plugin/plugin.json
   grep -n "\"version\": \"$V\"" .claude-plugin/marketplace.json
   ```
   Six JSON hits plus one marketplace hit is aligned. A miss means drift, and the fix
   depends on which copy drifted. For the four generated manifests or the marketplace
   entry: change `package.json` (the canonical file) and rebuild, never the copies. For
   `plugin/package.json`, which is hand-maintained and outside the sync's target list:
   edit that file directly to match the canonical version. Never change the canonical
   version to match a drifted copy.
3. Run the consistency tests:
   ```bash
   bun test tests/infrastructure/version-consistency.test.ts \
     tests/scripts/sync-plugin-manifests.test.ts tests/plugin-version-check.test.ts
   ```
4. Build checkout-local to prove the sync: `npm run build`. If a Windows
   "user-mapped section open" error hits a `plugin/scripts/*.cjs` output, it is the
   documented transient file-lock class: retry the build once. Do not stop or restart
   any worker.
5. When the shipped version must be proven, pack into a disposable directory and never
   publish:
   ```bash
   npm pack --ignore-scripts --pack-destination "$TEMP/some-new-dir"
   ```
   The tarball name carries the version; extract and check the shipped manifest
   versions and the marketplace entry.
6. A numeric version bump requires a new explicit decision. This skill must not choose
   one. If drift needs a bump to resolve, stop and record the blocker.

## Prohibited actions

The Marian fork never performs these, and this skill must never instruct them:

- `npm run release`, `release:patch`, `release:minor`, `release:major` (these run `np`,
  which publishes to the npm package `claude-mem`, which belongs to upstream).
- Direct `npm publish`, and any rerun of the publish workflow.
- Any `v*` tag creation or push. Every `v*` tag push triggers
  `.github/workflows/npm-publish.yml`, retained upstream automation that attempts an
  npm publish. Fencing it here does not disable the workflow.
- `gh release create`, and any push, merge, or deploy as part of a release.
- `npm run build-and-sync -- --apply`, `npm run sync-marketplace -- --apply`, and
  worker restarts with `--apply`. These are explicit-intent local integration
  operations, not build verification.
- Manufacturing version semantics unsupported by actual tooling.

Fork tags, when a separately authorized release process exists, are `Maria-N` only.

## Checklist

- [ ] `package.json#version` is plain `X.Y.Z` and equals the approved value.
- [ ] All six JSON fields plus the marketplace entry match the canonical version.
- [ ] `npm run build` succeeds checkout-local and the manifests are byte-stable.
- [ ] Consistency tests pass.
- [ ] No `v*` tag exists locally (`git tag -l 'v*'` returns nothing).
- [ ] Nothing was published, released, tagged, pushed, or merged by this workflow.
