import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, PerspectiveCameraProps, useThree } from "@react-three/fiber";
import PianoModel from "./PianoModel";
import { Center, PerspectiveCamera } from "@react-three/drei";
import Lightning from "../scene/Lightning";
import Bloom from "../scene/Bloom";
import Controls from "views/scene/Controls";

const Piano = () => {
  const cameraRef = useRef<PerspectiveCameraProps>();

  useEffect(() => {
    const resize = (e: UIEvent) => {};
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

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
          <PianoModel />
        </Center>
      </Suspense>
    </Canvas>
  );
};

export default Piano;
