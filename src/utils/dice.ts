import {randomFace, randomNumber} from '@/utils/random';
import {
  ColorSet,
  MAX_ROLL_MS,
  MIN_RANDOM_COUNT,
  MIN_ROLL_MS,
  RANDOM_COUNT_FETCH_QUANTITY,
} from '@/data/consts';
import {
  calcAccumulativeSuccessChances,
  calcExactSuccessChances,
} from '@/utils/chance';
import {store} from '@/store';
import {
  getRandomCount,
  getRandomValues,
  setRandomValues,
} from '@/services/asyncStorage';
import {
  fetchRandomIntegers,
  fetchRandomIntegersLegacy,
} from '@/services/randomOrg';

// control if the download is already in progress
const downloadingRef = {downloading: false};
const getDiceCount = (dices: Dices): number => {
  return Object.values(dices).reduce((a, set) => a + set.length, 0);
};

const tryToFetchRandomIntegers = async (): Promise<number[]> => {
  try {
    return fetchRandomIntegers(RANDOM_COUNT_FETCH_QUANTITY);
  } catch (e) {
    console.error('fetchRandomIntegers error', e);
  }

  return [];
};

const tryToFetchRandomIntegersLegacy = async (): Promise<number[]> => {
  try {
    return fetchRandomIntegersLegacy(RANDOM_COUNT_FETCH_QUANTITY);
  } catch (e) {
    console.error('fetchRandomIntegersLegacy error', e);
  }

  return [];
};

const updateRandomData = async (newValues: number[]) => {
  if (!newValues) {
    return;
  }

  try {
    const existingValues = await getRandomValues();

    const finalValues = [...existingValues, ...newValues];
    await setRandomValues(finalValues);
  } catch (e) {
    console.error('updateRandomData error', e);
  }
};

// Download more random data from the API (if needed)
export const downloadMoreRandomData = async () => {
  const randomCount = await getRandomCount();
  if (downloadingRef.downloading || randomCount > MIN_RANDOM_COUNT) {
    return;
  }

  downloadingRef.downloading = true;

  let newValues: number[] = await tryToFetchRandomIntegers();
  if (!newValues.length) {
    newValues = await tryToFetchRandomIntegersLegacy();
  }

  await updateRandomData(newValues);

  downloadingRef.downloading = false;
};

const getRandomFaces = async (quantity: number): Promise<Face[]> => {
  const allRandomValues = await getRandomValues();
  const trueRandomValues = allRandomValues.slice(0, quantity);
  const remainingRandomValues = allRandomValues.slice(quantity);

  await setRandomValues(remainingRandomValues);

  // if there are missing values, fill in the rest with local random faces
  const fillInRandomValues = new Array(quantity - trueRandomValues.length)
    .fill(0)
    .map(() => randomFace());

  // no await needed, the download must be done in the background
  downloadMoreRandomData();

  return [...trueRandomValues, ...fillInRandomValues] as Face[];
};

export const rollDices = async (colorSet: ColorSet) => {
  const state = store.getState().diceSet;
  const quantity = getDiceCount(state[colorSet].dices);
  const faces = await getRandomFaces(quantity);
  const dices: Dices = {};

  let index = 0;
  Object.entries(state[colorSet].dices).forEach(([face, set]) => {
    const faceInt = parseInt(face, 10) as Face;
    dices[faceInt] = set.map(item => {
      const value = faces[index++];
      return {
        ...item,
        duration: randomNumber(MIN_ROLL_MS, MAX_ROLL_MS),
        success: value >= faceInt,
        face: value,
      };
    });
  });

  const chances = calcExactSuccessChances(dices);
  const chancesAccumulative = calcAccumulativeSuccessChances(chances);

  return {dices, chances, chancesAccumulative};
};
