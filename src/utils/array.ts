export const arrayRotate = <T>(arr: T[], count: number): T[] => {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};
