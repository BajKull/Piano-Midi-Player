import React, { useEffect, useRef } from "react";
import { PerspectiveCameraProps, useThree } from "@react-three/fiber";
import PianoModel from "./PianoModel";
import { Center, PerspectiveCamera } from "@react-three/drei";
import Lightning from "../scene/Lightning";
import Bloom from "../scene/Bloom";
import Controls from "views/scene/Controls";
import { Mesh } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { keyToNote, Note, noteToMesh, sounds } from "./pianoKeys";
import { useAppStore } from "store/store";
import useSongActions from "hooks/useSongActions";

type PressedKey = { note: Note; mesh: Mesh; soundId: number };

const Piano = () => {
  const pointerKeyPressed = useRef<null | PressedKey>(null);

  const { keysPressed, midiPanel, allKeysRef, isMidiPlaying } = useAppStore();
  const { playKey, stopKey, stopAllKeys } = useSongActions();

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, note: Note) => {
    e.stopPropagation();
    const mesh = e.object as Mesh;
    const soundId = playKey({ note, mesh });
    if (!soundId) return;
    pointerKeyPressed.current = { note, mesh, soundId };
  };

  // handle pointer pressed
  useEffect(() => {
    const pointerUp = () => {
      const pointerKey = pointerKeyPressed.current;
      if (!pointerKey) return;
      stopKey({ ...pointerKey });
      pointerKeyPressed.current = null;
    };

    window.addEventListener("pointerup", pointerUp);
    return () => {
      window.removeEventListener("pointerup", pointerUp);
    };
  }, [stopKey]);

  // handle keyboard pressed
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (midiPanel) return;
      const note = keyToNote.get(e.key) as Note;
      if (keysPressed.get(note)) return;
      if (!note) return;
      const mesh = noteToMesh(note, allKeysRef);
      if (!mesh) return;
      playKey({ note, mesh });
    };
    const keyUp = (e: KeyboardEvent) => {
      const note = keyToNote.get(e.key) as Note;
      if (!note) return;
      const key = keysPressed.get(note);
      if (!key) return;
      stopKey({ note, mesh: key.mesh, soundId: key.soundId });
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [allKeysRef, keysPressed, midiPanel, playKey, stopKey]);

  // stop all keys when tab looses focus
  useEffect(() => {
    const windowFocusLost = () => {
      if (!isMidiPlaying) stopAllKeys();
    };

    window.addEventListener("blur", windowFocusLost);
    return () => {
      window.removeEventListener("blur", windowFocusLost);
    };
  }, [isMidiPlaying, stopAllKeys]);

  return (
    <>
      <Center position={[0, 3, 0]}>
        <PianoModel
          allKeysRef={allKeysRef}
          handlePointerDown={handlePointerDown}
        />
      </Center>
    </>
  );
};

export default Piano;
