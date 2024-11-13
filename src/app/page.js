'use client'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Image from 'next/image'

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const fadeInDelayed = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-all duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="relative mb-32 pt-20">
          <motion.div 
            className="absolute top-0 right-0 -z-10 w-72 h-72 bg-blue-100 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.2, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeIn}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
                Transformando Ideas en Experiencias Digitales
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Desarrollador Full Stack especializado en crear soluciones web innovadoras 
                que combinan diseño intuitivo con tecnología de vanguardia.
              </p>
            </motion.div>

            <motion.div 
              {...fadeInDelayed}
              className="relative hidden lg:block"
            >
             <div className="relative h-[500px] w-full">
              <Image
                src="/img/developer-illustration.png"
                alt="Developer Illustration"
                layout="fill"
                objectFit="contain"  // Cambiado de 'object-contain' a 'objectFit="contain"' para cumplir con las props de Next.js
              />
            </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <motion.section 
          className="mb-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-blue-600">5+</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Años de Experiencia</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-blue-600">50+</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Proyectos Completados</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-blue-600">50+</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Clientes Satisfechos</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <h3 className="text-4xl font-bold text-blue-600">100%</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Compromiso</p>
            </div>
          </div>
        </motion.section>

        <Skills />
        <Projects />

       
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">David Badell</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Transformando ideas en realidades digitales a través del código y el diseño.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Conecta</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/davidbadelllab" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">GitHub</a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/david-badell-9072201a2/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} David Badell. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}