import * as THREE from 'three';
import { SCREENS_BOTTOM_Y } from './ComputerScreens';

// Shared normalization for props sitting on the desk: reset the cached
// scene's transform (StrictMode runs memos twice), scale it to a target
// width, and drop it onto the table top at (x, z).
export function placeOnTable(
  scene: THREE.Object3D,
  opts: { width: number; x: number; z: number; yaw?: number }
) {
  scene.rotation.set(0, opts.yaw ?? 0, 0);
  scene.position.set(0, 0, 0);
  scene.scale.setScalar(1);
  scene.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = opts.width / size.x;

  scene.scale.setScalar(scale);
  scene.position.set(
    opts.x - center.x * scale,
    SCREENS_BOTTOM_Y - box.min.y * scale,
    opts.z - center.z * scale
  );
  scene.updateMatrixWorld(true);
}
