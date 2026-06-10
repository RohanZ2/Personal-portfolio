'use client';

import React, { useState, useEffect } from 'react';
import TopStatusBar from './TopStatusBar';
import BottomStatusBar from './BottomStatusBar';
import MixerSidebar from './MixerSidebar';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import { MotionDiv } from './motion';
import { projects, Project } from '../data/portfolio';

export default function TerminalDashboard() {
  const [isPowered, setIsPowered] = useState(true);
  const [activeChannel, setActiveChannel] = useState('about');
  const [volume, setVolume] = useState(15);
  const [rpmMode, setRpmMode] = useState(33);
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  // Sync active project speed with rpmMode
  useEffect(() => {
    if (activeChannel === 'projects') {
      setRpmMode(activeProject.speed);
    }
  }, [activeProject, activeChannel]);

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
    setRpmMode(project.speed);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-bg font-mono text-phosphor overflow-hidden relative">
      {/* Subtle CRT scanline overlay */}
      <div className="scanlines fixed inset-0 z-[300] pointer-events-none opacity-40"></div>

      <TopStatusBar isPowered={isPowered} />

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <MixerSidebar
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          isPowered={isPowered}
          setIsPowered={setIsPowered}
          volume={volume}
          setVolume={setVolume}
        />

        <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-10">
          <MotionDiv
            key={activeChannel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="h-full"
          >
            {activeChannel === 'about' && <AboutSection />}
            {activeChannel === 'projects' && (
              <ProjectsSection
                isPowered={isPowered}
                activeProject={activeProject}
                setActiveProject={handleSelectProject}
                projects={projects}
                rpmMode={rpmMode}
              />
            )}
            {activeChannel === 'skills' && <SkillsSection />}
            {activeChannel === 'contact' && <ContactSection />}
          </MotionDiv>
        </main>
      </div>

      <BottomStatusBar isPowered={isPowered} />
    </div>
  );
}
