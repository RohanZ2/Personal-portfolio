'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  volume: string;
  speed: number;
}

interface TurntableDeckProps {
  isPowered: boolean;
  activeProject: Project;
  setActiveProject: (p: Project) => void;
  projects: Project[];
  rpmMode: number;
}

export default function TurntableDeck({
  isPowered,
  activeProject,
  setActiveProject,
  projects,
  rpmMode,
}: TurntableDeckProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(0);
  const requestRef = useRef<number | null>(null);
  const rpmTarget = isPlaying ? rpmMode : 0;

  useEffect(() => {
    if (!isPowered) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [isPowered, activeProject]);

  useEffect(() => {
    let lastTime = performance.now();
    
    const animateRpm = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setCurrentRpm((prev) => {
        if (Math.abs(prev - rpmTarget) < 0.1) return rpmTarget;
        const diff = rpmTarget - prev;
        const speedFactor = 2.5; 
        return prev + diff * speedFactor * delta;
      });

      requestRef.current = requestAnimationFrame(animateRpm);
    };

    requestRef.current = requestAnimationFrame(animateRpm);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [rpmTarget]);

  const skillsText = "REACT • NEXT.JS • TYPESCRIPT • TAILWIND • NODE.JS • EXPRESS • MONGODB • DOCKER • AWS • GIT • ";

  return (
    <div className="w-full max-w-[700px] h-full min-h-[600px] pixel-border bg-[#0d0d12] p-8 flex flex-col justify-between relative">
      
      {/* Top section: Speed sensor */}
      <div className="flex justify-between items-center w-full mb-8 z-20">
        <div className="flex gap-4 items-center">
          <div className="bg-zinc-950 px-4 py-2 pixel-border flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-[8px] text-zinc-500 uppercase mb-1">Speed</span>
            <span className={`font-black text-sm leading-none ${isPowered && isPlaying ? 'text-red-500 text-shadow-sm' : 'text-zinc-800'}`}>
              {currentRpm.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col text-[10px] text-zinc-500">
            <span>RPM STATUS</span>
            <span className={isPowered && isPlaying ? 'text-emerald-500' : 'text-zinc-600'}>
              {isPowered && isPlaying ? 'PLAYING' : 'STANDBY'}
            </span>
          </div>
        </div>
        <div className="text-right select-none hidden md:block">
          <div className="text-[12px] font-black text-zinc-400">SL-1200.PIXEL</div>
          <div className="text-[10px] text-zinc-500 uppercase">8-Bit Turntable Deck</div>
        </div>
      </div>

      {/* Center section: Platter & Album Covers Behind */}
      <div className="flex-1 w-full relative flex items-center justify-center mt-12 mb-8 z-10">
        
        {/* ALBUM COVERS BEHIND THE PLATTER */}
        <div className="absolute top-[-80px] left-1/2 transform -translate-x-1/2 flex justify-center gap-8 w-full z-0">
          {projects.map((project, idx) => {
            const isActive = activeProject.title === project.title;
            // Position active slightly higher
            return (
              <motion.div
                key={idx}
                onClick={() => isPowered && setActiveProject(project)}
                initial={false}
                animate={{
                  y: isActive ? -40 : 0,
                  scale: isActive ? 1.1 : 1,
                  rotate: (idx - 1) * 10, // slight fan out
                  zIndex: isActive ? 5 : 1
                }}
                className={`cursor-pointer pixel-border w-32 h-32 flex flex-col items-center justify-center transition-all ${
                  isActive ? 'bg-[#1a1a24] border-primary' : 'bg-[#0d0d12] border-zinc-700 opacity-80 hover:opacity-100 hover:-translate-y-4'
                }`}
              >
                <div className="text-[8px] text-zinc-400">{project.volume}</div>
                <div className="text-[10px] font-bold text-zinc-200 mt-2 text-center uppercase">{project.title.split(' ')[0]}</div>
              </motion.div>
            );
          })}
        </div>

        {/* PLATTER & VINYL (Foreground) */}
        <div className="w-[340px] h-[340px] rounded-full bg-zinc-950 pixel-border relative flex items-center justify-center z-10 shadow-2xl">
          <motion.div
            animate={isPowered && isPlaying ? { rotate: 360 } : {}}
            transition={isPowered && isPlaying ? { repeat: Infinity, ease: "linear", duration: rpmMode === 33 ? 1.8 : 1.3 } : { duration: 1.5, ease: "easeOut" }}
            className="w-[300px] h-[300px] rounded-full vinyl-grooves cursor-pointer relative flex items-center justify-center active:scale-[0.99] select-none"
            onClick={() => isPowered && setIsPlaying(!isPlaying)}
          >
            {/* Center Label */}
            <div className="w-[100px] h-[100px] rounded-full bg-[#1a1a24] pixel-border flex items-center justify-center relative overflow-hidden">
              <svg className="absolute w-[95px] h-[95px] text-[7px] fill-zinc-400 pointer-events-none" viewBox="0 0 100 100">
                <path id="skills-text-path-pixel" fill="transparent" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                <text><textPath href="#skills-text-path-pixel">{skillsText}</textPath></text>
              </svg>
              <div className="w-[20px] h-[20px] rounded-full bg-black pixel-border flex items-center justify-center z-20"></div>
              <div className="absolute bottom-3 text-[8px] text-primary uppercase">{activeProject.volume}</div>
            </div>
          </motion.div>
        </div>

        {/* TONEARM */}
        <motion.div
          animate={{ rotate: isPowered && isPlaying ? 22 : -10 }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          style={{ originX: 0.85, originY: 0.15 }}
          className="absolute top-10 right-10 w-[140px] h-[220px] pointer-events-none z-20"
        >
          {/* Base */}
          <div className="absolute top-[10px] right-[10px] w-[34px] h-[34px] rounded-full bg-zinc-800 pixel-border flex items-center justify-center"></div>
          {/* Arm */}
          <svg className="absolute top-[28px] right-[26px] w-[110px] h-[180px] text-zinc-500" viewBox="0 0 100 160" fill="none">
            <path d="M 85, 5 C 65, 45 45, 95 10, 155" stroke="currentColor" strokeWidth="6" />
          </svg>
          {/* Cartridge */}
          <div className="absolute bottom-[2px] left-[-4px] w-[18px] h-[34px] bg-zinc-900 pixel-border transform rotate-[25deg]">
            <div className={`absolute bottom-[2px] right-[2px] w-[8px] h-2 ${isPowered && isPlaying ? 'bg-primary' : 'bg-zinc-800'}`}></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
