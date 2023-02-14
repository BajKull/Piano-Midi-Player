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
        target={[-3.35, 4.37, 0.02]}
      />
      <PerspectiveCamera
        fov={60}
        position={[31.74, 22.78, 0.2]}
        rotation={[-1.56, 10.6, 1.56]}
        zoom={2.35}
        makeDefault
      />
    </>
  );
};

export default Controls;
