require("dotenv").config();
const { OpenAI } = require("openai");
const axios = require("axios");
const max_tokens = 200;

const info = require("../utils/info.js");
const prompt = (question) => {
  return `Analiza la siguiente información: ${info} y responde a esta pregunta en primera persona: ${question}
- Tu respuesta debe tener menos de ${max_tokens} caracteres en total.`;
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
      max_tokens: max_tokens,
    });

    console.log(completion);
    const answer = [];
    const cleaned = completion.choices[0].text.replace(/\n/g, "");
    console.log(cleaned);
    const words = cleaned.split(" ");
    let tempPhrase = "";
    let category = "nada";
    for (const word of words) {
      if (word === words[words.length - 1]) {
        console.log("la categoría es:", word);
        category = word.toLowerCase;
      } else {
        if ((tempPhrase + word).length <= 70) {
          tempPhrase += (tempPhrase ? " " : "") + word;
        } else {
          answer.push(tempPhrase);
          tempPhrase = word;
        }
      }
    }

    if (tempPhrase) {
      answer.push(tempPhrase);
    }
    res.json({ answer, category: "hola" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "chat-gpt error" });
  }
};

module.exports = dialogRequest;
