---
name: release
description: (Retained upstream instruction) Chains version-bump and childhood. The Marian fork does not authorize releases or publishes; see the fence in the version-bump skill.
---

# Release

> **Modified by the claude-mem-marian fork:** the release flow is fenced for this fork; publishing is forbidden. Upstream attribution is retained.

**Fence.** The Marian fork does not perform releases or publishes. The upstream release
flow this skill chained (`version-bump`'s upstream workflow and `childhood`) is retained
as upstream instruction and must not be executed in the Marian fork. Publishing to the
npm package `claude-mem` is forbidden. Use the `version-bump` skill only for version
alignment.

## Upstream reference (do not execute in the Marian fork)

Deploy a subagent to fully automate a coding session as if it were typing in it itself.

Use these claude-mem skills in order:

1. `version-bump`
2. `childhood`

Task: $ARGUMENTS
