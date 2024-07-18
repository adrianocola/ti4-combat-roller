import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';

interface Props {
  text: string;
  disabled?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

const ButtonOverlay: React.FC<Props> = ({text, disabled, style, onPress}) => {
  const opacity = useSharedValue(0);
  const innerOnPress = useCallback(() => {
    opacity.value = withSequence(
      withTiming(1, {duration: 300}),
      withTiming(0, {duration: 400}),
    );
    onPress();
  }, [opacity, onPress]);

  const animatedInnerStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <TouchableWithoutFeedback disabled={disabled} onPress={innerOnPress}>
      <Animated.View style={[animatedInnerStyles, style]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 48,
    lineHeight: 48,
  },
});

export default React.memo(ButtonOverlay);
