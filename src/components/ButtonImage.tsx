import React from 'react';
import Button, {ButtonProps} from '@/components/Button';

interface ButtonImageProps extends ButtonProps {
  image: string;
  imageSize?: number;
  imageAlt?: string;
}

const ButtonImage: React.FC<ButtonImageProps> = ({
  image,
  imageSize = 26,
  imageAlt = '',
  ...props
}) => {
  return (
    <Button {...props}>
      <img
        src={image}
        alt={imageAlt}
        draggable={false}
        style={{width: imageSize, height: imageSize}}
        className="block mx-auto"
      />
    </Button>
  );
};

export default React.memo(ButtonImage);
