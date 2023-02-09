import { animate } from "framer-motion";
import { getSongData, MidiMetadata } from "midi/midiParser";
import { useAppStore, useTimestampStore } from "store/store";
import { Mesh } from "three";
import { Note, noteToMesh, sounds } from "views/piano/pianoKeys";

const KEY_ROTATION_VALUE = Math.PI / 64;
const ANIMATION_DURATION = 0.05;

type PlaySong = {
  song: ReturnType<typeof getSongData>;
};

const useSongActions = () => {
  const {
    volume,
    allKeysRef,
    songIntervalTimer,
    songData,
    currentPlayingTime,
    lastNoteIndex,
    setSongMetaData,
    setIsMidiPlaying,
    setSongData,
  } = useAppStore();

  const setSongTimestamp = useTimestampStore((state) => state.setSongTimestamp);

  const playKey = (key: Note, mesh: Mesh) => {
    animate(0, -KEY_ROTATION_VALUE, {
      duration: ANIMATION_DURATION,
      onUpdate: (val) => (mesh.rotation.z = val),
    });
    const sound = sounds.get(key);
    if (!sound) return;
    sound.volume(volume / 100 ?? 1);
    const soundId = sound.play();
    return soundId;
  };

  const stopKey = (key: Note, mesh: Mesh, soundId: number) => {
    animate(-KEY_ROTATION_VALUE, 0, {
      duration: ANIMATION_DURATION,
      onUpdate: (val) => (mesh.rotation.z = val),
    });
    const sound = sounds.get(key);
    if (!sound) return;
    sound.fade(sound.volume(), 0, 250, soundId);
    sound.once("fade", () => sound.stop(soundId), soundId);
  };

  const playSong = ({ song }: PlaySong) => {
    if (!song) return;
    setIsMidiPlaying(true);
    const { events } = song;
    const intervalTime = song?.intervals[0].tick * 16;
    const interval = intervalTime < 10 ? 10 : intervalTime;
    const soundEventMap = new Map();
    if (!lastNoteIndex.current) lastNoteIndex.current = 0;
    songIntervalTimer.current = setInterval(() => {
      if (!events[lastNoteIndex.current!]) return stopSong();
      while (
        events[lastNoteIndex.current!]?.start <=
        (currentPlayingTime.current || 0)
      ) {
        const mesh = noteToMesh(
          events[lastNoteIndex.current!].note,
          allKeysRef
        );
        if (!mesh) {
          lastNoteIndex.current!++;
          continue;
        }
        if (events[lastNoteIndex.current!].mode === "ON") {
          const soundId = playKey(events[lastNoteIndex.current!].note, mesh);
          soundEventMap.set(events[lastNoteIndex.current!].id, soundId);
        } else {
          const soundId = soundEventMap.get(events[lastNoteIndex.current!].id);
          stopKey(events[lastNoteIndex.current!].note, mesh, soundId);
          soundEventMap.delete(events[lastNoteIndex.current!].id);
        }
        lastNoteIndex.current!++;
      }
      currentPlayingTime.current
        ? (currentPlayingTime.current += interval)
        : (currentPlayingTime.current = interval);
      if (currentPlayingTime.current % 1000 < interval)
        setSongTimestamp(Math.floor(currentPlayingTime.current) / 1000);
    }, interval);
  };

  const pauseSong = () => {
    setIsMidiPlaying(false);
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const stopSong = () => {
    setIsMidiPlaying(false);
    setSongTimestamp(0);
    setSongMetaData(undefined);
    setSongData(undefined);
    currentPlayingTime.current = 0;
    lastNoteIndex.current = 0;
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const resumeSong = () => {
    if (!songData) return;
    playSong({ song: songData });
  };

  return { playKey, pauseSong, stopKey, resumeSong, playSong };
};

export default useSongActions;
