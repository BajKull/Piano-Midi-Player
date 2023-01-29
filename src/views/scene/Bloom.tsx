import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React from "react";

const BloomEffect = () => {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={1} intensity={0.005} />
    </EffectComposer>
  );
};

export default BloomEffect;
