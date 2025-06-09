import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY, // api key from .env
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userInput, context } = req.body; // pull user input and context from the request body

    if (!userInput) {
      return res.status(400).json({ error: "User input is required" });
    }

    try {
      // openai api call
      const response = await client.chat.completions.create({
        model: "gpt-4o", // gpt-4o (reasoning) model 
        messages: [
          {
            role: "system",
            content: `You are a compassionate journaling assistant. Your goal is to respond to user input with warmth, humanity, and relevance. Your responses should feel like a natural, realistic interaction with a kind friend or mentor. Keep your responses concise, conversational, and grounded. Avoid overly dramatic or poetic language. Focus on offering practical encouragement, relatable insights, or a small empathetic narrative that resonates with the user's experience.`,
          },
          {
            role: "user",
            content: `Here is the context for consistency:\n\n${context}\n\nNow, generate a response to the following input in a conversational and realistic tone. Keep it concise and grounded, as if you're a kind friend or mentor offering practical encouragement or relatable insights:\n\n${userInput}`,
          },
        ],
      });

      const generatedResponse = response.choices[0].message.content.trim();

      // return the generated response to the frontend
      res.status(200).json({ response: generatedResponse });
    } catch (error) {
      console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Error generating response" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}