import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {ColorSet, MAX_DICE_SET} from '@/data/consts';
import {randomId} from '@/utils/random';

type Results = Partial<Record<Face, number>>;

export type DiceData = {
  dices: Dices;
  results: Results;
  chances: number[];
  chancesAccumulative: number[];
  rolling: boolean;
  rollId: number;
};

export type DiceSetState = Record<ColorSet, DiceData>;

const initialDiceSetData: DiceData = {
  dices: {},
  results: {},
  chances: [],
  chancesAccumulative: [],
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

      if (dices.length >= MAX_DICE_SET) return;

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
    roll: (
      state,
      action: PayloadAction<{
        colorSet: ColorSet;
        dices: Dices;
        chances: number[];
        chancesAccumulative: number[];
      }>,
    ) => {
      state[action.payload.colorSet] = {
        dices: action.payload.dices,
        results: {},
        chances: action.payload.chances,
        chancesAccumulative: action.payload.chancesAccumulative,
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
    setRolling: (
      state,
      action: PayloadAction<{colorSet: ColorSet; rolling: boolean}>,
    ) => {
      state[action.payload.colorSet].rolling = action.payload.rolling;
    },
  },
});

export const {addDice, removeDice, reset, roll, registerSuccess, setRolling} =
  diceSetSlice.actions;

export default diceSetSlice.reducer;
