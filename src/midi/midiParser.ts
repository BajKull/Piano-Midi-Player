import { Midi } from "@tonejs/midi";
import takeOnMeMidi from "assets/midis/takeOnMe.mid";
import takeOnMeMidi2 from "assets/midis/takeOnMe2.mid";
import neverGonnaGiveYouUpMidi from "assets/midis/neverGonnaGiveYouUp.mid";
import tetMidi from "assets/midis/tet.mid";
import skyrimMidi from "assets/midis/skyrim.mid";
import whatIsLoveMidi from "assets/midis/whatIsLove.mid";
import { midiToKey } from "./midiKeys";
import { Note, noteToMesh, noteToOctaveIndex } from "views/piano/pianoKeys";
import { Mesh } from "three";

type PianoEvent = {
  note: Note;
  start: number;
  mode: "ON" | "OFF";
};

const MINUTE_IN_MILISECONDS = 60000;

const getSongs = async () => {
  const takeOnMe = await Midi.fromUrl(takeOnMeMidi);
  const takeOnMe2 = await Midi.fromUrl(takeOnMeMidi2);
  const neverGonnaGiveYouUp = await Midi.fromUrl(neverGonnaGiveYouUpMidi);
  const tet = await Midi.fromUrl(tetMidi);
  const skyrim = await Midi.fromUrl(skyrimMidi);
  const whatIsLove = await Midi.fromUrl(whatIsLoveMidi);

  return { takeOnMe, takeOnMe2, neverGonnaGiveYouUp, tet, skyrim, whatIsLove };
};

const getSongData = (song: Midi, track: number) => {
  console.log(song);
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
  console.log(song);
  let lastNoteIndex = 0;
  let currentTime = 0;
  const { events } = song;
  console.log(song?.intervals[0].tick, song?.intervals[0].tick * 16);
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
