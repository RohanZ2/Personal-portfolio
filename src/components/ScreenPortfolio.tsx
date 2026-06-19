'use client';

import { ScreenRect } from './screenRect';
import { ScreenId } from './screenFocusStore';
import { BASE, glow, accentFor } from './screenTheme';
import { bio, projects, contacts, Project } from '../data/portfolio';
import ScreenShell from './ScreenShell';
import { ScreenHeader, Panel } from './screenUI';

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
        <Panel label="// PROFILE" accent={accentFor(0)}>
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
          const accent = accentFor(i);
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
          <ProjectCard key={p.title} p={p} accent={accentFor(pi)} />
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
  return (
    <ScreenShell id={id} rect={rect}>
      {page === 'about' ? (
        <AboutPage />
      ) : page === 'contact' ? (
        <ContactPage />
      ) : (
        <ProjectsPage />
      )}
    </ScreenShell>
  );
}
