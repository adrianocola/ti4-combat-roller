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
  Image,
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
import InfoIcon from '@assets/info.png';

import colors from '@data/colors';
import Colors from '@data/colors';
import {BASE_SCREEN_ORDER, ColorSet} from '@data/consts';
import ButtonImage from '@components/ButtonImage';
import StatsModal from '@components/StatsModal';
import Button from '@components/Button';
import DiceList from '@components/DiceList';
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import {arrayRotate, arraySum} from '@utils/array';
import {useAppDispatch, useAppSelector} from '@hooks/storeHooks';
import {reset, roll} from '@store/diceSetSlice';
import {setSelectedColorSet} from '@store/preferencesSlice';
import {getChanceText} from '@utils/chance';

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
    state => state.preferences.selectedColorSet,
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

  const onRoll = useCallback(() => {
    dispatch(roll({colorSet: selectedColorSet}));
  }, [dispatch, selectedColorSet]);

  const onReset = useCallback(() => {
    dispatch(reset({colorSet: selectedColorSet}));
  }, [dispatch, selectedColorSet]);

  const onPrevPage = useCallback(() => {
    scrollRef.current?.scrollTo({x: width, y: 0, animated: true});
  }, [width]);

  const onNextPage = useCallback(() => {
    scrollRef.current?.scrollTo({x: 3 * width, y: 0, animated: true});
  }, [width]);

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
    requestAnimationFrame(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.content, {paddingTop: top}]}>
        <View style={styles.header}>
          <Button
            style={styles.headerButton}
            title="◀︎"
            onPress={onPrevPage}
            transparent
          />
          <Button
            style={styles.headerButton}
            onPress={toggleStatsModal}
            transparent>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>
                {dicesColorSet[selectedColorSet].chancesAccumulative.length
                  ? `${getChanceText(dicesColorSet[selectedColorSet].chancesAccumulative[resultsTotal])}%`
                  : '%'}
              </Text>
              <Image
                source={InfoIcon}
                style={styles.headerInfo}
                tintColor={Colors.WHITE}
              />
            </View>
          </Button>
          <Button
            style={styles.headerButton}
            title="▶︎"
            onPress={onNextPage}
            transparent
          />
        </View>
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
            title={resultsTotal}
            titleStyle={styles.resultText}
            transparent
            disabled={diceCount === 0}
            onPress={toggleStatsModal}
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
  safeArea: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  headerButton: {
    flex: 1,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.WHITE,
  },
  headerInfo: {
    width: 14,
    height: 14,
    marginLeft: 5,
  },
  footer: {
    paddingTop: 15,
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY,
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
  },
  resultText: {
    color: colors.WHITE,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CombatRoller;
