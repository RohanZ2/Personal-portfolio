'use client';

import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { ScreenRect } from './screenRect';
import { ScreenId, useScreenFocus } from './screenFocusStore';
import { BASE, NEON, NEON_CYCLE, glow } from './screenTheme';
import { useIntroDone } from './introSequence';
import { bio, projects, contacts, Project } from '../data/portfolio';

// CSS pixel width of the embedded UI; height follows the glass aspect.
const DIV_W = 720;
// drei <Html transform> renders 40 CSS px per world unit at scale 1
// (calibrated against the rendered scene). scale is chosen so the div
// exactly covers the monitor glass.
const PX_PER_UNIT = 40;

// Shared header used by every portfolio screen so About / Projects / Contact
// read as one OS: small neon eyebrow, big title, and a sub-row with a count on
// the left and an optional action link on the right.
function ScreenHeader({
  eyebrow,
  title,
  subLeft,
  action,
}: {
  eyebrow: string;
  title: string;
  subLeft: string;
  action?: { label: string; href: string };
}) {
  return (
    <>
      <div
        className="text-[11px] tracking-widest"
        style={{ color: NEON.pink, textShadow: glow(NEON.pink, 6) }}
      >
        {eyebrow}
      </div>
      <h1
        className="text-3xl font-bold"
        style={{ color: NEON.yellow, textShadow: glow(NEON.yellow, 14) }}
      >
        {title}
      </h1>
      <div className="mb-3 mt-1 flex items-center justify-between">
        <span className="text-[11px] tracking-widest" style={{ color: BASE.dim }}>
          {subLeft}
        </span>
        {action && (
          <a
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className="border px-2 py-0.5 text-[10px] font-bold tracking-widest"
            style={{ borderColor: NEON.cyan, color: NEON.cyan, textShadow: glow(NEON.cyan, 6) }}
          >
            {action.label}
          </a>
        )}
      </div>
    </>
  );
}

// A bordered panel with a small neon eyebrow label — the recurring "card" used
// across About and Contact, matching the Projects card frame.
function Panel({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-2 border p-3"
      style={{ borderColor: BASE.line, background: '#00000055' }}
    >
      <div className="text-[10px] tracking-widest" style={{ color: accent }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <ScreenHeader
        eyebrow="GEAR 1 · WHO I AM"
        title="About Me"
        subLeft="ROHAN TEWARI · FULL STACK ENGINEER"
        action={{ label: '[ GITHUB → ]', href: 'https://github.com/RohanZ2' }}
      />

      <div className="flex-1 overflow-y-auto pr-2">
        <Panel label="// PROFILE" accent={NEON.pink}>
          {bio.map((line) => (
            <p
              key={line.slice(0, 16)}
              className="text-[12px] leading-snug"
              style={{ color: BASE.text }}
            >
              {line}
            </p>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <ScreenHeader
        eyebrow="GEAR 4 · GET IN TOUCH"
        title="Contact Me"
        subLeft={`${contacts.length} CHANNELS OPEN`}
      />

      {/* 2-column grid of contact cards, same frame as the project cards. */}
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto pr-2">
        {contacts.map((c, i) => {
          const accent = NEON_CYCLE[i % NEON_CYCLE.length];
          return (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group flex flex-col gap-2 border p-4 transition-colors hover:bg-white/5"
              style={{ borderColor: BASE.line, background: '#00000055' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest" style={{ color: BASE.dim }}>
                  {c.spec}
                </span>
                <span
                  className="border px-1.5 text-[9px] tracking-widest"
                  style={{ color: accent, borderColor: accent }}
                >
                  OPEN
                </span>
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: accent, textShadow: glow(accent, 8) }}
              >
                {c.label}
              </div>
              <div className="text-[12px] leading-snug" style={{ color: BASE.text }}>
                {c.value}
              </div>
              <div
                className="mt-auto text-[11px] font-bold tracking-widest"
                style={{ color: accent }}
              >
                CONNECT →
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function ProjectCard({ p, accent }: { p: Project; accent: string }) {
  const liveLabel = p.status === 'DEMO' ? '[ DEMO ]' : '[ LIVE ]';
  return (
    <div
      className="flex flex-col border"
      style={{ borderColor: BASE.line, background: '#00000055' }}
    >
      {/* Image / placeholder with the status badge over its top-right. */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border-b"
        style={{ borderColor: BASE.line }}
      >
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        ) : (
          // Placeholder until a real screenshot is dropped in /public: a dark
          // neon-tinted panel with the project name, plus faint scanlines.
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `radial-gradient(ellipse at center, ${accent}22 0%, ${BASE.black} 80%)`,
            }}
          >
            <span
              className="text-sm font-bold tracking-widest"
              style={{ color: accent, textShadow: glow(accent, 10) }}
            >
              {p.title.toUpperCase()}
            </span>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 50%)',
                backgroundSize: '100% 4px',
              }}
            />
          </div>
        )}
        <span
          className="absolute right-1.5 top-1.5 border px-1.5 py-0.5 text-[9px] tracking-widest"
          style={{
            borderColor: accent,
            color: accent,
            background: 'rgba(0,0,0,0.7)',
          }}
        >
          {p.status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="text-[10px] tracking-widest" style={{ color: BASE.dim }}>
          {p.spec}
        </div>
        <h2
          className="text-base font-bold"
          style={{ color: accent, textShadow: glow(accent, 8) }}
        >
          {p.title}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5">
          {p.tech.map((t) => (
            <span
              key={t}
              className="border px-1.5 py-0.5 text-[10px]"
              style={{ borderColor: BASE.line, color: accent }}
            >
              {t}
            </span>
          ))}
        </div>
        <p
          className="text-[12px] leading-snug"
          style={{ color: BASE.text }}
        >
          {p.description}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-1">
          {p.liveLink && (
            <a
              href={p.liveLink}
              target="_blank"
              rel="noreferrer"
              className="border px-2 py-0.5 text-[10px] font-bold tracking-widest"
              style={{ borderColor: accent, color: accent, textShadow: glow(accent, 6) }}
            >
              {liveLabel}
            </a>
          )}
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className="border px-2 py-0.5 text-[10px] font-bold tracking-widest"
            style={{ borderColor: BASE.line, color: BASE.text }}
          >
            [ SOURCE ]
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectsPage() {
  return (
    <div className="flex h-full flex-col p-6">
      <ScreenHeader
        eyebrow="GEAR 9 · BUILT WORK"
        title="Projects"
        subLeft={`${projects.length} SELECTED BUILDS`}
        action={{ label: '[ ALL PROJECTS ON GITHUB → ]', href: 'https://github.com/RohanZ2' }}
      />

      {/* 2-column card grid (scrolls vertically when the screen is expanded). */}
      <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto pr-2">
        {projects.map((p, pi) => (
          // Each card keyed to one neon so its title, badge, and tags share a
          // color — keeps the grid from turning to mush.
          <ProjectCard key={p.title} p={p} accent={NEON_CYCLE[pi % NEON_CYCLE.length]} />
        ))}
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
  page: 'about' | 'projects' | 'contact';
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
          {page === 'about' ? (
            <AboutPage />
          ) : page === 'contact' ? (
            <ContactPage />
          ) : (
            <ProjectsPage />
          )}
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
