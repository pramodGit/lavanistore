import KnowledgeSource from "./KnowledgeSource.js";
import Retriever from "../../rag/retriever.js";

export default class VectorKnowledgeSource
  extends KnowledgeSource {

  constructor() {

    super();

    this.retriever = new Retriever();

  }

  async initialize() {

    await this.retriever.load();

  }

  async search(query, options = {}) {

    return this.retriever.search(

      query,

      options.k || 5

    );

  }

}