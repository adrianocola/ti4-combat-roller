import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';
import Button, {ButtonProps} from '@components/Button';

interface ButtonImageProps extends ButtonProps {
  image: ImageSourcePropType;
}

const ButtonImage: React.FC<ButtonImageProps> = ({
  image,
  disabled,
  ...props
}) => {
  return (
    <Button {...props}>
      <Image source={image} style={styles.image} />
    </Button>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 26,
    height: 26,
  },
});

export default React.memo(ButtonImage);
