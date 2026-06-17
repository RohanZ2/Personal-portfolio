import { BASE, NEON, NEON_CYCLE } from './screenTheme';
import { INTRO, TYPE_SPEED, HELLO_MESSAGE } from './introSequence';

// Draws the shared CRT power-on sequence onto a 2D canvas for a given time
// `t` (seconds since the intro started). Returns true while the intro is
// still covering the screen, false once it's done (so the caller can hand off
// to its real content). Extracted from the original HELLO screen so every
// monitor — canvas or HTML-overlay — boots up identically and in sync.
export function drawIntro(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
): boolean {
  // Black until power-on.
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  if (t < INTRO.LINE_START) return true;

  // Phase 1: a thin bright line wipes in horizontally, then expands to fill
  // the screen vertically — the classic CRT turn-on.
  if (t < INTRO.LINE_END) {
    const k = (t - INTRO.LINE_START) / (INTRO.LINE_END - INTRO.LINE_START);
    const lineW = Math.min(1, k * 3) * w;
    const lineH = Math.max(3, Math.pow(Math.max(0, (k - 0.25) / 0.75), 2.5) * h);
    ctx.shadowColor = NEON.pink;
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#f4f4f8';
    ctx.fillRect((w - lineW) / 2, (h - lineH) / 2, lineW, lineH);
    return true;
  }

  // Phase 2: powered-on dark CRT glass with a vignette.
  const bg = ctx.createRadialGradient(w / 2, h / 2, h / 4, w / 2, h / 2, w / 1.4);
  bg.addColorStop(0, BASE.panel);
  bg.addColorStop(1, BASE.black);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Typed "> HELLO", each glyph in the next neon — a multicolor strip.
  if (t >= INTRO.TYPE_START) {
    const chars = Math.min(
      HELLO_MESSAGE.length,
      Math.floor((t - INTRO.TYPE_START) / TYPE_SPEED)
    );
    const cursorOn = Math.floor(t * 2.5) % 2 === 0;
    const text = HELLO_MESSAGE.slice(0, chars) + (cursorOn ? '█' : '');
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

  // Power-on flash, decaying right after the line fills the screen.
  if (t < INTRO.FLASH_END) {
    const a = 1 - (t - INTRO.LINE_END) / (INTRO.FLASH_END - INTRO.LINE_END);
    ctx.fillStyle = `rgba(244, 244, 248, ${a.toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }

  // Reveal flash: one more white pop as HELLO hands off to real content. This
  // is the CRT-style transition that ties the bank together at the end.
  if (t >= INTRO.HELLO_HOLD && t < INTRO.REVEAL_FLASH) {
    const a = 1 - (t - INTRO.HELLO_HOLD) / (INTRO.REVEAL_FLASH - INTRO.HELLO_HOLD);
    ctx.fillStyle = `rgba(244, 244, 248, ${(a * 0.95).toFixed(3)})`;
    ctx.fillRect(0, 0, w, h);
  }

  // Done once the reveal flash has finished — caller shows real content now.
  return t < INTRO.REVEAL_FLASH;
}
