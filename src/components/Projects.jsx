'use client';

import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Project One',
    description: 'A stunning web application built with React and Tailwind CSS',
    tech: ['React', 'Tailwind CSS', 'Node.js'],
    link: '#',
  },
  {
    title: 'Project Two',
    description: 'Real-time collaboration tool with WebSocket integration',
    tech: ['Next.js', 'TypeScript', 'MongoDB'],
    link: '#',
  },
  {
    title: 'Project Three',
    description: 'Mobile-first e-commerce platform with payment integration',
    tech: ['React Native', 'Firebase', 'Stripe'],
    link: '#',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          Featured Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-primary transition"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-40"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <motion.a
                  href={project.link}
                  whileHover={{ x: 5 }}
                  className="text-primary hover:text-secondary transition inline-flex items-center gap-2"
                >
                  View Project →
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
