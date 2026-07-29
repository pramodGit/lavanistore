// backend/ai/pipeline/stages/generateStage.js

import PipelineStage from "../pipelineStage.js";
import RetryExecutor from "../../retry/retryExecutor.js";
import settings from "../../settings.js";

import RAGService from "../../rag/RAGService.js";
import PromptBuilder from "../../rag/PromptBuilder.js";

export default class GenerateStage extends PipelineStage {

  constructor(provider) {

    super();

    this.name = "generate";

    this.provider = provider;

    this.retryExecutor = new RetryExecutor();

    this.rag = new RAGService();

    this.promptBuilder = new PromptBuilder();

    this.initialized = false;

  }

  async initialize() {

    if (this.initialized) {
      return;
    }

    await this.rag.initialize();

    this.initialized = true;

  }

  async execute(state) {

    await this.initialize();

    // Latest user message
    const question =
      state.history.at(-1).parts[0].text;

    // Retrieve documents
    const documents =
      await this.rag.retrieve(question);

    // Build prompt
    const prompt =
      this.promptBuilder.build({

        question,

        documents,

        history: state.history,

        context: state.context,

      });

    if (!settings.retry.enabled) {

      state.response =
        await this.provider.generate(
          prompt
        );

    } else {

      const response =
        await this.retryExecutor.execute(
          () => this.provider.generate(prompt),
          settings.retry.retries
        );

      state.response = response.result;

      state.retry = response.retry;

    }

    return {

      state,

      next: "planner",

    };

  }

}