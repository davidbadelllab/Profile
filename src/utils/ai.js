export async function getAIResponse(userMessage, cvContent) {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-7ecadf2adb9a4a97b241da8904301df5`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Eres David Badell. Responde basándote en la siguiente información de tu CV:\n${cvContent}`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error al obtener respuesta de la IA:', error);
    return "Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentarlo de nuevo?";
  }
} 