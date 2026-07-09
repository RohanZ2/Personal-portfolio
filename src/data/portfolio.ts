export interface Project {
  title: string;
  description: string;
  tech: string[];
  /** Source / repo link (the SOURCE button). */
  link: string;
  /** Live or demo target (the LIVE/DEMO button). Omit if there isn't one. */
  liveLink?: string;
  status: 'DEPLOYED' | 'DEMO';
  /** Sequential build label shown on the card, e.g. "SPEC-01". */
  spec: string;
  /** Thumbnail path under /public, e.g. "/projects/sliceiq.png". A styled
   *  placeholder is shown when this is omitted. */
  image?: string;
}


export const projects: Project[] = [
  {
    title: 'SliceIQ',
    description: 'TODO: short description of SliceIQ.',
    tech: ['TODO'],
    link: 'https://github.com/RohanZ2/SliceIQ',
    status: 'DEMO',
    spec: 'SPEC-01',
    // image: '/projects/sliceiq.png',
  },
  {
    title: 'Personal Portfolio',
    description: 'TODO: short description of this 3D portfolio.',
    tech: ['Next.js', 'React Three Fiber', 'TypeScript'],
    link: 'https://github.com/RohanZ2/Personal-portfolio',
    status: 'DEMO',
    spec: 'SPEC-02',
    // image: '/projects/portfolio.png',
  },
  {
    title: 'Steam-IC',
    description: 'TODO: short description of Steam-IC.',
    tech: ['TODO'],
    link: 'https://github.com/RohanZ2/Steam-IC',
    status: 'DEMO',
    spec: 'SPEC-03',
    // image: '/projects/steam-ic.png',
  },
  {
    title: 'Platform Game',
    description: 'TODO: short description of the platform game.',
    tech: ['TODO'],
    link: 'https://github.com/RohanZ2/Platform-Game',
    status: 'DEMO',
    spec: 'SPEC-04',
    // image: '/projects/platform-game.png',
  },
  {
    title: 'MoveMaster',
    description: 'TODO: short description of MoveMaster.',
    tech: ['Python', 'OpenCV', 'React'],
    link: 'https://github.com/IshaanD-RX6600/Move-Master',
    liveLink: 'https://www.youtube.com/watch?v=S022Pv9t8z4',
    status: 'DEMO',
    spec: 'SPEC-05',
    // image: '/projects/movemaster.png',
  },
  {
    title: 'FormFlux',
    description: 'TODO: short description of FormFlux.',
    tech: ['React', 'Node.js', 'ML'],
    link: 'https://github.com/DhairyaS450/formflux',
    liveLink: 'https://formfluxwork.vercel.app/',
    status: 'DEPLOYED',
    spec: 'SPEC-06',
    // image: '/projects/formflux.png',
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
  "Hey, I'm Rohan, a grade 12 student in Kitchener, Ontario, and I like building things. I got hooked the first time a project I made with a friend actually worked, and I've been chasing that feeling ever since. Through web apps, games, and whatever a hackathon weekend can produce.",
  "Right now, most of my building happens at hackathons and on late-night side projects, like the 3D retro room you're looking at. I work mostly with JavaScript, React, and Next.js, and I gravitate toward projects you can actually see and click, where the code turns into something real in front of you.",
  "When I'm not at a keyboard, I'm probably at the pool. I'm a certified National Lifeguard and swim instructor at Forest Heights Pool, and teaching turned out to be my other favourite thing to do, I've taught kids to swim, helped kids write their first lines of code at an OpenText coding event, and volunteered at Hack the North two years in a row. Watching someone go from confused to confident never gets old, in the water or in an editor.",
  "Outside of all that, you'll find me playing basketball, biking around the city, or digging for new music, some of which ends up on the vinyl player sitting on this desk.",
];

export interface Contact {
  /** Channel label shown on the card, e.g. "EMAIL". */
  label: string;
  /** The handle / address displayed under the label. */
  value: string;
  /** Where the card links to (mailto:, https://, /resume.pdf). */
  href: string;
  /** Sequential label shown on the card, e.g. "CH-01". */
  spec: string;
}

// Contact channels for the bottom-left screen.
export const contacts: Contact[] = [
  {
    label: 'EMAIL',
    value: 'rohantewari2009@gmail.com',
    href: 'mailto:rohantewari2009@gmail.com',
    spec: 'CH-01',
  },
  {
    label: 'GITHUB',
    value: 'github.com/RohanZ2',
    href: 'https://github.com/RohanZ2',
    spec: 'CH-02',
  },
  {
    label: 'LINKEDIN',
    value: 'linkedin.com/in/rohan-tewari',
    href: 'https://www.linkedin.com/in/rohan-tewari-a80b29370/',
    spec: 'CH-03',
  },
  {
    label: 'RESUME',
    value: 'Download CV (PDF)',
    href: '/Rohan_Tewari_Resume.pdf',
    spec: 'CH-04',
  },
];
