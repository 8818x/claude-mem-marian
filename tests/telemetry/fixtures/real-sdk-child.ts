/**
 * Real-SDK loopback child for the Decision 14 boundary test (exception-real-sdk.test.ts).
 *
 * Runs under `bun run` (NOT `bun test`), so the suite's mocked posthog-node preload does NOT apply:
 * this child exercises the REAL installed posthog-node transport against a loopback sink. Synthetic
 * fixture source files only; the loopback host is passed in by the parent. Prints one JSON line
 * `CHILD-RESULT <json>` with the pre-boundary exception properties (proof the SDK enrichment fired)
 * and the manual warm-up marker, then exits 0.
 */
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const port = args[args.indexOf('--port') + 1];
const mode = args[args.indexOf('--mode') + 1]; // 'manual' | 'autocapture'

process.env.CLAUDE_MEM_TELEMETRY = '1';
delete process.env.DO_NOT_TRACK;
delete process.env.CLAUDE_MEM_TELEMETRY_ERRORS;
delete process.env.CLAUDE_MEM_TELEMETRY_DEBUG;
process.env.CLAUDE_MEM_TELEMETRY_KEY = 'phc_child_synthetic_key';
process.env.CLAUDE_MEM_TELEMETRY_HOST = `http://127.0.0.1:${port}`;
process.env.CLAUDE_MEM_DATA_DIR = mkdtempSync(join(tmpdir(), 'real-sdk-child-'));
// Synthetic conditional-identifier trigger: the boundary must strip whatever the SDK derives.
process.env.POSTHOG_RELEASE_ID = 'child-synthetic-release-id';

// Synthetic fixture source: the ONLY source content used as leak-test material.
const fixtureDir = join(process.env.CLAUDE_MEM_DATA_DIR, 'fixture-src');
mkdirSync(fixtureDir, { recursive: true });
const sourceFile = join(fixtureDir, 'child-source-fixture.js');
writeFileSync(sourceFile, [
  '// CHILD-SOURCE-SENTINEL-START',
  'export function childCrash() { throw new Error("CHILD-EXCEPTION-SENTINEL"); }',
  '// CHILD-SOURCE-SENTINEL-END',
  '',
].join('\n'), 'utf8');

const mod = await import('../../../src/services/telemetry/telemetry.js');

if (mode === 'autocapture') {
  mod.enableExceptionAutocaptureForWorker();
  let flushed = false;
  process.on('uncaughtException', () => {
    if (flushed) return;
    flushed = true;
    setTimeout(async () => {
      await mod.shutdownTelemetry();
      process.stdout.write(`CHILD-RESULT ${JSON.stringify({ preBoundary: mod.__preBoundaryExceptionForTests(), warmup: 'CHILD-MANUAL-WARMUP-SENTINEL' })}\n`);
      process.exit(0);
    }, 500);
  });
  // Construct the client (installs the SDK's own crash handler) with a manual warm-up capture.
  mod.captureException(new Error('CHILD-MANUAL-WARMUP-SENTINEL'));
  await new Promise((resolve) => setTimeout(resolve, 300));
  const imported = await import('file:///' + sourceFile.split('\\').join('/'));
  setTimeout(() => { (imported as { childCrash(): void }).childCrash(); }, 100);
} else {
  // Manual sentinel path with a stack naming the synthetic fixture file.
  const error = new Error('CHILD-MANUAL-EXCEPTION-SENTINEL message');
  error.stack = [
    'Error: CHILD-MANUAL-EXCEPTION-SENTINEL message',
    `    at childDo (${sourceFile}:2:33)`,
    `    at Object.<anonymous> (${sourceFile}:4:1)`,
  ].join('\n');
  mod.captureException(error);
  await mod.shutdownTelemetry();
  process.stdout.write(`CHILD-RESULT ${JSON.stringify({ preBoundary: mod.__preBoundaryExceptionForTests(), warmup: null })}\n`);
  process.exit(0);
}
