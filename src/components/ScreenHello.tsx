'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BASE, NEON, NEON_CYCLE } from './screenTheme';

export type ScreenRect = {
  center: THREE.Vector3;
  width: number;
  height: number;
};

const CANVAS_W = 512;

// Animation timeline (seconds since mount)
const LINE_START = 0.3; // CRT power-on line appears
const LINE_END = 0.9; // line has expanded to full screen
const FLASH_END = 1.2; // white flash decayed, content visible
const TYPE_START = 1.5; // typing begins
const TYPE_SPEED = 0.11; // seconds per character

const MESSAGE = '> HELLO';

function drawScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  if (t < LINE_START) return;

  // Phase 1: a thin bright line wipes in horizontally, then expands to
  // fill the screen vertically — the classic CRT turn-on.
  if (t < LINE_END) {
    const k = (t - LINE_START) / (LINE_END - LINE_START);
    const lineW = Math.min(1, k * 3) * w;
    const lineH = Math.max(3, Math.pow(Math.max(0, (k - 0.25) / 0.75), 2.5) * h);
    ctx.shadowColor = NEON.pink;
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#f4f4f8';
    ctx.fillRect((w - lineW) / 2, (h - lineH) / 2, lineW, lineH);
    return;
  }

  // Phase 2: powered-on screen — dark grey CRT glass with a vignette.
  const bg = ctx.createRadialGradient(w / 2, h / 2, h / 4, w / 2, h / 2, w / 1.4);
  bg.addColorStop(0, BASE.panel);
  bg.addColorStop(1, BASE.black);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Typed message with a blinking block cursor. Each character is drawn in
  // the next neon so "> HELLO" comes up as a multicolor strip.
  if (t >= TYPE_START) {
    const chars = Math.min(
      MESSAGE.length,
      Math.floor((t - TYPE_START) / TYPE_SPEED)
    );
    const cursorOn = Math.floor(t * 2.5) % 2 === 0;
    const text = MESSAGE.slice(0, chars) + (cursorOn ? '█' : '');
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
  }

  // Scanlines over everything.
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }

  // Decaying full-screen flash right after power-on.
  if (t < FLASH_END) {
    const a = 1 - (t - LINE_END) / (FLASH_END - LINE_END);
    ctx.fillStyle = `rgba(244, 244, 248, ${a.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
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

  const start = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (start.current === null) start.current = clock.elapsedTime;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawScreen(ctx, canvas.width, canvas.height, clock.elapsedTime - start.current);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={rect.center}>
      <planeGeometry args={[rect.width, rect.height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
