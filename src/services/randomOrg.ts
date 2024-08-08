import {randomId} from '@/utils/random';

export const fetchRandomIntegers = async (quantity: number) => {
  // @ts-ignore
  const apiKey = process.env.EXPO_PUBLIC_RANDOMORG_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Random.org API key');
  }

  const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'generateIntegers',
      params: {
        apiKey,
        n: quantity,
        min: 1,
        max: 10,
        replacement: true,
        base: 10,
        pregeneratedRandomization: null,
      },
      id: randomId(),
    }),
  });

  const data = await response.json();
  return data.result?.random?.data ?? [];
};

export const fetchRandomIntegersLegacy = async (quantity: number) => {
  const response = await fetch(
    `https://www.random.org/integers/?num=${quantity}&min=1&max=10&col=1&base=10&format=plain&rnd=new`,
  );
  const data = await response.text();
  return data
    .split('\n')
    .map(n => parseInt(n, 10))
    .filter(n => !isNaN(n));
};
