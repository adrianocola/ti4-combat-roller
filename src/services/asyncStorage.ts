import AsyncStorage from '@react-native-async-storage/async-storage';
import {arrayShuffle} from '@/utils/array';

enum StorageKeys {
  RANDOM_COUNT = 'ti4RandomCount',
  RANDOM_VALUES = 'ti4RandomValues',
}

const SEP = ';';

export const getRandomCount = async (): Promise<number> => {
  try {
    const count = await AsyncStorage.getItem(StorageKeys.RANDOM_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('getRandomCount error', error);
    return 0;
  }
};

export const getRandomValues = async (): Promise<number[]> => {
  try {
    const values = await AsyncStorage.getItem(StorageKeys.RANDOM_VALUES);
    return values ? values.split(SEP).map(value => parseInt(value, 10)) : [];
  } catch (error) {
    console.error('getRandomValues error', error);
    return [];
  }
};

export const setRandomValues = async (values: number[]) => {
  try {
    return AsyncStorage.multiSet([
      [StorageKeys.RANDOM_VALUES, arrayShuffle(values).join(SEP)],
      [StorageKeys.RANDOM_COUNT, values.length.toString()],
    ]);
  } catch (error) {
    console.error('setRandomValues error', error);
  }
};
