// backend/ai/chatService.js

import { ai } from "./providers/gemini.js";
import { getGeminiTools, getTool } from "./toolHelpers.js";

export async function chat(messages) {

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: m.text,
      },
    ],
  }));
  // 1. Ask Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      tools: getGeminiTools(),
    },
  });

  // Optional: Debug
  console.log(JSON.stringify(response, null, 2));

  // 2. Check whether Gemini wants to call a tool
  const candidate = response.candidates?.[0];
  const part = candidate?.content?.parts?.[0];

  if (part?.functionCall) {
    const { name, args } = part.functionCall;

    console.log("🔧 Tool Requested:", name);
    console.log("📥 Arguments:", args);

    const tool = getTool(name);

    if (!tool) {
      throw new Error(`Tool '${name}' not found.`);
    }

    // 3. Execute the tool
    const toolResult = await tool.execute(args);

    console.log("📤 Tool Result:", toolResult);

    // Temporary response (next step will send this back to Gemini)
    // return {
    //   success: true,
    //   tool: name,
    //   data: toolResult,
    // };

    const finalResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        ...contents,
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name,
                args,
              },
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              functionResponse: {
                name,
                response: toolResult,
              },
            },
          ],
        },
      ],
    });

    return {
      success: true,
      reply: finalResponse.text
    };
  }

  // 4. Normal AI response (no tool required)
  return {
    success: true,
    reply: response.text,
  };
}