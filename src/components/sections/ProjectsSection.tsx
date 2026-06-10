'use client';

import React from 'react';
import TurntableDeck from '../TurntableDeck';
import { Project } from '../../data/portfolio';

interface ProjectsSectionProps {
  isPowered: boolean;
  activeProject: Project;
  setActiveProject: (p: Project) => void;
  projects: Project[];
  rpmMode: number;
}

export default function ProjectsSection({
  isPowered,
  activeProject,
  setActiveProject,
  projects,
  rpmMode,
}: ProjectsSectionProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header strip */}
      <div className="flex items-center justify-between border border-grid bg-bg-panel px-5 py-3 mb-4">
        <span className="text-[10px] tracking-[0.25em] text-phosphor/50 uppercase">
          PROJECT_ARCHIVE // SELECT A RECORD FROM THE CRATE
        </span>
        <span className="text-[10px] tracking-[0.2em] text-magenta uppercase hidden sm:inline">
          {activeProject.volume} — {activeProject.title}
        </span>
      </div>

      {/* Turntable centerpiece */}
      <div className="relative flex-1 min-h-0">
        <TurntableDeck
          isPowered={isPowered}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
          projects={projects}
          rpmMode={rpmMode}
        />
      </div>
    </div>
  );
}
