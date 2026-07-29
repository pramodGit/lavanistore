// backend/ai/knowledge/knowledgeService.js

export default class KnowledgeService {

  constructor() {

    this.sources = [];

  }

  addSource(source) {

    this.sources.push(source);

  }

  async search(query, options = {}) {

    const results = [];

    for (const source of this.sources) {

      const documents = await source.search(
        query,
        options
      );

      results.push(...documents);

    }

    return results;

  }

}