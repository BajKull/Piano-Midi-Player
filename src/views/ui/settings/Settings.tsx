import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";
import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "store/store";
import {
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faArrowsUpDownLeftRight,
  faMusic,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import VolumeSlider from "./VolumeSlider";
import MidiPlayer from "views/midiPlayer/MidiPlayer";
import Preferences from "./Preferences";

const Settings = () => {
  const [volumeMenuExpanded, setVolumeMenuExpanded] = useState(false);
  const [preferencesMenuExpanded, setPreferencesMenuExpanded] = useState(false);
  const {
    volume,
    cameraControl,
    midiPanel,
    toggleMidiPanel,
    toggleCameraControl,
  } = useAppStore();

  const volumeRef = useRef<HTMLDivElement | null>(null);
  const preferencesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!volumeRef.current?.contains(e.target as Node))
        setVolumeMenuExpanded(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [setVolumeMenuExpanded]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!preferencesRef.current?.contains(e.target as Node))
        setPreferencesMenuExpanded(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [setPreferencesMenuExpanded]);

  return (
    <nav className="pointer-events-none absolute top-5 z-10 flex h-12 w-full bg-transparent px-5">
      {midiPanel && <MidiPlayer />}
      <section className="ml-auto flex">
        <Button
          className="pointer-events-auto mr-5 h-12 w-12 rounded-full"
          title="Midi player"
          aria-label="Midi player"
          onClick={() => toggleMidiPanel()}
          active={midiPanel}
        >
          <FontAwesomeIcon icon={faMusic} size="2x" />
        </Button>
        <Button
          className="pointer-events-auto mr-5 h-12 w-12 rounded-full"
          title="Camera controls"
          aria-label="Camera controls"
          onClick={() => toggleCameraControl()}
          active={cameraControl}
        >
          <FontAwesomeIcon icon={faArrowsUpDownLeftRight} size="2x" />
        </Button>
        <div className="relative mr-5 h-12 w-12" ref={volumeRef}>
          <Button
            className="pointer-events-auto h-12 w-12 rounded-full"
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
        <div className="relative h-12 w-12" ref={preferencesRef}>
          <Button
            className="pointer-events-auto h-12 w-12 rounded-full"
            title="Preferences"
            aria-label="Preferences"
            onClick={() => setPreferencesMenuExpanded(!preferencesMenuExpanded)}
            active={preferencesMenuExpanded}
          >
            <FontAwesomeIcon icon={faCog} />
          </Button>
          {preferencesMenuExpanded && <Preferences />}
        </div>
      </section>
    </nav>
  );
};

export default Settings;
