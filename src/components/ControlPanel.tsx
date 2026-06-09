'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlPanelProps {
  isPowered: boolean;
  setIsPowered: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  volume: number;
  setVolume: (vol: number) => void;
  rpmMode: number;
  setRpmMode: (rpm: number) => void;
}

// Particle component for sparks/music notes
const Particle = ({ x, y, type, onComplete }: { x: number, y: number, type: 'spark' | 'note', onComplete: () => void }) => {
  const randomX = (Math.random() - 0.5) * 100;
  const randomY = -50 - Math.random() * 50;
  const randomRot = (Math.random() - 0.5) * 360;
  
  return (
    <motion.div
      initial={{ x, y, opacity: 1, scale: 0.5, rotate: 0 }}
      animate={{ x: x + randomX, y: y + randomY, opacity: 0, scale: 1.5, rotate: randomRot }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className={`absolute pointer-events-none z-50 ${type === 'spark' ? 'text-primary' : 'text-secondary'}`}
      style={{ fontSize: '20px' }}
    >
      {type === 'spark' ? '✨' : '🎵'}
    </motion.div>
  );
};

export default function ControlPanel({
  isPowered,
  setIsPowered,
  activeTab,
  setActiveTab,
  volume,
  setVolume,
  rpmMode,
  setRpmMode,
}: ControlPanelProps) {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, type: 'spark' | 'note' }[]>([]);
  const particleIdRef = useRef(0);

  const spawnParticles = (e: React.MouseEvent | React.TouchEvent, type: 'spark' | 'note') => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Adjust coordinates relative to the panel if needed, but absolute fixed is easier for simple effects
    // For simplicity, we'll just spawn them near the knob
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const newParticles = Array.from({ length: 3 }).map(() => ({
      id: particleIdRef.current++,
      x,
      y,
      type
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const removeParticle = (id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  const [vuLevels, setVuLevels] = useState<number[]>([0, 0, 0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPowered) {
      intervalRef.current = setInterval(() => {
        const activityMult = volume > 0 ? 1.2 : 0.4;
        const newLevels = [
          Math.min(10, Math.floor(Math.random() * 6 * activityMult + 2)),
          Math.min(10, Math.floor(Math.random() * 7 * activityMult + 1)),
          Math.min(10, Math.floor(Math.random() * 8 * activityMult + 2)),
          Math.min(10, Math.floor(Math.random() * 5 * activityMult + 3)),
        ];
        setVuLevels(newLevels);
      }, 120);
    } else {
      setVuLevels([0, 0, 0, 0]);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPowered, volume]);

  const handleKnobDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    type: 'volume'
  ) => {
    if (!isPowered) return;
    spawnParticles(e, 'note');

    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startValue = volume;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaY = startY - currentY;
      const nextVal = Math.min(100, Math.max(0, startValue + Math.floor(deltaY / 2)));
      setVolume(nextVal);
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleUp);
  };

  const rotatePage = (e: React.MouseEvent) => {
    if (!isPowered) return;
    spawnParticles(e, 'spark');
    const tabs = ['about', 'projects', 'skills', 'contact'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const getPageKnobRotation = () => {
    const tabs = ['about', 'projects', 'skills', 'contact'];
    return tabs.indexOf(activeTab) * 90 - 45;
  };

  const getRpmKnobRotation = () => {
    if (rpmMode === 33) return -60;
    if (rpmMode === 45) return 0;
    return 60;
  };

  return (
    <>
      {/* Particle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {particles.map(p => (
            <Particle key={p.id} x={p.x} y={p.y} type={p.type} onComplete={() => removeParticle(p.id)} />
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[240px] h-full min-h-[600px] flex flex-col items-center justify-between py-8 px-6 pixel-border bg-[#0d0d12]">
        
        {/* SECTION 1: POWER SWITCH */}
        <div className="flex flex-col items-center w-full mb-8">
          <span className="text-[10px] text-zinc-500 uppercase mb-4">POWER</span>
          <button
            onClick={() => setIsPowered(!isPowered)}
            className={`w-20 h-20 flex items-center justify-center pixel-btn ${
              isPowered ? 'bg-red-500' : 'bg-zinc-800'
            }`}
          >
            <span className="text-[12px] text-black">I/O</span>
          </button>
        </div>

        {/* SECTION 2: ROTARY KNOBS */}
        <div className="flex flex-col gap-12 items-center w-full">
          {/* KNOB 1: PAGE SELECTION */}
          <div className="knob-container">
            <span className="text-[8px] text-zinc-500 uppercase mb-4">MODE</span>
            <div
              onClick={rotatePage}
              className={`w-24 h-24 rounded-full pixel-border bg-zinc-800 relative cursor-pointer ${
                isPowered ? 'opacity-100 hover:bg-zinc-700' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ transform: `rotate(${isPowered ? getPageKnobRotation() : -45}deg)`, transition: 'transform 0.2s steps(4)' }}
            >
              <div className="absolute top-2 left-1/2 w-4 h-4 bg-primary transform -translate-x-1/2 pixel-border"></div>
            </div>
            <span className="text-[10px] text-zinc-400 mt-6 h-4 text-primary">
              {isPowered ? activeTab.toUpperCase() : '---'}
            </span>
          </div>

          {/* KNOB 2: VOLUME CONTROL */}
          <div className="knob-container">
            <span className="text-[8px] text-zinc-500 uppercase mb-4">AUDIO</span>
            <div
              onMouseDown={(e) => handleKnobDrag(e, 'volume')}
              onTouchStart={(e) => handleKnobDrag(e, 'volume')}
              className={`w-24 h-24 rounded-full pixel-border bg-zinc-800 relative ${
                isPowered ? 'cursor-grab active:cursor-grabbing opacity-100' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ transform: `rotate(${(volume / 100) * 270 - 135}deg)` }}
            >
              <div className="absolute top-2 left-1/2 w-4 h-4 bg-secondary transform -translate-x-1/2 pixel-border"></div>
            </div>
            <span className="text-[10px] text-zinc-400 mt-6">
              VOL: {isPowered ? `${volume}%` : 'OFF'}
            </span>
          </div>
        </div>

        {/* SECTION 3: VU METERS */}
        <div className="w-full flex flex-col items-center mt-8">
          <span className="text-[8px] text-zinc-500 uppercase mb-4">SIGNAL</span>
          <div className="flex gap-2 justify-center h-24 items-end bg-[#050508] p-4 pixel-border w-full">
            {vuLevels.map((lvl, colIdx) => (
              <div key={colIdx} className="flex flex-col-reverse justify-start gap-1 h-full w-4">
                {Array.from({ length: 10 }).map((_, segmentIdx) => {
                  const isActive = lvl > segmentIdx;
                  let bgClass = 'bg-zinc-900';
                  if (isActive) {
                    if (segmentIdx < 6) bgClass = 'bg-emerald-500';
                    else if (segmentIdx < 8) bgClass = 'bg-amber-500';
                    else bgClass = 'bg-red-500';
                  }
                  return <div key={segmentIdx} className={`h-1.5 w-full ${bgClass}`} />;
                })}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
