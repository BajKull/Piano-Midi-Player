import { create } from "zustand";

export const DEFAULT_WATER_COLOR = "#001e0f";

interface WaterColor {
  color: string;
  setColor: (v?: string) => void;
}

export const useWaterColorStore = create<WaterColor>((set) => ({
  color: DEFAULT_WATER_COLOR,
  setColor: (v) => set(() => ({ color: v || DEFAULT_WATER_COLOR })),
}));
