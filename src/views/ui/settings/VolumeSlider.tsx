import Range from "components/inputs/range/Range";
import React, { useEffect, useRef } from "react";
import { useAppStore } from "store/store";

const VolumeSlider = () => {
  const { volume, setVolume } = useAppStore();

  return (
    <div className="container-shadow pointer-events-auto absolute -bottom-28 right-0 flex h-7 w-40 translate-x-14 -rotate-90 items-center justify-center rounded-full bg-slate-50 px-4">
      <Range
        className="w-full "
        value={volume}
        onChange={(e) => setVolume(+e.target.value)}
      />
    </div>
  );
};

export default VolumeSlider;
