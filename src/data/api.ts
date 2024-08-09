export const fetchRandomIntegers = async () => {
  // @ts-ignore
  const apiEndpoint = process.env.EXPO_PUBLIC_API_ENDPOINT;

  // API endpoint is optional
  if (!apiEndpoint) {
    return [];
  }

  const response = await fetch(apiEndpoint);

  const data = await response.json();
  return data ?? [];
};
