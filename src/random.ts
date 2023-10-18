import * as Crypto from 'expo-crypto';
import {Face} from './types';

const RANDOM_SIZE = 1024;

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomFace = (): Face => {
  const bytes = Crypto.getRandomBytes(10);
  for (let b of bytes) {
    if (b < 250) {
      return (Math.floor(b / 25) + 1) as Face;
    }
  }
  return 10;
};

export const randomFaces = async (): Promise<Face[]> => {
  const bytes = await Crypto.getRandomBytesAsync(RANDOM_SIZE);
  const faces: Face[] = new Array(RANDOM_SIZE);
  let count = 0;
  let size = 0;
  do {
    const byte = bytes[count];
    if (byte < 250) {
      faces[size] = (Math.floor(byte / 25) + 1) as Face;
      size += 1;
    }
    count += 1;
  } while (count < RANDOM_SIZE);
  return faces;
};
