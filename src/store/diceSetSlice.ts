import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {ColorSet, MAX_DICE_SET, MAX_ROLL_MS, MIN_ROLL_MS} from '@data/consts';
import {randomFace, randomId, randomNumber} from '@utils/random';

export type DiceSetState = Record<ColorSet, DiceData>;

const initialDiceSetData: DiceData = {
  dices: {},
  results: {},
  rolling: false,
  rollId: 0,
};

const initialState: DiceSetState = {
  [ColorSet.Orange]: initialDiceSetData,
  [ColorSet.Blue]: initialDiceSetData,
  [ColorSet.Green]: initialDiceSetData,
  [ColorSet.Purple]: initialDiceSetData,
  [ColorSet.Gray]: initialDiceSetData,
};

export const diceSetSlice = createSlice({
  name: 'diceSet',
  initialState,
  reducers: {
    addDice: (
      state,
      action: PayloadAction<{colorSet: ColorSet; face: Face}>,
    ) => {
      const dices =
        state[action.payload.colorSet].dices[action.payload.face] ?? [];

      if (dices.length >= MAX_DICE_SET) {
        return;
      }

      dices.push({
        id: randomId(),
        face: action.payload.face,
        duration: 0,
        success: false,
      });

      state[action.payload.colorSet].dices[action.payload.face] = dices;
    },
    removeDice: (
      state,
      action: PayloadAction<{colorSet: ColorSet; face: Face}>,
    ) => {
      const dices =
        state[action.payload.colorSet].dices[action.payload.face] ?? [];

      dices.pop();

      state[action.payload.colorSet].dices[action.payload.face] = dices;
    },
    reset: (state, action: PayloadAction<{colorSet: ColorSet}>) => {
      state[action.payload.colorSet] = initialDiceSetData;
    },
    roll: (state, action: PayloadAction<{colorSet: ColorSet}>) => {
      const dices: Dices = {};
      Object.entries(state[action.payload.colorSet].dices).forEach(
        ([face, set]) => {
          const faceInt = parseInt(face, 10) as Face;
          dices[faceInt] = set.map(item => {
            const value = randomFace();
            return {
              ...item,
              duration: randomNumber(MIN_ROLL_MS, MAX_ROLL_MS),
              success: value >= faceInt,
              face: value,
            };
          });
        },
      );

      state[action.payload.colorSet] = {
        dices,
        results: {},
        rolling: true,
        rollId: Date.now(),
      };
    },
    registerSuccess: (
      state,
      action: PayloadAction<{colorSet: ColorSet; face: Face}>,
    ) => {
      state[action.payload.colorSet].results[action.payload.face] =
        (state[action.payload.colorSet].results[action.payload.face] ?? 0) + 1;
    },
    finishRolling: (state, action: PayloadAction<{colorSet: ColorSet}>) => {
      state[action.payload.colorSet].rolling = false;
    },
  },
});

export const {
  addDice,
  removeDice,
  reset,
  roll,
  registerSuccess,
  finishRolling,
} = diceSetSlice.actions;

export default diceSetSlice.reducer;
