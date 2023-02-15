import { animate } from "framer-motion";
import { getSongData, MidiMetadata } from "midi/midiParser";
import { useAppStore } from "store/store";
import { useTimestampStore } from "store/timestampStore";
import { Mesh } from "three";
import { Note, noteToMesh, sounds } from "views/piano/pianoKeys";

const KEY_ROTATION_VALUE = Math.PI / 64;
const ANIMATION_DURATION = 0.05;

type PlaySong = { song: ReturnType<typeof getSongData> };
type PlayKey = { note: Note; mesh: Mesh };
type StopKey = { note: Note; mesh: Mesh; soundId: number; fadeTime?: number };

const useSongActions = () => {
  const {
    volume,
    allKeysRef,
    songIntervalTimer,
    songData,
    currentPlayingTime,
    keysPressed,
    lastNoteIndex,
    setSongMetaData,
    setIsMidiPlaying,
    setSongData,
  } = useAppStore();

  const setSongTimestamp = useTimestampStore((state) => state.setSongTimestamp);

  const playKey = ({ note, mesh }: PlayKey) => {
    animate(0, -KEY_ROTATION_VALUE, {
      duration: ANIMATION_DURATION,
      onUpdate: (val) => (mesh.rotation.z = val),
    });
    const sound = sounds.get(note);
    if (!sound) return;
    const soundId = sound.play();
    sound.volume(volume / 100 ?? 1, soundId);
    keysPressed.set(note, { soundId, mesh });
    return soundId;
  };

  const stopKey = ({ note, mesh, soundId, fadeTime }: StopKey) => {
    animate(-KEY_ROTATION_VALUE, 0, {
      duration: ANIMATION_DURATION,
      onUpdate: (val) => (mesh.rotation.z = val),
    });
    const sound = sounds.get(note);
    if (!sound) return;
    keysPressed.delete(note);
    sound.fade(1, 0, fadeTime || 250, soundId);
    sound.once("fade", () => sound.stop(soundId), soundId);
  };

  const stopAllKeys = () => {
    keysPressed.forEach((keyPressed, note) => {
      stopKey({ note, mesh: keyPressed.mesh, soundId: keyPressed.soundId });
    });
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
          const soundId = playKey({
            note: events[lastNoteIndex.current!].note,
            mesh,
          });
          soundEventMap.set(events[lastNoteIndex.current!].id, soundId);
        } else {
          const soundId = soundEventMap.get(events[lastNoteIndex.current!].id);
          stopKey({ note: events[lastNoteIndex.current!].note, mesh, soundId });
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
    stopAllKeys();
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const stopSong = () => {
    setIsMidiPlaying(false);
    setSongTimestamp(0);
    setSongMetaData(undefined);
    setSongData(undefined);
    stopAllKeys();
    currentPlayingTime.current = 0;
    lastNoteIndex.current = 0;
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const resumeSong = () => {
    if (!songData) return;
    playSong({ song: songData });
  };

  return {
    playKey,
    pauseSong,
    stopKey,
    resumeSong,
    playSong,
    stopSong,
    stopAllKeys,
  };
};

export default useSongActions;
