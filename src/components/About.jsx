'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
        >
          About Me
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 space-y-4"
        >
          <p className="text-lg text-gray-300 leading-relaxed">
            Welcome to my portfolio! I'm a passionate developer with expertise in building
            modern web applications. With a strong foundation in React, Node.js, and cloud
            technologies, I create scalable and user-friendly solutions.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            I love working with cutting-edge technologies and constantly pushing the
            boundaries of what's possible on the web. Whether it's frontend design or
            backend architecture, I'm committed to delivering high-quality code and
            exceptional user experiences.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            When I'm not coding, you can find me exploring new technologies, contributing
            to open-source projects, or sharing knowledge with the developer community.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
