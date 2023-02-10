import React, { Suspense, useCallback, useEffect, useRef } from "react";
import { Canvas, PerspectiveCameraProps, useThree } from "@react-three/fiber";
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
  const cameraRef = useRef<PerspectiveCameraProps>();

  // const pressedKeys = useRef<Map<Note, PressedKey>>(new Map());
  const pointerKeyPressed = useRef<null | PressedKey>(null);

  const { keysPressed, midiPanel, allKeysRef, isMidiPlaying } = useAppStore();
  const { playKey, stopKey, stopAllKeys } = useSongActions();

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, note: Note) => {
    e.stopPropagation();
    const mesh = e.object as Mesh;
    const soundId = playKey(note, mesh);
    if (!soundId) return;
    pointerKeyPressed.current = { note, mesh, soundId };
  };

  // handle pointer pressed
  useEffect(() => {
    const pointerUp = () => {
      const pointerKey = pointerKeyPressed.current;
      if (!pointerKey) return;
      stopKey(pointerKey.note, pointerKey.mesh, pointerKey.soundId);
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
      playKey(note, mesh);
    };
    const keyUp = (e: KeyboardEvent) => {
      const note = keyToNote.get(e.key) as Note;
      if (!note) return;
      const mesh = keysPressed.get(note);
      if (!mesh) return;
      stopKey(note, mesh.mesh, mesh.soundId);
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
    <Canvas shadows className="h-full w-full">
      <Bloom />
      <Lightning />
      <Controls />
      <PerspectiveCamera
        fov={60}
        position={[29.74, 22.78, 0.2]}
        rotation={[-1.56, 10.6, 1.56]}
        zoom={2.35}
        makeDefault
        ref={cameraRef}
      />
      <Suspense fallback={null}>
        <Center>
          <PianoModel
            allKeysRef={allKeysRef}
            handlePointerDown={handlePointerDown}
          />
        </Center>
      </Suspense>
    </Canvas>
  );
};

export default Piano;
