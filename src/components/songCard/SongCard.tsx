import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Midi } from "@tonejs/midi";
import React from "react";
import { numberToTime } from "./numberToTime";
import { faHeart, faPlay } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Button from "components/button/Button";
import useLocalStorage from "hooks/useLocalStorage";
import { LOCAL_STORAGE_FAVORITES } from "constants/keys";
import { MidiWithId } from "midi/midiParser";
import colors from "tailwindcss/colors";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  song: MidiWithId;
  isFavorite: boolean;
  toggleFavorite: () => void;
  playSong: (id: Midi, track: number) => void;
}

const SongCard = ({
  song,
  isFavorite,
  toggleFavorite,
  playSong,
  ...props
}: IProps) => {
  const clsDiv = classNames(
    props.className,
    "flex w-full items-center rounded-lg p-5 hover:bg-indigo-100"
  );

  return (
    <div {...props} className={clsDiv}>
      <div className="basis-10">
        <Button
          noBg
          className="flex px-0"
          title="Play"
          aria-label="Play"
          onClick={() => playSong(song.song, 0)}
        >
          <FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
        </Button>
      </div>
      <p className="basis-1/2">{song.title}</p>
      <p className="basis-1/4">{song.author}</p>
      <p className="basis-1/4">{numberToTime(song.song.duration)}</p>
      <div className="basis-10">
        <Button
          noBg
          className="flex w-10"
          title="Favorite"
          aria-label="Favorite"
          onClick={toggleFavorite}
        >
          <FontAwesomeIcon
            icon={faHeart}
            className="hover:text-indigo-500"
            color={isFavorite ? colors.indigo[500] : undefined}
          />
        </Button>
      </div>
    </div>
  );
};

export default SongCard;
