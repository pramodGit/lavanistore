import { ai } from "./providers/gemini.js";
import { getGeminiTools, getTool } from "./toolHelpers.js";

import {
  getConversation,
  saveConversation,
} from "./memory/conversationStore.js";

export async function chat(conversationId, message) {

  // Load previous conversation
  const history = await getConversation(conversationId);

  // Add latest user message
  history.push({
    role: "user",
    text: message,
  });

  // Convert to Gemini format
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: m.text,
      },
    ],
  }));

  // Ask Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      tools: getGeminiTools(),
    },
  });

  const candidate = response.candidates?.[0];
  const part = candidate?.content?.parts?.[0];

  let reply = response.text;

  // -------------------------
  // Tool Calling
  // -------------------------

  if (part?.functionCall) {

    const { name, args } = part.functionCall;

    console.log("🔧 Tool Requested:", name);
    console.log("📥 Arguments:", args);

    const tool = getTool(name);

    if (!tool) {
      throw new Error(`Tool '${name}' not found.`);
    }

    const toolResult = await tool.execute(args);

    console.log("📤 Tool Result:", toolResult);

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
                response: {
                  result: toolResult,
                },
              },
            },
          ],
        },
      ],
      config: {
        tools: getGeminiTools(),
      },
    });

    reply = finalResponse.text;
  }

  // Save assistant reply into memory

  history.push({
    role: "assistant",
    text: reply,
  });

  await saveConversation(conversationId, history);

  return {
    reply,
  };
}