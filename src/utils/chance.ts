import Big from 'big.js';
import {FACES} from '@/data/consts';

const calculateProbabilityList = (eventProbabilities: number[]): Big[] => {
  const numberOfEvents = eventProbabilities.length;
  const probabilityTable: Big[][] = Array.from(
    {length: numberOfEvents + 1},
    () => Array(numberOfEvents + 1).fill(new Big(0)),
  );

  // Initialize base case: the probability of 0 events happening is 1 for 0 events.
  probabilityTable[0][0] = new Big(1);

  // Fill the probability table
  for (let eventIndex = 1; eventIndex <= numberOfEvents; eventIndex++) {
    const currentEventProbability = new Big(eventProbabilities[eventIndex - 1]);
    for (
      let happeningCount = 0;
      happeningCount <= numberOfEvents;
      happeningCount++
    ) {
      // Probability of happeningCount events happening without considering the current event
      probabilityTable[eventIndex][happeningCount] = probabilityTable[
        eventIndex - 1
      ][happeningCount].times(new Big(1).minus(currentEventProbability));
      if (happeningCount > 0) {
        // Add the probability of happeningCount events happening considering the current event
        probabilityTable[eventIndex][happeningCount] = probabilityTable[
          eventIndex
        ][happeningCount].plus(
          probabilityTable[eventIndex - 1][happeningCount - 1].times(
            currentEventProbability,
          ),
        );
      }
    }
  }

  return probabilityTable[numberOfEvents];
};

export const calcExactSuccessChances = (dices: Dices) => {
  const diceChances = Object.entries(dices).reduce<number[]>(
    (acc, [face, diceSet]) => {
      const faceInt = parseInt(face, 10) as Face;
      const success = (FACES.length - faceInt + 1) / FACES.length;
      acc.push(...diceSet.map(() => success));
      return acc;
    },
    [],
  );
  const probabilityList = calculateProbabilityList(diceChances);

  const chances: number[] = new Array(probabilityList.length).fill(0);
  const start = probabilityList.length - 1;
  for (let i = start; i >= 0; i -= 1) {
    const chance = probabilityList[i];
    chances[i] = chance.toNumber();
  }

  return chances;
};

export const calcAccumulativeSuccessChances = (probabilityList: number[]) => {
  const chances: number[] = new Array(probabilityList.length).fill(0);
  const start = probabilityList.length - 1;
  for (let i = start; i >= 0; i -= 1) {
    const chance = Big(probabilityList[i]);
    chances[i] = chance
      .plus(i === start || i === 0 ? 0 : chances[i + 1])
      .toNumber();
  }

  return chances;
};

export const getSuccessesText = (
  successes: number,
  total: number,
  showExactResult: boolean,
) => {
  if (successes === 0) {
    return 'No hits';
  }
  if (successes === total - 1) {
    return `All (${successes})`;
  }

  const hits = `${successes} hit${successes > 1 ? 's' : ''}`;
  return `${showExactResult ? 'Exactly' : 'At least'} ${hits}`;
};

export const getChanceText = (chance: number) => {
  chance *= 100;

  if (chance === 100) {
    return '100';
  }
  if (chance > 99.99) {
    return '99.99';
  }
  if (chance === 0) {
    return '0';
  }
  if (chance < 0.01) {
    return '0.01';
  }

  return chance.toFixed(2);
};
