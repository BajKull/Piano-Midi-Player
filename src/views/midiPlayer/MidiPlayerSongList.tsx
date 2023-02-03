import { Midi } from "@tonejs/midi";
import SongCard from "components/songCard/SongCard";
import {
  getSongData,
  getSongs,
  MidiMetadata,
  MidiWithId,
} from "midi/midiParser";
import React, { useEffect, useState } from "react";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableHeader from "components/table/header/TableHeader";
import { useAppStore } from "store/store";
import useLocalStorage from "hooks/useLocalStorage";
import { LOCAL_STORAGE_FAVORITES } from "constants/keys";
import useSongActions from "hooks/useSongActions";

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

  const { showFavorites } = useAppStore();
  const { playSong } = useSongActions();
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    LOCAL_STORAGE_FAVORITES,
    []
  );

  useEffect(() => {
    const awaitSongs = async () => {
      const songs = await getSongs();
      setSongList(songs);
      // const songData = getSongData(songs.hesPirate, 0);
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

  const filterFavorites = (song: MidiWithId) => {
    if (!showFavorites) return true;
    return favorites.includes(song.id);
  };

  const toggleFavorite = (id: number) => {
    const isFavorite = favorites.includes(id);
    return () => {
      if (isFavorite) setFavorites(favorites.filter((f) => f !== id));
      else setFavorites([...favorites, id]);
    };
  };

  const playMidi = (song: Midi, metaData: MidiMetadata, track: number) => {
    const songData = getSongData(song, track);

    playSong({
      song: songData,
      metaData,
    });
  };

  return (
    <div>
      <div className="flex py-5 px-5">
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
      {songList
        .filter(filterFavorites)
        .sort(sortSongs)
        .map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isFavorite={favorites.includes(song.id)}
            toggleFavorite={toggleFavorite(song.id)}
            playSong={playMidi}
          />
        ))}
    </div>
  );
};

export default MidiPlayerSongList;
