// Modified by the claude-mem-marian fork: the Antigravity CLI adapter object is retired (Decision 11); the transcript-turn inspection helpers remain as direct-handler compatibility. Upstream attribution is retained.
import { homedir } from 'os';
import type { NormalizedHookInput } from '../types.js';
import { findLastJsonlEntryBackward } from '../../shared/transcript-parser.js';
import { logger } from '../../utils/logger.js';
import { expandHomeDirectory, extractFilePaths } from './codex-file-context.js';


// Antigravity transcript tool_calls encode string args as JSON-quoted literals
// (e.g. `"\"/path/to/file\""`), whereas hook stdin passes plain strings.
function unwrapArgString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'string') return parsed.trim() || undefined;
    } catch {
      return trimmed.slice(1, -1).trim() || undefined;
    }
  }
  return trimmed;
}




// Files named by the tool calls of an agy transcript PLANNER_RESPONSE that
// read them (read_file / view_file, and read commands in run_command).
function filePathsReadByToolCalls(toolCalls: unknown, cwd: string, homeDirectory: string): string[] {
  const filePaths: string[] = [];
  const seen = new Set<string>();
  const add = (filePath: string) => {
    if (seen.has(filePath)) return;
    seen.add(filePath);
    filePaths.push(filePath);
  };
  for (const call of Array.isArray(toolCalls) ? toolCalls : []) {
    const callName = typeof call?.name === 'string' ? call.name : '';
    const args = (call?.args && typeof call.args === 'object') ? call.args as Record<string, unknown> : {};
    if (callName === 'read_file' || callName === 'view_file') {
      const filePath = unwrapArgString(args.Path ?? args.file_path ?? args.path);
      if (filePath) add(expandHomeDirectory(filePath, homeDirectory));
    } else if (callName === 'run_command') {
      const command = unwrapArgString(args.CommandLine ?? args.command);
      if (command) extractFilePaths('Bash', { command }, cwd, homeDirectory).forEach(add);
    }
  }
  return filePaths;
}

export interface AntigravityTurnState {
  /** True only when the newest conversational node is the user's USER_INPUT. */
  isNewUserTurn: boolean;
  /** Files read by the tool calls of the newest PLANNER_RESPONSE. */
  filePaths: string[];
}

const NOT_A_NEW_TURN: AntigravityTurnState = { isNewUserTurn: false, filePaths: [] };

// agy fires PreInvocation before EVERY model call of a turn, so it can't be
// read as a prompt submit. The newest USER_INPUT or PLANNER_RESPONSE node in
// the transcript tells the calls apart:
//   - USER_INPUT: the model hasn't answered yet, so this is the turn's first
//     call and the prompt is recorded once.
//   - PLANNER_RESPONSE: a follow-up call after a tool step; the files that
//     step read get their file-context.
// The scan reads backward in chunks and stops at that node. Anything that
// can't positively identify a new turn (no transcript, unreadable, no node)
// counts as a follow-up, so a broken transcript can't bring back one prompt
// row per model call (#5078).
export function inspectAntigravityTurn(
  transcriptPath: string | undefined,
  cwd: string,
  homeDirectory: string = homedir(),
): AntigravityTurnState {
  if (!transcriptPath) return NOT_A_NEW_TURN;
  try {
    return findLastJsonlEntryBackward<AntigravityTurnState>(transcriptPath, (node) => {
      if (node?.type === 'USER_INPUT') return { isNewUserTurn: true, filePaths: [] };
      if (node?.type === 'PLANNER_RESPONSE') {
        return { isNewUserTurn: false, filePaths: filePathsReadByToolCalls(node.tool_calls, cwd, homeDirectory) };
      }
      return undefined;
    }) ?? NOT_A_NEW_TURN;
  } catch (error) {
    logger.warn('HOOK', 'antigravity: transcript unreadable, not recording a prompt for this model call', {
      transcriptPath,
      error: error instanceof Error ? error.message : String(error),
    });
    return NOT_A_NEW_TURN;
  }
}

// Session-init input for an agy PreInvocation. A new user turn keeps the
// prompt (as `submittedPrompt`); a follow-up call gets `submittedPrompt: null`,
// session-init's "not a user turn", plus the files its tool step read.
export function resolveAntigravityPreInvocation(
  input: NormalizedHookInput,
  homeDirectory: string = homedir(),
): NormalizedHookInput {
  const { isNewUserTurn, filePaths } = inspectAntigravityTurn(input.transcriptPath, input.cwd, homeDirectory);
  if (isNewUserTurn) {
    return input.prompt === undefined ? input : { ...input, submittedPrompt: input.prompt };
  }
  return {
    ...input,
    submittedPrompt: null,
    toolInput: { prompt: input.prompt ?? 'User Query', filePaths },
  };
}

// Antigravity's hook stdin is camelCase protojson with NO explicit event-name
// field (issue #4057). The event is encoded by which hook fired (the CLI arg in
// hooks.json → internal handler), and the payload key shape tells the events
// apart:
//   - SessionStart   : { conversationId, workspacePaths, transcriptPath,
//                        artifactDirectoryPath, modelName }
//   - PostToolUse    : { ..., toolCall, error? }            (error only on failure)
//   - Pre/PostInvocation : { ..., invocationNum, initialNumSteps } (no toolCall)
//   - Stop           : { ..., terminationReason }
// PreToolUse is never registered (#5078), so a toolCall payload is a PostToolUse.
