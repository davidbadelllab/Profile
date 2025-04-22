'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaServer, FaMobile, FaDatabase, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import Lenis from 'lenis';
import { useInView } from 'react-intersection-observer';

// Datos de testimonios
const testimonials = [
  {
    name: "Ana García",
    position: "CEO, TechStart",
    avatar: "/avatars/testimonial1.jpg",
    comment: "David demostró un excelente dominio técnico y compromiso con nuestro proyecto. Su capacidad para encontrar soluciones innovadoras fue clave para nuestro éxito."
  },
  {
    name: "Carlos Rodríguez",
    position: "CTO, InnovateLab",
    avatar: "/avatars/testimonial2.jpg",
    comment: "Trabajar con David fue una experiencia excepcional. Su atención al detalle y capacidad de comunicación hicieron que el proceso fuera muy fluido."
  }
];

const projects = [
  {
    title: "Sistema automatizado Gmail",
    description: "Esta aplicación automatiza la gestión de correos electrónicos utilizando la inteligencia artificial de ChatGPT para responder y organizar emails de manera eficiente y efectiva",
    image: "/img/Attention.png",
    technologies: ["Laravel", "Livewire", "Tailwind CSS", "React"],
    githubUrl: "https://github.com/davidbadelllab/attentionapp",
    liveUrl: "https://attention.cl/login",
    tags: ["Full Stack", "CRM"]
  },
  {
    title: "Juego de Monetizacion",
    description: "🎮 New Game en Telegram es una divertida aventura donde podrás criar y farmear tortugas 🐢. ¡Descubre, colecciona y observa cómo crecen tus tortugas en un mundo virtual lleno de sorpresas!",
    image: "/img/Yupiii.png",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    githubUrl: "https://github.com/davidbadelllab/Yupiii",
    liveUrl: "www.turtle-farm.pro/",
    tags: ["Rect", "NodeJS","TypeScript"]
  },
  {
    title: "Gestion de reservas Cowork",
    description: "CoworkHub es un sistema ágil 🌟 para la reserva de salas 🏢, perfecto para coworkings y oficinas. Permite a los usuarios verificar disponibilidad 📅, reservar en tiempo real ⏰, y gestionar espacios desde cualquier dispositivo 📱💻. Simplifica la organización de espacios de trabajo eficientemente con CoworkHub.",
    image: "/img/cowork.png",
    technologies: ["Laravel", "Boopstra", "MySQL"],
    githubUrl: "https://github.com/davidbadelllab/CoworkHub",
    // liveUrl: "https://project3.com",
    tags: ["New Proyect", "SaaS"]
  },
  {
    title: "Apps de Taxi",
    description: "🚗💼 App de Traslados: Tu solución definitiva para el transporte de personas y paquetes. Ya sea que necesites llegar a tu próxima reunión o enviar un paquete importante, nuestra aplicación te conecta con servicios de transporte confiables y rápidos, ¡todo al alcance de tu smartphone! 📦👥",
    image: "/img/Taxii.png",
    technologies: ["Html", "Js", "Api Rest", "AWS"],
    githubUrl: "https://github.com/yourusername/project4",
    liveUrl: "https://project4.com",
    tags: ["Mobile", "FinTech"]
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const iconMap = {
  'Laravel': <FaServer className="h-5 w-5" />,
  'React': <FaCode className="h-5 w-5" />,
  'Node.js': <FaServer className="h-5 w-5" />,
  'MongoDB': <FaDatabase className="h-5 w-5" />,
  'Mobile': <FaMobile className="h-5 w-5" />,
  'TypeScript': <FaCode className="h-5 w-5" />,
  'MySQL': <FaDatabase className="h-5 w-5" />,
  'AWS': <FaServer className="h-5 w-5" />
};

export default function Projects() {
  const { scrollYProgress } = useScroll();
  const sectionRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mis Proyectos
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={ref}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.githubUrl}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Ver Proyecto
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal de Detalles del Proyecto */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-[400px] w-full mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  layout="fill"
                  className="object-cover"
                />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">{selectedProject.title}</h3>
              <p className="text-gray-200 text-lg mb-6">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm text-white rounded-full flex items-center gap-2 border border-white/20"
                  >
                    {iconMap[tech] || <FaCode className="h-4 w-4" />}
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-6">
                <motion.a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub className="h-6 w-6" />
                  <span>Código</span>
                </motion.a>
                {selectedProject.liveUrl && (
                  <motion.a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaExternalLinkAlt className="h-5 w-5" />
                    <span>Demo en vivo</span>
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
