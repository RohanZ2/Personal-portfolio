'use client';

import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ScreenRect } from './ScreenHello';
import { ScreenId, useScreenFocus } from './screenFocusStore';
import { BASE, NEON, NEON_CYCLE, glow } from './screenTheme';
import { useIntroDone } from './introSequence';
import { bio, projects, skills } from '../data/portfolio';

// CSS pixel width of the embedded UI; height follows the glass aspect.
const DIV_W = 720;
// drei <Html transform> renders 40 CSS px per world unit at scale 1
// (calibrated against the rendered scene). scale is chosen so the div
// exactly covers the monitor glass.
const PX_PER_UNIT = 40;

function AboutPage() {
  return (
    <div className="flex h-full flex-col gap-3 p-6">
      <div
        className="text-[11px] tracking-widest"
        style={{ color: NEON.pink, textShadow: glow(NEON.pink, 6) }}
      >
        ROHAN_OS v1.0 — /ABOUT
      </div>
      <h1
        className="text-3xl font-bold"
        style={{ color: NEON.yellow, textShadow: glow(NEON.yellow, 14) }}
      >
        ROHAN TEWARI
      </h1>
      <div className="text-sm" style={{ color: NEON.green }}>
        FULL STACK ENGINEER
      </div>
      {bio.map((line) => (
        <p
          key={line.slice(0, 16)}
          className="text-[13px] leading-snug"
          style={{ color: BASE.text }}
        >
          {line}
        </p>
      ))}
      <div className="mt-auto flex flex-col gap-1.5">
        {skills.map((s, i) => {
          // Each skill bar gets the next neon in the cycle, so the stack
          // reads as a stripe of pink/yellow/green/cyan/red.
          const accent = NEON_CYCLE[i % NEON_CYCLE.length];
          return (
            <div key={s.name} className="flex items-center gap-2 text-[11px]">
              <span className="w-28 shrink-0" style={{ color: NEON.cyan }}>
                {s.name}
              </span>
              <div
                className="h-2 flex-1 border"
                style={{ borderColor: BASE.line, background: '#00000066' }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${s.level}%`,
                    background: accent,
                    boxShadow: glow(accent, 8),
                  }}
                />
              </div>
              <span className="w-8 text-right" style={{ color: BASE.dim }}>
                {s.level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <div
        className="mb-3 text-[11px] tracking-widest"
        style={{ color: NEON.pink, textShadow: glow(NEON.pink, 6) }}
      >
        ROHAN_OS v1.0 — /PROJECTS
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {projects.map((p, pi) => {
          // Each card is keyed to one neon so its title, left edge, and tech
          // tags share a color — keeps the page from turning to mush.
          const accent = NEON_CYCLE[pi % NEON_CYCLE.length];
          return (
            <div
              key={p.title}
              className="border-l-2 border p-3"
              style={{
                borderColor: BASE.line,
                borderLeftColor: accent,
                background: '#00000055',
              }}
            >
              <div className="flex items-baseline justify-between">
                <h2
                  className="text-lg font-bold"
                  style={{ color: accent, textShadow: glow(accent, 8) }}
                >
                  {p.title}
                </h2>
                <span className="text-[10px]" style={{ color: BASE.dim }}>
                  {p.volume}
                </span>
              </div>
              <p
                className="mt-1 text-[12px] leading-snug"
                style={{ color: BASE.text }}
              >
                {p.description}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="border px-1.5 py-0.5 text-[10px]"
                    style={{ borderColor: BASE.line, color: accent }}
                  >
                    {t}
                  </span>
                ))}
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto text-[11px] font-bold"
                  style={{ color: NEON.pink, textShadow: glow(NEON.pink, 8) }}
                >
                  OPEN &gt;&gt;
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ScreenPortfolio({
  id,
  rect,
  page,
}: {
  id: ScreenId;
  rect: ScreenRect;
  page: 'about' | 'projects';
}) {
  const divH = Math.round(DIV_W * (rect.height / rect.width));
  const scale = (rect.width * PX_PER_UNIT) / DIV_W;

  // Until this screen is expanded, the HTML overlay must be click-through:
  // it sits on top of the canvas in the DOM, so if it swallowed pointer
  // events the camera rig and the expand hotspots would never see them
  // (this is what caused the look-around jitter near the top screens).
  const focused = useScreenFocus().focused?.id === id;

  // <Html transform> bakes its CSS matrix3d from the canvas's measured size on
  // the frame it mounts. On Vercel the bundle hydrates before layout settles,
  // so the first measurement can be a stale/zero-sized rect — which pins the
  // content off the glass (down-left) and never recovers. Keying the <Html>
  // on the live canvas size forces a clean remount once the size is known and
  // again on any resize, so the transform is always computed against a real
  // rect. (Locally this never triggered because everything loads instantly.)
  const { width: cw, height: ch } = useThree((s) => s.size);

  // Hide this DOM content until the boot intro finishes. The intro is drawn by
  // a WebGL boot-cover in front of the glass, but DOM <Html> always stacks on
  // top of the canvas — so if the content rendered during boot it would show
  // straight through the cover. Gating it here lets the cover play, then the
  // content fades in. (Skip the fade if the intro is already done, e.g. on a
  // hot reload, so it doesn't re-animate.)
  const introDone = useIntroDone();

  return (
    <group position={rect.center}>
      <Html
        key={`${Math.round(cw)}x${Math.round(ch)}`}
        transform
        scale={scale}
        zIndexRange={[40, 0]}
        pointerEvents={focused ? 'auto' : 'none'}
        style={{ width: DIV_W, height: divH }}
        className="select-none overflow-hidden font-mono"
      >
        <div
          className="relative h-full w-full"
          style={{
            background: `radial-gradient(ellipse at center, ${BASE.panel} 0%, ${BASE.black} 100%)`,
            opacity: introDone ? 1 : 0,
            transition: 'opacity 0.35s ease-in',
          }}
        >
          {page === 'about' ? <AboutPage /> : <ProjectsPage />}
          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        </div>
      </Html>
    </group>
  );
}
