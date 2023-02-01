import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Midi } from "@tonejs/midi";
import React from "react";
import { numberToTime } from "./numberToTime";
import { faHeart, faPlay } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Button from "components/button/Button";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  song: Midi;
  author: string;
  title: string;
}

const SongCard = ({ song, author, title, ...props }: IProps) => {
  console.log(song);
  const clsDiv = classNames(props.className);
  return (
    <div
      {...props}
      className="flex w-full items-center rounded-lg p-5 hover:bg-indigo-100"
    >
      <div className="basis-10">
        <Button noBg className="flex px-0" title="Play" aria-label="Play">
          <FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
        </Button>
      </div>
      <p className="basis-1/2">{title}</p>
      <p className="basis-1/4">{author}</p>
      <p className="basis-1/4">{numberToTime(song.duration)}</p>
      <div className="basis-10">
        <Button
          noBg
          className="flex px-0"
          title="Favorite"
          aria-label="Favorite"
        >
          <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SongCard;
