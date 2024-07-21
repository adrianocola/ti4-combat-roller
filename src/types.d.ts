declare module '*.png' {
  const value: import('react-native').ImageRequireSource;
  export default value;
}

type Face = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type DiceConfig = {
  id: string;
  face: Face;
  duration: number;
  success: boolean;
};

type Dices = Partial<Record<Face, DiceConfig[]>>;

type Results = Partial<Record<Face, number>>;

type DicesColorSet = Record<
  ColorSet,
  {dices: Dices; results: Results; rolling: boolean; rollId: number}
>;
