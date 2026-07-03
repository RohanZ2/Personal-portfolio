'use client';

import { useState } from 'react';
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

// Status of a contact-form submission, drives the SEND button label/colour.
type SendState = 'idle' | 'sending' | 'sent' | 'error';

// The inline email composer that the EMAIL card expands into. Posts name /
// email / message to our own /api/contact route, which attaches the private
// Web3Forms key server-side and forwards the message to Rohan's inbox. The key
// never reaches the browser, so nothing sensitive ships in the client bundle.
function EmailForm({ accent, onClose }: { accent: string; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<SendState>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'sending') return;

    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setState('sent');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  const sendLabel =
    state === 'sending'
      ? '[ SENDING… ]'
      : state === 'sent'
      ? '[ ✓ SENT ]'
      : state === 'error'
      ? '[ ✕ TRY AGAIN ]'
      : '[ SEND MESSAGE ]';

  const inputStyle = {
    borderColor: BASE.line,
    background: '#00000055',
    color: BASE.text,
  } as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto pr-2">
      <div className="mb-4 flex items-start justify-between gap-4">
        <p className="text-[12px] leading-snug" style={{ color: BASE.dim }}>
          Want to work together, or just talk cars and code? Drop a message — it
          lands straight in my inbox — or use any channel below.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 border px-2 py-1 text-[10px] font-bold tracking-widest transition-colors hover:bg-white/5"
          style={{ color: accent, borderColor: accent }}
        >
          [ ✕ ] CLOSE
        </button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest" style={{ color: accent }}>
            NAME
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="border px-3 py-2 text-[12px] outline-none focus:bg-white/5"
            style={inputStyle}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest" style={{ color: accent }}>
            EMAIL
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border px-3 py-2 text-[12px] outline-none focus:bg-white/5"
            style={inputStyle}
          />
        </label>
      </div>

      <label className="mb-4 flex flex-1 flex-col gap-1">
        <span className="text-[10px] tracking-widest" style={{ color: accent }}>
          MESSAGE
        </span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={5}
          className="min-h-[120px] flex-1 resize-none border px-3 py-2 text-[12px] outline-none focus:bg-white/5"
          style={inputStyle}
        />
      </label>

      <button
        type="submit"
        disabled={state === 'sending'}
        className="self-start border px-4 py-2 text-[11px] font-bold tracking-widest transition-colors hover:bg-white/5 disabled:opacity-60"
        style={{ color: accent, borderColor: accent, textShadow: glow(accent, 6) }}
      >
        {sendLabel}
      </button>

      {state === 'sent' && (
        <p className="mt-3 text-[11px]" style={{ color: BASE.text }}>
          Thanks — your message is on its way. I&apos;ll get back to you soon.
        </p>
      )}
      {state === 'error' && (
        <p className="mt-3 text-[11px]" style={{ color: BASE.text }}>
          Something went wrong sending that. You can also email me directly at
          rohantewari2009@gmail.com.
        </p>
      )}
    </form>
  );
}

function ContactPage() {
  // When set, the EMAIL card is expanded into the inline composer.
  const [composing, setComposing] = useState(false);

  // The EMAIL card always sits first, so it keeps accent index 0.
  const emailAccent = accentFor(0);

  if (composing) {
    return (
      <div className="flex h-full flex-col p-6">
        <ScreenHeader
          eyebrow="GEAR 4 · GET IN TOUCH"
          title="Contact"
          subLeft="COMPOSE MESSAGE"
        />
        <EmailForm accent={emailAccent} onClose={() => setComposing(false)} />
      </div>
    );
  }

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
          const isEmail = c.label === 'EMAIL';

          const inner = (
            <>
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
                {isEmail ? 'WRITE A MESSAGE →' : 'CONNECT →'}
              </div>
            </>
          );

          const cardClass =
            'group flex flex-col gap-2 border p-4 text-left transition-colors hover:bg-white/5';
          const cardStyle = { borderColor: BASE.line, background: '#00000055' };

          // The EMAIL card opens the inline composer instead of navigating.
          if (isEmail) {
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => setComposing(true)}
                className={cardClass}
                style={cardStyle}
              >
                {inner}
              </button>
            );
          }

          return (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className={cardClass}
              style={cardStyle}
            >
              {inner}
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
