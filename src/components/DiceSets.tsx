import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import DiceList from '@/components/DiceList';
import {BASE_SCREEN_ORDER, ColorSet} from '@/data/consts';
import {NativeSyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import {NativeScrollEvent} from 'react-native/Libraries/Components/ScrollView/ScrollView';
import {Events, trackEvent} from '@/services/analytics';
import {
  setSelectedColorSet,
  setShowInitialAnimation,
} from '@/store/settingsSlice';
import {arrayRotate} from '@/utils/array';
import {store} from '@/store';
import {useAppDispatch, useAppSelector} from '@/hooks/storeHooks';

const centerScreenOrder = (
  screenOrder: ColorSet[],
  selectedColorSet: ColorSet,
) => {
  const selectedIndex = screenOrder.indexOf(selectedColorSet);
  return arrayRotate(screenOrder, selectedIndex - 2);
};

const DiceSets = () => {
  const dispatch = useAppDispatch();
  const {width} = useWindowDimensions();
  const selectedColorSet = useAppSelector(
    state => state.settings.selectedColorSet,
  );
  const [screenOrder, setScreenOrder] = useState(() =>
    centerScreenOrder(BASE_SCREEN_ORDER, selectedColorSet),
  );

  const scrollRef = useRef<ScrollView>(null);
  const selectedColorSetRef = useRef(selectedColorSet);
  const screenOrderRef = useRef(screenOrder);

  selectedColorSetRef.current = selectedColorSet;
  screenOrderRef.current = screenOrder;

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const selectedIndex = Math.round(
        event.nativeEvent.contentOffset.x / width,
      );

      const newColorSet = screenOrderRef.current?.[selectedIndex];
      if (newColorSet === selectedColorSetRef.current) return;

      trackEvent(Events.CHANGE_SET, {colorSet: newColorSet});

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
    // show litte animation the first time the user opens the app,
    // so it knows that there are other dice set colors to choose from
    setTimeout(() => {
      const showInitialAnimation =
        store.getState().settings.showInitialAnimation;

      if (!showInitialAnimation) return;

      store.dispatch(setShowInitialAnimation({showInitialAnimation: false}));
      scrollRef.current?.scrollTo({x: 2 * width + 70, y: 0, animated: true});
      setTimeout(() => {
        scrollRef.current?.scrollTo({x: 2 * width, y: 0, animated: true});
      }, 600);
    }, 500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
  );
};

export default DiceSets;
