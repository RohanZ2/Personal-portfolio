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

// The scene's point-lights are aimed at the screens, leaving the turntable in
// shadow so the dark disc reads as black. A small dedicated light sits just
// above the platter, pointing down, to light the disc surface (and its grooves
// as it spins) without touching the rest of the scene's tuned lighting.
const DISC_LIGHT_HEIGHT = 1.4; // world units above the disc
const DISC_LIGHT_INTENSITY = 32;
const DISC_LIGHT_COLOR = '#fff4e0'; // warm white, like a desk lamp

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

  const discLightPos = useMemo(() => {
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
      // The disc material is almost black, so even a good light barely shows.
      // Lift it to a dark grey and make it less glossy so the surface (and the
      // label/grooves spinning by) actually catches the light. Clone first so
      // we don't mutate the shared GLTF cache.
      if (!mesh.userData.brightened) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
        mat.color.multiplyScalar(2.6); // lift the near-black base toward grey
        mat.emissive = new THREE.Color('#141414'); // faint self-lighting
        if ('roughness' in mat) mat.roughness = Math.min(1, (mat.roughness ?? 0.5) + 0.15);
        mesh.material = mat;
        mesh.userData.brightened = true;
      }
      discRef.current = mesh;
    });

    // World position just above the disc, for the dedicated platter light.
    scene.updateMatrixWorld(true);
    const discWorld = discRef.current
      ? discRef.current.getWorldPosition(new THREE.Vector3())
      : new THREE.Vector3(POSITION_X, SCREENS_BOTTOM_Y, POSITION_Z);
    return new THREE.Vector3(
      discWorld.x,
      discWorld.y + DISC_LIGHT_HEIGHT,
      discWorld.z
    );
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
    <>
      <primitive
        object={scene}
        onClick={onClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
      {/* Dedicated platter light: a point light hovering just above the disc.
          Directly over a flat disc it lights the surface (and the grooves
          spinning past) top-down. A tight `distance` falloff keeps it on the
          turntable and off the screens, so the scene's tuned look is intact. */}
      <pointLight
        position={discLightPos}
        distance={DISC_LIGHT_HEIGHT * 2.2}
        decay={2}
        intensity={DISC_LIGHT_INTENSITY}
        color={DISC_LIGHT_COLOR}
      />
    </>
  );
}

useGLTF.preload('/vinyl_player_optimized.glb');
