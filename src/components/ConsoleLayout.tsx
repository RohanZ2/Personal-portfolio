'use client';

import React, { useState, useEffect } from 'react';
import ControlPanel from './ControlPanel';
import ScreenDisplay from './ScreenDisplay';
import TurntableDeck from './TurntableDeck';

const projects = [
  {
    title: 'Techno Logic',
    description: 'A stunning responsive web application built with React, Next.js, and styled using Tailwind CSS utilities. Integrated with full database telemetry.',
    tech: ['React', 'Tailwind CSS', 'Node.js'],
    link: 'https://github.com',
    volume: 'Vol. 01',
    speed: 33,
  },
  {
    title: 'Cyber Synth',
    description: 'Real-time collaborative audio sequencer and visualizer incorporating WebSockets, Framer Motion transitions, and state sync across nodes.',
    tech: ['Next.js', 'TypeScript', 'MongoDB'],
    link: 'https://github.com',
    volume: 'Vol. 02',
    speed: 45,
  },
  {
    title: 'Echo Chamber',
    description: 'Mobile-first e-commerce checkout telemetry platform with Stripe payment processor integration, Firebase authentication, and analytics.',
    tech: ['React Native', 'Firebase', 'Stripe'],
    link: 'https://github.com',
    volume: 'Vol. 03',
    speed: 78,
  },
];

export default function ConsoleLayout() {
  const [isPowered, setIsPowered] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [volume, setVolume] = useState(15);
  const [rpmMode, setRpmMode] = useState(33);
  const [activeProject, setActiveProject] = useState(projects[0]);

  // Sync active project speed with rpmMode
  useEffect(() => {
    if (activeTab === 'projects') {
      setRpmMode(activeProject.speed);
    }
  }, [activeProject, activeTab]);

  // Handle manual navigation and ensure page dial is sync'd
  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectProject = (project: typeof projects[0]) => {
    setActiveProject(project);
    setActiveTab('projects');
    setRpmMode(project.speed);
  };

  return (
    <div className="min-h-screen w-full bg-[#070709] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Outer physical console casing with hardware bevel, metallic hex screws, and labels */}
      <div className="w-full max-w-6xl bg-[#0d0d0f] border-[6px] border-[#1d1d23] rounded-2xl p-4 md:p-6 shadow-2xl relative flex flex-col justify-between space-y-6 select-none border-double">
        
        {/* Physical hardware details: metallic corner screws */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-zinc-700 border border-zinc-900 shadow flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-zinc-900 transform rotate-45"></div>
        </div>
        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-zinc-700 border border-zinc-900 shadow flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-zinc-900 transform -rotate-45"></div>
        </div>
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full bg-zinc-700 border border-zinc-900 shadow flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-zinc-900 transform -rotate-45"></div>
        </div>
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-zinc-700 border border-zinc-900 shadow flex items-center justify-center">
          <div className="w-1.5 h-0.5 bg-zinc-900 transform rotate-45"></div>
        </div>

        {/* Deck Branding / Tech Decals */}
        <div className="flex justify-between items-center w-full border-b border-[#22222a] pb-3 px-1">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-orbitron font-black text-primary tracking-widest uppercase">PRTF-V3.SKY // CONSOLE DECK</span>
            <div className="flex gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-primary shadow-led-orange animate-pulse' : 'bg-zinc-800'}`}></span>
              <span className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-secondary shadow-led-amber animate-pulse' : 'bg-zinc-800'}`}></span>
            </div>
          </div>
          <div className="text-[9px] font-tech text-zinc-500 tracking-wider">
            ANALOG FILTERED // STEREO UPLINK [OK]
          </div>
        </div>

        {/* Console layout elements - responsive grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 items-stretch justify-center h-full">
          
          {/* Module 1: Controls (Left Panel) */}
          <ControlPanel
            isPowered={isPowered}
            setIsPowered={setIsPowered}
            activeTab={activeTab}
            setActiveTab={handleNavigateTab}
            volume={volume}
            setVolume={setVolume}
            rpmMode={rpmMode}
            setRpmMode={setRpmMode}
          />

          {/* Module 2: Screen (Center Card) */}
          <ScreenDisplay
            isPowered={isPowered}
            activeTab={activeTab}
            activeProject={activeProject}
            onNavigateTab={handleNavigateTab}
          />

          {/* Module 3: Turntable (Right Panel) */}
          <TurntableDeck
            isPowered={isPowered}
            activeProject={activeProject}
            setActiveProject={handleSelectProject}
            projects={projects}
            rpmMode={rpmMode}
          />
        </div>

        {/* Decal footer markings */}
        <div className="flex justify-between items-center text-[8px] font-tech text-zinc-600 px-1 border-t border-[#22222a] pt-3">
          <span>HIGH TEMPERATURE HAZARD // DISCONNECT VOLTAGE BEFORE SERVICING</span>
          <span>SYSTEM CALIBRATION REF: PRTF-4096 // MADE BY ROHAN</span>
        </div>
      </div>
    </div>
  );
}
