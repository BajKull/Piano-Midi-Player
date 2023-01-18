import { create, StateCreator } from "zustand";

interface MidiPlaying {
  isMidiPlaying: boolean;
  setIsMidiPlaying: (v: boolean) => void;
  toggleIsMidiPlaying: () => void;
}

interface UserControls {
  keysPressed: Map<string, boolean>;
}

type PianoStore = MidiPlaying & UserControls;

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
});

export const useStore = create<PianoStore>()((...a) => ({
  ...createMidiPlayingStore(...a),
  ...createUserControls(...a),
}));
