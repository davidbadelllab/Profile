'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección de información */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sobre Mí
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Desarrollador Full Stack apasionado por crear soluciones innovadoras y experiencias de usuario excepcionales.
            </p>
          </motion.div>

          {/* Sección de enlaces rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/proyectos"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link 
                  href="/habilidades"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Habilidades
                </Link>
              </li>
              <li>
                <Link 
                  href="/contacto"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Sección de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <a 
                  href="mailto:tu@email.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  tu@email.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">LinkedIn:</span>
                <a 
                  href="https://linkedin.com/in/tu-perfil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mi Perfil
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-400">GitHub:</span>
                <a 
                  href="https://github.com/tu-usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mi GitHub
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            © {currentYear} Mi Portafolio. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 