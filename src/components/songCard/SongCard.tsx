import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Midi } from "@tonejs/midi";
import React from "react";
import { numberToTime } from "./numberToTime";
import { faHeart, faPlay } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Button from "components/button/Button";
import { MidiMetadata, MidiWithId } from "midi/midiParser";
import colors from "tailwindcss/colors";
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  midi: MidiWithId;
  isFavorite: boolean;
  toggleFavorite: () => void;
  playSong: (song: Midi, metaData: MidiMetadata, track: number) => void;
}

const SongCard = ({
  midi,
  isFavorite,
  toggleFavorite,
  playSong,
  ...props
}: IProps) => {
  const clsDiv = classNames(
    props.className,
    "flex w-full items-center rounded-lg p-5 hover:bg-indigo-100"
  );

  const handlePlaySong = () => {
    const { song, ...rest } = midi;
    playSong(song, { ...rest, duration: song.duration }, 0);
  };

  return (
    <div {...props} className={clsDiv}>
      <div className="min-w-[2.5rem] basis-10">
        <Button
          noBg
          className="flex px-0"
          title="Play"
          aria-label="Play"
          onClick={handlePlaySong}
        >
          <FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
        </Button>
      </div>
      <p className="basis-1/2">{midi.title}</p>
      <p className="basis-1/4">{midi.author}</p>
      <p className="basis-1/4">{numberToTime(midi.song.duration)}</p>
      <div className="min-w-[2.5rem] basis-10">
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
