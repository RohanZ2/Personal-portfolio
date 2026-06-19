'use client';

import { useRef, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScreenFocus } from './screenFocusStore';

// Wraps desk props (keyboards, vinyl player) and fades them out while a screen
// is expanded, fading them back when the view returns to the room. When you
// zoom into a lower screen the camera sits behind the desk, so without this the
// props poke into the bottom of the frame and overlap the glass. Fading (rather
// than hard-hiding) keeps the transition smooth and matches the camera ease.
export default function DeskProp({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const opacity = useRef(1);
  const { focused } = useScreenFocus();

  useFrame((_, delta) => {
    const target = focused ? 0 : 1;
    const t = 1 - Math.exp(-6 * delta);
    opacity.current += (target - opacity.current) * t;
    const o = opacity.current;
    const visible = o > 0.01;

    const g = group.current;
    if (!g) return;
    g.visible = visible; // fully skip render + raycast once invisible
    if (!visible) return;

    g.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const mat = m as THREE.Material;
        if (!mat.transparent) mat.transparent = true;
        mat.opacity = o;
        mat.depthWrite = o > 0.99; // avoid sorting artifacts mid-fade
      }
    });
  });

  return <group ref={group}>{children}</group>;
}
