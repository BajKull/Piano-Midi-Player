import CloseButton from "components/button/closeButton/CloseButton";
import Loading from "components/loading/Loading";
import React, { useState } from "react";
import { useAppStore } from "store/store";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";
import SearchBar from "components/searchBar/SearchBar";
import Modal from "components/modal/Modal";

const MidiPlayerContent = () => {
  const { toggleMidiPanel } = useAppStore();
  const [searchText, setSearchText] = useState("");
  return (
    <Modal closeFn={toggleMidiPanel}>
      <nav className="flex items-center border-b-2 border-indigo-100 pb-5">
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
          />
        </div>
      </nav>
      <h2>Play a song</h2>
    </Modal>
  );
};

export default MidiPlayerContent;
