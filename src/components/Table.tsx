'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SCREENS_BOTTOM_Y } from './ComputerScreens';

// Wider than the monitor bank so the table fills most of the view when the
// camera tilts down toward it.
const TABLE_WIDTH = 7;

// World Z of the table's front edge. The camera sits at z=7, so this puts
// the desk surface right under the player when they look down — close
// enough for interactive props to be placed on it later.
const TABLE_FRONT_Z = 4.5;

export default function Table() {
  const { scene } = useGLTF('/simple_table_low_poly.glb');

  useMemo(() => {
    // useGLTF caches the scene object and StrictMode runs this twice, so
    // reset the transform first to keep the math idempotent.
    scene.rotation.set(0, 0, 0);
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    // Make sure the table's long side runs left-right before measuring.
    let box = new THREE.Box3().setFromObject(scene);
    let size = box.getSize(new THREE.Vector3());
    if (size.x < size.z) {
      scene.rotation.y = Math.PI / 2;
      scene.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(scene);
      size = box.getSize(new THREE.Vector3());
    }

    const center = box.getCenter(new THREE.Vector3());
    const scale = TABLE_WIDTH / size.x;

    // Top surface flush with the bottom of the screens, pulled out toward
    // the player so the desk sits under them, centered on the camera axis.
    scene.scale.setScalar(scale);
    scene.position.set(
      -center.x * scale,
      SCREENS_BOTTOM_Y - box.max.y * scale,
      TABLE_FRONT_Z - box.max.z * scale
    );
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/simple_table_low_poly.glb');
