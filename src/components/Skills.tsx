'use client';

import { motion } from 'framer-motion';

const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'] },
  { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel'] },
  { category: 'Other', items: ['Framer Motion', 'REST APIs', 'GraphQL', 'Firebase'] },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
        >
          Skills & Technologies
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skillGroup, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-primary transition"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">{skillGroup.category}</h3>
              <ul className="space-y-2">
                {skillGroup.items.map((skill, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-gray-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
