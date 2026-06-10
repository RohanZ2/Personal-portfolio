'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center, OrthographicCamera } from '@react-three/drei';
import Image from 'next/image';
import { MotionDiv } from './motion';
import { Project } from '../data/portfolio';

function VinylModel({ isPlaying, rpmMode }: { isPlaying: boolean, rpmMode: number }) {
  const { scene } = useGLTF('/vinyl_record.glb');
  const groupRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isPlaying) {
        const speed = rpmMode === 33 ? 1.8 : 2.5;
        groupRef.current.rotation.y -= speed * delta;
      } else {
        groupRef.current.rotation.y -= 0.1 * delta;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={50} rotation={[-Math.PI / 2, 0, 0]} />
      </Center>
    </group>
  );
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
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const requestRef = useRef<number | null>(null);
  const rpmTarget = isPlaying ? rpmMode : 0;

  const handleHoverProject = (project: Project) => {
    if (isPowered) setActiveProject(project);
  };

  useEffect(() => {
    if (!isPowered) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [isPowered, activeProject]);

  useEffect(() => {
    let lastTime = performance.now();

    const animateRpm = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setCurrentRpm((prev) => {
        if (Math.abs(prev - rpmTarget) < 0.1) return rpmTarget;
        const diff = rpmTarget - prev;
        const speedFactor = 2.5;
        return prev + diff * speedFactor * delta;
      });

      requestRef.current = requestAnimationFrame(animateRpm);
    };

    requestRef.current = requestAnimationFrame(animateRpm);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [rpmTarget]);

  return (
    <>
      {/* Game-style modal overlay */}
      <AnimatePresence>
        {modalProject && (
          <MotionDiv
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onTap={() => setModalProject(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md bg-black/70"
          >
            <MotionDiv
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 24, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{ position: 'relative' }}
              className="w-[500px] bg-bg-panel border border-phosphor/40 shadow-[0_0_80px_rgba(0,255,157,0.15)] p-8"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-phosphor" />

              <div className="text-[10px] text-magenta tracking-[0.3em] uppercase mb-3">
                {modalProject.volume} — SYSTEM RECORD
              </div>
              <h2 className="font-pixel text-[20px] text-phosphor text-glow uppercase leading-snug mb-4">
                {modalProject.title}
              </h2>
              <div className="w-full h-px bg-grid mb-6" />
              <p className="text-[12px] text-phosphor/70 leading-loose mb-6">
                {modalProject.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {modalProject.tech.map(t => (
                  <span key={t} className="text-[10px] bg-phosphor/10 border border-phosphor/30 text-phosphor px-3 py-1 tracking-widest uppercase">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={modalProject.link}
                  className="flex-1 text-center py-3 bg-phosphor text-bg font-bold uppercase tracking-widest hover:shadow-glow-green transition-shadow text-[12px]"
                >
                  LAUNCH SEQUENCE
                </a>
                <div
                  role="button"
                  onClick={() => setModalProject(null)}
                  className="px-6 py-3 border border-grid text-phosphor/50 hover:text-phosphor hover:border-phosphor/50 transition-colors uppercase tracking-widest text-[11px] cursor-pointer"
                >
                  CLOSE
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="relative w-full h-full min-h-[560px] flex items-center justify-center">

        {/* DECK_TELEMETRY readout */}
        <div className="absolute top-0 right-0 z-20 pointer-events-none">
          <div className="relative border border-grid bg-bg-panel px-5 py-3 flex flex-col items-center min-w-[120px]">
            <span className="absolute -top-[8px] left-3 px-2 bg-bg-panel text-[8px] tracking-[0.25em] text-phosphor/50 uppercase">
              DECK_TELEMETRY
            </span>
            <span className={`font-bold text-2xl leading-none italic ${isPowered && isPlaying ? 'text-magenta text-glow-magenta' : 'text-phosphor/20'}`}>
              {currentRpm.toFixed(1)}
            </span>
            <span className="text-[8px] text-phosphor/40 uppercase mt-2 tracking-widest">
              RPM // {isPowered && isPlaying ? 'PLAYING' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* ALBUM COVERS — record crate, stacked behind the disc */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-[5] pointer-events-auto"
          style={{ width: '360px', height: '560px', perspective: '1400px' }}
        >
          {projects.map((project, idx) => {
            const isActive = activeProject.title === project.title;
            const isHovered = hoveredIdx === idx;
            // Hovered card pops to the very front; otherwise natural stack order
            // (later cards sit above earlier ones so each spine peeks cleanly).
            const zIdx = isHovered ? 50 : (idx + 1);
            const restX = 30 + idx * 8;
            const outX = -120;
            return (
              <MotionDiv
                key={project.title}
                onTap={() => {
                  if (isPowered) {
                    setActiveProject(project);
                    setModalProject(project);
                  }
                }}
                onHoverStart={() => {
                  if (!isPowered) return;
                  setHoveredIdx(idx);
                  handleHoverProject(project);
                }}
                onHoverEnd={() => setHoveredIdx(null)}
                animate={{
                  x: isHovered ? outX : restX,
                  y: 40 + idx * 96,
                  rotateY: isHovered ? 14 : 0,
                  scale: isHovered ? 1.1 : 1,
                  opacity: isHovered ? 1 : (isActive ? 0.85 : 0.7),
                }}
                transition={{ type: 'tween', duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', zIndex: zIdx, cursor: isPowered ? 'pointer' : 'default', transformStyle: 'preserve-3d' }}
                className="group w-[300px] h-[300px] overflow-hidden shadow-2xl bg-bg-raised border border-grid"
              >
                {/* Colored left spine stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-[5px] ${isActive ? 'bg-phosphor' : 'bg-phosphor/20'} transition-colors duration-300`} />

                {/* Album art */}
                {project.image ? (
                  <div className="absolute inset-0">
                    <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-bg-raised via-bg-panel to-bg" />
                )}

                {/* Base dark overlay */}
                <div className="absolute inset-0 bg-black/25" />

                {/* Frosted glass HUD — slides up on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                  <div className="m-3 p-4 bg-phosphor/5 backdrop-blur-md border border-phosphor/15">
                    <div className="text-[9px] text-magenta tracking-[0.2em] uppercase mb-1">{project.volume}</div>
                    <div className="text-[15px] font-bold text-phosphor uppercase leading-tight mb-2.5 tracking-wider">{project.title}</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tech.slice(0, 2).map(t => (
                        <span key={t} className="text-[8px] bg-phosphor/10 border border-phosphor/20 text-phosphor/70 px-2 py-0.5 tracking-wide uppercase">{t}</span>
                      ))}
                    </div>
                    <div className="text-[9px] text-caution tracking-[0.15em] uppercase flex items-center gap-1.5">
                      CLICK TO OPEN <span>›</span>
                    </div>
                  </div>
                </div>

                {/* Spine volume label */}
                <div className="absolute left-3 top-5 z-10">
                  <span className="text-[9px] text-phosphor/40 tracking-widest uppercase">{project.volume}</span>
                </div>
              </MotionDiv>
            );
          })}
        </div>

        {/* PLATTER & VINYL — 750px geometry scaled to 0.75 to fit the panel */}
        <div className="relative z-10 ml-24" style={{ width: '562px', height: '562px' }}>
          <div
            className="absolute top-0 left-0 w-[750px] h-[750px]"
            style={{ transform: 'scale(0.75)', transformOrigin: 'top left' }}
          >
            {/* The vinyl disc */}
            <div
              className="w-full h-full rounded-full bg-bg relative flex items-center justify-center z-10 shadow-2xl border-4 border-bg-raised cursor-pointer"
              onClick={() => isPowered && setIsPlaying(!isPlaying)}
            >
              {/* 3D Canvas — orthographic top-down, no perspective distortion */}
              <div className="absolute inset-0 z-0 pointer-events-none rounded-full overflow-hidden">
                <Canvas
                  orthographic
                  style={{ width: '100%', height: '100%' }}
                >
                  <OrthographicCamera
                    makeDefault
                    position={[0, 100, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    zoom={50}
                    near={0.1}
                    far={1000}
                  />
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[0, 10, 5]} intensity={1.2} />
                    <spotLight position={[5, 10, 5]} intensity={0.8} penumbra={1} />
                    <VinylModel isPlaying={isPowered && isPlaying} rpmMode={rpmMode} />
                    <Environment preset="studio" />
                  </Suspense>
                </Canvas>
              </div>
            </div>

            {/* TONEARM — positioned relative to the 750×750 platter wrapper */}
            {/* The pivot is at the top-right of the arm (the base circle). */}
            {/* We use transform-origin to rotate around the base. */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                top: '-10px',
                right: '-30px',
                width: '200px',
                height: '500px',
                transformOrigin: 'calc(100% - 40px) 40px',
                transform: `rotate(${isPowered && isPlaying ? 25 : -8}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Base (pivot point) */}
              <div
                className="absolute bg-bg-panel rounded-full flex items-center justify-center border-4 border-grid shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                style={{ top: 0, right: 0, width: '80px', height: '80px' }}
              >
                <div className="w-[40px] h-[40px] rounded-full bg-bg border border-grid shadow-inner"></div>
              </div>

              {/* Arm — a straight bar from the base down to the cartridge */}
              <div
                className="absolute bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-full shadow-xl"
                style={{
                  top: '40px',
                  right: '36px',
                  width: '6px',
                  height: '420px',
                  transformOrigin: 'top center',
                }}
              ></div>

              {/* Cartridge / Head shell — at the end of the arm */}
              <div
                className="absolute bg-bg-raised rounded-b-md shadow-2xl border border-grid"
                style={{
                  top: '448px',
                  right: '25px',
                  width: '28px',
                  height: '50px',
                }}
              >
                {/* Stylus LED */}
                <div
                  className={`absolute w-[10px] h-[6px] ${isPowered && isPlaying ? 'bg-phosphor shadow-led-cyan' : 'bg-phosphor/10'
                    }`}
                  style={{ bottom: '4px', right: '8px' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
