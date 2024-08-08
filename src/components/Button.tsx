import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import Colors from '@/data/colors';
import colors from '@/data/colors';

export interface ButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  title?: string | number;
  titleStyle?: StyleProp<TextStyle>;
  transparent?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  style,
  title,
  titleStyle,
  transparent,
  children,
  ...props
}) => {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({pressed}) => [
        styles.button,
        transparent && styles.transparent,
        [...(Array.isArray(style) ? style : [style])],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {title !== undefined ? (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.BACKGROUND_BUTTON,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: colors.WHITE,
    borderWidth: StyleSheet.hairlineWidth,
  },
  transparent: {
    borderWidth: 0,
    backgroundColor: undefined,
  },
  disabled: {
    opacity: 0.25,
  },
  pressed: {
    opacity: 0.5,
  },
  title: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});

export default React.memo(Button);
