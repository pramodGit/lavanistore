// backend/ai/sync/knowledgeSyncService.js

import IndexBuilder from "../rag/indexBuilder.js";
import Retriever from "../rag/retriever.js";

export default class KnowledgeSyncService {

  constructor() {

    this.indexBuilder = new IndexBuilder();
    this.retriever = new Retriever();

  }

  async sync() {

    await this.indexBuilder.build();

    await this.retriever.reload();

  }

}