import {ColorSet} from '@/data/consts';

const colors = {
  WHITE: '#fcfcfc',
  GRAY: '#c0c0c0',
  GRAY_DARK: '#474747',
  BLACK: '#000000',
  SELECTED: '#ffba08',

  BACKGROUND: '#0e0e0e',
  BACKGROUND_MODAL: '#161616',
  BACKGROUND_BUTTON: '#1f1f1f',
  BACKGROUND_RESET: '#5b2727',

  FACES_COLORS: {
    [ColorSet.Orange]: {
      1: '#797d20',
      2: '#616221',
      3: '#605721',
      4: '#5E4C20',
      5: '#5B4220',
      6: '#593820',
      7: '#572E1F',
      8: '#55251F',
      9: '#531F21',
      10: '#511E28',
    },
    [ColorSet.Blue]: {
      1: '#39748c',
      2: '#356e87',
      3: '#2b5e73',
      4: '#204c5e',
      5: '#20425b',
      6: '#203859',
      7: '#1f2e57',
      8: '#1f2555',
      9: '#211f53',
      10: '#281e51',
    },
    [ColorSet.Green]: {
      1: '#2f8970',
      2: '#236f5a',
      3: '#1e624f',
      4: '#1d5541',
      5: '#1c4a33',
      6: '#1b3f26',
      7: '#1a3420',
      8: '#192819',
      9: '#181f10',
      10: '#17170a',
    },
    [ColorSet.Purple]: {
      1: '#6a0dad',
      2: '#5a0b9a',
      3: '#4b0987',
      4: '#3c086f',
      5: '#2d0660',
      6: '#1e0451',
      7: '#170342',
      8: '#120237',
      9: '#0d012d',
      10: '#080123',
    },
    [ColorSet.Gray]: {
      1: '#858585',
      2: '#757575',
      3: '#656565',
      4: '#555555',
      5: '#454545',
      6: '#353535',
      7: '#252525',
      8: '#202020',
      9: '#151515',
      10: '#0a0a0a',
    },
  } as Record<ColorSet, Record<Face, string>>,
};

export default colors;
