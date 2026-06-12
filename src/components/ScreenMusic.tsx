'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { ScreenRect } from './ScreenHello';
import { useMusic, TRACK_TITLE } from './MusicContext';

const CANVAS_W = 512;

function formatTime(s: number) {
  if (!isFinite(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function drawMusic(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  playing: boolean,
  currentTime: number,
  duration: number
) {
  // Amber CRT glass with a vignette, to set it apart from the green screen.
  ctx.shadowBlur = 0;
  const bg = ctx.createRadialGradient(w / 2, h / 2, h / 4, w / 2, h / 2, w / 1.4);
  bg.addColorStop(0, '#241505');
  bg.addColorStop(1, '#0f0801');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const amber = '#ffb845';
  const amberDim = '#9a6a20';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff9d1f';

  // Header
  ctx.font = `bold ${Math.round(h * 0.075)}px "Courier New", monospace`;
  ctx.shadowBlur = 8;
  ctx.fillStyle = amberDim;
  ctx.fillText(playing ? '▶ NOW PLAYING' : '❚❚ PAUSED', w * 0.08, h * 0.16);

  // Track title
  ctx.font = `bold ${Math.round(h * 0.105)}px "Courier New", monospace`;
  ctx.shadowBlur = 14;
  ctx.fillStyle = amber;
  ctx.fillText(TRACK_TITLE, w * 0.08, h * 0.34);

  // Animated EQ bars (settle low when paused).
  const bars = 24;
  const eqTop = h * 0.46;
  const eqH = h * 0.2;
  const eqW = w * 0.84;
  const barW = eqW / bars;
  ctx.shadowBlur = 6;
  for (let i = 0; i < bars; i++) {
    const phase = t * 7 + i * 1.7;
    const level = playing
      ? 0.25 + 0.75 * Math.abs(Math.sin(phase) * Math.sin(phase * 0.31 + i))
      : 0.06;
    const bh = Math.max(2, level * eqH);
    ctx.fillStyle = i % 3 === 0 ? amber : amberDim;
    ctx.fillRect(w * 0.08 + i * barW, eqTop + (eqH - bh), barW * 0.6, bh);
  }

  // Progress bar + timestamps
  const barY = h * 0.78;
  const barX = w * 0.08;
  const barWidth = w * 0.84;
  const progress = duration > 0 ? currentTime / duration : 0;
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#3a2608';
  ctx.fillRect(barX, barY, barWidth, h * 0.03);
  ctx.shadowBlur = 10;
  ctx.fillStyle = amber;
  ctx.fillRect(barX, barY, barWidth * progress, h * 0.03);

  ctx.font = `bold ${Math.round(h * 0.07)}px "Courier New", monospace`;
  ctx.shadowBlur = 6;
  ctx.fillStyle = amberDim;
  ctx.fillText(formatTime(currentTime), barX, h * 0.9);
  const durText = formatTime(duration);
  const durW = ctx.measureText(durText).width;
  ctx.fillText(durText, barX + barWidth - durW, h * 0.9);

  // Scanlines
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }
}

export default function ScreenMusic({ rect }: { rect: ScreenRect }) {
  const { audioRef, playing, toggle } = useMusic();
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

  useFrame(({ clock }) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const audio = audioRef.current;
    drawMusic(
      ctx,
      canvas.width,
      canvas.height,
      clock.elapsedTime,
      playing,
      audio?.currentTime ?? 0,
      audio?.duration ?? NaN
    );
    texture.needsUpdate = true;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <mesh
      position={rect.center}
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <planeGeometry args={[rect.width, rect.height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
