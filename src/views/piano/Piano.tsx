import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, PerspectiveCameraProps, useThree } from "@react-three/fiber";
import PianoModel from "./PianoModel";
import { OrbitControls, PerspectiveCamera, Stage } from "@react-three/drei";
import BloomEffect from "./BloomEffect";
import { Vector3 } from "three";

// const cameraLookAt = new Vector3(-3.35, 4.37, 0.02);

const Piano = () => {
  // const cameraRef = useRef<PerspectiveCameraProps>();
  return (
    <Canvas
      shadows
      camera={{
        fov: 60,
        position: [29.74, 22.78, 0.2],
        rotation: [-1.56, 10.6, 1.56],
        zoom: 2.35,
      }}
      className="h-full w-full"
    >
      <OrbitControls
        enableZoom={false}
        enableRotate={false}
        enablePan={false}
        target={[-3.35, 4.37, 0.02]}
      />
      {/* <PerspectiveCamera
        fov={60}
        position={[29.74, 22.78, 0.2]}
        rotation={[-1.56, 10.6, 1.56]}
        zoom={2.35}
        makeDefault
        aspect={16 / 9}
        ref={cameraRef}
        on
      /> */}
      <Suspense fallback={null}>
        <BloomEffect>
          <Stage preset="rembrandt" intensity={1}>
            <PianoModel />
          </Stage>
        </BloomEffect>
      </Suspense>
    </Canvas>
  );
};

export default Piano;
