export const numberToTime = (number: number) => {
  const minutes = Math.floor(number / 60);
  const s = Math.floor(number % 60);
  const seconds = s < 10 ? `0${s}` : s;
  return `${minutes}:${seconds}`;
};
