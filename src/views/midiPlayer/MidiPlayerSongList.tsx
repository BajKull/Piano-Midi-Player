import { Midi } from "@tonejs/midi";
import SongCard from "components/songCard/SongCard";
import { getSongs } from "midi/midiParser";
import React, { useEffect, useState } from "react";

type MidiWithId = {
  id: number;
  song: Midi;
  title: string;
  author: string;
};

const MidiPlayerSongList = () => {
  const [songList, setSongList] = useState<MidiWithId[]>([]);

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

  return (
    <div>
      <div className="flex py-5 px-5">
        <label className="basis-1/2 font-semibold">Song name</label>
        <label className="basis-1/4 font-semibold">Author</label>
        <label className="basis-1/4 font-semibold">Duration</label>
        <label className="basis-24 text-center font-semibold">Favorite</label>
      </div>
      {songList.map(({ id, song, author, title }) => (
        <SongCard key={id} song={song} author={author} title={title} />
      ))}
    </div>
  );
};

export default MidiPlayerSongList;
