// backend/ai/providers/GeminiProvider.js

import AIProvider from "./AIProvider.js";
import { ai } from "./gemini.js";

import settings from "../settings.js";
import { getGeminiTools } from "../toolHelpers.js";
import { AppError, AI_ERRORS } from "../../errors/AppError.js";
import { customerPrompt } from "../prompts/index.js";

export default class GeminiProvider extends AIProvider {

  async generate(contents) {

    try {

      return await ai.models.generateContent({
        model: settings.model.gemini,
        contents,
        config: {
          systemInstruction: customerPrompt,
          tools: getGeminiTools(),
          temperature: settings.temperature,
          maxOutputTokens: settings.maxOutputTokens,
        },
      });

    } catch (err) {

      if (
        err?.status === 429 ||
        err?.message?.includes("RESOURCE_EXHAUSTED") ||
        err?.message?.includes("Quota exceeded")
      ) {
        throw new AppError(AI_ERRORS.QUOTA_EXCEEDED, 429);
      }

      if (err?.status === 401) {
        throw new AppError(
          "AI provider authentication failed.",
          500
        );
      }

      if (err?.status === 400) {
        throw new AppError(
          "Invalid AI request.",
          400
        );
      }

      throw err;

    }

  }

}