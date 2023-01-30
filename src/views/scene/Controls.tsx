import { OrbitControls } from "@react-three/drei";
import React from "react";
import { useAppStore } from "store/store";

const Controls = () => {
  const { cameraControl } = useAppStore();
  return (
    <OrbitControls
      enableZoom={cameraControl}
      enableRotate={cameraControl}
      enablePan={cameraControl}
      target={[-3.35, 4.37, 0.02]}
    />
  );
};

export default Controls;
