import AIProvider from "./AIProvider.js";
import { ai } from "./gemini.js";

import { getGeminiTools, getTool } from "../toolHelpers.js";
import { AppError, AI_ERRORS } from "../../errors/AppError.js";

export default class GeminiProvider extends AIProvider {

  async chat(history) {

    try {

      // Clone history so we can append messages
      const contents = [...history];

      // First Gemini call
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          tools: getGeminiTools(),
        },
      });

      const candidate = response.candidates?.[0];
      const part = candidate?.content?.parts?.[0];

      // -----------------------------
      // Normal AI response (no tool)
      // -----------------------------
      if (!part?.functionCall) {

        contents.push({
          role: "model",
          parts: [
            {
              text: response.text,
            },
          ],
        });

        return {
          reply: response.text,
          history: contents,
        };
      }

      // -----------------------------
      // Tool Calling
      // -----------------------------
      const { name, args } = part.functionCall;

      console.log("🔧 Tool Requested:", name);
      console.log("📥 Arguments:", args);

      const tool = getTool(name);

      if (!tool) {
        throw new AppError(`Tool '${name}' not found.`, 500);
      }

      const toolResult = await tool.execute(args);

      console.log("📤 Tool Result:", toolResult);

      // Save function call
      contents.push({
        role: "model",
        parts: [
          {
            functionCall: {
              name,
              args,
            },
          },
        ],
      });

      // Save function response
      contents.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name,
              response: toolResult,
            },
          },
        ],
      });

      // Second Gemini call
      const finalResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      // Save assistant response
      contents.push({
        role: "model",
        parts: [
          {
            text: finalResponse.text,
          },
        ],
      });

      return {
        reply: finalResponse.text,
        history: contents,
      };

    } catch (err) {

      // Gemini quota exceeded
      if (
        err?.status === 429 ||
        err?.message?.includes("RESOURCE_EXHAUSTED") ||
        err?.message?.includes("Quota exceeded")
      ) {
        throw new AppError(AI_ERRORS.QUOTA_EXCEEDED, 429);
      }

      // Invalid API key
      if (err?.status === 401) {
        throw new AppError(
          "AI provider authentication failed.",
          500
        );
      }

      // Invalid request
      if (err?.status === 400) {
        throw new AppError(
          "Invalid AI request.",
          400
        );
      }

      // Unknown error
      throw err;
    }
  }

}