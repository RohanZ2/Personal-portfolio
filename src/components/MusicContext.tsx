'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  MutableRefObject,
} from 'react';

export const TRACK_TITLE = 'Where The Wind Takes You';
const AUDIO_SRC = '/Where_The_wind_takes_you.mp3';

type MusicState = {
  /** The shared audio element; read currentTime/duration off it per frame. */
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  /** Whether playback is intended (the vinyl is spinning). */
  playing: boolean;
  toggle: () => void;
};

const MusicContext = createContext<MusicState | null>(null);
 
// NOTE: this provider must sit INSIDE <Canvas> — React context does not
// cross react-three-fiber's renderer boundary, and all consumers live in
// the 3D tree.
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Start paused: nothing plays until the user clicks the vinyl/music screen.
  // This also sidesteps the browser autoplay block, which would otherwise
  // leave the disc spinning silently on first load.
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      // Browsers block autoplay before the first user gesture; in that
      // case the disc spins silently and audio starts on the next toggle.
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  return (
    <MusicContext.Provider value={{ audioRef, playing, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicState {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside <MusicProvider>');
  return ctx;
}
