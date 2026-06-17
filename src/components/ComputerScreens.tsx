'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ScreenHello, { ScreenRect } from './ScreenHello';
import ScreenMusic from './ScreenMusic';
import ScreenPortfolio from './ScreenPortfolio';
import ScreenHotspot from './ScreenHotspot';
import ScreenBootCover from './ScreenBootCover';
import { ScreenId } from './screenFocusStore';

// The imaginary wall sits on this Z plane. The back of the monitor bank is
// flush against it, so a visible wall mesh can later be dropped in at the
// same plane without re-tuning the model position.
export const WALL_Z = -1.5;

// World Y of the bottom edge of the monitor bank. The table top is placed
// exactly here so the two always meet snugly, whatever the models' raw sizes.
export const SCREENS_BOTTOM_Y = -1.6;

// How wide the whole 4-screen bank should be in world units.
const TARGET_WIDTH = 5;

// The four display surfaces all live in one flat mesh (material
// "blackScreen") on the local plane y = SCREEN_PLANE_Y. These rectangles
// were measured from the GLB's vertex data; localToWorld maps them to
// world space so content can be pinned exactly onto each glass.
const SCREEN_PLANE_Y = 0.878;
const SCREEN_QUADS: { x: [number, number]; z: [number, number] }[] = [
  { x: [-5.664, -2.336], z: [-0.979, 0.979] },
  { x: [-5.664, -2.336], z: [1.71, 3.667] },
  { x: [-1.664, 1.664], z: [1.721, 3.679] },
  { x: [-1.664, 1.664], z: [-0.979, 0.979] },
];

export default function ComputerScreens() {
  const { scene } = useGLTF('/retro_cyberpunk_computer_screens.glb');

  const screens = useMemo(() => {
    // Normalize the Sketchfab export: the model ships facing away from the
    // camera, so flip it, then scale to a known width, center it on the
    // camera axis, and push it back until it touches the wall plane.
    // useGLTF caches the scene object and StrictMode runs this twice, so
    // reset the transform first to keep the math idempotent.
    scene.rotation.set(0, Math.PI, 0);
    scene.position.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = TARGET_WIDTH / size.x;

    scene.scale.setScalar(scale);
    scene.position.set(
      -center.x * scale,
      SCREENS_BOTTOM_Y - box.min.y * scale,
      WALL_Z - box.min.z * scale
    );
    scene.updateMatrixWorld(true);

    // Map the display quads to world space and sort them into the 2x2
    // grid as seen by the player.
    let screenMesh: THREE.Mesh | null = null;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && (mesh.material as THREE.Material).name === 'blackScreen') {
        screenMesh = mesh;
      }
    });
    if (!screenMesh) return null;

    const rects: ScreenRect[] = SCREEN_QUADS.map((q) => {
      const p0 = (screenMesh as THREE.Mesh).localToWorld(
        new THREE.Vector3(q.x[0], SCREEN_PLANE_Y, q.z[0])
      );
      const p1 = (screenMesh as THREE.Mesh).localToWorld(
        new THREE.Vector3(q.x[1], SCREEN_PLANE_Y, q.z[1])
      );
      return {
        center: new THREE.Vector3(
          (p0.x + p1.x) / 2,
          (p0.y + p1.y) / 2,
          Math.max(p0.z, p1.z) + 0.02
        ),
        width: Math.abs(p1.x - p0.x),
        height: Math.abs(p1.y - p0.y),
      };
    });
    rects.sort((a, b) => b.center.y - a.center.y);
    const [topRow, bottomRow] = [rects.slice(0, 2), rects.slice(2)].map(
      (row) => row.sort((a, b) => a.center.x - b.center.x)
    );
    return {
      topLeft: topRow[0],
      topRight: topRow[1],
      bottomLeft: bottomRow[0],
      bottomRight: bottomRow[1],
    };
  }, [scene]);

  return (
    <>
      <primitive object={scene} />
      {screens && (
        <>
          <ScreenPortfolio id="topLeft" rect={screens.topLeft} page="about" />
          <ScreenPortfolio id="topRight" rect={screens.topRight} page="projects" />
          <ScreenHello rect={screens.bottomLeft} />
          <ScreenMusic id="bottomRight" rect={screens.bottomRight} />
          {/* The two top screens are drei <Html> (DOM), so they can't draw the
              canvas boot intro themselves. A boot-cover plays the CRT power-on
              over each, then removes itself to reveal the content. The bottom
              two canvas screens run the intro inline. */}
          <ScreenBootCover rect={screens.topLeft} />
          <ScreenBootCover rect={screens.topRight} />
          {(Object.keys(screens) as ScreenId[]).map((id) => (
            <ScreenHotspot key={id} id={id} rect={screens[id]} />
          ))}
        </>
      )}
    </>
  );
}

useGLTF.preload('/retro_cyberpunk_computer_screens.glb');