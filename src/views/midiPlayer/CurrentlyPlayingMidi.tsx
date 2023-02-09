import React, { useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import Button from "components/button/Button";
import { useAppStore, useTimestampStore } from "store/store";
import { numberToTime } from "components/songCard/numberToTime";
import cls from "./currentlyPlayingMidi.module.scss";
import classNames from "classnames";
import useSongActions from "hooks/useSongActions";

const CurrentlyPlayingMidi = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const { isMidiPlaying, songMetaData } = useAppStore();
  const { songTimestamp } = useTimestampStore();
  const controls = useDragControls();
  const { pauseSong, resumeSong } = useSongActions();
  console.log(isMidiPlaying);

  const progressBarCls = classNames(
    cls.progressBar,
    "absolute z-10 top-0 left-0 h-1 bg-indigo-500"
  );

  if (!songMetaData) return null;
  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-20 flex h-full w-full"
      ref={constraintsRef}
    >
      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragElastic={0.1}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        className="container-shadow pointer-events-auto relative mx-auto mb-5 mt-auto flex w-11/12 rounded-lg bg-indigo-50 p-5 sm:w-[500px]"
      >
        <div
          className="absolute top-1 left-1/2 box-content h-1 w-10 -translate-x-1/2 cursor-move touch-none p-1"
          onPointerDown={(event) => controls.start(event)}
        >
          <div className="container-shadow h-1 w-10 cursor-move touch-none rounded-full bg-indigo-300" />
        </div>
        <Button
          className="flex h-10 w-10 items-center justify-center rounded-full"
          aria-label={isMidiPlaying ? "Pause" : "Resume"}
          title={isMidiPlaying ? "Pause" : "Resume"}
          onClick={() => (isMidiPlaying ? pauseSong() : resumeSong())}
        >
          <FontAwesomeIcon
            icon={isMidiPlaying ? faPause : faPlay}
            className="h-4 w-4"
          />
        </Button>
        <div className="ml-5 flex h-10 w-full flex-col">
          <div className="flex items-center">
            <p className="font-semibold">{songMetaData?.title}</p>
            <p className="ml-auto">{songMetaData?.author}</p>
          </div>
          <div className="mt-auto flex items-center justify-center">
            <p className="min-w-[25px] text-xs font-medium">
              {numberToTime(songTimestamp)}
            </p>
            <div className="relative mx-2 h-1 flex-1 overflow-hidden rounded-full bg-indigo-200">
              <div
                className={progressBarCls}
                style={{
                  animationDuration: `${songMetaData.duration}s`,
                  animationPlayState: isMidiPlaying ? "running" : "paused",
                }}
              />
            </div>
            <p className="min-w-[25px] text-xs font-medium">
              {numberToTime(songMetaData?.duration || 0)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CurrentlyPlayingMidi;
