// Modified by the claude-mem-marian fork: retired host routes and cleanup contracts. Upstream attribution is retained.
import { describe, it, expect, afterEach, spyOn } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  buildNoOpResult,
  hookCommand,
  isNonBlockingHookInputError,
  isWorkerUnavailableError,
} from '../src/cli/hook-command.js';
import { claudeCodeAdapter } from '../src/cli/adapters/claude-code.js';
import { getEventHandler } from '../src/cli/handlers/index.js';
import { HOOK_EXIT_CODES } from '../src/shared/hook-constants.js';
import { getActiveHookType, setActiveHookType } from '../src/shared/worker-utils.js';
import { SAFETY_TIMEOUT_MS } from '../src/cli/stdin-reader.js';
import { HookStdoutError } from '../src/shared/hook-io.js';
import { installFakeStdin, installOpenFakeStdin, restoreStdin } from './fake-stdin.js';

const realStdoutWrite = process.stdout.write;

function captureStdout(chunks: string[] = []): void {
  process.stdout.write = ((chunk: string, callback: () => void): boolean => {
    chunks.push(String(chunk).replace(/\n$/, ''));
    callback?.();
    return true;
  }) as typeof process.stdout.write;
}

afterEach(() => {
  restoreStdin();
  process.stdout.write = realStdoutWrite;
  setActiveHookType('');
});

describe('hook_failed telemetry type', () => {
  it('classifies SessionEnd as a closed hook_type value', () => {
    setActiveHookType('session-end');

    expect(getActiveHookType()).toBe('session-end');
  });
});

describe('buildNoOpResult', () => {
  it('attaches a valid SessionStart hookSpecificOutput for the context event (#2972)', () => {
    const result = buildNoOpResult('context');

    expect(result).toEqual({
      continue: true,
      suppressOutput: true,
      hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: '' },
    });
  });

  it('omits hookSpecificOutput for every other event', () => {
    for (const event of ['session-init', 'observation', 'summarize', 'user-message', 'file-edit', 'file-context']) {
      expect(buildNoOpResult(event)).toEqual({ continue: true, suppressOutput: true });
    }
  });
});

describe('hookCommand tool-hook disable (#3106)', () => {
  afterEach(() => {
    delete process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS;
    delete process.env.CLAUDE_MEM_DISABLE_OBSERVATION;
    delete process.env.CLAUDE_MEM_DISABLE_FILE_CONTEXT;
  });

  it('exits success without reading stdin when CLAUDE_MEM_DISABLE_TOOL_HOOKS=1', async () => {
    process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS = '1';
    // No stdin JSON is provided; a disabled early-return must not hang on readJsonFromStdin.
    const code = await hookCommand('claude-code', 'observation', { skipExit: true });
    expect(code).toBe(HOOK_EXIT_CODES.SUCCESS);
  });

  it('also no-ops file-context when CLAUDE_MEM_DISABLE_TOOL_HOOKS=1', async () => {
    process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS = '1';
    const code = await hookCommand('claude-code', 'file-context', { skipExit: true });
    expect(code).toBe(HOOK_EXIT_CODES.SUCCESS);
  });
});

describe('isNonBlockingHookInputError', () => {
  it('classifies missing transcript paths as non-blocking hook input errors', () => {
    const error = new Error(
      'Transcript path missing or file does not exist: /tmp/missing-session.jsonl'
    );

    expect(isNonBlockingHookInputError(error)).toBe(true);
  });

  it('classifies missing transcript-path errors without file-existence text', () => {
    expect(
      isNonBlockingHookInputError(new Error('Transcript path missing: /tmp/missing-session.jsonl'))
    ).toBe(true);
  });

  it('classifies nonexistent transcript-path errors without missing text', () => {
    expect(
      isNonBlockingHookInputError(new Error('Transcript path does not exist: /tmp/missing-session.jsonl'))
    ).toBe(true);
  });

  it('does not classify unrelated hook errors as non-blocking input errors', () => {
    expect(isNonBlockingHookInputError(new Error('Cannot read properties of undefined'))).toBe(false);
    expect(isNonBlockingHookInputError(new Error('Request failed: 400'))).toBe(false);
  });

  it('fails open through hookCommand for truncated stdin and emits one no-op envelope', async () => {
    installFakeStdin('{"session_id":');
    const output: string[] = [];
    captureStdout(output);

    const exitCode = await hookCommand('claude-code', 'context', { skipExit: true });

    expect(exitCode).toBe(0);
    expect(output).toEqual([
      JSON.stringify({
        hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: '' },
      }),
    ]);
  });

  it('fails open through hookCommand for the UserPromptSubmit session-init hook and emits one empty envelope', async () => {
    installFakeStdin('{"session_id":');
    const output: string[] = [];
    captureStdout(output);

    const exitCode = await hookCommand('claude-code', 'session-init', { skipExit: true });

    expect(exitCode).toBe(0);
    expect(output).toEqual(['{}']);
  });

  it('fails open through hookCommand when stdin reaches the incomplete timeout path', async () => {
    installOpenFakeStdin('{"session_id":');
    const output: string[] = [];
    captureStdout(output);

    const exitCode = await hookCommand('claude-code', 'session-init', {
      skipExit: true,
      stdinSafetyTimeoutMs: 1,
    });

    expect(exitCode).toBe(0);
    expect(output).toEqual(['{}']);
  });

  it('classifies incomplete stdin timeout diagnostics as non-blocking', () => {
    expect(isNonBlockingHookInputError(new Error(`Incomplete JSON after ${SAFETY_TIMEOUT_MS}ms: {"session_id":...`))).toBe(true);
  });

  it('keeps unrelated errors with a reader phrase blocking', () => {
    expect(isNonBlockingHookInputError(new Error('Handler failed: Malformed JSON at stdin EOF: {"session_id":...'))).toBe(false);
  });
});

describe('hookCommand catch-all never blocks (#3161, plan-17 step 2)', () => {
  const originalTelemetry = process.env.CLAUDE_MEM_TELEMETRY;

  afterEach(() => {
    if (originalTelemetry === undefined) delete process.env.CLAUDE_MEM_TELEMETRY;
    else process.env.CLAUDE_MEM_TELEMETRY = originalTelemetry;
  });

  // Exit 2 used to answer these: UserPromptSubmit dropped the prompt,
  // PreToolUse denied the tool, and Stop re-woke the agent in a loop.
  for (const event of ['context', 'session-init', 'observation', 'file-context', 'summarize', 'session-end']) {
    it(`answers an unexpected ${event} handler error with the no-op envelope and exit 0`, async () => {
      // The catch-all awaits hook_failed telemetry; keep it off the network.
      process.env.CLAUDE_MEM_TELEMETRY = '0';
      const executeSpy = spyOn(getEventHandler(event), 'execute').mockImplementation(async () => {
        throw new TypeError('unexpected handler bug');
      });
      const stdout: string[] = [];
      captureStdout(stdout);
      const stderr: string[] = [];
      const realStderrWrite = process.stderr.write;
      process.stderr.write = ((chunk: string | Uint8Array): boolean => {
        stderr.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8'));
        return true;
      }) as typeof process.stderr.write;
      installFakeStdin(JSON.stringify({ session_id: 'catch-all-session', cwd: process.cwd() }));

      try {
        const exitCode = await hookCommand('claude-code', event, { skipExit: true });

        expect(exitCode).toBe(HOOK_EXIT_CODES.SUCCESS);
        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(stdout).toEqual([JSON.stringify(claudeCodeAdapter.formatOutput(buildNoOpResult(event)))]);
        expect(stderr.join('')).toContain('claude-mem: hook error, continuing without memory: unexpected handler bug');
      } finally {
        process.stderr.write = realStderrWrite;
        executeSpy.mockRestore();
      }
    });
  }
});

describe('hookCommand stdout delivery failures', () => {
  it('rejects a failed write without emitting a second envelope', async () => {
    const executeSpy = spyOn(getEventHandler('session-init'), 'execute').mockResolvedValue({ continue: true });
    const output: string[] = [];
    process.stdout.write = ((chunk: string, callback: (error?: Error | null) => void): boolean => {
      output.push(String(chunk));
      queueMicrotask(() => callback(new Error('stdout unavailable')));
      return false;
    }) as typeof process.stdout.write;
    installFakeStdin(JSON.stringify({ session_id: 'stdout-failure', cwd: process.cwd() }));
    try {
      await expect(hookCommand('claude-code', 'session-init', { skipExit: true })).rejects.toBeInstanceOf(HookStdoutError);
      expect(output).toEqual(['{}\n']);
      expect(executeSpy).toHaveBeenCalledTimes(1);
    } finally {
      executeSpy.mockRestore();
    }
  });
});

describe("hook claude <event> is Claude Code (#2835)", () => {
  it('hands handlers the canonical platform id, so claude-code branches apply', async () => {
    const platforms: unknown[] = [];
    const executeSpy = spyOn(getEventHandler('session-init'), 'execute').mockImplementation(async (input) => {
      platforms.push(input.platform);
      return { continue: true, suppressOutput: true };
    });
    captureStdout();
    installFakeStdin(JSON.stringify({ session_id: 'alias-session', cwd: process.cwd(), prompt: 'hello' }));

    try {
      const exitCode = await hookCommand('claude', 'session-init', { skipExit: true });

      expect(exitCode).toBe(HOOK_EXIT_CODES.SUCCESS);
      expect(platforms).toEqual(['claude-code']);
    } finally {
      executeSpy.mockRestore();
    }
  });
});

describe('isWorkerUnavailableError', () => {
  describe('transport failures → true (graceful)', () => {
    it('should classify ECONNREFUSED as worker unavailable', () => {
      const error = new Error('connect ECONNREFUSED 127.0.0.1:37777');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify ECONNRESET as worker unavailable', () => {
      const error = new Error('socket hang up ECONNRESET');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify EPIPE as worker unavailable', () => {
      const error = new Error('write EPIPE');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify ETIMEDOUT as worker unavailable', () => {
      const error = new Error('connect ETIMEDOUT 127.0.0.1:37777');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "fetch failed" as worker unavailable', () => {
      const error = new TypeError('fetch failed');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "Unable to connect" as worker unavailable', () => {
      const error = new Error('Unable to connect to server');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify ENOTFOUND as worker unavailable', () => {
      const error = new Error('getaddrinfo ENOTFOUND localhost');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "socket hang up" as worker unavailable', () => {
      const error = new Error('socket hang up');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify Bun "socket connection was closed unexpectedly" as worker unavailable (#3871)', () => {
      const error = new Error('The socket connection was closed unexpectedly');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "connection closed" as worker unavailable (#3871)', () => {
      const error = new Error('connection closed');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify ECONNABORTED as worker unavailable', () => {
      const error = new Error('ECONNABORTED');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });
  });

  describe('timeout errors → true (graceful)', () => {
    it('should classify "timed out" as worker unavailable', () => {
      const error = new Error('Request timed out after 3000ms');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "timeout" as worker unavailable', () => {
      const error = new Error('Connection timeout');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });
  });

  describe('HTTP 5xx server errors → true (graceful)', () => {
    it('should classify 500 status as worker unavailable', () => {
      const error = new Error('Context generation failed: 500');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify 502 status as worker unavailable', () => {
      const error = new Error('Observation storage failed: 502');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify 503 status as worker unavailable', () => {
      const error = new Error('Request failed: 503');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "status: 500" format as worker unavailable', () => {
      const error = new Error('HTTP error status: 500');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });
  });

  describe('HTTP 429 rate limit → true (graceful)', () => {
    it('should classify 429 as worker unavailable (rate limit is transient)', () => {
      const error = new Error('Request failed: 429');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });

    it('should classify "status: 429" format as worker unavailable', () => {
      const error = new Error('HTTP error status: 429');
      expect(isWorkerUnavailableError(error)).toBe(true);
    });
  });

  describe('HTTP 4xx client errors → false (blocking)', () => {
    it('should NOT classify 400 Bad Request as worker unavailable', () => {
      const error = new Error('Request failed: 400');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });

    it('should NOT classify 404 Not Found as worker unavailable', () => {
      const error = new Error('Observation storage failed: 404');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });

    it('should NOT classify 422 Validation Error as worker unavailable', () => {
      const error = new Error('Request failed: 422');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });

    it('should NOT classify "status: 400" format as worker unavailable', () => {
      const error = new Error('HTTP error status: 400');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });
  });

  describe('programming errors → false (blocking)', () => {
    it('should NOT classify TypeError as worker unavailable', () => {
      const error = new TypeError('Cannot read properties of undefined');
      expect(isWorkerUnavailableError(new TypeError('Cannot read properties of undefined'))).toBe(false);
    });

    it('should NOT classify ReferenceError as worker unavailable', () => {
      const error = new ReferenceError('foo is not defined');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });

    it('should NOT classify SyntaxError as worker unavailable', () => {
      const error = new SyntaxError('Unexpected token');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });
  });

  describe('unknown errors → false (blocking, conservative)', () => {
    it('should NOT classify generic Error as worker unavailable', () => {
      const error = new Error('Something unexpected happened');
      expect(isWorkerUnavailableError(error)).toBe(false);
    });

    it('should handle string errors', () => {
      expect(isWorkerUnavailableError('ECONNREFUSED')).toBe(true);
      expect(isWorkerUnavailableError('random error')).toBe(false);
    });

    it('should handle null/undefined errors', () => {
      expect(isWorkerUnavailableError(null)).toBe(false);
      expect(isWorkerUnavailableError(undefined)).toBe(false);
    });
  });
});

describe('hookCommand retired Cursor route (Decision 08)', () => {
  const realStderrWrite = process.stderr.write;

  function captureStderr(chunks: string[] = []): void {
    process.stderr.write = ((chunk: string, callback: () => void): boolean => {
      chunks.push(String(chunk).replace(/\n$/, ''));
      callback?.();
      return true;
    }) as typeof process.stderr.write;
  }

  afterEach(() => {
    process.stderr.write = realStderrWrite;
    delete process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS;
    delete process.env.CLAUDE_MEM_DISABLE_OBSERVATION;
    delete process.env.CLAUDE_MEM_DISABLE_FILE_CONTEXT;
  });

  for (const event of ['session-init', 'context', 'observation', 'file-edit', 'summarize', 'some-future-event']) {
    it(`refuses hook cursor ${event} with the exact envelope and no side effects`, async () => {
      const stdout: string[] = [];
      const stderr: string[] = [];
      captureStdout(stdout);
      captureStderr(stderr);
      // An open stdin that would hang the test if the refusal ever read it.
      // Empty payload: a stdin read would block on the safety timeout, failing the test.
      installOpenFakeStdin("");
      process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS = '1';
      // No settings file may be created (or read into existence) by the refusal.
      const configDir = mkdtempSync(join(tmpdir(), 'cursor-refusal-config-'));
      process.env.CLAUDE_CONFIG_DIR = configDir;

      const code = await hookCommand('cursor', event, { skipExit: true });

      expect(code).toBe(0);
      expect(stdout).toEqual(['{"continue":true}']);
      expect(stderr).toEqual(['claude-mem: Cursor hooks are retired; no event was captured. Use worker-service cursor status or cursor uninstall from the affected workspace.']);
      expect(existsSync(join(configDir, 'settings.json'))).toBe(false);
      rmSync(configDir, { recursive: true, force: true });
    });
  }

  it('reserves the cursor token in the adapter registry before the raw default', async () => {
    const { getPlatformAdapter } = await import('../src/cli/adapters/index.js');
    expect(() => getPlatformAdapter('cursor')).toThrow(/Cursor hooks are retired/);
    expect(getPlatformAdapter('some-future-cli')).toBeDefined();
  });
});

describe('hookCommand retired Kimi route (Decision 09)', () => {
  const realStderrWrite = process.stderr.write;

  function captureStderrKimi(chunks: string[] = []): void {
    process.stderr.write = ((chunk: string, callback: () => void): boolean => {
      chunks.push(String(chunk).replace(/\n$/, ''));
      callback?.();
      return true;
    }) as typeof process.stderr.write;
  }

  afterEach(() => {
    process.stderr.write = realStderrWrite;
    delete process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS;
  });

  for (const event of ['session-init-context', 'observation', 'file-context', 'summarize', 'some-future-event']) {
    it(`refuses hook kimi ${event} with the exact envelope and no side effects`, async () => {
      const stdout: string[] = [];
      const stderr: string[] = [];
      captureStdout(stdout);
      captureStderrKimi(stderr);
      installOpenFakeStdin("");
      process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS = '1';
      const configDir = mkdtempSync(join(tmpdir(), 'kimi-refusal-config-'));
      process.env.CLAUDE_CONFIG_DIR = configDir;

      const code = await hookCommand('kimi', event, { skipExit: true });

      expect(code).toBe(0);
      expect(stdout).toEqual(['{"continue":true}']);
      expect(stderr).toEqual(['claude-mem: Kimi hooks are retired; no event was captured. Use worker-service kimi status or kimi uninstall from the affected workspace.']);
      expect(existsSync(join(configDir, 'settings.json'))).toBe(false);
      rmSync(configDir, { recursive: true, force: true });
    });
  }

});

describe('hookCommand retired Windsurf route (Decision 10)', () => {
  const realStderrWrite = process.stderr.write;

  function captureStderrWs(chunks: string[] = []): void {
    process.stderr.write = ((chunk: string, callback: () => void): boolean => {
      chunks.push(String(chunk).replace(/\n$/, ''));
      callback?.();
      return true;
    }) as typeof process.stderr.write;
  }

  afterEach(() => {
    process.stderr.write = realStderrWrite;
    delete process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS;
  });

  for (const event of ['session-init', 'file-edit', 'observation', 'pre_user_prompt', 'post_write_code', 'post_run_command', 'post_mcp_tool_use', 'post_cascade_response', 'some-future-event']) {
    it(`refuses hook windsurf ${event} with the exact envelope and no side effects`, async () => {
      const stdout: string[] = [];
      const stderr: string[] = [];
      captureStdout(stdout);
      captureStderrWs(stderr);
      installOpenFakeStdin("");
      process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS = '1';
      const configDir = mkdtempSync(join(tmpdir(), 'windsurf-refusal-config-'));
      process.env.CLAUDE_CONFIG_DIR = configDir;

      const code = await hookCommand('windsurf', event, { skipExit: true });

      expect(code).toBe(0);
      expect(stdout).toEqual(['{"continue":true}']);
      expect(stderr).toEqual(['claude-mem: Windsurf hooks are retired; no event was captured. Use npx claude-mem uninstall to review legacy cleanup.']);
      expect(existsSync(join(configDir, 'settings.json'))).toBe(false);
      rmSync(configDir, { recursive: true, force: true });
    });
  }

  it('never touches stdin, loggers, network, or child processes on the retired route', async () => {
    const { logger } = await import('../src/utils/logger.js');
    const logSpies = ['info', 'debug', 'warn', 'error'].map(level => spyOn(logger as any, level).mockImplementation(() => {}));
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(async () => { throw new Error('network touched'); });
    const originalStdin = Object.getOwnPropertyDescriptor(process, 'stdin');
    const touched = (): never => { throw new Error('stdin touched'); };
    const trap = { isTTY: false, on: touched, once: touched, read: touched, resume: touched, removeListener: () => {} };
    Object.defineProperty(process, 'stdin', { configurable: true, value: trap });
    const stdout: string[] = [];
    const stderr: string[] = [];
    captureStdout(stdout);
    captureStderrWs(stderr);
    try {
      const code = await hookCommand('windsurf', 'post_cascade_response', { skipExit: true });
      expect(code).toBe(0);
      expect(stdout).toEqual(['{"continue":true}']);
      expect(stderr).toHaveLength(1);
      expect(logSpies.every(spy => spy.mock.calls.length === 0)).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
      logSpies.forEach(spy => spy.mockRestore());
      if (originalStdin) Object.defineProperty(process, 'stdin', originalStdin);
    }
  });

  it('never resolves a handler or buffers stderr on the retired route (source-order pin)', async () => {
    const source = readFileSync(join(__dirname, '..', 'src', 'cli', 'hook-command.ts'), 'utf8');
    const guard = source.indexOf("isRetiredWindsurfHookPlatform(rawPlatform)");
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(source.indexOf('installHookStderrBuffer()'));
    expect(guard).toBeLessThan(source.indexOf('getEventHandler(event)'));
  });
});

describe('hookCommand retired antigravity-cli route (Decision 11)', () => {
  const realStderrWrite = process.stderr.write;

  function captureStderrAg(chunks: string[] = []): void {
    process.stderr.write = ((chunk: string, callback: () => void): boolean => {
      chunks.push(String(chunk).replace(/\n$/, ''));
      callback?.();
      return true;
    }) as typeof process.stderr.write;
  }

  afterEach(() => {
    process.stderr.write = realStderrWrite;
    delete process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS;
  });

  for (const token of ['antigravity', 'antigravity-cli']) {
    for (const event of ['context', 'session-init', 'observation', 'summarize', 'SessionStart', 'PreInvocation', 'PostToolUse', 'PostInvocation', 'Stop', 'PreToolUse', 'some-future-event']) {
      it(`refuses hook ${token} ${event} with the exact envelope and no side effects`, async () => {
        const stdout: string[] = [];
        const stderr: string[] = [];
        captureStdout(stdout);
        captureStderrAg(stderr);
        installOpenFakeStdin("");
        process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS = '1';
        const configDir = mkdtempSync(join(tmpdir(), 'antigravity-refusal-config-'));
        process.env.CLAUDE_CONFIG_DIR = configDir;

        const code = await hookCommand(token, event, { skipExit: true });

        expect(code).toBe(0);
        expect(stdout).toEqual(['{"continue":true}']);
        expect(stderr).toEqual(['claude-mem: antigravity-cli hooks are retired; no event was captured. Use npx claude-mem antigravity-cli status|uninstall to inspect or remove legacy configuration.']);
        expect(existsSync(join(configDir, 'settings.json'))).toBe(false);
        rmSync(configDir, { recursive: true, force: true });
      });
    }
  }

  it('never resolves a handler or buffers stderr on the retired route (source-order pin)', async () => {
    const source = readFileSync(join(__dirname, '..', 'src', 'cli', 'hook-command.ts'), 'utf8');
    const guard = source.indexOf('isRetiredAntigravityHookPlatform(rawPlatform)');
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(source.indexOf('installHookStderrBuffer()'));
    expect(guard).toBeLessThan(source.indexOf('getEventHandler(event)'));
  });
});
