import type * as THREE from 'three';

// The world-space placement of one monitor's glass: its center point and size,
// measured from the GLB and shared by every screen component that pins content
// onto it.
export type ScreenRect = {
  center: THREE.Vector3;
  width: number;
  height: number;
};
