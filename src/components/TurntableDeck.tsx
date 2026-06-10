'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, type MotionProps } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Center, OrthographicCamera } from '@react-three/drei';
import Image from 'next/image';

// framer-motion v10 types break under @types/react v19 — cast to recover HTML attrs
const MotionDiv = motion.div as unknown as React.ComponentType<
  MotionProps & React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }
>;

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  volume: string;
  speed: number;
  image?: string;
}

function VinylModel({ isPlaying, rpmMode }: { isPlaying: boolean, rpmMode: number }) {
  const { scene } = useGLTF('/vinyl_record.glb');
  const groupRef = useRef<any>();

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
              className="w-[500px] bg-[#0c0c10] border border-primary/40 shadow-[0_0_80px_rgba(255,120,0,0.15)] p-8"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

              <div className="text-[10px] text-primary tracking-[0.3em] uppercase mb-3">
                {modalProject.volume} — SYSTEM RECORD
              </div>
              <h2 className="text-[32px] font-black text-white uppercase leading-none mb-4">
                {modalProject.title}
              </h2>
              <div className="w-full h-px bg-zinc-800 mb-6" />
              <p className="text-[12px] text-zinc-300 leading-loose mb-6">
                {modalProject.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {modalProject.tech.map(t => (
                  <span key={t} className="text-[10px] bg-primary/10 border border-primary/30 text-primary px-3 py-1 tracking-widest uppercase">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={modalProject.link}
                  className="flex-1 text-center py-3 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-colors text-[12px]"
                >
                  LAUNCH SEQUENCE
                </a>
                <div
                  role="button"
                  onClick={() => setModalProject(null)}
                  className="px-6 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors uppercase tracking-widest text-[11px] cursor-pointer"
                >
                  CLOSE
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1000px] h-full min-h-[800px] flex flex-col justify-center relative">

        {/* Top section: Speed sensor */}
        <div className="absolute top-0 right-0 flex justify-end items-center w-full mb-8 z-20 pointer-events-none">
          <div className="flex gap-4 items-center">
            <div className="flex flex-col text-[10px] text-zinc-500 text-right">
              <span>VELOCITY VECTOR</span>
              <span className={isPowered && isPlaying ? 'text-emerald-500' : 'text-zinc-600'}>
                {isPowered && isPlaying ? 'PLAYING' : 'STANDBY'}
              </span>
            </div>
            <div className="bg-[#111] px-6 py-4 flex flex-col items-center justify-center min-w-[120px] rounded-xl border border-zinc-800">
              <span className={`font-black text-2xl leading-none italic ${isPowered && isPlaying ? 'text-red-500 text-shadow-sm' : 'text-zinc-800'}`}>
                {currentRpm.toFixed(1)}
              </span>
              <span className="text-[8px] text-zinc-500 uppercase mt-2">RPM / ANALOG FEED</span>
            </div>
          </div>
        </div>

        {/* Center section: Platter & Album Covers Behind */}
        <div className="flex-1 w-full relative flex items-center justify-center z-10 mt-16">

          {/* ALBUM COVERS — record crate style, stacked behind the disc */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 z-[5] pointer-events-auto"
            style={{ width: '500px', height: '800px', perspective: '1400px' }}
          >
            {projects.map((project, idx) => {
              const isActive = activeProject.title === project.title;
              const zIdx = isActive ? 10 : (idx + 1);
              const restX = 60 + idx * 10;
              const outX = -185;
              return (
                <MotionDiv
                  key={project.title}
                  onTap={() => {
                    if (isPowered) {
                      setActiveProject(project);
                      setModalProject(project);
                    }
                  }}
                  onHoverStart={() => handleHoverProject(project)}
                  animate={{
                    x: restX,
                    y: 80 + idx * 130,
                    scale: 1,
                    opacity: isActive ? 1 : 0.75,
                    rotateY: 0,
                  }}
                  whileHover={{ x: outX, rotateY: 14, scale: 1.12, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  style={{ position: 'absolute', zIndex: zIdx, cursor: isPowered ? 'pointer' : 'default', transformStyle: 'preserve-3d' }}
                  className="group w-[460px] h-[460px] overflow-hidden shadow-2xl bg-[#0d0d12]"
                >
                  {/* Colored left spine stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[6px] ${isActive ? 'bg-primary' : 'bg-zinc-700'} transition-colors duration-300`} />

                  {/* Album art */}
                  {project.image ? (
                    <div className="absolute inset-0">
                      <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#0d0d12] to-[#0a0a0f]" />
                  )}

                  {/* Base dark overlay */}
                  <div className="absolute inset-0 bg-black/25" />

                  {/* Frosted glass HUD — slides up on hover */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <div className="m-4 p-5 bg-white/5 backdrop-blur-md border border-white/10">
                      <div className="text-[10px] text-primary tracking-[0.2em] uppercase mb-1">{project.volume}</div>
                      <div className="text-[20px] font-black text-white uppercase leading-tight mb-3">{project.title}</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.slice(0, 2).map(t => (
                          <span key={t} className="text-[9px] bg-white/10 border border-white/10 text-zinc-300 px-2 py-1 tracking-wide uppercase">{t}</span>
                        ))}
                      </div>
                      <div className="text-[10px] text-primary tracking-[0.15em] uppercase flex items-center gap-2">
                        CLICK TO OPEN <span>›</span>
                      </div>
                    </div>
                  </div>

                  {/* Spine volume label */}
                  <div className="absolute left-3 top-6 z-10">
                    <span className="text-[10px] text-zinc-500 tracking-widest uppercase">{project.volume}</span>
                  </div>
                </MotionDiv>
              );
            })}
          </div>

          {/* PLATTER & VINYL (Foreground) - Massive Size */}
          <div className="relative w-[750px] h-[750px] z-10">
            {/* The vinyl disc */}
            <div
              className="w-full h-full rounded-full bg-[#050508] relative flex items-center justify-center z-10 shadow-2xl border-4 border-zinc-900 cursor-pointer"
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
                className="absolute bg-[#111] rounded-full flex items-center justify-center border-4 border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                style={{ top: 0, right: 0, width: '80px', height: '80px' }}
              >
                <div className="w-[40px] h-[40px] rounded-full bg-[#0a0a0c] border border-zinc-700 shadow-inner"></div>
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
                className="absolute bg-[#1a1a24] rounded-b-md shadow-2xl border border-zinc-600"
                style={{
                  top: '448px',
                  right: '25px',
                  width: '28px',
                  height: '50px',
                }}
              >
                {/* Stylus LED */}
                <div
                  className={`absolute w-[10px] h-[6px] ${isPowered && isPlaying ? 'bg-primary shadow-led-cyan' : 'bg-zinc-800'
                    }`}
                  style={{ bottom: '4px', right: '8px' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Connect */}
        <div className="absolute bottom-0 right-0 flex flex-col items-center gap-4 z-20">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">CONNECT</span>
          <a href="#" className="w-12 h-12 rounded-xl bg-[#111] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.203 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
          <a href="#" className="w-12 h-12 rounded-xl bg-[#111] border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
        </div>
      </div>
    </>
  );
}
