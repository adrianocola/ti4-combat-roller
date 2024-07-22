import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Aptabase from '@aptabase/react-native';
import {Provider} from 'react-redux';
import {persistor, store} from '@store/index';
import {PersistGate} from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';

import CombatRoller from './src/CombatRoller';

// @ts-ignore
Aptabase.init(process.env.EXPO_PUBLIC_APTABASE);
SplashScreen.preventAutoHideAsync();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <CombatRoller />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
