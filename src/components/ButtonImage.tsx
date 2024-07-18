import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';

interface ButtonProps extends TouchableOpacityProps {
  image: ImageSourcePropType;
}

const ButtonImage: React.FC<ButtonProps> = ({
  image,
  disabled,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity {...props} style={[style, disabled && styles.disabled]}>
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.25,
  },
  image: {
    width: 26,
    height: 26,
  },
});

export default React.memo(ButtonImage);
