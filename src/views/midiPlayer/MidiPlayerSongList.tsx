import { Midi } from "@tonejs/midi";
import { getSongs } from "midi/midiParser";
import React, { useEffect, useState } from "react";

const MidiPlayerSongList = () => {
  const [songList, setSongList] = useState<Midi[]>([]);

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

  return <div>MidiPlayerSongList</div>;
};

export default MidiPlayerSongList;
