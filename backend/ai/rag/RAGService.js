import KnowledgeService from "../knowledge/KnowledgeService.js";

export default class RAGService {

  constructor() {

    this.knowledge = new KnowledgeService();

  }

  register(source) {

    this.knowledge.register(source);

  }

  async retrieve(query, options = {}) {

    const documents = await this.knowledge.search(
      query,
      options
    );

    return documents;

  }

  async buildContext(query, options = {}) {

    const documents = await this.retrieve(
      query,
      options
    );

    if (!documents.length) {
      return "";
    }

    return documents
      .map((doc, index) => {
        return `[${index + 1}] ${doc.content}`;
      })
      .join("\n\n");

  }

}