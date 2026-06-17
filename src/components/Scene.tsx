'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import ComputerScreens from './ComputerScreens';
import Table from './Table';
import VinylPlayer from './VinylPlayer';
import IbmKeyboard from './IbmKeyboard';
import CasioKeyboard from './CasioKeyboard';
import { MusicProvider } from './MusicContext';
import MusicPlaylist from './MusicPlaylist';
import { unfocusScreen, useScreenFocus } from './screenFocusStore';
import { NEON, glow } from './screenTheme';

// All models are Draco-compressed; serve the decoder from our own /public
// instead of drei's default gstatic CDN (one less third-party round-trip,
// and it works offline). Set once before any useGLTF runs.
useGLTF.setDecoderPath('/draco/');

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
  // regress() flags the scene as "moving" so AdaptiveDpr temporarily drops the
  // render resolution. We call it only while the camera is actually in motion
  // (mouse-look or a focus dolly), which is exactly when low-end GPUs choke —
  // the lower resolution keeps the movement smooth and snaps back to full
  // sharpness the instant the view settles.
  const regress = useThree((s) => s.performance.regress);

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
    const prevYaw = yaw.current;
    const prevPitch = pitch.current;
    yaw.current += (targetYaw - yaw.current) * t;
    pitch.current += (targetPitch - pitch.current) * t;

    camera.position.lerp(targetPos.current, t);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitch.current, yaw.current, 0);

    // Regress (drop resolution) only while the view is perceptibly moving —
    // measured by how far the camera actually rotated/dollied this frame. The
    // threshold is deliberately a little coarse so the imperceptible tail of
    // the ease counts as "settled", letting full DPR snap back promptly once
    // you stop instead of lingering blurry.
    const moved =
      Math.abs(yaw.current - prevYaw) > 6e-4 ||
      Math.abs(pitch.current - prevPitch) > 6e-4 ||
      camera.position.distanceToSquared(targetPos.current) > 1e-3;
    if (moved) regress();
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
      className="pointer-events-none fixed left-0 top-0 z-50 border bg-black/80 px-2 py-0.5 font-mono text-[11px] tracking-[0.25em]"
      style={{
        display: hovered && !focused ? 'block' : 'none',
        color: NEON.pink,
        borderColor: NEON.pink,
        textShadow: glow(NEON.pink, 8),
      }}
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
      className="fixed right-6 top-6 z-50 border bg-black/80 px-3 py-1.5 font-mono text-xs tracking-[0.25em] transition-colors hover:bg-white/10"
      style={{
        color: NEON.pink,
        borderColor: NEON.pink,
        textShadow: glow(NEON.pink, 8),
      }}
    >
      ✕ CLOSE [ESC]
    </button>
  );
}

export default function Scene() {
  // Upper bound for the device pixel ratio. PerformanceMonitor lowers this on
  // machines that can't sustain a good frame rate, so weak GPUs render fewer
  // pixels (smoother) while capable ones stay sharp. AdaptiveDpr then applies
  // this ceiling — and the per-frame movement regression — to the live DPR.
  const [dprMax, setDprMax] = useState(2);

  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, dprMax]}
        gl={{
          // MSAA (antialias) is one of the heaviest per-frame costs on weak /
          // integrated GPUs and the main source of the low-end lag. Turn it
          // off; AdaptiveDpr keeps capable machines sharp via resolution
          // instead. powerPreference asks for the discrete GPU when present.
          antialias: false,
          powerPreference: 'high-performance',
        }}
        // Measure the canvas size synchronously instead of after the default
        // debounce. Combined with keying the <Html> screens on this size, it
        // stops the prod-only race where the HTML monitor content projected
        // against a not-yet-settled canvas rect and floated off the glass.
        resize={{ scroll: false, debounce: 0 }}
        onPointerMissed={unfocusScreen}
      >
        <color attach="background" args={['#050807']} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 3, 8]} intensity={1.6} />
        <pointLight position={[-4, 2, 3]} intensity={6} color="#00ff9d" />
        <pointLight position={[4, -2, 3]} intensity={6} color="#ff2975" />
        {/* Watch the frame rate: if it sags on weaker hardware, step the DPR
            ceiling down (smoother); raise it again when there's headroom. */}
        <PerformanceMonitor
          onDecline={() => setDprMax((d) => Math.max(1, d - 0.5))}
          onIncline={() => setDprMax((d) => Math.min(2, d + 0.5))}
        />
        {/* Applies the DPR ceiling above, and drops resolution further during
            camera movement (CameraRig calls regress()), then restores it when
            the view settles. This is what makes the look-around feel smooth. */}
        <AdaptiveDpr pixelated={false} />
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
      <MusicPlaylist />
    </div>
  );
}
