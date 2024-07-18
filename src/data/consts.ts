export const MAX_DICE_SET = 15;
export const MIN_ROLL_MS = 1000;
export const MAX_ROLL_MS = 2000;
export const RESULT_UPDATE_FREQ_MS = 250;
export const FACES: Face[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const FACES_DISPLAY = [...FACES].splice(1).reverse(); // remove 1
export const FACES_LIST = [...FACES, ...FACES, ...FACES];
