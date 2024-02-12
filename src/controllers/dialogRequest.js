require("dotenv").config();
const { OpenAI } = require("openai");
const axios = require("axios");
const max_tokens = 70;

const info = require("../utils/info.js");
const prompt = (question) => {
  return `analiza la siguiente información: ${info} y responde a esta pregunta ${question}.
  
  Ten en cuenta que la pregunta está destinada al dueño de la información, si no puedes responder contesta una de estas frases: 1)'Oye! esa es información privada!', 2) 'No creo que quieras saber eso' o 3)'Tal vez si lo preguntas de otra forma...

  Por favor, genera una respuesta en primera persona que se ajuste a las siguientes pautas:

- La respuesta en JSON válido debe contener tres propiedades: "answer", "category" y "info".
- La propiedad "answer" debe contener la respuesta en menos de 60 caracteres.
- La propiedad "category" debe indicar la categoría que mejor se ajuste a la pregunte de entre estas opciones ["personal", "professional", "academic"].
- La propiedad "info" debe proporcionar una descripción detallada y ampliada de la respuesta.`;
};

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const dialogRequest = async (req, res) => {
  try {
    const { question } = req.body;

    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt(question),
      max_tokens: 200,
    });
    console.log(completion.choices[0].text);
    const answer = JSON.parse(completion.choices[0].text);
    res.json({ ...answer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = dialogRequest;
