'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScreenRect } from './screenRect';
import { drawIntro } from './drawIntro';
import { introElapsed, markIntroDone } from './introSequence';

const CANVAS_W = 512;

// A canvas-texture plane floated just in front of a monitor's glass that plays
// the CRT power-on intro, then removes itself to reveal the real content
// underneath. Used by the two <Html> portfolio screens, which can't draw the
// canvas-based boot sequence themselves. Renders slightly in front of the
// glass and on top of the HTML overlay's z-range while active.
export default function ScreenBootCover({ rect }: { rect: ScreenRect }) {
  const [active, setActive] = useState(true);
  const canvasH = Math.round((CANVAS_W * rect.height) / rect.width);

  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = CANVAS_W;
    c.height = canvasH;
    return c;
  }, [canvasH]);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [canvas]);

  useEffect(() => () => texture.dispose(), [texture]);

  const lastDraw = useRef(0);

  useFrame(({ clock }) => {
    if (!active) return;
    // ~20fps redraw — plenty for the boot sequence, far less GPU than 60.
    if (clock.elapsedTime - lastDraw.current < 1 / 20) return;
    lastDraw.current = clock.elapsedTime;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const stillBooting = drawIntro(
      ctx,
      canvas.width,
      canvas.height,
      introElapsed(clock.elapsedTime)
    );
    texture.needsUpdate = true;
    if (!stillBooting) {
      markIntroDone(); // reveal the HTML content underneath
      setActive(false);
    }
  });

  if (!active) return null;

  return (
    <mesh position={[rect.center.x, rect.center.y, rect.center.z + 0.03]} renderOrder={10}>
      <planeGeometry args={[rect.width, rect.height]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthTest={false} />
    </mesh>
  );
}
