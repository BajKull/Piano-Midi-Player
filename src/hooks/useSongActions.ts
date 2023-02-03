import { getSongData, MidiMetadata } from "midi/midiParser";
import { useAppStore } from "store/store";
import { Mesh } from "three";
import { Note, noteToMesh, sounds } from "views/piano/pianoKeys";

const KEY_ROTATION_VALUE = Math.PI / 64;

type PlaySong = {
  song: ReturnType<typeof getSongData>;
  metaData: MidiMetadata;
  startTime?: number;
};

const useSongActions = () => {
  const {
    volume,
    allKeysRef,
    songIntervalTimer,
    setIsMidiPlaying,
    setSongMetaData,
    setSongTimestamp,
  } = useAppStore();

  const playKey = (key: Note, mesh: Mesh) => {
    mesh.rotateZ(KEY_ROTATION_VALUE * -1);
    const sound = sounds.get(key);
    if (!sound) return;
    sound.volume(volume / 100 ?? 1);
    const soundId = sound.play();
    return soundId;
  };

  const stopKey = (key: Note, mesh: Mesh, soundId: number) => {
    mesh.rotateZ(KEY_ROTATION_VALUE);
    const sound = sounds.get(key);
    if (!sound) return;
    sound.fade(sound.volume(), 0, 250, soundId);
    sound.once("fade", () => sound.stop(soundId), soundId);
  };

  const playSong = ({ song, startTime, metaData }: PlaySong) => {
    if (!song) return;
    setIsMidiPlaying(true);
    setSongMetaData(metaData);
    let lastNoteIndex = 0;
    let currentTime = startTime || 0;
    const intervalTime = song?.intervals[0].tick * 16;
    const interval = intervalTime < 10 ? 10 : intervalTime;
    const { events } = song;
    const soundEventMap = new Map();
    songIntervalTimer.current = setInterval(() => {
      if (!events[lastNoteIndex]) return stopSong();
      while (events[lastNoteIndex]?.start <= currentTime) {
        const mesh = noteToMesh(events[lastNoteIndex].note, allKeysRef);
        if (!mesh) {
          lastNoteIndex++;
          continue;
        }
        if (events[lastNoteIndex].mode === "ON") {
          const soundId = playKey(events[lastNoteIndex].note, mesh);
          soundEventMap.set(events[lastNoteIndex].id, soundId);
        } else {
          const soundId = soundEventMap.get(events[lastNoteIndex].id);
          stopKey(events[lastNoteIndex].note, mesh, soundId);
          soundEventMap.delete(events[lastNoteIndex].id);
        }
        lastNoteIndex++;
      }
      currentTime += interval;
      if (currentTime % 1000 < interval)
        setSongTimestamp(Math.floor(currentTime / 1000));
    }, interval);
  };

  const pauseSong = () => {
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const stopSong = () => {
    setIsMidiPlaying(false);
    setSongTimestamp(0);
    setSongMetaData(undefined);
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const resumeSong = () => {};

  return { playKey, stopKey, playSong };
};

export default useSongActions;
