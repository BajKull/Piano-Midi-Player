const keys = ["a", "b", "c", "d", "e", "f", "g"] as const;
const sharpKeys = ["a#", "c#", "d#", "f#", "g#"] as const;
const values = ["0", "1", "2", "3", "4"] as const;

type Keys = typeof keys[number];
type SharpKeys = typeof sharpKeys[number];
type Values = typeof values[number];
export type Note = `${Keys | SharpKeys}${Values}`;

export const notes = [...keys, ...sharpKeys].reduce((acc, el) => {
  const notes = values.map((v) => `${el}${v}` as const);
  return [...acc, ...notes];
}, [] as Note[]);
