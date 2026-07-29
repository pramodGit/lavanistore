// backend/ai/rag/RAGService.js

import KnowledgeService from "../knowledge/knowledgeService.js";
import VectorKnowledgeSource from "../knowledge/sources/VectorKnowledgeSource.js";

import PromptBuilder from "./promptBuilder.js";

import GeminiProvider from "../providers/GeminiProvider.js";

export default class RAGService {

  constructor() {

    this.knowledge = new KnowledgeService();

    this.promptBuilder = new PromptBuilder();

    this.llm = new GeminiProvider();

  }

  async initialize() {

    const vectorSource =
      new VectorKnowledgeSource();

    await vectorSource.initialize();

    this.knowledge.addSource(
      vectorSource
    );

  }

  async retrieve(query, options = {}) {

    return await this.knowledge.search(
      query,
      options
    );

  }

  async ask(question, options = {}) {

    const documents = await this.retrieve(
      question,
      options
    );

    const prompt = this.promptBuilder.build({
      question,
      documents,
    });

    const response = await this.llm.generate(
      prompt
    );

    return {
      answer: response.text,
      documents,
    };

  }

}