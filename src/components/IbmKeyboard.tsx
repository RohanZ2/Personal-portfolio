'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { placeOnTable } from './placeOnTable';

export default function IbmKeyboard() {
  const { scene } = useGLTF('/ibm_model_m_keyboard.glb');

  useMemo(() => {
    placeOnTable(scene, { width: 2.4, x: -0.4, z: 3.6, yaw: 0.05 });

    // Tint the whole keyboard black. Clone each material first so we don't
    // mutate the shared GLTF cache, and drop the baked texture so the color
    // shows flat instead of being multiplied against the original photo.
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.blacked) return;
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      mat.map = null;
      mat.color.set('#111111');
      mesh.material = mat;
      mesh.userData.blacked = true;
    });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/ibm_model_m_keyboard.glb');
