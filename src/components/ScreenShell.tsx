'use client';

import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ScreenRect } from './screenRect';
import { ScreenId, useScreenFocus } from './screenFocusStore';
import { BASE } from './screenTheme';
import { useIntroDone } from './introSequence';

// CSS pixel width of the embedded UI; height follows the glass aspect.
const DIV_W = 720;
// drei <Html transform> renders 40 CSS px per world unit at scale 1
// (calibrated against the rendered scene). scale is chosen so the div
// exactly covers the monitor glass.
const PX_PER_UNIT = 40;

// Shared <Html> wrapper for every DOM-based screen (About / Projects / Contact
// / Music). Centralizes the bits that are identical across all of them: the
// transform/scale onto the glass, the click-through gating, the canvas-size
// remount fix, the intro fade-in, and the scanline overlay. Each screen just
// supplies its own content.
export default function ScreenShell({
  id,
  rect,
  children,
}: {
  id: ScreenId;
  rect: ScreenRect;
  children: React.ReactNode;
}) {
  const divH = Math.round(DIV_W * (rect.height / rect.width));
  const scale = (rect.width * PX_PER_UNIT) / DIV_W;

  // Until this screen is expanded, the HTML overlay must be click-through: it
  // sits on top of the canvas in the DOM, so if it swallowed pointer events the
  // camera rig and the expand hotspots would never see them (this is what
  // caused the look-around jitter near the top screens).
  const focused = useScreenFocus().focused?.id === id;

  // <Html transform> bakes its CSS matrix3d from the canvas's measured size on
  // the frame it mounts. On Vercel the bundle hydrates before layout settles,
  // so the first measurement can be a stale/zero-sized rect — which pins the
  // content off the glass and never recovers. Keying the <Html> on the live
  // canvas size forces a clean remount once the size is known, and again on any
  // resize, so the transform is always computed against a real rect.
  const { width: cw, height: ch } = useThree((s) => s.size);

  // Hide the DOM content until the boot intro finishes. The intro is drawn by a
  // WebGL boot-cover in front of the glass, but DOM <Html> always stacks on top
  // of the canvas — so if the content rendered during boot it would show
  // straight through the cover. Gating it here lets the cover play, then the
  // content fades in.
  const introDone = useIntroDone();

  return (
    <group position={rect.center}>
      <Html
        key={`${Math.round(cw)}x${Math.round(ch)}`}
        transform
        scale={scale}
        zIndexRange={[40, 0]}
        // Write the panel into the depth buffer so real meshes in front of the
        // glass (the keyboards / vinyl on the desk) correctly hide the parts of
        // the screen behind them. Without this, <Html> always paints on top of
        // the canvas regardless of depth, which made the lower screens look
        // like they protruded out over the keyboards.
        occlude="blending"
        pointerEvents={focused ? 'auto' : 'none'}
        style={{ width: DIV_W, height: divH }}
        className="select-none overflow-hidden font-mono"
      >
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at center, ${BASE.panel} 0%, ${BASE.black} 100%)`,
            opacity: introDone ? 1 : 0,
            transition: 'opacity 0.35s ease-in',
          }}
        >
          {children}
          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        </div>
      </Html>
    </group>
  );
}
