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
  { name: 'React', level: 90, type: 'Frontend' },
  { name: 'Next.js', level: 95, type: 'Frontend' },
  { name: 'TypeScript', level: 85, type: 'Frontend' },
  { name: 'Tailwind CSS', level: 90, type: 'Frontend' },
  { name: 'Node.js', level: 88, type: 'Backend' },
  { name: 'Express', level: 85, type: 'Backend' },
  { name: 'MongoDB', level: 80, type: 'Backend' },
  { name: 'Docker', level: 75, type: 'Tools' },
  { name: 'AWS', level: 70, type: 'Tools' },
  { name: 'Framer Motion', level: 88, type: 'UI/Other' },
];

export default function ScreenDisplay({
  isPowered,
  activeTab,
  activeProject,
  onNavigateTab,
}: ScreenDisplayProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [sysTemp, setSysTemp] = useState(38);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderMsg, setSenderMsg] = useState('');
  const [transmitLogs, setTransmitLogs] = useState<string[]>([]);

  // Update clock and random temperature
  useEffect(() => {
    const updateStats = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
      setSysTemp((prev) => Math.min(45, Math.max(35, prev + (Math.random() * 2 - 1))));
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderMsg) return;

    setIsTransmitting(true);
    setTransmitLogs(['INITIATING TELEMETRY...', 'ESTABLISHING HANDSHAKE...', 'RESOLVING MX HOSTS...']);

    setTimeout(() => {
      setTransmitLogs((prev) => [...prev, 'HOST FOUND. SYNCING PACKETS...']);
    }, 800);

    setTimeout(() => {
      setTransmitLogs((prev) => [...prev, 'TRANSMISSION COMPLETE. ACK_OK.']);
      setIsTransmitting(false);
      setSenderName('');
      setSenderMsg('');
      alert('Transmission successful! Message received.');
    }, 2000);
  };

  return (
    <div className="flex-1 min-w-[320px] lg:max-w-[480px] h-[550px] crt-container bg-black rounded-xl p-3 border-4 border-zinc-800 shadow-inner relative flex flex-col justify-between overflow-hidden">
      {/* Outer monitor screen */}
      <div
        className={`w-full h-full rounded-lg bg-screen border border-zinc-900 overflow-hidden relative flex flex-col justify-between p-4 transition-all duration-700 ${
          isPowered ? 'opacity-100 crt-flicker shadow-crt-glow' : 'opacity-0 scale-95'
        }`}
      >
        {/* CRT Scanline overlay */}
        {isPowered && <div className="crt-scanline"></div>}

        <AnimatePresence mode="wait">
          {isPowered ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col justify-between font-mono text-xs text-primary"
            >
              {/* SCREEN HEADER */}
              <div className="flex justify-between items-center border-b border-primary/20 pb-2 mb-3 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="font-bold tracking-wider font-orbitron">SYSTEM_OS_v3.9</span>
                </div>
                <div className="flex gap-4 text-[10px] text-primary/60">
                  <span>TEMP: {sysTemp.toFixed(1)}°C</span>
                  <span>CLK: {currentTime}</span>
                </div>
              </div>

              {/* SCREEN BODY - DYNAMIC VIEWS */}
              <div className="flex-1 overflow-y-auto pr-1 select-text scrollbar-thin">
                {activeTab === 'about' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 border border-primary/30 p-2.5 rounded bg-primary/5">
                      <div className="w-12 h-12 rounded bg-zinc-800 border border-primary/40 flex items-center justify-center shrink-0">
                        {/* Hardware Silhouette Avatar */}
                        <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold font-orbitron text-zinc-100 uppercase">Rohan</div>
                        <div className="text-[10px] text-secondary">Creative Developer & Designer</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-led-green animate-pulse"></span>
                          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide">Ready for deployment</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-primary/10 pt-2 text-zinc-300">
                      <p className="leading-relaxed">
                        I am a full stack software engineer specializing in building immersive, rich digital experiences. Bridging high-fidelity design with robust backend telemetry.
                      </p>
                      <p className="leading-relaxed text-[11px] text-zinc-400">
                        My philosophy is built on technical excellence, rich visual micro-interactions, and modular architecture. Exploring the boundaries between code, sound, and interface.
                      </p>
                    </div>

                    <div className="border border-primary/20 p-2 bg-black/40 rounded flex justify-between text-[10px]">
                      <div>
                        <div className="text-primary/60 font-tech">SECTOR COORDINATES</div>
                        <div className="text-zinc-300">USA // EST</div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary/60 font-tech">TELEMETRY BANDWIDTH</div>
                        <div className="text-zinc-300">99.98% OK</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'projects' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] text-secondary font-tech uppercase tracking-wide">ACTIVE PROJECT</span>
                        <h3 className="text-sm font-bold font-orbitron text-zinc-100 uppercase">{activeProject.title}</h3>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 border border-primary/30 rounded bg-primary/10 text-primary font-orbitron">
                        {activeProject.volume}
                      </span>
                    </div>

                    <div className="p-3 border border-primary/20 bg-zinc-950/70 rounded space-y-2.5">
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        {activeProject.description}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] text-primary/60 font-bold uppercase font-tech">STACK DEPENDENCIES:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProject.tech.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 border border-secondary/30 text-secondary bg-secondary/5 rounded text-[9px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-primary/10 pt-3">
                      <div className="text-[10px] text-primary/60">
                        <div>TRACK SPECS:</div>
                        <div className="text-zinc-300">{activeProject.speed} RPM // SIDE A</div>
                      </div>
                      <a
                        href={activeProject.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-black rounded transition font-bold font-orbitron text-center block"
                      >
                        LAUNCH DEPLOYMENT
                      </a>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-secondary font-tech uppercase tracking-wide">Telemetry Diagnostics</span>
                      <span className="text-[10px] text-primary/60">10 Core Modules Found</span>
                    </div>

                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-zinc-200">{skill.name}</span>
                            <span className="text-secondary">{skill.level}% CAPACITY</span>
                          </div>
                          {/* Skeuomorphic diagnostic telemetry bar */}
                          <div className="h-2 border border-primary/20 bg-zinc-950 rounded overflow-hidden flex">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                            ></motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'contact' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[10px] text-secondary font-tech uppercase tracking-wide">COMMUNICATIONS PORTAL</span>
                      <h3 className="text-sm font-bold font-orbitron text-zinc-100 uppercase">ESTABLISH UPLINK</h3>
                    </div>

                    <form onSubmit={handleTransmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-primary/60 uppercase font-tech">SENDER SIGNATURE</label>
                        <input
                          type="text"
                          required
                          disabled={isTransmitting}
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="ENTER NAME..."
                          className="w-full bg-zinc-950 border border-primary/30 rounded px-2.5 py-1.5 focus:outline-none focus:border-primary text-zinc-100 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-primary/60 uppercase font-tech">MESSAGE TELEMETRY</label>
                        <textarea
                          required
                          rows={3}
                          disabled={isTransmitting}
                          value={senderMsg}
                          onChange={(e) => setSenderMsg(e.target.value)}
                          placeholder="ENTER TRANSMISSION DATA..."
                          className="w-full bg-zinc-950 border border-primary/30 rounded px-2.5 py-1.5 focus:outline-none focus:border-primary text-zinc-100 font-mono resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isTransmitting}
                        className={`w-full py-2 border rounded font-bold font-orbitron text-center select-none ${
                          isTransmitting
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'border-primary text-primary hover:bg-primary hover:text-black cursor-pointer'
                        }`}
                      >
                        {isTransmitting ? 'TRANSMITTING...' : 'TRANSMIT SIGNAL'}
                      </button>
                    </form>

                    {/* Telemetry logs on transmission */}
                    {transmitLogs.length > 0 && (
                      <div className="p-2 border border-primary/10 bg-zinc-950/80 rounded text-[9px] font-mono text-emerald-400 space-y-0.5">
                        {transmitLogs.map((log, idx) => (
                          <div key={idx} className="flex gap-1.5">
                            <span>&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* SCREEN FOOTER */}
              <div className="border-t border-primary/20 pt-2 mt-3 flex justify-between items-center text-[10px] text-primary/50 select-none uppercase tracking-wider font-tech">
                <span>SECTOR: 0x2E49</span>
                <div className="flex gap-1.5 items-center">
                  <span>SIGNAL:</span>
                  <div className="flex items-end gap-[1px] h-2">
                    <div className="w-[3px] h-[3px] bg-primary rounded-sm"></div>
                    <div className="w-[3px] h-[5px] bg-primary rounded-sm"></div>
                    <div className="w-[3px] h-[7px] bg-primary rounded-sm"></div>
                    <div className="w-[3px] h-[9px] bg-primary rounded-sm"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // CRT Monitor Off Screen (Faded CRT dot effect)
            <div className="w-full h-full flex items-center justify-center bg-black select-none">
              <div className="w-2 h-2 bg-zinc-700/30 rounded-full animate-ping"></div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
