// test/index.spec.ts
import {
  createExecutionContext,
  env,
  SELF,
  waitOnExecutionContext,
} from 'cloudflare:test';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

const randomData = [1, 2, 3];

describe('Random worker', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    //@ts-ignore
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({result: {random: {data: randomData}}}),
      }),
    );
  });

  it('responds with random numbers (unit style)', async () => {
    const request = new IncomingRequest('http://example.com');
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);
    expect(await response.json()).toEqual(randomData);
  });

  it('responds with random numbers (integration style)', async () => {
    const response = await SELF.fetch('https://example.com');
    expect(await response.json()).toEqual(randomData);
  });
});
