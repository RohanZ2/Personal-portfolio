'use client';

import { Html } from '@react-three/drei';
import { ScreenRect } from './ScreenHello';
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
      <div className="text-[11px] tracking-widest text-emerald-600">
        ROHAN_OS v1.0 — /ABOUT
      </div>
      <h1 className="text-3xl font-bold text-emerald-300 [text-shadow:0_0_12px_rgba(52,255,160,0.6)]">
        ROHAN TEWARI
      </h1>
      <div className="text-sm text-emerald-500">FULL STACK ENGINEER</div>
      {bio.map((line) => (
        <p key={line.slice(0, 16)} className="text-[13px] leading-snug text-emerald-200/80">
          {line}
        </p>
      ))}
      <div className="mt-auto flex flex-col gap-1.5">
        {skills.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-[11px]">
            <span className="w-28 shrink-0 text-emerald-400">{s.name}</span>
            <div className="h-2 flex-1 border border-emerald-800 bg-black/40">
              <div
                className="h-full bg-emerald-400 [box-shadow:0_0_8px_rgba(52,255,160,0.8)]"
                style={{ width: `${s.level}%` }}
              />
            </div>
            <span className="w-8 text-right text-emerald-600">{s.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-3 text-[11px] tracking-widest text-emerald-600">
        ROHAN_OS v1.0 — /PROJECTS
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {projects.map((p) => (
          <div
            key={p.title}
            className="border border-emerald-900 bg-black/30 p-3 transition-colors hover:border-emerald-500"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold text-emerald-300">{p.title}</h2>
              <span className="text-[10px] text-emerald-700">{p.volume}</span>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-emerald-200/70">
              {p.description}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="border border-emerald-800 px-1.5 py-0.5 text-[10px] text-emerald-400"
                >
                  {t}
                </span>
              ))}
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="ml-auto text-[11px] font-bold text-emerald-300 hover:text-emerald-100"
              >
                OPEN &gt;&gt;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScreenPortfolio({
  rect,
  page,
}: {
  rect: ScreenRect;
  page: 'about' | 'projects';
}) {
  const divH = Math.round(DIV_W * (rect.height / rect.width));
  const scale = (rect.width * PX_PER_UNIT) / DIV_W;

  return (
    <group position={rect.center}>
      <Html
        transform
        scale={scale}
        style={{ width: DIV_W, height: divH }}
        className="select-none overflow-hidden font-mono"
      >
        <div
          className="relative h-full w-full"
          style={{
            background:
              'radial-gradient(ellipse at center, #07130c 0%, #020a05 100%)',
          }}
        >
          {page === 'about' ? <AboutPage /> : <ProjectsPage />}
          {/* scanlines */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 50%)',
              backgroundSize: '100% 4px',
            }}
          />
        </div>
      </Html>
    </group>
  );
}
