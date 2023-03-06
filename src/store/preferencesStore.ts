import { create } from "zustand";

interface Preferences {
  rain: boolean;
  duck: boolean;
  fog: boolean;
  water: boolean;
  stats: boolean;
  toggleRain: () => void;
  toggleDuck: () => void;
  toggleFog: () => void;
  toggleWater: () => void;
  toggleStats: () => void;
}

export const usePreferencesStore = create<Preferences>((set) => ({
  rain: true,
  duck: true,
  fog: true,
  water: true,
  stats: false,
  toggleRain: () => set((state) => ({ rain: !state.rain })),
  toggleDuck: () => set((state) => ({ duck: !state.duck })),
  toggleFog: () => set((state) => ({ fog: !state.fog })),
  toggleWater: () => set((state) => ({ water: !state.water })),
  toggleStats: () => set((state) => ({ stats: !state.stats })),
}));
