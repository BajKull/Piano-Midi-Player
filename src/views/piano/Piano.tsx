import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import PianoModel from "./PianoModel";
import { OrbitControls, Stage } from "@react-three/drei";
import BloomEffect from "./BloomEffect";
import { Vector3 } from "three";

// pan - rmb
// zoom - mwheel
// rotate - lmb

const Piano = () => {
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
