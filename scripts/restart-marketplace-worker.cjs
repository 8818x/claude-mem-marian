#!/usr/bin/env node
// Modified by the claude-mem-marian fork to require explicit, preflighted installed-state operations. Upstream attribution is retained.

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const { resolveIntegrationPlan, formatIntegrationPlan, runRestart } = require('./installed-state.cjs');

function parseArgs(args) {
  for (const arg of args) {
    if (arg !== '--apply') throw new Error(`Unknown argument: ${arg}`);
  }
  if (args.length > 1) throw new Error('Duplicate argument: --apply');
  return { apply: args.includes('--apply') };
}

function main({ argv = process.argv.slice(2), rootDir = path.join(__dirname, '..'), homeDir = os.homedir(), exec = execSync } = {}) {
  try {
    const options = parseArgs(argv);
    const plan = resolveIntegrationPlan({ rootDir, homeDir, kind: 'restart', ...options });
    console.log(formatIntegrationPlan(plan));
    if (!plan.apply) return 0;
    console.log(`Running bun plugin/scripts/worker-service.cjs restart from ${plan.restartCwd}`);
    runRestart(plan, { exec });
    return 0;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Worker restart failed:', error.message);
    return 1;
  }
}

if (require.main === module) process.exitCode = main();

module.exports = { parseArgs, main };
