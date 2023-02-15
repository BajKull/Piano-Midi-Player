import { Cloud, Sky } from "@react-three/drei";
import React from "react";

const SceneSky = () => {
  return (
    <>
      <Sky sunPosition={[-500, 50, -500]} turbidity={10} />
      <Cloud
        scale={15}
        segments={50}
        position={[-250, 75, 0]}
        speed={0.1}
        opacity={0.75}
      />
      <Cloud
        scale={15}
        segments={50}
        position={[250, 75, 0]}
        speed={0.1}
        opacity={0.75}
      />
      <Cloud
        scale={15}
        segments={25}
        position={[75, 75, -350]}
        speed={0.1}
        opacity={0.75}
      />
      <Cloud
        scale={15}
        segments={25}
        position={[-75, 75, -350]}
        speed={0.1}
        opacity={0.75}
      />
      <Cloud
        scale={15}
        segments={25}
        speed={0.1}
        opacity={0.75}
        position={[75, 75, 350]}
      />
      <Cloud
        scale={15}
        segments={25}
        speed={0.1}
        opacity={0.75}
        position={[-75, 75, 350]}
      />
    </>
  );
};

export default SceneSky;
