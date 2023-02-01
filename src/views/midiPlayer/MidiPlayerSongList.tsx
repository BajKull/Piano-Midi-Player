import { Midi } from "@tonejs/midi";
import SongCard from "components/songCard/SongCard";
import { getSongs } from "midi/midiParser";
import React, { useEffect, useState } from "react";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableHeader from "components/table/header/TableHeader";

type MidiWithId = {
  id: number;
  song: Midi;
  title: string;
  author: string;
};

type MidiTableSort = {
  field: "title" | "author" | "duration";
  how: "asc" | "desc";
};

const MidiPlayerSongList = () => {
  const [songList, setSongList] = useState<MidiWithId[]>([]);
  const [sort, setSort] = useState<MidiTableSort | null>({
    field: "title",
    how: "asc",
  });

  useEffect(() => {
    const awaitSongs = async () => {
      const songs = await getSongs();
      setSongList(songs);
      // console.log(songs);
      // const songData = getSongData(songs.hesPirate, 0);
      // console.log(songData);
      // playSong({
      //   playKey,
      //   stopKey,
      //   song: songData,
      //   id: songIntervalTimer,
      //   allKeys: allKeysRef,
      // });
    };
    awaitSongs();
  }, []);

  console.log(songList);

  const changeSort = (field: MidiTableSort["field"]) => {
    if (sort?.field === field) {
      if (sort.how === "asc") return setSort((s) => ({ ...s!, how: "desc" }));
      return setSort(null);
    }
    setSort({ field, how: "asc" });
  };

  const sortSongs = (a: MidiWithId, b: MidiWithId) => {
    if (!sort) return a.id - b.id;
    if (sort.field === "duration") {
      if (sort.how === "asc") return a.song.duration - b.song.duration;
      return b.song.duration - a.song.duration;
    }
    if (sort.how === "asc") return a[sort.field].localeCompare(b[sort.field]);
    return b[sort.field].localeCompare(a[sort.field]);
  };

  return (
    <div>
      <div className="flex py-5 px-5">
        <div className="basis-10" />
        <TableHeader
          name="Song name"
          field="title"
          className="basis-1/2"
          sort={sort}
          onClick={() => changeSort("title")}
        />
        <TableHeader
          name="Author"
          field="author"
          className="basis-1/4"
          sort={sort}
          onClick={() => changeSort("author")}
        />
        <TableHeader
          name="Duration"
          field="duration"
          className="basis-1/4"
          sort={sort}
          onClick={() => changeSort("duration")}
        />
        <div className="basis-10" />
      </div>
      {songList.sort(sortSongs).map(({ id, song, author, title }) => (
        <SongCard key={id} song={song} author={author} title={title} />
      ))}
    </div>
  );
};

export default MidiPlayerSongList;
