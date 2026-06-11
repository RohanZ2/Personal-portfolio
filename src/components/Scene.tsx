'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ComputerScreens from './ComputerScreens';

// Eases the camera toward the pointer so the scene reads as 3D while the
// screens stay directly in front of the viewer.
function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0, 7));

  useFrame(({ camera, pointer }, delta) => {
    target.current.set(pointer.x * 0.6, pointer.y * 0.4, 7);
    camera.position.lerp(target.current, 1 - Math.exp(-4 * delta));
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050807']} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 3, 8]} intensity={1.6} />
        <pointLight position={[-4, 2, 3]} intensity={6} color="#00ff9d" />
        <pointLight position={[4, -2, 3]} intensity={6} color="#ff2975" />
        <Suspense fallback={null}>
          <ComputerScreens />
        </Suspense>
        <CameraRig />
      </Canvas>
    </div>
  );
}
