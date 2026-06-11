'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import ComputerScreens from './ComputerScreens';
import Table from './Table';

// First-person look: the camera never moves, but the view turns with the
// mouse. Range is intentionally small — just enough to glance around, with
// extra room downward for the table that will sit below the screens later.
const MAX_YAW = 0.35; // ~20° left/right
const MAX_PITCH_UP = 0.18; // ~10° up
const MAX_PITCH_DOWN = 0.55; // ~32° down

function CameraRig() {
  const yaw = useRef(0);
  const pitch = useRef(0);

  useFrame(({ camera, pointer }, delta) => {
    const targetYaw = -pointer.x * MAX_YAW;
    const targetPitch =
      pointer.y >= 0 ? pointer.y * MAX_PITCH_UP : pointer.y * MAX_PITCH_DOWN;

    const t = 1 - Math.exp(-4 * delta);
    yaw.current += (targetYaw - yaw.current) * t;
    pitch.current += (targetPitch - pitch.current) * t;

    camera.position.set(0, 0, 7);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitch.current, yaw.current, 0);
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
          <Table />
        </Suspense>
        <CameraRig />
      </Canvas>
    </div>
  );
}
