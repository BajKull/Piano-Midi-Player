import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useAppStore } from "store/store";
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faArrowsUpDownLeftRight,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import VolumeSlider from "./VolumeSlider";

const Settings = () => {
  const [volumeMenuExpanded, setVolumeMenuExpanded] = useState(false);
  const { volume, cameraControl, midiPanel, toggleCameraControl } =
    useAppStore();

  const volumeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!volumeRef.current?.contains(e.target as Node))
        setVolumeMenuExpanded(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [setVolumeMenuExpanded]);

  return (
    <nav className="absolute w-full h-10 bg-transparent z-10 flex pointer-events-none p-5">
      <section className="ml-auto flex">
        <Button
          className="pointer-events-auto w-12 h-12 rounded-full mr-5"
          title="Midi player"
          aria-label="Midi player"
        >
          <FontAwesomeIcon icon={faMusic} size="2x" />
        </Button>
        <Button
          className="pointer-events-auto w-12 h-12 rounded-full mr-5"
          title="Camera controls"
          aria-label="Camera controls"
          onClick={() => toggleCameraControl()}
          active={cameraControl}
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} size="2x" />
        </Button>
        <div className="relative" ref={volumeRef}>
          <Button
            className="pointer-events-auto w-12 h-12 rounded-full"
            title="Volume"
            aria-label="Volume"
            onClick={() => setVolumeMenuExpanded(!volumeMenuExpanded)}
            active={volumeMenuExpanded}
          >
            {volume >= 50 && <FontAwesomeIcon icon={faVolumeHigh} />}
            {volume < 50 && volume > 0 && (
              <FontAwesomeIcon icon={faVolumeLow} width="17" />
            )}
            {volume === 0 && (
              <FontAwesomeIcon icon={faVolumeXmark} width="22" />
            )}
          </Button>
          {volumeMenuExpanded && <VolumeSlider />}
        </div>
      </section>
    </nav>
  );
};

export default Settings;
