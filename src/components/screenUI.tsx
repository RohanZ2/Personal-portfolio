'use client';

import { BASE, NEON, glow } from './screenTheme';

// Shared header used by every portfolio screen so About / Projects / Contact /
// Music read as one OS: small neon eyebrow, big title, and a sub-row with a
// count on the left and an optional action link on the right.
export function ScreenHeader({
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
// across About, Contact and Music, matching the Projects card frame.
export function Panel({
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
