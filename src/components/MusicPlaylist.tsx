'use client';

import { useRef } from 'react';
import { tracks } from '../data/tracks';
import { useMusic, select, next, prev, toggle, seek } from './MusicContext';
import { useScreenFocus } from './screenFocusStore';
import { BASE, NEON, NEON_CYCLE, glow } from './screenTheme';

const MUSIC_SCREEN: 'bottomRight' = 'bottomRight';

function formatTime(s: number) {
  if (!isFinite(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// Per-track status tag colour.
function statusColor(status: string) {
  switch (status) {
    case 'DEPLOYED':
      return NEON.green;
    case 'DEMO':
      return NEON.pink;
    case 'TODO':
      return NEON.cyan;
    default:
      return NEON.red; // ARCHIVED
  }
}

// DOM overlay playlist that sits to the right of the music screen while it's
// expanded. Lives outside <Canvas>, reading the shared music store, so its
// rows/buttons/seek-bar are fully interactive HTML. Hidden in the room view.
export default function MusicPlaylist() {
  const { focused } = useScreenFocus();
  const { index, currentTime, duration, playing } = useMusic();
  const barRef = useRef<HTMLDivElement>(null);

  const open = focused?.id === MUSIC_SCREEN;

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = barRef.current;
    if (!el || !isFinite(duration)) return;
    const rect = el.getBoundingClientRect();
    const frac = (e.clientX - rect.left) / rect.width;
    seek(frac * duration);
  };

  return (
    <div
      className="fixed right-6 top-1/2 z-40 w-[340px] -translate-y-1/2 select-none font-mono"
      style={{
        // Slide/fade in only when the music screen is focused; ignore pointer
        // events otherwise so it never blocks the room view.
        opacity: open ? 1 : 0,
        transform: `translateY(-50%) translateX(${open ? '0' : '24px'})`,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <div
        className="flex max-h-[82vh] flex-col border"
        style={{
          borderColor: BASE.line,
          background: `linear-gradient(${BASE.panel}, ${BASE.black})`,
          boxShadow: '0 0 24px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="border-b p-4" style={{ borderColor: BASE.line }}>
          <div
            className="text-[10px] tracking-[0.3em]"
            style={{ color: NEON.cyan }}
          >
            QUEUE OVERVIEW
          </div>
          <div
            className="text-2xl font-bold tracking-wide"
            style={{ color: BASE.text, textShadow: glow(NEON.pink, 6) }}
          >
            PLAYLIST
          </div>
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-y-auto">
          {tracks.map((tk, i) => {
            const accent = NEON_CYCLE[i % NEON_CYCLE.length];
            const active = i === index;
            return (
              <button
                key={tk.src}
                onClick={() => select(i)}
                className="flex w-full flex-col gap-1 border-b border-l-2 p-3 text-left transition-colors hover:bg-white/5"
                style={{
                  borderBottomColor: BASE.line,
                  borderLeftColor: active ? accent : 'transparent',
                  background: active ? '#ffffff08' : 'transparent',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] tracking-widest"
                    style={{ color: BASE.dim }}
                  >
                    TRK-{String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="border px-1.5 text-[9px] tracking-wider"
                    style={{
                      color: statusColor(tk.status),
                      borderColor: statusColor(tk.status),
                    }}
                  >
                    {tk.status}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className="truncate text-sm font-bold"
                    style={{
                      color: active ? accent : BASE.text,
                      textShadow: active ? glow(accent, 8) : 'none',
                    }}
                  >
                    {tk.title}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] italic" style={{ color: BASE.dim }}>
                    {tk.genre}
                  </span>
                  {active && (
                    <span className="text-[11px] font-bold" style={{ color: BASE.text }}>
                      {formatTime(duration)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Transport controls + seek */}
        <div className="border-t p-4" style={{ borderColor: BASE.line }}>
          {/* Seek bar */}
          <div
            ref={barRef}
            onClick={onSeek}
            className="mb-2 h-2 cursor-pointer"
            style={{ background: BASE.line }}
          >
            <div
              className="h-full"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                background: NEON.green,
                boxShadow: glow(NEON.green, 8),
              }}
            />
          </div>
          <div className="mb-3 flex justify-between text-[10px]" style={{ color: BASE.dim }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Prev / Play-Pause / Next */}
          <div className="flex items-center justify-center gap-3">
            <TransportButton label="◄◄" onClick={prev} accent={NEON.cyan} />
            <TransportButton
              label={playing ? '❚❚' : '►'}
              onClick={toggle}
              accent={NEON.pink}
              big
            />
            <TransportButton label="►►" onClick={next} accent={NEON.cyan} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TransportButton({
  label,
  onClick,
  accent,
  big,
}: {
  label: string;
  onClick: () => void;
  accent: string;
  big?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`border font-bold transition-colors hover:bg-white/10 ${
        big ? 'h-11 w-14 text-lg' : 'h-9 w-12 text-sm'
      }`}
      style={{ color: accent, borderColor: accent, textShadow: glow(accent, 6) }}
    >
      {label}
    </button>
  );
}
