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
  const { scene: recordSrc } = useGLTF('/12_vinyl_record.glb');
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

    // Lay the disc flat in a model-agnostic way. A record's bounding box is
    // thin on one axis (its face normal); whichever that is, rotate it onto
    // the world Y axis so the disc sits flat on the platter. This avoids
    // hardcoding an orientation that differs from one record GLB to the next.
    const recBox0 = new THREE.Box3().setFromObject(recordScene);
    const recSize = recBox0.getSize(new THREE.Vector3());
    const thin = Math.min(recSize.x, recSize.y, recSize.z);
    if (thin === recSize.z) recordScene.rotation.x = -Math.PI / 2; // face is XY -> tip up
    else if (thin === recSize.x) recordScene.rotation.z = Math.PI / 2; // face is YZ
    // (thin === y already means the disc lies flat in XZ; no rotation needed)
    recordScene.updateMatrixWorld(true);

    // Size the record to the platter, measured by its on-table footprint (the
    // two non-vertical extents) after it's been laid flat.
    const recBox = new THREE.Box3().setFromObject(recordScene);
    const recFootprint = Math.max(
      recBox.max.x - recBox.min.x,
      recBox.max.z - recBox.min.z
    );
    const recScale = (platterDiameter * RECORD_COVERAGE) / recFootprint;
    recordScene.scale.setScalar(recScale);
    recordScene.updateMatrixWorld(true);

    // Recenter the disc's own bbox onto its origin so it spins about its
    // center, not an off-origin pivot (handles discs modeled off-center).
    const recCenter = new THREE.Box3()
      .setFromObject(recordScene)
      .getCenter(new THREE.Vector3());
    recordScene.position.set(-recCenter.x, -recCenter.y, -recCenter.z);
    recordScene.updateMatrixWorld(true);

    // Two nested groups keep "lay flat" and "spin" from fighting as Euler
    // angles (the bug that made an earlier disc tumble): the disc carries
    // whatever tilt was needed to lie flat; the SPINNER wrapping it is
    // unrotated and only ever turns about world Y — a clean flat spin. The
    // outer holder just parks the whole thing on the platter spindle.
    const spinner = new THREE.Group();
    spinner.add(recordScene);

    const holder = new THREE.Group();
    holder.position.set(pCenter.x, pBox.max.y + 0.005, pCenter.z);
    holder.add(spinner);
    holder.updateMatrixWorld(true);

    discRef.current = spinner;
    return holder;
  }, [scene, recordScene]);

  // Ease the record up to speed / down to a stop instead of snapping. The
  // spinner group is unrotated and lies flat, so turning it about Y reads as
  // the record spinning in place.
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
