require("dotenv").config();
const { OpenAI } = require("openai");
const axios = require("axios");
const max_tokens = 200;

const info = require("../utils/info.js");
const prompt = (question) => {
  return `Analiza la siguiente información: ${info} y responde como si fueras un programador y solo pudieras responder con código sin ninguna explicación: ${question}

tu respuesta debe ser un JSON válido con  2 propiedades:

  -answer: aquí va la respuesta a la pregunta en texto plano en primera persona tener menos de ${max_tokens} caracteres en total e incluir 1 emoji
  -category: categoría que mejor se acomode de las siguientes "personal","profesional","academic"
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
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt(question),
        },
      ],
      max_tokens: max_tokens,
    });

    console.log(completion.choices[0].message);

    const answer = [];
    const cleaned = completion.choices[0].message.content.replace(/\n/g, "");
    jsonResponse = JSON.parse(cleaned);
    const words = jsonResponse.answer.split(" ");
    let tempPhrase = "";
    let category = jsonResponse.category;
    for (const word of words) {
      if ((tempPhrase + word).length <= 70) {
        tempPhrase += (tempPhrase ? " " : "") + word;
      } else {
        answer.push(tempPhrase);
        tempPhrase = word;
      }
    }

    if (tempPhrase) {
      answer.push(tempPhrase);
    }
    res.json({ answer, category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "chat-gpt error" });
  }
};

module.exports = dialogRequest;
