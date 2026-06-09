'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  volume: string;
  speed: number;
}

interface ScreenDisplayProps {
  isPowered: boolean;
  activeTab: string;
  activeProject: Project;
  onNavigateTab: (tab: string) => void;
}

const skills = [
  { name: 'React', level: 90 },
  { name: 'Next.js', level: 95 },
  { name: 'TypeScript', level: 85 },
  { name: 'Tailwind CSS', level: 90 },
  { name: 'Node.js', level: 88 },
];

export default function ScreenDisplay({
  isPowered,
  activeTab,
  activeProject,
}: ScreenDisplayProps) {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const updateStats = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full min-h-[500px] pixel-border bg-[#08080c] p-4 flex flex-col justify-between relative shadow-2xl">
      {/* CRT Screen Outer Bezel */}
      <div className={`w-full h-full pixel-border bg-[#050508] p-6 relative overflow-hidden transition-all duration-700 ${isPowered ? 'opacity-100 crt-flicker shadow-crt-glow' : 'opacity-0 scale-95'}`}>
        
        {isPowered && <div className="crt-scanline"></div>}

        <AnimatePresence mode="wait">
          {isPowered ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-between text-[10px] md:text-[12px] text-primary"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center border-b-4 border-primary pb-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-primary animate-pulse pixel-border"></div>
                  <span className="uppercase">SYS_OS_v8.0</span>
                </div>
                <div>{currentTime}</div>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin">
                {activeTab === 'about' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="flex items-center gap-6 p-4 pixel-border bg-[#1a1a24]">
                      <div className="w-20 h-20 bg-zinc-900 pixel-border flex items-center justify-center">
                        <span className="text-4xl text-primary">R</span>
                      </div>
                      <div>
                        <div className="text-sm md:text-base text-zinc-100 uppercase mb-2">Rohan</div>
                        <div className="text-secondary mb-2">Developer & Designer</div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 animate-pulse"></span>
                          <span className="text-emerald-400">READY</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-zinc-300 leading-loose">
                      <p className="mb-4">
                        I am a full stack software engineer specializing in building immersive, rich digital experiences. Bridging high-fidelity design with robust backend telemetry.
                      </p>
                      <p>
                        My philosophy is built on technical excellence, rich visual micro-interactions, and modular architecture.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'projects' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-secondary uppercase">ACTIVE PROJECT</span>
                        <h3 className="text-base text-zinc-100 uppercase mt-2">{activeProject.title}</h3>
                      </div>
                      <span className="px-3 py-1 pixel-border bg-primary text-black">
                        {activeProject.volume}
                      </span>
                    </div>
                    <div className="p-4 pixel-border bg-[#1a1a24] text-zinc-300 leading-loose">
                      <p className="mb-6">{activeProject.description}</p>
                      <div className="text-primary mb-4">STACK:</div>
                      <div className="flex flex-wrap gap-4">
                        {activeProject.tech.map((t, idx) => (
                          <span key={idx} className="px-2 py-1 pixel-border bg-[#0d0d12] text-secondary">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a href={activeProject.link} className="block w-full text-center py-4 pixel-btn bg-primary text-black hover:bg-white mt-8 uppercase">
                      LAUNCH DEPLOYMENT
                    </a>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="text-secondary uppercase mb-8">Telemetry Diagnostics</div>
                    <div className="space-y-6">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-zinc-200">{skill.name}</span>
                            <span className="text-secondary">{skill.level}%</span>
                          </div>
                          <div className="h-6 pixel-border bg-[#0d0d12] flex p-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="h-full bg-primary"
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'contact' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div>
                      <span className="text-secondary uppercase">COMMUNICATIONS PORTAL</span>
                      <h3 className="text-base text-zinc-100 uppercase mt-4">ESTABLISH UPLINK</h3>
                    </div>
                    <div className="space-y-6">
                      <input type="text" placeholder="NAME..." className="w-full bg-[#1a1a24] pixel-border p-4 text-zinc-100 focus:outline-none focus:border-primary" />
                      <textarea rows={4} placeholder="DATA..." className="w-full bg-[#1a1a24] pixel-border p-4 text-zinc-100 focus:outline-none focus:border-primary"></textarea>
                      <button className="w-full py-4 pixel-btn bg-primary text-black hover:bg-white uppercase">
                        TRANSMIT SIGNAL
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="w-4 h-4 bg-zinc-700 animate-ping pixel-border"></div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
