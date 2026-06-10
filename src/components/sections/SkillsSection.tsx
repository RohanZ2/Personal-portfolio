'use client';

import React from 'react';
import TerminalPanel from '../TerminalPanel';
import { MotionDiv } from '../motion';
import { skills } from '../../data/portfolio';

const SEGMENTS = 20;

export default function SkillsSection() {
  return (
    <TerminalPanel label="SYSTEM_DIAGNOSTICS" className="max-w-[760px]">
      <div className="space-y-8 pt-2">
        {skills.map((skill, skillIdx) => {
          const filled = Math.round((skill.level / 100) * SEGMENTS);
          return (
            <div key={skill.name}>
              <div className="flex justify-between items-baseline mb-2.5">
                <span className="text-[12px] tracking-widest text-phosphor/90 uppercase">{skill.name}</span>
                <span className="text-[10px] tracking-widest text-caution">
                  {skill.level}% — NOMINAL
                </span>
              </div>
              <div className="flex gap-[3px]">
                {Array.from({ length: SEGMENTS }).map((_, i) => (
                  <MotionDiv
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: skillIdx * 0.1 + i * 0.02 }}
                    className={`h-3.5 flex-1 ${
                      i < filled
                        ? i === filled - 1
                          ? 'bg-caution shadow-glow-yellow'
                          : 'bg-phosphor shadow-glow-green'
                        : 'bg-phosphor/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </TerminalPanel>
  );
}
