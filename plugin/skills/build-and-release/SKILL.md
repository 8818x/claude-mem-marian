---
name: build-and-release
description: (Retained upstream instruction) Chains build, merge, and release. The Marian fork does not authorize releases, publishes, or merges; see the fence in the version-bump skill.
---

# Build and Release

> **Modified by the claude-mem-marian fork:** the build-merge-release flow is fenced for this fork; publishing and merging are forbidden. Upstream attribution is retained.

**Fence.** The Marian fork does not perform releases, publishes, or merges. The upstream
flow this skill chained (build, merge the ready PR, then `release`) is retained as
upstream instruction and must not be executed in the Marian fork. Publishing to the npm
package `claude-mem` is forbidden. Use the `version-bump` skill only for version
alignment.

## Upstream reference (do not execute in the Marian fork)

Deploy a subagent to fully automate a coding session as if it were typing in it itself.

Use these claude-mem skills in order:

1. `build`
2. Merge the ready PR and continue from updated main.
3. `release`

Task: $ARGUMENTS
