import { OpenAI } from "openai";

const client = new OpenAI({
  // pulls api key from .env 
  apiKey: process.env.OPEN_AI_KEY, 
});

// handler for form response
export default async function handler(req, res) {
  if (req.method === "POST") { // exposes request from front-end
    const { userInput } = req.body; // pull specifically the text of the response

    if (!userInput) { // prepares response - stop process if no input
      return res.status(400).json({ error: "User input is required" });
    }

    try {

      // try to start openai processes
      const stream = await client.chat.completions.create({
        model: "gpt-4.1", // some model
        messages: [ 
          { // context for AI perspeective
            role: "system",
            content: "You are a helpful assistant.",
          },
          { // context for how to respond to user's prompt
            role: "user",
            content: `Please summarize the following input:\n\n${userInput}`,
          },
        ], // *Future* streaming
        stream: true,
      });

      let generatedResponse = "";

      // Collect the streamed response - snippet from openAI 
      for await (const event of stream) {
        if (event.choices && event.choices[0].delta && event.choices[0].delta.content) {
          generatedResponse += event.choices[0].delta.content;
        }
      }

      //successful response
      res.status(200).json({ response: generatedResponse }); 
      console.log("Generated Response:", generatedResponse);
    } catch (error) { // error with response(?)
      console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Error generating response" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }

}