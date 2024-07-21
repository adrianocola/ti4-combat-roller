import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Aptabase from '@aptabase/react-native';
import {Provider} from 'react-redux';
import {store} from '@store/index';

import CombatRoller from './src/CombatRoller';

Aptabase.init('A-US-9839136162');

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <CombatRoller />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
