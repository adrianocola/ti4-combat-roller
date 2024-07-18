import Animated, {
  Easing,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import React, {useEffect, useRef} from 'react';
import {StyleSheet, TextProps, View} from 'react-native';
import {FACES_LIST} from '@data/consts';
import colors from '@data/colors';

const SIZE = 20;
const FINAL_MS = 250;
const FACES_TEXT = FACES_LIST.map(face => face).join('\n');

interface DiceProps {
  textProps?: TextProps;
  initialFace: Face;
  rollId: number;
  dice: DiceConfig;
}

const getPosition = (value: Face, fromEnd?: boolean) => {
  const index = fromEnd
    ? FACES_LIST.findLastIndex(p => p === value)
    : FACES_LIST.findIndex(p => p === value);
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

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.frame,
          {
            backgroundColor: styleFrameBackground,
            borderColor: styleFrameBorder,
          },
        ]}
      />
      <View style={styles.roller}>
        <Animated.Text
          adjustsFontSizeToFit={false}
          allowFontScaling={false}
          {...textProps}
          style={[
            styles.text,
            {
              color: styleTextColor,
              transform: [{translateY: stylePos}],
            },
          ]}>
          {FACES_TEXT}
        </Animated.Text>
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
    textAlign: 'center',
    height: FACES_LIST.length * SIZE,
    lineHeight: SIZE,
    color: colors.WHITE,
  },
  frame: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: colors.WHITE,
    transform: [{rotate: '45deg'}],
  },
});

export default React.memo(Dice);
