import React from 'react';
import {Image, ImageProps} from 'react-native';
import {ImageSourcePropType} from 'react-native/Libraries/Image/Image';
import Button, {ButtonProps} from '@/components/Button';

interface ButtonImageProps extends ButtonProps {
  image: ImageSourcePropType;
  imageProps?: ImageProps;
  imageSize?: number;
}

const ButtonImage: React.FC<ButtonImageProps> = ({
  image,
  imageProps,
  imageSize = 26,
  ...props
}) => {
  return (
    <Button {...props}>
      <Image
        {...imageProps}
        source={image}
        style={[{width: imageSize, height: imageSize}, imageProps?.style]}
      />
    </Button>
  );
};

export default React.memo(ButtonImage);
