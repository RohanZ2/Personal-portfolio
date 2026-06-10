'use client';

import React, { useState, useEffect } from 'react';

interface BottomStatusBarProps {
  isPowered: boolean;
}

export default function BottomStatusBar({ isPowered }: BottomStatusBarProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [stats, setStats] = useState({ mem: 38.2, cpu: 4, temp: 41 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    update();
    const clockInterval = setInterval(update, 1000);

    const statsInterval = setInterval(() => {
      setStats({
        mem: 36 + Math.random() * 6,
        cpu: 3 + Math.floor(Math.random() * 14),
        temp: 39 + Math.floor(Math.random() * 5),
      });
    }, 2000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(statsInterval);
    };
  }, []);

  return (
    <footer className="h-10 shrink-0 flex items-center justify-between px-6 border-t border-grid text-[9px] tracking-[0.15em] text-phosphor/50 uppercase">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-phosphor' : 'bg-alert'}`}></span>
        <span>{isPowered ? 'MASTER_OUT // ONLINE' : 'MASTER_OUT // MUTED'}</span>
      </div>
      <div className="hidden sm:flex items-center gap-5">
        <span>MEM: {stats.mem.toFixed(1)}MB</span>
        <span>CPU: {String(stats.cpu).padStart(2, '0')}%</span>
        <span>TEMP: {stats.temp}C</span>
      </div>
      <div suppressHydrationWarning>{currentTime}</div>
    </footer>
  );
}
