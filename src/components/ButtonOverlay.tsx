import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import colors from '@data/colors';

interface Props {
  text: string;
  disabled?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

const IN_DURATION = 200;
const OUT_DURATION = 300;

const ButtonOverlay: React.FC<Props> = ({text, disabled, style, onPress}) => {
  const opacity = useSharedValue(0);

  const onPressIn = () => {
    opacity.value = withTiming(1, {duration: IN_DURATION});
  };

  const onPressOut = () => {
    opacity.value = withTiming(0, {duration: OUT_DURATION});
  };

  const innerOnPress = () => {
    opacity.value = withSequence(
      withTiming(1, {duration: IN_DURATION}),
      withTiming(0, {duration: OUT_DURATION}),
    );
    onPress();
  };

  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={innerOnPress}>
      <Animated.View style={[style, {opacity}]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.WHITE,
    fontSize: 64,
    lineHeight: 64,
    textShadowColor: colors.BLACK,
    textShadowRadius: 3,
  },
});

export default React.memo(ButtonOverlay);
