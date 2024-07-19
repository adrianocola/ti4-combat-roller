const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomString = (length: number = 10) => {
  let result = '';

  const charactersLength = CHARACTERS.length;
  let counter = 0;
  while (counter < length) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const randomFace = (): Face => randomNumber(1, 10) as Face;
