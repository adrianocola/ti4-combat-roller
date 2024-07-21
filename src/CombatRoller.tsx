import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StatusBar} from 'expo-status-bar';
import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {trackEvent} from '@aptabase/react-native';

import RefreshImage from '@assets/refresh.png';
import D10Image from '@assets/d10.png';

import colors from '@data/colors';
import {randomFace, randomNumber, randomString} from '@utils/random';
import {
  ColorSet,
  MAX_DICE_SET,
  MAX_ROLL_MS,
  MIN_ROLL_MS,
  RESULT_UPDATE_FREQ_MS,
} from '@data/consts';
import ButtonImage from '@components/ButtonImage';
import StatsModal from '@components/StatsModal';
import Button from '@components/Button';
import DiceList from '@components/DiceList';
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import {arrayRotate} from '@utils/array';

const BASE_SCREENS_ORDER = [
  ColorSet.Gray,
  ColorSet.Orange,
  ColorSet.Blue,
  ColorSet.Green,
];

const CombatRoller = () => {
  const scrollRef = useRef<ScrollView>(null);
  const {top, bottom} = useSafeAreaInsets();
  const [dicesColorSet, setDicesColorSet] = useState<DicesColorSet>(() => ({
    [ColorSet.Orange]: {dices: {}, results: {}, rolling: false, rollId: 0},
    [ColorSet.Blue]: {dices: {}, results: {}, rolling: false, rollId: 0},
    [ColorSet.Green]: {dices: {}, results: {}, rolling: false, rollId: 0},
    [ColorSet.Purple]: {dices: {}, results: {}, rolling: false, rollId: 0},
    [ColorSet.Gray]: {dices: {}, results: {}, rolling: false, rollId: 0},
  }));
  const [selectedColorSet, setSelectedColorSet] = useState<ColorSet>(
    ColorSet.Orange,
  );
  const [screenOrder, setScreenOrder] = useState(() => [
    ColorSet.Purple,
    ColorSet.Gray,
    ColorSet.Orange,
    ColorSet.Blue,
    ColorSet.Green,
  ]);
  const {width} = useWindowDimensions();
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const diceCount = useMemo(
    () =>
      Object.values(dicesColorSet[selectedColorSet].dices).reduce(
        (acc, set) => acc + set.length,
        0,
      ),
    [dicesColorSet, selectedColorSet],
  );
  const diceCountRef = useRef(diceCount);

  const selectedColorSetRef = useRef(selectedColorSet);
  selectedColorSetRef.current = selectedColorSet;

  const screenOrderRef = useRef(screenOrder);
  screenOrderRef.current = screenOrder;

  const canRoll = !dicesColorSet[selectedColorSet].rolling && diceCount !== 0;

  const onAddDice = useCallback((colorSet: ColorSet, face: Face) => {
    setDicesColorSet(prevDicesColorSet => {
      const set = [...(prevDicesColorSet[colorSet].dices[face] ?? [])];

      if (set.length >= MAX_DICE_SET) {
        return prevDicesColorSet;
      }

      set.push({
        id: randomString(),
        face,
        duration: 0,
        success: false,
      });

      return {
        ...prevDicesColorSet,
        [colorSet]: {
          ...prevDicesColorSet[colorSet],
          dices: {
            ...prevDicesColorSet[colorSet].dices,
            [face]: set.map(item => ({...item, success: false})),
          },
        },
      };
    });
  }, []);

  const onRemoveDice = useCallback((colorSet: ColorSet, face: Face) => {
    setDicesColorSet(prevDicesColorSet => {
      const set = [...(prevDicesColorSet[colorSet].dices[face] ?? [])];
      if (!set.length) {
        return prevDicesColorSet;
      }

      set.pop();
      return {
        ...prevDicesColorSet,
        [colorSet]: {
          ...prevDicesColorSet[colorSet],
          dices: {
            ...prevDicesColorSet[colorSet].dices,
            [face]: set.map(item => ({...item, success: false})),
          },
        },
      };
    });
  }, []);

  const onReset = useCallback(() => {
    trackEvent('reset', {
      colorSet: selectedColorSet,
      diceCount: diceCountRef.current,
    });
    setDicesColorSet(prevDicesColorSet => ({
      ...prevDicesColorSet,
      [selectedColorSet]: {dices: {}, results: {}, rolling: false, rollId: 0},
    }));
  }, [selectedColorSet]);

  const onRoll = useCallback(() => {
    setDicesColorSet(prevDicesColorSet => {
      const dices: Dices = {};
      Object.entries(prevDicesColorSet[selectedColorSet].dices).forEach(
        ([face, set]) => {
          const faceInt = parseInt(face, 10) as Face;
          dices[faceInt] = set.map(item => {
            const value = randomFace();
            return {
              ...item,
              duration: randomNumber(MIN_ROLL_MS, MAX_ROLL_MS),
              success: value >= faceInt,
              face: value,
            };
          });
        },
      );

      return {
        ...prevDicesColorSet,
        [selectedColorSet]: {
          dices,
          results: {},
          rolling: true,
          rollId: Date.now(),
        },
      };
    });
  }, [selectedColorSet]);

  useEffect(() => {
    if (
      !dicesColorSet[selectedColorSet].rollId ||
      !dicesColorSet[selectedColorSet].rolling
    ) {
      return;
    }

    const eventData: Record<string, number> = {};
    const resultsIntervals: Record<number, Results> = {};
    let highestDuration = 0;
    let successCount = 0;

    Object.entries(dicesColorSet[selectedColorSet].dices).forEach(
      ([face, set]) => {
        const faceInt = parseInt(face, 10) as Face;
        let faceSuccessCount = 0;
        eventData[`faceCount${face}`] = set.length;
        set.forEach(item => {
          highestDuration = Math.max(highestDuration, item.duration);
          eventData[`resultCount${face}`] =
            (eventData[`resultCount${face}`] ?? 0) + 1;

          if (item.success) {
            faceSuccessCount += 1;
            const resultInterval =
              Math.floor(item.duration / RESULT_UPDATE_FREQ_MS) + 1;
            const result = resultsIntervals[resultInterval] ?? {};
            result[faceInt] = (result[faceInt] ?? 0) + 1;
            resultsIntervals[resultInterval] = result;
          }
        });
        successCount += faceSuccessCount;
        eventData[`faceSuccess${face}`] = faceSuccessCount;
      },
    );
    eventData.successCount = successCount;
    eventData.diceCount = diceCountRef.current;

    Object.entries(resultsIntervals).forEach(([interval, result]) => {
      const intervalInt = parseInt(interval, 10);
      setTimeout(() => {
        setDicesColorSet(prevDicesColorSet => ({
          ...prevDicesColorSet,
          [selectedColorSet]: {
            ...prevDicesColorSet[selectedColorSet],
            results: Object.entries(result).reduce(
              (acc, [face, value]) => {
                const faceInt = parseInt(face, 10) as Face;
                acc[faceInt] = (acc[faceInt] ?? 0) + value;
                return acc;
              },
              {...prevDicesColorSet[selectedColorSet].results},
            ),
          },
        }));
      }, intervalInt * RESULT_UPDATE_FREQ_MS);
    });

    trackEvent('roll', {
      ...eventData,
      colorSet: selectedColorSet,
    });

    setTimeout(() => {
      setDicesColorSet(prevDicesColorSet => ({
        ...prevDicesColorSet,
        [selectedColorSet]: {
          ...prevDicesColorSet[selectedColorSet],
          rolling: false,
        },
      }));
    }, highestDuration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dicesColorSet[selectedColorSet].rollId, // eslint-disable-line react-hooks/exhaustive-deps
    dicesColorSet[selectedColorSet].rolling, // eslint-disable-line react-hooks/exhaustive-deps
  ]);

  const resultsTotal = useMemo(() => {
    return Object.values(dicesColorSet[selectedColorSet].results).reduce(
      (a, r) => a + r,
      0,
    );
  }, [dicesColorSet, selectedColorSet]);

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const selectedIndex = Math.round(
        event.nativeEvent.contentOffset.x / width,
      );

      const newColorSet = screenOrderRef.current?.[selectedIndex];
      if (newColorSet === selectedColorSetRef.current) {
        return;
      }

      setSelectedColorSet(newColorSet);
      setScreenOrder(prevScreenOrder =>
        arrayRotate(prevScreenOrder, selectedIndex - 2),
      );
    },
    [width],
  );

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({x: 2 * width, y: 0, animated: false});
  }, [screenOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.content, {paddingTop: top}]}>
        <ScrollView
          ref={scrollRef}
          contentOffset={{x: 2 * width, y: 0}}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}>
          {screenOrder.map((colorSet, index) => (
            <View key={colorSet} style={{width}}>
              <DiceList
                colorSet={colorSet as ColorSet}
                rollId={dicesColorSet[colorSet].rollId}
                dices={dicesColorSet[colorSet].dices}
                results={dicesColorSet[colorSet].results}
                rolling={dicesColorSet[colorSet].rolling}
                onAddDice={onAddDice}
                onRemoveDice={onRemoveDice}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={[styles.footer, {paddingBottom: bottom}]}>
        <View style={styles.footerContent}>
          <ButtonImage
            style={[styles.footerButton, styles.footerRefresh]}
            disabled={!canRoll}
            onPress={onReset}
            image={RefreshImage}
          />
          <Button
            style={styles.resultButton}
            title={resultsTotal}
            titleStyle={styles.resultText}
            transparent
            disabled={Object.keys(dicesColorSet[selectedColorSet]).length === 0}
            onPress={() => setStatsModalVisible(true)}
          />
          <ButtonImage
            style={styles.footerButton}
            disabled={!canRoll}
            onPress={onRoll}
            image={D10Image}
          />
        </View>
      </View>
      <StatsModal
        dices={dicesColorSet[selectedColorSet].dices}
        resultsTotal={resultsTotal}
        visible={statsModalVisible}
        onClose={() => setStatsModalVisible(false)}
      />
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
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 20,
  },
  footerRefresh: {
    backgroundColor: colors.BACKGROUND_FOOTER_RESET,
  },
  resultButton: {
    flex: 1,
  },
  resultText: {
    color: colors.WHITE,
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CombatRoller;
