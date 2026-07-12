import config from "./config.js";

export default {

  provider: config.provider,

  model: {
    gemini: config.gemini.model,
    openai: config.openai.model,
  },

  temperature: Number(process.env.AI_TEMPERATURE ?? 0.2),

  maxOutputTokens: Number(process.env.AI_MAX_OUTPUT_TOKENS ?? 2048),

};