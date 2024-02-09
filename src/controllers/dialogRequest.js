require("dotenv").config();
const { OpenAI } = require("openai");
const axios = require("axios");
const max_tokens = 70;

const info = require("../utils/info.js");
const prompt = (question) => {
  return `analiza la siguiente información: ${info} y responde a esta pregunta ${question}. Contesta en primera persona y en menos de ${max_tokens} caracteres.
  
  Ten en cuenta que la pregunta está destinada al dueño de la información, si no puedes responder contesta una de estas frases: 1)'Oye! esa es información privada!', 2) 'No creo que quieras saber eso' o 3)'Tal vez si lo preguntas de otra forma...
  `;
};

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const dialogRequest = async (req, res) => {
  try {
    const { question } = req.body;
    console.log(prompt(question));
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: prompt(question),
      max_tokens: max_tokens,
    });
    res.json({ answer: completion.choices[0].text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = dialogRequest;
