import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import CombatRoller from './src/CombatRoller';

const App = () => {
  return (
    <SafeAreaProvider>
      <CombatRoller />
    </SafeAreaProvider>
  );
};

export default App;
