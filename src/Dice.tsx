import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, TextProps, View} from 'react-native';
import {FACES_3} from './consts';
import colors from './colors';
import {DiceConfig, Face} from './types';

const SIZE = 20;
const FINAL_MS = 250;

interface DiceProps {
  textProps?: TextProps;
  initialFace: Face;
  rollId: number;
  dice: DiceConfig;
}

const getPosition = (value: Face, fromEnd?: boolean) => {
  const index = fromEnd
    ? FACES_3.findLastIndex(p => p === value)
    : FACES_3.findIndex(p => p === value);
  return index * SIZE * -1;
};

const Dice: React.FC<DiceProps> = ({textProps, initialFace, rollId, dice}) => {
  const stylePos = useSharedValue(getPosition(initialFace));
  const styleFrameBackground = useSharedValue('transparent');
  const styleFrameBorder = useSharedValue(colors.WHITE);
  const styleTextColor = useSharedValue(colors.WHITE);
  const currentRollIdRef = useRef(rollId);

  useEffect(() => {
    if (rollId === currentRollIdRef.current) {
      return;
    }

    currentRollIdRef.current = rollId;

    const {face, duration, success} = dice;
    stylePos.value = withSequence(
      withTiming(getPosition(face, true), {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(getPosition(face), {duration: 0}),
    );
    styleFrameBackground.value = withSequence(
      withTiming('transparent', {duration: 0}),
      withDelay(
        duration - FINAL_MS,
        withTiming(success ? colors.WHITE : 'transparent', {
          duration: FINAL_MS,
        }),
      ),
    );
    styleFrameBorder.value = withSequence(
      withTiming(colors.WHITE, {duration: 0}),
      withDelay(
        duration - FINAL_MS,
        withTiming(success ? colors.WHITE : colors.GRAY, {
          duration: FINAL_MS,
        }),
      ),
    );
    styleTextColor.value = withSequence(
      withTiming(colors.WHITE, {duration: 0}),
      withDelay(
        duration - FINAL_MS,
        withTiming(success ? colors.BLACK : colors.GRAY, {
          duration: FINAL_MS,
        }),
      ),
    );
  }, [
    dice,
    rollId,
    styleFrameBackground,
    styleFrameBorder,
    stylePos,
    styleTextColor,
  ]);

  const animatedFrameStyles = useAnimatedStyle(() => ({
    backgroundColor: styleFrameBackground.value,
    borderColor: styleFrameBorder.value,
  }));

  const animatedInnerStyles = useAnimatedStyle(() => ({
    transform: [{translateY: stylePos.value}],
  }));

  const animatedTextStyles = useAnimatedStyle(() => ({
    color: styleTextColor.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.frame,
          animatedFrameStyles,
          // showSuccess && styles.frameSuccess,
          // showFailure && styles.frameFailure,
        ]}
      />
      <View style={styles.roller}>
        <Animated.View style={animatedInnerStyles}>
          {FACES_3.map((v, i) => (
            <Animated.Text
              key={i}
              adjustsFontSizeToFit={false}
              allowFontScaling={false}
              {...textProps}
              style={[
                styles.text,
                // showSuccess && styles.textSuccess,
                // showFailure && styles.textFailure,
                animatedTextStyles,
              ]}>
              {v === 10 ? 0 : v}
            </Animated.Text>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    margin: 5,
  },
  roller: {
    overflow: 'hidden',
    height: SIZE,
  },
  text: {
    height: SIZE,
    lineHeight: SIZE,
    color: colors.WHITE,
  },
  textSuccess: {
    color: colors.BLACK,
  },
  textFailure: {
    color: colors.GRAY,
  },
  frame: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.WHITE,
    transform: [{rotate: '45deg'}],
  },
  frameSuccess: {
    backgroundColor: colors.WHITE,
  },
  frameFailure: {
    borderColor: colors.GRAY,
  },
});

export default React.memo(Dice);
