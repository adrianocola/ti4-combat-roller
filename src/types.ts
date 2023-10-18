export type Face = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type DiceConfig = {
  id: string;
  face: Face;
  duration: number;
  success: boolean;
};

export type Dices = Partial<Record<Face, DiceConfig[]>>;

export type Results = Partial<Record<Face, number>>;
