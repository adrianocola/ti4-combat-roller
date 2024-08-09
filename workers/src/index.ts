export default {
  async fetch(request, env, _): Promise<Response> {
    const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey: env.RANDOMORG_API_KEY,
          n: 1000,
          min: 1,
          max: 10,
          replacement: true,
          base: 10,
          pregeneratedRandomization: null,
        },
        id: Date.now(),
      }),
    });

    const data = (await response.json()) as any;
    return Response.json(data.result?.random?.data ?? []);
  },
} satisfies ExportedHandler<Env>;
