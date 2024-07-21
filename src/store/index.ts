import {configureStore} from '@reduxjs/toolkit';
import dicesReducer from './diceSetSlice';

export const store = configureStore({
  reducer: {
    diceSet: dicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
