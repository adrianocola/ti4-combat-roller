import {nanoid} from '@reduxjs/toolkit';

export const randomId = (size = 10) => nanoid(size);

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomFace = (): Face => randomNumber(1, 10) as Face;
