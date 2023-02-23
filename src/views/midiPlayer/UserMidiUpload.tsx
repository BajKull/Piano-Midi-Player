import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Midi } from "@tonejs/midi";
import Button from "components/button/Button";
import Card from "components/card/Card";
import CardContainer from "components/card/CardContainer";
import Checkbox from "components/checkbox/Checkbox";
import Loading from "components/loading/Loading";
import { numberToTime } from "components/songCard/numberToTime";
import TableHeader from "components/table/header/TableHeader";
import useSongActions from "hooks/useSongActions";
import { getSong, getSongData } from "midi/midiParser";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import colors from "tailwindcss/colors";

interface IProps {
  midi: File;
}

const UserMidiUpload = ({ midi }: IProps) => {
  const [checkboxes, setCheckboxes] = useState<boolean[]>([]);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const { playSong } = useSongActions();
  useEffect(() => {
    getSong(midi).then((d) => {
      setMidiData(d);
      setCheckboxes(d.tracks.map(() => false));
    });
  }, [midi]);

  const handleCheck = (index: number) => {
    setCheckboxes((stateCheckboxes) =>
      stateCheckboxes.map((c, i) => {
        if (index !== i) return c;
        return !c;
      })
    );
  };

  console.log(midiData);

  const playCustomSong = () => {
    if (!midiData) return;
    const indexes: number[] = [];
    checkboxes.forEach((c, i) => {
      if (c === true) indexes.push(i);
    });
    const song = getSongData(midiData, indexes);
    playSong({ song });
  };

  const tracks = midiData?.tracks.filter((t) => t.notes.length > 0);
  const noSelectedTracks = checkboxes.filter((c) => c).length;
  if (!midiData) return <ProcessingMidi />;
  if (!tracks || tracks.length === 0) return <FailedToLoadMidi />;
  return (
    <div className="flex h-full flex-col pb-5">
      <div className="pointer-events-none mb-5 flex pl-5 pr-[46px]">
        <div className="w-10" />
        <TableHeader name="Instrument" className="basis-1/3" />
        <TableHeader name="No. Notes" className="basis-1/3" />
        <TableHeader name="Duration" className="basis-1/3" />
      </div>
      <CardContainer height="calc(100% - 180px)">
        {tracks.map((t, i) => (
          <Card key={nanoid()}>
            <div className="w-10">
              <Checkbox
                checked={checkboxes[i]}
                onChange={() => handleCheck(i)}
              />
            </div>
            <p className="basis-1/3">{t.name || t.instrument.name}</p>
            <p className="basis-1/3">{t.notes.length}</p>
            <p className="basis-1/3">{numberToTime(Math.floor(t.duration))}</p>
          </Card>
        ))}
      </CardContainer>
      <nav className="mx-5 mt-5 flex items-center border-t-2 border-indigo-100 py-5 pr-[26px]">
        <div className="w-10" />
        <h2 className="basis-1/3 font-semibold">
          {midiData.header.name || "No Title"}
        </h2>
        <p className="basis-1/3">
          {tracks
            .filter((_t, i) => checkboxes[i])
            .reduce((acc, t) => acc + t.notes.length, 0)}{" "}
          Total notes
        </p>
        <p className="flex basis-1/3 items-center">
          {`${noSelectedTracks || "No"} track${
            noSelectedTracks === 1 ? "" : "s"
          } selected`}
          <a id="tracksHelp" className="ml-3 h-4 w-4">
            <FontAwesomeIcon
              icon={faCircleQuestion}
              color={colors.indigo[500]}
            />
          </a>
          <Tooltip
            place="top"
            anchorSelect="#tracksHelp"
            style={{
              backgroundColor: colors.indigo[500],
              width: "400px",
            }}
          >
            Midi files often consist of multiple instruments and tracks. Choose
            which of them you would like to hear. Bear in mind that some
            instruments such as drums may not be a good thing to import and play
            on a piano.
          </Tooltip>
        </p>
        <Button
          callToAction
          disabled={!Boolean(noSelectedTracks)}
          onClick={playCustomSong}
        >
          Play
        </Button>
      </nav>
    </div>
  );
};

const ProcessingMidi = () => {
  return (
    <div className="flex h-full w-full flex-col items-center pt-5">
      <Loading />
      <p className="mt-3">Processing file</p>
    </div>
  );
};

const FailedToLoadMidi = () => {
  return (
    <div className="flex h-full w-full flex-col items-center pt-5">
      <p className="my-3">There was an error loading your file.</p>
      <Button
        onClick={() => {}}
        className="rounded-md bg-indigo-500 px-5 text-white hover:bg-indigo-600"
      >
        Ok
      </Button>
    </div>
  );
};

export default UserMidiUpload;
