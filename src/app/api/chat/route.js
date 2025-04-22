import { NextResponse } from 'next/server';

const CV_INFO = `Mi nombre es David Badell, soy un desarrollador Full Stack con experiencia en React, Next.js, Node.js, y bases de datos SQL y NoSQL. Me especializo en crear aplicaciones web modernas y eficientes. Puedes contactarme en davidbadelljose5@gmail.com o en mi LinkedIn: linkedin.com/in/david-badell`;

const CONTACT_MESSAGE = "Has enviado 3 mensajes. Si quieres seguir la conversación, por favor contáctame directamente a través de davidbadelljose5@gmail.com o LinkedIn: linkedin.com/in/david-badell";

async function POST(req) {
  try {
    console.log('Iniciando solicitud...');
    const { message, messageCount } = await req.json();
    console.log('Mensaje recibido:', message);
    console.log('Contador de mensajes:', messageCount);

    // Verificar si se han enviado 3 mensajes
    if (messageCount >= 3) {
      return NextResponse.json({ message: CONTACT_MESSAGE });
    }

    console.log('API Key presente:', !!process.env.DEEPSEEK_API_KEY);
    
    const apiUrl = 'https://api.deepseek.com/chat/completions';
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    console.log('Enviando solicitud a:', apiUrl);
    
    const requestBody = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `${CV_INFO}\nResponde como si fueras David Badell. Sé profesional pero amigable. Mantén las respuestas concisas y relevantes.`
        },
        {
          role: "user",
          content: message
        }
      ],
      stream: false,
      max_tokens: 500,
      temperature: 0.7
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error de la API:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(`HTTP error! status: ${response.status}, data: ${errorData}`);
    }

    const data = await response.json();
    console.log('Respuesta exitosa:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Formato de respuesta inválido: ' + JSON.stringify(data));
    }
    
    return NextResponse.json({ 
      message: data.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error detallado:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: 'Lo siento, ha ocurrido un error al procesar tu mensaje.',
        details: {
          message: error.message
        }
      },
      { status: 500 }
    );
  }
}

export { POST }; 