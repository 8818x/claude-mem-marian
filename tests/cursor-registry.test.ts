import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  readCursorRegistry,
  writeCursorRegistry,
  unregisterCursorProject
} from '../src/utils/cursor-utils';

// Decision 08: project registration retired with active hook support. Registry
// coverage keeps the cleanup-side helpers (read/write/unregister); setups that
// used the retired registerCursorProject write explicit fixture JSON instead.
describe('Cursor Project Registry (cleanup-side helpers)', () => {
  let tempDir: string;
  let registryFile: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `cursor-registry-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tempDir, { recursive: true });
    registryFile = join(tempDir, 'cursor-projects.json');
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('readCursorRegistry', () => {
    it('returns empty object when registry file does not exist', () => {
      const registry = readCursorRegistry(registryFile);
      expect(registry).toEqual({});
    });

    it('returns empty object when registry file is corrupt JSON', () => {
      writeFileSync(registryFile, 'not valid json {{{');
      const registry = readCursorRegistry(registryFile);
      expect(registry).toEqual({});
    });

    it('returns parsed registry when file exists', () => {
      const expected = {
        'my-project': {
          workspacePath: '/home/user/projects/my-project',
          installedAt: '2025-01-01T00:00:00.000Z'
        }
      };
      writeFileSync(registryFile, JSON.stringify(expected));

      const registry = readCursorRegistry(registryFile);
      expect(registry).toEqual(expected);
    });
  });

  describe('writeCursorRegistry', () => {
    it('creates the registry file when missing', () => {
      writeCursorRegistry(registryFile, {
        'new-project': { workspacePath: '/path/to/project', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      expect(existsSync(registryFile)).toBe(true);
    });

    it('stores projects with workspacePath and installedAt', () => {
      writeCursorRegistry(registryFile, {
        'project-a': { workspacePath: '/path/a', installedAt: '2025-01-01T00:00:00.000Z' },
        'project-b': { workspacePath: '/path/b', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      const registry = readCursorRegistry(registryFile);
      expect(Object.keys(registry)).toHaveLength(2);
      expect(registry['project-a'].workspacePath).toBe('/path/a');
      expect(registry['project-b'].workspacePath).toBe('/path/b');
    });

    it('handles special characters in project name', () => {
      const projectName = 'my-project_v2.0 (beta)';
      writeCursorRegistry(registryFile, {
        [projectName]: { workspacePath: '/path/to/project', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      const registry = readCursorRegistry(registryFile);
      expect(registry[projectName]).toBeDefined();
      expect(registry[projectName].workspacePath).toBe('/path/to/project');
    });

    it('stores registry as pretty-printed JSON', () => {
      writeCursorRegistry(registryFile, {
        test: { workspacePath: '/path', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      const content = readFileSync(registryFile, 'utf-8');
      expect(content).toContain('\n');
      expect(content).toContain('  ');
    });

    it('registry file is valid JSON that can be read by other tools', () => {
      writeCursorRegistry(registryFile, {
        'project-1': { workspacePath: '/path/1', installedAt: '2025-01-01T00:00:00.000Z' },
        'project-2': { workspacePath: '/path/2', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      const parsed = JSON.parse(readFileSync(registryFile, 'utf-8'));

      expect(parsed).toHaveProperty('project-1');
      expect(parsed).toHaveProperty('project-2');
    });
  });

  describe('unregisterCursorProject', () => {
    it('removes only the specified project and keeps unrelated workspaces', () => {
      writeCursorRegistry(registryFile, {
        'project-a': { workspacePath: '/path/a', installedAt: '2025-01-01T00:00:00.000Z' },
        'project-b': { workspacePath: '/path/b', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      unregisterCursorProject(registryFile, 'project-a');

      const registry = readCursorRegistry(registryFile);
      expect(registry['project-a']).toBeUndefined();
      expect(registry['project-b']).toBeDefined();
    });

    it('does nothing when unregistering non-existent project', () => {
      writeCursorRegistry(registryFile, {
        existing: { workspacePath: '/path', installedAt: '2025-01-01T00:00:00.000Z' }
      });

      unregisterCursorProject(registryFile, 'non-existent');

      const registry = readCursorRegistry(registryFile);
      expect(registry['existing']).toBeDefined();
    });

    it('handles unregister when registry file does not exist', () => {
      unregisterCursorProject(registryFile, 'any-project');

      expect(existsSync(registryFile)).toBe(false);
    });
  });
});
