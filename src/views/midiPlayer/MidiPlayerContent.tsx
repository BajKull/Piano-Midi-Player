import CloseButton from "components/button/closeButton/CloseButton";
import React, { useRef, useState } from "react";
import { useAppStore } from "store/store";
import { faCloudArrowUp, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/button/Button";
import SearchBar from "components/searchBar/SearchBar";
import MidiPlayerSongList from "./MidiPlayerSongList";
import UserMidiUpload from "./UserMidiUpload";

const MidiPlayerContent = () => {
  const { toggleMidiPanel, showFavorites, toggleShowFavorites } = useAppStore();
  const [searchText, setSearchText] = useState("");
  const [userFile, setUserFile] = useState<File>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="h-full w-full">
      <nav className="mx-10 flex items-center border-b-2 border-indigo-100 pb-5">
        <Button
          title="Upload .mid file"
          aria-label="Upload .mid file"
          className="mr-5 rounded-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <FontAwesomeIcon icon={faCloudArrowUp} className="h-8 w-8" />
          <input
            type="file"
            className="absolute h-0 w-0 opacity-0"
            accept=".mid, .midi"
            ref={fileInputRef}
            onChange={(e) => setUserFile(e.target.files?.[0])}
            tabIndex={-1}
          />
        </Button>
        <Button
          title="Show favorites"
          aria-label="Show favorites"
          className="mr-5 rounded-lg"
          active={showFavorites}
          onClick={() => toggleShowFavorites()}
        >
          <FontAwesomeIcon icon={faHeart} className="h-8 w-8 p-1" />
        </Button>
        <div className="w-60">
          <SearchBar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            clearFn={() => setSearchText("")}
            className="leading-6"
          />
        </div>
        <CloseButton
          className="ml-auto -mr-3"
          onClick={() => toggleMidiPanel()}
        />
      </nav>
      <div className="mt-5 h-full px-5">
        {userFile ? (
          <UserMidiUpload midi={userFile}></UserMidiUpload>
        ) : (
          <MidiPlayerSongList
            filter={(v) =>
              v.title.toLowerCase().startsWith(searchText.toLowerCase()) ||
              v.author.toLowerCase().startsWith(searchText.toLowerCase())
            }
          />
        )}
      </div>
    </div>
  );
};

export default MidiPlayerContent;
