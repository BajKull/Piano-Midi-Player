import CloseButton from "components/button/closeButton/CloseButton";
import Loading from "components/loading/Loading";
import React from "react";
import { useAppStore } from "store/store";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";

const MidiPlayerContent = () => {
  const { toggleMidiPanel } = useAppStore();
  return (
    <div className="relative w-full h-full">
      <Button noBg title="Upload .mid file" aria-label="Upload .mid file">
        <FontAwesomeIcon icon={faCloudArrowUp} className="h-10 w-10" />
      </Button>
      <CloseButton
        className="absolute top-0 right-0"
        onClick={() => toggleMidiPanel()}
      />
      <h2>Play a song</h2>
    </div>
  );
};

export default MidiPlayerContent;
