/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

const DUCK_MIN_POS = new Vector3(-15, -5, -15);
const DUCK_MAX_POS = new Vector3(15, 5, 15);
const BOUNDARY = new Box3(DUCK_MIN_POS, DUCK_MAX_POS);

import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame } from "@react-three/fiber";
import { Box3, Mesh, Vector3 } from "three";
import { animate } from "framer-motion";

type GLTFResult = GLTF & {
  nodes: {
    Duckred001: THREE.Mesh;
    Bill001: THREE.Mesh;
    Visor_glass001: THREE.Mesh;
    Visor_rim001: THREE.Mesh;
  };
  materials: {
    ["Duck body"]: THREE.MeshStandardMaterial;
    Visor: THREE.MeshStandardMaterial;
  };
};

export function Duck(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/duck.glb") as GLTFResult;
  const duckRef = useRef<Mesh | null>(null);
  const duckDirection = useRef(new Vector3());
  const timeoutRef = useRef<NodeJS.Timer>()
  const duckRotation = useRef(1);
  const duckPushForce = useRef(1);

  useFrame(({clock}) => {
    const duck = duckRef.current;
    if (!duck) return;
    const posAmount = Math.max(0.0005, 0.0015 * Math.random());
    const rotAmount = Math.max(Math.random() * 0.01);
    duck.getWorldDirection(duckDirection.current);
    duck.position.add(duckDirection.current.multiplyScalar(posAmount * duckPushForce.current));
    duck.position.clamp(BOUNDARY.min, BOUNDARY.max);
    duck.rotateY(rotAmount * duckRotation.current);
    duck.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
  });

  const pushDuck = () => {
    animate(1, 55, {
      repeat: 1,
      repeatType: 'reverse',
      onUpdate: (val) => duckPushForce.current = val,
      duration: 0.25,
      ease: "easeOut"
    })
  }

  useEffect(() => {
    const resetTimer = () => {
      const randomTime = Math.floor(Math.random() * 15 + 1)
      timeoutRef.current = setTimeout(() => {
        const switchDirection = (n: number) => {
          duckRotation.current = n;
          resetTimer();
        }
        const direction = Math.floor(Math.random() * 3);
        switch(direction) {
          case 0: return switchDirection(-1);
          case 1: return switchDirection(0);
          case 2: return switchDirection(1);
          default: return switchDirection(0);;
        }
      }, randomTime * 1000)
    }
    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, [])

  return (
    <group {...props} dispose={null} scale={3}>
      <mesh
        geometry={nodes.Duckred001.geometry}
        material={materials["Duck body"]}
        position={[1, 0, -2]}
        rotation={[0, -2, 0]}
        ref={duckRef}
        onClick={pushDuck}
      >
        <mesh
          geometry={nodes.Bill001.geometry}
          material={materials["Duck body"]}
          position={[0, 0.17, 0.51]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh
          geometry={nodes.Visor_glass001.geometry}
          material={materials.Visor}
          position={[0, 0.23, 0.09]}
        />
        <mesh
          geometry={nodes.Visor_rim001.geometry}
          material={materials["Duck body"]}
          position={[-0.01, 0.13, -0.07]}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/duck.glb");
