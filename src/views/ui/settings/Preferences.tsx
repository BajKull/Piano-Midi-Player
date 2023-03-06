import Color from "components/inputs/color/Color";
import Switch from "components/inputs/switch/Switch";
import { useDebounce } from "hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { usePreferencesStore } from "store/preferencesStore";
import { DEFAULT_WATER_COLOR, useWaterColorStore } from "store/waterStore";

const Preferences = () => {
  const {
    rain,
    duck,
    fog,
    water,
    stats,
    toggleDuck,
    toggleFog,
    toggleRain,
    toggleWater,
    toggleStats,
  } = usePreferencesStore();
  const { color, setColor } = useWaterColorStore();

  const [waterColor, setWaterColor] = useState(color);
  const debouncedColor = useDebounce(waterColor, 250);

  useEffect(() => {
    setColor(debouncedColor);
  }, [debouncedColor, setColor]);

  return (
    <div className="container-shadow pointer-events-auto absolute -bottom-5 right-0 flex w-80 translate-y-full items-center rounded-lg bg-slate-50 p-5">
      <div className="flex w-full flex-col">
        <Switch className="my-2" checked={rain} onChange={() => toggleRain()}>
          Rain
        </Switch>
        <Switch className="my-2" checked={duck} onChange={() => toggleDuck()}>
          Duck
        </Switch>
        <Switch className="my-2" checked={fog} onChange={() => toggleFog()}>
          Fog
        </Switch>
        <Switch className="my-2" checked={water} onChange={() => toggleWater()}>
          Water
        </Switch>
        <Switch className="my-2" checked={stats} onChange={() => toggleStats()}>
          Statistics
        </Switch>
        <Color
          className="py-2"
          value={waterColor}
          onChange={(e) => setWaterColor(e.target.value)}
        >
          Water color
        </Color>
      </div>
    </div>
  );
};

export default Preferences;
