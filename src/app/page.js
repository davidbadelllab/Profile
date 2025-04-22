'use client'

import { motion, useScroll, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Phone from '@/components/Phone'
import WhatsAppPhone from '../components/WhatsAppPhone'

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [cursorVariant, setCursorVariant] = useState("default")
  const [cursorText, setCursorText] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const aboutRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Parallax and scroll effects
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100])
  const bgBlur = useTransform(scrollYProgress, [0, 0.5], [0, 10])
  const rotationProgress = useTransform(scrollYProgress, [0, 1], [0, 360])

  // Enhanced mouse parallax
  const mouseX = useSpring(useTransform(
    useMotionTemplate`${mousePosition.x}`,
    [0, typeof window !== 'undefined' ? window.innerWidth : 1000],
    [-40, 40]
  ), { stiffness: 100, damping: 20 })
  
  const mouseY = useSpring(useTransform(
    useMotionTemplate`${mousePosition.y}`,
    [0, typeof window !== 'undefined' ? window.innerHeight : 1000],
    [-40, 40]
  ), { stiffness: 100, damping: 20 })

  // Custom cursor
  const cursorSize = useSpring(50, { stiffness: 150, damping: 15 })
  const cursorX = useSpring(0, { stiffness: 150, damping: 15 })
  const cursorY = useSpring(0, { stiffness: 150, damping: 15 })
  
  const cursorVariants = {
    default: {
      height: 32,
      width: 32,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      x: "-50%",
      y: "-50%",
    },
    button: {
      height: 64,
      width: 64,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      x: "-50%",
      y: "-50%",
    },
    text: {
      height: 100,
      width: 100,
      backgroundColor: "rgba(146, 100, 236, 0.2)",
      borderColor: "rgba(146, 100, 236, 0.5)",
      x: "-50%",
      y: "-50%",
    }
  }

  // Loading animation
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoaded(true), 500)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  // Cursor and mouse effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }
    
    const handleMouseDown = () => {
      cursorSize.set(40)
    }
    
    const handleMouseUp = () => {
      cursorSize.set(50)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cursorX, cursorY, cursorSize])

  // Three.js background animation
  useEffect(() => {
    if (!canvasRef.current) return
    
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true 
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 2000
    
    const posArray = new Float32Array(particlesCount * 3)
    const colorsArray = new Float32Array(particlesCount * 3)
    
    for(let i = 0; i < particlesCount * 3; i++) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 15
      
      // Colors (blue to purple gradient)
      if (i % 3 === 0) colorsArray[i] = Math.random() * 0.5 // R
      if (i % 3 === 1) colorsArray[i] = Math.random() * 0.5 + 0.2 // G
      if (i % 3 === 2) colorsArray[i] = Math.random() * 0.8 + 0.2 // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    })
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)
    
    camera.position.z = 5
    
    // Mouse movement effect
    let mouseX = 0
    let mouseY = 0
    
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    const clock = new THREE.Clock()
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      
      // Rotate particles
      particlesMesh.rotation.y = elapsedTime * 0.05
      
      // Follow mouse with gentle movement
      particlesMesh.rotation.x += (mouseY * 0.5 - particlesMesh.rotation.x) * 0.05
      particlesMesh.rotation.y += (mouseX * 0.5 - particlesMesh.rotation.y) * 0.05
      
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    
    animate()
    
    const handleResize = () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      
      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isLoaded])

  // Interactive elements hover effect
  const handleCursorEnter = (variant, text = "") => {
    setCursorVariant(variant)
    setCursorText(text)
  }

  const handleCursorLeave = () => {
    setCursorVariant("default")
    setCursorText("")
  }

  // Enhanced experience items with 3D effects
  const experienceItems = [
    {
      title: "Desarrollo Full Stack",
      description: "7 años transformando ideas en soluciones digitales robustas y escalables con arquitecturas de vanguardia.",
      icon: "💻",
      gradient: "from-blue-600 to-cyan-400",
      skills: ["React", "Node.js", "Python", "GraphQL", "AWS"]
    },
    {
      title: "Experiencia Diversa",
      description: "Proyectos en retail, hotelería, bienes raíces y fintech, adaptando soluciones a cada sector con impacto comprobado.",
      icon: "🏢",
      gradient: "from-purple-600 to-pink-400",
      skills: ["E-commerce", "CRM", "Booking Systems", "Analytics"]
    },
    {
      title: "Diseño UI/UX",
      description: "Creación de interfaces intuitivas y experiencias de usuario excepcionales que elevan la interacción digital.",
      icon: "🎨",
      gradient: "from-orange-500 to-yellow-400",
      skills: ["Figma", "Motion Design", "Design Systems", "Micro-interactions"]
    },
    {
      title: "Integración de IA",
      description: "Automatización inteligente de procesos y algoritmos avanzados para sistemas predictivos de próxima generación.",
      icon: "🤖",
      gradient: "from-green-500 to-emerald-400",
      skills: ["Machine Learning", "NLP", "Computer Vision", "Neural Networks"]
    }
  ]
  
  // Determine active section
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || 0
      const aboutHeight = aboutRef.current?.offsetHeight || 0
      
      const heroTop = heroRef.current?.offsetTop || 0
      const aboutTop = aboutRef.current?.offsetTop || 0
      
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      if (scrollPosition < heroTop + heroHeight) {
        setActiveSection('hero')
      } else if (scrollPosition < aboutTop + aboutHeight) {
        setActiveSection('about')
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Verificar al cargar
    checkMobile()
    
    // Verificar al cambiar tamaño
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Si es móvil, renderizar SOLO el componente Phone sin ningún otro contenido
  if (isMobile) {
    return (
      <div className="fixed inset-0">
        <Phone />
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
        <div className="absolute mt-16 text-white text-xl font-light tracking-widest">
          CARGANDO <span className="inline-block ml-1">{loadingProgress}%</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Custom cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-50 mix-blend-difference hidden md:flex items-center justify-center text-xs font-light"
        variants={cursorVariants}
        animate={cursorVariant}
        style={{
          left: cursorX,
          top: cursorY,
          borderWidth: "1px",
        }}
      >
        {cursorText && (
          <span className="text-white opacity-80">{cursorText}</span>
        )}
      </motion.div>
      
      <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
        {/* Three.js background */}
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full z-0 opacity-40"
        />
        
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] z-0" />
        
        <main className="relative z-10">
          {/* Floating Navigation - Centrado horizontalmente */}
          <div className="fixed top-8 left-0 right-0 flex justify-center z-50">
            <motion.nav 
              className="px-6 py-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/10"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            >
              <ul className="flex space-x-8">
                <li>
                  <a 
                    href="#hero" 
                    className={`text-sm font-medium transition-all duration-300 ${activeSection === 'hero' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                    onMouseEnter={() => handleCursorEnter("button", "Inicio")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <span className="relative pb-1">
                      Inicio
                      {activeSection === 'hero' && (
                        <motion.span 
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                          layoutId="navIndicator"
                        />
                      )}
                    </span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    className={`text-sm font-medium transition-all duration-300 ${activeSection === 'about' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                    onMouseEnter={() => handleCursorEnter("button", "Trayectoria")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <span className="relative pb-1">
                      Trayectoria
                      {activeSection === 'about' && (
                        <motion.span 
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                          layoutId="navIndicator"
                        />
                      )}
                    </span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#projects" 
                    className="text-white/50 hover:text-white text-sm font-medium transition-all duration-300"
                    onMouseEnter={() => handleCursorEnter("button", "Proyectos")}
                    onMouseLeave={handleCursorLeave}
                  >
                    Proyectos
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="text-white/50 hover:text-white text-sm font-medium transition-all duration-300"
                    onMouseEnter={() => handleCursorEnter("button", "Contacto")} 
                    onMouseLeave={handleCursorLeave}
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </motion.nav>
          </div>
          
        {/* Hero Section */}
          <motion.section 
            id="hero"
            ref={heroRef}
            style={{ opacity, scale, y }}
            className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Animated Background Blobs with Glow Effect */}
          <motion.div 
              className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[150px]"
            animate={{
                scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[150px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
                x: [0, -50, 0],
                y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute top-1/3 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full filter blur-[120px]"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.2, 0.3, 0.2],
                x: [0, 30, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-75"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="relative bg-black/70 backdrop-blur-xl rounded-xl p-8 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => handleCursorEnter("text")}
                  onMouseLeave={handleCursorLeave}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <h1 className="text-5xl md:text-7xl font-bold mb-8">
                      <motion.span 
                        className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                      >
                        Transformando
                      </motion.span>
                      <motion.span 
                        className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 animate-gradient-reverse"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                      >
                        Ideas en Realidad
                      </motion.span>
              </h1>
                    <motion.p 
                      className="text-xl text-gray-300 mb-8 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                    >
                      <span className="font-medium text-white">Desarrollador Full Stack</span> con enfoque en crear experiencias digitales 
                      extraordinarias que trascienden lo convencional, fusionando innovación tecnológica 
                      con diseño inmersivo para forjar el futuro digital.
                    </motion.p>    
                  </motion.div>
            </motion.div>

                {/* Tech stack indicators */}
            <motion.div 
                  className="mt-6 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  {["React", "Node.js", "TypeScript", "Python", "AWS"].map((tech, index) => (
                    <motion.div
                      key={tech}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 backdrop-blur-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 + (index * 0.1), duration: 0.5 }}
                    >
                      {tech}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div 
                style={{ x: mouseX, y: mouseY }}
                className="relative hidden lg:block perspective-1000"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <div className="relative w-full h-[600px]">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* 3D Floating Elements */}
                  <motion.div
                    className="absolute top-10 right-10 w-20 h-20 bg-blue-500/30 backdrop-blur-lg rounded-lg border border-white/10"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, 0],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute bottom-20 left-10 w-16 h-16 bg-purple-500/30 backdrop-blur-lg rounded-full border border-white/10"
                    animate={{
                      y: [0, 15, 0],
                      rotate: [0, -15, 0],
                      opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  <motion.div
                    className="absolute top-1/3 left-1/4 w-24 h-24 bg-pink-500/20 backdrop-blur-lg rounded-lg border border-white/10 transform rotate-12"
                    animate={{
                      y: [0, 25, 0],
                      rotate: [12, 0, 12],
                      opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  
              <Image
                src="/img/developer-illustration.png"
                alt="Developer Illustration"
                layout="fill"
                    objectFit="contain"
                    className="drop-shadow-2xl relative z-10 transform hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Código flotante con conexiones eléctricas */}
                  {[
                    {
                      code: "const server = express();\napp.listen(3000);",
                      lang: "Node.js",
                      color: "emerald",
                      position: "-top-32 right-0",
                      rotate: "rotate-6"
                    },
                    {
                      code: "def ai_model():\n    return predict()",
                      lang: "Python",
                      color: "sky",
                      position: "bottom-20 right-20",
                      rotate: "-rotate-3"
                    },
                    {
                      code: "<?php\n$app->run();",
                      lang: "PHP",
                      color: "violet",
                      position: "-top-20 left-0",
                      rotate: "-rotate-6"
                    },
                    {
                      code: "interface User {\n  id: string;\n}",
                      lang: "TypeScript",
                      color: "blue",
                      position: "bottom-32 left-20",
                      rotate: "rotate-3"
                    },
                    {
                      code: "async function init() {\n  await setup();\n}",
                      lang: "JavaScript",
                      color: "amber",
                      position: "top-40 -right-10",
                      rotate: "-rotate-6"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className={`absolute ${item.position} ${item.rotate} z-20`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="relative">
                        {/* Conexión eléctrica animada */}
                        <motion.div
                          className={`absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-${item.color}-400 to-transparent`}
                          style={{
                            left: "50%",
                            top: "50%",
                          }}
                          animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        >
                          {/* Puntos de conexión */}
                          <motion.div
                            className={`absolute -right-1 -top-1 w-2 h-2 rounded-full bg-${item.color}-400`}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </motion.div>

                        {/* Bloque de código */}
                        <div className="bg-black/60 backdrop-blur-lg rounded-lg border border-white/10 p-3 text-xs font-mono">
                          <div className="flex items-center space-x-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-400"/>
                            <div className="w-2 h-2 rounded-full bg-yellow-400"/>
                            <div className="w-2 h-2 rounded-full bg-green-400"/>
                          </div>
                          <div className={`text-${item.color}-400`}>
                            {item.code.split('\n').map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        </div>
            </div>
            </motion.div>
                  ))}

                  {/* Code snippet floating element */}
                  <motion.div
                    className="absolute -top-40 right-80 bg-black/60 backdrop-blur-lg rounded-xl border border-white/10 p-4 w-48 text-xs font-mono text-blue-300 transform rotate-6 z-30"
                    animate={{
                      y: [0, -15, 0],
                      x: [0, 10, 0],
                      rotate: [6, 2, 6],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
                    <div>
                      <span className="text-pink-400">const</span>{" "}
                      <span className="text-blue-300">developer</span>{" "}
                      <span className="text-pink-400">=</span>{" "}
                      <span className="text-pink-400">const</span>{" "}
                      <span className="text-blue-300">developer</span>{" "}
                      <span className="text-pink-400">=</span>{" "}
                      <span className="text-yellow-300">{"{"}</span><br/>
                      {"  "}<span className="text-green-300">name</span>: <span className="text-orange-300">&apos;David Dev&apos;</span>,<br/>
                      {"  "}<span className="text-green-300">skills</span>: [<span className="text-orange-300">&apos;React&apos;</span>, <span className="text-orange-300">&apos;Node&apos;</span>],<br/>
                      {"  "}<span className="text-green-300">passion</span>: <span className="text-orange-300">&apos;Coding&apos;</span><br/>
                      <span className="text-yellow-300">{"}"}</span>;
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            
            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <motion.div 
                className="w-8 h-14 rounded-full border-2 border-white/20 flex justify-center items-start p-2"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div 
                  className="w-1.5 h-3 bg-white/50 rounded-full"
                  animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          </motion.section>

          {/* About Section with enhanced visuals */}
        <motion.section 
            id="about"
            ref={aboutRef}
            className="relative py-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            
            {/* Digital circuit pattern */}
            <svg className="absolute inset-0 w-full h-full z-0 opacity-5" width="100%" height="100%">
              <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M10 10 H 190 V 190 H 10 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="10" cy="10" r="5" fill="currentColor"/>
                <circle cx="190" cy="10" r="5" fill="currentColor"/>
                <circle cx="10" cy="190" r="5" fill="currentColor"/>
                <circle cx="190" cy="190" r="5" fill="currentColor"/>
                <path d="M10 100 H 80 M 120 100 H 190 M 100 10 V 80 M 100 120 V 190" stroke="currentColor" strokeWidth="1"/>
                <circle cx="100" cy="100" r="10" fill="currentColor"/>
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#circuit-pattern)"/>
            </svg>
            
            <div className="container mx-auto px-4 z-10 relative">
              <div className="max-w-4xl mx-auto text-center mb-16 relative">
                <motion.div
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-4">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Experiencia
                  </span>
                </motion.div>
               
                <motion.div
                  className="bg-[#1e1e1e] rounded-lg border border-[#3a3a3a] p-4 font-mono w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onMouseEnter={() => handleCursorEnter("text")}
                  onMouseLeave={handleCursorLeave}
                >
                  <div className="flex items-center gap-2 mb-3 border-b border-[#3a3a3a] pb-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
                    <span className="text-[#6e6e6e] text-sm">about.txt</span>
            </div>
                  <motion.div
                    className="text-[#63E2B7] text-lg w-full font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="text-[#98c379] flex flex-col space-y-1">
                      <div className="flex justify-between items-center w-full">
                        <span><span className="text-xs text-[#61afef]">david@badell-Macbook-Pro</span> <span className="text-xs text-[#e5c07b]">~</span> {'>'} Con más de <span className="text-xs text-[#e5c07b] font-bold">7 años de experiencia</span> en el desarrollo web</span>
                        <span className="text-[#61afef]">[100%]</span>
            </div>
                      <div className="flex justify-between items-center w-full">
                        <span><span className="text-xs text-[#61afef]">david@badell-Macbook-Pro</span> <span className="text-xs text-[#e5c07b]">~</span> {'>'} he tenido el privilegio de trabajar en diversos sectores</span>
                        <span className="text-[#61afef]">[100%]</span>
            </div>
                      <div className="flex justify-between items-center w-full">
                        <span><span className="text-xs text-[#61afef]">david@badell-Macbook-Pro</span> <span className="text-xs text-[#e5c07b]">~</span> {'>'} creando soluciones innovadoras y sistemas a medida</span>
                        <span className="text-[#61afef]">[100%]</span>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span><span className="text-xs text-[#61afef]">david@badell-Macbook-Pro</span> <span className="text-xs text-[#e5c07b]">~</span> {'>'} que transforman la manera en que las empresas operan</span>
                        <span className="text-[#61afef]">[100%]</span>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <span><span className="text-xs text-[#61afef]">david@badell-Macbook-Pro</span> <span className="text-xs text-[#e5c07b]">~</span> {'>'} y se conectan con sus usuarios</span>
                        <span className="text-[#61afef]">[100%]</span>
                      </div>
                    </div>
                    <div className="mt-1 flex">
                      <span className="text-xs text-[#61afef]">david@badell-Macbook-Pro</span> <span className="text-xs text-[#e5c07b]">~</span> <span className="animate-pulse">█</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                {experienceItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={() => handleCursorEnter("text")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <motion.div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000`}
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="relative p-8 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 h-full"
                      whileHover={{ 
                        scale: 1.02, 
                        rotateY: 5, 
                        rotateX: 2,
                        z: 20
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className="text-5xl mb-4 transform -translate-y-2 transition-transform group-hover:scale-110 duration-300">
                        {item.icon}
                      </div>
                      <h3 className={`text-2xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}>
                        {item.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {item.description}
                      </p>
                      
                      {/* Skills chips */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {item.skills.map((skill, i) => (
                          <motion.span 
                            key={i} 
                            className="px-2 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-md"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                      
                      {/* Bottom decorative line */}
                      <motion.div 
                        className={`absolute bottom-4 left-8 right-8 h-px bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100`}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-20 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onMouseEnter={() => handleCursorEnter("text")}
                onMouseLeave={handleCursorLeave}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75" />
                <div className="relative p-8 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10">
                  <div className="absolute -top-5 -left-5 w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/20 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 14L12 17M12 17L15 14M12 17V9M7 3H12M17 3H12M12 3V5M21 8V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H9C6.17157 22 4.75736 22 3.87868 21.1213C3 20.2426 3 18.8284 3 16V8C3 5.17157 3 3.75736 3.87868 2.87868C4.75736 2 6.17157 2 9 2H15C17.8284 2 19.2426 2 20.1213 2.87868C21 3.75736 21 5.17157 21 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <motion.p 
                    className="text-xl text-gray-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, type: "spring" }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Como <span className="text-white font-medium">asesor externo</span>, he colaborado en la planificación y ejecución de proyectos de gran envergadura, 
                      aportando mi experiencia en el desarrollo de <span className="text-blue-300">aplicaciones web y nativas</span> utilizando React y Flutter. 
                      Mi especialidad incluye la <span className="text-purple-300">integración de tecnologías de IA</span> para automatizar tareas recurrentes y 
                      optimizar el rendimiento de los sistemas.
                    </motion.span>
                  </motion.p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <motion.div 
                      className="relative flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10"
                      initial={{ x: -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      whileHover="hover"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 5.5L5 7.5M5 7.5L3 9.5M5 7.5H11M21 18.5L19 16.5M19 16.5L21 14.5M19 16.5H13M13 3L15 5L13 7M11 21L9 19L11 17" stroke="#61DAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <motion.span 
                        className="text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        Integración APIs
                      </motion.span>
                      <motion.div
                        className="absolute -top-24 left-0 w-64 bg-black/90 rounded-lg p-4 border border-blue-500/20 opacity-0 pointer-events-none"
                        variants={{
                          hover: { opacity: 1, y: -10 }
                        }}
                      >
                        <motion.pre 
                          className="text-xs text-blue-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                        >
                          <code>{`fetch('/api/data')
  .then(res => res.json())
  .then(data => {
    // Procesar datos
  });`}</code>
                        </motion.pre>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="relative flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10"
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover="hover"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#C084FC" strokeWidth="2"/>
                          <path d="M12 5V3M17 7.6109L18.5 6.1109M19 12.5H21M17 17.3891L18.5 18.8891M12 19V21M7 17.3891L5.5 18.8891M5 12.5H3M7 7.6109L5.5 6.1109" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <motion.span 
                        className="text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                      >
                        UI/UX Diseño
                      </motion.span>
                      <motion.div
                        className="absolute -top-24 left-0 w-64 bg-black/90 rounded-lg p-4 border border-purple-500/20 opacity-0 pointer-events-none"
                        variants={{
                          hover: { opacity: 1, y: -10 }
                        }}
                      >
                        <motion.pre 
                          className="text-xs text-purple-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                        >
                          <code>{`<div className="flex
  items-center
  justify-center
  rounded-lg
  shadow-lg"/>`}</code>
                        </motion.pre>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="relative flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10"
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover="hover"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4H10C7.79086 4 6 5.79086 6 8V18C6 20.2091 7.79086 22 10 22H14C16.2091 22 18 20.2091 18 18V8C18 5.79086 16.2091 4 14 4H12ZM12 4V2" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
                          <rect x="10" y="14" width="4" height="4" rx="2" stroke="#4ADE80" strokeWidth="2"/>
                        </svg>
                      </div>
                      <motion.span 
                        className="text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                      >
                        App Móviles
                      </motion.span>
                      <motion.div
                        className="absolute -top-24 left-0 w-64 bg-black/90 rounded-lg p-4 border border-green-500/20 opacity-0 pointer-events-none"
                        variants={{
                          hover: { opacity: 1, y: -10 }
                        }}
                      >
                        <motion.pre 
                          className="text-xs text-green-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                        >
                          <code>{`class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext) {
    return MaterialApp();
  }
}`}</code>
                        </motion.pre>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Timeline component */}
              <motion.div 
                className="mt-24"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl font-bold mb-12 text-center">Evolución Profesional</h3>
                <div className="relative">
                  {/* Central line with data transmission effect */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 w-full h-full"
                      initial={{ scaleY: 0, opacity: 0 }}
                      whileInView={{ scaleY: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5 }}
                    />
                    {/* Data transmission particles */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 left-1/2 -translate-x-1/2 rounded-full bg-blue-400"
                        initial={{ top: "-10%" }}
                        animate={{
                          top: ["0%", "100%"],
                          opacity: [0, 1, 0],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.6,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Timeline events */}
                  {[
                    { 
                      year: "2024", 
                      title: "Asesor de Tecnología", 
                      company: "TechVision Global",
                      desc: "Liderando estrategias de desarrollo para grandes empresas",
                      color: "from-blue-400 to-cyan-400",
                      side: "right",
                      speech: "En mi rol actual, lidero la transformación digital de empresas Fortune 500, implementando arquitecturas escalables y soluciones cloud-native."
                    },
                    { 
                      year: "2022", 
                      title: "Lead Developer", 
                      company: "InnovaSoft Solutions",
                      desc: "Desarrollo de aplicaciones web y móviles de alto rendimiento",
                      color: "from-purple-400 to-pink-400",
                      side: "left",
                      speech: "Como Lead Developer, dirigí un equipo de 8 desarrolladores, implementando metodologías ágiles y mejorando el tiempo de entrega en un 40%."
                    },
                    { 
                      year: "2020", 
                      title: "Full Stack Developer", 
                      company: "DigitalMind Agency",
                      desc: "Soluciones web personalizadas con React y Node.js",
                      color: "from-pink-400 to-orange-400",
                      side: "right",
                      speech: "Desarrollé más de 20 aplicaciones web full-stack, utilizando React, Node.js y AWS, logrando un 99.9% de uptime y mejorando el rendimiento en un 60%."
                    },
                    { 
                      year: "2018", 
                      title: "Front-end Developer", 
                      company: "WebCraft Studio",
                      desc: "Interfaces de usuario modernas con frameworks JavaScript",
                      color: "from-green-400 to-emerald-400",
                      side: "left",
                      speech: "Mi inicio en desarrollo web profesional, donde aprendí las mejores prácticas de UI/UX y desarrollé más de 30 sitios web responsivos."
                    }
                  ].map((event, index) => (
                    <motion.div 
                      key={index}
                      className={`flex mb-12 items-center ${event.side === 'left' ? 'flex-row-reverse' : ''}`}
                      initial={{ opacity: 0, x: event.side === 'left' ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="w-1/2 px-4"></div>
                      <div className="relative">
                        <motion.div 
                          className={`absolute inset-0 bg-gradient-to-r ${event.color} rounded-full blur-sm opacity-50`}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <div className="w-6 h-6 rounded-full bg-black border-2 border-white relative z-10"></div>
                      </div>
                      <div className="w-1/2 px-8 group relative">
                        <div className={`p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 relative transition-all duration-300 hover:scale-105`}
                             onMouseEnter={() => handleCursorEnter("text")}
                             onMouseLeave={handleCursorLeave}>
                          <div className={`absolute -top-3 left-4 px-2 py-1 text-xs font-semibold rounded bg-gradient-to-r ${event.color} shadow-lg`}>
                            {event.year}
                          </div>
                          <h4 className="text-xl font-bold mt-2">{event.title}</h4>
                          <div className="text-sm text-gray-300 mb-2">{event.company}</div>
                          <p className="text-gray-400 text-sm">{event.desc}</p>

                          {/* Speech card */}
                          <motion.div
                            className={`absolute -top-32 left-0 w-full p-4 bg-black/80 backdrop-blur-xl rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                            initial={{ scale: 0.8, y: 20 }}
                            whileInView={{ scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative">
                              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 border border-white/10 rotate-45 transform"></div>
                              <p className="text-sm text-gray-300">{event.speech}</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
          </div>
        </motion.section>

          {/* Projects Section */}
          <motion.section 
            id="projects"
            className="relative py-32 bg-[#0a0a0a] overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"/>
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"/>
              
              {/* Animated Blobs */}
              <motion.div 
                className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[150px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3],
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[150px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3],
                  x: [0, -50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Floating Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Rotating Gradient Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div
                    className={`w-[800px] h-[800px] rounded-full border border-white/5
                      ${i === 0 ? 'bg-gradient-conic-subtle from-blue-500/10 via-transparent to-transparent' :
                      i === 1 ? 'bg-gradient-conic-subtle from-purple-500/10 via-transparent to-transparent' :
                      'bg-gradient-conic-subtle from-pink-500/10 via-transparent to-transparent'}`}
                    style={{
                      transform: `scale(${1 - i * 0.2})`,
                    }}
                  />
                </motion.div>
              ))}
 
              {/* Glowing Lines */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                    style={{ top: `${20 * (i + 1)}%` }}
                    animate={{
                      opacity: [0, 1, 0],
                      scaleX: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
            </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-24">
                <motion.div
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-4 overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-shimmer" />
                    <span className="relative flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Portfolio
                    </span>
                  </span>
                </motion.div>
                <motion.h2 
                  className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Proyectos Destacados
                </motion.h2>
                <motion.p 
                  className="text-2xl text-gray-300 max-w-3xl mx-auto font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Una selección de trabajos que demuestran mi capacidad para transformar ideas en 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> experiencias digitales únicas</span>.
                </motion.p>
          </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                {[
                  {
                    title: "Impulsa360",
                    description: "Agencia de publicidad y desarrollo digital con enfoque en resultados medibles y estrategias personalizadas.",
                    link: "https://impulsa360.vercel.app/",
                    image: "/img/impulsa360.png",
                    tags: ["Next.js", "TailwindCSS", "Framer Motion"],
                    color: "from-blue-400 to-cyan-400",
                    stats: {
                      performance: 98,
                      satisfaction: 95,
                      clients: "+50"
                    }
                  },
                  {
                    title: "WConecta360",
                    description: "CRM de WhatsApp que optimiza la comunicación empresarial y gestión de clientes en tiempo real.",
                    link: "https://wconecta360.xyz/",
                    image: "/img/wconecta360.png",
                    tags: ["React", "Node.js", "WebSocket"],
                    color: "from-green-400 to-emerald-400",
                    stats: {
                      messages: "1M+",
                      uptime: "99.9%",
                      users: "+1K"
                    }
                  },
                  {
                    title: "QuoteMasterAI",
                    description: "Sistema de cotizaciones impulsado por IA usando DeepSeek para automatizar y optimizar propuestas.",
                    link: "https://cotizaciones-sable.vercel.app/welcome",
                    image: "/img/quotemasterai.png",
                    tags: ["AI", "Next.js", "TailwindCSS"],
                    color: "from-purple-400 to-pink-400",
                    stats: {
                      accuracy: "95%",
                      savings: "70%",
                      quotes: "+5K"
                    }
                  },
                  {
                    title: "Beoppel",
                    description: "Gestión de carreras de taxi y pedidos por WhatsApp, optimizando la logística de transporte.",
                    link: "#",
                    image: "/img/beoppel.png",
                    tags: ["React Native", "Node.js", "MongoDB"],
                    color: "from-yellow-400 to-orange-400",
                    stats: {
                      rides: "+10K",
                      drivers: "+500",
                      rating: "4.8"
                    }
                  },
                  {
                    title: "Spotly",
                    description: "Gestor inteligente de citas y espacios, facilitando la reserva y administración de lugares.",
                    link: "#",
                    image: "/img/spotly.png",
                    tags: ["Vue.js", "Firebase", "Google Maps"],
                    color: "from-red-400 to-pink-400",
                    stats: {
                      bookings: "+2K",
                      spaces: "+100",
                      satisfaction: "96%"
                    }
                  },
                  {
                    title: "BookNew",
                    description: "Red social de comunidades literarias que conecta lectores y autores en un espacio interactivo.",
                    link: "#",
                    image: "/img/booknew.png",
                    tags: ["React", "GraphQL", "AWS"],
                    color: "from-indigo-400 to-purple-400",
                    stats: {
                      users: "+5K",
                      books: "+10K",
                      interactions: "1M+"
                    }
                  },
                  {
                    title: "Yupiii",
                    description: "E-commerce con CRM integrado de WhatsApp para una atención al cliente personalizada.",
                    link: "#",
                    image: "/img/yupiii.png",
                    tags: ["Next.js", "Stripe", "WhatsApp API"],
                    color: "from-pink-400 to-rose-400",
                    stats: {
                      sales: "+1M",
                      conversion: "15%",
                      retention: "85%"
                    }
                  },
                  {
                    title: "QResponse",
                    description: "Gestión unificada de emails con IA para optimizar respuestas empresariales automáticas.",
                    link: "#",
                    image: "/img/qresponse.png",
                    tags: ["AI", "Python", "React"],
                    color: "from-sky-400 to-blue-400",
                    stats: {
                      accuracy: "98%",
                      responses: "+50K",
                      timeReduced: "85%"
                    }
                  }
                ].map((project, index) => (
                  <motion.div
                    key={index}
                    className="group relative transform-gpu"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      rotateY: 5,
                      rotateX: 5,
                      translateZ: 20
                    }}
                  >
                    {/* Glowing effect */}
                    <motion.div
                      className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-75 blur-lg group-hover:opacity-100 transition duration-300"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${project.color.split(' ')[1]}, ${project.color.split(' ')[3]})`
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block p-1"
                      onMouseEnter={() => handleCursorEnter("text")}
                      onMouseLeave={handleCursorLeave}
                    >
                      <div className="relative h-full bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden group-hover:border-white/20 transition duration-300">
                        <div className="relative z-10 p-8">
                          {/* Project Icon */}
                          <div className="mb-6 flex justify-between items-start">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} p-0.5`}>
                              <div className="w-full h-full rounded-xl bg-black/60 backdrop-blur-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13 3L21 11L13 19M21 11H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                            <motion.div
                              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                              whileHover={{ scale: 1.2, rotate: 90 }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </motion.div>
                          </div>

                          <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r group-hover:scale-105 transition-transform duration-300"
                              style={{
                                backgroundImage: `linear-gradient(to right, ${project.color.split(' ')[1]}, ${project.color.split(' ')[3]})`
                              }}>
                            {project.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                            {project.description}
                          </p>

                          {/* Project Stats with Icons */}
                          <div className="grid grid-cols-3 gap-3 mb-6">
                            {Object.entries(project.stats).map(([key, value], i) => (
                              <div key={i} className="relative group/stat">
                                <div className="text-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/5 group-hover/stat:border-white/10 transition-all duration-300">
                                  <div className="text-lg font-bold text-white">{value}</div>
                                  <div className="text-xs text-gray-400 mt-1">{key}</div>
          </div>
                                <div 
                                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover/stat:opacity-10 transition duration-300 rounded-lg"
                                  style={{
                                    backgroundImage: `linear-gradient(to right, ${project.color.split(' ')[1]}, ${project.color.split(' ')[3]})`
                                  }}
                                />
        </div>
                            ))}
    </div>

                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs font-medium bg-white/5 rounded-full border border-white/10 text-gray-300 backdrop-blur-sm hover:border-white/20 transition-colors duration-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Bottom highlight line with animation */}
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${project.color.split(' ')[1]}, ${project.color.split(' ')[3]})`
                            }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Contact Section - Solo visible en desktop */}
          <motion.section 
            id="contact"
            className="relative py-32 bg-[#0a0a0a] overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"/>
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"/>
              
              {/* Animated Blobs */}
              <motion.div 
                className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-[150px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3],
                  x: [0, 50, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[150px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3],
                  x: [0, -50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Floating Particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Rotating Gradient Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div
                    className={`w-[800px] h-[800px] rounded-full border border-white/5
                      ${i === 0 ? 'bg-gradient-conic-subtle from-blue-500/10 via-transparent to-transparent' :
                      i === 1 ? 'bg-gradient-conic-subtle from-purple-500/10 via-transparent to-transparent' :
                      'bg-gradient-conic-subtle from-pink-500/10 via-transparent to-transparent'}`}
                    style={{
                      transform: `scale(${1 - i * 0.2})`,
                    }}
                  />
                </motion.div>
              ))}
 
              {/* Glowing Lines */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
                    style={{ top: `${20 * (i + 1)}%` }}
                    animate={{
                      opacity: [0, 1, 0],
                      scaleX: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-24">
                <motion.div
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="relative inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-4 overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-shimmer" />
                    <span className="relative flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Contacto
                    </span>
                  </span>
                </motion.div>
                <motion.h2 
                  className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Contáctame
                </motion.h2>
                <motion.p 
                  className="text-2xl text-gray-300 max-w-3xl mx-auto font-light"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Estoy aquí para ayudarte. ¿Tienes alguna pregunta o proyecto en mente? ¡No dudes en contactarme!
                </motion.p>
              </div>
              
              {/* Contact Form */}
              {/* Add your contact form component here */}
            </div>
          </motion.section>
        </main>
      </div>
    </>
  );
}
