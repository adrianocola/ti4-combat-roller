import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {persistor, store} from '@/store';
import {PersistGate} from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';

import CombatRoller from './src/CombatRoller';
import {initAnalytics} from '@/services/analytics';

initAnalytics();
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
