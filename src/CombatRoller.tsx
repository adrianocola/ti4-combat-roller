import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import ResetImage from '@assets/reset.png';
import D10Image from '@assets/d10.png';

import colors from '@/data/colors';
import Colors from '@/data/colors';
import {BASE_SCREEN_ORDER, ColorSet} from '@/data/consts';
import ButtonImage from '@/components/ButtonImage';
import StatsModal from '@/components/StatsModal';
import Button from '@/components/Button';
import DiceList from '@/components/DiceList';
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import {arrayRotate, arraySum} from '@/utils/array';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';
import {reset, roll, setRolling} from '@/store/diceSetSlice';
import {
  setSelectedColorSet,
  setShowInitialAnimation,
} from '@/store/settingsSlice';
import {getChanceText} from '@/utils/chance';
import {store} from '@/store';
import {rollDices, downloadMoreRandomData} from '@/utils/dice';

const centerScreenOrder = (
  screenOrder: ColorSet[],
  selectedColorSet: ColorSet,
) => {
  const selectedIndex = screenOrder.indexOf(selectedColorSet);
  return arrayRotate(screenOrder, selectedIndex - 2);
};

const CombatRoller = () => {
  const scrollRef = useRef<ScrollView>(null);
  const {top, bottom} = useSafeAreaInsets();
  const dicesColorSet = useAppSelector(state => state.diceSet);
  const selectedColorSet = useAppSelector(
    state => state.settings.selectedColorSet,
  );
  const dispatch = useAppDispatch();

  const [screenOrder, setScreenOrder] = useState(() =>
    centerScreenOrder(BASE_SCREEN_ORDER, selectedColorSet),
  );
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

  const selectedColorSetRef = useRef(selectedColorSet);
  selectedColorSetRef.current = selectedColorSet;

  const screenOrderRef = useRef(screenOrder);
  screenOrderRef.current = screenOrder;

  const canRoll = !dicesColorSet[selectedColorSet].rolling && diceCount !== 0;

  const onRoll = useCallback(async () => {
    dispatch(setRolling({colorSet: selectedColorSet, rolling: true}));

    const {dices, chances, chancesAccumulative} =
      await rollDices(selectedColorSet);

    dispatch(
      roll({colorSet: selectedColorSet, dices, chances, chancesAccumulative}),
    );
  }, [dispatch, selectedColorSet]);

  const onReset = useCallback(() => {
    dispatch(reset({colorSet: selectedColorSet}));
  }, [dispatch, selectedColorSet]);

  const toggleStatsModal = useCallback(() => {
    setStatsModalVisible(prevStatsModalVisible => !prevStatsModalVisible);
  }, []);

  const resultsTotal = useMemo(() => {
    return arraySum(Object.values(dicesColorSet[selectedColorSet].results));
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

      dispatch(setSelectedColorSet({selectedColorSet: newColorSet}));
      setScreenOrder(prevScreenOrder =>
        arrayRotate(prevScreenOrder, selectedIndex - 2),
      );
    },
    [width, dispatch],
  );

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({x: 2 * width, y: 0, animated: false});
  }, [screenOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    downloadMoreRandomData();

    requestAnimationFrame(() => {
      SplashScreen.hideAsync();
    });

    // show litte animation the first time the user opens the app,
    // so it knows that there are other dice set colors to choose from
    setTimeout(() => {
      const showInitialAnimation =
        store.getState().settings.showInitialAnimation;
      if (showInitialAnimation) {
        store.dispatch(setShowInitialAnimation({showInitialAnimation: false}));
        scrollRef.current?.scrollTo({x: 2 * width + 70, y: 0, animated: true});
        setTimeout(() => {
          scrollRef.current?.scrollTo({x: 2 * width, y: 0, animated: true});
        }, 600);
      }
    }, 500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          {screenOrder.map(colorSet => (
            <View key={colorSet} style={{width}}>
              <DiceList colorSet={colorSet as ColorSet} />
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
            image={ResetImage}
            imageSize={26}
          />
          <Button
            style={styles.resultButton}
            transparent
            disabled={diceCount === 0}
            onPress={toggleStatsModal}>
            <View style={styles.resultContent}>
              <Text style={styles.resultText}>{resultsTotal}</Text>
              <Text style={styles.statsText}>
                {dicesColorSet[selectedColorSet].chancesAccumulative.length
                  ? `${getChanceText(dicesColorSet[selectedColorSet].chancesAccumulative[resultsTotal])}%`
                  : '%'}
              </Text>
            </View>
          </Button>
          <ButtonImage
            style={styles.footerButton}
            disabled={!canRoll}
            onPress={onRoll}
            image={D10Image}
          />
        </View>
      </View>
      <StatsModal
        colorSet={selectedColorSet}
        resultsTotal={resultsTotal}
        diceCount={diceCount}
        visible={statsModalVisible}
        onClose={toggleStatsModal}
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
    backgroundColor: colors.BACKGROUND_RESET,
  },
  resultButton: {
    flex: 1,
    paddingVertical: 0,
  },
  resultContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    color: colors.WHITE,
    fontSize: 32,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsText: {
    color: Colors.GRAY_DARK,
    fontSize: 12,
    lineHeight: 12,
    height: 10,
    textAlign: 'center',
  },
});

export default CombatRoller;
