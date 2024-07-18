import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';
import {trackEvent} from '@aptabase/react-native';

import colors from './colors';
import {randomFace, randomNumber} from './random';
import {
  FACES_REVERSED,
  MAX_DICE_SET,
  MAX_ROLL_MS,
  MIN_ROLL_MS,
  RESULT_UPDATE_FREQ_MS,
} from './consts';
import DiceLine from './DiceLine';
import {Dices, Face, Results} from './types';

const CombatRoller = () => {
  const {top, bottom} = useSafeAreaInsets();
  const [dices, setDices] = useState<Dices>({});
  const [rolling, setRolling] = useState(false);
  const [rollId, setRollId] = useState(0);
  const [results, setResults] = useState<Results>({});
  const currentRollIdRef = useRef(rollId);
  const diceCount = useMemo(
    () => Object.values(dices).reduce((acc, set) => acc + set.length, 0),
    [dices],
  );
  const diceCountRef = useRef(diceCount);
  const canRoll = !rolling && diceCount !== 0;

  const onAddOrRemoveDice = useCallback((face: Face, remove = false) => {
    setDices(prevDices => {
      const newDices = {...prevDices};
      const set = [...(newDices[face] ?? [])];

      if (remove) {
        if (set.length) {
          set.pop();
        }
      } else if (set.length < MAX_DICE_SET) {
        const id = Crypto.randomUUID();
        set.push({
          id,
          face,
          duration: 0,
          success: false,
        });
      }

      newDices[face] = set.map(item => ({...item, success: false}));
      return newDices;
    });
  }, []);

  const onReset = useCallback(() => {
    trackEvent('reset', {diceCount: diceCountRef.current});
    setDices({});
    setResults({});
  }, []);

  const onRoll = useCallback(() => {
    setRolling(true);

    setResults({});
    setDices(prevDices => {
      const newDices: Dices = {};
      Object.entries(prevDices).forEach(([face, set]) => {
        const faceInt = parseInt(face, 10) as Face;
        newDices[parseInt(face, 10) as Face] = set.map(item => {
          const value = randomFace();
          return {
            ...item,
            duration: randomNumber(MIN_ROLL_MS, MAX_ROLL_MS),
            success: value >= faceInt,
            face: value,
          };
        });
      });
      return newDices;
    });
    setRollId(Date.now());
  }, []);

  useEffect(() => {
    if (currentRollIdRef.current === rollId) {
      return;
    }

    const eventData: Record<string, number> = {};
    const resultsIntervals: Record<number, Results> = {};
    let highestDuration = 0;
    let successCount = 0;

    Object.entries(dices).forEach(([face, set]) => {
      const faceInt = parseInt(face, 10) as Face;
      let faceSuccessCount = 0;
      eventData[`faceCount${face}`] = set.length;
      set.forEach(item => {
        highestDuration = Math.max(highestDuration, item.duration);
        eventData[`resultCount${face}`] =
          (eventData[`resultCount${face}`] ?? 0) + 1;

        if (item.success) {
          faceSuccessCount + 1;
          const resultInterval =
            Math.floor(item.duration / RESULT_UPDATE_FREQ_MS) + 1;
          const result = resultsIntervals[resultInterval] ?? {};
          result[faceInt] = (result[faceInt] ?? 0) + 1;
          resultsIntervals[resultInterval] = result;
        }
      });
      successCount += faceSuccessCount;
      eventData[`faceSuccess${face}`] = faceSuccessCount;
    });
    eventData.successCount = successCount;
    eventData.diceCount = diceCountRef.current;

    Object.entries(resultsIntervals).forEach(([interval, result]) => {
      const intervalInt = parseInt(interval, 10);
      setTimeout(() => {
        setResults(prevResults => {
          const newResults = {...prevResults};
          Object.entries(result).map(([face, value]) => {
            const faceInt = parseInt(face, 10) as Face;
            newResults[faceInt] = (newResults[faceInt] ?? 0) + value;
          });

          return newResults;
        });
      }, intervalInt * RESULT_UPDATE_FREQ_MS);
    });

    trackEvent('roll', eventData);

    setTimeout(() => {
      setRolling(false);
      currentRollIdRef.current = rollId;
    }, highestDuration);
  }, [dices, rollId]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.content, {paddingTop: top}]}>
        {FACES_REVERSED.map(face => (
          <DiceLine
            key={face}
            face={face}
            dices={dices[face]}
            rolling={rolling}
            rollId={rollId}
            result={results?.[face] ?? 0}
            onAddOrRemoveDice={onAddOrRemoveDice}
          />
        ))}
      </View>
      <View style={[styles.footer, {paddingBottom: bottom}]}>
        <View style={styles.footerContent}>
          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.footerRefresh,
              !canRoll && styles.footerButtonDisabled,
            ]}
            disabled={!canRoll}
            onPress={onReset}>
            <Image
              source={require('../assets/refresh.png')}
              style={styles.footerDice}
            />
          </TouchableOpacity>
          <Text style={[styles.text, styles.result]}>
            {Object.values(results).reduce((a, r) => a + r, 0)}
          </Text>
          <TouchableOpacity
            style={[
              styles.footerButton,
              !canRoll && styles.footerButtonDisabled,
            ]}
            disabled={!canRoll}
            onPress={onRoll}>
            <Image
              source={require('../assets/d10.png')}
              style={styles.footerDice}
            />
          </TouchableOpacity>
        </View>
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
  safeArea: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  footer: {
    paddingTop: 15,
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY,
    backgroundColor: colors.BACKGROUND_FOOTER,
  },
  footerContent: {
    paddingBottom: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerButton: {
    flexDirection: 'row',
    backgroundColor: colors.BACKGROUND_FOOTER_BUTTON,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: colors.WHITE,
    borderWidth: StyleSheet.hairlineWidth,
  },
  footerRefresh: {
    backgroundColor: colors.BACKGROUND_FOOTER_RESET,
  },
  footerButtonDisabled: {
    opacity: 0.25,
  },
  footerDice: {
    width: 26,
    height: 26,
  },
  text: {
    color: colors.WHITE,
  },
  result: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CombatRoller;
