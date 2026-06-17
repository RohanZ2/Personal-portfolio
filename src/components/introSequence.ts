'use client';

import { useSyncExternalStore } from 'react';

// The whole monitor bank plays one synchronized CRT power-on on first load:
// every screen flashes on, says HELLO, then reveals its real content. This
// module is the shared clock + helper so all four screens animate in lockstep,
// whether they're canvas-texture screens or drei <Html> screens.

// Timeline, in seconds since the page's first frame. Mirrors (and extends)
// the original bottom-left HELLO screen so the look is identical everywhere.
export const INTRO = {
  LINE_START: 0.3, // CRT power-on line appears
  LINE_END: 0.9, // line has expanded to fill the screen
  FLASH_END: 1.2, // white power-on flash has decayed
  TYPE_START: 1.5, // "> HELLO" begins typing
  HELLO_HOLD: 2.7, // HELLO sits fully typed until here
  REVEAL_FLASH: 3.0, // a final white flash, then real content shows
  DONE: 3.3, // animation fully finished
} as const;

export const TYPE_SPEED = 0.11; // seconds per character
export const HELLO_MESSAGE = '> HELLO';

// A single shared mount-time origin so every screen measures the same `t`.
// Set lazily on the first read so it lines up with the first rendered frame.
let origin: number | null = null;
export function introElapsed(now: number): number {
  if (origin === null) origin = now;
  return now - origin;
}

// Lets non-frame code (e.g. effects) observe when the intro has finished, in
// case anything wants to gate on it. Screens themselves just read `t` per
// frame, but the boot-cover overlays use this to unmount cleanly.
const listeners = new Set<() => void>();
let done = false;
export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}
export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => done
  );
}
