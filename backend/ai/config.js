export default {

  provider: process.env.AI_PROVIDER || "gemini",

  gemini: {
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  },

  openai: {
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
  },

};