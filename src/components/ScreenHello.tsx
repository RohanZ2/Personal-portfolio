'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE, NEON_CYCLE } from './screenTheme';
import { drawIntro } from './drawIntro';
import { introElapsed } from './introSequence';

export type ScreenRect = {
  center: THREE.Vector3;
  width: number;
  height: number;
};

const CANVAS_W = 512;

const MESSAGE = '> HELLO';

// The steady "> HELLO" state shown after the boot intro finishes. The intro
// itself (power-on line, flash, typing) is the shared drawIntro sequence, so
// this screen ends on exactly the frame the others reveal their content — and
// then just holds HELLO, since HELLO *is* this screen's content.
function drawHelloSteady(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  const bg = ctx.createRadialGradient(w / 2, h / 2, h / 4, w / 2, h / 2, w / 1.4);
  bg.addColorStop(0, BASE.panel);
  bg.addColorStop(1, BASE.black);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const cursorOn = Math.floor(t * 2.5) % 2 === 0;
  const text = MESSAGE + (cursorOn ? '█' : '');
  ctx.font = `bold ${Math.round(h * 0.22)}px "Courier New", monospace`;
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 18;
  let x = w * 0.08;
  for (let i = 0; i < text.length; i++) {
    const color = NEON_CYCLE[i % NEON_CYCLE.length];
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillText(text[i], x, h * 0.52);
    x += ctx.measureText(text[i]).width;
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }
}

export default function ScreenHello({ rect }: { rect: ScreenRect }) {
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

  // Redraw the CRT canvas at ~15fps, not every render frame. The content is a
  // blinking cursor and a slow type-on — indistinguishable at 15fps — but
  // re-uploading a 512px texture 60x/sec is real GPU work we don't need.
  // Plays the shared boot intro first (in sync with every other screen), then
  // settles into the steady HELLO state.
  useFrame(({ clock }) => {
    if (clock.elapsedTime - lastDraw.current < 1 / 15) return;
    lastDraw.current = clock.elapsedTime;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const t = introElapsed(clock.elapsedTime);
    const booting = drawIntro(ctx, canvas.width, canvas.height, t);
    if (!booting) drawHelloSteady(ctx, canvas.width, canvas.height, t);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={rect.center}>
      <planeGeometry args={[rect.width, rect.height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
