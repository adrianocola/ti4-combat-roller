import {Face} from './types';

export const MAX_DICE_SET = 15;
export const MIN_ROLL_MS = 2500;
export const MAX_ROLL_MS = 4000;
export const RESULT_UPDATE_FREQ_MS = 500;
export const FACES: Face[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const FACES_REVERSED = [...FACES].reverse().splice(0, FACES.length - 1);
export const FACES_3 = [...FACES, ...FACES, ...FACES];
