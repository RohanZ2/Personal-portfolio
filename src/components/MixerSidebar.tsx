'use client';

import React, { useRef } from 'react';
import { MotionDiv } from './motion';

const channels = [
  { id: 'about', ch: 'CH-01', label: 'ABOUT_ME', tag: 'L--R' },
  { id: 'projects', ch: 'CH-02', label: 'PROJECTS', tag: 'STEREO' },
  { id: 'skills', ch: 'CH-03', label: 'SKILLS', tag: 'MONO' },
  { id: 'contact', ch: 'CH-04', label: 'CONTACT', tag: 'OUT' },
];

interface MixerSidebarProps {
  activeChannel: string;
  setActiveChannel: (id: string) => void;
  isPowered: boolean;
  setIsPowered: (val: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export default function MixerSidebar({
  activeChannel,
  setActiveChannel,
  isPowered,
  setIsPowered,
  volume,
  setVolume,
}: MixerSidebarProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const handleMasterDrag = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setVolume(Math.round(Math.max(0, Math.min(1, ratio)) * 100));
  };

  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    handleMasterDrag(e.clientX);
    const onMove = (ev: PointerEvent) => handleMasterDrag(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <nav className="w-full md:w-[260px] shrink-0 border-b md:border-b-0 md:border-r border-grid flex flex-row md:flex-col p-4 gap-3 overflow-x-auto md:overflow-x-visible">
      {channels.map((channel) => {
        const isActive = activeChannel === channel.id;
        return (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={`group flex items-center justify-between border p-3 text-left transition-colors duration-300 min-w-[150px] md:min-w-0 ${
              isActive
                ? 'border-phosphor shadow-glow-green text-phosphor'
                : 'border-grid text-phosphor/40 hover:border-phosphor/40 hover:text-phosphor/70'
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-widest">{channel.ch}</span>
                <span className="text-[8px] text-phosphor/30">{channel.tag}</span>
              </div>
              <span className={`text-[11px] tracking-[0.2em] ${isActive ? 'text-glow' : ''}`}>
                {channel.label}
              </span>
              <span className={`text-[8px] tracking-widest ${isActive ? 'text-caution' : 'text-phosphor/20'}`}>
                {isActive ? '■ ACTIVE' : 'IDLE'}
              </span>
            </div>

            {/* Channel fader — thumb springs up when active */}
            <div className="relative w-1.5 h-16 bg-phosphor/10 hidden md:block">
              <MotionDiv
                animate={{ top: isActive ? 4 : 48 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className={`absolute w-4 h-2 -left-[5px] ${
                  isActive ? 'bg-phosphor shadow-glow-green' : 'bg-phosphor/30'
                }`}
              />
            </div>
          </button>
        );
      })}

      {/* Footer: power + master fader */}
      <div className="md:mt-auto flex md:flex-col items-center md:items-stretch gap-4 md:border-t border-grid md:pt-4 pl-4 md:pl-0 border-l md:border-l-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[9px] tracking-widest text-phosphor/40">PWR</span>
          <button
            onClick={() => setIsPowered(!isPowered)}
            aria-label="Toggle power"
            className={`w-8 h-8 border transition-all duration-300 ${
              isPowered
                ? 'bg-alert/20 border-alert shadow-glow-red'
                : 'bg-phosphor/5 border-grid hover:border-phosphor/40'
            }`}
          >
            <span className={`text-[9px] ${isPowered ? 'text-alert' : 'text-phosphor/30'}`}>I/O</span>
          </button>
        </div>

        <div className="hidden md:flex flex-col gap-2">
          <div className="flex justify-between text-[9px] tracking-widest text-phosphor/40">
            <span>MASTER</span>
            <span className="text-grape">MST {volume}</span>
          </div>
          <div
            ref={trackRef}
            onPointerDown={startDrag}
            className="relative h-1.5 bg-phosphor/10 cursor-pointer touch-none"
          >
            <div
              className="absolute top-0 left-0 h-full bg-grape/50"
              style={{ width: `${volume}%` }}
            />
            <div
              className="absolute w-2 h-4 -top-[5px] bg-grape shadow-glow-purple"
              style={{ left: `calc(${volume}% - 4px)` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
