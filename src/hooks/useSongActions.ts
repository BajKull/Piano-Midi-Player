import { getSongData } from "midi/midiParser";
import { useAppStore } from "store/store";
import { Mesh } from "three";
import { Note, noteToMesh, sounds } from "views/piano/pianoKeys";

const KEY_ROTATION_VALUE = Math.PI / 64;

type PlaySong = {
  song: ReturnType<typeof getSongData>;
  startTime?: number;
};

const useSongActions = () => {
  const { volume, allKeysRef, songIntervalTimer, setIsMidiPlaying } =
    useAppStore();

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

  const playSong = ({ song, startTime }: PlaySong) => {
    if (!song) return;
    setIsMidiPlaying(true);
    let lastNoteIndex = 0;
    let currentTime = startTime || 0;
    const { events } = song;
    const soundEventMap = new Map();
    songIntervalTimer.current = setInterval(() => {
      if (!events[lastNoteIndex]) {
        setIsMidiPlaying(false);
        if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
      }
      while (events[lastNoteIndex].start <= currentTime) {
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
      currentTime += song?.intervals[0].tick * 16;
    }, song?.intervals[0].tick * 16);
  };

  const pauseSong = () => {
    if (songIntervalTimer.current) clearInterval(songIntervalTimer.current);
  };

  const stopSong = () => {};

  const resumeSong = () => {};

  return { playKey, stopKey, playSong };
};

export default useSongActions;
