'use client';

import { useEffect, useRef, useSyncExternalStore, ReactNode } from 'react';
import { tracks, Track } from '../data/tracks';

// Music state lives in a plain external store, not React context, so it can be
// read from BOTH the 3D tree (ScreenMusic, VinylPlayer — inside <Canvas>) and
// the DOM playlist overlay (outside <Canvas>). React context does not cross
// react-three-fiber's renderer boundary, which is why the focus state uses the
// same pattern (see screenFocusStore).

type MusicSnapshot = {
  /** Whether playback is intended (the vinyl is spinning). */
  playing: boolean;
  /** Index of the current track in `tracks`. */
  index: number;
  /** Current track metadata. */
  track: Track;
  /** Live playback position / length (seconds). */
  currentTime: number;
  duration: number;
};

let audio: HTMLAudioElement | null = null;
let snapshot: MusicSnapshot = {
  playing: false, // start paused — see note in createAudio()
  index: 0,
  track: tracks[0],
  currentTime: 0,
  duration: NaN,
};

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function set(partial: Partial<MusicSnapshot>) {
  snapshot = { ...snapshot, ...partial };
  emit();
}

// --- actions -------------------------------------------------------------

export function toggle() {
  set({ playing: !snapshot.playing });
  syncPlayback();
}

/** Jump to a track by index (wraps) and start playing it. */
export function select(i: number) {
  const clamped = ((i % tracks.length) + tracks.length) % tracks.length;
  set({ index: clamped, track: tracks[clamped], currentTime: 0, duration: NaN, playing: true });
  if (audio) {
    audio.src = tracks[clamped].src;
    audio.play().catch(() => {});
  }
}

export function next() {
  select(snapshot.index + 1);
}
export function prev() {
  select(snapshot.index - 1);
}

export function seek(seconds: number) {
  if (!audio || !isFinite(seconds)) return;
  audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || seconds));
  set({ currentTime: audio.currentTime });
}

// Push the `playing` flag to the actual audio element.
function syncPlayback() {
  if (!audio) return;
  if (snapshot.playing) {
    // Browsers block autoplay before the first user gesture; until then the
    // disc spins silently and audio starts on the next toggle.
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

// --- audio element lifecycle --------------------------------------------

// Created once by MusicProvider on mount. Kept module-level so the store's
// actions can reach it without prop-drilling.
function createAudio(): () => void {
  // Queue a random track on load. Done here (client-only, on mount) rather than
  // in the module-level snapshot so it can't cause an SSR/hydration mismatch.
  const startIndex = Math.floor(Math.random() * tracks.length);
  if (startIndex !== snapshot.index) {
    set({ index: startIndex, track: tracks[startIndex], currentTime: 0, duration: NaN });
  }

  const a = new Audio(tracks[startIndex].src);
  audio = a;

  const onTime = () => set({ currentTime: a.currentTime });
  const onMeta = () => set({ duration: a.duration });
  const onEnded = () => next();
  a.addEventListener('timeupdate', onTime);
  a.addEventListener('loadedmetadata', onMeta);
  a.addEventListener('durationchange', onMeta);
  a.addEventListener('ended', onEnded);

  return () => {
    a.removeEventListener('timeupdate', onTime);
    a.removeEventListener('loadedmetadata', onMeta);
    a.removeEventListener('durationchange', onMeta);
    a.removeEventListener('ended', onEnded);
    a.pause();
    audio = null;
  };
}

// --- React glue ----------------------------------------------------------

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export type MusicState = MusicSnapshot & {
  /** The shared audio element ref (3D consumers read currentTime per frame). */
  audioRef: { current: HTMLAudioElement | null };
  toggle: typeof toggle;
  select: typeof select;
  next: typeof next;
  prev: typeof prev;
  seek: typeof seek;
};

// A stable ref-like object so existing 3D consumers that read `audioRef.current`
// per frame keep working unchanged.
const audioRefProxy = {
  get current() {
    return audio;
  },
  set current(_v: HTMLAudioElement | null) {
    /* managed by the store */
  },
};

export function useMusic(): MusicState {
  const snap = useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
  return { ...snap, audioRef: audioRefProxy, toggle, select, next, prev, seek };
}

// Owns the audio element's lifetime. Render it once high in the tree; it has no
// visual output. (Kept as a component so the element is created/destroyed with
// the React lifecycle and survives Fast Refresh cleanly.)
export function MusicProvider({ children }: { children: ReactNode }) {
  const started = useRef(false);
  useEffect(() => {
    // Guard against StrictMode's double-invoke creating two <audio> elements.
    if (started.current) return;
    started.current = true;
    const cleanup = createAudio();
    return () => {
      started.current = false;
      cleanup();
    };
  }, []);

  return <>{children}</>;
}
