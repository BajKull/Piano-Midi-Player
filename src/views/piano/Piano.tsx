import React, { Suspense, useCallback, useEffect, useRef } from "react";
import { Canvas, PerspectiveCameraProps, useThree } from "@react-three/fiber";
import PianoModel from "./PianoModel";
import { Center, PerspectiveCamera } from "@react-three/drei";
import Lightning from "../scene/Lightning";
import Bloom from "../scene/Bloom";
import Controls from "views/scene/Controls";
import { Group, Mesh } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { keyToNote, Note, noteToMesh, sounds } from "./pianoKeys";

import { getSongData, getSongs, playSong } from "midi/midiParser";
import { useAppStore } from "store/store";

type PressedKey = {
  mesh: Mesh;
  soundId: number;
};

const KEY_ROTATION_VALUE = Math.PI / 64;

const Piano = () => {
  const cameraRef = useRef<PerspectiveCameraProps>();

  const pressedKeys = useRef<Map<Note, PressedKey>>(new Map());
  const pointerKeyPressed = useRef<Note | null>(null);
  const allKeysRef = useRef<Group | null>(null);
  const songIntervalTimer = useRef<NodeJS.Timer | null>(null);

  const { keysPressed, volume, midiPanel } = useAppStore();

  const volumeRef = useRef(volume);

  const playKey = useCallback(
    (key: Note, mesh: Mesh) => {
      mesh.rotateZ(KEY_ROTATION_VALUE * -1);
      const sound = sounds.get(key);
      if (!sound) return;
      sound.volume(volume / 100 ?? 1);
      const soundId = sound.play();
      pressedKeys.current.set(key, { mesh, soundId });
    },
    [volume]
  );

  const stopKey = (key: Note, mesh: Mesh) => {
    const soundId = pressedKeys.current.get(key)?.soundId;
    pressedKeys.current.delete(key);
    mesh.rotateZ(KEY_ROTATION_VALUE);
    const sound = sounds.get(key);
    if (!sound) return;
    sound.fade(sound.volume(), 0, 250, soundId);
    sound.once("fade", () => sound.stop(soundId), soundId);
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, key: Note) => {
    e.stopPropagation();
    playKey(key, e.object as Mesh);
    pointerKeyPressed.current = key;
  };

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // handle pointer pressed
  useEffect(() => {
    const pointerUp = () => {
      const pointerKey = pointerKeyPressed.current;
      if (!pointerKey) return;
      const mesh = pressedKeys.current.get(pointerKey);
      if (!mesh) return;
      stopKey(pointerKey, mesh.mesh);
    };

    window.addEventListener("pointerup", pointerUp);
    return () => {
      window.removeEventListener("pointerup", pointerUp);
    };
  }, []);

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
      playKey(note, mesh);
    };
    const keyUp = (e: KeyboardEvent) => {
      if (midiPanel) return;
      const note = keyToNote.get(e.key) as Note;
      if (!note) return;
      const mesh = pressedKeys.current.get(note);
      if (!mesh) return;
      keysPressed.delete(e.key);
      stopKey(note, mesh.mesh);
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [keysPressed, midiPanel, playKey]);

  // stop all keys when tab looses focus
  useEffect(() => {
    const windowFocusLost = () => {
      const allPressedKeys = pressedKeys.current.keys();
      keysPressed.clear();
      if (!allPressedKeys) return;
      Array.from(allPressedKeys).forEach((key) => {
        const mesh = pressedKeys.current.get(key);
        if (!mesh) return;
        stopKey(key, mesh.mesh);
      });
      const evt = new PointerEvent("pointerup");
      window.dispatchEvent(evt);
    };

    window.addEventListener("blur", windowFocusLost);
    return () => {
      window.removeEventListener("blur", windowFocusLost);
    };
  }, [keysPressed]);

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
