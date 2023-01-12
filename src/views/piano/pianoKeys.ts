import { Howl } from "howler";

const noteKeys = ["a", "b", "c", "d", "e", "f", "g"] as const;
const noteSharpKeys = ["a#", "c#", "d#", "f#", "g#"] as const;
const noteValues = ["0", "1", "2", "3", "4"] as const;

type Keys = typeof noteKeys[number];
type SharpKeys = typeof noteSharpKeys[number];
type Values = typeof noteValues[number];
export type Note = `${Keys | SharpKeys}${Values}`;
export type Sound = { name: Note; sound: Howl };

const importAllSounds = (r: __WebpackModuleApi.RequireContext) => {
  const sounds = new Map<Note, Howl>();
  r.keys().forEach((sound) =>
    sounds.set(
      sound.replace(/assets\/sounds\/|.mp3/gi, "") as Note,
      new Howl({ src: r(sound) })
    )
  );
  return sounds;
};

// webpack loads all files from given folder but also adds copies of them
// from current folder even though they are not here, regex filters those
export const sounds = importAllSounds(
  require.context("assets/sounds", false, /^(?!(\.)).*\.mp3$/)
);

const keyToNoteValues = {
  q: "c1",
  w: "d1",
  e: "e1",
  r: "f1",
  t: "g1",
  y: "a1",
  u: "b1",
  i: "c2",
  o: "d2",
  p: "e2",
  "[": "f2",
  "]": "g2",
  "2": "c#1",
  "3": "d#1",
  "5": "f#1",
  "6": "g#1",
  "7": "a#1",
  "9": "c#2",
  "0": "d#2",
  "-": "f#2",
  "=": "g#2",
  z: "a2",
  x: "b2",
  c: "c3",
  v: "d3",
  b: "e3",
  n: "f3",
  m: "g3",
  ",": "a3",
  ".": "b3",
  s: "a#2",
  f: "c#3",
  g: "d#3",
  j: "f#3",
  k: "g#3",
  l: "a#3",
};

const noteToOctaveValues = {
  c: 0,
  d: 1,
  e: 2,
  f: 3,
  g: 4,
  a: 5,
  b: 6,
  "c#": 7,
  "d#": 8,
  "f#": 9,
  "g#": 10,
  "a#": 11,
};

export const noteToOctaveIndex = new Map(Object.entries(noteToOctaveValues));
export const keyToNote = new Map(Object.entries(keyToNoteValues));
