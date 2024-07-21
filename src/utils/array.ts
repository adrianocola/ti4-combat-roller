export const arrayRotate = <T>(arr: T[], count: number): T[] => {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};

export const arraySum = (arr: number[]): number => {
  return arr.reduce((acc, n) => acc + n, 0);
};
