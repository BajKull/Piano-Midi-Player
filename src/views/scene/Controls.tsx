import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import React from "react";
import { useAppStore } from "store/store";

const Controls = () => {
  const { cameraControl } = useAppStore();
  return (
    <>
      <OrbitControls
        enableZoom={cameraControl}
        enableRotate={cameraControl}
        enablePan={cameraControl}
        target={[-3.35, 4.37, -9.75]}
      />
      <PerspectiveCamera
        fov={60}
        position={[32.74, 22.78, -9.75]}
        rotation={[-1.56, 10.6, 1.56]}
        zoom={2.35}
        makeDefault
      />
    </>
  );
};

export default Controls;
