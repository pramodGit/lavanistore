import AIProvider from "./AIProvider.js";
import { ai } from "./gemini.js";

import settings from "../settings.js";
import { getGeminiTools } from "../toolHelpers.js";
import { AppError, AI_ERRORS } from "../../errors/AppError.js";
import { customerPrompt } from "../prompts/index.js";
import ToolExecutor from "../executors/toolExecutor.js";
import Planner from "../planner/planner.js";

export default class GeminiProvider extends AIProvider {

  async chat(history, context) {

    try {

      const contents = [...history];

      const planner = new Planner();
      const toolExecutor = new ToolExecutor();

      let currentResponse = await ai.models.generateContent({
        model: settings.model.gemini,
        contents,
        config: {
          systemInstruction: customerPrompt,
          tools: getGeminiTools(),
          temperature: settings.temperature,
          maxOutputTokens: settings.maxOutputTokens,
        },
      });

      while (true) {

        const plan = await planner.shouldContinue(currentResponse);

        if (plan.type === "answer") {

          contents.push({
            role: "model",
            parts: [
              {
                text: plan.message,
              },
            ],
          });

          return {
            reply: plan.message,
            history: contents,
            context,
          };

        }

        const toolResponse = await toolExecutor.execute(
          {
            name: plan.tool,
            args: plan.args,
          },
          context
        );

        contents.push({
          role: "model",
          parts: [
            {
              functionCall: {
                name: toolResponse.name,
                args: toolResponse.args,
              },
            },
          ],
        });

        contents.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name: toolResponse.name,
                response: toolResponse.result,
              },
            },
          ],
        });

        currentResponse = await ai.models.generateContent({
          model: settings.model.gemini,
          contents,
          config: {
            systemInstruction: customerPrompt,
            tools: getGeminiTools(),
            temperature: settings.temperature,
            maxOutputTokens: settings.maxOutputTokens,
          },
        });

      }

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