'use client';

import { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { SCREENS_BOTTOM_Y } from './ComputerScreens';
import { useMusic } from './MusicContext';

const PLAYER_WIDTH = 2; // world units, scaled from the model's raw size
const POSITION_X = 1.9; // right side of the table
const POSITION_Z = 2.9; // toward the player
const YAW = -0.3; // slight angle so it doesn't sit perfectly square
const SPIN_SPEED = 3.5; // rad/s ≈ 33 rpm

// The Pioneer model's spinning platter is the mesh with this material; we
// locate it at runtime to sit the record on top, rather than hardcoding a
// measured position (which is brittle when the model changes). 'metal' is
// the round platter plate, centered on the turntable's spindle — the
// 'plastic' mesh sits slightly off-axis and pulled the record left of center.
const PLATTER_MATERIAL = 'metal';

// The record disc covers most of the platter. Multiplier of the platter's
// diameter so the vinyl reads as a record sitting on (just inside) it.
const RECORD_COVERAGE = 0.92;

export default function VinylPlayer() {
  const { scene } = useGLTF('/vinyl_player_pioneer.glb');
  const { scene: recordSrc } = useGLTF('/vinyl_record.glb');
  const { playing, toggle } = useMusic();
  const speed = useRef(0);
  const discRef = useRef<THREE.Object3D | null>(null);
  // useGLTF caches and shares its scene object. Reparenting/scaling that
  // shared object breaks across remounts and StrictMode's double-run (it left
  // the disc off-center, mis-scaled, and not spinning). A clone is owned by
  // this component, so it's always safe to transform.
  const recordScene = useMemo(() => SkeletonUtils.clone(recordSrc), [recordSrc]);

  const record = useMemo(() => {
    // Place the Pioneer body: reset first (useGLTF caches the scene and
    // StrictMode runs this twice), scale to a known width, and sit it on the
    // table top, same normalization as the other props.
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

    // Find the platter and measure where its top surface is, in world space.
    let platter: THREE.Mesh | null = null;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && (mesh.material as THREE.Material).name === PLATTER_MATERIAL) {
        platter = mesh;
      }
    });
    if (!platter) return null;

    const pBox = new THREE.Box3().setFromObject(platter);
    const pCenter = pBox.getCenter(new THREE.Vector3());
    const platterDiameter = pBox.max.x - pBox.min.x;

    // Reset the clone before measuring, so the memo is idempotent under
    // StrictMode's double-run (measure it in a known, unscaled state).
    recordScene.position.set(0, 0, 0);
    recordScene.rotation.set(0, 0, 0);
    recordScene.scale.setScalar(1);
    recordScene.updateMatrixWorld(true);

    // Size the record to the platter (measured in its reset state).
    const recBox = new THREE.Box3().setFromObject(recordScene);
    const recDiameter = recBox.getSize(new THREE.Vector3()).x;
    const recScale = (platterDiameter * RECORD_COVERAGE) / recDiameter;
    recordScene.scale.setScalar(recScale);

    // Separate "lay it flat" from "spin it" with a holder group, so the two
    // never fight as Euler angles. The record disc lives in its local XY
    // plane, so its spin axis is its own local Z. The holder is tipped -90°
    // about X to lay that disc flat and is positioned on the platter; the
    // record then only ever rotates about Z, which — once the holder has it
    // flat — is a clean spin-in-place around the vertical axis.
    const holder = new THREE.Group();
    holder.rotation.set(-Math.PI / 2, 0, 0);
    // Just above the platter top so it doesn't z-fight the surface.
    holder.position.set(pCenter.x, pBox.max.y + 0.005, pCenter.z);
    holder.add(recordScene);
    holder.updateMatrixWorld(true);

    discRef.current = recordScene;
    return holder;
  }, [scene, recordScene]);

  // Ease the record up to speed / down to a stop instead of snapping. The
  // disc spins about its own local Z (its face normal); the holder group
  // has already tipped that to vertical, so it reads as a flat spin.
  useFrame((_, delta) => {
    const target = playing ? SPIN_SPEED : 0;
    speed.current += (target - speed.current) * (1 - Math.exp(-3 * delta));
    if (discRef.current) {
      discRef.current.rotation.z += speed.current * delta;
    }
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <group
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <primitive object={scene} />
      {record && <primitive object={record} />}
    </group>
  );
}

useGLTF.preload('/vinyl_player_pioneer.glb');
useGLTF.preload('/vinyl_record.glb');
