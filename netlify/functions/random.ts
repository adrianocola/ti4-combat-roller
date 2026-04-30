import type {Config} from '@netlify/functions';

interface RandomOrgResponse {
  result?: {random?: {data?: number[]}};
}

export default async (): Promise<Response> => {
  const apiKey = Netlify.env.get('RANDOMORG_API_KEY');
  if (!apiKey) {
    return Response.json([], {status: 200});
  }

  const upstream = await fetch('https://api.random.org/json-rpc/4/invoke', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'generateIntegers',
      params: {
        apiKey,
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

  const data = (await upstream.json()) as RandomOrgResponse;
  return Response.json(data.result?.random?.data ?? [], {
    headers: {'Cache-Control': 'no-store'},
  });
};

export const config: Config = {
  path: '/api/random',
};
