import {combineReducers, configureStore} from '@reduxjs/toolkit';
import storage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import dicesReducer from './diceSetSlice';
import settingsReduces from './settingsSlice';

const persistConfig = {
  version: 1,
  key: 'redux',
  storage,
  blacklist: ['diceSet'],
};

const rootReducer = combineReducers({
  diceSet: dicesReducer,
  settings: settingsReduces,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: false,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
