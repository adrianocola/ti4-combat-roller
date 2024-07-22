import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import {ColorSet} from '@data/consts';

export type SettingsState = {
  selectedColorSet: ColorSet;
  showInitialAnimation: boolean;
};

const initialState: SettingsState = {
  selectedColorSet: ColorSet.Orange,
  showInitialAnimation: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSelectedColorSet: (
      state,
      action: PayloadAction<{selectedColorSet: ColorSet}>,
    ) => {
      state.selectedColorSet = action.payload.selectedColorSet;
    },
    setShowInitialAnimation: (
      state,
      action: PayloadAction<{showInitialAnimation: boolean}>,
    ) => {
      state.showInitialAnimation = action.payload.showInitialAnimation;
    },
  },
});

export const {setSelectedColorSet, setShowInitialAnimation} =
  settingsSlice.actions;

export default settingsSlice.reducer;
