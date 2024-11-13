import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Projects() {
  return (
    <section className="py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Proyectos Destacados
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Una selección de mis trabajos más recientes y significativos, demostrando mi experiencia en desarrollo full-stack y soluciones innovadoras.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                layout="fill"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="absolute top-4 left-4 flex gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold bg-blue-500/80 text-white rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <FaGithub className="h-5 w-5" />
                  <span>Código</span>
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <FaExternalLinkAlt className="h-4 w-4" />
                  <span>Demo en vivo</span>
                </a>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
