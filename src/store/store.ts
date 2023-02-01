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

type PianoStore = MidiPlaying & UserControls & AppSettings;

const createMidiPlayingStore: StateCreator<PianoStore, [], [], MidiPlaying> = (
  set
) => ({
  isMidiPlaying: false,
  setIsMidiPlaying: (value: boolean) => set(() => ({ isMidiPlaying: value })),
  toggleIsMidiPlaying: () => set((state) => ({ isMidiPlaying: !state })),
});

const createUserControls: StateCreator<PianoStore, [], [], UserControls> = (
  set
) => ({
  keysPressed: new Map(),
  showFavorites: false,
  toggleShowFavorites: () =>
    set((state) => ({ showFavorites: !state.showFavorites })),
});

const createAppSettings: StateCreator<PianoStore, [], [], AppSettings> = (
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

export const useAppStore = create<PianoStore>()((...a) => ({
  ...createMidiPlayingStore(...a),
  ...createUserControls(...a),
  ...createAppSettings(...a),
}));
