// Modified by the claude-mem-marian fork: the OpenClaw plugin installer is retired; legacy uninstall cleanup and status remain available. Upstream attribution is retained.

/**
 * OpenClaw legacy cleanup and status.
 *
 * The OpenClaw plugin installer is retired. No installation path resolves or
 * copies an `openclaw/` plugin bundle anymore. This module remains for legacy
 * users: the generic uninstaller (src/npx-cli/commands/uninstall-targets.ts)
 * proves ownership of ~/.openclaw/extensions/claude-mem and the exact
 * Marian-owned registration keys in openclaw.json (Decision 04), then calls
 * uninstallOpenClawPlugin(); checkOpenClawStatus reports legacy registration
 * state for diagnostics (no active dispatch calls it).
 */

import path from 'path';
import { homedir } from 'os';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { logger } from '../../utils/logger.js';

export function getOpenClawConfigDirectory(): string {
  return path.join(homedir(), '.openclaw');
}

export function getOpenClawExtensionsDirectory(): string {
  return path.join(getOpenClawConfigDirectory(), 'extensions');
}

export function getOpenClawClaudeMemExtensionDirectory(): string {
  return path.join(getOpenClawExtensionsDirectory(), 'claude-mem');
}

export function getOpenClawConfigFilePath(): string {
  return path.join(getOpenClawConfigDirectory(), 'openclaw.json');
}

function readOpenClawConfig(): Record<string, any> {
  const configFilePath = getOpenClawConfigFilePath();
  if (!existsSync(configFilePath)) return {};
  try {
    return JSON.parse(readFileSync(configFilePath, 'utf-8'));
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    logger.error('WORKER', 'Failed to parse openclaw.json', { path: configFilePath }, normalizedError);
    throw normalizedError;
  }
}

function writeOpenClawConfig(config: Record<string, any>): void {
  const configDirectory = getOpenClawConfigDirectory();
  mkdirSync(configDirectory, { recursive: true });
  writeFileSync(getOpenClawConfigFilePath(), JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

function unregisterPluginFromOpenClawConfig(): void {
  const configFilePath = getOpenClawConfigFilePath();
  if (!existsSync(configFilePath)) return;

  const config = readOpenClawConfig();
  const original = JSON.stringify(config);

  if (config.plugins?.entries?.['claude-mem']) {
    delete config.plugins.entries['claude-mem'];
  }

  if (config.plugins?.slots?.memory === 'claude-mem') {
    delete config.plugins.slots.memory;
  }

  if (JSON.stringify(config) !== original) writeOpenClawConfig(config);
}

export function uninstallOpenClawPlugin(): number {
  let hasErrors = false;

  const extensionDirectory = getOpenClawClaudeMemExtensionDirectory();
  if (existsSync(extensionDirectory)) {
    try {
      rmSync(extensionDirectory, { recursive: true, force: true });
      console.log(`  Removed extension: ${extensionDirectory}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  Failed to remove extension directory: ${message}`);
      hasErrors = true;
    }
  }

  try {
    unregisterPluginFromOpenClawConfig();
    console.log(`  Unregistered from openclaw.json`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  Failed to update openclaw.json: ${message}`);
    hasErrors = true;
  }

  return hasErrors ? 1 : 0;
}

export function checkOpenClawStatus(): number {
  console.log('\nClaude-Mem OpenClaw Integration Status\n');

  const configDirectory = getOpenClawConfigDirectory();
  const extensionDirectory = getOpenClawClaudeMemExtensionDirectory();
  const configFilePath = getOpenClawConfigFilePath();
  const pluginEntryPoint = path.join(extensionDirectory, 'dist', 'index.js');

  console.log(`Config directory: ${configDirectory}`);
  console.log(`  Exists: ${existsSync(configDirectory) ? 'yes' : 'no'}`);
  console.log('');

  console.log(`Extension directory: ${extensionDirectory}`);
  console.log(`  Exists: ${existsSync(extensionDirectory) ? 'yes' : 'no'}`);
  console.log(`  Plugin entry: ${existsSync(pluginEntryPoint) ? 'yes' : 'no'}`);
  console.log('');

  console.log(`Config (openclaw.json): ${configFilePath}`);
  if (existsSync(configFilePath)) {
    const config = readOpenClawConfig();
    const isRegistered = config.plugins?.entries?.['claude-mem'] !== undefined;
    const isEnabled = config.plugins?.entries?.['claude-mem']?.enabled === true;
    const isMemorySlot = config.plugins?.slots?.memory === 'claude-mem';

    console.log(`  Exists: yes`);
    console.log(`  Registered: ${isRegistered ? 'yes' : 'no'}`);
    console.log(`  Enabled: ${isEnabled ? 'yes' : 'no'}`);
    console.log(`  Memory slot: ${isMemorySlot ? 'yes' : 'no'}`);

    if (isRegistered) {
      const pluginConfig = config.plugins.entries['claude-mem'].config;
      if (pluginConfig) {
        console.log(`  Worker port: ${pluginConfig.workerPort ?? 'default'}`);
        console.log(`  Project: ${pluginConfig.project ?? 'default'}`);
        console.log(`  Sync MEMORY.md: ${pluginConfig.syncMemoryFile ?? 'default'}`);
      }
    }
  } else {
    console.log(`  Exists: no`);
  }

  console.log('');
  return 0;
}
