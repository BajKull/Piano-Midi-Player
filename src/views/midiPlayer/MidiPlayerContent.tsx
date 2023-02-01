import CloseButton from "components/button/closeButton/CloseButton";
import Loading from "components/loading/Loading";
import React, { useState } from "react";
import { useAppStore } from "store/store";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";
import SearchBar from "components/searchBar/SearchBar";
import Modal from "components/modal/Modal";
import { getSongs } from "midi/midiParser";
import MidiPlayerSongList from "./MidiPlayerSongList";

const MidiPlayerContent = () => {
  const { toggleMidiPanel } = useAppStore();
  const [searchText, setSearchText] = useState("");

  return (
    <Modal closeFn={toggleMidiPanel}>
      <div className="h-full w-full">
        <nav className="mx-10 flex items-center border-b-2 border-indigo-100 pb-5">
          <Button
            title="Upload .mid file"
            aria-label="Upload .mid file"
            className="rounded-lg"
          >
            <FontAwesomeIcon icon={faCloudArrowUp} className="h-8 w-8" />
          </Button>
          <div className="mx-5 w-60">
            <SearchBar
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              clearFn={() => setSearchText("")}
              className="leading-6"
            />
          </div>
          <CloseButton className="ml-auto" onClick={() => toggleMidiPanel()} />
        </nav>
        <div
          className="custom-scroll overflow-auto px-5"
          style={{ height: "calc(100% - 62px)" }}
        >
          <MidiPlayerSongList />
        </div>
      </div>
    </Modal>
  );
};

export default MidiPlayerContent;
