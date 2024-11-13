'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppWidget() {
  // Número de WhatsApp y mensaje predeterminado
  const phoneNumber = "+56937871331" // Cambia esto por tu número
  const message = "Hola! Me interesa conocer más sobre tus servicios de desarrollo web."
  
  // URL de WhatsApp con el mensaje codificado
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1.
      }}
      className="fixed bottom-8 right-8 z-50"
    >
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Botón principal */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-green-500 hover:bg-green-600 rounded-full p-4 flex items-center justify-center transition-colors duration-200">
            <FaWhatsapp className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            ¡Chatea conmigo!
            {/* Flecha del tooltip */}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800" />
          </div>
        </div>

        {/* Indicador de pulso */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-green-500 rounded-full animate-ping opacity-25" />
        </div>
      </motion.a>
    </motion.div>
  )
}