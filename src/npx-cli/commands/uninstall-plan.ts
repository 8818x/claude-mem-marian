import { createHash } from 'node:crypto';
import { lstatSync, readdirSync, readFileSync, readlinkSync } from 'node:fs';
import path from 'node:path';

export type UninstallState = 'present' | 'absent' | 'unknown';

export interface PlannedResource {
  path: string;
  action: 'remove file' | 'remove tree' | 'edit configuration' | 'run host command' | 'stop process' | 'preserve';
  selection: string;
  recursive?: boolean;
  sharedConfiguration?: boolean;
  note?: string;
}

interface TargetEvidenceBase {
  evidence: string[];
  resources: PlannedResource[];
  reason?: string;
}

export type TargetEvidence =
  | (TargetEvidenceBase & { state: 'present' })
  | (TargetEvidenceBase & { state: 'absent' })
  | (TargetEvidenceBase & { state: 'unknown' });

interface PreparedTargetBase extends TargetEvidenceBase {
  id: string;
  label: string;
}

export type PreparedTarget =
  | (PreparedTargetBase & { state: 'present'; execute: () => Promise<number | void> | number | void })
  | (PreparedTargetBase & { state: 'absent' })
  | (PreparedTargetBase & { state: 'unknown' });

export interface TargetDefinition {
  id: string;
  label: string;
  inspect: () => TargetEvidence | Promise<TargetEvidence>;
  apply: () => Promise<number | void> | number | void;
}

function resourceFingerprint(resource: PlannedResource): string | null {
  if (resource.action === 'preserve' || resource.action === 'run host command' || resource.action === 'stop process' || /^[a-z][a-z\d+.-]*:\/\//i.test(resource.path)) return null;

  const hash = createHash('sha256');
  const visit = (targetPath: string, relativePath: string): void => {
    const stat = lstatSync(targetPath);
    if (stat.isSymbolicLink()) {
      if (!relativePath && resource.recursive) throw new Error('recursive target is a symbolic link');
      hash.update(`link\0${relativePath}\0${readlinkSync(targetPath)}\n`);
      return;
    }
    if (stat.isDirectory()) {
      hash.update(`directory\0${relativePath}\n`);
      for (const entry of readdirSync(targetPath).sort()) {
        visit(path.join(targetPath, entry), relativePath ? path.join(relativePath, entry) : entry);
      }
      return;
    }
    if (!stat.isFile()) throw new Error('target is not a regular file, directory, or symbolic link');
    hash.update(`file\0${relativePath}\0`);
    hash.update(readFileSync(targetPath));
    hash.update('\n');
  };

  visit(resource.path, '');
  return hash.digest('hex');
}

function snapshotTargetEvidence(evidence: TargetEvidence): TargetEvidence {
  if (evidence.state !== 'present') return evidence;

  const snapshots = new Map<string, string>();
  for (const resource of evidence.resources) {
    if (snapshots.has(resource.path) || resource.action === 'preserve' || resource.action === 'stop process') continue;
    let fingerprint: string | null;
    try {
      fingerprint = resourceFingerprint(resource);
    } catch (error) {
      throw new Error(`Could not fingerprint ${resource.path}: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (fingerprint !== null) snapshots.set(resource.path, fingerprint);
  }

  return {
    ...evidence,
    evidence: [...evidence.evidence, ...[...snapshots].map(([targetPath, fingerprint]) => `planned resource sha256=${fingerprint} path=${targetPath}`)],
  };
}

export async function prepareTargetAsync(definition: TargetDefinition): Promise<PreparedTarget> {
  let inspected: TargetEvidence;
  try {
    inspected = await definition.inspect();
  } catch (error) {
    inspected = { state: 'unknown', evidence: [], resources: [], reason: `Inspection failed: ${error instanceof Error ? error.message : String(error)}` };
  }
  let initial: TargetEvidence;
  try {
    initial = snapshotTargetEvidence(inspected);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    initial = {
      state: 'unknown',
      evidence: inspected.evidence,
      resources: inspected.resources.map(resource => ({ ...resource, action: 'preserve', note: 'Resource fingerprint failed; no cleanup was run.' })),
      reason: `Could not verify planned resources: ${detail}`,
    };
  }
  if (initial.state === 'absent') return { ...initial, id: definition.id, label: definition.label };
  if (initial.state === 'unknown') return { ...initial, id: definition.id, label: definition.label };

  const signature = JSON.stringify(initial);
  return {
    ...initial,
    id: definition.id,
    label: definition.label,
    execute: async () => {
      const current = snapshotTargetEvidence(await definition.inspect());
      if (JSON.stringify(current) !== signature) {
        throw new Error('The inspected resources changed after the uninstall plan was shown; this target was preserved.');
      }
      return definition.apply();
    },
  };
}

export interface UninstallResult {
  id: string;
  label: string;
  state: 'removed' | 'already-absent' | 'skipped-ambiguous' | 'preserved' | 'failed';
  detail: string;
}

export async function executePreparedTarget(target: PreparedTarget): Promise<UninstallResult> {
  if (target.state === 'absent') {
    return { id: target.id, label: target.label, state: 'already-absent', detail: target.reason ?? 'No owned resources found.' };
  }
  if (target.state === 'unknown') {
    return { id: target.id, label: target.label, state: 'skipped-ambiguous', detail: target.reason ?? 'Ownership is ambiguous; resources were preserved.' };
  }
  if (!target.execute) {
    return { id: target.id, label: target.label, state: 'failed', detail: 'Present target had no cleanup action.' };
  }

  try {
    const code = await target.execute();
    if (typeof code === 'number' && code !== 0) {
      return { id: target.id, label: target.label, state: 'failed', detail: `Cleanup returned exit code ${code}.` };
    }
    return { id: target.id, label: target.label, state: 'removed', detail: 'Cleanup completed.' };
  } catch (error) {
    return {
      id: target.id,
      label: target.label,
      state: 'failed',
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function executeUninstallPlan(
  targets: PreparedTarget[],
  onResult?: (result: UninstallResult) => void,
): Promise<UninstallResult[]> {
  const results: UninstallResult[] = [];
  const dsh = targets.find(target => target.id === 'dsh');
  let dshSucceeded = dsh?.state === 'absent';

  for (const target of targets) {
    let result: UninstallResult;
    if (target.id === 'marketplace' && !dshSucceeded) {
      result = { id: target.id, label: target.label, state: 'preserved', detail: 'Preserved because DSH is unknown or its cleanup failed.' };
    } else {
      result = await executePreparedTarget(target);
    }
    results.push(result);
    onResult?.(result);
    if (target.id === 'dsh') dshSucceeded = result.state === 'removed' || result.state === 'already-absent';
  }
  return results;
}

export function summarizeUninstallResults(results: UninstallResult[]): { state: 'complete' | 'partial' | 'failed'; exitCode: 0 | 1 } {
  const incomplete = results.some(result => ['skipped-ambiguous', 'preserved', 'failed'].includes(result.state));
  if (!incomplete) return { state: 'complete', exitCode: 0 };
  const completedAny = results.some(result => result.state === 'removed');
  return { state: completedAny ? 'partial' : 'failed', exitCode: 1 };
}
