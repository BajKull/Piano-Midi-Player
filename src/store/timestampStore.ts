import { create } from "zustand";

interface MidiPlayingTimestamp {
  songTimestamp: number;
  setSongTimestamp: (v: number) => void;
}

export const useTimestampStore = create<MidiPlayingTimestamp>((set) => ({
  songTimestamp: 0,
  setSongTimestamp: (v) => set(() => ({ songTimestamp: v })),
}));
