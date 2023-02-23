import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";

const DROPLETS_AMOUNT = 5000;
const INITIAL_VEL = 0.3;
const MOVEMENT_VALUE = 0.3;

const Rain = () => {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.rotation.set(MOVEMENT_VALUE / 2, 0, -MOVEMENT_VALUE);
    return obj;
  }, []);

  const rainPositions = useMemo(() => {
    const droplets = [];
    for (let i = 0; i < DROPLETS_AMOUNT; i++) {
      const vel = INITIAL_VEL;
      const { x, y, z } = getCoords();
      droplets.push({ vel, x, y, z });
    }
    return droplets;
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    rainPositions.forEach((droplet, index) => {
      const { x, y, z } = getCoords();
      droplet.x -= MOVEMENT_VALUE / 2 + droplet.vel / 10;
      droplet.y -= droplet.vel;
      droplet.z -= MOVEMENT_VALUE / 4 + droplet.vel / 10;
      droplet.vel += delta / 10;
      if (droplet.y <= 0) {
        droplet.x = x;
        droplet.y = y;
        droplet.z = z;
        droplet.vel = INITIAL_VEL;
      }
      dummy.position.set(droplet.x, droplet.y, droplet.z);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DROPLETS_AMOUNT]}>
      <capsuleGeometry args={[0.02, 0.05, 1, 4]} rotation={[1, 0, 0]} />
      <pointsMaterial
        args={[{ color: "#c4d3df", opacity: 0.5, transparent: true }]}
      />
    </instancedMesh>
  );
};

const getCoords = () => ({
  x: Math.random() * 225 - 60,
  y: Math.random() * 125 + 50,
  z: Math.random() * 225 - 105,
});

export default Rain;
