import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Midi } from "@tonejs/midi";
import React from "react";
import { numberToTime } from "./numberToTime";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
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
      <p className="basis-1/2">{title}</p>
      <p className="basis-1/4">{author}</p>
      <p className="basis-1/4">{numberToTime(song.duration)}</p>
      <Button noBg className="flex basis-24 justify-center">
        <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SongCard;
