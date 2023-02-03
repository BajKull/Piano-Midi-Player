import { MidiMetadata } from "midi/midiParser";
import { createRef } from "react";
import { Group } from "three";
import { create, StateCreator } from "zustand";
interface MidiPlaying {
  isMidiPlaying: boolean;
  setIsMidiPlaying: (v: boolean) => void;
  toggleIsMidiPlaying: () => void;
  songPauseTime: number;
  setSongPauseTime: (v: number) => void;
  songMetaData?: MidiMetadata;
  setSongMetaData: (v?: MidiMetadata) => void;
  songTimestamp: number;
  setSongTimestamp: (v: number) => void;
}

interface UserControls {
  keysPressed: Map<string, boolean>;
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
  setIsMidiPlaying: (value) => set(() => ({ isMidiPlaying: value })),
  toggleIsMidiPlaying: () => set((state) => ({ isMidiPlaying: !state })),
  songPauseTime: 0,
  setSongPauseTime: (v) => set(() => ({ songPauseTime: v })),
  songMetaData: undefined,
  setSongMetaData: (v) => set(() => ({ songMetaData: v })),
  songTimestamp: 0,
  setSongTimestamp: (v) => set(() => ({ songTimestamp: v })),
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
