import { Midi } from "@tonejs/midi";
import SongCard from "components/songCard/SongCard";
import {
  getSongData,
  getSongs,
  MidiMetadata,
  MidiWithId,
} from "midi/midiParser";
import React, { useCallback, useEffect, useState } from "react";
import TableHeader from "components/table/header/TableHeader";
import { useAppStore } from "store/store";
import useLocalStorage from "hooks/useLocalStorage";
import { LOCAL_STORAGE_FAVORITES } from "constants/keys";
import useSongActions from "hooks/useSongActions";
import { useWaterColorStore } from "store/waterStore";
import CardContainer from "components/card/CardContainer";

type MidiTableSort = {
  field: "title" | "author" | "duration";
  how: "asc" | "desc";
};

interface IProps {
  filter?: (song: MidiWithId) => void;
}

const MidiPlayerSongList = ({ filter }: IProps) => {
  const [songList, setSongList] = useState<MidiWithId[]>([]);
  const [sort, setSort] = useState<MidiTableSort | null>({
    field: "title",
    how: "asc",
  });

  const { showFavorites, songData, setSongMetaData, setSongData } =
    useAppStore();
  const { playSong, stopSong } = useSongActions();
  const { setColor } = useWaterColorStore();
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    LOCAL_STORAGE_FAVORITES,
    []
  );

  useEffect(() => {
    const awaitSongs = async () => {
      const songs = await getSongs();
      setSongList(songs);
    };
    awaitSongs();
  }, []);

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

  const filterSongs = (song: MidiWithId) => {
    if (showFavorites && !favorites.includes(song.id)) return false;
    if (!filter) return true;
    return filter(song);
  };

  const toggleFavorite = (id: number) => {
    const isFavorite = favorites.includes(id);
    return () => {
      if (isFavorite) setFavorites(favorites.filter((f) => f !== id));
      else setFavorites([...favorites, id]);
    };
  };

  const playMidi = (song: Midi, metaData: MidiMetadata, track: number) => {
    if (songData) stopSong();
    const newSongData = getSongData(song, track);
    setColor(metaData.waterColor);
    playSong({ song: newSongData });
    setSongMetaData(metaData);
    setSongData(newSongData);
  };

  return (
    <>
      <div className="flex pl-5 pb-5 pr-[46px]">
        <div className="min-w-[2.5rem] basis-10" />
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
        <div className="min-w-[2.5rem] basis-10" />
      </div>
      <CardContainer height="calc(100% - 162px)">
        {songList
          .filter(filterSongs)
          .sort(sortSongs)
          .map((song) => (
            <SongCard
              key={song.id}
              midi={song}
              isFavorite={favorites.includes(song.id)}
              toggleFavorite={toggleFavorite(song.id)}
              playSong={playMidi}
            />
          ))}
      </CardContainer>
    </>
  );
};

export default MidiPlayerSongList;
