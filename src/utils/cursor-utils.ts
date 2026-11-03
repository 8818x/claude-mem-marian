// Modified by the claude-mem-marian fork: Cursor registration and context/MCP writers were retired with the host installer; registry cleanup helpers remain. Upstream attribution is retained.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { logger } from './logger.js';
import { parseJsonWithBom } from '../shared/atomic-json.js';

export interface CursorProjectRegistry {
  [projectName: string]: {
    workspacePath: string;
    installedAt: string;
  };
}

export function readCursorRegistry(registryFile: string): CursorProjectRegistry {
  try {
    if (!existsSync(registryFile)) return {};
    return parseJsonWithBom<CursorProjectRegistry>(readFileSync(registryFile, 'utf-8'));
  } catch (error) {
    logger.error('CONFIG', 'Failed to read Cursor registry, using empty registry', {
      file: registryFile,
      error: error instanceof Error ? error.message : String(error)
    });
    return {};
  }
}

export function writeCursorRegistry(registryFile: string, registry: CursorProjectRegistry): void {
  const dir = join(registryFile, '..');
  mkdirSync(dir, { recursive: true });
  writeFileSync(registryFile, JSON.stringify(registry, null, 2));
}

export function unregisterCursorProject(registryFile: string, projectName: string): void {
  const registry = readCursorRegistry(registryFile);
  if (registry[projectName]) {
    delete registry[projectName];
    writeCursorRegistry(registryFile, registry);
  }
}
