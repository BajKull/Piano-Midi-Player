import { Midi } from "@tonejs/midi";
import takeOnMeMidi from "assets/midis/takeOnMe.mid";
import neverGonnaGiveYouUpMidi from "assets/midis/neverGonnaGiveYouUp.mid";
import skyrimMidi from "assets/midis/skyrim.mid";
import whatIsLoveMidi from "assets/midis/whatIsLove.mid";
import hesPirateMidi from "assets/midis/hesPirate.mid";
import { midiToKey } from "./midiKeys";
import { Note, noteToMesh } from "views/piano/pianoKeys";
import { Mesh } from "three";

type PianoEvent = {
  note: Note;
  start: number;
  mode: "ON" | "OFF";
};

export type MidiWithId = {
  id: number;
  song: Midi;
  title: string;
  author: string;
};

const MINUTE_IN_MILISECONDS = 60000;

const getSongs = async () => {
  const takeOnMe = await Midi.fromUrl(takeOnMeMidi);
  const neverGonnaGiveYouUp = await Midi.fromUrl(neverGonnaGiveYouUpMidi);
  const skyrim = await Midi.fromUrl(skyrimMidi);
  const whatIsLove = await Midi.fromUrl(whatIsLoveMidi);
  const hesPirate = await Midi.fromUrl(hesPirateMidi);

  const songs: MidiWithId[] = [
    { id: 1, song: takeOnMe, title: "Take On Me", author: "a-ha" },
    {
      id: 2,
      song: neverGonnaGiveYouUp,
      title: "Never Gonna Give You Up",
      author: "Rick Astley",
    },
    {
      id: 3,
      song: skyrim,
      title: "Skyrim (Main Theme)",
      author: "Jeremy Soule",
    },
    { id: 4, song: whatIsLove, title: "What Is Love", author: "Haddaway" },
    { id: 5, song: hesPirate, title: "He's a Pirate", author: "Hans Zimmer" },
  ];

  return songs;
};

const getSongData = (song: Midi, track: number) => {
  const songNotes = song.tracks[track].notes;
  if (!songNotes) return;

  // converting bpm and ppq into tick time
  const intervals = song.header.tempos.map((t, i) => ({
    tick: Math.round(MINUTE_IN_MILISECONDS / t.bpm / song.header.ppq),
    start: t.ticks,
  }));

  // start playing immidiately instead of waiting for first note
  const timeOffset = songNotes[0].time;

  const events: PianoEvent[] = [];
  songNotes.forEach((noteData) => {
    const note = midiToKey(noteData.midi);
    if (!note) return;
    events.push({
      note,
      start: (noteData.time - timeOffset) * 1000,
      mode: "ON",
    });
    events.push({
      note,
      start: (noteData.time + noteData.duration - timeOffset) * 1000,
      mode: "OFF",
    });
  });

  return {
    intervals,
    events: events.sort((a, b) => a.start - b.start),
  };
};

type PlaySong = {
  playKey: (key: Note, mesh: Mesh) => void;
  stopKey: (key: Note, mesh: Mesh) => void;
  song: ReturnType<typeof getSongData>;
  id: React.MutableRefObject<NodeJS.Timer | null>;
  allKeys: React.MutableRefObject<THREE.Group | null>;
};

const playSong = ({ playKey, stopKey, song, id, allKeys }: PlaySong) => {
  if (!song) return;
  let lastNoteIndex = 0;
  let currentTime = 0;
  const { events } = song;
  id.current = setInterval(() => {
    while (events[lastNoteIndex]?.start <= currentTime) {
      const mesh = noteToMesh(events[lastNoteIndex].note, allKeys);
      if (!mesh) {
        lastNoteIndex++;
        continue;
      }
      if (events[lastNoteIndex].mode === "ON")
        playKey(events[lastNoteIndex].note, mesh);
      else stopKey(events[lastNoteIndex].note, mesh);
      lastNoteIndex++;
    }
    currentTime += song?.intervals[0].tick * 16;
  }, song?.intervals[0].tick * 16);
};

export { getSongs, getSongData, playSong };
