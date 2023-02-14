import * as THREE from "three";
import {
  useLoader,
  useThree,
  extend,
  useFrame,
  Object3DNode,
} from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { Water } from "three-stdlib";

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}

const Ocean = () => {
  const ref = useRef<Water | null>(null);
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(THREE.TextureLoader, "/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(1000, 1000), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 2.137,
      fog: false,
      format: gl.outputEncoding,
      clipBias: 1.9,
    }),
    [gl.outputEncoding, waterNormals]
  );

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.material.uniforms.time.value += delta / 3;
  });

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
};

export default Ocean;
