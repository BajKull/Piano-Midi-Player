import { Midi } from "@tonejs/midi";
import takeOnMeMidi from "assets/midis/takeOnMe.mid";
import neverGonnaGiveYouUpMidi from "assets/midis/neverGonnaGiveYouUp.mid";
import skyrimMidi from "assets/midis/skyrim.mid";
import whatIsLoveMidi from "assets/midis/whatIsLove.mid";
import hesPirateMidi from "assets/midis/hesPirate.mid";
import { midiToKey } from "./midiKeys";
import { Note, noteToMesh } from "views/piano/pianoKeys";
import { Mesh } from "three";
import { nanoid } from "nanoid";

type PianoEvent = {
  id: string;
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

export type MidiMetadata = Omit<MidiWithId, "song" | "id"> & {
  duration: number;
};

const MINUTE_IN_MILISECONDS = 60000;

const getSongs = async () => {
  const takeOnMe = Midi.fromUrl(takeOnMeMidi);
  const neverGonnaGiveYouUp = Midi.fromUrl(neverGonnaGiveYouUpMidi);
  const skyrim = Midi.fromUrl(skyrimMidi);
  const whatIsLove = Midi.fromUrl(whatIsLoveMidi);
  const hesPirate = Midi.fromUrl(hesPirateMidi);

  const midis = [takeOnMe, neverGonnaGiveYouUp, skyrim, whatIsLove, hesPirate];

  const songsPromise = await Promise.all(midis).then((data) => {
    const [takeOnMe, neverGonnaGiveYouUp, skyrim, whatIsLove, hesPirate] = data;
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
  });

  return songsPromise;
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
  const timeOffset = songNotes[0]?.time || 0;

  const events: PianoEvent[] = [];
  songNotes.forEach((noteData) => {
    const note = midiToKey(noteData.midi);
    const id = nanoid();
    if (!note) return;
    events.push({
      id,
      note,
      start: (noteData.time - timeOffset) * 1000,
      mode: "ON",
    });
    events.push({
      id,
      note,
      start: (noteData.time + noteData.duration - timeOffset) * 1000,
      mode: "OFF",
    });
  });

  console.log(events);

  return {
    intervals,
    events: events.sort((a, b) => a.start - b.start),
  };
};

export { getSongs, getSongData };
