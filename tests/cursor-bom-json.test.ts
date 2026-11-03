import { test, expect } from 'bun:test';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readCursorRegistry, unregisterCursorProject } from '../src/utils/cursor-utils';

function withFile(run: (file: string) => void) {
  const dir = mkdtempSync(join(tmpdir(), 'cursor-bom-'));
  try { run(join(dir, 'cursor-projects.json')); } finally { rmSync(dir, { recursive: true, force: true }); }
}

// Decision 08: the MCP-install writer retired; the retained registry helpers
// keep their BOM tolerance (parse) for legacy cursor-projects.json files.
test('unregistering a workspace preserves BOM-prefixed existing registrations', () => withFile(file => {
  const existing = { old: { workspacePath: '/old', installedAt: '2026-01-01T00:00:00Z' }, keep: { workspacePath: '/keep', installedAt: '2026-01-01T00:00:00Z' } };
  writeFileSync(file, '﻿' + JSON.stringify(existing));
  unregisterCursorProject(file, 'old');
  const registry = readCursorRegistry(file);
  expect(registry.old).toBeUndefined();
  expect(registry.keep).toEqual(existing.keep);
}));

test('reading a BOM-prefixed registry returns parsed entries', () => withFile(file => {
  const existing = { old: { workspacePath: '/old', installedAt: '2026-01-01T00:00:00Z' } };
  writeFileSync(file, '﻿' + JSON.stringify(existing));
  const registry = readCursorRegistry(file);
  expect(registry).toEqual(existing);
}));
