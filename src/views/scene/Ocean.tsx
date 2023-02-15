import * as THREE from "three";
import {
  useLoader,
  useThree,
  extend,
  useFrame,
  Object3DNode,
} from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { Water } from "three-stdlib";
import { DEFAULT_WATER_COLOR, useWaterColorStore } from "store/waterStore";
import { Color } from "three";
import { animate } from "framer-motion";

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
  const { color } = useWaterColorStore();

  const oldColorRef = useRef(color);

  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: "#fff",
      waterColor: DEFAULT_WATER_COLOR,
      distortionScale: 2.137,
      fog: false,
      format: gl.outputEncoding,
      clipBias: 1.8,
    }),
    [gl.outputEncoding, waterNormals]
  );

  useEffect(() => {
    const changeColor = () => {
      animate(oldColorRef.current, color, {
        duration: 5,
        onUpdate: (value) => {
          if (!ref.current) return;
          ref.current.material.uniforms["waterColor"].value = new Color(value);
        },
      });
    };
    if (oldColorRef.current !== color) {
      changeColor();
      oldColorRef.current = color;
    }
  }, [color]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.material.uniforms.time.value += delta / 3;
  });

  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />;
};

export default Ocean;
