import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AptabaseProvider} from '@aptabase/react-native';

import CombatRoller from './src/CombatRoller';

const App = () => {
  return (
    <AptabaseProvider appKey="A-US-9839136162">
      <SafeAreaProvider>
        <CombatRoller />
      </SafeAreaProvider>
    </AptabaseProvider>
  );
};

export default App;
