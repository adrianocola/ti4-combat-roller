import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {ColorSet} from '@data/consts';

export type PreferencesState = {
  selectedColorSet: ColorSet;
};

const initialState: PreferencesState = {
  selectedColorSet: ColorSet.Orange,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setSelectedColorSet: (
      state,
      action: PayloadAction<{selectedColorSet: ColorSet}>,
    ) => {
      state.selectedColorSet = action.payload.selectedColorSet;
    },
  },
});

export const {setSelectedColorSet} = preferencesSlice.actions;

export default preferencesSlice.reducer;
