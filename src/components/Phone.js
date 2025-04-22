'use client'

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import WhatsAppPhone from './WhatsAppPhone'

// Componentes de UI avanzados
const GlassmorphicCard = ({ children, className = "", intensity = 0.2 }) => (
  <div className={`relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30 pointer-events-none" />
    <div className="absolute -inset-[400px] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-slow-spin blur-3xl opacity-30" />
    <div className="relative z-10">{children}</div>
  </div>
)

// Componente principal
export default function Phone() {
  const [activeTab, setActiveTab] = useState('home')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const contentRef = useRef(null)
  
  // Obtener la posición del scroll para efectos paralax
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setScrollY(contentRef.current.scrollTop)
      }
    }
    
    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll)
    }
    
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Mostrar animación de carga
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500 mb-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          
          <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
          <motion.div 
            className="mt-4 text-blue-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Inicializando...
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0a0a] to-[#050505] overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-blue-600/20 rounded-full filter blur-[100px] animate-slow-pulse" />
          <div className="absolute bottom-[30%] right-[15%] w-80 h-80 bg-purple-600/20 rounded-full filter blur-[120px] animate-slow-pulse-delay" />
          <div className="absolute top-[60%] left-[50%] w-48 h-48 bg-pink-600/20 rounded-full filter blur-[80px] animate-slow-pulse" />
        </div>
        <div className="absolute inset-0 backdrop-blur-[120px] bg-black/10" />
      </div>

      

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="pt-12 h-full overflow-y-auto pb-16 scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4"
            >
              {/* Hero Section */}
              <motion.div 
                className="relative mb-8"
                style={{ y: scrollY * -0.1 }}
              >
                <GlassmorphicCard className="p-6">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/50">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                        <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">D</div>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                          David Dev
                        </h1>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span>Online</span>
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">Desarrollador Full Stack</span> especializado en crear experiencias digitales extraordinarias con enfoque en rendimiento y diseño.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "TypeScript", "Next.js", "Tailwind"].map((tech, index) => (
                        <motion.span 
                          key={tech} 
                          className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 flex items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </GlassmorphicCard>
              </motion.div>

              {/* Stats Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8V16M12 11V16M8 14V16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Estadísticas
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "7+", label: "Años exp.", icon: "⏱️" },
                    { value: "50+", label: "Proyectos", icon: "🚀" },
                    { value: "12", label: "Clientes", icon: "🤝" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-lg rounded-xl p-3 border border-white/10 flex flex-col items-center justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <div className="text-3xl mb-1">{stat.icon}</div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 13.5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 17.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sobre Mí
                </h2>
                <GlassmorphicCard className="p-4">
                  <div className="relative">
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500/20 rounded-full filter blur-[30px]" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Con más de <span className="text-blue-400 font-semibold">7 años de experiencia</span> en desarrollo web, he trabajado en sectores como fintech, e-commerce y educación, creando soluciones innovadoras que combinan estética y funcionalidad.
                    </p>
                    <div className="mt-4 flex space-x-3">
                      {["📍 Madrid", "🔗 Github", "💼 Disponible"].map((item, index) => (
                        <motion.span 
                          key={index}
                          className="text-xs text-gray-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </GlassmorphicCard>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 12H18M6 12H2M12 6V2M12 22V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Habilidades
                </h2>
                <GlassmorphicCard className="p-4">
                  <div className="space-y-3">
                    {[
                      { name: "Front-end", value: 90 },
                      { name: "Back-end", value: 85 },
                      { name: "UI/UX", value: 80 },
                      { name: "DevOps", value: 75 }
                    ].map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">{skill.name}</span>
                          <span className="text-gray-400">{skill.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.value}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <WhatsAppPhone />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs mt-1">Inicio</span>
        </button>

        <a 
          href="/documents/CV David Badell.pdf"
          download
          className="flex flex-col items-center text-gray-400 hover:text-blue-400 transition-colors"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14L12 5M12 14L9 11M12 14L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14.5V16C7 16.9319 7 17.3978 7.15224 17.7654C7.35523 18.2554 7.74458 18.6448 8.23463 18.8478C8.60218 19 9.06812 19 10 19H14C14.9319 19 15.3978 19 15.7654 18.8478C16.2554 18.6448 16.6448 18.2554 16.8478 17.7654C17 17.3978 17 16.9319 17 16V14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs mt-1">CV</span>
        </a>

        <button 
          onClick={() => setActiveTab('contact')}
          className={`flex flex-col items-center ${activeTab === 'contact' ? 'text-blue-400' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2136 21.3525 21.4014C21.1477 21.5892 20.9063 21.7315 20.6443 21.8191C20.3823 21.9068 20.1059 21.9382 19.83 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.17C2.10183 3.90347 2.1309 3.6367 2.21573 3.38192C2.30056 3.12714 2.43967 2.88948 2.62574 2.68333C2.81181 2.47718 3.04131 2.30641 3.30115 2.18082C3.56099 2.05523 3.84584 1.97722 4.13 2H7.13C7.59531 1.99522 8.0459 2.16708 8.39127 2.48374C8.73665 2.8004 8.95337 3.2395 9 3.71C9.10253 4.80068 9.35167 5.87127 9.74 6.89C9.88854 7.27439 9.95501 7.68545 9.93554 8.09739C9.91606 8.50933 9.81094 8.91319 9.627 9.28L8.62 11.13C9.69853 13.0363 11.2852 14.5829 13.2 15.59L15.05 14.58C15.4168 14.4017 15.8202 14.2986 16.2314 14.2777C16.6426 14.2568 17.0526 14.3186 17.435 14.46C18.456 14.8499 19.5286 15.0984 20.62 15.2C21.0919 15.2468 21.5322 15.4652 21.8495 15.8127C22.1668 16.1601 22.3382 16.6126 22.33 17.08L22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs mt-1">Contacto</span>
        </button>
      </div>
    </div>
  )
}
