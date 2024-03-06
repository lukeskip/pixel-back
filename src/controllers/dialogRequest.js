require("dotenv").config();
const { OpenAI } = require("openai");
const axios = require("axios");
const prompt = require("./prompt");
const max_tokens = 200;

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const dialogRequest = async (req, res) => {
  try {
    const { question, lang = "es" } = req.body;

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
          content: prompt(question, lang),
        },
      ],
      max_tokens: max_tokens,
    });

    console.log(completion.choices[0].message);

    const answer = [];
    const cleaned = completion.choices[0].message.content.replace(/\n/g, "");
    jsonResponse = JSON.parse(cleaned);
    let category = jsonResponse.category;
    const words = jsonResponse.answer.split(" ");
    let tempPhrase = "";
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
