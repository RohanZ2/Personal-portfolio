'use client';

import React from 'react';
import TerminalPanel from '../TerminalPanel';
import { MotionDiv } from '../motion';
import { bio, bootLog, skills } from '../../data/portfolio';

export default function AboutSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1100px]">
      <TerminalPanel label="SYSTEM_BIOGRAPHY" className="lg:col-span-2">
        <div className="mb-8">
          <h1 className="font-pixel text-2xl text-phosphor text-glow mb-4">ROHAN</h1>
          <div className="text-caution text-[10px] tracking-[0.3em] uppercase mb-3">
            Developer &amp; Designer
          </div>
          <div className="inline-flex items-center gap-2 border border-grid px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-phosphor animate-pulse"></span>
            <span className="text-[9px] tracking-widest text-phosphor">READY</span>
          </div>
        </div>
        <div className="space-y-4 text-[13px] leading-relaxed text-phosphor/80">
          {bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </TerminalPanel>

      <div className="flex flex-col gap-6">
        <TerminalPanel label="TECH_STACK">
          <ul className="space-y-2.5">
            {skills.map((skill) => (
              <li key={skill.name} className="text-[12px] text-phosphor/70 hover:text-phosphor transition-colors">
                <span className="text-phosphor/40 mr-2">&gt;</span>
                {skill.name}
              </li>
            ))}
          </ul>
        </TerminalPanel>

        <TerminalPanel label="TERMINAL_LOG">
          <div className="space-y-1.5">
            {bootLog.map((line, i) => (
              <MotionDiv
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`text-[10px] leading-relaxed ${
                  line.includes('WARNING') ? 'text-caution/70' : 'text-phosphor/50'
                }`}
              >
                {line}
              </MotionDiv>
            ))}
          </div>
        </TerminalPanel>
      </div>
    </div>
  );
}
