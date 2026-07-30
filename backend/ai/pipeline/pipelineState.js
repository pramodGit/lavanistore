// backend/ai/pipeline/pipelineState.js

export default class PipelineState {

  constructor({
    history,
    context,
    provider,
  }) {

    this.history = [...history];
    this.context = context;
    this.provider = provider;

    this.response = null;
    this.plan = null;
    this.tool = null;
    this.reply = null;

    this.toolExecuted = false;

    this.retry = null;
    this.done = false;

    this.knowledge = [];

  }

}