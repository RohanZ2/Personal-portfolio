'use client';

import { useRef } from 'react';
import { ScreenRect } from './screenRect';
import { ScreenId, useScreenFocus } from './screenFocusStore';
import { BASE, NEON, NEON_CYCLE, glow } from './screenTheme';
import { useMusic } from './MusicContext';
import ScreenShell from './ScreenShell';
import { ScreenHeader, Panel } from './screenUI';

function formatTime(s: number) {
  if (!isFinite(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// A purely-decorative CSS equalizer: 24 neon bars that bounce while playing and
// settle flat when paused. Driven by CSS keyframes (defined in globals.css) so
// it animates without a per-frame React render.
function Equalizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex h-16 items-end gap-[3px]">
      {Array.from({ length: 24 }).map((_, i) => {
        const color = NEON_CYCLE[i % NEON_CYCLE.length];
        return (
          <div
            key={i}
            className="flex-1"
            style={{
              height: playing ? undefined : '8%',
              background: color,
              boxShadow: glow(color, 6),
              animation: playing ? `eq 0.9s ease-in-out ${(i % 6) * 0.12}s infinite alternate` : 'none',
              // Stagger the heights so the bank reads as a spectrum even mid-animation.
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
}

function MusicPage({ id }: { id: ScreenId }) {
  const { playing, toggle, next, prev, seek, track, currentTime, duration } = useMusic();
  const focused = useScreenFocus().focused?.id === id;
  const barRef = useRef<HTMLDivElement>(null);

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = barRef.current;
    if (!el || !isFinite(duration)) return;
    const r = el.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * duration);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const statusColor = playing ? NEON.pink : NEON.red;

  return (
    <div className="flex h-full flex-col p-6">
      <ScreenHeader
        eyebrow="GEAR 5 · ON THE DECKS"
        title="Now Playing"
        subLeft={playing ? '▶ PLAYING' : '❚❚ PAUSED'}
      />

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-2">
        {/* Current track card */}
        <Panel label="// TRACK" accent={statusColor}>
          <div
            className="text-2xl font-bold leading-tight"
            style={{ color: NEON.yellow, textShadow: glow(NEON.yellow, 12) }}
          >
            {track.title}
          </div>
          <div className="text-[12px] italic" style={{ color: BASE.dim }}>
            {track.genre}
          </div>
          <Equalizer playing={playing} />
        </Panel>

        {/* Transport + seek card */}
        <Panel label="// TRANSPORT" accent={NEON.green}>
          <div
            ref={barRef}
            onClick={focused ? onSeek : undefined}
            className={`h-2 ${focused ? 'cursor-pointer' : ''}`}
            style={{ background: BASE.line }}
          >
            <div
              className="h-full"
              style={{ width: `${progress}%`, background: NEON.green, boxShadow: glow(NEON.green, 8) }}
            />
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: BASE.dim }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-3">
            <TransportButton label="◄◄" onClick={prev} accent={NEON.cyan} />
            <TransportButton label={playing ? '❚❚' : '►'} onClick={toggle} accent={NEON.pink} big />
            <TransportButton label="►►" onClick={next} accent={NEON.cyan} />
          </div>
        </Panel>
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

export default function ScreenMusic({ id, rect }: { id: ScreenId; rect: ScreenRect }) {
  return (
    <ScreenShell id={id} rect={rect}>
      <MusicPage id={id} />
    </ScreenShell>
  );
}
