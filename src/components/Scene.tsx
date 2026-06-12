'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ComputerScreens from './ComputerScreens';
import Table from './Table';
import VinylPlayer from './VinylPlayer';
import IbmKeyboard from './IbmKeyboard';
import CasioKeyboard from './CasioKeyboard';
import { MusicProvider } from './MusicContext';
import { unfocusScreen, useScreenFocus } from './screenFocusStore';

// First-person look: the camera never moves, but the view turns with the
// mouse. Range is intentionally small — just enough to glance around, with
// extra room downward for the table that will sit below the screens later.
const MAX_YAW = 0.35; // ~20° left/right
const MAX_PITCH_UP = 0.18; // ~10° up
const MAX_PITCH_DOWN = 0.55; // ~32° down

const HOME_POS = new THREE.Vector3(0, 0, 7);

// How much breathing room to leave around an expanded screen (1 = glass
// exactly fills the viewport).
const FOCUS_MARGIN = 1.12;

function CameraRig() {
  const yaw = useRef(0);
  const pitch = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const targetPos = useRef(HOME_POS.clone());
  const { focused } = useScreenFocus();

  // Track the mouse on window, not via r3f's canvas pointer: the portfolio
  // screens are DOM overlays, and when the cursor crossed them the canvas
  // stopped getting pointermove events. The camera then eased back, slid the
  // overlay out from under the cursor, got the pointer again, and oscillated
  // — the back-and-forth jitter when looking up. Window events never drop out.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    let targetYaw = 0;
    let targetPitch = 0;

    if (focused) {
      // Dolly straight in front of the screen, far enough back that the
      // glass fills the viewport on its tighter axis.
      const cam = camera as THREE.PerspectiveCamera;
      const { center, width, height } = focused.rect;
      const vFov = THREE.MathUtils.degToRad(cam.fov);
      const distV = (height / 2) / Math.tan(vFov / 2);
      const distH = (width / 2) / (Math.tan(vFov / 2) * cam.aspect);
      const dist = Math.max(distV, distH) * FOCUS_MARGIN;
      targetPos.current.set(center.x, center.y, center.z + dist);
    } else {
      targetPos.current.copy(HOME_POS);
      targetYaw = -mouse.current.x * MAX_YAW;
      targetPitch =
        mouse.current.y >= 0
          ? mouse.current.y * MAX_PITCH_UP
          : mouse.current.y * MAX_PITCH_DOWN;
    }

    const t = 1 - Math.exp(-4 * delta);
    yaw.current += (targetYaw - yaw.current) * t;
    pitch.current += (targetPitch - pitch.current) * t;

    camera.position.lerp(targetPos.current, t);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitch.current, yaw.current, 0);
  });

  return null;
}

// "EXPAND" tag that rides beside the cursor while a screen is hovered.
// Position is written straight to the DOM from the pointermove handler so
// it tracks the mouse without a React render per frame.
function ExpandHint() {
  const { hovered, focused } = useScreenFocus();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 12}px)`;
      }
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-50 border border-emerald-500/70 bg-black/80 px-2 py-0.5 font-mono text-[11px] tracking-[0.25em] text-emerald-300 [text-shadow:0_0_8px_rgba(52,255,160,0.8)]"
      style={{ display: hovered && !focused ? 'block' : 'none' }}
    >
      EXPAND ⤢
    </div>
  );
}

function FocusOverlay() {
  const { focused } = useScreenFocus();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') unfocusScreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!focused) return null;
  return (
    <button
      onClick={unfocusScreen}
      className="fixed right-6 top-6 z-50 border border-emerald-500/70 bg-black/80 px-3 py-1.5 font-mono text-xs tracking-[0.25em] text-emerald-300 transition-colors hover:bg-emerald-950 [text-shadow:0_0_8px_rgba(52,255,160,0.8)]"
    >
      ✕ CLOSE [ESC]
    </button>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true }}
        onPointerMissed={unfocusScreen}
      >
        <color attach="background" args={['#050807']} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 3, 8]} intensity={1.6} />
        <pointLight position={[-4, 2, 3]} intensity={6} color="#00ff9d" />
        <pointLight position={[4, -2, 3]} intensity={6} color="#ff2975" />
        <MusicProvider>
          <Suspense fallback={null}>
            <ComputerScreens />
            <Table />
            <VinylPlayer />
            <IbmKeyboard />
            <CasioKeyboard />
          </Suspense>
        </MusicProvider>
        <CameraRig />
      </Canvas>
      <ExpandHint />
      <FocusOverlay />
    </div>
  );
}
