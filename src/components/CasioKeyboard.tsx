'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { placeOnTable } from './placeOnTable';

export default function CasioKeyboard() {
  const { scene } = useGLTF('/casio_keyboard_optimized.glb');

  useMemo(() => {
    placeOnTable(scene, { width: 2, x: -2.4, z: 2.7, yaw: 0.3 });
  }, [scene]);

  return <primitive object={scene} />;
}

useGLTF.preload('/casio_keyboard_optimized.glb');
