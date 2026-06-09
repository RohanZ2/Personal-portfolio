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

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectProject = (project: typeof projects[0]) => {
    setActiveProject(project);
    setActiveTab('projects');
    setRpmMode(project.speed);
  };

  return (
    <div className="min-h-screen w-full pixel-bg flex flex-col justify-between p-4 md:p-8 overflow-x-hidden font-pixel text-zinc-300">
      
      {/* Header bar */}
      <div className="flex justify-between items-center w-full pb-4">
        <div className="flex items-center gap-4">
          <span className="text-[12px] md:text-[16px] text-primary tracking-widest uppercase pixel-border p-2 bg-[#0d0d12]">PRTF-V3.SKY // PIXEL DECK</span>
          <div className="flex gap-2">
            <span className={`w-3 h-3 ${isPowered ? 'bg-primary shadow-led-orange animate-pulse' : 'bg-zinc-800'}`}></span>
            <span className={`w-3 h-3 ${isPowered ? 'bg-secondary shadow-led-amber animate-pulse' : 'bg-zinc-800'}`}></span>
          </div>
        </div>
        <div className="text-[10px] md:text-[12px] text-zinc-500 tracking-wider hidden md:block">
          8-BIT ANALOG FILTERED // STEREO UPLINK [OK]
        </div>
      </div>

      {/* Spaced-out Main Layout */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-items-center">
        
        {/* Module 1: Controls (Left Panel) - Spans 2 cols */}
        <div className="w-full lg:col-span-2 h-full flex items-center justify-start max-w-[200px]">
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
        </div>

        {/* Module 2: Screen (Center Display) - Spans 5 cols */}
        <div className="w-full lg:col-span-5 h-full flex items-center justify-center max-w-[600px]">
          <ScreenDisplay
            isPowered={isPowered}
            activeTab={activeTab}
            activeProject={activeProject}
            onNavigateTab={handleNavigateTab}
          />
        </div>

        {/* Module 3: Turntable (Right Panel) - Spans 5 cols */}
        <div className="w-full lg:col-span-5 h-full flex items-center justify-end max-w-[700px]">
          <TurntableDeck
            isPowered={isPowered}
            activeProject={activeProject}
            setActiveProject={handleSelectProject}
            projects={projects}
            rpmMode={rpmMode}
          />
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex justify-between items-center text-[10px] md:text-[12px] text-zinc-600 pt-4 w-full">
        <span className="hidden md:inline">SYSTEM CALIBRATION REF: PRTF-4096 // MADE BY ROHAN</span>
        <span>PRESS START TO CONTINUE</span>
      </div>
    </div>
  );
}
