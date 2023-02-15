import {
  OrbitControls,
  OrbitControlsProps,
  PerspectiveCamera,
} from "@react-three/drei";
import React from "react";
import { useAppStore } from "store/store";
import { Vector3 } from "three";

const minPan = new Vector3(-75, 3, -75);
const maxPan = new Vector3(75, 50, 75);

const Controls = () => {
  const { cameraControl } = useAppStore();
  const limitPanning = (e?: THREE.Event) => {
    const orbitControls = e?.target as OrbitControlsProps;
    if (!orbitControls) return;
    const cameraTarget = orbitControls.target as Vector3;
    cameraTarget.clamp(minPan, maxPan);
  };

  return (
    <>
      <OrbitControls
        enableZoom={cameraControl}
        enableRotate={cameraControl}
        enablePan={cameraControl}
        target={[-3.35, 4.37, -9.75]}
        maxZoom={1.2}
        minZoom={1}
        minDistance={25}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2}
        onChange={limitPanning}
      />
      <PerspectiveCamera
        fov={60}
        position={[32.74, 22.78, -9.75]}
        rotation={[-1.56, 10.6, 1.56]}
        zoom={2}
        makeDefault
      />
    </>
  );
};

export default Controls;
