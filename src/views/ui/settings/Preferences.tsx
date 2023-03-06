import Switch from "components/switch/Switch";
import React from "react";
import { usePreferencesStore } from "store/preferencesStore";

const Preferences = () => {
  const {
    rain,
    duck,
    fog,
    water,
    toggleDuck,
    toggleFog,
    toggleRain,
    toggleWater,
  } = usePreferencesStore();
  return (
    <div className="container-shadow pointer-events-auto absolute -bottom-5 right-0 flex translate-y-full items-center justify-center rounded-lg bg-slate-50 p-5">
      <div className="flex flex-col">
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
      </div>
    </div>
  );
};

export default Preferences;
