'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Sync isPlaying with power
  useEffect(() => {
    if (!isPowered) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [isPowered, activeProject]); // auto-play when active project changes and power is on

  // Inertia simulation for the RPM speedometer readout
  useEffect(() => {
    let lastTime = performance.now();
    
    const animateRpm = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setCurrentRpm((prev) => {
        if (Math.abs(prev - rpmTarget) < 0.1) {
          return rpmTarget;
        }
        // Accelerate or decelerate smoothly
        const diff = rpmTarget - prev;
        const speedFactor = 2.5; // speed of dial spin up
        return prev + diff * speedFactor * delta;
      });

      requestRef.current = requestAnimationFrame(animateRpm);
    };

    requestRef.current = requestAnimationFrame(animateRpm);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [rpmTarget]);

  // Skills string to rotate on the vinyl label
  const skillsText = "REACT • NEXT.JS • TYPESCRIPT • TAILWIND • NODE.JS • EXPRESS • MONGODB • DOCKER • AWS • GIT • GRAPHQL • STRIPE • ";

  return (
    <div className="flex-1 min-w-[340px] xl:max-w-[620px] bg-panel border border-hardware-border rounded-xl p-6 shadow-2xl flex flex-col justify-between brushed-metal h-full relative">
      {/* DECK HEADER / SPEED SENSOR MODULE */}
      <div className="flex justify-between items-center w-full mb-4">
        {/* Speed readout screen */}
        <div className="flex gap-4 items-center">
          <div className="bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 flex flex-col items-center justify-center min-w-[80px]">
            <span className="text-[7px] text-zinc-500 font-tech font-bold uppercase tracking-wider mb-0.5">Speed Readout</span>
            <span className={`font-orbitron font-black text-xs leading-none ${isPowered && isPlaying ? 'text-red-500 shadow-led-red' : 'text-zinc-800'}`}>
              {currentRpm.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col text-[8px] text-zinc-500 font-tech">
            <span>RPM STATUS</span>
            <span className={isPowered && isPlaying ? 'text-emerald-500 font-bold' : 'text-zinc-600'}>
              {isPowered && isPlaying ? 'SENSOR STABLE // PLAYING' : 'STANDBY // MOTOR OFF'}
            </span>
          </div>
        </div>

        {/* Brand / Model decal */}
        <div className="text-right select-none">
          <div className="text-[10px] font-orbitron font-black tracking-widest text-zinc-400">SL-1200.PRTF</div>
          <div className="text-[8px] font-tech text-zinc-500 uppercase tracking-widest">High Fidelity Turntable Deck</div>
        </div>
      </div>

      {/* TURNTABLE ASSEMBLY CONTAINER */}
      <div className="flex-1 flex items-center justify-center relative my-4 h-[280px]">
        {/* Platter outer well */}
        <div className="w-[270px] h-[270px] rounded-full bg-zinc-950 border-[6px] border-zinc-800 shadow-2xl relative flex items-center justify-center">
          
          {/* Subtle strobe light on the bottom-left */}
          <div className="absolute bottom-2 left-2 flex flex-col items-center">
            <div className={`w-3.5 h-3.5 rounded-full border border-zinc-800 ${isPowered ? 'bg-red-500 shadow-led-red animate-pulse' : 'bg-zinc-900'}`}></div>
            <span className="text-[6px] text-zinc-600 font-tech font-bold mt-0.5">STROBE</span>
          </div>

          {/* Platter edge stroboscope dots */}
          <div className="absolute inset-2 rounded-full border border-zinc-800/40 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none opacity-40"></div>

          {/* VINYL RECORD */}
          <motion.div
            animate={isPowered && isPlaying ? { rotate: 360 } : {}}
            transition={isPowered && isPlaying ? {
              repeat: Infinity,
              ease: "linear",
              duration: rpmMode === 33 ? 1.8 : rpmMode === 45 ? 1.3 : 0.8
            } : { duration: 1.5, ease: "easeOut" }}
            className="w-[236px] h-[236px] rounded-full vinyl-grooves cursor-pointer relative flex items-center justify-center active:scale-[0.99] transition-transform select-none shadow-2xl z-10"
            onClick={() => isPowered && setIsPlaying(!isPlaying)}
          >
            {/* Center Label */}
            <div className="w-[84px] h-[84px] rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Circular pattern design */}
              <div className="absolute inset-0 rounded-full border border-primary/20 bg-[radial-gradient(circle,rgba(255,85,0,0.1)_10%,transparent_70%)]"></div>
              
              {/* Outer circular label with spinning skills text */}
              <svg className="absolute w-[80px] h-[80px] text-[6.5px] fill-zinc-400 font-tech tracking-wider pointer-events-none" viewBox="0 0 100 100">
                <path
                  id="skills-text-path"
                  fill="transparent"
                  d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                />
                <text>
                  <textPath href="#skills-text-path">
                    {skillsText}
                  </textPath>
                </text>
              </svg>

              {/* Center Core Cap */}
              <div className="w-[24px] h-[24px] rounded-full bg-black border border-zinc-700 flex items-center justify-center z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-inner"></div>
              </div>
              
              {/* Active project code decal on label */}
              <div className="absolute bottom-2 text-[6px] text-primary font-orbitron tracking-widest font-black pointer-events-none uppercase">
                {activeProject.volume}
              </div>
            </div>

            {/* Vinyl shine reflections (radial glow highlights overlay) */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_15%,rgba(255,255,255,0.04)_25%,transparent_35%,transparent_65%,rgba(255,255,255,0.04)_75%,transparent_85%)] pointer-events-none mix-blend-overlay"></div>
          </motion.div>
        </div>

        {/* TONEARM ASSEMBLY */}
        <motion.div
          animate={{
            rotate: isPowered && isPlaying ? 18 : -14,
          }}
          transition={{
            type: 'spring',
            stiffness: 40,
            damping: 10,
          }}
          style={{
            originX: 0.85,
            originY: 0.15,
          }}
          className="absolute top-2 right-4 w-[110px] h-[190px] pointer-events-none z-20"
        >
          {/* Tonearm base pivot */}
          <div className="absolute top-[10px] right-[10px] w-[28px] h-[28px] rounded-full bg-zinc-800 border-2 border-zinc-700 shadow-lg flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-zinc-950 border border-zinc-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
            </div>
            {/* Weight counterbalance */}
            <div className="absolute top-[-14px] right-[4px] w-[14px] h-[18px] bg-zinc-900 border border-zinc-700 rounded-sm"></div>
          </div>

          {/* Curved tonearm metal tube */}
          <svg className="absolute top-[24px] right-[20px] w-[95px] h-[160px] text-zinc-500" viewBox="0 0 100 160" fill="none">
            {/* Curved tonearm pathway */}
            <path
              d="M 85, 5 C 65, 45 45, 95 10, 155"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Cartridge/Stylus needle shell */}
          <div className="absolute bottom-[2px] left-[-4px] w-[14px] h-[26px] bg-zinc-900 border border-zinc-700 rounded-sm transform rotate-[25deg] shadow-lg">
            {/* Red tip stylus indicator */}
            <div className={`absolute bottom-[2px] right-[2px] w-[6px] h-1.5 rounded-sm transition-all duration-300 ${isPowered && isPlaying ? 'bg-primary shadow-led-orange' : 'bg-zinc-800'}`}></div>
          </div>
        </motion.div>
      </div>

      {/* ALBUM COVERS SELECTOR / STACK */}
      <div className="w-full mt-4 border-t border-hardware-border pt-4">
        <span className="text-[9px] text-zinc-500 font-tech font-bold uppercase tracking-wider mb-2 block">Project Archives / Select track</span>
        
        {/* Horizontal flex / layout matching stack picker */}
        <div className="flex gap-4 items-center justify-center overflow-x-auto py-2 px-1 select-none">
          {projects.map((project, idx) => {
            const isActive = activeProject.title === project.title;
            return (
              <motion.div
                key={idx}
                onClick={() => isPowered && setActiveProject(project)}
                whileHover={isPowered ? { scale: 1.05, y: -4 } : {}}
                whileTap={isPowered ? { scale: 0.98 } : {}}
                className={`cursor-pointer rounded-lg p-2 flex flex-col items-center justify-center border-2 transition-all duration-300 w-28 shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 border-primary shadow-led-orange'
                    : isPowered
                    ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                    : 'bg-zinc-950 border-zinc-900 opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Visual Album Cover Mockup */}
                <div
                  className={`w-20 h-20 rounded border mb-2 flex flex-col justify-between p-1.5 relative overflow-hidden transition-all duration-300 ${
                    idx === 0
                      ? 'bg-gradient-to-br from-zinc-800 to-primary/40'
                      : idx === 1
                      ? 'bg-gradient-to-br from-zinc-800 to-secondary/40'
                      : 'bg-gradient-to-br from-zinc-800 to-accent/40'
                  } ${isActive ? 'border-primary' : 'border-zinc-700'}`}
                >
                  <div className="text-[6px] text-zinc-400 font-tech">{project.volume}</div>
                  <div className="text-[8px] text-zinc-200 font-orbitron font-bold uppercase leading-none truncate max-w-full">
                    {project.title.split(' ')[0]}
                  </div>
                  <div className="text-[5px] text-zinc-400 font-mono text-right">SIDE A</div>
                  
                  {/* Decorative vinyl record peek out of the sleeve */}
                  <div className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900"></div>
                  </div>
                </div>

                <div className="text-[8px] text-zinc-300 font-orbitron tracking-tight truncate max-w-full uppercase font-bold text-center">
                  {project.title}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
