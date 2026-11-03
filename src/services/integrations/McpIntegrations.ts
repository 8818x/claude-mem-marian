// Modified by the claude-mem-marian fork: the MCP-only host mappings and installer factory were retired; Goose cleanup and shared MCP helpers remain. Upstream attribution is retained.

import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { getNodeAbsolutePath } from './install-paths.js';
import { readJsonSafe } from '../../utils/json-utils.js';
import { stripUtf8Bom } from '../../shared/atomic-json.js';

export const PLACEHOLDER_CONTEXT = `# claude-mem: Cross-Session Memory

*No context yet. Complete your first session and context will appear here.*

Use claude-mem's MCP search tools for manual memory queries.`;

export function buildMcpServerEntry(mcpServerPath: string): { command: string; args: string[] } {
  return {
    command: getNodeAbsolutePath(),
    args: [mcpServerPath],
  };
}

export function writeMcpJsonConfig(
  configFilePath: string,
  mcpServerPath: string,
  serversKeyName: string = 'mcpServers',
): void {
  const parentDirectory = path.dirname(configFilePath);
  mkdirSync(parentDirectory, { recursive: true });

  const existingConfig = readJsonSafe<Record<string, any>>(configFilePath, {});

  if (!existingConfig[serversKeyName]) {
    existingConfig[serversKeyName] = {};
  }

  existingConfig[serversKeyName]['claude-mem'] = buildMcpServerEntry(mcpServerPath);

  writeFileSync(configFilePath, JSON.stringify(existingConfig, null, 2) + '\n');
}

function getGooseConfigPath(): string {
  return path.join(homedir(), '.config', 'goose', 'config.yaml');
}

function leadingSpaceCount(line: string): number {
  return line.length - line.trimStart().length;
}

function isYamlContentLine(line: string): boolean {
  return line.trim() !== '' && !line.trimStart().startsWith('#');
}

/** What follows `key:` when `line` is that key at `indent`, written plain or quoted; null for any other line. */
function yamlKeyLineRest(line: string, indent: string, key: string): string | null {
  const match = new RegExp(`^${indent}(["']?)${key}\\1:`).exec(line);
  if (!match) return null;
  const rest = line.slice(match[0].length);
  return rest === '' || /^\s/.test(rest) ? rest : null;
}

interface GooseExtensionsSpan {
  lines: string[];
  /** Line of the top-level `extensions:` key. */
  header: number;
  /** First line after the mapping (the next top-level key, or end of file). */
  end: number;
  indent: string;
  /** The claude-mem entry's [start, end) lines, or null when there is none. */
  claudeMemEntry: [number, number] | null;
}

/** Where the top-level `extensions` mapping and its claude-mem entry sit in `content`; null when there is no such mapping. */
function findGooseExtensionsSpan(content: string): GooseExtensionsSpan | null {
  const lines = content.split('\n');
  const header = lines.findIndex(line => yamlKeyLineRest(line, '', 'extensions') !== null);
  if (header === -1) return null;
  if (isYamlContentLine(yamlKeyLineRest(lines[header], '', 'extensions')!)) {
    throw new Error('Goose config.yaml sets extensions inline; write it as a block mapping and try again');
  }

  // The mapping runs to the next top-level key; entries keep the indent of those already there.
  let end = header + 1;
  while (end < lines.length && !(isYamlContentLine(lines[end]) && leadingSpaceCount(lines[end]) === 0)) end++;
  const firstEntry = lines.slice(header + 1, end).find(isYamlContentLine);
  const indent = ' '.repeat(firstEntry ? leadingSpaceCount(firstEntry) : 2);

  const existing = lines.findIndex((line, index) => index > header && index < end && yamlKeyLineRest(line, indent, 'claude-mem') !== null);
  if (existing === -1) return { lines, header, end, indent, claudeMemEntry: null };
  // The entry runs to the next sibling; blank lines and comments just before it stay with it.
  let existingEnd = existing + 1;
  while (existingEnd < end && !(isYamlContentLine(lines[existingEnd]) && leadingSpaceCount(lines[existingEnd]) <= indent.length)) {
    existingEnd++;
  }
  while (existingEnd > existing + 1 && !isYamlContentLine(lines[existingEnd - 1])) existingEnd--;
  return { lines, header, end, indent, claudeMemEntry: [existing, existingEnd] };
}

/**
 * `content` without the claude-mem entry under `extensions` (and without the
 * `extensions:` key itself when nothing else is left in it); null when there
 * is no entry to remove.
 */
function removeGooseExtension(content: string): string | null {
  const span = findGooseExtensionsSpan(content);
  if (!span?.claudeMemEntry) return null;
  const { lines, header, end, claudeMemEntry: [entryStart, entryEnd] } = span;
  const remaining = [...lines.slice(0, entryStart), ...lines.slice(entryEnd)];
  const removedCount = entryEnd - entryStart;
  const mappingStillHasEntries = remaining.slice(header + 1, end - removedCount).some(isYamlContentLine);
  if (!mappingStillHasEntries) remaining.splice(header, 1);
  return remaining.join('\n');
}

/** Remove claude-mem from Goose's extensions so Goose stops launching a deleted MCP server. Returns 0 when an entry was removed. */
export function uninstallGooseMcpIntegration(configPath: string = getGooseConfigPath()): number {
  if (!existsSync(configPath)) return 1;
  const updated = removeGooseExtension(stripUtf8Bom(readFileSync(configPath, 'utf-8')));
  if (updated === null) return 1;
  writeFileSync(configPath, updated);
  console.log(`  Removed claude-mem from the Goose extensions of: ${configPath}`);
  return 0;
}

// The MCP-only host mapping table was retired with its last entry (Warp).
// Antigravity graduated from an MCP-only integration to a full hooks+MCP
// installer — AntigravityCliHooksInstaller.ts owns its install/uninstall
// end-to-end, reusing writeMcpJsonConfig/buildMcpServerEntry from this file
// for its MCP half.
