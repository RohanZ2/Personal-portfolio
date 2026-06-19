// Shared look for all four monitor screens. Everything visual that isn't
// layout lives here, so the whole bank re-tints from one file. The vibe:
// a vintage black/grey CRT with loud neon accents (pink/yellow/red/green/
// cyan), à la a glitchy album cover.

// Dark base — the "glass" and structural greys.
export const BASE = {
  black: '#070708', // deepest background / vignette edge
  panel: '#161619', // raised panels, screen center
  line: '#33333a', // borders, bar tracks, dividers
  dim: '#8d8d96', // de-emphasized text (timestamps, captions)
  text: '#dadae2', // body copy
};

// Neon accents. Reorder or recolor these and every screen follows.
export const NEON = {
  pink: '#ff27c7',
  yellow: '#f3ff2e',
  red: '#ff2b46',
  green: '#33ff84',
  cyan: '#29e6ff',
};

// The order things cycle through when many items each get their own accent
// (skill bars, tech tags, EQ bars, the HELLO letters).
export const NEON_CYCLE = [
  NEON.pink,
  NEON.yellow,
  NEON.green,
  NEON.cyan,
  NEON.red,
];


// CSS text-shadow string for an HTML neon glow (used in inline styles).
export const glow = (color: string, size = 10) => `0 0 ${size}px ${color}`;

// One shuffled copy of NEON_CYCLE, fixed for the lifetime of the page load.
// Cards/panels read their accent from this in order (index % length), so the
// palette is randomized fresh on every refresh but stays balanced — adjacent
// cards rarely repeat — and stable while you navigate around within a session.
// Computed lazily on first read so it only runs in the browser.
let shuffled: string[] | null = null;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The neon accent for the card at position `i` (wraps the shuffled cycle). */
export function accentFor(i: number): string {
  if (!shuffled) shuffled = shuffle(NEON_CYCLE);
  return shuffled[i % shuffled.length];
}
