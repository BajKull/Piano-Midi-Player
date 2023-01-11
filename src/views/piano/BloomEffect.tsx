import { useFrame, useThree, extend } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Scene, WebGLRenderTarget } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

type Props = {
  children: React.ReactElement;
};

const BloomEffect = ({ children }: Props) => {
  const { gl, camera, size } = useThree();
  const [scene, setScene] = useState<any>();
  const composer = useRef<any>();
  useEffect(
    () => void scene && composer.current.setSize(size.width, size.height),
    [scene, size]
  );
  // useFrame(() => scene && composer.current.render(), 1);
  return (
    <>
      {children}
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attach="passes" scene={scene} camera={camera} />
        {/* @ts-ignore */}
        <unrealBloomPass attachArray="passes" args={[undefined, 1.5, 1, 0]} />
      </effectComposer>
    </>
  );
};

export default BloomEffect;
