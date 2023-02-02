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

type PressedKey = {
  mesh: Mesh;
  soundId: number;
};

const Piano = () => {
  const cameraRef = useRef<PerspectiveCameraProps>();

  const pressedKeys = useRef<Map<Note, PressedKey>>(new Map());
  const pointerKeyPressed = useRef<Note | null>(null);

  const { keysPressed, midiPanel, allKeysRef } = useAppStore();
  const { playKey, stopKey } = useSongActions();

  const playUserKey = useCallback(
    (key: Note, mesh: Mesh) => {
      const soundId = playKey(key, mesh);
      if (!soundId) return;
      pressedKeys.current.set(key, { mesh, soundId });
    },
    [playKey]
  );

  const stopUserKey = useCallback(
    (key: Note, mesh: Mesh) => {
      const soundId = pressedKeys.current.get(key)?.soundId;
      pressedKeys.current.delete(key);
      if (!soundId) return;
      stopKey(key, mesh, soundId);
    },
    [stopKey]
  );

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, key: Note) => {
    e.stopPropagation();
    playUserKey(key, e.object as Mesh);
    pointerKeyPressed.current = key;
  };

  // handle pointer pressed
  useEffect(() => {
    const pointerUp = () => {
      const pointerKey = pointerKeyPressed.current;
      if (!pointerKey) return;
      const mesh = pressedKeys.current.get(pointerKey);
      if (!mesh) return;
      stopUserKey(pointerKey, mesh.mesh);
    };

    window.addEventListener("pointerup", pointerUp);
    return () => {
      window.removeEventListener("pointerup", pointerUp);
    };
  }, [stopUserKey]);

  // handle keyboard pressed
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (midiPanel) return;
      if (keysPressed.get(e.key)) return;
      const note = keyToNote.get(e.key) as Note;
      if (!note) return;
      const mesh = noteToMesh(note, allKeysRef);
      if (!mesh) return;
      keysPressed.set(e.key, true);
      playUserKey(note, mesh);
    };
    const keyUp = (e: KeyboardEvent) => {
      if (midiPanel) return;
      const note = keyToNote.get(e.key) as Note;
      if (!note) return;
      const mesh = pressedKeys.current.get(note);
      if (!mesh) return;
      keysPressed.delete(e.key);
      stopUserKey(note, mesh.mesh);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [allKeysRef, keysPressed, midiPanel, playUserKey, stopUserKey]);

  // stop all keys when tab looses focus
  useEffect(() => {
    const windowFocusLost = () => {
      const allPressedKeys = pressedKeys.current.keys();
      keysPressed.clear();
      if (!allPressedKeys) return;
      Array.from(allPressedKeys).forEach((key) => {
        const mesh = pressedKeys.current.get(key);
        if (!mesh) return;
        stopUserKey(key, mesh.mesh);
      });
      const evt = new PointerEvent("pointerup");
      window.dispatchEvent(evt);
    };

    window.addEventListener("blur", windowFocusLost);
    return () => {
      window.removeEventListener("blur", windowFocusLost);
    };
  }, [keysPressed, stopUserKey]);

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
