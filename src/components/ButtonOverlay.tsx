import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import React, {useEffect, useRef} from 'react';
import {Pressable, StyleSheet, Text, ViewStyle} from 'react-native';
import colors from '@/data/colors';
import {GestureResponderEvent} from 'react-native/Libraries/Types/CoreEventTypes';

interface Props {
  text: string;
  disabled?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

const SWIPE_CHANGE_X_THRESHOLD = 10;
const SWIPE_DETECTION_THRESHOLD = 100;
const IN_DURATION = 200;
const OUT_DURATION = 300;

const ButtonOverlay: React.FC<Props> = ({text, disabled, style, onPress}) => {
  const pressInPageX = useRef(0);
  const swiping = useRef(false);
  const opacity = useSharedValue(0);

  const outTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const onPressIn = ({nativeEvent}: GestureResponderEvent) => {
    pressInPageX.current = nativeEvent.pageX;
    swiping.current = false;

    clearTimeout(outTimeoutRef.current);
    setTimeout(() => {
      if (swiping.current) return;
      opacity.value = withTiming(1, {duration: IN_DURATION});
    }, SWIPE_DETECTION_THRESHOLD);
  };

  const onPressOut = ({nativeEvent}: GestureResponderEvent) => {
    // if the onPressOut was called because user is swiping the scrollView, pageX will be undefined on iOS
    // on Android, we check if the pageX is different from the pressInPageX
    swiping.current =
      nativeEvent.pageX === undefined ||
      Math.abs(nativeEvent.pageX - pressInPageX.current) >
        SWIPE_CHANGE_X_THRESHOLD;

    if (swiping.current) {
      opacity.value = 0;
    } else {
      outTimeoutRef.current = setTimeout(() => {
        opacity.value = withTiming(0, {duration: OUT_DURATION});
      }, SWIPE_DETECTION_THRESHOLD + IN_DURATION);
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(outTimeoutRef.current);
    };
  }, []);

  return (
    <Pressable
      style={styles.pressable}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}>
      <Animated.View style={[style, {opacity}]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  text: {
    color: colors.WHITE,
    fontSize: 64,
    lineHeight: 64,
    textShadowColor: colors.BLACK,
    textShadowRadius: 3,
  },
});

export default React.memo(ButtonOverlay);
