const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Reemplaza 'TOKEN' con tu token de acceso del bot obtenido de BotFather
const token = '';

// Reemplaza 'OPENAI_API_KEY' con tu clave de API de OpenAI
const openaiApiKey = '';

// Crea una nueva instancia del bot
const bot = new TelegramBot(token, { polling: true });

// Maneja el evento de mensaje recibido
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;
  
    try {
      // Genera una respuesta utilizando la API de OpenAI, proporcionando la información del vendedor
      const response = await generateOpenAIResponse(message, 'vendedor', {
        cotizacion: 500,  // Ejemplo de cotización (puedes ajustarlo según tus necesidades)
        producto: 'Desarrollo de Software a medida, plugins o themes de wordpress, app ionic, angular, spring boot rest api.',  // Ejemplo de producto ofrecido
      });
  
      console.log(response);

      // Envía la respuesta generada por OpenAI al chat
      bot.sendMessage(chatId, response);
    } catch (error) {
      console.error('Error al generar la respuesta de OpenAI:', error);
      bot.sendMessage(chatId, 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
    }
  });
  
  // Función para generar una respuesta utilizando la API de OpenAI, con información del vendedor
async function generateOpenAIResponse(message, role, sellerInfo) {
    const apiUrl = 'https://api.openai.com/v1/completions';
  
    // Concatena la información del vendedor al mensaje para OpenAI
    const prompt = `${role}:\nCotización: $${sellerInfo.cotizacion}\nProducto: ${sellerInfo.producto}\n\n${message}`;
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Organization': 'org-i8we3D9LIqf2uoWkXKd7iQoi'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        prompt: prompt,
        max_tokens: 50,  // El número de tokens que deseas generar en la respuesta
      }),
    });
    
    const data = await response.json();
    
    console.log(data);

    if(!data.error){
        const generatedText = data.choices[0].text.trim();
        return generatedText;
    }

    return null;
    
  }
  