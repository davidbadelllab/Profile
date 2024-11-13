'use client'

import { motion } from 'framer-motion'
import { FaLaravel, FaReact, FaVuejs, FaNodeJs } from 'react-icons/fa'
import { SiRemix } from 'react-icons/si'
import { TbBrandNextjs } from 'react-icons/tb'

const skills = [
  { 
    name: 'Laravel', 
    icon: FaLaravel,
    color: '#FF2D20',
    description: 'Framework PHP para backend robusto y escalable',
    level: 90,
  },
  { 
    name: 'React', 
    icon: FaReact,
    color: '#61DAFB',
    description: 'Biblioteca JavaScript para interfaces dinámicas',
    level: 95,
  },
  { 
    name: 'Next.js', 
    icon: TbBrandNextjs,
    color: '#000000',
    description: 'Framework React para aplicaciones web modernas',
    level: 85,
  },
  { 
    name: 'Remix', 
    icon: SiRemix,
    color: '#000000',
    description: 'Framework fullstack para web apps robustas',
    level: 80,
  },
  { 
    name: 'Vue.js', 
    icon: FaVuejs,
    color: '#4FC08D',
    description: 'Framework progresivo para UI dinámicas',
    level: 88,
  },
  { 
    name: 'Node.js', 
    icon: FaNodeJs,
    color: '#339933',
    description: 'Runtime de JavaScript para backend escalable',
    level: 92,
  },
]

export default function Skills() {
  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Mis Habilidades Técnicas
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Experiencia comprobada en tecnologías modernas de desarrollo web,
          especializándome en construcción de aplicaciones escalables y rendimiento optimizado.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="relative mb-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center justify-between">
                <skill.icon 
                  className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: skill.color }}
                />
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {skill.level}%
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {skill.description}
            </p>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-2.5 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${skill.color}, ${skill.color}dd)`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-600 dark:text-gray-300">
          Y muchas otras tecnologías y herramientas complementarias como 
          <span className="font-semibold"> TypeScript</span>,
          <span className="font-semibold"> Docker</span>,
          <span className="font-semibold"> Git</span>,
          <span className="font-semibold"> AWS</span>, y más.
        </p>
      </motion.div>
    </section>
  )
}