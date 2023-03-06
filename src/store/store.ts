import { getSongData, MidiMetadata } from "midi/midiParser";
import { createRef } from "react";
import { Group, Mesh } from "three";
import { Note } from "views/piano/pianoKeys";
import { create, StateCreator } from "zustand";
interface MidiPlaying {
  isMidiPlaying: boolean;
  setIsMidiPlaying: (v: boolean) => void;
  songPauseTime: number;
  setSongPauseTime: (v: number) => void;
  songMetaData?: MidiMetadata;
  setSongMetaData: (v?: MidiMetadata) => void;
  songData?: ReturnType<typeof getSongData>;
  setSongData: (v: ReturnType<typeof getSongData>) => void;
  currentPlayingTime: React.MutableRefObject<number | null>;
  lastNoteIndex: React.MutableRefObject<number | null>;
}

interface UserControls {
  keysPressed: Map<Note, { soundId: number; mesh: Mesh }>;
  showFavorites: boolean;
  toggleShowFavorites: () => void;
}

interface AppSettings {
  volume: number;
  setVolume: (v: number) => void;
  cameraControl: boolean;
  toggleCameraControl: () => void;
  midiPanel: boolean;
  toggleMidiPanel: () => void;
}

interface PianoKeys {
  allKeysRef: React.MutableRefObject<Group | null>;
  songIntervalTimer: React.MutableRefObject<NodeJS.Timer | null>;
}

type AppStore = MidiPlaying & UserControls & AppSettings & PianoKeys;

const createMidiPlayingStore: StateCreator<AppStore, [], [], MidiPlaying> = (
  set
) => ({
  isMidiPlaying: false,
  setIsMidiPlaying: (v) => set(() => ({ isMidiPlaying: v })),
  songPauseTime: 0,
  setSongPauseTime: (v) => set(() => ({ songPauseTime: v })),
  songMetaData: undefined,
  setSongMetaData: (v) => set(() => ({ songMetaData: v })),
  songData: undefined,
  setSongData: (v) => set(() => ({ songData: v })),
  currentPlayingTime: createRef(),
  lastNoteIndex: createRef(),
});

const createUserControls: StateCreator<AppStore, [], [], UserControls> = (
  set
) => ({
  keysPressed: new Map(),
  showFavorites: false,
  toggleShowFavorites: () =>
    set((state) => ({ showFavorites: !state.showFavorites })),
});

const createAppSettings: StateCreator<AppStore, [], [], AppSettings> = (
  set
) => ({
  volume: 100,
  setVolume: (v) => set(() => ({ volume: v })),
  cameraControl: true,
  toggleCameraControl: () =>
    set((state) => ({ cameraControl: !state.cameraControl })),
  midiPanel: false,
  toggleMidiPanel: () => set((state) => ({ midiPanel: !state.midiPanel })),
});

const createPianoKeys: StateCreator<AppStore, [], [], PianoKeys> = (set) => ({
  allKeysRef: createRef<Group | null>(),
  songIntervalTimer: createRef<NodeJS.Timer | null>(),
});

export const useAppStore = create<AppStore>()((...a) => ({
  ...createMidiPlayingStore(...a),
  ...createUserControls(...a),
  ...createAppSettings(...a),
  ...createPianoKeys(...a),
}));
