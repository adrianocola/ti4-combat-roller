import {arrayShuffle} from '@/utils/array';

enum StorageKeys {
  RANDOM_COUNT = 'ti4RandomCount',
  RANDOM_VALUES = 'ti4RandomValues',
}

const SEP = ';';

const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore quota / privacy errors
  }
};

export const getRandomCount = async (): Promise<number> => {
  const count = safeGet(StorageKeys.RANDOM_COUNT);
  return count ? parseInt(count, 10) : 0;
};

export const getRandomValues = async (): Promise<number[]> => {
  const values = safeGet(StorageKeys.RANDOM_VALUES);
  return values ? values.split(SEP).map(v => parseInt(v, 10)) : [];
};

export const setRandomValues = async (values: number[]) => {
  safeSet(StorageKeys.RANDOM_VALUES, arrayShuffle(values).join(SEP));
  safeSet(StorageKeys.RANDOM_COUNT, values.length.toString());
};
