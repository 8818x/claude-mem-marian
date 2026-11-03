import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { piExtensionDirectory, piExtensionStatus, uninstallPiExtension } from '../../src/services/integrations/PiInstaller.js';
import { executePreparedTarget } from '../../src/npx-cli/commands/uninstall-plan.js';
import { prepareIntegrationTargets } from '../../src/npx-cli/commands/uninstall-targets.js';

const fixtures: string[] = [];

const OWNED_FILES = ['index.js', 'package.json', 'LICENSE.txt', 'CLAUDE-MEM-LICENSE.txt', 'CLAUDE-MEM-NOTICE.txt', 'TYPEBOX-LICENSE.txt', 'TYPEBOX-PROVENANCE.json'];

function fixtureRoot(): string {
  const directory = path.join(tmpdir(), `marian-pi-cleanup-${crypto.randomUUID()}`);
  mkdirSync(directory, { recursive: true });
  fixtures.push(directory);
  return directory;
}

function roots(home: string) {
  return {
    home,
    claudeConfig: path.join(home, '.claude'),
    dataDir: path.join(home, 'data'),
    localAppData: path.join(home, 'local'),
    cwd: home,
    environment: {
      PI_CODING_AGENT_DIR: path.join(home, 'pi-agent'),
    },
  };
}

function byId<T extends { id: string }>(values: T[], id: string): T {
  const value = values.find(item => item.id === id);
  if (!value) throw new Error(`Missing target ${id}`);
  return value;
}

function pointPiAgentDirAt(home: string): void {
  process.env.PI_CODING_AGENT_DIR = path.join(home, 'pi-agent');
}

function writeOwnedFiles(home: string): string {
  const directory = path.join(home, 'pi-agent', 'extensions', 'claude-mem');
  mkdirSync(directory, { recursive: true });
  for (const name of OWNED_FILES) writeFileSync(path.join(directory, name), 'owned pi extension file\n');
  return directory;
}

async function runPiCleanup(home: string) {
  pointPiAgentDirAt(home);
  return executePreparedTarget(byId(await prepareIntegrationTargets(roots(home)), 'pi'));
}

let savedPiAgentDir: string | undefined;

beforeEach(() => {
  savedPiAgentDir = process.env.PI_CODING_AGENT_DIR;
});

afterEach(() => {
  if (savedPiAgentDir === undefined) delete process.env.PI_CODING_AGENT_DIR;
  else process.env.PI_CODING_AGENT_DIR = savedPiAgentDir;
  for (const directory of fixtures.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('Pi legacy extension cleanup', () => {
  it('reports absent then installed status and honors a custom PI_CODING_AGENT_DIR', () => {
    const home = fixtureRoot();
    pointPiAgentDirAt(home);

    expect(piExtensionStatus()).toBe(1);
    expect(existsSync(piExtensionDirectory())).toBe(false);

    const directory = writeOwnedFiles(home);
    expect(piExtensionStatus()).toBe(0);
    expect(existsSync(path.join(directory, 'index.js'))).toBe(true);
  });

  it('removes exactly the seven owned files and preserves unlisted files and the non-empty directory', () => {
    const home = fixtureRoot();
    pointPiAgentDirAt(home);
    const directory = writeOwnedFiles(home);
    writeFileSync(path.join(directory, 'user-note.txt'), 'unlisted file');

    expect(uninstallPiExtension()).toBe(0);

    for (const name of OWNED_FILES) expect(existsSync(path.join(directory, name))).toBe(false);
    expect(readFileSync(path.join(directory, 'user-note.txt'), 'utf8')).toBe('unlisted file');
    expect(existsSync(directory)).toBe(true);
  });

  it('is a successful no-op when absent and stays stable on repeated cleanup', () => {
    const home = fixtureRoot();
    pointPiAgentDirAt(home);

    expect(existsSync(piExtensionDirectory())).toBe(false);
    expect(uninstallPiExtension()).toBe(0);

    const directory = writeOwnedFiles(home);
    expect(uninstallPiExtension()).toBe(0);
    expect(uninstallPiExtension()).toBe(0);
    expect(existsSync(path.join(directory, 'index.js'))).toBe(false);
    expect(existsSync(directory)).toBe(false);
  });

  it('leaves removal failures visible without deleting the remaining owned files', () => {
    const home = fixtureRoot();
    pointPiAgentDirAt(home);
    const directory = writeOwnedFiles(home);
    rmSync(path.join(directory, 'index.js'));
    mkdirSync(path.join(directory, 'index.js'));

    expect(uninstallPiExtension()).toBe(1);
    expect(existsSync(path.join(directory, 'index.js'))).toBe(true);
    expect(existsSync(path.join(directory, 'package.json'))).toBe(true);
  });

  it('plans exactly the present owned files and apply removes them through the generic route', async () => {
    const home = fixtureRoot();
    pointPiAgentDirAt(home);

    expect(byId(await prepareIntegrationTargets(roots(home)), 'pi').state).toBe('absent');

    const directory = writeOwnedFiles(home);
    writeFileSync(path.join(directory, 'user-note.txt'), 'unlisted file');
    const planned = byId(await prepareIntegrationTargets(roots(home)), 'pi');
    expect(planned.state).toBe('present');
    expect(planned.resources.map(resource => path.basename(resource.path))).toEqual(OWNED_FILES);

    const result = await executePreparedTarget(planned);
    expect(result.state).toBe('removed');
    for (const name of OWNED_FILES) expect(existsSync(path.join(directory, name))).toBe(false);
    expect(readFileSync(path.join(directory, 'user-note.txt'), 'utf8')).toBe('unlisted file');

    const again = await runPiCleanup(home);
    expect(again.state).toBe('already-absent');
  });

  it('keeps the direct route status/uninstall-only with no installer dispatch', () => {
    const entrySource = readFileSync(path.join(import.meta.dir, '..', '..', 'src', 'npx-cli', 'index.ts'), 'utf8');
    const installerSource = readFileSync(path.join(import.meta.dir, '..', '..', 'src', 'services', 'integrations', 'PiInstaller.ts'), 'utf8');
    const installCommandSource = readFileSync(path.join(import.meta.dir, '..', '..', 'src', 'npx-cli', 'commands', 'install.ts'), 'utf8');

    expect(entrySource).toContain("rejectUnsupportedInstallTarget('pi')");
    expect(entrySource).not.toMatch(/\binstallPiExtension\b/);
    expect(installerSource).not.toContain('dist/pi-extension');
    expect(installerSource).not.toContain('replaceOwnedFiles');
    expect(installCommandSource).not.toContain("case 'pi'");
  });
});
