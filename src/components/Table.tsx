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

// The office_desk.glb model ships fully dressed — monitor, chair, papers, a
// cable, keyboard and mouse — each on its own material. We only want the bare
// desk, which is the one with this material; everything else is hidden so the
// scene's own props (screens, vinyl, keyboards) sit on a clean surface.
const DESK_MATERIAL = 'wire_127127127';

// The model faces away from the camera by default, so its leg/back panel
// shows. Spin it 180° about Y to present the open front toward the viewer.
const DESK_YAW = Math.PI;

export default function Table() {
  const { scene } = useGLTF('/office_desk.glb');

  useMemo(() => {
    // Strip every mesh that isn't the bare desk. We remove them outright (not
    // just toggle .visible) because Box3.setFromObject still includes
    // invisible meshes, which would skew the scale/placement below. The
    // userData guard keeps this idempotent under useGLTF's cache + StrictMode's
    // double-run.
    if (!scene.userData.declutered) {
      const drop: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh && (mesh.material as THREE.Material).name !== DESK_MATERIAL) {
          drop.push(mesh);
        }
      });
      drop.forEach((m) => m.removeFromParent());
      scene.userData.declutered = true;
    }

    // useGLTF caches the scene object and StrictMode runs this twice, so
    // reset the transform first to keep the math idempotent. Start from the
    // base yaw that turns the desk's front toward the camera.
    scene.rotation.set(0, DESK_YAW, 0);
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    // Make sure the table's long side runs left-right before measuring.
    let box = new THREE.Box3().setFromObject(scene);
    let size = box.getSize(new THREE.Vector3());
    if (size.x < size.z) {
      scene.rotation.y = DESK_YAW + Math.PI / 2;
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

useGLTF.preload('/office_desk.glb');
