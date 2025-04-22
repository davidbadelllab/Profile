'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

// Datos de ejemplo para el chat
const initialMessages = []

// Componente de burbuja de chat
const ChatBubble = ({ message, isTyping }) => {
  const bubbleVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      x: message.isUser ? 20 : -20 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 500, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 } 
    }
  }

  return (
    <motion.div 
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-2`}
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div 
        className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
          message.isUser 
            ? 'bg-[#D9FDD3] rounded-tr-none' 
            : 'bg-white rounded-tl-none'
        }`}
      >
        <div className="text-[14px] text-[#111B21]">{message.text}</div>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[11px] text-[#667781]">{message.time}</span>
          {message.isUser && (
            <>
              {message.status === 'sent' && (
                <svg className="w-3 h-3 text-[#667781]" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {message.status === 'delivered' && (
                <svg className="w-3 h-3 text-[#667781]" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L20 7M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {message.status === 'read' && (
                <svg className="w-3 h-3 text-[#53BDEB]" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L10 17L20 7M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Componente de indicador de escritura
const TypingIndicator = () => {
  return (
    <motion.div 
      className="flex justify-start mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2 shadow-sm">
        <div className="flex space-x-1">
          <motion.div 
            className="w-2 h-2 bg-[#25D366] rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div 
            className="w-2 h-2 bg-[#25D366] rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className="w-2 h-2 bg-[#25D366] rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function WhatsAppPhone() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState(67)
  const [currentTime, setCurrentTime] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Actualizar la hora
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(format(now, 'H:mm'))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Enviar mensaje inicial al cargar el componente
  useEffect(() => {
    const sendInitialMessage = async () => {
      try {
        setIsTyping(true);
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: "Saluda y preséntate brevemente",
            messageCount: 0
          })
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setIsTyping(false);
        
        const newMessage = {
          id: 1,
          text: data.response,
          time: format(new Date(), 'H:mm'),
          isUser: false,
          status: 'read'
        };
        
        setMessages([newMessage]);
      } catch (error) {
        console.error('Error al obtener respuesta inicial:', error);
        setIsTyping(false);
      }
    };

    if (messages.length === 0) {
      sendInitialMessage();
    }
  }, []);

  // Simulación de respuesta automática
  useEffect(() => {
    let isSubscribed = true;

    if (messages.length > 0 && messages[messages.length - 1].isUser) {
      const getResponse = async () => {
        setIsTyping(true);
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: messages[messages.length - 1].text,
              messageCount: messageCount
            }),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          
          if (isSubscribed) {
            setIsTyping(false);
            // Simular un pequeño retraso para que parezca más natural
            setTimeout(() => {
              const assistantMessage = {
                id: messages.length + 1,
                text: data.message,
                time: format(new Date(), 'H:mm'),
                isUser: false,
                status: 'read'
              };
              
              setMessages(prev => [...prev, assistantMessage]);
              setMessageCount(prev => prev + 1);
            }, 500);
          }
        } catch (error) {
          console.error('Error:', error);
          if (isSubscribed) {
            setIsTyping(false);
            const errorMessage = {
              id: messages.length + 1,
              text: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.",
              time: format(new Date(), 'H:mm'),
              isUser: false,
              status: 'error'
            };
            
            setMessages(prev => [...prev, errorMessage]);
          }
        }
      };

      getResponse();
    }
    
    return () => {
      isSubscribed = false;
      setIsTyping(false);
    };
  }, [messages.length, messageCount]);

  const handleSendMessage = (text) => {
    if (text.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: text,
        time: format(new Date(), 'H:mm'),
        isUser: true,
        status: 'pending'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simular estados de mensaje enviado y leído
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
      }, 500);

      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );
      }, 1000);

      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        );
      }, 1500);
    }
  };

  // Manejar entrada de texto
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  // Manejar tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  // Alternar grabación de audio
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setRecordingTime(0)
    }
  }

  // Actualizar tiempo de grabación
  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Formatear tiempo de grabación
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full flex flex-col bg-[#EFE7DE] relative">
      {/* WhatsApp Header */}
      <div className="bg-[#008069] text-white h-14 flex items-center px-4 gap-4 shadow-md">
        <motion.button 
          className="p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 rounded-full bg-[#D1D7DB] overflow-hidden">
              <img 
                src="/img/a-modern-and-professional-logo-for-a-sof_qrwWFp2eQwmfdwP_K-uGcw_OwHOFCoMTYqa5HeYJBIRxA.jpeg" 
                alt="Mi Numero Entel" 
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <motion.div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#008069]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </motion.div>
          <div>
            <h2 className="font-semibold text-[17px]">David Badell</h2>
            <div className="flex items-center gap-1">
              <p className="text-[13px] opacity-90">{isOnline ? 'en línea' : 'último visto hoy a las 13:45'}</p>
              {isTyping && !isOnline && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12C3 12 7 4 12 4C17 4 21 12 21 12C21 12 17 20 12 20C7 20 3 12 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H5.01M12 12H12.01M19 12H19.01M6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12ZM13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12ZM20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-3 py-2"
        style={{ 
          backgroundImage: `url('/img/bgwspjpg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Today Separator */}
        <div className="text-center my-4">
          <span className="bg-[#E1F2FF] text-[#53BDEB] text-[12px] px-3 py-1 rounded-lg shadow-sm font-medium">
            Hoy
          </span>
        </div>

        {/* Mensaje de cifrado */}
        <div className="mx-2 my-4">
          <motion.div 
            className="bg-[#FFF3C7] mx-auto max-w-[95%] p-3 rounded-lg text-[12px] text-center text-[#857250]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V8" stroke="#857250" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 12H19M5 12C4.44772 12 4 11.5523 4 11V9C4 8.44772 4.44772 8 5 8H19C19.5523 8 20 8.44772 20 9V11C20 11.5523 19.5523 12 19 12M5 12C4.44772 12 4 12.4477 4 13V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V13C20 12.4477 19.5523 12 19 12" stroke="#857250" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1" fill="#857250"/>
              </svg>
              <span>Los mensajes y llamadas están cifrados de extremo a extremo. Nadie fuera de este chat, ni siquiera WhatsApp, puede leerlos ni escucharlos.</span>
            </div>
          </motion.div>
        </div>

        {/* Mensajes */}
        <div className="space-y-1 py-2">
          <AnimatePresence>
            {messages.map(message => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>
      </div>

      {/* Panel de adjuntos */}
      <AnimatePresence>
        {isAttachmentOpen && (
          <motion.div 
            className="absolute bottom-16 left-0 right-0 bg-[#EFE7DE] p-4 border-t border-[#D1D7DB] shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: '📄', label: 'Documento', color: 'bg-purple-500' },
                { icon: '📷', label: 'Cámara', color: 'bg-pink-500' },
                { icon: '🖼️', label: 'Galería', color: 'bg-cyan-500' },
                { icon: '🎵', label: 'Audio', color: 'bg-yellow-500' },
                { icon: '📍', label: 'Ubicación', color: 'bg-green-500' },
                { icon: '👤', label: 'Contacto', color: 'bg-blue-500' },
                { icon: '💰', label: 'Pago', color: 'bg-emerald-500' },
                { icon: '🎭', label: 'Encuesta', color: 'bg-orange-500' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-xl shadow-md`}>
                    {item.icon}
                  </div>
                  <span className="mt-1 text-xs text-[#111B21]">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <div className="bg-[#F0F2F5] p-2">
        {isRecording ? (
          <div className="flex items-center bg-white rounded-full px-4 py-2">
            <motion.div 
              className="w-3 h-3 bg-red-500 rounded-full mr-3"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <span className="text-[#111B21] text-sm flex-1">{formatRecordingTime(recordingTime)}</span>
            <motion.button 
              className="text-red-500"
              whileTap={{ scale: 0.9 }}
              onClick={toggleRecording}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <motion.button 
              className="p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <svg className="w-6 h-6 text-[#54656F]" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 14C8.91221 15.2144 10.3645 16 12 16C13.6355 16 15.0878 15.2144 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="10" r="1" fill="currentColor"/>
                <circle cx="15" cy="10" r="1" fill="currentColor"/>
              </svg>
            </motion.button>
            <motion.button 
              className="p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            >
              <svg className="w-6 h-6 text-[#54656F]" viewBox="0 0 24 24" fill="none">
                <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00171 17.5872 2.00171 16C2.00171 14.4128 2.63416 12.8858 3.76 11.76L12.33 3.19C13.0806 2.43932 14.0991 2.00001 15.16 2.00001C16.2209 2.00001 17.2394 2.43932 17.99 3.19C18.7407 3.94068 19.18 4.95921 19.18 6.02C19.18 7.08079 18.7407 8.09933 17.99 8.85L9.41 17.43C9.03466 17.8053 8.52853 18.0172 8 18.0172C7.47147 18.0172 6.96534 17.8053 6.59 17.43C6.21466 17.0547 6.00275 16.5485 6.00275 16.02C6.00275 15.4915 6.21466 14.9853 6.59 14.61L15.16 6.02C15.3477 5.83232 15.6096 5.72725 15.882 5.72725C16.1544 5.72725 16.4163 5.83232 16.604 6.02C16.7917 6.20768 16.8968 6.46959 16.8968 6.742C16.8968 7.01441 16.7917 7.27633 16.604 7.464L8.014 16.02C7.91532 16.1187 7.78237 16.1744 7.644 16.1744C7.50563 16.1744 7.37268 16.1187 7.274 16.02C7.17533 15.9213 7.11957 15.7884 7.11957 15.65C7.11957 15.5116 7.17533 15.3787 7.274 15.28L15.16 7.464" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </motion.button>
            <div className="flex-1 bg-white rounded-full px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Mensaje"
                className="w-full text-[15px] placeholder-[#8696a0] focus:outline-none bg-transparent"
              />
            </div>
            {inputValue ? (
              <motion.button
                className="p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSendMessage(inputValue)}
              >
                <svg className="w-6 h-6 text-[#54656F]" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            ) : (
              <motion.button
                className="p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleRecording}
              >
                <svg className="w-6 h-6 text-[#54656F]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 14C13.1046 14 14 13.1046 14 12V6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6V12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 18V21M12 21H15M12 21H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            )}
          </div>
        )}
      </div>

     
    </div>
  )
}