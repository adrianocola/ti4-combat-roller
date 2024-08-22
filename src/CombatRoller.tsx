import React, {useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {InteractionManager, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import colors from '@/data/colors';
import {store} from '@/store';
import {downloadMoreRandomData} from '@/utils/dice';
import {Events, trackEvent} from '@/services/analytics';
import RollBar from '@/components/RollBar';
import DiceSets from '@/components/DiceSets';

const CombatRoller = () => {
  const {top, bottom} = useSafeAreaInsets();

  useEffect(() => {
    trackEvent(Events.OPEN, {
      colorSet: store.getState().settings.selectedColorSet,
    });

    downloadMoreRandomData();

    InteractionManager.runAfterInteractions(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.content, {paddingTop: top}]}>
        <DiceSets />
      </View>
      <View style={[styles.footer, {paddingBottom: bottom}]}>
        <RollBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    paddingTop: 15,
    width: '100%',
    backgroundColor: colors.BACKGROUND,
  },
});

export default CombatRoller;
