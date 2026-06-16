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

export default function VinylPlayer() {
  const { scene } = useGLTF('/vinyl_player_optimized.glb');
  const { playing, toggle } = useMusic();
  const speed = useRef(0);
  const discRef = useRef<THREE.Object3D | null>(null);

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
    scene.updateMatrixWorld(true);

    // Make the disc spin in place. Rather than mutate the shared cached
    // geometry (the old re-pivot was fragile — it compounded across remounts
    // and StrictMode runs, which is what buried the disc at desk level), wrap
    // the disc mesh in a pivot Group centered on the disc's own world center.
    // Spinning the group then turns the disc about its true axis, and the
    // disc keeps its original position on the platter.
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      if ((mesh.material as THREE.Material).name !== 'cd.002') return;
      if (mesh.userData.wrapped) {
        discRef.current = mesh.parent; // the pivot group from a prior run
        return;
      }

      // World center of the disc (where its spin axis passes through).
      const discCenter = new THREE.Box3()
        .setFromObject(mesh)
        .getCenter(new THREE.Vector3());

      const parent = mesh.parent!;
      const pivot = new THREE.Group();
      // Place the pivot at the disc center (in the parent's local space) so
      // the mesh, offset back by the same amount, ends up exactly where it
      // started — but now rotating the pivot spins the disc about its center.
      const localCenter = parent.worldToLocal(discCenter.clone());
      pivot.position.copy(localCenter);
      parent.add(pivot);
      pivot.add(mesh);
      mesh.position.sub(localCenter);

      // Lift the near-black disc material toward grey + faint self-lighting so
      // its surface (and the grooves spinning by) actually catches light.
      // Clone first so we don't mutate the shared GLTF cache.
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      mat.color.multiplyScalar(2.6);
      mat.emissive = new THREE.Color('#141414');
      if ('roughness' in mat) mat.roughness = Math.min(1, (mat.roughness ?? 0.5) + 0.15);
      mesh.material = mat;

      mesh.userData.wrapped = true;
      discRef.current = pivot;
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
