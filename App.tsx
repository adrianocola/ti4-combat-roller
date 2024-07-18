import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Aptabase from '@aptabase/react-native';
import CombatRoller from './src/CombatRoller';

Aptabase.init('A-US-9839136162');

const App = () => {
  return (
    <SafeAreaProvider>
      <CombatRoller />
      {/*<SafeAreaView style={{flex: 1, flexGrow: 1}}>*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      height: 20,*/}
      {/*      width: 20,*/}
      {/*      borderColor: 'black',*/}
      {/*      borderWidth: 1,*/}
      {/*      overflow: 'hidden',*/}
      {/*    }}>*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        height: 60,*/}
      {/*        backgroundColor: 'red',*/}
      {/*        lineHeight: 20,*/}
      {/*        textAlign: 'center',*/}
      {/*        transform: [{translateY: -10}],*/}
      {/*      }}>*/}
      {/*      1{'\n'}2{'\n'}3*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*</SafeAreaView>*/}
    </SafeAreaProvider>
  );
};

export default App;
