import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, PerspectiveCameraProps, useThree } from "@react-three/fiber";
import PianoModel from "./PianoModel";
import {
  Center,
  OrbitControls,
  PerspectiveCamera,
  Stage,
  useHelper,
} from "@react-three/drei";
import BloomEffect from "./BloomEffect";
import { SpotLight, SpotLightHelper } from "three";
import Lightning from "./Lightning";

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
      <Lightning />
      <OrbitControls
        // enableZoom={false}
        // enableRotate={false}
        // enablePan={false}
        target={[-3.35, 4.37, 0.02]}
      />
      <PerspectiveCamera
        fov={60}
        position={[29.74, 22.78, 0.2]}
        rotation={[-1.56, 10.6, 1.56]}
        zoom={2.35}
        makeDefault
        ref={cameraRef}
      />
      <Suspense fallback={null}>
        <BloomEffect>
          <Center>
            <PianoModel />
          </Center>
        </BloomEffect>
      </Suspense>
    </Canvas>
  );
};

export default Piano;
