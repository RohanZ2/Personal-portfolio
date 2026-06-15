'use client';

import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { SCREENS_BOTTOM_Y } from './ComputerScreens';
import { useMusic } from './MusicContext';

const PLAYER_WIDTH = 2; // world units, scaled from the model's raw size
const POSITION_X = 1.9; // right side of the table
const POSITION_Z = 2.9; // toward the player
const YAW = -0.3; // slight angle so it doesn't sit perfectly square
const SPIN_SPEED = 3.5; // rad/s ≈ 33 rpm

// Local-space spin axis of the disc, measured from the GLB's vertex data.
// The disc mesh (material "cd.002") is centered here, not at its node
// origin, so the geometry gets re-pivoted once to spin in place.
const DISC_CENTER_X = 0.395;
const DISC_CENTER_Z = -0.132;

export default function VinylPlayer() {
  const { scene } = useGLTF('/vinyl_player_optimized.glb');
  const { playing, toggle } = useMusic();
  const speed = useRef(0);
  const discRef = useRef<THREE.Mesh | null>(null);

  useMemo(() => {
    // Same normalization pattern as the other models: reset first so the
    // cached scene survives StrictMode double-runs, then scale and sit it
    // on the table top.
    scene.rotation.set(0, YAW, 0);
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = PLAYER_WIDTH / size.x;

    scene.scale.setScalar(scale);
    scene.position.set(
      POSITION_X - center.x * scale,
      SCREENS_BOTTOM_Y - box.min.y * scale,
      POSITION_Z - center.z * scale
    );

    // Re-pivot the disc so rotating its node spins it around its own axis.
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      if ((mesh.material as THREE.Material).name !== 'cd.002') return;
      if (!mesh.userData.pivoted) {
        mesh.geometry.translate(-DISC_CENTER_X, 0, -DISC_CENTER_Z);
        mesh.position.set(DISC_CENTER_X, 0, DISC_CENTER_Z);
        mesh.userData.pivoted = true;
      }
      discRef.current = mesh;
    });
  }, [scene]);

  // Ease the platter up to speed / down to a stop instead of snapping.
  useFrame((_, delta) => {
    const target = playing ? SPIN_SPEED : 0;
    speed.current += (target - speed.current) * (1 - Math.exp(-3 * delta));
    if (discRef.current) {
      discRef.current.rotation.y += speed.current * delta;
    }
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <primitive
      object={scene}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    />
  );
}

useGLTF.preload('/vinyl_player_optimized.glb');
