import { Midi } from "@tonejs/midi";
import takeOnMeMidi from "assets/midis/takeOnMe.mid";
import neverGonnaGiveYouUpMidi from "assets/midis/neverGonnaGiveYouUp.mid";
import skyrimMidi from "assets/midis/skyrim.mid";
import whatIsLoveMidi from "assets/midis/whatIsLove.mid";
import hesPirateMidi from "assets/midis/hesPirate.mid";
import throughFireAndFlamesMidi from "assets/midis/throughFireAndFlames.mid";
import glimpseOfUsMidi from "assets/midis/glimpseOfUs.mid";
import interstellarMidi from "assets/midis/interstellar.mid";
import { midiToKey } from "./midiKeys";
import { Note } from "views/piano/pianoKeys";
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
  waterColor?: string;
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
  const throughFireAndFlames = Midi.fromUrl(throughFireAndFlamesMidi);
  const glimpseOfUs = Midi.fromUrl(glimpseOfUsMidi);
  const interstellar = Midi.fromUrl(interstellarMidi);

  const midis = [
    takeOnMe,
    neverGonnaGiveYouUp,
    skyrim,
    whatIsLove,
    hesPirate,
    throughFireAndFlames,
    glimpseOfUs,
    interstellar,
  ];

  const songsPromise = await Promise.all(midis).then((data) => {
    const [
      takeOnMe,
      neverGonnaGiveYouUp,
      skyrim,
      whatIsLove,
      hesPirate,
      throughFireAndFlames,
      glimpseOfUs,
      interstellar,
    ] = data;
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
      {
        id: 6,
        song: throughFireAndFlames,
        title: "Through the Fire and Flames",
        author: "Dragonforce",
        waterColor: "#a82222",
      },
      { id: 7, song: glimpseOfUs, title: "Glimpse Of Us", author: "Joji" },
      {
        id: 8,
        song: interstellar,
        title: "Interstellar",
        author: "Hans Zimmer",
      },
    ];
    console.log(songs);
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
  const noteStartingTime = new Map<Note, number>();
  const noteEndingTime = new Map<Note, { id: string; endTime: number }>();
  songNotes.forEach((noteData) => {
    const note = midiToKey(noteData.midi);
    const id = nanoid();
    const noteStartTime = (noteData.time - timeOffset) * 1000;
    const noteEndTime = (noteData.time + noteData.duration - timeOffset) * 1000;
    if (!note) return;

    const noteInMap = noteEndingTime.get(note);
    if (noteStartingTime.get(note) === noteStartTime) return;
    if (noteInMap && noteInMap.endTime >= noteStartTime) {
      const indexToEdit = events.findIndex(
        (el) => el.id === noteInMap.id && el.mode === "OFF"
      );
      events[indexToEdit].start = noteStartTime;
    }

    events.push({
      id,
      note,
      start: noteStartTime,
      mode: "ON",
    });
    events.push({
      id,
      note,
      start: noteEndTime,
      mode: "OFF",
    });
    noteStartingTime.set(note, noteStartTime);
    noteEndingTime.set(note, { id, endTime: noteEndTime });
  });

  console.log(events);

  return {
    intervals,
    events: events.sort((a, b) => a.start - b.start),
  };
};

export { getSongs, getSongData };
