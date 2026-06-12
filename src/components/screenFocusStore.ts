'use client';

import { useSyncExternalStore } from 'react';
import type { ScreenRect } from './ScreenHello';

export type ScreenId = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type FocusState = {
  /** Screen the camera is zoomed into, or null for the room view. */
  focused: { id: ScreenId; rect: ScreenRect } | null;
  /** Screen currently under the cursor (drives the grab cursor + EXPAND tag). */
  hovered: ScreenId | null;
};

// Plain external store instead of React context: the camera rig and the
// hotspots live inside <Canvas> while the EXPAND tag and close button live
// in the DOM, and context does not cross react-three-fiber's renderer
// boundary (see the note in MusicContext).
let state: FocusState = { focused: null, hovered: null };
const listeners = new Set<() => void>();

function setState(partial: Partial<FocusState>) {
  state = { ...state, ...partial };
  listeners.forEach((l) => l());
}

export function focusScreen(id: ScreenId, rect: ScreenRect) {
  setState({ focused: { id, rect }, hovered: null });
}

export function unfocusScreen() {
  if (state.focused) setState({ focused: null });
}

export function setHoveredScreen(id: ScreenId | null) {
  if (state.hovered !== id) setState({ hovered: id });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useScreenFocus(): FocusState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}
