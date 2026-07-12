import AIProvider from "./AIProvider.js";
// import { openai } from "./openai.js";
import { AppError } from "../../errors/AppError.js";

export default class OpenAIProvider extends AIProvider {

  async chat(history, context) {

    try {

      throw new AppError(
        "OpenAI implementation is under development.",
        501
      );

    } catch (err) {

      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(
        "OpenAI provider failed.",
        500
      );

    }

  }

}