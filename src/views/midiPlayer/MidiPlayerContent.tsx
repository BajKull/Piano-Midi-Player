import CloseButton from "components/button/closeButton/CloseButton";
import Loading from "components/loading/Loading";
import React, { useState } from "react";
import { useAppStore } from "store/store";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";
import SearchBar from "components/searchBar/SearchBar";

const MidiPlayerContent = () => {
  const { toggleMidiPanel } = useAppStore();
  const [searchText, setSearchText] = useState("");
  return (
    <div className="relative w-full h-full">
      <nav className="flex items-center border-b-2 border-indigo-100 pb-5">
        <Button noBg title="Upload .mid file" aria-label="Upload .mid file">
          <FontAwesomeIcon icon={faCloudArrowUp} className="h-10 w-10" />
        </Button>
        <div className="w-60 mx-5">
          <SearchBar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            clearFn={() => setSearchText("")}
          />
        </div>
        <CloseButton className="ml-auto" onClick={() => toggleMidiPanel()} />
      </nav>
      <h2>Play a song</h2>
    </div>
  );
};

export default MidiPlayerContent;
