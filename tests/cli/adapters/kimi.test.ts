import { describe, expect, it } from 'bun:test';

// Decision 09: the Kimi adapter is retired. The token stays reserved so a
// stale config.toml hook entry can never silently fall through to raw; the
// retirement refusal envelope is covered in tests/hook-command.test.ts.
describe('retired Kimi adapter reservation (Decision 09)', () => {
  it('throws the retirement error before the raw default', async () => {
    const { getPlatformAdapter, rawAdapter } = await import('../../../src/cli/adapters/index.js');
    expect(() => getPlatformAdapter('kimi')).toThrow(/Kimi hooks are retired/);
    expect(getPlatformAdapter('some-future-cli')).toBe(rawAdapter);
  });
});
