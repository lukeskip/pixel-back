require("dotenv").config();
const { OpenAI } = require("openai");
const axios = require("axios");

const info = require("../utils/info.js");
const prompt = (question) => {
  return `de la siguiente información ${info}, responde a esta pregunta ${question} contesta en primera persona y en menos de 60 caracteres.
  
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
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "eres Sergio 'Cheko' García un desarrollador web muy creativo",
        },
        { role: "user", content: prompt(question) },
      ],
      model: "gpt-3.5-turbo",
    });
    res.json({ answer: completion.choices[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = dialogRequest;
