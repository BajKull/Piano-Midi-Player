import Range from "components/inputs/Range";
import React, { useEffect, useRef } from "react";
import { useAppStore } from "store/store";

const VolumeSlider = () => {
  const { volume, setVolume } = useAppStore();

  return (
    <div className="bg-slate-50 h-7 flex items-center justify-center rounded-full w-40 absolute -bottom-40 right-0 translate-x-14 px-4 -rotate-90 container-shadow">
      <Range
        className="w-full pointer-events-auto"
        value={volume}
        onChange={(e) => setVolume(+e.target.value)}
      />
    </div>
  );
};

export default VolumeSlider;
