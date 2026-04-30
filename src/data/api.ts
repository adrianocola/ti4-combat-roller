export const fetchRandomIntegers = async (): Promise<number[]> => {
  const apiEndpoint = import.meta.env.VITE_PUBLIC_API_ENDPOINT;
  if (!apiEndpoint) return [];
  const response = await fetch(apiEndpoint);
  const data = await response.json();
  return data ?? [];
};
