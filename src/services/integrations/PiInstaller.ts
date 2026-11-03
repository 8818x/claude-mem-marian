// Modified by the claude-mem-marian fork: the Pi installer is retired; direct status/uninstall and the seven-file cleanup contract remain per Decision 04. Upstream attribution is retained.
import { existsSync, rmSync, readdirSync, rmdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const PI_CAPTURE_GUIDANCE =
  'Automatic memory capture is not verified by installation or status. Pi 0.79.6 provides manual recall only. ' +
  'Capture compatibility is source-reviewed for Pi 1.0.2 and 1.0.4; other or unknown versions need a compatibility check. ' +
  'Check your Pi version and update Pi if needed: https://github.com/thedotmack/claude-mem/blob/main/docs/pi-native-capture.md';

const PI_OWNED_FILES = ['index.js', 'package.json', 'LICENSE.txt', 'CLAUDE-MEM-LICENSE.txt', 'CLAUDE-MEM-NOTICE.txt', 'TYPEBOX-LICENSE.txt', 'TYPEBOX-PROVENANCE.json'];

export function piExtensionDirectory(): string {
  return join(process.env.PI_CODING_AGENT_DIR || join(homedir(), '.pi', 'agent'), 'extensions', 'claude-mem');
}
export function piExtensionPath(): string { return join(piExtensionDirectory(), 'index.js'); }

export function uninstallPiExtension(): number {
  try {
    for (const name of PI_OWNED_FILES) rmSync(join(piExtensionDirectory(), name), { force: true });
    if (existsSync(piExtensionDirectory()) && readdirSync(piExtensionDirectory()).length === 0) rmdirSync(piExtensionDirectory());
    return 0;
  }
  catch (error) { console.error('Could not uninstall Pi memory: ' + String(error)); return 1; }
}
export function piExtensionStatus(): number {
  const installed = existsSync(piExtensionPath());
  console.log('Pi extension files: ' + (installed ? 'installed at ' + piExtensionPath() : 'not installed'));
  console.log(PI_CAPTURE_GUIDANCE);
  return installed ? 0 : 1;
}
