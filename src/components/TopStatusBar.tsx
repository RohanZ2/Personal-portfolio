'use client';

import React from 'react';

interface TopStatusBarProps {
  isPowered: boolean;
}

export default function TopStatusBar({ isPowered }: TopStatusBarProps) {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-6 border-b border-grid text-[10px] tracking-[0.2em] uppercase">
      <div className="flex items-baseline gap-3">
        <span className="font-pixel text-[11px] text-phosphor text-glow">ROHAN_OS</span>
        <span className="text-phosphor/40 hidden sm:inline">// AUDIO_TERMINAL v3.0</span>
      </div>

      <div className="hidden md:flex items-center gap-6 text-phosphor/40">
        <span>FREQ: 432.0HZ</span>
        <span>BPM: 120</span>
        <span>BUF: 256MS</span>
      </div>

      <div className={`flex items-center gap-2 ${isPowered ? 'text-phosphor' : 'text-alert'}`}>
        <span className={`w-2 h-2 rounded-full ${isPowered ? 'bg-phosphor shadow-glow-green animate-pulse' : 'bg-alert shadow-glow-red'}`}></span>
        <span>{isPowered ? 'SYSTEM_ONLINE' : 'SYSTEM_STANDBY'}</span>
      </div>
    </header>
  );
}
