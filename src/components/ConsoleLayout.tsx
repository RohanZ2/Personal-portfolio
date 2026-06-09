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
    <div className="h-screen w-full pixel-bg flex flex-col justify-between p-4 md:p-8 overflow-hidden font-pixel text-zinc-300">

      {/* Header bar */}
      <div className="flex justify-between items-center w-full pb-4">
        <div className="flex items-center gap-4">
          <span className="text-[12px] md:text-[16px] text-primary tracking-widest uppercase p-2 bg-[#141416]/50 rounded-md">PRTF-V3.SKY // PIXEL DECK</span>
          <div className="flex gap-2">
            <span className={`w-3 h-3 ${isPowered ? 'bg-primary shadow-led-orange animate-pulse' : 'bg-zinc-800'}`}></span>
            <span className={`w-3 h-3 ${isPowered ? 'bg-secondary shadow-led-amber animate-pulse' : 'bg-zinc-800'}`}></span>
          </div>
        </div>
        <div className="text-[10px] md:text-[12px] text-zinc-500 tracking-wider hidden md:block">
          8-BIT ANALOG FILTERED // STEREO UPLINK [OK]
        </div>
      </div>

      {/* Free Hardware Desktop Layout */}
      <div className="flex-1 w-full relative h-full min-h-0 flex items-center">

        {/* Left Side: Scattered Hardware (Screen & Controls) */}
        <div className="flex flex-col justify-center gap-12 z-30 w-full md:w-1/2 h-full pl-4 md:pl-12 pt-10">
          {/* CRT Screen Display */}
          <div className="w-full max-w-[550px] h-[500px] transform md:-rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl">
            <ScreenDisplay
              isPowered={isPowered}
              activeTab={activeTab}
              activeProject={activeProject}
              onNavigateTab={handleNavigateTab}
            />
          </div>

          {/* Control Panel */}
          <div className="w-[280px] md:ml-12 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
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
        </div>

        {/* Right Side: Massive Turntable */}
        <div className="absolute right-[-10%] md:right-[-5%] lg:right-0 top-1/2 transform -translate-y-1/2 z-10 w-[700px] md:w-[900px] lg:w-[1000px] h-full flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full h-full flex items-center justify-center">
            <TurntableDeck
              isPowered={isPowered}
              activeProject={activeProject}
              setActiveProject={handleSelectProject}
              projects={projects}
              rpmMode={rpmMode}
            />
          </div>
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
