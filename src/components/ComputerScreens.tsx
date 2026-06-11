'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// The imaginary wall sits on this Z plane. The back of the monitor bank is
// flush against it, so a visible wall mesh can later be dropped in at the
// same plane without re-tuning the model position.
export const WALL_Z = -1.5;

// How wide the whole 4-screen bank should be in world units.
const TARGET_WIDTH = 5;

export default function ComputerScreens() {
  const { scene } = useGLTF('/retro_cyberpunk_computer_screens.glb');

  useMemo(() => {
    // Normalize the Sketchfab export: the model ships facing away from the
    // camera, so flip it, then scale to a known width, center it on the
    // camera axis, and push it back until it touches the wall plane.
    scene.rotation.y = Math.PI;
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = TARGET_WIDTH / size.x;

    scene.scale.setScalar(scale);
    scene.position.set(
      -center.x * scale,
      -center.y * scale,
      WALL_Z - box.min.z * scale
    );
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/retro_cyberpunk_computer_screens.glb');