// backend/ai/reflection/reflectionExecutor.js

import reflectionPrompt from "./reflectionPrompt.js";

export default class ReflectionExecutor {

  constructor(provider) {
    this.provider = provider;
  }

  async execute(reply) {

    const response = await this.provider.generate([
      {
        role: "user",
        parts: [
          {
            text: `
                ${reflectionPrompt}

                AI Response:

                ${reply}
            `,
          },
        ],
      },
    ]);

    return response.text;

  }

}