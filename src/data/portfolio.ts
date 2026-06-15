export interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  volume: string;
}

export const projects: Project[] = [
  {
    title: 'Techno Logic',
    description: 'A stunning responsive web application built with React, Next.js, and styled using Tailwind CSS utilities. Integrated with full database telemetry.',
    tech: ['React', 'Tailwind CSS', 'Node.js'],
    link: 'https://github.com',
    volume: 'Vol. 01',
  },
  {
    title: 'Cyber Synth',
    description: 'Real-time collaborative audio sequencer and visualizer incorporating WebSockets, Framer Motion transitions, and state sync across nodes.',
    tech: ['Next.js', 'TypeScript', 'MongoDB'],
    link: 'https://github.com',
    volume: 'Vol. 02',
  },
  {
    title: 'Echo Chamber',
    description: 'Mobile-first e-commerce checkout telemetry platform with Stripe payment processor integration, Firebase authentication, and analytics.',
    tech: ['React Native', 'Firebase', 'Stripe'],
    link: 'https://github.com',
    volume: 'Vol. 03',
  },
];

export const skills = [
  { name: 'React', level: 90 },
  { name: 'Next.js', level: 95 },
  { name: 'TypeScript', level: 85 },
  { name: 'Tailwind CSS', level: 90 },
  { name: 'Node.js', level: 88 },
];

export const bio = [
  'I am a full stack software engineer specializing in building immersive, rich digital experiences. Bridging high-fidelity design with robust backend telemetry.',
  'My philosophy is built on technical excellence, rich visual micro-interactions, and modular architecture.',
];
