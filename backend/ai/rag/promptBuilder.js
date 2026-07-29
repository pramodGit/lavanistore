// backend/ai/rag/PromptBuilder.js

export default class PromptBuilder {

  build({
    question,
    documents = [],
    history = [],
    memory = [],
    context = {},
  }) {

    const knowledge = documents
      .map(
        (doc, index) => `### Document ${index + 1}
Source: ${doc.source}

${doc.text}`
      )
      .join("\n\n------------------------\n\n");

    const conversation = history
      .map((message) => {

        const text =
          message.parts?.[0]?.text || "";

        return `${message.role.toUpperCase()}:
${text}`;

      })
      .join("\n\n");

    return `You are Lavani Store AI Assistant.

You must answer ONLY using the information provided in the CONTEXT section.

Rules:
- Do not make up information.
- If the answer is not available, reply:
  "I couldn't find that information in our knowledge base."
- Keep answers concise.
- Mention the source if appropriate.

=========================
CONTEXT
=========================

${knowledge}

=========================
CONVERSATION
=========================

${conversation}

=========================
QUESTION
=========================

${question}

=========================
ANSWER
=========================`;

  }

}