import { createRef, useRef } from "react";
import { Group } from "three";
import { create, StateCreator } from "zustand";

interface MidiPlaying {
  isMidiPlaying: boolean;
  setIsMidiPlaying: (v: boolean) => void;
  toggleIsMidiPlaying: () => void;
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
  setIsMidiPlaying: (value: boolean) => set(() => ({ isMidiPlaying: value })),
  toggleIsMidiPlaying: () => set((state) => ({ isMidiPlaying: !state })),
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
  setVolume: (v: number) => set(() => ({ volume: v })),
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
