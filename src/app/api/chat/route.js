import { NextResponse } from 'next/server';

const CV_INFO = `Mi nombre es David Badell, soy un desarrollador Full Stack con experiencia en Laravel, React (Native, JS, "TS"), Next.js, Node.js, Python, y bases de datos SQL y NoSQL. Me especializo en crear aplicaciones web modernas y eficientes. Puedes contactarme en davidbadelljose5@gmail.com o en mi LinkedIn: linkedin.com/in/david-badell`;

const CONTACT_MESSAGE = "Has enviado 3 mensajes. Si quieres seguir la conversación, por favor contáctame directamente a través de davidbadelljose5@gmail.com o LinkedIn: linkedin.com/in/david-badell";

// Cache expandido para respuestas comunes
const COMMON_RESPONSES = {
  "hola": "¡Hola! Soy David Badell, ¿en qué puedo ayudarte hoy?",
  "quien eres": CV_INFO,
  "contacto": "Puedes contactarme en davidbadelljose5@gmail.com o LinkedIn: linkedin.com/in/david-badell",
  "experiencia": "Tengo más de 7 años de experiencia en desarrollo web, especializándome en React, Next.js y Node.js.",
  "tecnologias": "Trabajo principalmente con React, Next.js, Node.js, TypeScript, y bases de datos como MongoDB y PostgreSQL.",
  "proyectos": "He trabajado en diversos proyectos web, desde aplicaciones empresariales hasta sitios de comercio electrónico.",
  "habilidades": "Mis principales habilidades incluyen desarrollo frontend con React y Next.js, backend con Node.js, y bases de datos SQL/NoSQL.",
  "email": "Puedes contactarme en davidbadelljose5@gmail.com",
  "linkedin": "Mi perfil de LinkedIn es: linkedin.com/in/david-badell",
  "stack": "Mi stack tecnológico principal incluye React, Next.js, Node.js, TypeScript, y bases de datos SQL/NoSQL."
};

async function POST(req) {
  try {
    const { message, messageCount } = await req.json();

    // Verificar límite de mensajes
    if (messageCount >= 3) {
      return NextResponse.json({ message: CONTACT_MESSAGE });
    }

    // Buscar en caché primero
    const normalizedMessage = message.toLowerCase().trim();
    for (const [key, response] of Object.entries(COMMON_RESPONSES)) {
      if (normalizedMessage.includes(key)) {
        return NextResponse.json({ message: response });
      }
    }

    const apiUrl = 'https://api.deepseek.com/chat/completions';
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    const requestBody = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `${CV_INFO}\nResponde como David Badell. Sé conciso y directo.`
        },
        {
          role: "user",
          content: message
        }
      ],
      stream: false,
      max_tokens: 250, // Reducido para respuestas más rápidas
      temperature: 0.5, // Reducido para respuestas más consistentes
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    };

    // Timeout reducido a 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({ 
        message: data.choices[0].message.content 
      });

    } catch (error) {
      // Si hay error en la API, usar respuesta alternativa
      return NextResponse.json({
        message: "Disculpa, estoy procesando muchas consultas. Por favor, escribe tu pregunta de forma más específica o contáctame directamente en davidbadelljose5@gmail.com"
      });
    }

  } catch (error) {
    return NextResponse.json(
      { message: "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo." },
      { status: 500 }
    );
  }
}

export { POST };
