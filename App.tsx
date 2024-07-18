import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Aptabase from '@aptabase/react-native';
import CombatRoller from './src/CombatRoller';

Aptabase.init('A-US-9839136162');

const App = () => {
  return (
    <SafeAreaProvider>
      <CombatRoller />
    </SafeAreaProvider>
  );
};

export default App;
