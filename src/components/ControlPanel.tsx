'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  // Web Audio state references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const crackleNodeRef = useRef<ScriptProcessorNode | null>(null);
  const humNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // VU Meter state
  const [vuLevels, setVuLevels] = useState<number[]>([0, 0, 0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and run audio engine
  useEffect(() => {
    if (isPowered && volume > 0) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        if (!gainNodeRef.current) {
          gainNodeRef.current = ctx.createGain();
          gainNodeRef.current.connect(ctx.destination);
        }
        gainNodeRef.current.gain.value = (volume / 100) * 0.15; // keep it subtle

        // Procedural Vinyl Crackle Generator
        if (!crackleNodeRef.current) {
          const bufferSize = 4096;
          const crackle = ctx.createScriptProcessor(bufferSize, 1, 1);
          crackle.onaudioprocess = (e) => {
            const outputBuffer = e.outputBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              let r = Math.random() * 2 - 1;
              let dust = 0;
              if (Math.random() < 0.0003) {
                // Occasional crackle spike
                dust = (Math.random() * 2 - 1) * 0.6;
              }
              // Combine subtle white noise and clicks
              outputBuffer[i] = r * 0.005 + dust;
            }
          };
          crackle.connect(gainNodeRef.current);
          crackleNodeRef.current = crackle;
        }

        // Low hum (50Hz ground hum for analog hardware feel)
        if (!humNodeRef.current) {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.frequency.value = 50;
          osc.type = 'sine';
          oscGain.gain.value = 0.02;
          osc.connect(oscGain);
          oscGain.connect(gainNodeRef.current);
          osc.start();
          humNodeRef.current = osc;
        }
      } catch (err) {
        console.error('Failed to initialize vinyl audio engine:', err);
      }
    } else {
      // Pause or stop sounds
      if (humNodeRef.current) {
        try {
          humNodeRef.current.stop();
        } catch (_) {}
        humNodeRef.current = null;
      }
      if (crackleNodeRef.current) {
        crackleNodeRef.current.disconnect();
        crackleNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().then(() => {
          audioCtxRef.current = null;
        });
      }
    }

    return () => {
      // cleanup sounds on unmount
      if (humNodeRef.current) {
        try { humNodeRef.current.stop(); } catch (_) {}
        humNodeRef.current = null;
      }
      if (crackleNodeRef.current) {
        crackleNodeRef.current.disconnect();
        crackleNodeRef.current = null;
      }
    };
  }, [isPowered, volume]);

  // Adjust volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.value = (volume / 100) * 0.15;
    }
  }, [volume]);

  // Update VU meters
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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPowered, volume]);

  const handleKnobDrag = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    type: 'page' | 'volume' | 'rpm'
  ) => {
    if (!isPowered && type !== 'volume') return;

    const startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startValue = type === 'volume' ? volume : 0;

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const deltaY = startY - currentY;

      if (type === 'volume') {
        const nextVal = Math.min(100, Math.max(0, startValue + Math.floor(deltaY / 2)));
        setVolume(nextVal);
      }
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

  const rotatePage = () => {
    if (!isPowered) return;
    const tabs = ['about', 'projects', 'skills', 'contact'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const getPageKnobRotation = () => {
    const tabs = ['about', 'projects', 'skills', 'contact'];
    const idx = tabs.indexOf(activeTab);
    return idx * 90 - 45; // -45, 45, 135, 225 deg
  };

  const getRpmKnobRotation = () => {
    if (rpmMode === 33) return -60;
    if (rpmMode === 45) return 0;
    return 60;
  };

  return (
    <div className="w-full lg:w-44 flex flex-col items-center justify-between py-6 px-4 border border-hardware-border bg-panel rounded-xl shadow-2xl space-y-6 select-none brushed-metal h-full">
      {/* SECTION 1: POWER SWITCH */}
      <div className="flex flex-col items-center w-full">
        <span className="text-[10px] text-zinc-500 font-tech font-bold uppercase tracking-wider mb-2">Power Module</span>
        <button
          onClick={() => setIsPowered(!isPowered)}
          className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
            isPowered
              ? 'bg-red-950 border-red-500 text-red-500 shadow-led-red'
              : 'bg-zinc-900 border-zinc-700 text-zinc-600'
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className={`w-2 h-2 rounded-full mb-1 ${isPowered ? 'bg-red-500 shadow-led-red' : 'bg-zinc-800'}`}></div>
            <span className="text-[9px] font-orbitron font-bold">POWER</span>
          </div>
        </button>
      </div>

      {/* SECTION 2: ROTARY KNOBS */}
      <div className="flex flex-col gap-6 items-center w-full">
        {/* KNOB 1: PAGE SELECTION */}
        <div className="knob-container">
          <span className="text-[9px] text-zinc-500 font-tech uppercase tracking-wider mb-1">MODE / SELECT</span>
          <div
            onClick={rotatePage}
            className={`w-14 h-14 rounded-full border-4 border-zinc-800 bg-gradient-to-tr from-zinc-950 to-zinc-800 relative cursor-pointer shadow-lg active:scale-95 transition-transform ${
              isPowered ? 'opacity-100 hover:border-zinc-700' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{
              transform: `rotate(${isPowered ? getPageKnobRotation() : -45}deg)`,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="absolute top-0 left-1/2 w-1.5 h-4 bg-primary rounded-full transform -translate-x-1/2"></div>
            <div className="absolute inset-2 rounded-full border border-zinc-700/50 bg-radial-gradient"></div>
          </div>
          <span className="text-[9px] text-zinc-400 font-tech mt-2 text-center h-4 flex items-center justify-center">
            {isPowered ? activeTab.toUpperCase() : '---'}
          </span>
        </div>

        {/* KNOB 2: VOLUME CONTROL */}
        <div className="knob-container">
          <span className="text-[9px] text-zinc-500 font-tech uppercase tracking-wider mb-1">STATIC GEN</span>
          <div
            onMouseDown={(e) => handleKnobDrag(e, 'volume')}
            onTouchStart={(e) => handleKnobDrag(e, 'volume')}
            className={`w-14 h-14 rounded-full border-4 border-zinc-800 bg-gradient-to-tr from-zinc-950 to-zinc-800 relative shadow-lg ${
              isPowered ? 'cursor-grab active:cursor-grabbing opacity-100' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{
              transform: `rotate(${(volume / 100) * 270 - 135}deg)`,
            }}
          >
            <div className="absolute top-1 left-1/2 w-1.5 h-1.5 bg-secondary rounded-full transform -translate-x-1/2"></div>
          </div>
          <span className="text-[9px] text-zinc-400 font-tech mt-2">
            VOL: {isPowered ? `${volume}%` : 'OFF'}
          </span>
        </div>

        {/* KNOB 3: RPM MODE */}
        <div className="knob-container">
          <span className="text-[9px] text-zinc-500 font-tech uppercase tracking-wider mb-1">SPEED SELECT</span>
          <div
            onClick={() => {
              if (!isPowered) return;
              const nextRpm = rpmMode === 33 ? 45 : rpmMode === 45 ? 78 : 33;
              setRpmMode(nextRpm);
            }}
            className={`w-14 h-14 rounded-full border-4 border-zinc-800 bg-gradient-to-tr from-zinc-950 to-zinc-800 relative cursor-pointer shadow-lg active:scale-95 transition-transform ${
              isPowered ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{
              transform: `rotate(${getRpmKnobRotation()}deg)`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <div className="absolute top-0 left-1/2 w-1 h-3.5 bg-zinc-300 rounded-full transform -translate-x-1/2"></div>
          </div>
          <span className="text-[9px] text-zinc-400 font-tech mt-2">
            {isPowered ? `${rpmMode} RPM` : '---'}
          </span>
        </div>
      </div>

      {/* SECTION 3: VU METERS */}
      <div className="w-full flex flex-col items-center">
        <span className="text-[9px] text-zinc-500 font-tech uppercase tracking-wider mb-2">SIGNAL RATIO</span>
        <div className="flex gap-2 justify-center h-20 items-end bg-zinc-950/80 p-2.5 rounded-lg w-full border border-zinc-800">
          {vuLevels.map((lvl, colIdx) => (
            <div key={colIdx} className="flex flex-col-reverse justify-start gap-[2px] h-full w-4">
              {Array.from({ length: 10 }).map((_, segmentIdx) => {
                const isActive = lvl > segmentIdx;
                let bgClass = 'bg-zinc-900';
                if (isActive) {
                  if (segmentIdx < 6) bgClass = 'bg-emerald-500 shadow-led-green';
                  else if (segmentIdx < 8) bgClass = 'bg-amber-500 shadow-led-amber';
                  else bgClass = 'bg-red-500 shadow-led-red';
                }
                return <div key={segmentIdx} className={`h-[5px] w-full rounded-sm ${bgClass}`} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
