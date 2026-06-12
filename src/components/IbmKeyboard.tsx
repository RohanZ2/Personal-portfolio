'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { placeOnTable } from './placeOnTable';

export default function IbmKeyboard() {
  const { scene } = useGLTF('/ibm_model_m_keyboard.glb');

  useMemo(() => {
    placeOnTable(scene, { width: 2.4, x: -0.4, z: 3.6, yaw: 0.05 });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/ibm_model_m_keyboard.glb');
