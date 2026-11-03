import { describe, it, expect } from 'bun:test';
import { readFileSync, mkdtempSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { parseJsonWithBom } from '../src/shared/atomic-json.js';
import { uninstallWindsurfHooks } from '../src/services/integrations/WindsurfHooksInstaller.js';

// Decision 10: Windsurf installation is retired; cleanup remains. The retained
// hooks.json reader must stay BOM-safe (a hooks.json rewritten by PowerShell
// 5.1 or a Windows editor carries a UTF-8 BOM, which blind JSON.parse rejects),
// and cleanup must tolerate a BOM-prefixed file through its explicit-path seam.
const SOURCE = readFileSync(
  join(import.meta.dir, '../src/services/integrations/WindsurfHooksInstaller.ts'),
  'utf8',
);

describe("Windsurf cleanup reads Windsurf's hooks.json", () => {
  it('never parses that file with a BOM-blind JSON.parse', () => {
    expect(SOURCE).not.toMatch(/JSON\.parse\(\s*readFileSync\(\s*WINDSURF_HOOKS_JSON_PATH/);
  });

  it('keeps the retained cleanup path on the BOM-aware parameterized reader', () => {
    expect(SOURCE).toContain('parseJsonWithBom<Partial<WindsurfHooksJson>>(readFileSync(hooksPath');
  });

  it('that reader accepts what JSON.parse rejects', () => {
    const bommed = '﻿' + JSON.stringify({ hooks: { afterFileEdit: [] } });
    expect(() => JSON.parse(bommed)).toThrow();
    expect(parseJsonWithBom<{ hooks: Record<string, unknown> }>(bommed).hooks).toBeDefined();
  });

  it('cleans a BOM-prefixed hooks.json through the explicit-path seam, preserving unrelated fields', () => {
    const root = mkdtempSync(join(tmpdir(), 'windsurf-bom-cleanup-'));
    try {
      const hooksPath = join(root, 'hooks.json');
      writeFileSync(hooksPath, '﻿' + JSON.stringify({
        version: 1,
        hooks: {
          post_run_command: [{ command: 'bun worker-service.cjs hook windsurf observation' }],
        },
        unrelatedTopLevel: 'keep me',
      }));

      const result = uninstallWindsurfHooks({
        hooksPath,
        registryPath: join(root, 'windsurf-projects.json'),
        workspaceRoots: [join(root, 'workspace')],
      });

      expect(result).toBe(0);
      expect(existsSync(hooksPath)).toBe(true);
      const remaining = parseJsonWithBom<Record<string, unknown>>(readFileSync(hooksPath, 'utf-8'));
      expect(remaining.unrelatedTopLevel).toBe('keep me');
      expect(remaining.hooks).toBeUndefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
